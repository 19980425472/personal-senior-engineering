// 接口类型定义
export interface ApiResponse<T> {
    code: number
    message: string
    data: T
}
