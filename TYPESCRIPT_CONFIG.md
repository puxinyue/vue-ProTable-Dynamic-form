# TypeScript 配置说明

本项目使用了双TypeScript配置策略来分离开发和构建环境。

## 配置文件说明

### 1. `tsconfig.json` - 开发配置
- **用途**: 开发时的TypeScript配置
- **包含**: 所有源代码文件，包括示例组件和开发文件
- **特点**: 提供完整的类型检查和IDE支持

```json
{
  "include": [
    "src/**/*",     // 包含所有源码文件
    "src/**/*.vue"  // 包含Vue组件
  ],
  "exclude": [
    "src/**/__tests__/*"  // 只排除测试文件
  ]
}
```

### 2. `tsconfig.build.json` - 构建配置
- **用途**: 库构建时的TypeScript配置
- **包含**: 只包含库的核心代码
- **特点**: 排除示例和开发文件，避免编译错误

```json
{
  "include": [
    "src/index.ts",         // 入口文件
    "src/components/**/*",  // 核心组件
    "src/composables/**/*", // 组合式函数
    "src/types/**/*",       // 类型定义
    "src/utils/**/*"        // 工具函数
  ],
  "exclude": [
    "src/App.vue",          // 开发时的主应用
    "src/main.ts",          // 开发时的入口
    "src/examples/**/*"     // 示例组件
  ]
}
```

## 构建流程

1. **开发模式** (`npm run dev`)
   - 使用 `tsconfig.json`
   - 包含所有文件，可以正常运行示例

2. **构建模式** (`npm run build`)
   - 使用 `tsconfig.build.json`
   - 只编译核心库代码，生成干净的npm包

## 解决的问题

### 问题描述
在构建时，App.vue文件导入了examples目录下的示例组件，但构建配置排除了这些组件，导致TypeScript编译器找不到文件：

```
error TS6307: File 'src/examples/SimpleLinkageExample.vue.ts' is not listed within the file list of project
```

### 解决方案
通过双配置策略：
- **开发时**: App.vue和示例组件都可用，提供完整的开发体验
- **构建时**: 只处理核心库代码，避免依赖问题

## 命令说明

```bash
# 开发模式（使用默认配置）
npm run dev

# 构建生产版本（使用构建配置）
npm run build

# 手动类型检查（开发配置）
npx vue-tsc --noEmit

# 手动类型检查（构建配置）
npx vue-tsc --project tsconfig.build.json --noEmit
```

## 维护说明

当添加新的核心功能文件时，需要：
1. 在 `tsconfig.build.json` 的 `include` 中添加对应路径
2. 确保新文件不依赖examples目录下的组件

当添加示例或开发工具时：
1. 文件会自动被 `tsconfig.json` 包含
2. 自动被 `tsconfig.build.json` 排除（如果在examples/目录下）