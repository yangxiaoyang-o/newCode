const express = require('express')
// 创建路由对象
const UserRouter = express.Router()

// 1. 导入验证表单数据的中间件
const expiresJoi = require('@escook/express-joi')
// 2. 导入需要验证的规则对象
const { reg_login_schema } = require('../../schema/user.js')

// 导入用户路由模块
const UserController = require('../../router_handler/admin/UserHandler')

// 用户注册
// 3. 使用中间件验证表单数据：expiresJoi(reg_login_schema)
UserRouter.post(
  '/user/reguser',
  expiresJoi(reg_login_schema),
  UserController.regUser
)

// 用户登录
UserRouter.post(
  '/user/login',
  expiresJoi(reg_login_schema),
  UserController.login
)

// 图片上传 （需要安装插件：npm install --save multer）
const multer = require('multer')
const upload = multer({ dest: 'public/avataruploads/' })

// 更新用户信息（含图片）
UserRouter.post('/user/upload', upload.single('file'), UserController.upload)

// 添加新用户
UserRouter.post('/user/addUser', upload.single('file'), UserController.addUser)

// 获取用户列表
UserRouter.get('/user/getList', UserController.getList)

// 删除用户
UserRouter.delete('/user/deleteUser/:id', UserController.deleteUser)

// 将路由对象共享出去
module.exports = UserRouter
