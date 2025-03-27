<script setup lang="ts">
import { updatePwd } from '@/api/layout'
import { validatePassWord, validateNewPassWord2, validateOriPassWord } from '@/utils/validate'
import { ElMessage, type FormRules, type FormInstance } from 'element-plus'
import { md5 } from 'js-md5'
import { reactive, ref, watchEffect } from 'vue'

const { showDialog } = defineProps(['showDialog'])
const emits = defineEmits<{
  closeDialog: []
}>()

const dialogFormVisible = ref(false)
const formLabelWidth = '140px'

// 控制 Dialog 的显示与隐藏
watchEffect(() => {
  if (showDialog) {
    dialogFormVisible.value = true
  } else {
    dialogFormVisible.value = false
  }
})

const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  oriPassWord: '',
  newPassWord: '',
  newPassWord2: ''
})

const rules = reactive<FormRules<typeof ruleForm>>({
  oriPassWord: [{ validator: validateOriPassWord, trigger: 'blur' }],
  newPassWord: [{ validator: validatePassWord, trigger: 'blur' }],
  newPassWord2: [{ validator: validateNewPassWord2, trigger: 'blur' }],
})

// 提交密码
const changePassWord = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      let params = {
        passWord: md5(ruleForm.newPassWord)
      }
      // const res = await updatePwd(params)
      const res = true
      if (!res) return
      ElMessage({
        message: `修改成功`,
        type: 'success'
      })
      emits('closeDialog')
    }
  })
}

// 关闭前的回调
const closeDialog = (done: Function) => {
  emits('closeDialog')
  done
}
</script>

<template>
  <div class="dialog">
    <el-dialog v-model="dialogFormVisible" title="修改密码" width="500" :close-on-click-modal="false" :before-close="closeDialog">
      <el-form :model="ruleForm" ref="ruleFormRef" :rules="rules" status-icon>
        <el-form-item prop="oriPassWord" label="输入原密码" :label-width="formLabelWidth" type="password" show-password>
          <el-input v-model="ruleForm.oriPassWord" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPassWord" label="输入新密码" :label-width="formLabelWidth" type="password" show-password>
          <el-input v-model="ruleForm.newPassWord" autocomplete="off" />
        </el-form-item>
        <el-form-item prop="newPassWord2" label="再次输入新密码" :label-width="formLabelWidth" type="password" show-password>
          <el-input v-model="ruleForm.newPassWord2" autocomplete="off" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeDialog">取消</el-button>
          <el-button type="primary" @click="changePassWord(ruleFormRef)">
            确认
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
</style>
