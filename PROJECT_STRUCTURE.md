# 项目骨架说明

## 目录结构

```
project-root/
├── src/
│   ├── modules/                 # 业务模块（按功能域垂直划分，20人分工）
│   │   ├── user/                # 用户管理模块（3-4人负责）
│   │   │   ├── api/             # 模块私有接口（仅用户相关）
│   │   │   ├── components/      # 模块私有组件（如 UserStatusTag.vue）
│   │   │   ├── composables/     # 模块内复用逻辑（如 useUserForm.ts）
│   │   │   ├── views/           # 模块页面（如 UserList.vue）
│   │   │   ├── store/           # 模块私有状态（Pinia）
│   │   │   ├── routes.ts        # 模块路由（由核心路由汇总）
│   │   │   ├── types.ts         # 模块类型定义
│   │   │   └── __tests__/       # 模块单元测试
│   │   ├── role/                # 角色权限模块（2-3人负责，同上结构）
│   │   ├── dept/                # 部门管理模块（2-3人负责，同上结构）
│   │   ├── dashboard/           # 数据看板模块（2-3人负责，同上结构）
│   │   └── settings/            # 系统设置模块（2-3人负责，同上结构）
│   ├── shared/                  # 共享资源（2-3人专职维护）
│   │   ├── components/          # 全局通用组件（如 PageTable）
│   │   ├── composables/         # 全局复用逻辑（如 usePagination）
│   │   ├── api/                 # 全局接口基础（Axios 封装）
│   │   ├── store/               # 全局状态（如 userInfo）
│   │   ├── utils/               # 全局工具函数（如 formatDate）
│   │   ├── types/               # 全局类型（如 ApiResponse）
│   │   └── styles/              # 全局样式（主题变量）
│   ├── core/                    # 系统核心引擎（1-2人专职维护）
│   │   ├── router/              # 路由核心（全局路由注册）
│   │   ├── permission/          # 权限核心（动态路由生成）
│   │   ├── init/                # 系统初始化（全局组件注册）
│   │   └── config/              # 系统配置（环境变量映射）
│   └── main.ts                  # 应用入口
├── scripts/                     # 工程化脚本（1-2人维护）
│   ├── build/                   # 构建脚本（支持单模块构建）
│   ├── lint/                    # 代码检查（强制规范）
│   ├── test/                    # 测试脚本（批量执行）
│   └── generate/                # 代码生成器（自动创建模块）
├── docs/                        # 文档中心（1人维护）
│   ├── 01-开发规范.md           # 代码风格、目录使用
│   ├── 02-模块分工.md           # 模块负责人、功能边界
│   ├── 03-接口文档.md           # 全局接口规范
│   └── 04-问题排查.md           # 常见问题解决方案
└── .github/                     # GitHub 配置
    ├── CODEOWNERS               # 核心文件权限控制
    └── workflows/               # CI/CD 流水线
```

## 核心规则

1. **模块隔离**
    - 禁止跨模块直接调用私有内容（如 `user/api/` 不可被 `role/` 直接调用）。
    - 跨模块通信通过 `shared/` 或事件总线实现。

2. **权限控制**
    - `core/` 和 `shared/` 仅限指定人员修改（通过 `CODEOWNERS` 锁定）。
    - 模块负责人维护本模块的代码质量和测试覆盖率。

3. **自动化协作**
    - 使用 `scripts/generate/` 生成标准化模块，确保结构统一。
    - CI 流水线检查模块边界和依赖关系。

## 初始化步骤

1. 运行初始化脚本：
    ```powershell
    ./scripts/init.ps1
    ```
2. 生成新模块：
    ```bash
    node scripts/generate/index.js user
    ```
