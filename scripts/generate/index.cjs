const fs = require('fs')
const path = require('path')

const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
})

async function confirm(question) {
    return new Promise((resolve) => {
        readline.question(`${question} (yes/no): `, (answer) => {
            resolve(answer.toLowerCase() === 'yes')
        })
    })
}

async function ask(question) {
    return new Promise((resolve) => {
        readline.question(`${question}: `, (answer) => {
            resolve(answer.trim())
        })
    })
}

async function generateModule() {
    const moduleName = await ask('请输入模块名称')
    if (!moduleName) {
        console.log('模块名称不能为空')
        readline.close()
        return
    }

    const useCurrentDir = await confirm('是否在当前目录下创建模块？')
    const basePath = useCurrentDir ? process.cwd() : await ask('请输入目标目录路径')

    if (!useCurrentDir && !fs.existsSync(basePath)) {
        console.log(`目录 ${basePath} 不存在，请检查路径`)
        readline.close()
        return
    }

    const framework = await ask('请选择框架 (react/vue): ')
    if (!['react', 'vue'].includes(framework.toLowerCase())) {
        console.log('框架选择无效，请输入 react 或 vue')
        readline.close()
        return
    }

    const modulePath = path.join(basePath, moduleName)

    if (!fs.existsSync(modulePath)) {
        const createModule = await confirm(`确认创建模块 ${moduleName} 目录？`)
        if (!createModule) {
            readline.close()
            return
        }

        fs.mkdirSync(modulePath, { recursive: true })

        // React 目录结构
        if (framework.toLowerCase() === 'react') {
            const reactDirs = ['assets/images', 'assets/styles', 'components', 'hooks', 'pages', 'utils']
            for (const dir of reactDirs) {
                const fullPath = path.join(modulePath, dir)
                fs.mkdirSync(fullPath, { recursive: true })
            }
        }

        // Vue 3 目录结构
        if (framework.toLowerCase() === 'vue') {
            const vueDirs = [
                'assets/images',
                'assets/styles',
                'components',
                'composables',
                'views',
                'router',
                'store'
            ]
            for (const dir of vueDirs) {
                const fullPath = path.join(modulePath, dir)
                fs.mkdirSync(fullPath, { recursive: true })
            }

            // Vue Router 默认配置
            const routerContent = `import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;`
            fs.writeFileSync(path.join(modulePath, 'router/index.ts'), routerContent)

            // Pinia 默认配置
            const piniaContent = `import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0,
  }),
  actions: {
    increment() {
      this.count++;
    },
  },
});`
            fs.writeFileSync(path.join(modulePath, 'stores/counter.ts'), piniaContent)
        }
    } else {
        console.log(`模块 ${moduleName} 已存在，跳过创建。`)
    }
    readline.close()
}

generateModule()
