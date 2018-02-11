function rawParser(req, res, next) {
    var data = '',
        contentType = (req.headers['content-type'] || '').toLowerCase(),
        mime = contentType.split(';')[0];
    
    // 非post不处理
    // ajax表单不处理
    if(req.method.toLowerCase() !== 'post'){
        return next();
    }else if(mime === 'application/x-www-form-urlencoded'){
        return next();   
    }else if(mime === 'application/json'){
        return next();   
    };
    
    // text/*, */xml 都以文本形式读取
    if (mime.match(/^text\//) || mime.match(/\/xml$/)) {
        req.setEncoding('utf8');
    };
    
    req.on('data', function(chunk) { 
        data += chunk;
    });
    
    req.on('end', function() {
        req.rawBody = data;
        next();
    });
}

module.exports = function(){
    return rawParser;
}