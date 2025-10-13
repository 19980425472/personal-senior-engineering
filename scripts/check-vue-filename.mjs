const path = require('path')

/**
 * 校验.vue文件命名规范：
 * 1. 必须使用纯大驼峰（仅字母/数字，首字母大写，如 UserProfile.vue）
 * 2. 禁止包含点号（.）、连字符（-）、下划线（_）等特殊字符
 * 3. 允许例外：Index.vue
 */
function checkVueFilename(files) {
    // 严格正则：仅允许字母/数字，首字母大写，无点号，以.vue结尾
    const strictCamelCaseRegex = /^[A-Z][a-zA-Z0-9]*\.vue$/
    const invalidFiles = []

    for (const file of files) {
        const filename = path.basename(file)

        // 跳过 Index.vue
        if (filename === 'Index.vue') continue

        // 检查是否为.vue文件且不符合规则（包含点号或非大驼峰）
        if (filename.endsWith('.vue') && !strictCamelCaseRegex.test(filename)) {
            invalidFiles.push(file)
        }
    }

    if (invalidFiles.length > 0) {
        console.error('\n❌ Vue文件命名不符合规范：')
        console.error('   要求：纯大驼峰（仅字母/数字，首字母大写，无点号等特殊字符）')
        console.error('   正确示例：User.vue、UserProfile123.vue、Index.vue（例外）')
        console.error(
            '   错误示例：User.Info.vue（含点号）、user.vue（首字母小写）、user-profile.vue（含连字符）'
        )
        invalidFiles.forEach((file) => console.error(`   - ${file}`))
        process.exit(1)
    }

    return 'Vue文件名校验通过'
}

module.exports = checkVueFilename
