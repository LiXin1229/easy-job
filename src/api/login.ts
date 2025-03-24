import request from '@/utils/request'

export const getCheckCode = () => {
  return request({
    url: 'https://api.xygeng.cn/one'
  })
}
