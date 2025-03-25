import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'

// 定义请求配置类型
// type RequestConfig = {
//   url: string
//   params?: any
//   dataType?: 'form' | 'json' | 'file'
//   showLoading?: boolean
//   method?: 'post' | 'get' | 'put' | 'delete' // 支持更多请求方法
// }

interface CustomRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  dataType?: 'form' | 'json' | 'file'
  showLoading?: boolean
}

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const contentTypeFile ='multipart/form-data'

// 创建axios实例
const instance: any = axios.create({
  timeout: 5000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// 请求拦截器
instance.interceptors.request.use(
  (config: CustomRequestConfig) => {
    console.log(config.showLoading)
    console.log(config.dataType)
    console.log(config.method)
    if (config.showLoading) { // 如果 showLoading 为 true 展示加载动画
      const loading = ElLoading.service({ // loading 动画
        lock: true,
        text: '加载中......',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      (config as any).loading = loading // loading 实例挂载到 config 上, 方便关闭
    }
    return config;
  },
  (error: any) => {
    if ((error.config as any).loading) {
      (error.config as any).loading.close() // 如果有 loading, 则关闭
    }
    ElMessage({ // 弹框提示错误
      message: '请求发送失败',
      type: 'error'
    });
    return Promise.reject(error) // 返回一个 Promise对象
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response: any) => {
    if ((response.config as any).loading) {
      (response.config as any).loading.close() // 如果有 loading, 则关闭
    }
    return response.data;
  },
  (error: any) => {
    if ((error.config as any).loading) {
      (error.config as any).loading.close()
    }
    // 错误处理
    if (error.response) {
      // 服务器返回了状态码，但状态码不在 2xx 范围内
      ElMessage({
        message: `服务器错误: ${error.response.status}`,
        type: 'error'
      })
    } else if (error.request) {
      // 浏览器发出了请求，但没有收到响应
      ElMessage({
        message: '网络异常，请求未收到响应',
        type: 'error'
      })
    } else {
      // 其他错误
      ElMessage({
        message: '请求发生错误',
        type: 'error'
      })
    }
    return Promise.reject(error)
  }
);

// 请求函数
const request = ({ url, params = {}, dataType = 'form', showLoading = false, method = 'post' }: CustomRequestConfig ) => {
  console.log(showLoading)
  console.log(method)
  // 确定 Content-Type 并处理参数
  let contentType = contentTypeForm
  if (dataType === 'json') {
    contentType = contentTypeJson
  } else if (dataType === 'file') {
    contentType = contentTypeFile
    const formData = new FormData()
    for (const key in params) {
      formData.append(key, params[key])
    }
    // 把 params 转换为 FormData 对象
    params = formData;
  }

  // instance.defaults.headers['Content-Type'] = contentType
  instance.defaults.headers = {
    'Content-Type': contentType
  }

  return instance[method](url, params).catch((error: any) => {
    ElMessage({
      message: error.message,
      type: 'error'
    })
    return null
  })
}

export default request