// 全局接口基础（axios封装、错误处理、请求拦截）
import axios from 'axios'

const instance = axios.create({
    baseURL: '/api',
    timeout: 10000
})

export default instance
