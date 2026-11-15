import request from '@/utils/request'

export const dept = () => {
  return request.get('/depts')
}

export const addDept = (data) => {
  return request.post('/depts', data)
}

export const queryById = (id) => {
  return request.get(`/depts/${id}`)
}

export const updateDept = (dept) => {
  return request.put('/depts', dept)
}

export const deleteDept = (id) => {
  return request.delete(`/depts?id=${id}`)
}