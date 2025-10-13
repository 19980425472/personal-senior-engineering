export default {
    // 2. Vue单文件组件：全量检查（模板+脚本+样式）
    '*.vue': [
        // ESLint修复（需配合eslint-plugin-vue，检查模板和脚本）
        'eslint --fix --plugin vue --plugin security',
        // Prettier格式化（覆盖template/style标签）
        'prettier --write',
        // 单独检查模板语法（可选，增强模板校验）
        'vue-tsc --noEmit --skipLibCheck'
    ],

    // 3. TypeScript类型全量校验（仅对TS文件，延迟执行避免重复）
    '*.ts': () => 'tsc --noEmit --skipLibCheck --strict'
}
