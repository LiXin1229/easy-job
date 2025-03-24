<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { reactive } from 'vue'
import { RouterView } from 'vue-router'

const config = reactive({
  max: 1
})
</script>

<template>
  <div class="App">
    <!-- 设置组件库的语言环境为中文 -->   <!-- 消息提示的配置 -->
    <el-config-provider :locale="zhCn" :message="config">
      <router-view />
    </el-config-provider>
  </div>
</template>

<style scoped>
</style>
