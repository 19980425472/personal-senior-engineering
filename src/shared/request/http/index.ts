// 导出封装后的 axios 实例
import axios from 'axios'
import { setupInterceptors } from './interceptors.ts'

const http = axios.create({
    baseURL: '/api',
    timeout: 10000
})

// 设置拦截器
setupInterceptors(http)

export { http }
