import axios from 'axios'
import { ElMessage } from 'element-plus'
import router from '../router'

//创建axios实例对象
const request = axios.create({
  baseURL: '/api',
  timeout: 600000
})

//axios的请求拦截器：自动携带 token
request.interceptors.request.use(
  (config) => {
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user && user.token) {
          config.headers.token = user.token
        }
      } catch (e) {
        // localStorage 数据损坏时忽略
      }
    }
    // 必须 return config，否则 axios 拿不到配置，请求发不出去
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

//axios的响应 response 拦截器
request.interceptors.response.use(
  (response) => { //成功回调
    return response.data
  },
  (error) => { //失败回调
    // 后端没启动 / 断网时，error.response 是 undefined，直接取 .status 会报 TypeError
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error('登录失效，请重新登录')
        localStorage.removeItem('user')
        router.push('/login')
      } else {
        // 后端 Result 的错误信息字段名是 msg（不是 message）
        ElMessage.error(error.response.data?.msg || '请求失败')
      }
    } else {
      ElMessage.error('网络异常，无法连接服务器')
    }
    // 必须 reject，否则调用方 await 拿到 undefined，后面 result.code 会报错
    return Promise.reject(error)
  }
)

export default request
