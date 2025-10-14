/**
 * 🎯 提交规范统一配置
 * 供所有工具共享的中央配置
 */

module.exports = {
    // ==================== 提交类型配置 ====================
    types: [
        {
            value: 'feat',
            name: 'feat: ✨ 新功能',
            emoji: '✨',
            description: '引入新功能',
            zhName: '新功能',
            color: '#2ECC71'
        },
        {
            value: 'fix',
            name: 'fix: 🐛 修复',
            emoji: '🐛',
            description: '修复缺陷',
            zhName: '修复',
            color: '#E74C3C'
        },
        {
            value: 'docs',
            name: 'docs: 📚 文档',
            emoji: '📚',
            description: '文档更新',
            zhName: '文档',
            color: '#3498DB'
        },
        {
            value: 'style',
            name: 'style: 💎 格式',
            emoji: '💎',
            description: '代码格式调整，不影响功能',
            zhName: '格式',
            color: '#9B59B6'
        },
        {
            value: 'refactor',
            name: 'refactor: ♻️ 重构',
            emoji: '♻️',
            description: '代码重构，不新增功能也不修复BUG',
            zhName: '重构',
            color: '#16A085'
        },
        {
            value: 'perf',
            name: 'perf: ⚡ 性能',
            emoji: '⚡',
            description: '性能优化',
            zhName: '性能',
            color: '#F39C12'
        },
        {
            value: 'test',
            name: 'test: 🧪 测试',
            emoji: '🧪',
            description: '测试相关',
            zhName: '测试',
            color: '#27AE60'
        },
        {
            value: 'build',
            name: 'build: 📦 构建',
            emoji: '📦',
            description: '构建流程、外部依赖变更',
            zhName: '构建',
            color: '#D35400'
        },
        {
            value: 'ci',
            name: 'ci: 👷 CI',
            emoji: '👷',
            description: '持续集成配置',
            zhName: 'CI',
            color: '#7F8C8D'
        },
        {
            value: 'chore',
            name: 'chore: 🔧 工具',
            emoji: '🔧',
            description: '更改构建流程或辅助工具',
            zhName: '工具',
            color: '#95A5A6'
        },
        {
            value: 'revert',
            name: 'revert: ⏪ 回滚',
            emoji: '⏪',
            description: '代码回退',
            zhName: '回滚',
            color: '#C0392B'
        }
    ],

    // ==================== 范围配置 ====================
    scopes: [
        { name: '全局', value: 'global', description: '影响整个项目' },
        { name: '前端', value: 'frontend', description: '前端相关改动' },
        { name: '后端', value: 'backend', description: '后端相关改动' },
        { name: '移动端', value: 'mobile', description: '移动端相关改动' },
        { name: '组件', value: 'components', description: '组件相关改动' },
        { name: '工具', value: 'utils', description: '工具函数相关' },
        { name: '配置', value: 'config', description: '配置文件改动' },
        { name: '文档', value: 'docs', description: '文档相关改动' },
        { name: '样式', value: 'styles', description: '样式相关改动' },
        { name: '类型', value: 'types', description: '类型定义改动' }
    ],

    // ==================== 消息提示配置 ====================
    messages: {
        welcome: '🚀 Git 智能提交引导工具',
        step: '步骤',
        type: '✅ 请选择提交类型：',
        scope: '🔧 请选择影响范围（可选）：',
        customScope: '📝 请输入自定义范围：',
        subject: '📝 请简要描述更改：',
        body: '♻️ 详细描述（可选）：',
        footer: '🧪 关联的 ISSUE（可选）：',
        confirmCommit: '⚙️ 确认提交？',
        emptyCommit: '🎯 检测到空提交信息',
        invalidFormat: '❌ 提交信息格式不正确',
        commitSuccess: '✅ 提交成功！',
        commitFailed: '❌ 提交失败',
        guidanceQuestion: '是否使用交互式引导工具重新填写？'
    },

    // ==================== 功能配置 ====================
    features: {
        allowCustomScopes: true,
        allowBreakingChanges: ['feat', 'fix'],
        skipQuestions: ['footer'],
        autoAddAuthor: false,
        showBranchInfo: true,
        showTimestamp: true,
        enableEmoji: true,
        enableColors: true
    },

    // ==================== 验证配置 ====================
    validation: {
        minSubjectLength: 3,
        maxSubjectLength: 100,
        maxHeaderLength: 108,
        requireScope: false,
        subjectCase: 'sentence-case'
    },

    // ==================== 主题配置 ====================
    theme: {
        colors: {
            primary: '#3498DB',
            success: '#2ECC71',
            warning: '#F39C12',
            error: '#E74C3C',
            info: '#9B59B6',
            muted: '#95A5A6'
        },
        symbols: {
            pointer: '❯',
            bullet: '•',
            line: '─',
            branch: '🌿',
            user: '👤',
            time: '🕒'
        },
        borders: {
            single: '─',
            double: '═',
            rounded: '╭╮╰╯'
        }
    },

    // ==================== 模板配置 ====================
    templates: {
        commit: '{{type}}{{scope}}: {{subject}}{{body}}{{footer}}',
        subject: '{{emoji}} {{zhName}}: {{description}}',
        body: '{{body}}',
        footer: '{{footer}}'
    }
}
