#!/usr/bin/env node

const fs = require('fs')
const { spawnSync } = require('child_process')

class CommitValidator {
    constructor() {
        this.commitMsgFile = process.argv[2] // Git传递的提交信息临时文件路径
        this.userCommitMsg = this.getUserCommitMessage()
        this.standardConfig = this.loadStandardConfig()
    }

    // 读取Git临时文件中的提交信息
    getUserCommitMessage() {
        try {
            return fs.readFileSync(this.commitMsgFile, 'utf8').trim()
        } catch {
            return ''
        }
    }

    // 加载commitlint配置（支持cz-git扩展）
    loadStandardConfig() {
        try {
            // 注意：路径需根据实际项目结构调整（当前假设脚本在.husky目录，配置在项目根目录）
            delete require.cache[require.resolve('../../commitlint.config.js')]
            const config = require('../../commitlint.config.js')

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
            console.log('❌ 配置加载失败，使用默认规范')
            return {
                types: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'],
                typesConfig: [],
                scopes: []
            }
        }
    }

    // 校验提交信息是否符合基础格式
    isStandardFormat(message) {
        if (!message) return false

        const firstLine = message.split('\n')[0]
        const typePattern = this.standardConfig.types.join('|')
        // 支持带scope（如feat(auth): ...）和不带scope（如fix: ...）的格式
        const pattern = new RegExp(`^(${typePattern})(\\([a-zA-Z0-9\\-]+\\))?: .+`)

        return pattern.test(firstLine)
    }

    // 显示格式错误对比
    showFormatComparison() {
        const firstLine = this.userCommitMsg.split('\n')[0]

        console.log('\n📊 格式分析报告：')
        console.log(
            '❌ 你的提交信息:',
            this.userCommitMsg ? `"${firstLine}" 不符合规范` : '(空信息)'
        )
        console.log('\n✅ 标准格式示例：')

        console.log('────────────────────────────────────────')
    }

    // 启动package.json中的commit命令（git-cz），并确保信息写入Git临时文件
    startCommitizen() {
        console.log('\n🚀 启动交互式提交工具...')

        // 关键：通过--file参数将git-cz生成的信息写入Git临时文件
        const result = spawnSync('npm', ['run', 'commit', '--', '--file', this.commitMsgFile], {
            stdio: 'inherit', // 继承终端输入输出，确保交互式界面正常显示
            shell: true
        })

        // 重新读取更新后的提交信息
        this.userCommitMsg = this.getUserCommitMessage()
        return result.status
    }

    // 用commitlint执行最终验证
    runCommitlint() {
        console.log('✅ 开始commitlint详细验证...')
        const result = spawnSync('npx', ['commitlint', '--edit', this.commitMsgFile], {
            stdio: 'inherit',
            shell: true
        })
        return result.status
    }

    // 主验证流程
    validate() {
        console.log('🔍 提交信息验证启动')
        console.log('========================================')

        // 首次校验：如果格式正确，直接走commitlint
        if (this.isStandardFormat(this.userCommitMsg)) {
            return this.runCommitlint()
        }

        // 格式错误：启动交互式工具重新生成信息
        this.showFormatComparison()
        const czStatus = this.startCommitizen()

        // 如果交互式工具执行失败（如用户取消），直接退出
        if (czStatus !== 0) {
            console.error('❌ 交互式提交被终止')
            return 1
        }

        // 二次校验：验证交互式工具生成的信息
        if (this.isStandardFormat(this.userCommitMsg)) {
            return this.runCommitlint() // 走完整验证流程
        } else {
            console.error('❌ 交互式工具生成的信息仍不符合规范')
            return 1
        }
    }
}

// 执行验证并退出
const validator = new CommitValidator()
const exitCode = validator.validate()
process.exit(exitCode)
