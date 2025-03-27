import request from '@/utils/hRequest'

export const logout = () => {
  return request.post({
    url: '/logout'
  })
}

export const updatePwd = () => {
  return request.post({
    url: '/updateMyPwd'
  })
}
