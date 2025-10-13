// 请求/响应拦截器逻辑
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'

export function setupInterceptors(http: AxiosInstance) {
    // 请求拦截器
    http.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            // 添加全局请求头（如 Token）
            const token = localStorage.getItem('token')
            if (token) {
                config.headers.Authorization = `Bearer ${token}`
            }
            return config
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        }
    )

    // 响应拦截器
    http.interceptors.response.use(
        (response: AxiosResponse) => {
            return response.data
        },
        (error: AxiosError) => {
            // 统一错误处理
            if (error.response?.status === 401) {
                // Token 过期或未认证
                window.location.href = '/login'
            }
            return Promise.reject(error)
        }
    )
}
