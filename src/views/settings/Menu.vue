<script setup lang="ts">
import Card from '@/components/Card.vue'
</script>

<template>
  <div class="menu">
    <el-row :gutter="10">
      <el-col :span="7">
        <Card title="菜单管理" :titleStyle="{ fontSize: '16px' }">

        </Card>
      </el-col>
      <el-col :span="17">
        <Card title="菜单详情" :titleStyle="{ fontSize: '16px' }">

        </Card>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped lang="scss">

</style>
