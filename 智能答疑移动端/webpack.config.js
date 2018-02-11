var argv = require('yargs').argv;
var webpack = require('webpack');
var config = require('./config.js');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var gulp = require('gulp');
var clean;
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var fs = require('fs');
var util = require('./server/util');

// 清空client目录
// 拷贝image
gulp.task('clean-client', function() {
    clean = clean || require('gulp-clean')
    return gulp.src('./client/', {
            read: false
        })
        .pipe(clean());
});

gulp.task('copy-src', function() {
    return gulp.src([
            './src/image/*.*',
            './src/font/*.*',
            './src/css/*.*',
            // '!**/*.styl'
        ], {
            base: './src/'
        })
        .pipe(gulp.dest('./client/'));
});

gulp.task('copy_bulid',function(){
    gulp.src(['./weixin/build/*.*'])
        .pipe(gulp.dest('./client/build/'))
})


gulp.task('copy-static', function() {
    return gulp.src([
            './src/static/*.*','./src/static/**/*.*'
        ], {
            base: './src/static/'
        })
        .pipe(gulp.dest('./client/'));
});

gulp.task('watch-src', function() {
    gulp.watch([
        './src/image/*.*',
        './src/font/*.*',
        './src/css/*.*',
        // '!**/*.styl'
    ], function(e) {
        var path = e.path.replace(__dirname, '.');
        util.log('copy file', path)
            //
        return gulp.src([
                path
            ], {
                base: './src/'
            })
            .pipe(gulp.dest('./client/'));
    });
});

gulp.task('watch-static', function() {
    gulp.watch([
        './src/static/**/*.*'
    ], function(e) {
        var path = e.path.replace(__dirname, '.');
        util.log('copy file', path)
            //
        return gulp.src([
                path
            ], {
                base: './src/static/'
            })
            .pipe(gulp.dest('./client/'));
    });
});

// 1. clean
// 2. copy
gulp.task('start', ['copy-static'], function() {
    return gulp.start('copy-src');
});

// 1. clean
// 2. copy
// 3. watch
gulp.task('start_and_watch', ['watch-static', 'copy-static','copy_bulid'], function() {
    return gulp.start('watch-src', ['copy-src']);
});

gulp.start('start_and_watch');

// 根据 src/page 目录生成html插件配置
var plugins = [],
    entry = {},
    basePath = './src/page';

// 遍历api目录，读取每一个文件
// 遍历文件中定义的每一个路由，以 /api/文件名/路由名 为路径加载路由
fs.readdirSync(basePath).forEach(function(name) {
    if (name != '.svn') {
        var dirPath = basePath + '/' + name,
            templatePath,
            opts,
            tplName;

        if (!fs.statSync(dirPath).isDirectory()) return;

        opts = {
            chunks: [name],
            filename: name + '.html'
        };

        // 尝试从index.js中读取模板名称
        tplName = getTplName(fs.readFileSync(dirPath + '/index.js', 'utf-8'));
        if (tplName) {
            templatePath = './src/template/' + tplName + '.html';
        } else {
            templatePath = dirPath + '/index.html';
        };

        // 检查模板文件是否存在
        if (fs.existsSync(templatePath)) {
            opts.template = templatePath;
        } else {
            opts.template = './src/template/default.html';
        };

        plugins.push(new HtmlWebpackPlugin(opts));
        entry[name] = dirPath;
    }
});

function getTplName(text) {
    var tpl = text.match(/template\[([a-z0-9\-]+)\]/) || [];
    return tpl[1] || '';
}

// 是否压缩代码
if (argv.u || config.uglify) {
    plugins.push(new webpack.optimize.UglifyJsPlugin({
        compress: {
            warnings: false,
        },
        output: {
            comments: false,
        },
    }))
};

// 导出 webpack 配置
module.exports = {

    // 插件
    plugins: [
        new ExtractTextPlugin("[name].css")
    ].concat(plugins),

    // 入口文件
    entry: Object.assign({}, entry),

    // 输出文件
    output: {
        path: __dirname + '/client/',
        filename: '[name].[chunkhash].js',
        libraryTarget: 'umd'
    },

    module: {
        //加载器配置
        loaders: [{
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015','stage-0'],
                    plugins: ["transform-object-assign"]
                }
            }, {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }, {
                test: /\.woff(2)?(\?|\=|\#|\&|\w|\d)*$/,
                loader: "url-loader?limit=1024&minetype=application/font-woff"
            }, {
                test: /\.(ttf|eot|svg)(\?|\=|\#|\&|\w|\d)*$/,
                loader: "file-loader"
            }, {
                test: /\.styl$/,
                loader: 'style-loader!css-loader!stylus-loader'
            }, {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            }, {
                test: /\.json$/,
                loader: 'json-loader'
            }, {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            //
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                loaders: [
                    'file?hash=sha512&digest=hex&name=[hash].[ext]',
                    //'image-webpack?bypassOnDebug&optimizationLevel=7&interlaced=false'
                ]
            }
        ]
    },

    resolve: {
        // 别名
        alias: {}
    }
};
