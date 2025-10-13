// 用户模块路由（局部路由）
import type { RouteRecordRaw } from 'vue-router'

export const userRoutes: RouteRecordRaw[] = [
    {
        path: '/user/list',
        component: () => import('./views/UserList.vue')
    },
    {
        path: '/user/detail/:id',
        component: () => import('./views/UserDetail.vue')
    }
]
