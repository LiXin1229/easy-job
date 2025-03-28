## node 版本

```
nvm use 22.11.0
```



## 创建项目

创建vue3+ts项目

```
$ npm create vue@latest
```



## 安装所有依赖

```
npm install axios echarts element-plus js-md5 sass sass-loader suneditor vue-cookies vue-router --save
```



## 登录页面

![](D:\EdgeDownload\jyshare-markmap.png)

#### 引入 ElementPlus

```
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
app.use(ElementPlus)

<!-- 引入图标库 -->
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

#### 引入 ElConfigProvider

```
<!-- 设置组件库的语言环境为中文 -->   <!-- 消息提示的配置 -->
<el-config-provider :locale="zhCn" :message="config">
  <router-view />
</el-config-provider>
```

#### 配置代理服务器

```
server: {
    hmr: true, // 热模块替换（Hot Module Replacement），把它设为 true 后，当你修改代码时，开发服务器能够在不刷新整个页面的情况下更新修改的模块，从而提升开发效率
    port: 4000, // 此配置指定了开发服务器所使用的端口号
    proxy: {
      "/api": { // 当请求的 URL 以 /api 开头时，就会触发代理规则
        target: "http://localhost:9091", // 当请求的 URL 以 /api 开头时，请求会被转发到 http://localhost:9091 这个地址
        changeOrigin: true, // 修改请求头中的 Origin 字段，使其与目标地址保持一致
        rewrite: (path) => path.replace(/^\/api/, '') // 对请求的路径进行重写，去掉 "/api"
      }
    }
  }
```

#### 自定义表单校验规则

```
const rules = reactive<FormRules<typeof ruleForm>>({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  passWord: [{ validator: validatePassWord, trigger: 'blur' }],
  checkCode: [{ validator: validateCheckCode, trigger: 'blur' }],
})
```

#### 封装 axios 拦截器

```
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

class HRequest {
  instance: AxiosInstance = axios.create()
  interceptors?: HRequestInterceptors
  showLoading: boolean = false
  loading?: LoadingInstance

  constructor(config: HRequestConfig) {
    this.RequestInterceptor()
    this.ResponseInterceptor()
  }

  // 添加请求拦截器
  private RequestInterceptor() {
    this.instance.interceptors.request.use(
      (config) => {
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

const hRequest = new HRequest({
  // baseURL: BASE_URL,
  timeout: 5000
})

export default hRequest

```

![](D:\其他\截屏\屏幕截图 2025-03-25 203728.png)

#### VueCookie 的使用

`vue-cookies` 是一个用于在 Vue.js 项目中操作 Cookie 的插件，它提供了的 API 来设置、获取和删除 Cookie

```
import VueCookies from 'vue-cookies'
app.config.globalProperties.VueCookies = VueCookies

// 把登录的信息存入 VueCookies
instance.appContext.config.globalProperties.VueCookies.set('loginInfo', loginInfo, '7d')

// 页面初始化时, 从 VueCookies 里拿数据
const { phone, passWord, remember } = instance.appContext.config.globalProperties.VueCookies.get('loginInfo') || {}
```

#### 路由守卫

```
router.beforeEach((to, from, next) => {
  const userInfo = sessionStorage.getItem('userInfo')
  if (!userInfo && to.path !== '/login') {
    router.push('/login')
  }
  next()
})
```



## 首页框架

![](D:\EdgeDownload\jyshare-markmap (2).png)

#### 首次登录或刷新页面时通过 route.path 激活菜单

```
onMounted(() => {
  initMenuMap() // 初始化路径图
  menuSelect(route.path, true) // 通过 route.path 和 路径图 激活菜单
})

// 存储当前激活的菜单路径, 下次刷新时渲染激活的菜单
const menuMap = ref<any>({})

// 通过图存储当前激活的菜单路径
const initMenuMap = () => {
  const menuList = userInfo.menuList
  for (let i = 0; i < menuList.length; i++) {
    const pMenu = menuList[i]
    menuMap.value[pMenu.menuUrl] = pMenu
    // 如果 pMenu 有 children
    if (pMenu.children) {
      for (let j = 0; j < pMenu.children.length; j++) {
        const sub = pMenu.children[j]
        sub["parentPath"] = pMenu.menuUrl
        menuMap.value[sub.menuUrl] = sub
      }
    }
  }
}

// 通过 route.path 重新渲染激活的菜单
const menuSelect = (currentPath: any, addTab: boolean) => {
  let currentMenu = menuMap.value[currentPath]
  if (currentMenu === null) {
    return
  }
  Object.assign(currentPmenu, menuMap.value[currentMenu.parentPath])
  Object.assign(currentSubMenu, currentMenu)
}
```
#### tab 操作

```
		 <!-- tab 结构 -->
          <el-tabs type="border-card" v-model="currentSubMenu.menuUrl" @tab-click="tabClick" 			@edit="editTab">
            <el-tab-pane
              v-for="i in tabList"
              :key="i.menuUrl"
              :label="i.menuName"
              :name="i.menuUrl"
              :closable="tabList.length > 1"
            >
              {{ i.menuUrl }}
            </el-tab-pane>
          </el-tabs>
          
// tab 操作
const tabList = reactive<any>([])

const addTabHandle = (currentMenu: any) => {
  if (tabList.find((sub: any) => sub.menuUrl === currentMenu.menuUrl)) return
  tabList.push(currentMenu)
}

const tabClick = (e: any) => {
  // console.log(e.props.name)
  menuSelect(e.props.name, true)
}

// 删除某个 tab
const editTab = (subName: any, actions: any) => {
  if (actions !== 'remove') return
  // console.log(subName)
  let currentUrl = toRef(currentSubMenu.menuUrl)
  if (subName === currentUrl.value) { // 删除的是当前选中的 tab
    tabList.forEach((tab: any, index: number) => {
      if (tab.menuUrl === subName) {
        const nextTab = tabList[index + 1] || tabList[index - 1]
        Object.assign(currentSubMenu, nextTab) // 当前的 currentSubMenu 变成 前一个tab 或者 后一个tab
        tabList.splice(index, 1) // 删除 选中的 tab
        menuSelect(currentSubMenu.menuUrl, false)
        return
      }
    })
  } else {
    // 只要删除该 tab 就行
    const newTabList =  tabList.filter((tab: any) => tab.menuUrl !== subName)
    tabList.length = 0
    tabList.push(...newTabList)
  }
```

