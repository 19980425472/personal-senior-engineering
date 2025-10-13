// 权限核心（权限判断、动态路由生成、权限指令）
export const checkPermission = (code: string): boolean => {
    // 权限检查逻辑
    return code === 'admin'
}
