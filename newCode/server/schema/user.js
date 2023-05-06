// 为表单中携带的每个数据项，定义验证规则
const joi = require('joi')

/**
 * 验证规则说明：
 * 
 */
const username = joi.string().alphanum().min(3).max(10).required()
