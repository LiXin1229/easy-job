import { ElMessage, ElMessageBox } from "element-plus"

export const confirmBox = (text: string, okFun: Function) => {
  ElMessageBox.confirm(
    `确定${text}吗？`,
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  )
  .then(() => {
    okFun()
  })
  .catch(() => {
    ElMessage({
      type: 'info',
      message: `取消${text}`,
    })
  })
}
