import request from '@/utils/hRequest'

export const getAllData = () => {
  return request.post({
    url: '/index/getAllData'
  })
}

export const getAppWeekData = () => {
  return request.post({
    url: '/index/getAppWeekData'
  })
}

export const getContentWeekData = () => {
  return request.post({
    url: '/index/getContentWeekData'
  })
}
