import axios from "axios"
import { ElLoading } from 'element-plus'

const instance = axios.create({
  // baseURL: '',
  timeout: 5000
})

let loading: any = null
// 请求拦截器
instance.interceptors.request.use(function (config) {
  loading = ElLoading.service({
    lock: true,
    text: '加载中......',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  return config
}, function (error) {
  return Promise.reject(error)
})

// 响应拦截器
instance.interceptors.response.use(function (response) {
  const res = response.data
  console.log(res)
  loading.close()
  return res
}, function (error) {
  return Promise.reject(error)
})

export default instance

