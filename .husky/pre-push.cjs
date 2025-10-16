#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')
const chalk = require('chalk').default
chalk.level = 1 // 强制启用基础颜色支持

// 配置项
const CONFIG = {
    remoteBranch: process.env.PRE_PUSH_REMOTE || 'origin/main',
    skipChecks: process.env.SKIP_PRE_PUSH === 'true',
    preCommitScript: path.resolve(__dirname, 'pre-commit.cjs'),
    commitValidator: path.resolve(__dirname, '../scripts/commit-validator.cjs')
}

// 执行shell命令并返回结果
function execCommand(command, options = {}) {
    try {
        return execSync(command, {
            stdio: 'pipe',
            encoding: 'utf-8',
            ...options
        }).trim()
    } catch {
        return null
    }
}

// 输出带颜色的日志
function log(message, type = 'info') {
    const colors = {
        info: '\x1b[34m', // 蓝色
        success: '\x1b[32m', // 绿色
        error: '\x1b[31m', // 红色
        warning: '\x1b[33m', // 黄色
        reset: '\x1b[0m' // 重置颜色
    }

    const icons = {
        info: 'ℹ️',
        success: '✅',
        error: '❌',
        warning: '⚠️'
    }

    console.log(`${icons[type]} ${colors[type]}${message}${colors.reset}`)
}

// 验证必要文件是否存在
function validateRequiredFiles() {
    if (!fs.existsSync(CONFIG.preCommitScript)) {
        throw new Error(`预提交检查脚本不存在: ${CONFIG.preCommitScript}`)
    }
    if (!fs.existsSync(CONFIG.commitValidator)) {
        throw new Error(`提交信息验证脚本不存在: ${CONFIG.commitValidator}`)
    }
}

// 获取当前分支
function getCurrentBranch() {
    const branch = execCommand('git rev-parse --abbrev-ref HEAD')
    if (!branch) {
        throw new Error('无法获取当前分支信息，请确保在Git仓库中执行')
    }
    return branch
}

// 获取变更文件列表
function getChangedFiles(currentBranch) {
    log('检测待推送的变更文件...')
    const changedFiles = execCommand(
        `git diff --name-only --diff-filter=d ${CONFIG.remoteBranch}...${currentBranch}`
    )

    if (!changedFiles) {
        log('没有待推送的变更文件', 'warning')
        return []
    }

    return changedFiles.split('\n').filter((file) => file.trim())
}

// 显示变更文件列表
function displayChangedFiles(files) {
    if (files.length === 0) return

    log(`发现 ${files.length} 个变更文件:`)
    files.forEach((file, index) => {
        log(`  ${index + 1}. ${file}`, 'info')
    })
}

// 执行代码质量检查
function runCodeQualityCheck(files) {
    if (files.length === 0) return true

    log(`执行代码检测 (${files.length} 个文件)...`)
    try {
        // 将文件列表写入临时文件，避免命令行参数过长
        const tempFile = path.join(__dirname, '.pre-push-files.tmp')
        fs.writeFileSync(tempFile, files.join('\n'))

        execSync(`node ${CONFIG.preCommitScript} --file-list ${tempFile}`, {
            stdio: 'inherit'
        })

        // 清理临时文件
        fs.unlinkSync(tempFile)
        return true
    } catch (error) {
        throw new Error(`代码检测失败: ${error.message}`)
    }
}

// 验证提交信息
function validateCommitMessages(currentBranch) {
    log('检测提交信息格式...')
    // eslint-disable-next-line prettier/prettier
    const commits = execCommand(`git log --pretty=format:%H ${CONFIG.remoteBranch}...${currentBranch}`)

    if (!commits) {
        log('没有需要验证的提交', 'warning')
        return true
    }

    const commitList = commits.split('\n').filter((commit) => commit.trim())

    for (const commit of commitList) {
        const commitMsg = execCommand(`git log -1 --pretty=format:%B ${commit}`)
        const shortHash = commit.substring(0, 8)
        const previewMsg = commitMsg.length > 50 ? `${commitMsg.substring(0, 50)}...` : commitMsg

        log(`你的提交日志信息是 : ${previewMsg} ,提交的hash值是: ${shortHash}`)

        try {
            // 使用标准输入传递提交信息，更安全
            execSync(`node ${CONFIG.commitValidator}`, {
                stdio: ['pipe', 'inherit', 'inherit'],
                input: commitMsg
            })
        } catch {
            // 获取的这里的错误信息
            throw new Error(`${commit}`)
        }
    }

    return true
}

// 主函数
async function main() {
    try {
        // 检查是否跳过验证
        if (CONFIG.skipChecks) {
            log('跳过推送前检查', 'warning')
            process.exit(0)
        }

        // 验证必要文件
        validateRequiredFiles()

        // 1. 获取当前分支
        const currentBranch = getCurrentBranch()
        log(`当前分支: ${currentBranch}`)

        // 2. 获取变更文件
        const changedFiles = getChangedFiles(currentBranch)
        displayChangedFiles(changedFiles)

        // 3. 执行代码检测
        await runCodeQualityCheck(changedFiles)

        // 4. 验证提交信息
        await validateCommitMessages(currentBranch)

        // 所有检测通过
        log('所有检测通过，允许推送', 'success')
        process.exit(0)
    } catch (error) {
        log(`失败原因: 您hash为 ${error.message} 的提交日志 不符合提交规范`, 'error')
        console.log('\n🚫 如果你有历史提交远程没有成功的，可以执行以下命令尝试修复:')
        console.log(chalk.yellow('注意：以防止处理失败，建议先物理备份代码\n'))

        // 步骤1：终止所有未完成的Git操作（确保环境干净）
        console.log(chalk.green('步骤 1：终止所有未完成的Git流程（如rebase/merge）'))
        console.log('  ' + chalk.cyan('git rebase --abort'))
        console.log('  ' + chalk.cyan('git merge --abort'))
        console.log('  ' + chalk.yellow('💡 作用：') + '清除中间状态，避免影响后续操作')
        console.log('')

        // 步骤2：备份未提交成功的代码（关键：防止重置时丢失）
        console.log(chalk.green('步骤 2：备份所有未提交成功的代码（包括未push的修改）'))
        console.log('  ' + chalk.cyan('git stash save "备份：未提交成功的代码"'))
        console.log(
            '  ' +
                chalk.yellow('📌 重点：') +
                '这一步会把所有未提交的代码（包括工作区和暂存区）存入临时存储，确保后续操作不丢失'
        )
        console.log(
            '  ' +
                chalk.yellow('✅ 验证：') +
                '执行 ' +
                chalk.cyan('git stash list') +
                ' 能看到刚刚创建的备份记录'
        )
        console.log('')

        // 步骤3：拉取远程最新状态（同步基准）
        console.log(chalk.green('步骤 3：获取远程最新代码信息'))
        console.log('  ' + chalk.cyan('git fetch origin'))
        console.log('  ' + chalk.yellow('💡 作用：') + '确保本地知晓远程最新状态，为同步做准备')
        console.log('')

        // 步骤4：清空本地未推送的提交（仅清除历史，不影响备份）
        console.log(chalk.green('步骤 4：清空本地未推送的错误提交，同步远程分支'))
        console.log('  ' + chalk.cyan('git reset --hard origin/你的远程分支名')) // 替换main为你的远程分支名
        console.log('  ' + '删除所有未推送的提交历史，但备份的代码在stash中是安全的')
        console.log(
            '  ' +
                chalk.yellow('✅ 验证：') +
                '执行 ' +
                chalk.cyan('git log') +
                ' 应与远程仓库最新提交完全一致'
        )
        console.log('')

        // 步骤5：将备份的未提交代码恢复到工作区（核心需求）
        console.log(chalk.green('步骤 5：恢复未提交成功的代码到工作区'))
        console.log('  ' + chalk.cyan('git stash pop'))
        console.log('  ' + '把之前未提交成功的代码会回到工作区，可重新编辑或提交')
        console.log(
            '  ' +
                chalk.yellow('🔧 冲突处理：') +
                '若提示冲突，打开冲突文件，保留你的代码，删除 <<< === >>> 标记后执行 ' +
                chalk.cyan('git add .')
        )
        console.log(
            '  ' +
                chalk.yellow('✅ 验证：') +
                '执行 ' +
                chalk.cyan('git status') +
                ' 能看到恢复的代码（处于未暂存状态）'
        )
        console.log('')

        // 步骤6：重新提交恢复的代码（正常流程）
        console.log(chalk.green('步骤 6：重新提交代码'))
        console.log('  ' + chalk.cyan('git add 恢复的代码文件路径')) // 暂存需要提交的代码
        console.log('  ' + chalk.cyan('pnpm commit 或 npm run commit')) // 用规范工具生成提交日志
        console.log('  ' + chalk.cyan('git push origin main')) // 推送（替换main为你的远程分支名）
        console.log('')

        process.exit(1)
    }
}

// 执行主函数
if (require.main === module) {
    main()
}

module.exports = {
    getChangedFiles,
    validateCommitMessages,
    runCodeQualityCheck
}
