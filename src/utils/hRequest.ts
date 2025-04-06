import router from '@/router'
import axios from 'axios'
import type { AxiosRequestConfig, AxiosResponse, AxiosInstance } from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
import { type LoadingInstance } from 'element-plus/es/components/loading/src/loading'

export interface HRequestInterceptors<T = AxiosResponse> {
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig
  requestInterceptorsCatch?: (error: any) => any
  responseInterceptor?: (res: T) => T
  responseInterceptorCatch?: (error: any) => any
}

export interface HRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  interceptors?: HRequestInterceptors<T> // 自定义函数 对请求前或请求后的数据进行处理
  showLoading?: boolean
}

// console.log(import.meta.env.MODE)
const BASE_URL = import.meta.env.VITE_API_BASE_URL

class HRequest {
  instance: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 5000
  })
  interceptors?: HRequestInterceptors
  showLoading: boolean = false
  loading?: LoadingInstance

  constructor() {
    this.RequestInterceptor()
    this.ResponseInterceptor()
  }

  // 添加请求拦截器
  private RequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
        // console.log('Request Config:', config); // 输出请求配置
        if (this.showLoading) {
          this.loading = ElLoading.service({
            lock: true,
            text: '加载中......',
            background: 'rgba(255, 255, 255, 0.5)'
          })
        }
        return config
      },
      (err) => {
        this.loading?.close()
        ElMessage({
          message: `请求发送失败`,
          type: 'error'
        })
        console.log(err)
        return Promise.reject(err)
      }
    )
  }

  // 添加响应拦截器
  private ResponseInterceptor() {
    this.instance.interceptors.response.use(
      (res) => {
        const data = res.data
        this.loading?.close()
        if (data.code === 200) {
          return data
        } else if (data.code === 901) { // 登录超时
          setTimeout(() => {
            router.push('/login')
          }, 2000)
        }
      },
      (err) => {
        this.loading?.close()
        ElMessage({
          message: `请求接收失败`,
          type: 'error'
        })
        console.log(err)
        return Promise.reject(err)
      }
    )
  }

  request<T>(config: HRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (config.interceptors?.requestInterceptors) {
        config = config.interceptors.requestInterceptors(config)
      }
      if (config.showLoading) {
        this.showLoading = config.showLoading
      }

      this.instance
       .request<any, T>(config)
       .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res)
          }
          this.showLoading = false
          resolve(res)
        })
       .catch((err) => {
          this.showLoading = false
          reject(err)
        })
    })
  }

  // 对 request 二次封装
  get<T>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({
     ...config,
      method: 'GET'
    })
  }
  post<T>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({
     ...config,
      method: 'POST'
    })
  }
  put<T>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({
     ...config,
      method: 'PUT'
    })
  }
  delete<T>(config: HRequestConfig<T>): Promise<T> {
    return this.request<T>({
     ...config,
      method: 'DELETE'
    })
  }
}

const hRequest = new HRequest()

export default hRequest
