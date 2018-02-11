## 初始化项目 --

在当前目录执行 
`npm i`

安装全局命令
`npm i -g forever webpack`


## 常用命令

生产环境拉取代码并编译
`node build`

生产环境启动命令
forever start -a -l forever.log -o out.log -e err.log start.js

`forever server -o OUTFILE` 
或
`forever server` （不输出控制台信息，而且可后台运行，性能更高）


开发环境启动服务器（在本机上使用）
`npm run dev`

测试环境启动服务器（在测试环境上使用）
`npm run debug`

## 高级命令

启动服务器
`node start` 

定时拉取代码（1分钟）
`node start -g 1` 

监听指定端口（3000）
`node start -p 3000` 

并实时打包
`node start -w watch` 

每分钟拉取代码，并实时打包
`node start -g 1 -w watch` 

监听指定端口，并实时打包
`node start -p 3000 -w watch` 


## 目录结构

```
    /client/                        ------ 静态资源目录（从src目录构建自动生成）
    /doc/                           ------ 开发文档
    /node_modules/                  ------ nodejs第三方库目录，git忽略
    /server/                        ------ web服务器代码
    ----/util/                      ---------- 工具函数
    ----/weixin/                    ---------- 微信API
    /src/                           ------ 前端代码
    ----/component/                 ---------- 页面组件
    ----/css/                       ---------- 样式
    ----/font/                      ---------- 字体、图标
    ----/image/                     ---------- 图片
    ----/page/                      ---------- 页面
    ----/util/                      ---------- 工具函数
    /start.js                       ------ 启动入口
    /config.js                      ------ 服务器参数配置
    /package.json                   ------ 包配置
    /readme.md                      ------ 说明文档
    /webpack.config.js              ------ 前端代码构建脚本
```

## 技术选型

###前端：

```
    webpack + es2016 + zepto + w3.css

    采用Webpack作为构建工具，构建时：把src目录的代码和静态资源合并、优化后存储到client目录。

    支持ES6语法，使用 import/export 实现模块间的耦合， 后缀为 js/css/styl/jpg/gif/png/vue/json 的文件可直接通过 import 引入。

    /src/page/ 用于存放页面源代码， 目录名即为页面名，例如：/src/page/user/ 目录会在构建时生成 /client/user.html。

    目录下必须有 index.js 作为页面启动脚本。
```

###后端

```
    node.js + express + request
```