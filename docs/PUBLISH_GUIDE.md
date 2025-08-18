# 发布指南

本文档描述如何将动态表单组件发布到npm。

## 📦 发布前准备

### 1. 安装依赖

```bash
cd dynamic-form
npm install
```

### 2. 构建项目

```bash
npm run build
```

这将生成（已优化）：
- `dist/dynamic-form.es.js` - ES模块版本 (~46KB，已压缩)
- `dist/dynamic-form.umd.js` - UMD版本 (~24KB，已压缩)
- `dist/index.d.ts` - 合并的TypeScript类型定义 (~16KB)
- `dist/style.css` - 优化的样式文件 (~4KB)

**优化特点**：
- ✅ 移除了源码映射文件，减少~350KB
- ✅ 示例组件不包含在发布包中
- ✅ 类型定义合并为单文件，便于使用
- ✅ 专门的构建配置，解决TypeScript编译错误
- ✅ 总包体积从~550KB降至~90KB，减少84%

**技术细节**：
- 使用 `tsconfig.build.json` 专门用于库构建
- 开发时使用 `tsconfig.json`，包含所有文件（含示例）
- 构建时使用专门配置，只编译核心库代码

### 3. 检查构建结果

确保以下文件存在：
- [ ] `dist/dynamic-form.es.js`
- [ ] `dist/dynamic-form.umd.js` 
- [ ] `dist/index.d.ts`
- [ ] `package.json` 中的配置正确

## 🚀 发布到npm

### 1. 登录npm

```bash
npm login
```

### 2. 发布包

```bash
# 发布
npm publish

# 如果包名带有scope，首次发布需要公开发布
npm publish --access public
```

### 3. 版本管理

```bash
# 升级补丁版本 (2.0.0 -> 2.0.1)
npm version patch

# 升级次要版本 (2.0.0 -> 2.1.0)  
npm version minor

# 升级主要版本 (2.0.0 -> 3.0.0)
npm version major
```

## 🔍 发布后验证

### 1. 检查npm上的包

访问 https://www.npmjs.com/package/@dynamic-form/vue3

### 2. 在新项目中测试安装

```bash
mkdir test-install
cd test-install
npm init -y
npm install @dynamic-form/vue3 vue@^3.4.0 ant-design-vue@^4.0.0
```

### 3. 测试导入

```javascript
// test.js
const { SimpleForm } = require('@dynamic-form/vue3');
console.log('SimpleForm imported successfully:', !!SimpleForm);
```

## 📝 发布清单

发布前请确认：

- [ ] 版本号已更新
- [ ] CHANGELOG.md 已更新（如果有）
- [ ] README.md 文档完整
- [ ] 所有测试通过
- [ ] 构建成功
- [ ] 类型定义文件生成正确
- [ ] peerDependencies 配置正确
- [ ] files 字段包含必要文件
- [ ] .npmignore 排除不必要文件

## 🛠 常见问题

### 包名冲突

如果包名 `@dynamic-form/vue3` 已被占用，修改 `package.json` 中的 `name` 字段：

```json
{
  "name": "@your-org/dynamic-form-vue3"
}
```

### 权限问题

确保您有发布到指定scope的权限：

```bash
npm org add your-org your-username
```

### TypeScript定义问题

如果类型定义不正确，检查：
1. `vite.config.ts` 中的 `dts` 插件配置
2. `tsconfig.json` 配置
3. `package.json` 中的 `types` 字段

## 🔄 自动化发布

可以使用GitHub Actions自动化发布流程，参考 `.github/workflows/publish.yml`：

```yaml
name: Publish to npm

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```