#!/usr/bin/env node

const chalk = require('chalk').default
chalk.level = 1 // 强制启用基础颜色支持
const fs = require('fs')
const { execSync } = require('child_process')

class CommitValidator {
    constructor() {
        this.commitMsgFile = process.argv[2]
        this.userCommitMsg = this.getUserCommitMessage()
        this.standardConfig = this.loadStandardConfig()
    }

    getUserCommitMessage() {
        try {
            // 兼容插件提交和 pre-push 调用
            if (process.argv[2]) {
                return fs.readFileSync(process.argv[2], 'utf8').trim()
            } else if (!process.stdin.isTTY) {
                return require('fs').readFileSync(0, 'utf8').trim()
            } else {
                return ''
            }
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
            console.log(chalk.yellow('⚠️ 配置加载失败，使用默认配置'))
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

        console.log(chalk.blue('\n📊 提交日志格式分析报告：'))
        console.log(
            chalk.red('❌ 你的提交日志:'),
            this.userCommitMsg ? chalk.red(`"${firstLine}" 格式不符合标准`) : chalk.red('(空信息)')
        )
        console.log('')
        console.log(chalk.green('✅ 标准日志格式如下: '))
        this.standardConfig.typesConfig.forEach((type) => {
            console.log(`   ${type.name}`)
        })
        console.log(chalk.green('   feat(auth): 添加用户登录功能'))
        console.log(chalk.green('   fix: 修复页面崩溃问题'))
        console.log(chalk.green('   docs: 更新API文档'))
        console.log(chalk.green('   style: 更新样式文件'))
        console.log(chalk.green('   refactor: 重构代码'))
        console.log(chalk.green('   test: 添加测试用例'))
        console.log(chalk.green('   chore: 更新构建流程'))
        console.log(chalk.green('   perf: 优化性能'))
        console.log(chalk.blue('────────────────────────────────────────'))
    }

    // 新增方法：添加作者信息到提交消息
    addAuthorToCommitMessage() {
        try {
            if (!this.commitMsgFile) {
                console.log(chalk.yellow('⚠️  无法获取提交消息文件路径'))
                return
            }

            // 重新读取文件内容，确保获取最新内容
            const currentMessage = fs.readFileSync(this.commitMsgFile, 'utf8').trim()

            if (!currentMessage) {
                console.log(chalk.yellow('⚠️  提交消息为空'))
                return
            }

            // 动态检查是否已经包含作者信息（匹配任意用户名）
            const hasAuthor = currentMessage.match(/-\s*[\u4e00-\u9fa5a-zA-Z0-9_\-\.]+$/)
            const hasSkipFlag = currentMessage.includes('[skip-author]')

            if (hasAuthor) {
                console.log(chalk.blue(`ℹ️  提交消息已包含作者信息: ${hasAuthor[0]}`))
                return
            }

            if (hasSkipFlag) {
                console.log(chalk.blue('ℹ️  跳过作者信息添加'))
                return
            }

            // 获取git用户信息
            const author = execSync('git config user.name', { encoding: 'utf8' }).trim()

            if (!author) {
                console.log(
                    chalk.yellow('⚠️  无法获取git用户信息，请配置: git config user.name "你的姓名"')
                )
                return
            }

            // 添加作者信息到提交消息
            const newMessage = `${currentMessage} - ${author}`
            fs.writeFileSync(this.commitMsgFile, newMessage)
            console.log(chalk.green(`✅ 已自动添加作者: ${author}`))
        } catch (error) {
            console.log(chalk.yellow('⚠️  自动添加作者失败:', error.message))
        }
    }

    startCommitizen() {
        console.log(chalk.blue('\n🚀 现在启动交互式提交引导...'))
        console.log('\n⚠️  请使用 commitizen方式 提交')
        console.log('   执行以下命令提交:')
        console.log('   pnpm commit  或者  npm run commit')
        console.log(' ')

        process.exit(1)
        return 1
    }

    validate() {
        // 先进行格式验证
        if (!this.isStandardFormat(this.userCommitMsg)) {
            this.showFormatComparison()
            this.startCommitizen()
            return 1 // 返回错误状态码
        }

        // 验证通过后添加作者信息
        console.log(chalk.green('✅ 提交格式验证通过'))
        this.addAuthorToCommitMessage()

        return 0 // 返回成功状态码
    }
}

// 执行验证
const validator = new CommitValidator()
const exitCode = validator.validate()
process.exit(exitCode)
