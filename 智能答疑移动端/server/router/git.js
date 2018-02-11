var express = require('express'),
    git = require('../util/git'),
    router = express.Router();

// API接口转发
router.all('/pull', function(req, res){
    try{
        git.pull(function(error, changes){
            res.send(error || changes);
        });
    }catch(e){
        res.end('error');
    };
});

module.exports = router;