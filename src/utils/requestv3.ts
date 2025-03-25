// 引入 axios 
import type { AxiosRequestConfig, AxiosResponse } from 'axios';

// 定义接口
export interface HRequestInterceptors<T = AxiosResponse> {
  // 请求拦截器（成功与失败）
  requestInterceptors?: (config: AxiosRequestConfig) => AxiosRequestConfig;
  requestInterceptorsCatch?: (error: any) => any;
  // 相应拦截器（成功与失败） 
  responseInterceptor?: (res: T) => T;
  responseInterceptorCatch?: (error: any) => any;
  }
  // 继承接口: 定义每个请求的拦截器并且设置请求状态显示
  export interface HRequestConfig<T = AxiosResponse> extends AxiosRequestConfig {
  
  interceptors?: HRequestInterceptors<T>;
  // 是否展示请求加载状态
  showLoading?: boolean;
}

import axios from 'axios';
import { type AxiosInstance } from 'axios';
// 引入加载等待组件
import {
    ElLoading } from 'element-plus';
// 引入loading 类型：不同版本路劲不同
import { type LoadingInstance } from 'element-plus/es/components/loading/src/loading';

// 请求加载显示状态
const DEFAULT_LOADING = false;
class HRequest {
   
 // 类型
  instance: AxiosInstance;
  interceptors?: HRequestInterceptors;
  showLoading: boolean;
  loading?: LoadingInstance;

  constructor(config: HRequestConfig) {
   
    // 创建请求
    this.instance = axios.create(config);

    // 保存基本信息
    this.interceptors = config.interceptors;

    this.showLoading = config.showLoading ?? DEFAULT_LOADING;

    // 使用拦截器
    // 1.从config中获取的拦截器是对应的实例的拦截器
    this.instance.interceptors.request.use(
      // this.interceptors?.requestInterceptors,
      this.interceptors?.requestInterceptorsCatch
    );

    // 响应拦截类型
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    // 2.所有示实例的请求拦截
    this.instance.interceptors.request.use(
      (config) => {
   
        if (this.showLoading) {
   
          this.loading = ElLoading.service({
   
            lock: true,
            text: '请求加载中...',
            background: 'rgba(255,255,255,0.5)'
          });
        }
        return config;
      },
      (err) => {
   
        return err;
      }
    );
    // 所有实例响应拦截
    this.instance.interceptors.response.use(
      (res) => {
   
        // 通过http的错误码
        // 服务器返回的status
        const data = res.data;
        // 清除loading
        this.loading?.close();
        if (data.returnCode === '-1001') {
   
          console.log('请求失败,错误信息');
        } else {
   
          return data;
        }
      },
      (err) => {
   
        // 4xx -> 5xx 在这里拦截
        if (err.response.status == 404) {
   
          console.log('404 的错误');
        }
        return err;
      }
    );
  }

  request<T>(config: HRequestConfig<T>): Promise<T> {
   
    return new Promise((resolve, reject) => {
   
      // 1. 单个请求的cofig 的处理
      if (config.interceptors?.requestInterceptors) {
   
        config = config.interceptors.requestInterceptors(config);
      }
      // 判断是否显示loading
      if (config.showLoading) {
   
        this.showLoading = config.showLoading;
      }
      this.instance
        .request<any, T>(config)
        .then((res) => {
   
          if (config.interceptors?.responseInterceptor) {
   
            res = config.interceptors.responseInterceptor(res);
          }
          // 不影响下一个loading 的使用
          this.showLoading = DEFAULT_LOADING;
          // 返回结果
          resolve(res);
        })
        .catch((err) => {
   
          // 不影响下一个loading 的使用
          this.showLoading = DEFAULT_LOADING;
          reject(err);
        });
    });
  }

  // 对request 二次封装
  get<T>(config: HRequestConfig<T>): Promise<T> {
   
    return this.request<T>({
    ...config, method: 'GET' });
  }
  post<T>(config: HRequestConfig<T>): Promise<T> {
   
    return this.request<T>({
    ...config, method: 'POST' });
  }
  put<T>(config: HRequestConfig<T>): Promise<T> {
   
    return this.request<T>({
    ...config, method: 'PUT' });
  }
  delete<T>(config: HRequestConfig<T>): Promise<T> {
   
    return this.request<T>({
    ...config, method: 'DELETE' });
  }
}

const hRequest = new HRequest({
   
  // baseURL: BASE_URL,
  timeout: 5000,
  interceptors: {
   
    // requestInterceptors: (config) => {
   
    //   //  获取token 根据 自己 对token存储 获取
    //   const token = localCache.getCache({
    // key: 'token' });
    //   if (token && config.headers) {
   
    //     config.headers.Authorization = `Bearer ${
    //  token}`;
    //   }
    //   return config;
    // },
    // requestInterceptorsCatch(error) {
   
    //   return error;
    // },
    // responseInterceptor: (res) => {
   
    //   return res;
    // },
    // responseInterceptorCatch(error) {
   
    //   return error;
    // }
  }
});
export default hRequest;
