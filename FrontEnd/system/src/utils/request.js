import axios from 'axios'

// 创建 axios 实例
const request = axios.create({
  baseURL: '', // 移除 baseURL，因为我们在具体请求中指定完整路径
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: false // 如果不需要携带cookie，设置为false
})

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 可以在这里添加 token
    // if (store.getters.token) {
    //   config.headers['Authorization'] = 'Bearer ' + store.getters.token
    // }
    return config
  },
  error => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
request.interceptors.response.use(
  response => {
    if (response.data.code === 0) {
      return response.data
    }
    return Promise.reject(new Error(response.data.message || '请求失败'))
  },
  error => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

export default request 