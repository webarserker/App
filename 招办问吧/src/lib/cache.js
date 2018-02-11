'use strict';

var cache = {};

cache.name = '_we889wiUUYIo23uisUYjsUkw2d';

cache._setAll = function(){
    var data = cache.data || {};
    if(typeof localStorage !== 'undefined'){
        try{
            data = JSON.stringify(data);
            localStorage.setItem(cache.name, data);
        }catch(e){};
    };
};

cache._getAll = function(){
    var data = {};
    if(typeof localStorage !== 'undefined'){
        try{
            data = localStorage.getItem(cache.name) || '{}';
            if(data){
                data = JSON.parse(data);
            }
        }catch(e){};
    };
    return data;
};

cache._setAllLater = function(){
    setTimeout(function(){
        cache._setAll();
    }, 50);
};

cache.data = cache._getAll();

cache.set = function(name, val){
    var diff = cache.data[name] !== val;
    cache.data[name] = val;
    if(diff){
        cache._setAllLater();
    }
};

cache.get = function(name){
    return cache.data[name];
};

cache.del = function(key){
    delete cache.data[key];
    cache._setAllLater();
};

cache.each = function(cb){
    var data = cache.data;
    Object.keys(data).forEach(function(n, k){
        cb(n, k);
    });
};

export default cache;