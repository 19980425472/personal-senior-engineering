import { Plugin } from 'vite'
import chokidar from 'chokidar'
import path from 'path'
import type { TsConfigJson } from 'type-fest'

import fs, { existsSync, lstatSync } from 'fs'
import fsPromises from 'fs/promises'
import jsonc from 'jsonc-parser'

// ============================
// 类型定义
// ============================

export interface AliasConfig {
    find: string | RegExp
    replacement: string
}

export interface AliasGeneratorStrategyParams {
    currentDir: string
    dirName: string
    parentAlias: string
    aliasPrefix: string
    useRegExp: boolean
    relativePath: string
}

export interface AliasGeneratorStrategy {
    (params: AliasGeneratorStrategyParams): {
        aliasKey: string
        aliasConfig: AliasConfig
    }
}

export type ExcludePredicate = (dirPath: string, dirName: string) => boolean

export type ConflictStrategy = 'skip' | 'overwrite' | 'append'

export interface DirectoryRule {
    /**
     * 目录名称或路径匹配规则。
     */
    pattern: string | RegExp
    /**
     * 别名生成策略。
     */
    strategy?: AliasGeneratorStrategy
    /**
     * 是否排除该目录。
     */
    exclude?: boolean
}

export interface AliasGeneratorOptions {
    /**
     * 目标目录路径，用于生成别名。
     * 默认值: 'src'
     */
    targetDir?: string

    /**
     * 扫描目录的深度。
     * 默认值: 2
     */
    depth?: number

    /**
     * 目录规则配置。
     */
    directoryRules?: DirectoryRule[]

    /**
     * 别名的前缀，例如 '@'。
     * 默认值: '@'
     */
    aliasPrefix?: string

    /**
     * 别名冲突时的处理策略：
     * - 'skip': 跳过冲突的别名。
     * - 'overwrite': 覆盖冲突的别名。
     * - 'append': 追加冲突的别名（可能生成多个别名）。
     * 默认值: 'append'
     */
    conflictStrategy?: ConflictStrategy

    /**
     * 是否跟随符号链接（symlinks）。
     * 默认值: false
     */
    followSymlinks?: boolean

    /**
     * 是否使用正则表达式匹配别名。
     * 默认值: false
     */
    useRegExp?: boolean

    /**
     * 需要排除的目录列表（例如 ['node_modules', '.git']）。
     * 默认值: ['node_modules', '.git', 'dist', 'public']
     */
    excludeDirs?: string[]

    /**
     * 需要跳过的目录列表（与 excludeDirs 类似，但优先级更高）。
     * 默认值: []
     */
    skipDirs?: string[]

    /**
     * 自定义排除目录的谓词函数。
     * @param dirPath 目录路径
     * @param dirName 目录名称
     * @returns 返回 true 表示排除该目录
     * 默认值: () => false
     */
    excludePredicate?: ExcludePredicate

    /**
     * 自定义别名生成策略函数。
     * 默认值: 使用内置的 defaultGeneratorStrategy
     */
    generator?: AliasGeneratorStrategy

    /**
     * 缓存的有效时间（毫秒）。
     * 默认值: 6000
     */
    cacheTTL?: number
}

export interface DynamicAliasPluginOptions extends AliasGeneratorOptions {
    generateAlias: (options: AliasGeneratorOptions) => Promise<AliasConfig[]>
}

// ============================
// 默认别名生成策略
// ============================

const defaultGeneratorStrategy: AliasGeneratorStrategy = (
    params: AliasGeneratorStrategyParams
): { aliasKey: string; aliasConfig: AliasConfig } => {
    const { currentDir, dirName, aliasPrefix, useRegExp } = params
    const baseAlias = `${aliasPrefix}${dirName}`

    const find = useRegExp ? new RegExp(`^${baseAlias.replace(/[\\/]/g, '\\\\/')}\\/`) : baseAlias

    return {
        aliasKey: baseAlias,
        aliasConfig: {
            find,
            replacement: currentDir
        }
    }
}

// ============================
// 核心函数：生成别名
// ============================

// 默认配置（缓存优化）
const DEFAULT_ALIAS_OPTIONS: Required<AliasGeneratorOptions> = {
    targetDir: 'src',
    depth: 2,
    aliasPrefix: '@',
    conflictStrategy: 'append',
    followSymlinks: false,
    useRegExp: false,
    excludeDirs: ['node_modules', '.git', 'dist', 'public'],
    skipDirs: [],
    excludePredicate: () => false,
    generator: defaultGeneratorStrategy,
    cacheTTL: 6000,
    directoryRules: []
}

export async function generateAlias(
    options: AliasGeneratorOptions = {},
    isDev: boolean = process.env.NODE_ENV === 'development'
): Promise<AliasConfig[]> {
    const opts: Required<AliasGeneratorOptions> = {
        ...DEFAULT_ALIAS_OPTIONS,
        ...options
    }

    const projectRoot = process.cwd()
    const targetAbsPath = path.resolve(projectRoot, opts.targetDir)

    validateConfig(targetAbsPath, projectRoot, opts.depth)

    const logger = createLogger(isDev)
    const excludeSet = new Set([...opts.excludeDirs, ...opts.skipDirs])
    const isExcluded = (dirPath: string, dirName: string) =>
        excludeSet.has(dirName) || opts.excludePredicate(dirPath, dirName)

    const aliasMap = new Map<string, AliasConfig>()
    const aliasCounter = new Map<string, number>()
    const symlinkVisited = new Set<string>()

    await processDirectory(
        targetAbsPath,
        1,
        '',
        projectRoot,
        opts,
        isExcluded,
        aliasMap,
        aliasCounter,
        symlinkVisited,
        logger
    )

    symlinkVisited.clear()
    return Array.from(aliasMap.values())
}

// ============================
// 动态别名Vite插件
// ============================

export function dynamicAliasPlugin(options: DynamicAliasPluginOptions): Plugin {
    const opts: Required<DynamicAliasPluginOptions> = {
        directoryRules: [],
        targetDir: 'src',
        depth: 2,
        aliasPrefix: '@',
        conflictStrategy: 'append',
        followSymlinks: false,
        useRegExp: false,
        excludeDirs: ['node_modules', '.git', 'dist', 'public'],
        skipDirs: [],
        excludePredicate: () => false,
        generator: defaultGeneratorStrategy,
        cacheTTL: 6000,
        ...options
    }

    const projectRoot = process.cwd()
    const targetAbsPath = path.resolve(projectRoot, opts.targetDir)
    let baseAlias: AliasConfig[] = []
    // 修复：使用import('chokidar').FSWatcher替代chokidar.FSWatcher
    let watcher: import('chokidar').FSWatcher | null = null

    async function initAlias() {
        try {
            baseAlias = await opts.generateAlias(opts)
            // 这里需要调用相关函数 把别名写入tsconfig.json中
            writeAliasesToTsconfig(baseAlias)
            console.log('[dynamicAlias] 初始别名配置完成，共', baseAlias.length, '个别名')
        } catch (err) {
            console.error('[dynamicAlias] 初始化别名失败:', err)
        }
    }

    async function updateAlias(dirPath: string, action: '新增' | '删除') {
        try {
            const newAlias = await opts.generateAlias(opts)
            baseAlias = newAlias
            // 这里需要调用相关函数 把别名写入tsconfig.json中
            writeAliasesToTsconfig(baseAlias)
            console.log('他妈的~~~', baseAlias)

            console.log(`[dynamicAlias] 目录${action}: ${path.relative(projectRoot, dirPath)}，别名已更新`)
        } catch (err) {
            console.error(`[dynamicAlias] 目录${action}后更新别名失败:`, err)
        }
    }

    function getDirectoryDepth(dirPath: string): number {
        const relativePath = path.relative(targetAbsPath, dirPath)
        if (relativePath.startsWith('..')) {
            return Infinity
        }
        return relativePath.split(path.sep).filter((seg) => seg).length
    }

    function startWatcher() {
        if (watcher) {
            watcher.close().catch((err) => console.error('[dynamicAlias] 关闭监听器失败:', err))
        }

        // 修复：使用import('chokidar').FSWatcher的类型推断
        watcher = chokidar.watch(targetAbsPath, {
            depth: opts.depth,
            ignored: (str: string) => {
                try {
                    if (existsSync(str)) {
                        const stats = lstatSync(str)
                        if (stats.isFile()) return true
                    }

                    const dirName = path.basename(str)
                    return (
                        opts.excludeDirs.includes(dirName) ||
                        opts.skipDirs.includes(dirName) ||
                        opts.excludePredicate(str, dirName)
                    )
                } catch {
                    return false
                }
            },
            persistent: true,
            ignoreInitial: true,
            ignorePermissionErrors: true,
            followSymlinks: opts.followSymlinks
        })

        watcher
            .on('addDir', (dirPath) => {
                const depth = getDirectoryDepth(dirPath)
                if (depth <= opts.depth) {
                    updateAlias(dirPath, '新增')
                }
            })
            .on('unlinkDir', (dirPath) => {
                const depth = getDirectoryDepth(dirPath)
                if (depth <= opts.depth) {
                    updateAlias(dirPath, '删除')
                }
            })
            .on('error', (err) => console.error('[dynamicAlias] 监听错误:', err))
    }

    initAlias()
    startWatcher()

    return {
        name: 'dynamic-alias',
        resolveId(id) {
            for (const alias of baseAlias) {
                if (typeof alias.find === 'string' && id.startsWith(alias.find)) {
                    const resolvedId = id.replace(alias.find, alias.replacement)
                    return resolvedId
                }
            }
            return null
        },
        closeBundle() {
            if (watcher) {
                watcher.close().catch((err) => console.error('[dynamicAlias] 关闭监听器失败:', err))
                watcher = null
            }
        }
    }
}

// ============================
// 内部辅助函数
// ============================

function validateConfig(targetAbsPath: string, projectRoot: string, depth: number): void {
    if (!targetAbsPath.startsWith(projectRoot)) {
        throw new Error(`目标目录必须在工程内！工程根: ${projectRoot}，目标: ${targetAbsPath}`)
    }
    if (!existsSync(targetAbsPath)) {
        throw new Error(`目标目录不存在: ${targetAbsPath}`)
    }
    if (!Number.isInteger(depth) || depth < 1) {
        throw new Error(`深度必须为≥1的整数，当前配置: ${depth}`)
    }
}

function createLogger(isDev: boolean) {
    return isDev
        ? {
              info: (msg: string) => console.log(`[AliasGenerator] ${msg}`),
              warn: (msg: string) => console.warn(`[AliasGenerator] ⚠️ ${msg}`)
          }
        : {}
}

async function processDirectory(
    dir: string,
    currentDepth: number,
    parentAlias: string,
    projectRoot: string,
    opts: Required<AliasGeneratorOptions>,
    isExcluded: ExcludePredicate,
    aliasMap: Map<string, AliasConfig>,
    aliasCounter: Map<string, number>,
    symlinkVisited: Set<string>,
    logger: ReturnType<typeof createLogger>,
    visitedDirs: Set<string> = new Set()
): Promise<void> {
    // 检测目录循环引用
    if (visitedDirs.has(dir)) {
        logger.warn(`检测到目录循环引用: ${dir}`)
        return
    }
    visitedDirs.add(dir)

    // 匹配目录级规则（缓存优化）

    // 日志：递归深度警告
    if (currentDepth > 5) {
        logger.warn(`递归深度超过阈值: ${currentDepth}（目录: ${dir}）`)
    }
    const dirName = path.basename(dir)
    const relPath = path.relative(projectRoot, dir)

    if (isExcluded(dir, dirName)) {
        logger.info(`排除目录: ${relPath}`)
        return
    }

    let stats
    try {
        stats = await fsPromises.lstat(dir)
    } catch (e: unknown) {
        if (e instanceof Error) {
            logger.warn(`无法访问目录: ${relPath}（${e.message}）`)
        } else {
            logger.warn(`无法访问目录: ${relPath}（未知错误：${String(e)}）`)
        }
        return
    }

    if (stats.isSymbolicLink()) {
        if (!opts.followSymlinks) {
            logger.info(`跳过符号链接: ${relPath}`)
            return
        }

        let realPath
        try {
            realPath = await fsPromises.realpath(dir)
        } catch (e: unknown) {
            if (e instanceof Error) {
                // 此时 e 会被 TypeScript 推断为 Error 类型，可安全访问 message
                logger.warn(`无法解析符号链接: ${relPath}（${e.message}）`)
            } else {
                // 极端情况：有人 throw 了非 Error 类型（比如 throw "出错了"），做兼容处理
                logger.warn(`无法解析符号链接: ${relPath}（未知错误：${String(e)}）`)
            }
            return
        }

        if (symlinkVisited.has(realPath)) {
            logger.warn(`循环引用: ${relPath} → ${path.relative(projectRoot, realPath)}`)
            return
        }

        symlinkVisited.add(realPath)
        return processDirectory(
            realPath,
            currentDepth,
            parentAlias,
            projectRoot,
            opts,
            isExcluded,
            aliasMap,
            aliasCounter,
            symlinkVisited,
            logger
        )
    }

    if (currentDepth >= 1 && currentDepth <= opts.depth) {
        const strategyParams: AliasGeneratorStrategyParams = {
            currentDir: dir,
            dirName,
            parentAlias,
            aliasPrefix: opts.aliasPrefix,
            useRegExp: opts.useRegExp,
            relativePath: relPath
        }
        const { aliasKey, aliasConfig } = opts.generator(strategyParams)

        let finalAliasKey = aliasKey
        if (aliasMap.has(aliasKey)) {
            switch (opts.conflictStrategy) {
                case 'skip':
                    logger.warn(`跳过重名目录: ${relPath}（已存在别名 ${aliasKey}）`)
                    return
                case 'overwrite':
                    logger.warn(`覆盖重名目录: ${relPath}（别名 ${aliasKey}）`)
                    break
                case 'append': {
                    const count = aliasCounter.get(aliasKey) || 1
                    finalAliasKey = `${aliasKey}_${count}`
                    aliasCounter.set(aliasKey, count + 1)
                    logger.info(`重名目录自动编号: ${aliasKey} → ${finalAliasKey}（${relPath}）`)
                    break
                }
            }
        } else {
            aliasCounter.set(aliasKey, 1)
        }

        aliasMap.set(finalAliasKey, {
            ...aliasConfig,
            find: finalAliasKey
        })

        // logger.info(`生成别名: ${finalAliasKey} → ${relPath}`);
    }

    if (currentDepth >= opts.depth) {
        return
    }

    const children = await readDirSafe(dir, logger)
    for (const child of children) {
        const childPath = path.join(dir, child)
        await processDirectory(
            childPath,
            currentDepth + 1,
            `${opts.aliasPrefix}${dirName}`,
            projectRoot,
            opts,
            isExcluded,
            aliasMap,
            aliasCounter,
            symlinkVisited,
            logger
        )
    }
}

async function readDirSafe(dir: string, logger: ReturnType<typeof createLogger>): Promise<string[]> {
    try {
        const entries = await fsPromises.readdir(dir, { withFileTypes: true })
        return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name)
    } catch (e: unknown) {
        if (e instanceof Error) {
            logger.warn(`读取目录失败: ${dir}（${e.message}）`)
        } else {
            logger.warn(`读取目录失败: ${dir}（未知错误：${String(e)}）`)
        }
        return []
    }
}

// ============================
//  处理动态写入tsconfig.json
// ============================

export interface TsconfigFormatOptions {
    tsconfigPath?: string
    targetDir?: string // 基准目录，默认'src'
    include?: string[] // 自定义include配置
}

/**
 * 按照指定格式写入tsconfig.json配置
 * 确保生成 "baseUrl": ".", "paths": {...} 和指定的"include"结构
 */
export async function writeAliasesToTsconfig(
    aliases: AliasConfig[],
    options: {
        tsconfigPath?: string
        targetDir?: string
        baseUrl?: string
        additionalIncludes?: string[]
    } = {}
) {
    // 配置参数
    const tsconfigPath = options.tsconfigPath || path.resolve(process.cwd(), 'tsconfig.json')
    const targetDir = options.targetDir || 'src'
    const baseUrl = options.baseUrl || '.'
    const defaultIncludes = [
        'vite.config.ts',
        'src/**/*.ts',
        'src/**/*.d.ts',
        'src/**/*.tsx',
        'src/**/*.vue',
        'src/**/*.js',
        'src/**/*.jsx'
    ]
    const additionalIncludes = options.additionalIncludes || []
    const allIncludes = [...defaultIncludes, ...additionalIncludes]

    if (!existsSync(tsconfigPath)) {
        throw new Error(`找不到tsconfig.json文件: ${tsconfigPath}`)
    }

    try {
        // 1. 读取并解析为对象（保留原始数据）
        const rawContent = await fs.readFileSync(tsconfigPath, 'utf-8')
        const tsconfig: TsConfigJson = jsonc.parse(rawContent) || {}

        // 2. 确保compilerOptions存在
        tsconfig.compilerOptions = tsconfig.compilerOptions || {}

        // 3. 处理paths（合并原有+新增）
        const projectRoot = path.dirname(tsconfigPath)
        const targetAbsPath = path.resolve(projectRoot, targetDir)
        const newPaths: Record<string, string[]> = {
            ...(tsconfig.compilerOptions.paths || {})
        }

        aliases.forEach((alias) => {
            if (typeof alias.find !== 'string') return
            const relativePath = path.relative(targetAbsPath, alias.replacement).replace(/\\/g, '/') // 统一路径分隔符
            newPaths[`${alias.find}/*`] = [`${targetDir}/${relativePath}${relativePath ? '/*' : ''}`]
        })

        // 4. 直接修改对象属性（核心：对象操作）
        tsconfig.compilerOptions.baseUrl = baseUrl // 设置baseUrl
        tsconfig.compilerOptions.paths = newPaths // 覆盖paths
        tsconfig.include = Array.from(
            // 设置include（去重）
            new Set([...(tsconfig.include || []), ...allIncludes])
        )

        // 5. 转换为带缩进的JSON字符串（确保格式正确）
        // 关键：使用JSON.stringify自动处理结构、逗号和括号
        const updatedContent = JSON.stringify(tsconfig, null, 2) + '\n' // 加换行符

        // 6. 整体写入文件
        await fs.writeFileSync(tsconfigPath, updatedContent, 'utf-8')
        console.log(`✅ 成功写入tsconfig.json，结构正确`)
    } catch (error) {
        console.error('❌ 处理失败:', (error as Error).message)
        throw error
    }
}
