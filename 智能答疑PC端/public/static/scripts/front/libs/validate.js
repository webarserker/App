//需要验证的表单字段的类
function Field(params) {
	this.field = params.fid;           //要验证的字段的id
	this.validators = params.val;      //验证器对象数组
	this.on_suc = params.suc;          //当验证成功的时候执行的事件
	this.on_error = params.err;         //当验证失败的时候执行的事件
	this.checked = false;              //是否通过验证
};
Field.prototype.validate = function() {
	//循环每一个验证器
	for(var i = 0; i < this.validators.length; i++) {
		//给验证器附加验证成功和验证失败的回调事件
		this.set_callback(this.validators[i]);
		//执行验证器上的验证方法，验证是否符合验证规则
		if(!this.validators[i].validate(this.data())) {
			//一旦任意一个验证器失败就停止
			break;
		}
	}
};
Field.prototype.set_callback = function(val) {
	var self = this;
	val.on_suc = function() {
		self.checked = true;
		self.on_suc(val.tips);
	};
	val.on_error = function() {
		self.checked = false;
		self.on_error(val.tips);
	};
};
Field.prototype.data = function() {
	return $('#' + this.field).val();
};

//验证器类
//正则表达式验证器
//expression: 正则表达式
//tip: 验证提示语关键词
function Exp_val(expression, tip) {
	this.exps = expression;
	this.tips = tip;
	this.on_suc = null;
	this.on_error = null;
};
Exp_val.prototype.validate = function(fd) {
	if(!fd) {
		this.on_suc();
		return true;
	}
	if(this.exps.test(fd)) {
		this.on_suc();
		return true
	} else {
		this.on_error();
		return false;
	}
};
//是否为空验证器
function Required_val(tip) {
	this.tips = tip;
	this.on_suc = null;
	this.on_error = null;
};
Required_val.prototype.validate = function(fd) {
	if(fd.replace(/(^\s*)|(\s*$)/g, "") === '') {//用户编辑消息为空
		this.on_error();
		return false;
	} else {
		this.on_suc();
		return true;
	}
};
//长度验证器
function Len_val(min_l, max_l, tip) {
	this.min_v=min_l;
    this.max_v=max_l;
    this.tips=tip;
    this.on_suc=null;
    this.on_error=null;
}
Len_val.prototype.validate = function(fd) {
    if(fd.length < this.min_v || fd.length > this.max_v) {
        this.on_error();
        return false;
    } else {
    	this.on_suc();
    	return true;
    } 
}
//判断两个表单值是否一致
function Equal_val(obj, eqobj, tip) {
	this.obj = obj;
	this.eqobj = eqobj;
	this.tips = tip;
	this.on_suc=null;
    this.on_error=null;
}
Equal_val.prototype.validate = function(fd) {
	if($('#' + this.obj).val() !== $('#' + this.eqobj).val()) {
		this.on_error();
        return false;
	} else {
		this.on_suc();
    	return true;
	}
}
//验证表单集合类
//item: 需要验证的表单字段类数组 
function Userform(items) {
	this.f_item = items;            //字段验证数组
};
Userform.prototype.get_check = function(v) {
	return function() {
		v.validate();
	}
};
Userform.prototype.validate = function() {
	for(var item in this.f_item) {
		this.f_item[item].validate();
		if(!this.f_item[item].checked) {
			return false;
		}
	}
	return true;
};
Userform.prototype.set_submit = function(bid, callback) {
	var self = this;
	$('#' + bid).click(function() {
		if(self.validate()) {
			callback();
		}
	});
}