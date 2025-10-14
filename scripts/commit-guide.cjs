#!/usr/bin/env node

const readline = require('readline')
const { execSync } = require('child_process')

const config = {
    types: [
        { value: 'feat', name: '✨ 新功能', emoji: '✨' },
        { value: 'fix', name: '🐛 修复', emoji: '🐛' },
        { value: 'docs', name: '📚 文档', emoji: '📚' },
        { value: 'style', name: '💎 格式', emoji: '💎' },
        { value: 'refactor', name: '♻️ 重构', emoji: '♻️' },
        { value: 'test', name: '🧪 测试', emoji: '🧪' },
        { value: 'chore', name: '🔧 工具', emoji: '🔧' },
        { value: 'perf', name: '⚡ 性能', emoji: '⚡' }
    ],
    scopes: ['全局', '前端', '后端', '移动端', '组件', '工具']
}

class CommitGuide {
    constructor() {
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        })
    }

    question(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, resolve)
        })
    }

    async selectType() {
        console.log('\n🎯 选择提交类型:')
        config.types.forEach((type, i) => {
            console.log(`  ${i + 1}. ${type.emoji} ${type.name}`)
        })

        const answer = await this.question('\n请输入数字选择: ')
        const index = parseInt(answer) - 1
        if (index >= 0 && index < config.types.length) {
            return config.types[index]
        }
        console.log('❌ 选择无效，默认使用 chore')
        return config.types[6] // 默认 chore
    }

    async selectScope() {
        console.log('\n🔧 选择影响范围:')
        config.scopes.forEach((scope, i) => {
            console.log(`  ${i + 1}. ${scope}`)
        })
        console.log(`  ${config.scopes.length + 1}. 跳过`)

        const answer = await this.question('\n请选择: ')
        const index = parseInt(answer) - 1

        if (index >= 0 && index < config.scopes.length) {
            return config.scopes[index]
        }
        return ''
    }

    async inputSubject() {
        console.log('\n📝 填写提交描述:')
        const subject = await this.question('请输入描述: ')
        return subject.trim() || '更新代码'
    }

    async confirmCommit(type, scope, subject) {
        const scopeText = scope ? `(${scope})` : ''
        const message = `${type.value}${scopeText}: ${subject}`

        console.log('\n📋 提交信息预览:')
        console.log(`  ${message}`)

        const confirm = await this.question('\n确认提交？(Y/n): ')
        return confirm.toLowerCase() !== 'n'
    }

    executeCommit(type, scope, subject) {
        const scopeText = scope ? `(${scope})` : ''
        const message = `${type.value}${scopeText}: ${subject}`

        try {
            console.log('\n🔄 执行提交中...')
            execSync(`git commit -m "${message.replace(/"/g, '\\"')}" --no-verify`, {
                stdio: 'inherit'
            })
            console.log('\n✅ 提交成功！')
            return true
        } catch {
            console.log('\n❌ 提交失败')
            return false
        }
    }

    async run() {
        try {
            const type = await this.selectType()
            const scope = await this.selectScope()
            const subject = await this.inputSubject()

            if (await this.confirmCommit(type, scope, subject)) {
                return this.executeCommit(type, scope, subject) ? 0 : 1
            }
            return 1
        } catch (error) {
            console.log('💥 出错:', error.message)
            return 1
        } finally {
            this.rl.close()
        }
    }
}

// 同步执行，避免进程提前退出
new CommitGuide().run().then((code) => {
    process.exit(code)
})
