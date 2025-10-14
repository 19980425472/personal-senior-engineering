#!/usr/bin/env node

const fs = require('fs')
const { spawnSync } = require('child_process')

class CommitValidator {
    constructor() {
        this.commitMsgFile = process.argv[2]
        this.userCommitMsg = this.getUserCommitMessage()
        this.standardConfig = this.loadStandardConfig()
    }

    getUserCommitMessage() {
        try {
            return fs.readFileSync(this.commitMsgFile, 'utf8').trim()
        } catch {
            return ''
        }
    }

    loadStandardConfig() {
        try {
            // 从 commitlint.config.js 读取配置
            delete require.cache[require.resolve('../commitlint.config.js')]
            const config = require('../commitlint.config.js')

            return {
                types: config.prompt?.types?.map((t) => t.value) || [
                    'feat',
                    'fix',
                    'docs',
                    'style',
                    'refactor',
                    'test',
                    'chore',
                    'perf'
                ],
                typesConfig: config.prompt?.types || [],
                scopes: config.prompt?.scopes || []
            }
        } catch {
            console.log('❌ 配置加载失败，使用默认配置')
            return {
                types: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'],
                typesConfig: [],
                scopes: []
            }
        }
    }

    // 检查是否符合标准格式
    isStandardFormat(message) {
        if (!message) return false

        const firstLine = message.split('\n')[0]
        const typePattern = this.standardConfig.types.join('|')
        const pattern = new RegExp(`^(${typePattern})(\\([a-zA-Z0-9\\-]+\\))?: .+`)

        return pattern.test(firstLine)
    }

    // 显示格式对比
    showFormatComparison() {
        const firstLine = this.userCommitMsg.split('\n')[0]

        console.log('\n📊 格式分析报告：')
        console.log(
            '❌ 你的提交日志:',
            this.userCommitMsg ? `"${firstLine} " 格式不符合标准` : '(空信息)'
        )
        console.log('')
        console.log('✅ 标准日志格式如下: ')
        this.standardConfig.typesConfig.forEach((type) => {
            console.log(`   ${type.name}`)
        })
        console.log('   feat(auth): 添加用户登录功能')
        console.log('   fix: 修复页面崩溃问题')
        console.log('   docs: 更新API文档')
        console.log('   style: 更新样式文件')
        console.log('   refactor: 重构代码')
        console.log('   test: 添加测试用例')
        console.log('   chore: 更新构建流程')
        console.log('   perf: 优化性能')
        console.log('────────────────────────────────────────')
    }

    startCommitizen() {
        console.log('\n🚀 请手动在控制台执行以下命令完成提交：')
        console.log('   pnpm commit   或者  npm run commit')
    }

    validate() {
        console.log('🔍 提交信息验证')
        console.log('========================================')

        // 如果符合标准格式，用 commitlint 验证
        if (this.isStandardFormat(this.userCommitMsg)) {
            console.log('✅ 格式符合标准，进行详细验证...')
            return this.runCommitlint()
        }
        // 如果不符合标准格式，自动启动 git-cz
        else {
            this.showFormatComparison()
            return this.startCommitizen()
        }
    }
}

// 执行验证
const validator = new CommitValidator()
const exitCode = validator.validate()
process.exit(exitCode)
