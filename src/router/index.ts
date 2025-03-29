import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/views/Login.vue'
import Layout from '@/views/Layout.vue'
import Home from '@/views/home/Home.vue'
import CategoryList from '@/views/content/CategoryList.vue'
import Menu from '@/views/settings/Menu.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Layout,
      children: [
        {
          path: '/home',
          component: Home
        },
        {
          path: '/content/category',
          component: CategoryList
        },
        {
          path: '/settings/menu',
          component: Menu
        }
      ]
    }
  ]
})

// 路由守卫
router.beforeEach((to, from, next) => {
  const userInfo = sessionStorage.getItem('userInfo')
  if (!userInfo && to.path !== '/login') {
    router.push('/login')
  }
  next()
})

export default router
