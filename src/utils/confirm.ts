import { ElMessage, ElMessageBox } from "element-plus"

export const confirmBox = (okFun: Function) => {
  ElMessageBox.confirm(
    '确定退出吗？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  )
  .then(() => {
    ElMessage({
      type: 'success',
      message: '成功退出',
    })
    okFun()
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: '取消退出',
    })
  })
}
