//vue项目需要用到的接口

module.exports = function (app) {
  // all()的path匹配完整路径
  app.all('*',function(req,res,next){
    res.header('Access-Control-Allow-Origin', '*');//的允许所有域名的端口请求（跨域解决）
    res.header('Access-Control-Allow-Headers', 'Content-Type,token');
    // res.header('Access-Control-Allow-Methods', '*');
    // res.header('Content-Type', 'application/json;charset=utf-8');
    next();
  })
  let categories = require("../data/cube-ui-project/category.json");
  let categoriesData = categories.map(({id,text}) =>({value:id,text:text}));
  app.get('/api/category',function(req,res){
    res.json({code:0,data:categoriesData});
  });
  
  let slide = require("../data/cube-ui-project/slide.json");
  app.get('/api/slide',function(req,res){
    res.json(slide);
  });
  
  app.get('/api/lessonList/:id',function(req,res){
    //获取请求的参数
    // console.log(req.params);
    //请求url ?后带的参数
    // console.log(req.query);
    let id = req.params.id;
    let {size, offset} = req.query;
    size = parseInt(size);
    offset = parseInt(offset);
    //根据页面传的id找到对应的分类
    let currentCategory = categories.find(item=>item.id == id);
    // console.log(currentCategory);
    //最终要返回的数据
    let result = [];
    //判断是否还有记录，页面可对其进行判断，如果为false则可以不再发起请求
    let hasMore = true;
    if (!currentCategory) {//没有找到该分类,返回全部分类的课程集合
      let list = categories.reduce((res,current) => {
        return res.concat(current.children);
      },[]);
      //分页
      result = list.slice(offset, offset+size);
      if (list.length < offset+size) {
        hasMore = false;
      }
    } else {
      result = currentCategory.children.slice(offset, offset+size);
      if (currentCategory.children.length < offset+size) {
        hasMore = false;
      }
    }
    res.json({code:0,data:{result:result,hasMore:hasMore}});
  });

  
let userList = require("../data/cube-ui-project/user.json");

  
// let jwt = require("../token/token.js");
let jwt = require('jsonwebtoken')


app.post('/api/login',(req,res)=>{
  
  let {username,password} = req.body;
  // console.log(req.body);
  let user = userList.some(user => {
    return user.username==username && user.password==password
  })
  if (user) {
    // exporesIn为过期时间，单位：ms/h/days/d  eg:1000, "2 days", "10h", "7d"
    let token = jwt.sign({username:username,password:password},"cube-ui",{expiresIn:'12h'});
    res.json({code:0,data:{msg:"登录成功",user:{username:username},token:token}})
  } else {
    res.json({code:1,data:{msg:"登录失败"}})
  }
  
})

//上传文件到服务器
var multer =require('multer');
var path = require('path')
var fs = require('fs')
var upload = multer({ dest: './uploads/' })//当前目录下建立文件夹uploads
app.use(upload.any());

app.post('/api/upload',upload.single('file'), (req,res)=>{
  
  console.log(req.files);
  // req.files输出
  // [
  //   {
  //     fieldname: 'file',
  //     originalname: '微信图片_20210407111402.jpg',
  //     encoding: '7bit',
  //     mimetype: 'image/jpeg',
  //     destination: './uploads/',
  //     filename: 'a9bd1aff77870836f3087d3752a8ecda',
  //     path: 'uploads\\a9bd1aff77870836f3087d3752a8ecda',
  //     size: 64219
  //   }
  // ]
  //保存的文件没有后缀名

  //拿到后缀名
  var extname = path.extname(req.files[0].originalname);
  var newPath = req.files[0].path + extname;
  //重命名
  fs.rename(req.files[0].path,newPath,(err)=>{
    if (err) {
      console.log("上传失败");
    } else {
      console.log("上传成功");
    }
  })
  res.json({code:0,data:{url:"http://localhost:3000/uploads/"+req.files[0].filename + extname}})
})




app.get('/api/validate',(req,res)=>{
  let token = req.headers.token;
  // console.log(req.headers.token);
  if (!token) {
    res.json({code:1,data:{msg:"Token为空"}});
  }
  try {
    let info = jwt.verify(token,"cube-ui");
    // let info = jwt.getToken(token,"cube-ui")
    // console.log("info:"+info.username);
    res.json({code:0,data:info})
   
  } catch(e) {
    res.json({code:1,data:{msg:"失败"}})
  }
  
 
})
};
