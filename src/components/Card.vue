<script setup lang="ts">
type TitleStyle = {
  fontSize: string
}

type Props = {
  title?: string,
  titleStyle?: TitleStyle,
  borderBottom?: boolean
}

const { 
  title = '卡片标题',
  borderBottom = true,
  titleStyle = { fontSize: '20px' } 
} = defineProps<Props>()
</script>

<template>
  <div class="card">
    <el-card style="max-width: 1450px;" class="card-body" shadow="hover">
      <template #header>
        <div class="card-header">
          <span> {{ title }} </span>
        </div>
      </template>
      <slot></slot>
    </el-card>
  </div>
</template>

<style scoped lang="scss">
.card {
  :deep(.card-body) {
    padding: 15px;
    margin-bottom: 10px;

    .el-card__header {
      padding: 0;
      margin-bottom: 10px;
      padding-bottom: 10px;
      // 由 borderBottom 控制是否有下边框和下padding
      border-bottom: v-bind('borderBottom ? "var(--el-border-width) var(--el-border-style) var(--el-border-color)" : "none"');
      padding-bottom: v-bind('borderBottom ? "10px" : "0"');

      .card-header>span {
        font-size: v-bind('titleStyle.fontSize');
        font-weight: bold;
        color: #404756;
      }
    }

    .el-card__body {
      padding: 0;
    }
  }
}
</style>
