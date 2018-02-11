var request = require('request');
var log = require('./index.js').log;

// 把URL中的参数转为键值对对象
function url2params(url){
	var params = {};
	((url || '').split('?')[1] || '').split('#')[0].split('&').forEach(function(pair){
		pair = pair.split('=');
		if(pair[0]){
			params[pair[0]] = pair[1] || '';
		}
	});
	return params;
}

// 把键值对转为url
function params2url(params){
	var url = [];
	Object.keys(params || {}).forEach(function(key){
		url.push(key + '=' + params[key]);
	});
	return url.join('&');
}

// HTTP转发
function httpProxy(opts, send){
	return function(req, res, next){
		var opts = this;
	    var contentType = (req.headers['content-type'] || '').toLowerCase(),
	        mime = contentType.split(';')[0];
			
		opts = Object.assign({
			host: req.hostname,
			port: req.port || 80,
			url: req.url,
			method: req.method,
			headers: req.headers,
			encoding: req.encoding
		}, opts);

		if(typeof opts.url === 'function'){
			opts.url = opts.url(req);
		};

        if(!opts.url.match(/^http/)){
        	opts.url = opts.host + ':' + opts.port + opts.url;
        };

	    if(req.body && JSON.stringify(req.body) != '{}'){
	        opts.form = req.body;
	        log('Form', opts.form);
	    }else if(req.rawBody && JSON.stringify(req.rawBody) != '{}'){
	        opts.body = req.rawBody;
	    };

		// 用req.query中的参数覆盖url中的参数
		opts.url = opts.url.split('?')[0] + '?' + 
			params2url(Object.assign(url2params(opts.url), req.query));
		
	    request(opts, function (error, response, body) {
			if(!response){
				res.status(404).send('');
				return;
			};
			// log
			log(this.req.method + (this.mime ? (' [' + this.mime + ']') : '') + ' (' + response.statusCode + ')', this.opts.url);
			//
			if(typeof this.send === 'function'){
				this.send.call(response, req, res, next);
			}else{
				res.set(response.headers);
				res.status(response.statusCode).send(response.body || error || 'error');
			};
	    }.bind({req:req, mime: mime, opts: opts, send: send}));
	}.bind(opts);
}

module.exports = httpProxy;