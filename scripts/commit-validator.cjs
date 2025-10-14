#!/usr/bin/env node

const fs = require('fs');
const { spawnSync } = require('child_process');
const chalk = require('chalk');

class CommitValidator {
    constructor() {
        this.commitMsgFile = process.argv[2];
        this.userCommitMsg = this.getUserCommitMessage();
        this.standardConfig = this.loadStandardConfig();
    }

    getUserCommitMessage() {
        try {
            return fs.readFileSync(this.commitMsgFile, 'utf8').trim();
        } catch {
            return '';
        }
    }

    loadStandardConfig() {
        try {
            // 从 commitlint.config.js 读取配置
            delete require.cache[require.resolve('../commitlint.config.js')];
            const config = require('../commitlint.config.js');

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
            };
        } catch {
            console.log(chalk.red('❌ 配置加载失败，使用默认配置'));
            return {
                types: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'],
                typesConfig: [],
                scopes: []
            };
        }
    }

    // 检查是否符合标准格式
    isStandardFormat(message) {
        if (!message) return false;

        const firstLine = message.split('\n')[0];
        const typePattern = this.standardConfig.types.join('|');
        const pattern = new RegExp(`^(${typePattern})(\\([a-zA-Z0-9\\-]+\\))?: .+`);

        return pattern.test(firstLine);
    }

    // 显示格式对比
    showFormatComparison() {
        const firstLine = this.userCommitMsg.split('\n')[0];

        console.log(chalk.blue('\n📊 格式分析报告：'));
        console.log(
            chalk.red('❌ 你的提交日志:'),
            this.userCommitMsg ? chalk.red(`"${firstLine}" 格式不符合标准`) : chalk.red('(空信息)')
        );
        console.log('');
        console.log(chalk.green('✅ 标准日志格式如下: '));
        this.standardConfig.typesConfig.forEach((type) => {
            console.log(`   ${type.name}`);
        });
        console.log(chalk.green('   feat(auth): 添加用户登录功能'));
        console.log(chalk.green('   fix: 修复页面崩溃问题'));
        console.log(chalk.green('   docs: 更新API文档'));
        console.log(chalk.green('   style: 更新样式文件'));
        console.log(chalk.green('   refactor: 重构代码'));
        console.log(chalk.green('   test: 添加测试用例'));
        console.log(chalk.green('   chore: 更新构建流程'));
        console.log(chalk.green('   perf: 优化性能'));
        console.log(chalk.blue('────────────────────────────────────────'));
    }

    startCommitizen() {
        console.log(chalk.blue('\n🚀 现在启动交互式提交引导...'));
    }

    validate() {
        if (!this.isStandardFormat(this.userCommitMsg)) {
            this.showFormatComparison();
            this.startCommitizen();
            return 1; // 返回错误状态码
        }
        return 0; // 返回成功状态码
    }
}

// 执行验证
const validator = new CommitValidator();
const exitCode = validator.validate();
process.exit(exitCode);