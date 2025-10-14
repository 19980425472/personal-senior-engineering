#!/usr/bin/env node

const { spawnSync } = require('child_process');

class CommitValidator {
    constructor() {
        this.commitMsgFile = process.argv[2];
    }

    startCommitizen() {
        console.log('\n🚀 请手动在控制台执行以下命令完成提交：');
        console.log('   pnpm commit');
        console.log('────────────────────────────────────────');
    }

    validate() {
        this.startCommitizen();
        return 0; // 返回成功状态码
    }
}

// 执行验证
const validator = new CommitValidator();
const exitCode = validator.validate();
process.exit(exitCode);