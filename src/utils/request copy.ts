import axios from "axios"

import { ElLoading, ElMessage } from 'element-plus'

const contentTypeForm = "application/x-www-form-urlencoded;charset=UTF-8"
const contentTypeJson = "application/json"
const contentTypeFile = "multipart/form-data"

const request = (config: any) => {
  let { url, params, dataType, showLoading } = config
  dataType = dataType ? "form" : dataType
  showLoading = showLoading ? true : showLoading

  let contentType = contentTypeForm
  if (dataType === "json") {
    contentType = contentTypeJson
  } else if (dataType === "file") {
    contentType = contentTypeFile

    let param = new FormData()
    for (let key in params) {
      param.append(key, params[key])
    }
    params = param
  }

  // 给自定义的 axios 实例添加拦截器
  const instance = axios.create({
    // baseURL: ''
    timeout: 5000,
    headers: {
      'Content-Type': contentType,
      'X-Requested-With': 'XMLHttpRequest'
    }
  })

  let loading: any = null
  // 请求拦截器
  instance.interceptors.request.use(
    (config: any) => {
      if (config.showLoading) {
        loading = ElLoading.service({
          lock: true,
          text: '加载中......',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }
      return config
    },
    (error) => {
      if (showLoading && loading) {
        loading.close()
        ElMessage({
          message: '请求发送失败',
          type: 'error',
        })
      }
      return Promise.reject('请求发送失败')
    }
  )

  // 响应拦截器
  instance.interceptors.response.use(
    (response) => {
      if (showLoading && loading) {
        loading.close()
      }
      const responseData = response.data
      return responseData
    },
    (error) => {
      if (showLoading && loading) {
        loading.close()
      }
      return Promise.reject('网络异常')
    }
  )
  return instance.post(url, params).catch(error => {
    ElMessage({
      message: error,
      type: 'error',
    })
    return null
  })
}

export default request
