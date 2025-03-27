<script setup lang="ts">
import { logout } from '@/api/layout'
import Dialog from '@/components/Dialog.vue'
import { confirmBox } from '@/utils/confirm'
import { onMounted, reactive, ref, toRef } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const userInfo = reactive(JSON.parse((sessionStorage.getItem('userInfo') as string)))
// console.log(userInfo)

type MenuType = {
  menuName: string
  menuUrl: string
  icon: string
  children: string[]
}

// 当前一级菜单
const currentPmenu = reactive<any>({})

// 当前二级菜单
const currentSubMenu = reactive<any>({})

const pMenuClickHandler = (ele: MenuType) => {
  // console.log(ele)
  Object.assign(currentPmenu, ele) // 把点击的一级路由存到 currentPmenu
  let firstSubMenu = ele.children[0]
  jump(firstSubMenu)
}

// 弹出二级菜单
const jump = (ele: any) => {
  if (currentSubMenu.menuUrl === ele.menuUrl) return
  Object.assign(currentSubMenu, ele)
  router.push(ele.menuUrl)
  addTabHandle(ele)
}

// 存储当前激活的菜单路径, 下次刷新时渲染激活的菜单
const menuMap = ref<any>({})

// 通过图存储菜单路径
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

// 通过 route.path 重新激活选中的菜单
const menuSelect = (currentPath: any, addTab: boolean) => {
  let currentMenu = menuMap.value[currentPath]
  if (currentMenu === null) {
    return
  }
  Object.assign(currentPmenu, menuMap.value[currentMenu.parentPath])
  Object.assign(currentSubMenu, currentMenu)
  if (addTab) {
    addTabHandle(currentMenu)
  }
}

onMounted(() => {
  initMenuMap() // 初始化路径图
  menuSelect(route.path, true) // 通过 route.path 和 路径图 激活菜单
})

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
}

// 退出
const handleLogout = () => {
  confirmBox(async () => {
    // const res = await logout()
    sessionStorage.removeItem('userInfo')
    router.push('/login')
  })
}

// 修改密码
let showDialog = ref(false)
const modifyPwd = () => {
  showDialog.value = true
}
const closeDialog = () => {
  showDialog.value = false
}
</script>

<template>
  <div class="layout">
    <Dialog v-if="showDialog" :showDialog="showDialog" @closeDialog="closeDialog" />
    <div class="header">
      <div class="logo">EasyJob 后台管理系统</div>
      <div class="user">
        欢迎回来，
        <el-dropdown class="user-dropdown">
          <span class="user-name">
            {{ userInfo.userName }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="modifyPwd">修改密码</el-dropdown-item>
              <el-dropdown-item @click="handleLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <div class="body">
      <div class="left-sider">
        <div class="menu-list">
          <div v-for="(i, index) in userInfo.menuList" :key="index">
            <div :class="['item', i.menuUrl === currentPmenu.menuUrl ? 'active' : '']"  @click="pMenuClickHandler(i)">
              <div class="icon"><el-icon size="25" color="#fff" v-if="i.icon === 'home'"><House /></el-icon></div>
              <div class="icon"><el-icon size="25" color="#fff" v-if="i.icon === 'content'"><DocumentCopy /></el-icon></div>
              <div class="icon"><el-icon size="25" color="#fff" v-if="i.icon === 'app'"><Iphone /></el-icon></div>
              <div class="icon"><el-icon size="25" color="#fff" v-if="i.icon === 'settings'"><Setting /></el-icon></div>
              <div class="text">{{ i.menuName }}</div>
            </div>
          </div>
        </div>
        <div class="menu-sub-list">
          <div
            :class="['item', i.menuUrl === currentSubMenu.menuUrl ? 'active' : '']"
            v-for="(i, index) in currentPmenu.children"
            :key="index"
          >
            {{ i.menuName }}
          </div>
        </div>
      </div>
      <div class="main-content">
        <div class="tag-content">
          <!-- tab 结构 -->
          <el-tabs type="border-card" v-model="currentSubMenu.menuUrl" @tab-click="tabClick" @edit="editTab">
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
        </div>
        <div class="body-content">
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.layout {
  height: calc(100vh);
  width: calc(100vw);

  .header {
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #C0C4CC;

    .logo {
      font-size: 24px;
      font-weight: bold;
      color: #409EFF;
    }

    .user-dropdown {
      line-height: 60px;

      .user-name {
      color: #409EFF;
      font-style: italic;
    }
    }
  }

  .body {
    display: flex;
    justify-content: left;

    .left-sider {
      display: flex;
      justify-content: left;
      width: 220px;

      .menu-list {
        width: 65px;
        height: calc(100vh - 60px);
        background-color: #303133;

        .item {
          display: flex;
          flex-direction: column;
          text-align: center;
          height: 65px;
          font-size: 13px;
          padding-top: 12px;

          .icon {
            margin: 0 auto;
          }

          .text {
            position: relative;
            top: -5px;
            color: #fff;
          }
        }

        .active {
          background-color: #409EFF;
        }
      }

      .menu-sub-list {
        padding: 5px;
        width: 155px;

        .item {
          width: 100%;
          padding-left: 10px;
          margin-bottom: 5px;
          height: 30px;
          line-height: 30px;
          font-size: 13px;
        }

        .active {
          background-color: rgb(231, 244, 255);
          color: rgb(51.2, 126.4, 204);
        }
      }
    }
  }
}
</style>
