export default {
    // 处理 TS/JS/TSX/JSX：先修复 ESLint 问题，再用 Prettier 格式化
    '*.{ts,js,tsx,jsx}': ['eslint --fix', 'prettier --write'],

    // 处理 Vue 单文件：ESLint 修复 + Prettier 格式化（覆盖 template/style/script）
    '*.vue': ['eslint --fix', 'prettier --write'],

    // TypeScript 类型检查（仅对 TS 文件生效，不生成编译产物）
    '*.ts': () => 'tsc --noEmit --skipLibCheck',

    // 处理样式文件：Prettier 格式化（补充 Vue 项目常见样式类型）
    '*.{css,scss,sass,less}': 'prettier --write',

    // 处理配置/文档类文件：Prettier 格式化
    '*.{json,md,yml,yaml}': 'prettier --write'
}
