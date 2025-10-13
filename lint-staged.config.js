// const fs = require('fs')
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
        //     const largeFiles = files.filter((file) => {
        //         try {
        //             return fs.statSync(file).size > 1024 * 50 // 50KB
        //         } catch (e) {
        //             if (e.code !== 'ENOENT') {
        //                 throw e
        //             }
        //             return false
        //         }
        //     })
        //     return largeFiles.length
        //         ? `eslint --rule "sonarjs/cognitive-complexity: [error, 8]" ${largeFiles.join(' ')}`
        //         : ''
        // }
    ]

    // 7. 敏感信息检查（避免提交密钥等）
    // '*.{ts,js,vue,json}': [
    //     'secretlint' // 需配置.secretlintrc
    // ]
}
