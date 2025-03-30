<script setup lang="ts">
import { saveMenu } from '@/api/settings'
import { type FormRules, type FormInstance, ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'

const dialogConfig = ref<any>({
  show: false,
  title: ''
})

const showDialog = (type: string, data: any) => {
  dialogConfig.value.show = true
  treeData.value = props.treeData

  switch (type) {
    case 'add':
      dialogConfig.value.title = '新增菜单'
      ruleForm.value.pId = data.menuId
      break;
    case 'edit':
      dialogConfig.value.title = '修改菜单'
      ruleForm.value.pId = data.menuId
      ruleForm.value.menuName = data.menuName
      ruleForm.value.menuType = data.menuType
      ruleForm.value.menuUrl = data.menuUrl
      ruleForm.value.permissionCode = data.permissionCode
      break;
  }
}

const closeDialog = () => {
  dialogConfig.value.show = false
}

// 表单逻辑
const ruleFormRef = ref<FormInstance>()

const rules = reactive<FormRules<typeof ruleForm>>({
  menuName: [{ required: true, message: '请输入名称' }],
  menuType: [{ required: true, message: '请选择类型' }],
  menuUrl: [{ required: true, message: '请输入路径' }],
  permissionCode: [{ required: true, message: '请输入权限编码' }],
  // pId: [{ required: true, message: '请选择父菜单' }]
})

const ruleForm = ref({
  menuName: '',
  menuType: 0,
  menuUrl: '',
  permissionCode: '',
  pId: 0
})

// 树形控件逻辑
const props = defineProps(['treeData'])

const treeData = ref<any>([])

const treeProps = {
  label: 'menuName',
  children: 'children',
  value: 'menuId',
  class: 'cust-tree-item'
}

const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      const params = {
        menuId: ruleForm.value.pId,
        menuName: ruleForm.value.menuName,
        menuType: ruleForm.value.menuType,
        menuUrl: ruleForm.value.menuUrl,
      }
      // const res = await saveMenu(params)
      const res = true
      console.log(params)
      if (!res) return
      ElMessage({
        message: `修改成功`,
        type: 'success'
      })
      closeDialog()
    }
  })
}

defineExpose({showDialog})
</script>

<template>
  <div>
    <el-dialog v-model="dialogConfig.show" :title="dialogConfig.title" width="500" :close-on-click-modal="false" :before-close="closeDialog">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="ruleForm.menuName" autocomplete="off" />
        </el-form-item>
        <el-form-item label="父级菜单" prop="pId" v-if="ruleForm.pId !== 0">
          <el-tree-select
            ref="refTree"
            style="max-width: 600px"
            :highlight-current="true"
            :expand-on-click-node="false"
            default-expand-all
            node-key="menuId"
            v-model="ruleForm.pId"
            :data="treeData"
            :props="treeProps"
            show-search
            check-strictly
            class="tree-panel"
          >
          </el-tree-select>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="ruleForm.menuType">
            <el-radio :value="0">菜单</el-radio>
            <el-radio :value="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="请求路径" prop="menuUrl" v-if="ruleForm.menuType == 0">
          <el-input v-model="ruleForm.menuUrl" autocomplete="off" />
        </el-form-item>
        <el-form-item label="权限编码" prop="permissionCode">
          <el-input v-model="ruleForm.permissionCode" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="submit(ruleFormRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">

</style>
