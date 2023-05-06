const express = require('express')
const UserController = require('../../controllers/admin/UserController')
// 创建路由对象
const UserRouter = express.Router()

// 图片上传 （需要安装插件：npm install --save multer）
const multer = require('multer')
const upload = multer({dest:'public/avataruploads/'})

// 用户注册
UserRouter.post('/user/reguser',UserController.regUser)

// 用户登录
UserRouter.post('/user/login', UserController.login)

// 更新用户信息（含图片）
UserRouter.post('/user/upload',upload.single('file'),UserController.upload)

// 将路由对象共享出去
module.exports = UserRouter