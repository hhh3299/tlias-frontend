import request from '@/utils/request'
export const queryPageApi = (name,gender,begin,end,page,pageSize) =>
  request.get(`/emps?name=${name}&gender=${gender}&begin=${begin}&end=${end}&page=${page}&pageSize=${pageSize}`)

// 新增