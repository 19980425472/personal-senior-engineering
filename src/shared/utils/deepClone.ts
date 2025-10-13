// 全局深拷贝工具
export const deepClone = <T>(obj: T): T => {
    return JSON.parse(JSON.stringify(obj))
}
