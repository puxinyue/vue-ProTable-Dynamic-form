#!/bin/bash

# 快速发布脚本
# 使用方法: ./scripts/quick-publish.sh [patch|minor|major]

set -e

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${GREEN}🚀 快速发布脚本${NC}"
echo "=================="

# 检查参数
VERSION_TYPE=${1:-patch}
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major)$ ]]; then
    echo -e "${RED}错误: 无效的版本类型${NC}"
    echo "支持的版本类型: patch, minor, major"
    exit 1
fi

# 检查 npm 登录
if ! npm whoami > /dev/null 2>&1; then
    echo -e "${RED}错误: 请先登录 npm${NC}"
    echo "运行: npm login"
    exit 1
fi

echo -e "${YELLOW}当前用户: $(npm whoami)${NC}"

# 构建项目
echo "📦 构建项目..."
npm run build

# 更新版本
echo "📝 更新版本 ($VERSION_TYPE)..."
npm version $VERSION_TYPE --no-git-tag-version

# 获取新版本
NEW_VERSION=$(node -p "require('./package.json').version")
echo -e "${GREEN}新版本: $NEW_VERSION${NC}"

# 确认发布
echo
read -p "确认发布到 npm? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "发布已取消"
    exit 0
fi

# 发布
echo "🚀 发布到 npm..."
npm publish --access public

echo -e "${GREEN}✅ 发布成功!${NC}"
echo "📦 包地址: https://www.npmjs.com/package/@chl1860/dynamic-form-vue3"
echo "📋 安装: npm install @chl1860/dynamic-form-vue3@$NEW_VERSION"
