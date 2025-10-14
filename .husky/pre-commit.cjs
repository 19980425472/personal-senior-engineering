#!/usr/bin/env node
// 上面这句是告诉系统，这个文件是用node编写的，是node 环境下的脚本，下面就基于node 来写，pre-commit 是git 的钩子，在提交代码之前执行，下面是具体的代码

// 引入node 的fs 模块
// const fs = require('fs')
const { execSync } = require('child_process')
// 先判断一下是否安装了node 环境，如果没有安装，则退出,
function checkNodeEnvironment() {
    try {
        // 通过通过执行node -v判断是否安装了node 环境，如果安装了，则执行下面代码，如果没有安装，则退出
        const nodeVersionOutput = execSync('node -v', { stdio: 'pipe' }).toString().trim()
        //  提取node的版本号
        const nodeVersion = nodeVersionOutput.replace('v', '')

        // 解构出来node 的版本号
        const [major, minor] = nodeVersion.split('.')
        // 版本必须大于20
        if (major < 20 || (major === 20 && minor < 0)) {
            console.error(`\n❌ 检测到Node版本不兼容 (当前: v${nodeVersion})`)
            console.error('   项目要求 Node.js ≥ v14.0.0，请升级后重试。')
            process.exit(1)
        }

        // 如果正常就返回true
        return true
    } catch {
        console.error('\n❌ 未检测到Node.js环境')
        console.error('   请先安装Node.js以运行pre-commit校验：')
        console.error('   1. 访问官网下载：https://nodejs.org/zh-cn/download/')
        console.error('   2. 安装时勾选 "Add to PATH"（自动配置环境变量）')
        console.error('   3. 重启终端后重试提交\n')
        process.exit(1)
    }
}

// 检查执行lint-staged必要要有的依赖是不是都安装了
function checkDependencies() {
    const deps = ['lint-staged', 'eslint', 'prettier']
    const missingDeps = deps.filter((dep) => {
        try {
            require.resolve(dep)
            return false
        } catch {
            return true
        }
    })

    if (missingDeps.length > 0) {
        console.error('\n❌ 缺少必要依赖：', missingDeps.join(', '))
        console.error(`   请执行：npm install ${missingDeps.join(' ')} --save-dev\n`)
        process.exit(1)
    }
    console.log('✅ 依赖检查通过')
}

// 执行 lint-staged 校验（只处理暂存区文件）函数执行
function runLintStaged() {
    try {
        console.log('\n🔍 开始代码校验...')
        execSync('npx lint-staged', { stdio: 'inherit' }) // 输出实时打印到终端
        console.log('\n✅ 所有缓存区 code 校验通过，准备提交！')
    } catch {
        console.error('\n❌ 校验失败，请修复上述问题后重试')
        process.exit(1)
    }
}

// 执行 环境检查函数
checkNodeEnvironment()
checkDependencies()
runLintStaged()
