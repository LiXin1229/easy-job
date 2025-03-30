<script setup lang="ts">
import Card from '@/components/Card.vue'
import Editor from '@/views/settings/MenuEditor.vue'
import { delMenu, getAllCategory } from '@/api/settings'
import { nextTick, onMounted, ref } from 'vue'
import { ElMessage, type ElTree } from 'element-plus'
import { confirmBox } from '@/utils/confirm'

const refTree = ref<InstanceType <typeof ElTree>>()

const treeProps = {
  label: 'menuName',
  children: 'children',
  value: 'menuId',
  class: 'cust-tree-item'
}

// 当前的 node
const currentNodeKey = ref<any>()

const treeData = ref<any>([])

// 加载菜单数据
const loadAllCategory = async() => {
  // const res = await getAllCategory()
  if (true) {
    treeData.value = [
      {
        menuId: 0,
        pId: -1,
        menuName: '所有菜单',
        menuType: 1,
        menuUrl: '',
        permissionCode: '',
        children: [
          {
            menuId: 1,
            menuName: '首页',
            menuType: 0,
            menuUrl: '/',
            permissionCode: 'home',
            children: [
              {
                menuId: 2,
                menuName: '首页',
                menuType: 1,
                menuUrl: '/',
                permissionCode: 'home',
              }
            ]
          },
          {
            menuId: 3,
            menuName: '内容管理',
            menuType: 0,
            menuUrl: '/content',
            permissionCode: 'content',
            children: [
              {
                menuId: 4,
                menuName: '分类管理',
                menuType: 0,
                menuUrl: '/content/category',
                permissionCode: 'category',
                children: [
                  {
                    menuId: 5,
                    menuName: '查看分类',
                    menuType: 1,
                    menuUrl: '/content/category',
                    permissionCode: 'category',
                  },
                  {
                    menuId: 6,
                    menuName: '新增/修改分类',
                    menuType: 1,
                    menuUrl: '/content/category',
                    permissionCode: 'category',
                  },
                  {
                    menuId: 7,
                    menuName: '删除分类',
                    menuType: 1,
                    menuUrl: '/content/category',
                    permissionCode: 'category',
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  }

  nextTick(() => {
    const data = treeData.value
    // 选择第一个菜单的最深层子菜单
    const firstNodeData = data[0].children[0] ? (data[0].children[0].children[0] ? data[0].children[0].children[0] : data[0].children[0]) : data[0]
    let currKey = firstNodeData.menuId
    if (!refTree.value) return
    refTree.value.setCurrentKey(currKey) // 树形控件已经选定 所有菜单 / 首页 / 首页
    // 渲染菜单详情
    const currNode = refTree.value.getNode(currKey)
    nodeClick(currNode.data, currNode)
  })
}

const detailData = ref<any>({})

// 点击菜单渲染菜单详情
const nodeClick = (data: any, node: any) => {
  // console.log(node.data === data)
  const menuNames: any = []
  getMenuNames(node, menuNames)
  data.menuNames = menuNames
  detailData.value = data
}

// 递归获取菜单层级
const getMenuNames = (node: any, menuNames: any) => {
  if (node.data.menuName) {
    menuNames.unshift(node.data.menuName)
  }
  if (node.parent) {
    getMenuNames(node.parent, menuNames)
  }
}

// 删除菜单
const deleteMenu = (data: any) => {
  confirmBox('删除菜单', async () => {
    const res = await delMenu(data.menuId)
    if (!res) return
    ElMessage({
      type: 'success',
      message: '成功删除菜单'
    })
  })
}

const menuEditor = ref()

// 编辑菜单
const editMenu = (type: string, data: any) => {
  menuEditor.value.showDialog(type, data)
}

onMounted(() => {
  loadAllCategory()
})
</script>

<template>
  <Editor ref="menuEditor" :treeData="treeData" />
  <div class="menu">
    <el-row :gutter="10">
      <el-col :span="7">
        <Card title="菜单管理" :titleStyle="{ fontSize: '16px' }">
          <el-tree
            ref="refTree"
            style="max-width: 600px"
            :highlight-current="true"
            :expand-on-click-node="false"
            default-expand-all
            node-key="menuId" 
            :data="treeData"
            :props="treeProps"
            @node-click="nodeClick"
            class="tree-panel"
          >
            <template #default="{ data }">
              <div class="custom-node-style">
                <span class="node-title">{{ data.menuName }}</span>
                <div>
                  <el-dropdown trigger="click">
                    <span class="el-dropdown-link">
                      <el-icon class="el-icon-more">
                        <MoreFilled />
                      </el-icon>
                    </span>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="editMenu('add', data)">添加子菜单</el-dropdown-item>
                        <el-dropdown-item v-if="data.pId !== -1" @click="editMenu('edit', data)">修改</el-dropdown-item>
                        <el-dropdown-item v-if="data.pId !== -1" @click="deleteMenu">删除</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </template>
          </el-tree>
        </Card>
      </el-col>
      <el-col :span="17">
        <Card title="菜单详情" :titleStyle="{ fontSize: '16px' }">
          <el-form
            label-width="120px"
            class="detail-form"
            :model="detailData"
          >
            <el-form-item label="菜单ID：">
              {{ detailData.menuId }}
            </el-form-item>
            <el-form-item label="菜单名称：">
              {{ detailData.menuName }}
            </el-form-item>
            <el-form-item label="菜单层级：">
              <el-breadcrumb
                separator-class="el-icon-arrow-right"
                :style="{ 'line-height': '40px' }"
              >
                <el-breadcrumb-item
                  v-for="(item, index) in detailData.menuNames"
                  :key="index"
                >{{ item }}
                </el-breadcrumb-item>
              </el-breadcrumb>
            </el-form-item>
            <el-form-item label="菜单类型：">
              {{ detailData.menuType == 0 ? "菜单" : "按钮" }}
            </el-form-item>
            <el-form-item label="请求路径：">
              {{ detailData.menuUrl? detailData.menuUrl : "-" }}
            </el-form-item>
            <el-form-item label="权限编码：">
              {{ detailData.permissionCode }}
            </el-form-item>
          </el-form>
        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">
.menu {
  :deep(.tree-panel) {
    .el-tree-node__content {
      height: 36px;
    }

    .custom-node-style {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .node-title {
        font-size: 14px;
      }
    }

    .el-dropdown-link {
      margin-top: 3px;
      margin-right: 10px;
    }
  }
}
</style>
