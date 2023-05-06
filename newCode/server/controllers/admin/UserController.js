// 导入数据库操作模块
const db = require("../../db/index")

// 导入bcryptjs密码加密 npm i bcryptjs@2.4.3
const bcrytp = require('bcryptjs')

/* 
 * @description: 用户注册
 * @author: yang_xiaoyang 
 * @date: 2023-03-28 14:39:19
 * @version: V1.0.0 
*/ 
exports.regUser = (req,res) =>{
  // 接收客户端提交到服务器的信息
  const userInfo = req.body
  // 对数据进行合法校验
  if(!userInfo.username || !userInfo.password){
    return res.send({status:1,message:'用户名或密码不合法！'})
  }
  // 定义sql语句
  const sql = `select * from user where username = ?`
  db.query(sql,[userInfo.username],(err,results)=>{
    // 执行sql语句失败
    if(err){
      return res.send({status:'1',message:err.message})
    }
    // 判断用户名是否被占用
    if(results.length>0){
      return res.send({status:'1',message:'用户名被占用，请更换其它用户名！'})
    }
    // TODO：用户名没有占用（用户名可用）
    
    // 1. 用户名可用，需要对密码进行加密
    userInfo.password = bcrytp.hashSync(userInfo.password,10)

    // 2. 定义新增用户SQL语句
    const sqlStr = `insert into user set ?`
    db.query(sqlStr,{username:userInfo.username,password:userInfo.password},(err,results)=>{
      // 执行sql语句失败
      if(err){
        return res.send({status:'1',message:err.message})
      }
      if(results.affectedRows !==1){
        return res.send({status:'1',message:'注册用户失败，请稍后再试！'})
      }
      return res.send({status:'0',message:'注册用户成功！'})
    })
  })
  return;
}
  
/* 
 * @description: 用户登录
 * @author: yang_xiaoyang 
 * @date: 2023-03-28 14:39:52
 * @version: V1.0.0 
*/ 
exports.login = (req,res) =>{
  // 接收表单数据
  const userInfo = req.body
}

/* 
 * @description: 用户信息更新
 * @author: yang_xiaoyang 
 * @date: 2023-03-28 14:40:12
 * @version: V1.0.0 
*/ 
exports.upload = (req,res) =>{
  console.log(req.file)
}
    

