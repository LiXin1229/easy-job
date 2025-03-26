import requestv2 from '@/utils/requestv2'
import request, { type HRequestInterceptors } from '@/utils/hRequest'

export const getCheckCodev2 = () => {
  return requestv2({
    url: 'https://api.xygeng.cn/one',
    showLoading: true
  })
}

export const getCheckCode = () => {
  return request.post({
    url: 'https://api.xygeng.cn/one',
    interceptors: myInterceptors
  })
}

const myInterceptors: HRequestInterceptors = {
  responseInterceptor: (res) => { // 可对响应数据进行处理
    console.log(res)
    return res
  }
}

export const toLogin = () => {
  return request.post({
    url: 'https://api.xygeng.cn/one',
    showLoading: true
  })
}
