<script setup lang="ts">
import { getCurrentInstance, nextTick, onMounted, reactive, ref, type ComponentInternalInstance } from 'vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { md5 } from 'js-md5'
import { getCheckCode, toLogin } from '@/api/login'
import { useRouter } from 'vue-router'
import { validateCheckCode, validatePassWord, validatePhone } from '@/utils/validate'

const router = useRouter()
const instance = getCurrentInstance() as ComponentInternalInstance

// 验证码
let checkCode = ref('')
let checkCodeSrc = ref('')
const setCheckCode = async() => {
  try {
    const res = await getCheckCode()
    console.log(res.data)
    checkCodeSrc.value = res.data.image
  } catch (error) {
    ElMessage({
      message: `验证码获取失败`,
      type: 'error'
    })
  }
}

const init = () => {
  setCheckCode();
  (<FormInstance>ruleFormRef.value).resetFields()
  // 从 VueCookies 里拿数据
  const { phone, passWord, remember } = instance.appContext.config.globalProperties.VueCookies.get('loginInfo') || {}
  ruleForm.phone = phone
  ruleForm.passWord = passWord
  ruleForm.remember = remember
}

onMounted(() => {
  nextTick(() => {
    init()
  })
})

// 表单验证
const ruleFormRef = ref<FormInstance>()

const ruleForm = reactive({
  phone: '',
  passWord: '',
  checkCode: '',
  remember: false
})

const rules = reactive<FormRules<typeof ruleForm>>({
  phone: [{ validator: validatePhone, trigger: 'blur' }],
  passWord: [{ validator: validatePassWord, trigger: 'blur' }],
  checkCode: [{ validator: validateCheckCode, trigger: 'blur' }],
})

// 登录逻辑
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async(valid) => {
    if (valid) {
      let params = {
        phone: ruleForm.phone,
        passWord: md5(ruleForm.passWord), // 使用 md5 加工密码
        checkCode: ruleForm.checkCode
      }
      const res: any = await toLogin(params)
      if (!res) {
        return
      }
      if (ruleForm.remember) {
        const loginInfo = {
          phone: ruleForm.phone,
          passWord: ruleForm.passWord,
          remember: ruleForm.remember
        }
        // 把登录的信息存入 VueCookies
        instance.appContext.config.globalProperties.VueCookies.set('loginInfo', loginInfo, '7d')
      } else {
        instance.appContext.config.globalProperties.VueCookies.remove('loginInfo')
      }

      console.log(res)
      const userInfo = res.data
      // const userInfo = {
      //   userName: "李信",
      //   menuList: [
      //     {
      //       "menuName": "首页", "menuUrl": "/", "icon": "home", "children": [
      //         { "menuName": "首页", "menuUrl": "/home" }
      //       ]
      //     },
      //     { "menuName": "内容管理", "menuUrl": "/content", "icon": "content", "children": [
      //         { "menuName": "分类管理", "menuUrl": "/cntent/category" },
      //         { "menuName": "八股文管理", "menuUrl": "/content/bagu" },
      //         { "menuName": "题库管理", "menuUrl": "/content/tiku" },
      //         { "menuName":"经验分享", "menuUrl": "/content/jinyan" }
      //       ]
      //     },
      //     { "menuName": "app", "menuUrl": "/app", "icon": "app", "children": [] },
      //     { "menuName": "设置", "menuUrl": "/setting", "icon": "settings", "children": [
      //         { "menuName": "菜单管理", "menuUrl": "/settings/menu" },
      //         { "menuName": "角色管理", "menuUrl": "/settings/juese" },
      //         { "menuName": "系统用户", "menuUrl": "/settings/xitongyonghu" }
      //       ]
      //     }
      //   ]
      // }
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      ElMessage({
        message: `登录成功`,
        type: 'success'
      })
      router.replace({
        path: '/home'
      })
    } else {
      ElMessage({
        message: `登录失败`,
        type: 'error'
      })
      setCheckCode()
    }
  })
}
</script>

<template>
  <div class="login">
    <div class="login-form">
      <div class="login-title">EasyJob 管理后台</div>
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        status-icon
        :rules="rules"
        size="large"
        label-width="auto"
        class="demo-ruleForm"
      >
        <el-form-item prop="phone">
          <el-input v-model="ruleForm.phone" autocomplete="off" placeholder="请输入手机号">
            <!-- 插入图标 -->
            <template #prefix>
              <el-icon><Iphone /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="passWord">
          <el-input
            v-model="ruleForm.passWord"
            type="password"
            show-password
            autocomplete="off"
            placeholder="请输入密码"
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="checkCode" class="check-code-box">
          <el-input v-model="ruleForm.checkCode" placeholder="请输入验证码" class="check-code-input" maxlength="4">
            <template #prefix>
              <el-icon><ChatLineSquare /></el-icon>
            </template>
          </el-input>
          <div class="check-code" @click="setCheckCode">
            <img :src="checkCodeSrc" alt="">
          </div>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="ruleForm.remember" name="type" size="small">
            记住我
          </el-checkbox>
        </el-form-item>
        <el-form-item size="default">
          <el-button type="primary" class="login-btn" @click="submitForm(ruleFormRef)">
            登录
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login {
  position: relative;
  height: calc(100vh);
  width: calc(100vw);
  background: url("../assets/Login/login-bg.png");
  background-size: cover;
}

.login-form {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  width: 400px;
  // height: 300px;
  padding: 30px;
  border-radius: 10px;

  .login-title {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #606266;
  }

  .login-btn {
    width: 100%;
  }

  .check-code-box {
    position: relative;

    .check-code-input {
      width: 50%;
    }

    .check-code {
      width: 45%;
      position: absolute;
      top: 0;
      left: 185px;

      img {
        width: 100%;
        height: 40px;
      }
    }
  }
}
</style>
