// 检测是否为 CI 环境或生产环境
const isCI = process.env.CI === 'true' || process.env.CI === '1'
const isProduction = process.env.NODE_ENV === 'production'

// 若为 CI/生产环境，直接退出（不安装 Husky）
if (isCI || isProduction) {
    process.exit(0)
}

// 开发环境正常安装 Husky
try {
    const husky = (await import('husky')).default
    husky.install() // 执行 Husky 安装逻辑
} catch (error) {
    console.warn('⚠️ Husky 安装失败（非开发环境可忽略）', error.message)
    process.exit(0) // 非开发环境下失败也不阻断流程
}
