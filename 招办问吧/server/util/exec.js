var cp = require('child_process');

// 启动一个子进程
function exec(path){

    var child = cp.exec(path
        // , {
        //     killSignal: 'SIGINT'
        // }, function(err, stdout, stderr){
        //     util.log(stdout.toString('utf-8'));
        // }
    );

    child.stdout.on('data', function (data) {
        console.log(data.toString('utf-8'));
    });

    child.stderr.on('data', function (data) {
        console.log(data.toString('utf-8'));
    });

    child.on('close', function(err){
        console.info('child close');
        console.info(err);
    });

    child.on('error', function(err){
        console.info('child error');
        console.info(err);
    });

    // child.on('exit', function (code) {
    //     console.log('child process exited with code ' + code);
    // });

    return child;
}

module.exports = exec;