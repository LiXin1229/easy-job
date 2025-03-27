let oriPassWord = '123456789'
let newPassWord = ''

export const validateOriPassWord = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请输入原密码'))
  } else {
    if (value.length < 6) {
      callback(new Error('密码长度不能少于 6 位'))
    }
    if (value !== oriPassWord) {
      callback(new Error('密码错误'))
    }
    callback()
  }
}

export const validateNewPassWord2 = (rule: any, value: any, callback: any) => {
  if (!value) {
    callback(new Error('请再次输入新密码'))
  } else {
    if (value.length < 6) {
      callback(new Error('密码长度不能少于 6 位'))
    }
    if (value !== newPassWord) {
      callback(new Error('新密码不一致'))
    }
    callback()
  }
}

export const validatePhone = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('请输入手机号'))
  } else {
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(value)) {
      callback(new Error('请输入正确手机号'))
    }
    callback()
  }
}

export const validatePassWord = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入密码'))
  }
  if (value.length < 6) {
    return callback(new Error('密码长度不能少于 6 位'))
  }
  newPassWord = value
  callback()
}

export const validateCheckCode = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('请输入验证码'))
  } else {
    const codeRegex = /^[a-zA-Z0-9]{4}$/
    if (!codeRegex.test(value)) {
      callback(new Error('请输入正确验证码'))
    }
    callback()
  }
}
