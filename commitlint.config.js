export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        // @see: https://commitlint.js.org/#/reference-rules
        'body-leading-blank': [2, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 108],
        'subject-empty': [2, 'never'],
        'type-empty': [2, 'never'],
        'subiect-case': [0],
        'type-enum': [
            2,
            'always',
            [
                'feat',
                'fix',
                'docs',
                'style',
                'refactor',
                'perf',
                'test',
                'build',
                'ci',
                'chore',
                'revert',
                'wip',
                'workflow',
                'types',
                'release',
                'test'
            ]
        ]
    },
    prompt: {
        types: [
            { value: 'feat', name: '✅ 新功能：新增功能' },
            { value: 'fix', name: '🔧 修复：修复缺陷' },
            { value: 'docs', name: '📝 文档：文档变更' },
            { value: 'refactor', name: '♻️ 重构：代码重构（不新增功能也不修复BUG）' },
            { value: 'perf', name: '🚀 性能：性能优化' },
            { value: 'test', name: '🧪 测试：添加测试' },
            { value: 'chore', name: '⚙️ 工具：更改构建流程或辅助工具' },
            { value: 'revert', name: '↩️ 回滚：代码回退' },
            {
                value: 'build',
                name: '📦 构建：构建流程、外部依赖变更（如升级npm包、修改webpack配置等）'
            },
            { value: 'style', name: '🎨 样式：格式调整（不影响功能，例如空格、分号等）' }
        ],
        scopes: ['root', 'backend', 'frontend', 'mobile', 'web', 'components', 'utils'],
        allowCustomScopes: true,
        skipQuestions: ['body', 'footerPrefix', 'footer', 'breaking'],
        messages: {
            type: '✅ 请选择提交类型：',
            scope: '🔧 请选择影响范围（可选）：',
            subject: '📝 请简要描述更改：',
            body: '♻️ 详细描述（可选）：',
            footer: '🧪 关联的 ISSUE 或 BREAKING CHANGE（可选）：',
            confirmCommit: '⚙️ 确认提交？'
        }
    }
}
