var fs = require('fs');
var content = require('./content-type.js');
var util = require('./index.js');

function extOf(path){
    path = path.split('?')[0];
    //
    if(path.indexOf('.') > -1){
        return path.replace(/.*\./, '');
    }else{
        return '';
    };
};

function htmlServe(req, res, next) {
    var path = req.path, type, body;
    
    if(extOf(path) !== 'html'){
        next();
        return;
    };
    
    path = __dirname + '/../../client' + path;
    
    fs.exists(path, function (exists) {
        if (!exists) {
            next();
        } else {
            type = getTypeInfo(path);

            body = fs.readFileSync(path, 'utf-8');

            body = util.sub(body, this.req.query);
            
            if (type.ctype) {
                res.set({ 'content-type': type.ctype + ';charset=utf-8' });
            };
            
            res.status(200);

            res.send(body);
        }
    }.bind({ req: req }));
};


function getTypeInfo(path) {

    var ext = content.ext(path);
    var type = content.type(ext);
    var isBinary = content.isBinary(type);

    return {
        ext: ext,
        ctype: type,
        binary: isBinary,
        encoding: isBinary ? 'binary' : 'utf-8'
    };
};

module.exports = htmlServe;