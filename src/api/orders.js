import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: `${process.env.BASE_API}/api/order/list/33770`,
    method: 'get',
    params: query
  })
}
export function updateOrder(data) {
  return request({
    url: `${process.env.BASE_API}/api/order/update`,
    method: 'post',
    data
  })
}
