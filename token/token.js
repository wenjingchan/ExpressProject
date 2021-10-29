let jwt = require('jsonwebtoken')
let jwtSecret = 'cube_ui_serve_token'


let setToken = function({username},jwtSecret=jwtSecret) {
  return new Promise((resolve, reject)=>{
    //传入要解析的值{username:username}
    //expiresIn设置过期时间
    let token = jwt.sign({username:username},jwtSecret,{expiresIn:'12h'});
    resolve(token);
  })
}



let getToken = function(token,jwtSecret) {
  return new Promise((resolve, reject)=>{
    let info = jwt.verify(token,jwtSecret);
    console.log(info)

    resolve(info);
    
  }).catch((e)=>{
    console.log("----------"+e)
  })
}

module.exports={
  setToken,
  getToken
}