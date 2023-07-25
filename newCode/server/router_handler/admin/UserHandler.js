// 导入数据库操作模块
const db = require('../../db/index')

// 导入bcryptjs密码加密 npm i bcryptjs@2.4.3
const bcrytp = require('bcryptjs')

// 导入jsonwebtoken生成token字符串
const jwt = require('jsonwebtoken')
const config = require('../../config.js')

/**
 * 用户注册
 * @param {*} req
 * @param {*} res
 */
exports.regUser = (req, res) => {
  // 接收客户端提交到服务器的信息
  const userInfo = req.body
  // 1. 对数据进行合法校验
  // if (!userInfo.username || !userInfo.password) {
  //   return res.send({ status: 1, message: '用户名或密码不合法！' })
  // }
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

/**
 * 用户登录
 * @param {*} req
 * @param {*} res
 */
exports.login = (req, res) => {
  // 1. 接收客户端提交表单数据
  const userInfo = req.body
  // 2. 定义SQL语句，根据用户名查询数据是否存在
  const sql = `select * from user where username=?`
  db.query(sql, userInfo.username, (err, result) => {
    // 执行SQL语句失败
    if (err) {
      return res.send({ status: '1', message: err.message })
    }
    // 执行SQL语句成功，但是查询到的数据不等于1，登录失败
    if (result.length !== 1) {
      return res.send({
        status: '1',
        message: '用户登录失败，请稍后再试！'
      })
    }
    // 3. 判断密码是否正确
    // bcrytp.compareSync(参数1：用户输入的密码，参数2：数据库中的密码)
    const compareResult = bcrytp.compareSync(
      userInfo.password,
      result[0].password
    )
    // 3.1 如果结果等于 false，用户密码错误
    if (!compareResult) {
      return res.send({
        message: '登录失败，密码错误！'
      })
    }
    // 4. TODO：在服务器端生成Token字符串
    // 剔除用户密码和头像
    const user = { ...result[0], password: '', user_pic: '' }
    // // 对用户的信息进行加密，生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, {
      expiresIn: config.expiresIn
    })
    // 调用res.send()将Token响应给客户端
    const token = 'Bearer ' + tokenStr
    // console.log(result)
    res.send({
      status: 0,
      message: '登录成功!',
      token: token,
      data: {
        id: result[0].id,
        username: result[0].username,
        gender: result[0].gender ? result[0].gender : 0,
        introduction: result[0].introduction,
        avatar: result[0].avatar,
        role: result[0].role
      }
    })
  })
}

/**
 * 更新用户信息
 * @param {*} req
 * @param {*} res
 */
exports.upload = (req, res) => {
  const gender = Number(req.body.gender)
  const { id, username, introduction } = req.body
  const avatar = req.file ? `/avataruploads/${req.file.filename}` : ''
  // 如果用户更新信息的时候没有传图片，那就不更新图片，更新其它信息。
  // 在这个位置如果不判断图片是否存在，更新数据就会失败。因为没有图片
  if (avatar) {
    const sql = `update user set username = ?, gender = ?,introduction = ?, avatar = ? where id = ?`
    db.query(
      sql,
      [username, gender, introduction, avatar, id],
      (err, result) => {
        if (err) {
          return res.send({
            status: 1,
            message: err.message
          })
        }
        if (result.affectedRows !== 1) {
          return res.send({
            status: 1,
            message: '更新用户信息失败！'
          })
        }
        res.send({
          status: 0,
          message: '更新用户信息成功！',
          data: {
            id,
            username,
            gender,
            introduction,
            avatar: 'http://127.0.0.1:3007/public' + avatar // 如果用户没有传图片，更新数据成功 avatar 这个参数也不用返回，返回会覆盖vuex中的数据
          }
        })
      }
    )
  } else {
    const sql = `update user set username = ?, gender = ?,introduction = ? where id = ?`
    db.query(sql, [username, gender, introduction, id], (err, result) => {
      if (err) {
        return res.send({
          status: 1,
          message: err.message
        })
      }
      if (result.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '更新用户信息失败！'
        })
      }
      res.send({
        status: 0,
        message: '更新用户信息成功！',
        data: {
          id,
          username,
          gender,
          introduction
        }
      })
    })
  }
}

/**
 * 添加用户信息
 * @param {*} req
 * @param {*} res
 */
exports.addUser = (req, res) => {
  const gender = Number(req.body.gender)
  const password = bcrytp.hashSync(req.body.password, 10)
  const { username, role, introduction } = req.body
  const avatar = req.file ? `/avataruploads/${req.file.filename}` : ''
  const sql = `select * from user where username = ?`
  db.query(sql, username, (err, result) => {
    if (result.length > 0) {
      res.send({
        status: 1,
        message: '用户已存在，请重新添加！'
      })
    }
  })

  // 添加用户信息
  const sqlStr = `insert into user set ? `
  db.query(
    sqlStr,
    { username, password, gender, introduction, role, avatar },
    (err, result) => {
      if (err) {
        return res.send({
          status: 1,
          message: err.message
        })
      }
      if (result.affectedRows !== 1) {
        return res.send({
          status: 1,
          message: '添加用户失败，请重新添加！'
        })
      }
      return res.send({
        status: 0,
        message: '添加用户成功！'
      })
    }
  )
}

/**
 * 获取用户列表
 * @param {*} req
 * @param {*} res
 */
exports.getList = (req, res) => {
  const sql = `select * from user`
  db.query(sql, (err, result) => {
    if (err) {
      return res.send({
        status: 1,
        message: err.message
      })
    }
    if (result.length === 0) {
      return res.send({
        status: 1,
        message: '获取用户列表失败！'
      })
    }
    return res.send({
      status: 0,
      message: '获取用户列表成功！',
      data: result
    })
  })
}
