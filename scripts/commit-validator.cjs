#!/usr/bin/env node

const fs = require('fs')
const { spawnSync } = require('child_process')

// 读取提交信息
const commitMsgFile = process.argv[2]
const userCommitMsg = fs.readFileSync(commitMsgFile, 'utf8').trim()

// 检查是否符合标准格式
const isStandardFormat = (message) => {
    if (!message) return false
    const firstLine = message.split('\n')[0]
    const pattern =
        /^(feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert|wip|workflow|types|release)(\([a-zA-Z0-9\-]+\))?: .+/
    return pattern.test(firstLine)
}

if (isStandardFormat(userCommitMsg)) {
    // 格式正确，用 commitlint 验证
    const result = spawnSync('npx', ['commitlint', '--edit', commitMsgFile], {
        stdio: 'inherit'
    })
    process.exit(result.status)
} else {
    // 格式错误，直接执行 pnpm commit
    console.log('🚀 启动插件提交...')
    spawnSync('pnpm', ['commit'], {
        stdio: 'inherit',
        shell: true
    })
}
