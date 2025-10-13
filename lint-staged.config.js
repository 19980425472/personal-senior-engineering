// const fs = require('fs')
// const path = require('path')
// const checkVueFilename = require('./scripts/check-vue-filename.mjs')
export default {
    // 1. 脚本文件（TS/JS/JSX/TSX）：语法+类型+安全校验
    '*.{ts,js,tsx,jsx}': [
        // ESLint自动修复（含TS、安全规则）
        // 'eslint --fix --plugin @typescript-eslint --plugin security --plugin import',
        // Prettier格式化
        'prettier --write'
        // 大型文件额外做复杂度检查（>50KB）
        // (files) => {
        //     // 拼接绝对路径，避免相对路径解析问题
        //     const resolvePath = (file) => path.resolve(file)

        //     const largeFiles = files.filter((file) => {
        //         try {
        //             // 用绝对路径获取文件信息
        //             const stats = fs.statSync(resolvePath(file))
        //             return stats.size > 1024 * 50 // 50KB
        //         } catch (e) {
        //             if (e.code !== 'ENOENT') {
        //                 // 忽略"文件不存在"错误（可能已被删除）
        //                 throw e
        //             }
        //             return false
        //         }
        //     })

        //     if (largeFiles.length === 0) {
        //         // 无大文件时返回无操作命令，避免空字符串
        //         return 'echo "No large files to check"'
        //     }

        //     // 用单引号包裹每个文件路径，处理空格等特殊字符
        //     const quotedFiles = largeFiles.map((file) => `'${resolvePath(file)}'`).join(' ')

        //     // 返回构建好的 ESLint 命令
        //     return `eslint --rule "sonarjs/cognitive-complexity: [error, 8]" ${quotedFiles}`
        // }
    ],

    // 2. Vue单文件组件：全维度校验
    '*.vue': [
        // checkVueFilename, // 自定义Vue文件名校验
        // ESLint修复（Vue模板+脚本）
        // 'eslint --fix --plugin vue --plugin security',
        // Prettier格式化（覆盖template/style）
        'prettier --write'
        // Vue模板类型检查（vue-tsc）
        // 'vue-tsc --noEmit --skipLibCheck'
    ],

    // 3. TypeScript全量类型校验（延迟执行，避免重复）
    '*.ts': () => 'tsc --noEmit --skipLibCheck --strict',

    // 4. 样式文件：格式+语法校验
    // '*.{css,scss,sass,less}': [
    //     'prettier --write',
    //     'stylelint --fix --allow-empty-input' // 样式lint（需配置.stylelintrc）
    // ],

    // 5. 配置/文档文件：格式+合法性校验
    // '*.{json,json5,yml,yaml}': [
    //     'prettier --write',
    //     // JSON语法校验
    //     (files) =>
    //         files
    //             .filter((f) => f.endsWith('.json'))
    //             .map((f) => `jsonlint -q ${f}`)
    //             .join(' && ')
    // ],
    // '*.{md,mdx}': [
    //     'prettier --write',
    //     'markdown-link-check --quiet' // 检查Markdown死链
    // ],

    // 6. 测试文件：确保测试代码质量
    '*.{spec,test}.{ts,js,vue}': [
        'eslint --fix',
        'prettier --write',
        // 执行修改的测试用例
        (files) => `vitest run --passWithNoTests ${files.join(' ')}`
    ]

    // 7. 敏感信息检查（避免提交密钥等）
    // '*.{ts,js,vue,json}': [
    //     'secretlint' // 需配置.secretlintrc
    // ]
}
