// 1. 导入 express
const express = require('express')
const cors = require('cors')

// 2. 创建服务器的实例对象
const app = express()

// 2023.07.11 请求接口可以跑通，后端拿不到前端表单数据，前端打印表单数据正常。
//  1. 前提：接口在 postman 测试正常。
//  2. 开始以为是网络请求模块的问题（因为版本差异会存在使用区别），后面测试请求http://www.baidu.com，请求跨域提示，判断网络模块正常。
//  3. 前端使用 proxy代理，解决的跨域问题。
//  4. 请求测试后端输出OK，就是拿不到表单数据，数据为空对象{}，前端打印表单数据正常。
//  解决：npm install body-parser 安装。
//        var bodyParser = require('body-parser')
//        app.use(bodyParser.json())
//  bodyParser用于解析客户端请求的body中的内容，内部使用JSON编码处理。

app.use(bodyParser.json())

app.use(cors())
app.use(express.urlencoded({ extended: false }))
var bodyParser = require('body-parser')

// 注意：一定要在路由之前定义响应中间件
app.use((req, res, next) => {
  res.cc = function (err, status = 1) {
    res.send({
      status,
      message: err instanceof Error ? err.message : err
    })
  }
  next()
})

// 导入并注册用户路由模块
const userRouter = require('./router/admin/UserRouter')
app.use('/adminapi', userRouter)

// 3.监听服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})
