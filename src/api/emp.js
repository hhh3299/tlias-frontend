import request from '@/utils/request'

// 登录（POST /login，body 是 { username, password }）
export const loginApi = (data) => {
  return request.post('/login', data)
}

// 分页查询员工列表
// params: { name, gender, begin, end, page, pageSize }
export const queryPageApi = (params) => {
  return request.get('/emps', { params })
}

// 根据ID查询员工信息（修改回显用）
export const queryInfoApi = (id) => {
  return request.get(`/emps/${id}`)
}

// 新增员工
export const addApi = (data) => {
  return request.post('/emps', data)
}

// 修改员工
export const updateApi = (data) => {
  return request.put('/emps', data)
}

// 删除员工（后端 DELETE /emps?ids=...）
// 单个删除：deleteApi(5)        -> /emps?ids=5
// 批量删除：deleteApi([1,2,3])  -> /emps?ids=1,2,3（数组自动转成逗号分隔）
export const deleteApi = (ids) => {
  return request.delete(`/emps?ids=${ids}`)
}
