// 系统初始化（app挂载、全局组件注册、初始化状态）
import { createApp } from 'vue'
import App from '../../../App.vue'

export const initApp = () => {
    const app = createApp(App)
    // 全局组件注册
    app.mount('#app')
}
