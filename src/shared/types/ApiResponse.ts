// 全局接口响应类型
export interface ApiResponse<T> {
    code: number
    data: T
    message: string
}
