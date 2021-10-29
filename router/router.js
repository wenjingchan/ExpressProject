module.exports.routerFun  = function(app, params){
  // app.get('/', function(req,res){
  //   res.send("hello world!");
  // }); 
  app.get('/customer',function(req,res){
    res.send("customer page");
  });

  app.get('/seller',function(req,res){
    var body = 'Hello World';
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', body.length);
      res.end({"id":20,"name":"s1s"});
      // res.status(200).json({"id":20,"name":"ss"})
  });

 
 
  // app.get('/', function(req,res){
  //   res.sendFile(path.resolve(__dirname+"/../views/index.html"));
  // });

  app.get('/', function (req, res){
    res.render('index',params.indexData);
  });
  app.get('/about',function(req,res){
    res.render('about',params.aboutData);
  });

  app.get('/article/:id', function(req, res) {
    var entry = params.articleData(req.params.id);
    res.render('article',{title:entry.title, blog:entry});
 });

  require("./cube-ui-serve.js")(app);

 




}
