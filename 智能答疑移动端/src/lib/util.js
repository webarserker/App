const SUBREGEX = /\{\s*([^|}]+?)\s*(?:\|([^}]*))?\s*\}/g;

// 判断对象是否undefined
const undef = function(o) {
    return typeof o === 'undefined';
};

// 微型模板，例如： hello {name}!
const sub = function(s, o) {
    return s.replace ? s.replace(SUBREGEX, function (match, key) {
        return undef(o[key]) ? match : o[key];
    }) : s;
};

// 获取2016-8-20格式的日期字符串
const date2string = function(s){
    if(!s) return '';

    if(typeof s === 'number'){
        s = new Date(s);
    }else if(typeof s === 'string'){
        s = s.replace(/^\s*|\s*$/, '');
        if(!s){
            return ''; 
        };
        if(!isNaN(s)){
            s = Number(s);
        };
        s = new Date(s);
    }else if(!s instanceof Date){
        return '';
    };
    
    return s.getFullYear() + '-' + (s.getMonth()+1) + '-' + s.getDate();
};

// 以namespace方式获取属性
const ns = function(obj, path){
    obj = obj || {};
    path = path.split('.');
    path.forEach(function(n, i){
        obj = obj[n];
        if(i < path.length - 1){
            obj = obj || {};
        };
    });
    return obj;
}

// 检查是否数组或者NodeList
const isArray = function(obj){
    if(obj && (typeof obj.length === 'number')){
        if(obj.constructor === NodeList){
            return true;
        }else{
            return Array.isArray(obj);
        };
    };
    return false;
}

// 遍历数组或者对象
// 依赖：isArray
const each = function(obj, callback){
    
    if(typeof callback !== 'function') return;
    
    if(isArray(obj)){
        Array.prototype.forEach.call(obj, callback);
    }else if(typeof obj === 'object'){
        Object.keys(obj).forEach(function(key){
            callback(obj[key], key);
        });
    };
}

// querySelector
const query = function(selector, context, callback){
    var node;

    if(typeof context === 'function'){
        callback = context;
        context = document;
    };

    node = (context || document).querySelector(selector);

    if(typeof callback === 'function'){
        callback(node);
    };

    return node;
}

// 查找dom节点
// 依赖：each
// 用法1：var nodes = queryAll('h1')
// 用法2：var nodes = queryAll('h1', '#wrapper')
/* 用法3：
    queryAll('h1', function(node){
        node.style.display = 'none';
    });
*/
const queryAll = function(selector, context, callback){
    var nodes;
    
    if(typeof context === 'function'){
        callback = context;
        context = document;
    };

    nodes = (context || document).querySelectorAll(selector);
    
    if(typeof callback === 'function'){
        each(nodes, callback);
    };
    
    return nodes;
}

// 用法1： css('div.item', 'color', 'red');
// 用法2： css('div.item', { color: 'red' });
// 用法3： css(document.querySelector('h1'), { color: 'red' });
const css = function(node, attr, val){
    var attrs = {}, nodes = [];

    // 同时支持Node和选择器
    if(typeof node === 'string'){
        node = document.querySelectorAll(node); 
    };

    // 同时支持Node和Node列表
    if(isArray(node)){
        nodes = node;
    }else{
        nodes = [node];
    };

    // 3个参数为单个属性操作
    if(arguments.length === 3 && typeof attr === 'string'){
        attrs[attr] = val;
        return css(nodes, attrs);
    };

    // 2个参数为多个属性操作
    attrs = attr;
    
    // 为所有节点设置样式
    each(nodes, function(node){
        if(!node || !node.style) return;
        
        Object.keys(attrs).forEach(function(key){
            // backgroundColor 转成 background-color
            key = key.replace(/(-[a-z])/g, function(s){
                return s.toUpperCase();
            });
            // 设置样式
            node.style[key] = attrs[key] + '';
        });
    });
}

// 添加class
const addClass = function(node, cls, type){
    var nodes = [];

    // 同时支持Node和选择器
    if(typeof node === 'string'){
        node = document.querySelectorAll(node); 
    };

    // 同时支持Node和Node列表
    if(isArray(node)){
        nodes = node;
    }else{
        nodes = [node];
    };
    
    // 为所有节点添加或删除class
    each(nodes, function(node){
        if(!node || (typeof node.className !== 'string')) return;
        
        if(type === 'remove'){
            if(node.className.indexOf(cls) !== -1) {
                node.className = node.className.replace(cls, '');
            }
        }else{
            if(node.className.indexOf(cls) === -1) {
                node.className += ' ' + cls;
            }
        }
    });

    return nodes;
}

// 删除class
const removeClass = function(node, cls){
    return addClass(node, cls, 'remove');
}

export {
    undef,
    sub,
    ns,
    date2string,
    isArray,
    each,
    query,
    queryAll,
    css,
    addClass,
    removeClass
};