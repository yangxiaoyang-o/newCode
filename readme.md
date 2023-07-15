# 1. 项目目录规划

---

## 1. admin

1. admin后台管理系统。
2. 使用vue框架搭建。



## 2. server

1. 后台管理系统代码实现。

2. 使用node.js语言，express框架。

   

## 3. web

1. web企业门户网站。
2. 使用vue框架搭建。



# 2. admin深入分析

----

## 1. 创建项目

1.  使用vue框架创建项目。

```js
create vue admin   
```

2. 清除admin目录文件中不需要的文件。

## 2. 路由分析

1. 嵌套的子路由是根据用户全选访问的，不是刚开始什么地方都可以去，那样就乱套了。
2. 使用router.addRoute()函数添加子路由。
3. 但是router.addRoute()方法一次只能添加一个路由，如果有10个或者8个路由，那么就要调用10次或8次，addRoute()函数，会造成路由代码冗余的问题。

`解决方案：`

1. 定义一个路由配置文件 config.js 配置文件。

```js
const Home = () => import('@/views/home/Home')
const Center = () => import('@/views/center/Center')
const UserAdd = () => import('@/views/user/UserAdd')
const UserList = () => import('@/views/user/UserList')
const NotFound = () => import('@/views/notfound/NotFound')

const routerConfig = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    component: Home
  },
  {
    path: '/center',
    component: Center
  },
  {
    path: '/user/useradd',
    component: UserAdd
  },
  {
    path: '/user/userlist',
    component: UserList
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]
export default routerConfig
```

2. router.js 全局路由配置文件。

```js
import { createRouter, createWebHistory } from 'vue-router'
import RouterConfig from './config'
import store from '@/store/index'

const Login = () => import('@/views/Login')
const MainBox = () => import('@/views/MainBox')

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/mainbox',
    name: 'mainbox',
    component: MainBox
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

/**
 * beforeEach()在路由跳转之前
 *  to:
 *  from:
 *  next()
 */
router.beforeEach((to,from,next)=>{
  if(to.name === 'login'){
    next()
  }else{
    // 如果授权(已经登录过了) next()
    // 未授权，重定向到login
    if(!localStorage.getItem("token")){
      next({
        path:'/login'
      })
    }else{
      if(!store.state.isGetterRouter){
        configRouter()
        next({
          path:to.fullPath
        })
      }else{
        next()
      }
    }
  }
})

/**
 * 定义遍历路由函数
 */
const configRouter = () =>{
  // 遍历子路由（config.js文件中配置的子路由） 
  RouterConfig.forEach(item => {
    // 使用router.addRoute()方法，添加子路由给mainbox组件
    router.addRoute('mainbox',item)
  });
  // 改变 isGetterRouter 值为true
	store.commit("changeGetterRouter",true)
}
export default router
```

## 3. element-plus

1. 安装element-plus插件

```js
npm install element-plus --save
```

2. 注册插件

```js
import ElementPlus from 'element-plus'    // main.js文件中引入
import 'element-plus/dist/index.css'

// 注册插件
app.use(ElementPlus)
```

## 4.【注意】粒子动画

> 给登录页面加粒子动画。
>
> 使用方式参考文档：https://www.npmjs.com/package/particles.vue3

1. particles.vue3 粒子库安装。

```js
npm install --save particles.vue3 
// 注意：tsparticles 一定要安装的，今天在使用的时候没有安装导致只有背景，没有动画效果，因为刚开始以为这个是使用（tyscript的时候使用的）。
npm install --save tsparticles 
```

2. 注册组件：main.js中注册。

```js
import Particles from "particles.vue3";
createApp(App).use(Particles);
```

3. 使用 particles.vue3 粒子库。

```html
<!-- 1. template 模板中 -->
<template>
	<div>
		<Particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded" :options="particles" />
	</div>
</template>
```

```js
// 2. 引入粒子动画（存放在script标签对立面的）
import { loadFull } from "tsparticles"
// 将粒子动画抽离出去了，避免文件的冗余
import { particles } from "../components/particles/particles.js"

// 3. 粒子动画（从文档上复制的，一定需要引入的）
const particlesInit = async engine => {
  await loadFull(engine)
}
const particlesLoaded = async container => {
  console.log("Particles container loaded", container)
}
```

```js
// 3. 抽离的 particles.js 文件
export const particles = {
  background: {                 // 背景颜色
    color: {
        value: '#2d3a4b'
    }
  },
  fpsLimit: 20,
  interactivity: {
    events: {
        onClick: {              // 点击是否添加，默认为true，改成false 
            enable: false,
            mode: 'push'        // click模式，可选参数：["push", "remove", "repulse", "bubble"]
        },
        onHover: {              
            enable: true,
            mode: 'repulse'    // hover模式，可选参数：["grab", "repulse", "bubble"]
        },
        resize: true
    },
    modes: {
      bubble: {
          distance: 400,
          duration: 2,
          opacity: 0.8,
          size: 40
      },
      push: {
          quantity: 4
      },
      repulse: {
          distance: 200,
          duration: 0.4
      }
    }
  },
  particles: {
    color: {
        value: '#ffffff'        // 动画连接"点"的颜色
    },
    links: {                    // 动画链接"线"的颜色
        color: '#ffffff',       // 线条颜色
        distance: 150,          // 线条长度
        enable: true,           // 是否有线条
        opacity: 0.5,           // 线条透明度
        width: 1                // 线条宽度
    },
    collisions: {
        enable: true
    },
    move: {
      direction: 'none',
      enable: true,
      outModes: {
          default: 'bounce'
      },
      random: false,
      speed: 3,                  // 动画快慢，数值越大越快，这里我将数值改小了20230327
      straight: false
    },
    number: {
      density: {
          enable: true,
          area: 800
      },
      value: 80									// 粒子数量
    },
    opacity: {
        value: 0.5              // 粒子透明度
    },
    shape: {
        type: 'circle'          // 粒子外观类型，可选参数：["circle","edge","triangle", "polygon","star"] 
    },
    size: {
        value: { min: 1, max: 3 },
    }
  },
  detectRetina: true
}
```

## 5.【重点】页面持久化

> 解释：就是当我点击"个人中心"，刷新页面后，还是显示的个人中心。

1. 持久化插件的安装

```js
npm install --save vuex-persistedstate
```

2. 注册持久化插件

```js
// 2.1.store里面的index.js中引入
import createPersistedState from 'vuex-persistedstate'

// 2.2.使用持久化插件
export default createStore({
  state: {  
    // menu 菜单是否折叠，默认为false，不折叠
    isCollapsed: false,       
  },
  getters: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  },
  // vuex持久化插件
  plugins: [createPersistedState({
    // paths控制是否持久化，在paths里面的是需要持久化的
    paths:['isCollapsed']
  })] 
})
```

## 6.【重点】建立前后连接

1. 使用 axios 插件

```js
npm install axios
```



# 3. server深入分析

---

## 1. 创建项目

1. 创建一个 server 文件夹，用于存放后端文件，和数据库进行交互。
2. 初始化包管理配置文件：

```js
npm init -y
```

3. 运行如下的命令，安装特定版本的 `express`：

```bash
npm i express@4.17.1
```

4. 在项目根目录中新建 `app.js` 作为整个项目的入口文件，并初始化如下的代码：

```js
// 导入 express 模块
const express = require('express')
// 创建 express 的服务器实例
const app = express()

// write your code here...

// 调用 app.listen 方法，指定端口号并启动web服务器
app.listen(3007, function () {
  console.log('api server running at http://127.0.0.1:3007')
})
```

## 2. 配置Cors跨域

1. 运行如下命令，安装Cors中间件：

```js
npm install cors@2.8.5       // 指定版本
```

2. 在app.js中导入并配置cors中间件：

```js
// 导入 cors 中间件
const cors = require('cors')
// 将cors注册为全局中间件
app.use(cors())
```

## 3. 配置解析表单数据的中间件

1. 通过如下代码，配置解析**application/x-www-form-urlencoded**格式的表单数据中间件：

```js
app.use(express.urlencoded({extended:false}))
```

## 4. 初始化用户模块



## 5. 创建数据库链接



## 6. 安装mysql数据库

```js
npm install mysql
```

1. 在项目中创建db文件夹，db/index.js文件创建
2. 导入数据库文件配置

```js
// 导入 mysql 模块
const mysql = require('mysql')

// 创建数据库连接对象
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'admin123',
  database: 'my_new_code'
})

// 向外共享 db 数据库连接对象
module.exports = db
```

## 7. 用户注册

> 用户注册分为四个步骤：
>
> 1. 对数据进行合法校验（检测表单提交的数据是否合法，是否为空）
> 2. 检测用户名是否被占用，在数据库中查询用户名是否被占用
> 3. 用户名没有占用，多用户密码进行加密
> 4. 写新增用户的SQL语句

```js
exports.regUser = (req, res) => {
  // 接收客户端提交到服务器的信息
  const userInfo = req.body
  console.log(userInfo)
  // 1. 对数据进行合法校验
  if (!userInfo.username || !userInfo.password) {
    return res.send({ status: 1, message: '用户名或密码不合法！' })
  }
  // 2. 定义sql语句，查询用户名是否被占用
  const sql = `select * from user where username = ?`
  db.query(sql, [userInfo.username], (err, results) => {
    // 执行sql语句失败
    if (err) {
      return res.send({ status: '1', message: err.message })
    }
    // 判断用户名是否被占用
    if (results.length > 0) {
      return res.send({
        status: '1',
        message: '用户名被占用，请更换其它用户名！'
      })
    }
    // 3. TODO：用户名没有占用（用户名可用，对用户密码进行加密）
    // 3.1 用户名可用，需要对密码进行加密
    // bcrytp 加密后的密码，无法被逆向破解
    // 同一明文，多次加密，得到的加密结果各不相同，保证了安全性
    // hashSync(参数1：明文密码, 参数2：随机盐的长度)
    userInfo.password = bcrytp.hashSync(userInfo.password, 10)

    // 4. 定义新增用户SQL语句
    const sqlStr = `insert into user set ?`
    db.query(
      sqlStr,
      { username: userInfo.username, password: userInfo.password },
      (err, results) => {
        // 判断 SQL 语句是否执行成功
        if (err) {
          return res.send({ status: '1', message: err.message })
        }
        // 判断影响函数是否等于1
        if (results.affectedRows !== 1) {
          return res.send({
            status: '1',
            message: '注册用户失败，请稍后再试！'
          })
        }
        return res.send({ status: '0', message: '注册用户成功！' })
      }
    )
  })
  return
}
```

## 8. 优化表单验证

> 前端验证为辅，后端验证为主。

1. 安装@hapi/joi包，为表单中每个携带的数据项，定义验证规则：

```js
npm install @hapi/joi 
```

2. 安装@escook/express-joi中间件，来实现自动对表单数据进行验证功能。

```js
npm install @escook/express-joi
```

3. 新建/schema/user.js用户信息验证规则模块，并初始化如下代码：

```js
// 为表单中携带的每个数据项，定义验证规则
const joi = require('joi')

/**
 * 验证规则说明：
 * string()
 * alphanum()
 * min(3)
 * max(10)
 * required()
 */

const username = joi.string().alphanum().min(3).max(10).required()

```

## 9. 用户登录

> 1. 检测表单数据是否合法。
> 2. 根据用户名查询用户数据。
> 3. 判断用户输入的密码是否正确。
> 4. 生成JWT的Token字符串。

## 10. 生成JWT的Token字符串

> 核心注意点：在生成token字符串的时候，一定要剔除密码和头像。

