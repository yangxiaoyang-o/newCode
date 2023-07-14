// 为表单中携带的每个数据项，定义验证规则
const joi = require('joi')
/**
 * 验证规则说明：
 *  string()：
 *  alphanum()：
 *  min()：
 *  max()：
 *  required()：
 *  pattern()：正则表达式
 */
// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(3).max(10).required()
const password = joi
  .string()
  .pattern(/^[\S]{6,12}$/)
  .required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    username,
    password
  }
}
