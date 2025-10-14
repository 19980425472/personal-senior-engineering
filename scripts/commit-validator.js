#!/usr/bin/env node

const fs = require('fs')
const { execSync, spawn } = require('child_process')
const config = require('../config/commit-config.js')
const readline = require('readline')

class CommitValidator {
    constructor(commitMsgFile) {
        this.commitMsgFile = commitMsgFile
        this.commitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim()
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    // 检查提交信息格式
    checkCommitFormat() {
        const firstLine = this.commitMsg.split('\n')[0]
        const typePattern = config.types.map((t) => t.value).join('|')
        const pattern = new RegExp(`^(${typePattern})(\\(\\w+\\))?: .+`)

        return pattern.test(firstLine)
    }

    // 显示引导选项
    async showGuidanceOptions() {
        console.log('\n🎯 提交引导选项')
        console.log('─'.repeat(40))
        console.log('1. 🚀 使用交互式引导工具')
        console.log('2. 📝 手动重新输入提交信息')
        console.log('3. ❌ 取消本次提交')
        console.log('─'.repeat(40))

        while (true) {
            const choice = await this.question('请选择操作 (1-3):')
            switch (choice) {
                case '1':
                    return 'guide'
                case '2':
                    return 'retry'
                case '3':
                    return 'cancel'
                default:
                    console.log('❌ 选择无效，请输入 1-3')
            }
        }
    }

    // 启动引导工具
    startGuideTool() {
        console.log('\n🚀 启动交互式提交引导...')
        try {
            const guideProcess = spawn('node', ['scripts/commit-guide.cjs'], {
                stdio: 'inherit',
                shell: true
            })

            return new Promise((resolve) => {
                guideProcess.on('close', (code) => {
                    resolve(code)
                })
            })
        } catch (error) {
            console.log('❌ 启动引导工具失败:', error.message)
            return 1
        }
    }

    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(`\n${prompt} `, resolve)
        })
    }

    // 主验证逻辑
    async validate() {
        // 如果是空提交信息
        if (!this.commitMsg) {
            console.log(`\n${config.messages.emptyCommit}`)
            const useGuide = await this.question('是否使用交互式引导？(Y/n):')

            if (useGuide.toLowerCase() !== 'n') {
                const exitCode = await this.startGuideTool()
                this.rl.close()
                process.exit(exitCode)
            } else {
                console.log('❌ 提交已取消')
                this.rl.close()
                process.exit(1)
            }
            return
        }

        // 如果格式不正确
        if (!this.checkCommitFormat()) {
            console.log(`\n${config.messages.invalidFormat}`)
            console.log('─'.repeat(50))
            console.log('📝 正确格式: type(scope): description')
            console.log('')
            console.log('✅ 支持的类型:')
            config.types.forEach((type) => {
                console.log(`   ${type.emoji} ${type.value} - ${type.zhName}`)
            })
            console.log('─'.repeat(50))

            const action = await this.showGuidanceOptions()

            switch (action) {
                case 'guide':
                    this.rl.close()
                    process.exit(await this.startGuideTool())
                    break
                case 'retry':
                    console.log('💡 请重新执行 git commit 命令')
                    this.rl.close()
                    process.exit(1)
                    break
                case 'cancel':
                    console.log('❌ 提交已取消')
                    this.rl.close()
                    process.exit(1)
                    break
            }
            return
        }

        // 格式正确，使用 commitlint 验证
        try {
            execSync(`npx --no -- commitlint --edit ${this.commitMsgFile}`, {
                stdio: 'inherit'
            })
            this.rl.close()
        } catch {
            this.rl.close()
            process.exit(1)
        }
    }
}

// 命令行使用
if (require.main === module) {
    const commitMsgFile = process.argv[2]
    if (!commitMsgFile) {
        console.error('❌ 错误: 请提供提交信息文件路径')
        process.exit(1)
    }

    new CommitValidator(commitMsgFile).validate().catch((error) => {
        console.error('❌ 验证过程出错:', error.message)
        process.exit(1)
    })
}

module.exports = CommitValidator
