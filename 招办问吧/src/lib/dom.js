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

    if(typeof context === 'string'){
        context = document.querySelector(context);
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

    if(typeof context === 'string'){
        context = document.querySelector(context);
    };

    nodes = (context || document).querySelectorAll(selector);
    
    if(typeof callback === 'function'){
        each(nodes, callback);
    };
    
    return nodes;
}

function _args(list, type, index){
    index = index || 0;
    list = Array.prototype.filter.call(list, function(n){
        return typeof type === 'string' ? (typeof n === type) : false;
    });
    return list[index];
}

// 用法： css('div.item', { color: 'red' });
// 用法： css(document.querySelector('h1'), { color: 'red' }, 'body');
const css = function(nodes, attrs, context){
    
    // 同时支持Node和选择器
    if(typeof nodes === 'string'){
        nodes = queryAll(nodes, context); 
    };

    // 同时支持Node和Node列表
    if(!isArray(nodes)){
        nodes = [nodes];
    };
    
    // 为所有节点设置样式
    each(nodes, function(node){
        if(!node || !node.style) return;
        
        Object.keys(attrs).forEach(function(key){
            // backgroundColor 格式转成 background-color 格式
            key = key.replace(/(-[a-z])/g, function(s){
                return s.toUpperCase();
            });
            // 设置样式
            node.style[key] = attrs[key] + '';
        });
    });

    return nodes;
}

// 添加class
const addClass = function(node, cls, type, context){
    var nodes = [];

    // 同时支持Node和选择器
    if(typeof node === 'string'){
        node = queryAll(node, context); 
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
const removeClass = function(node, cls, context){
    return addClass(node, cls, 'remove', context);
}

const hasClass = function(node, cls, context){
    
    // 同时支持Node和选择器
    if(typeof node === 'string'){
        node = query(node, context); 
    };
    
    if(!node) return false;
    
    return !!node.className.match(new RegExp('\\b' + cls + '\\b'));
}

const on = function(node, type, fn, context){
    var nodes = [];

    // 同时支持Node和选择器
    if(typeof node === 'string'){
        node = queryAll(node, context); 
    };

    // 同时支持Node和Node列表
    if(isArray(node)){
        nodes = node;
    }else{
        nodes = [node];
    };

    type = type.split(/\s*\,\s*/);
    
    // 为所有节点添加或删除class
    each(nodes, function(node){
        type.forEach(function(t){
            node.addEventListener(t, fn);
        });
    });
}

export {
    query,
    queryAll,
    css,
    addClass,
    removeClass,
    hasClass,
    on
};