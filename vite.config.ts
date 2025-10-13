import vue from '@vitejs/plugin-vue' // 引入 Vue 插件
import AutoImport from 'unplugin-auto-import/vite'
import path from 'path'

import { dynamicAliasPlugin, generateAlias } from './src/core/auto-config/alias-generator.ts'

const fileDir = path.resolve(__dirname, 'src')
const aliasOptions = {
    aliasPrefix: '@',
    targetDir: fileDir,
    depth: 3,
    excludeDirs: [],
    specialDirs: { modules: 2 }
}

// 2. 生成初始别名（与插件内部保持一致）
const baseAlias = await generateAlias(aliasOptions)

const config = {
    plugins: [
        vue(),
        dynamicAliasPlugin({
            generateAlias: generateAlias
        }),
        AutoImport({
            imports: ['vue', 'pinia']
        })
    ],
    resolve: {
        alias: baseAlias
    }
}
// console.log("config", config.resolve.alias);

export default config
