import request from '@/utils/hRequest'

export const getAllCategory = () => {
  return request.post({
    url: '/category/loadAllCategory'
  })
}

export const delMenu = (menuId: string) => {
  return request.post({
    url: '/settings/delMenu',
    params: {
      menuId
    }
  })
}

export const saveMenu = (params: any) => {
  return request.post({
    url: '/settings/saveMenu',
    params
  })
}
