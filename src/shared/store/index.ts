// 全局状态管理（Pinia）
import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
    state: () => ({
        userInfo: null,
        appTheme: 'light',
        permissionCodes: []
    }),
    actions: {
        // 方法定义
    }
})
