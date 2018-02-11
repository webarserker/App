var mysql = require('mysql');
var config = require('../../config.js');
var util = require('./index.js');
var db = {};

// 对输出结果进行格式化
var responseFormat = util.responseFormat;
// 打印debug信息
var debug = util.log;
//
var assign = Object.assign;

const defaults = {
	// 默认分页大小
	pageSize: 20
}

//----------------------------------------------------
// 私有函数
//----------------------------------------------------

// 获取分页信息
function _getPageInfoByParams(params) {

	var page = parseInt(params.page || '1', 10);
	var size = parseInt(params.size || defaults.pageSize || '20', 10);

	return {
		page: page,
		size: size
	};
};

// 通过读取params中的page和size参数生成sql中的limit语句
function _getLimitStringByParams(params) {

	var pager = _getPageInfoByParams(params);
	var start = (pager.page - 1) * pager.size;

	return ' LIMIT ' + start + ',' + pager.size;
};

// 把第二个数组的元素合并到第一个数组中（会改变第一个数组）
function mergeArray(dest, src){
	dest.splice.apply(dest, [dest.length, 0].concat(src));
};

// 把字段名和字段值转换为where字符串数组和value数组
function field2StringsAndValues(name, value){

	var strs = [], 
		values = [], 
		opType = '', 
		valType = typeof value,
		// 支持的比较符
		opTypes = [
			'<=>', '>=', '<=', '<>', '!=', '=', '>', '<', 'between', 'regexp', 'like', 'is', 'in'
		];

	// undefined和null跳过
	if (valType === 'undefined' || value == null || value === '') {
		return;
	};

	// 运算符处理
	if (valType === 'string') {

		// 匹配运算符
		opTypes.forEach(function(op) {
			var reg;
			//
			if (opType) return;
			// 如果运算符是一个普通单词（以\w结尾）
			// 则，在后面加一个空格
			op = op.replace(/\w$/, function($1){
				return $1 + ' ';
			});
			//
			reg = new RegExp('^' + op, 'i');
			//
			if (value.match(reg)) {
				value = value.replace(reg, '');
				opType = op.replace(/\s+$/, '');

				// like 运算符
				if(opType === 'like'){
					value = value + '%';
					return;
				};

				// 其它运算符
				// 过滤了运算符后，还需进行类型处理
				if (value && !isNaN(value)) {
					value = parseFloat(value, 10);
					valType = 'number';
				};
			};
		});

	};

	// 默认运算符
	if (!opType) {
		opType = '=';
	};

	if(opType === 'between'){
		// between 两个参数

		value = value.replace(/^\s+|\s+$/g, '').split(/\s*AND\s*/i);

		if(value.length < 2){
			throw '数据库查询语句错误';
		};

		// 如果可转为数值型，就转为数值型
		if (!isNaN(value[0]) && !isNaN(value[1])) {
			value[0] = parseFloat(value[0], 10);
			value[1] = parseFloat(value[1], 10);
		};

		// 加入查询条件
		strs.push('?? ' + opType + ' ? AND ?');
		values.push(name);
		values.push(value[0]);
		values.push(value[1]);

	}else{
		// 只有一个参数的情况

		// tb.field 变成 `tb`.`field`
		if (valType === 'string') {
			if (value.match(/\./)) {
				value = value.split('.');
				value = '`' + value.join('`.`') + '`';
			};
			// 如果是空白字符串，跳过
			value = value.replace(/^\s+|\s+$/, '');
			if (value === '') {
				return;
			}
		};

		// 加入查询条件
		strs.push('?? ' + opType + ' ?');
		values.push(name);
		values.push(value);
	};

	return {
		strs: strs,
		vals: values
	};

};

//----------------------------------------------------
// 数据库连接和查询
//----------------------------------------------------

// 支持多条sql查询
config.database.multipleStatements = true;

// 创建并打开一个数据库连接，执行回调方法然后关闭连接
db.connection = function(callback) {
	var conn = mysql.createConnection(config.database);
	conn.connect();
	callback.call(this, conn);
	conn.end();
};

// sql 格式化
db.sqlFormat = function(sql, values) {

	// sql必须格式化
	sql = mysql.format(sql, values);

	// '`tb`.`field`' 还原成 `tb`.`field`
	sql = sql.replace(/\'\`/igm, '`').replace(/\`\'/gm, '`');

	// %20 还原成空格
	sql = sql.replace(/\%20/igm, ' ');

	debug('----');
	debug(sql);
	debug('----');

	return sql;
};

// 拼接where字符串
db.where = function(where, values){

	// 查询条件拼接
	var strs = [],
		name,
		value,
		field,
		fieldStrs;

	// where 条件
	if (typeof where === 'object') {

		// 遍历object
		for (name in where)
			if (where.hasOwnProperty(name)) {

				value = where[name];
				fieldStrs = [];

				if(!Array.isArray(value)){
					value = [value];
				};

				value.forEach(function(val, index){
					field = field2StringsAndValues(name, val);
					if(!field) return;
					mergeArray(fieldStrs, field.strs);
					mergeArray(values, field.vals);
				});

				if(fieldStrs.length){
					strs.push('(' + fieldStrs.join(' OR ') + ')');
				};
			};

		// 拼接
		where = strs.join(' and ');
	};

	return where;
};

// 进行数据库查询操作
db.query = function(sql, values, callback) {

	var opt = {};

	if (typeof sql === 'object') {
		opt = sql;
	} else {
		opt = {
			sql: sql,
			values: values || [],
			callback: callback || function() {}
		};
	};

	opt.sql = this.sqlFormat(opt.sql, opt.values);

	// 不使用连接池
	this.connection(function(conn) {
		conn.query(opt.sql, [], function(err) {
			var args = arguments;
			if(err){
				console.log('执行以下SQL时执行发生了错误：');
				console.log(opt.sql);
				console.info(err);
			};

			// 为了更好的防范SQL注入攻击：
			// 若非debug模式，不返回具体的SQL错误信息
			if(err && !config.debug){
				args[0] = { code: '查询失败' };
			};

			// 执行回调
			if(config.debug){
				callback.apply(this, args);
			}else{
				try{
					callback.apply(this, args);
				}catch(e){
					log(e);
				};
			};
		}.bind(this));
	}.bind(this));
};

// 批量插入
db.batInsert = function(table, values, callback) {
	var head,
		sql = 'INSERT INTO ' + table,
		cols = [],
		vals = [];
	//
	if (!Array.isArray(values)) {
		values = [values];
	};

	// get cols
	head = values[0];
	for (var n in head)
		if (head.hasOwnProperty(n)) {
			cols.push(n);
		};

	sql += '(' + cols.join(', ') + ') VALUES';

	// 把values拼进sqls中
	values.forEach(function(val, index) {
		var fields = [];

		if (!val) {
			return;
		};

		cols.forEach(function(col) {
			var val = this[col];
			if (typeof val === 'string') {
				val = "'" + val + "'";
			};
			fields.push(val);
		}.bind(val));

		vals.push('(' + fields.join(', ') + ')');

	}.bind(this));

	sql += vals.join(', ');

	//
	this.batQuery(sql, [], callback);
};

// 批量查询
db.batQuery = function(sqls, values, callback) {
	var sqlList = [];
	var st = new Date().getTime(),
		len;

	// 开始事务
	// 把所有语句放在同一个事务当中，可以减少事务开销
	sqlList.push('START TRANSACTION');

	if (!Array.isArray(values)) {
		values = [values];
	};

	if (Array.isArray(sqls)) {

		sqls.forEach(function(sql, index) {
			var val = values[index];

			if (typeof sql !== 'string') {
				throw '参数sqls必须是字符串或字符串数组';
			};

			if (!val) return;

			sql = this.sqlFormat(sql, val);

			sqlList.push(sql);
		}.bind(this));
	} else if (typeof sqls === 'string') {
		if (values.length) {
			values.forEach(function(val, index) {
				var sql = sqls;
				if (!val) return;

				sql = this.sqlFormat(sql, val);

				sqlList.push(sql);
			}.bind(this));
		} else {
			sqlList.push(sqls);
		};
	} else {
		throw '参数sqls必须是字符串或字符串数组';
	};

	// 结束事务
	sqlList.push('COMMIT');
	len = sqlList.length - 2;

	sqlList = sqlList.join(';');

	this.query(sqlList, [], function() {
		//
		var time = new Date().getTime() - st;
		console.log('执行' + len + '条语句，耗时' + time + '毫秒，平均耗时' + parseInt(time / len * 1000) / 1000 + '毫秒');
		//
		callback.apply(this, arguments);
	}.bind(this));
};

//----------------------------------------------------
// 增、删、改、查方法封装
//----------------------------------------------------

// 查（列表带分页）
db.select = function(opt) {

	var limitStr, values = [];

	// 默认参数
	opt = assign({
		table: '',
		fields: ['*'],
		where: '',
		orderBy: '',
		success: function() {},
		error: function() {}
	}, opt);

	// 表名必须指定
	if (!opt.table) {
		throw 'opt.table is undefined';
	};

	// 分页条件
	if (opt.size) {

		opt.page = parseInt(opt.page || '1', 10);
		opt.size = parseInt(opt.size, 10);

		// 如果有分页，必须指定orderBy字段
		if (!opt.orderBy) {
			throw 'opt.orderBy is undefined';
		};

		// 分页语句
		limitStr = _getLimitStringByParams({
			page: opt.page,
			size: opt.size
		});
	};

	// where 条件
	opt.where = this.where(opt.where, values);

	// SQL语句
	opt.sql = [
		'SELECT',
		// 记录数
		opt.size ? 'SQL_CALC_FOUND_ROWS' : '',
		opt.fields,
		'FROM',
		opt.table,
		opt.on ? ('ON ' + opt.on) : '',
		opt.where ? ('WHERE ' + opt.where) : '',
		opt.orderBy ? ('ORDER BY ' + opt.orderBy) : '',
		limitStr || '',
		// 记录数
		opt.size ? ';SELECT FOUND_ROWS();' : ''
	].join(' ');

	// 查询
	this.query(opt.sql, values, function(err, data) {
		if (err) {
			opt.error(err.code);
		} else {
			opt.success(data);
		}
	}.bind(this));
};

// 查询列表
db.getRows = function(opt) {
	var send, success;

	// 如果opt中包含res，则创建默认的成功/失败处理函数
	if (opt.res && opt.res.send) {
		send = opt.res.send.bind(opt.res);
	};

	// opt.size 为0则不分页
	if (!opt.page) delete opt.page;
	if (!opt.size && opt.size !== 0) delete opt.size;

	if(typeof opt.page === 'string'){
		opt.page = parseInt(opt.page, 10);
	};
	
	if(typeof opt.size === 'string'){
		opt.size = parseInt(opt.size, 10);
	};

	// 默认参数
	opt = assign({
		// 默认分页参数
		page: 1,
		size: defaults.pageSize || 20,
		// 默认成功处理函数
		error: function error(err) {
			send && send({
				code: 1,
				message: err
			});
		}.bind(this),
		// 默认失败处理函数
		success: function(data) {
			send && send({
				code: 0,
				message: '查询成功',
				data: responseFormat(data)
			});
		}.bind(this)
	}, opt);

	// 最终success
	success = opt.success;

	// 转发success
	opt.success = function(dataset) {
		var rows, total;

		if (!opt.size) {
			// 不分页

			rows = dataset;
			success(rows);

		} else {
			// 分页

			if (!dataset || dataset.length < 2) {
				opt.error('查询失败');
				return;
			};

			rows = dataset[0];
			total = dataset[1][0]['FOUND_ROWS()'];

			success({
				size: opt.size,
				page: opt.page,
				total: Math.ceil(total / opt.size),
				totalRecord: total,
				list: rows
			});

		};

	};

	//
	this.select(opt);
};

// 查询单条数据
db.getRow = function(opt) {
	var send, success;

	// 如果opt中包含res，则创建默认的成功/失败处理函数
	if (opt.res && opt.res.send) {
		send = opt.res.send.bind(opt.res);
	};

	// 默认参数
	opt = assign({
		// 默认成功处理函数
		error: function error(err) {
			send && send({
				code: 1,
				message: err
			});
		}.bind(this),
		// 默认失败处理函数
		success: function(data) {
			send && send({
				code: 0,
				message: '查询成功',
				data: responseFormat(data)
			});
		}.bind(this)
	}, opt);

	opt.page = null;
	opt.size = null;

	// 最终success
	success = opt.success;

	// 转发success
	opt.success = function(rows) {
		var rows, total;

		if (!rows || !rows.length) {
			opt.error('没有数据');
			return;
		};

		success(rows[0]);
	};

	//
	this.select(opt);
};

/** 插入记录

用法示例：

	this.insertRow({
		res: res,
		table: 't_test',
		values: [
			{ name: 'a' },
			{ name: 'b' },
			{ name: 'c' }
		],
		success: opt.success,
		error: opt.error
	});

返回值格式：

	{
	  "code": 0,
	  "message": "添加数据成功",
	  "insertId": 10174,
	  "affectedRows": 3
	}

*/
db.insertRows = function(opt){
	var send;

	// 如果opt中包含res，则创建默认的成功/失败处理函数
	if (opt.res && opt.res.send) {
		send = opt.res.send.bind(opt.res);
	};

	// 默认参数
	opt = assign({
		values: [],
		// 默认成功处理函数
		error: function error(err) {
			send && send({
				code: 1,
				message: err
			});
		}.bind(this),
		// 默认失败处理函数
		success: function(results) {
			var result = results.length ? results[1] : {};
			send && send({
				code: 0,
				message: '添加数据成功',
				insertId: result.insertId,
				affectedRows: result.affectedRows
			});
		}.bind(this)
	}, opt);

	if(!opt.table){
		throw 'table is undefined';
	};

	if(!opt.values || !opt.values.length){
		return opt.error('没有要插入的数据');
	};

	// 插入记录
    this.batInsert(opt.table, opt.values, function(err, rows) {
        if (err) {
            opt.error(err);
        } else {
            opt.success(rows);
        }
    });
};

//
db.insertRow = function(opt){

	if(opt.value && !Array.isArray(opt.values)){
		opt.values = [opt.value];
	};

	db.insertRows(opt);
};
// ==================================================

/** 删除记录

用法示例：
	this.deleteRow({
		res: res,
		table: 't_test',
		where: {
			name: '0' 
		},
		success: opt.success,
		error: opt.error
	});

返回值格式：

成功
	{
	  "code": 0,
	  "message": "删除数据成功",
	  "affectedRows": 1
	}
失败
	{
	  "code": 1,
	  "message": "没有删除任何数据"
	}
*/
db.deleteRow = function(opt){

	var sql, values = [], send;

	// 如果opt中包含res，则创建默认的成功/失败处理函数
	if (opt.res && opt.res.send) {
		send = opt.res.send.bind(opt.res);
	};

	// 默认参数
	opt = assign({
		table: '',
		where: '',
		// 默认成功处理函数
		error: function error(err) {
			send && send({
				code: 1,
				message: err
			});
		}.bind(this),
		// 默认失败处理函数
		success: function(result) {
			if(result.affectedRows){
				send && send({
					code: 0,
					message: '删除数据成功',
					affectedRows: result.affectedRows
				});
			}else{
				send && send({
					code: 1,
					message: '没有删除任何数据'
				});
			};
		}.bind(this)
	}, opt);

	// 表名必须指定
	if (!opt.table) {
		throw 'opt.table is undefined';
	};

	// where 条件
	opt.where = this.where(opt.where, values);

	// SQL语句
	sql = [
		'DELETE',
		'FROM',
		opt.table,
		opt.where ? ('WHERE ' + opt.where) : ''
	].join(' ');

	// 查询
	this.query(sql, values, function(err, data) {
		if (err) {
			opt.error(err.code);
		} else {
			opt.success(data);
		}
	}.bind(this));
};

db.updateRow = function(opt){

	var sql, values = [], send;

	// 如果opt中包含res，则创建默认的成功/失败处理函数
	if (opt.res && opt.res.send) {
		send = opt.res.send.bind(opt.res);
	};

	// 表名必须指定
	if (!opt.table) {
		throw 'opt.table is undefined';
	};

	// value必须指定
	if(typeof opt.value !== 'object'){
		throw 'opt.value should be a object';
	}else{
		values.push(opt.value);
	};

	// 默认参数
	opt = assign({
		table: '',
		where: '',
		value: {},
		// 默认成功处理函数
		error: function error(err) {
			send && send({
				code: 1,
				message: err
			});
		}.bind(this),
		// 默认失败处理函数
		success: function(result) {
			if(result.affectedRows){
				send && send({
					code: 0,
					message: '更新数据成功',
					affectedRows: result.affectedRows
				});
			}else{
				send && send({
					code: 1,
					message: '没有更新任何数据'
				});
			};
		}.bind(this)
	}, opt);

	// where 条件
	opt.where = this.where(opt.where, values);

	// SQL语句
	sql = [
		'UPDATE',
		opt.table,
		'SET',
		'?',
		opt.where ? ('WHERE ' + opt.where) : ''
	].join(' ');

	// 查询
	this.query(sql, values, function(err, data) {
		if (err) {
			opt.error(err.code);
		} else {
			opt.success(data);
		}
	}.bind(this));
};

module.exports = db;