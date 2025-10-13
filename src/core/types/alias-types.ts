// ============================
// 类型定义（重新整理）
// ============================

/**
 * 生成的别名配置项
 * @property find - 用于匹配的别名标识（字符串或正则表达式）
 * @property replacement - 别名对应的实际路径
 */
export interface AliasConfig {
    find: string | RegExp
    replacement: string
}

/**
 * 别名生成策略的参数
 * @property currentDir - 当前目录的绝对路径
 * @property dirName - 当前目录的名称
 * @property parentAlias - 父目录的别名（用于层级拼接）
 * @property aliasPrefix - 别名前缀（如@）
 * @property useRegExp - 是否生成正则表达式形式的别名
 * @property relativePath - 当前目录相对于项目根目录的路径
 */
export interface AliasGeneratorStrategyParams {
    currentDir: string
    dirName: string
    parentAlias: string
    aliasPrefix: string
    useRegExp: boolean
    relativePath: string
}

/**
 * 别名生成策略接口
 * 定义如何根据目录信息生成别名
 * @param params - 生成策略参数
 * @returns 包含别名键（用于冲突检测）和别名配置的对象
 */
export interface AliasGeneratorStrategy {
    (params: AliasGeneratorStrategyParams): {
        aliasKey: string // 用于冲突检测的唯一键
        aliasConfig: AliasConfig // 生成的别名配置
    }
}

/**
 * 动态排除目录的函数类型
 * @param dirPath - 目录的绝对路径
 * @param dirName - 目录名称
 * @returns 是否排除该目录（true为排除）
 */
export type ExcludePredicate = (dirPath: string, dirName: string) => Promise<boolean>

/**
 * 冲突处理策略
 * - skip: 跳过重名目录，不生成别名
 * - overwrite: 覆盖已存在的别名
 * - append: 自动添加数字后缀（如@home_1）
 */
export type ConflictStrategy = 'skip' | 'overwrite' | 'append'

/**
 * 别名生成器的配置选项
 * @property targetDir - 目标扫描目录（默认'src'）
 * @property depth - 扫描深度（默认2）
 * @property aliasPrefix - 别名前缀（默认'@'）
 * @property conflictStrategy - 重名处理策略（默认'append'）
 * @property followSymlinks - 是否跟随符号链接（默认false）
 * @property useRegExp - 是否生成正则表达式形式的别名（默认false）
 * @property excludeDirs - 固定排除的目录名称列表
 * @property skipDirs - 额外排除的目录名称列表
 * @property excludePredicate - 动态排除目录的函数
 * @property generator - 自定义别名生成策略
 * @property cacheTTL - 目录缓存时间（毫秒，默认6000）
 */
export interface AliasGeneratorOptions {
    targetDir?: string
    depth?: number
    aliasPrefix?: string
    conflictStrategy?: ConflictStrategy
    followSymlinks?: boolean
    useRegExp?: boolean
    excludeDirs?: string[]
    skipDirs?: string[]
    excludePredicate?: ExcludePredicate
    generator?: AliasGeneratorStrategy
    cacheTTL?: number
}

/**
 * 动态别名插件的配置选项
 * 继承自AliasGeneratorOptions，并强制要求提供generateAlias方法
 */
export interface DynamicAliasPluginOptions extends AliasGeneratorOptions {
    /**
     * 用于生成别名的函数
     * @param options - 别名生成配置
     * @returns 别名配置数组
     */
    generateAlias: (options: AliasGeneratorOptions) => Promise<AliasConfig[]>
}

// ============================
// 默认别名生成策略
// ============================

/**
 * 默认别名生成策略
 * 规则：
 * - 一级目录：@目录名（如src/components → @components）
 * - 二级目录：@目录名（如src/views/home → @home）
 * - 重名目录自动添加数字后缀（如@home_1、@home_2）
 */
export const defaultGeneratorStrategy: AliasGeneratorStrategy = (
    params: AliasGeneratorStrategyParams
): { aliasKey: string; aliasConfig: AliasConfig } => {
    const { currentDir, dirName, aliasPrefix, useRegExp } = params

    // 仅使用当前目录名生成基础别名（不拼接父目录）
    const baseAlias = `${aliasPrefix}${dirName}`

    // 根据配置生成字符串或正则形式的别名
    const find = useRegExp ? new RegExp(`^${baseAlias.replace(/[\\/]/g, '\\\\/')}\\/`) : baseAlias

    return {
        aliasKey: baseAlias,
        aliasConfig: {
            find,
            replacement: currentDir
        }
    }
}
