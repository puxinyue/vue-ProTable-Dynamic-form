# 发布脚本使用指南

本目录包含了用于发布 `@chl1860/dynamic-form-vue3` 包到 npm 的各种脚本。

## 脚本文件

### 1. `publish.sh` - 完整发布脚本 (推荐)

**功能特性：**
- ✅ 完整的发布流程检查
- ✅ Git 状态检查
- ✅ npm 登录验证
- ✅ 代码质量检查 (lint, type-check, test)
- ✅ 自动构建和版本管理
- ✅ Git 标签创建
- ✅ 发布验证
- ✅ 彩色输出和详细日志

**使用方法：**
```bash
# 补丁版本发布 (2.0.0 -> 2.0.1)
./scripts/publish.sh patch

# 次要版本发布 (2.0.0 -> 2.1.0)
./scripts/publish.sh minor

# 主要版本发布 (2.0.0 -> 3.0.0)
./scripts/publish.sh major
```

**发布流程：**
1. 检查项目目录和包名
2. 检查 Git 状态和分支
3. 验证 npm 登录状态
4. 安装项目依赖
5. 运行代码检查 (lint)
6. 运行类型检查
7. 运行测试
8. 构建项目
9. 更新版本号
10. 确认发布
11. 创建 Git 标签
12. 发布到 npm
13. 推送 Git 更改
14. 验证发布结果

### 2. `quick-publish.sh` - 快速发布脚本

**功能特性：**
- ✅ 简化的发布流程
- ✅ 基本的 npm 登录检查
- ✅ 自动构建和版本更新
- ✅ 快速发布

**使用方法：**
```bash
# 快速发布补丁版本
./scripts/quick-publish.sh patch

# 快速发布次要版本
./scripts/quick-publish.sh minor

# 快速发布主要版本
./scripts/quick-publish.sh major
```

### 3. `publish.bat` - Windows 批处理脚本

**功能特性：**
- ✅ Windows 系统兼容
- ✅ 基本的发布流程
- ✅ 错误处理

**使用方法：**
```cmd
# 在 Windows 命令提示符中运行
publish.bat patch
publish.bat minor
publish.bat major
```

## npm 脚本命令

为了方便使用，package.json 中添加了以下脚本命令：

```bash
# 完整发布流程
npm run publish:patch    # 发布补丁版本
npm run publish:minor    # 发布次要版本
npm run publish:major    # 发布主要版本

# 快速发布
npm run publish:quick    # 快速发布补丁版本

# 发布前检查
npm run publish:check    # 运行所有检查但不发布
```

## 版本管理

### 语义化版本 (Semantic Versioning)

- **patch** (补丁版本): 修复 bug，向后兼容
  - 2.0.0 → 2.0.1
- **minor** (次要版本): 新功能，向后兼容
  - 2.0.0 → 2.1.0
- **major** (主要版本): 破坏性变更
  - 2.0.0 → 3.0.0

### 版本号格式

版本号遵循 `MAJOR.MINOR.PATCH` 格式：
- MAJOR: 主要版本号
- MINOR: 次要版本号
- PATCH: 补丁版本号

## 发布前检查清单

在发布之前，请确保：

### 1. 代码质量
- [ ] 代码通过 ESLint 检查
- [ ] TypeScript 类型检查通过
- [ ] 所有测试通过
- [ ] 构建成功

### 2. 文档更新
- [ ] README.md 已更新
- [ ] 版本历史已记录
- [ ] API 文档已更新
- [ ] 使用示例已测试

### 3. 配置检查
- [ ] package.json 中的包名正确
- [ ] 版本号正确
- [ ] 依赖项配置正确
- [ ] 导出配置正确

### 4. Git 状态
- [ ] 所有更改已提交
- [ ] 在正确的分支上 (main/master)
- [ ] 远程仓库已同步

### 5. npm 配置
- [ ] 已登录 npm
- [ ] 有发布权限
- [ ] 包名未被占用

## 常见问题

### Q: 发布失败怎么办？
A: 检查以下几点：
1. 是否已登录 npm (`npm whoami`)
2. 包名是否已被占用
3. 版本号是否已存在
4. 是否有发布权限

### Q: 如何回滚版本？
A: 如果发布了错误的版本：
1. 删除 npm 上的包版本 (如果可能)
2. 删除本地 Git 标签
3. 重置 package.json 中的版本号
4. 重新发布正确版本

### Q: 如何发布 beta 版本？
A: 使用 npm 的预发布标签：
```bash
npm version prerelease --preid=beta
npm publish --tag beta
```

### Q: 如何检查发布状态？
A: 使用以下命令：
```bash
# 检查包信息
npm view @chl1860/dynamic-form-vue3

# 检查特定版本
npm view @chl1860/dynamic-form-vue3@2.0.0

# 检查所有版本
npm view @chl1860/dynamic-form-vue3 versions
```

## 安全注意事项

1. **不要将 npm token 提交到代码库**
2. **使用 `.npmrc` 文件管理 npm 配置**
3. **定期更新依赖项**
4. **检查构建产物的安全性**

## 联系支持

如果在发布过程中遇到问题，请：
1. 检查错误日志
2. 查看 npm 官方文档
3. 联系项目维护者
