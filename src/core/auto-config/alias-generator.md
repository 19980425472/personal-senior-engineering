# Alias Generator 使用说明

## 功能概述

`alias-generator.ts` 是一个用于自动生成路径别名的工具，支持以下功能：

- 根据目录结构生成别名配置。
- 支持自定义别名前缀、递归深度和冲突解决策略。
- 支持排除特定目录（如 `node_modules`）。

## 配置项说明

以下是所有可配置项的详细说明：

| 配置项             | 类型                                  | 是否可选 | 默认值                                       | 描述                                                                                                              |
| ------------------ | ------------------------------------- | -------- | -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `targetDir`        | `string`                              | 可选     | `'src'`                                      | 目标目录，相对于项目根目录。                                                                                      |
| `depth`            | `number`                              | 可选     | `2`                                          | 递归扫描的深度。                                                                                                  |
| `aliasPrefix`      | `string`                              | 可选     | `'@'`                                        | 别名的前缀符号。                                                                                                  |
| `conflictStrategy` | `'append' \| 'overwrite' \| 'ignore'` | 可选     | `'append'`                                   | 别名冲突时的处理策略：<br>- `append`：追加数字后缀。<br>- `overwrite`：覆盖已有别名。<br>- `ignore`：跳过冲突项。 |
| `followSymlinks`   | `boolean`                             | 可选     | `false`                                      | 是否处理符号链接目录。                                                                                            |
| `useRegExp`        | `boolean`                             | 可选     | `false`                                      | 是否使用正则表达式匹配路径。                                                                                      |
| `excludeDirs`      | `string[]`                            | 可选     | `['node_modules', '.git', 'dist', 'public']` | 需要排除的目录列表。                                                                                              |
| `skipDirs`         | `string[]`                            | 可选     | `[]`                                         | 跳过扫描的目录列表（不生成别名）。                                                                                |
| `excludePredicate` | `(dirPath: string) => boolean`        | 可选     | `() => false`                                | 自定义排除目录的逻辑函数。                                                                                        |
| `generator`        | `(dirPath: string) => string`         | 可选     | `defaultGeneratorStrategy`                   | 自定义别名生成策略函数。                                                                                          |
| `cacheTTL`         | `number`                              | 可选     | `6000`                                       | 缓存时间（毫秒），用于高频调用优化。                                                                              |
| `isDev`            | `boolean`                             | 可选     | `false`                                      | 是否启用开发模式（输出详细日志）。                                                                                |

## 使用案例

### 基本用法

```typescript
import { generateAlias } from './alias-generator'

// 生成别名配置
const aliases = await generateAlias({
    targetDir: 'src', // 可选
    depth: 2, // 可选
    aliasPrefix: '@', // 可选
    conflictStrategy: 'append', // 可选
})

console.log(aliases)
```

### 自定义排除目录

```typescript
const aliases = await generateAlias({
    excludeDirs: ['node_modules', 'dist', 'test'], // 可选
})
```

### 开发模式

```typescript
const aliases = await generateAlias({
    isDev: true, // 可选，启用开发模式日志
})
```

## 注意事项

1. **路径解析**：确保 `targetDir` 是相对于项目根目录的有效路径。
2. **性能优化**：高频调用时建议启用缓存（`cacheTTL`）。
3. **符号链接**：默认不处理符号链接，可通过 `followSymlinks` 启用。
