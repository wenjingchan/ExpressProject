var express = require('express');
var path = require('path');
var app = express();
var router = require("./router/router");
var hbs = require("hbs");
var blogData = require("./blog");

var bodyParser = require('body-parser');

//post请求不能直接获取参数
app.use(bodyParser.json({ limit: '1mb'}))//body-parser 解析json格式数据
app.use(bodyParser.urlencoded({ extended: true}))

//访问静态资源
app.use('/uploads',express.static('uploads'));


//Node.js 中，__dirname 总是指向被执行 js 文件的绝对路径，
//例如当你在 /d1/d2/myscript.js 文件中写了 __dirname， 它的值就是 /d1/d2 。
// app.use(express.static("public"));
// app.use(express.static(path.join(__dirname,"static")));

//设定views变量，意为视图存放的目录
app.set("views",__dirname + "/views");

//设置模板引擎，为html模板
app.set("view engine", "html");

// 运行hbs模块
app.engine("html", hbs.__express);
var params = {};
params.indexData = {title:"最近文章", entries:blogData.getBlogEntries()};
params.aboutData = {title:"自我介绍"};
params.articleData =blogData.getBlogEntry;
router.routerFun(app,params);


app.listen("3000",function(){
  console.log("server start....")
});