#!/usr/bin/env node

/**
 * 提交信息格式验证器
 * 作用：检查提交信息是否符合标准格式
 * 返回：0=通过, 1=不通过
 */

const fs = require('fs')
const path = require('path')

class CommitValidator {
    constructor() {
        this.commitMsgFile = process.argv[2]
        this.userCommitMsg = this.getUserCommitMessage()
        this.standardTypes = this.loadStandardTypes()
    }

    // 读取用户提交信息
    getUserCommitMessage() {
        try {
            const content = fs.readFileSync(this.commitMsgFile, 'utf8').trim()
            console.log(`🔍 检测提交信息: "${content}"`)
            return content
        } catch {
            console.log('❌ 无法读取提交信息文件')
            return ''
        }
    }

    // 从 commitlint.config.js 加载标准类型
    loadStandardTypes() {
        try {
            const configPath = path.resolve(process.cwd(), 'commitlint.config.js')

            // 动态导入配置
            const config = require(configPath)

            // 从 prompt.types 或 rules.type-enum 获取类型
            let types = []
            if (config.prompt && config.prompt.types) {
                types = config.prompt.types.map((item) => item.value)
            } else if (config.rules && config.rules['type-enum']) {
                types = config.rules['type-enum'][2] // 获取 type-enum 的第三个参数
            }

            // 去重并过滤无效值
            types = [...new Set(types)].filter(Boolean)

            console.log(`📋 标准类型: ${types.join(', ')}`)
            return types
        } catch {
            console.log('⚠️ 配置加载失败，使用默认类型')
            return ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf']
        }
    }

    // 检查是否符合标准格式
    isStandardFormat(message) {
        if (!message) {
            console.log('❌ 提交信息为空')
            return false
        }

        const firstLine = message.split('\n')[0]

        // 构建动态正则表达式
        const typePattern = this.standardTypes.join('|')
        const pattern = new RegExp(`^(${typePattern})(\\([a-zA-Z0-9\\-]+\\))?: .+`)

        const isValid = pattern.test(firstLine)

        if (!isValid) {
            console.log(`❌ 格式验证失败: "${firstLine}"`)
            console.log(`✅ 期望格式: type(scope): description`)
        } else {
            console.log(`✅ 格式验证通过: "${firstLine}"`)
        }

        return isValid
    }

    // 执行验证
    validate() {
        try {
            const isValid = this.isStandardFormat(this.userCommitMsg)
            return isValid ? 0 : 1
        } catch (error) {
            console.log(`💥 验证过程出错: ${error.message}`)
            return 1
        }
    }
}

// 执行验证并返回退出码
const validator = new CommitValidator()
const exitCode = validator.validate()
process.exit(exitCode)
