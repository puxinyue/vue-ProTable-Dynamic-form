#!/bin/bash

# Dynamic Form Vue3 发布脚本
# 使用方法: ./scripts/publish.sh [patch|minor|major]

set -e  # 遇到错误时退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否在正确的目录
check_directory() {
    if [ ! -f "package.json" ]; then
        log_error "请在项目根目录运行此脚本"
        exit 1
    fi
    
    PACKAGE_NAME=$(node -p "require('./package.json').name")
    if [ "$PACKAGE_NAME" != "@chl1860/dynamic-form-vue3" ]; then
        log_error "包名不匹配: $PACKAGE_NAME"
        exit 1
    fi
}

# 检查 Git 状态
check_git_status() {
    log_info "检查 Git 状态..."
    
    if [ ! -d ".git" ]; then
        log_error "当前目录不是 Git 仓库"
        exit 1
    fi
    
    # 检查是否有未提交的更改
    if [ -n "$(git status --porcelain)" ]; then
        log_warning "发现未提交的更改:"
        git status --short
        read -p "是否继续发布? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "发布已取消"
            exit 0
        fi
    fi
    
    # 检查当前分支
    CURRENT_BRANCH=$(git branch --show-current)
    if [ "$CURRENT_BRANCH" != "main" ] && [ "$CURRENT_BRANCH" != "master" ]; then
        log_warning "当前分支不是 main/master: $CURRENT_BRANCH"
        read -p "是否继续发布? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            log_info "发布已取消"
            exit 0
        fi
    fi
}

# 检查 npm 登录状态
check_npm_login() {
    log_info "检查 npm 登录状态..."
    
    if ! npm whoami > /dev/null 2>&1; then
        log_error "请先登录 npm: npm login"
        exit 1
    fi
    
    NPM_USER=$(npm whoami)
    log_success "已登录 npm 用户: $NPM_USER"
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    log_success "依赖安装完成"
}

# 运行代码检查
run_lint() {
    log_info "运行代码检查..."
    
    if npm run lint; then
        log_success "代码检查通过"
    else
        log_error "代码检查失败"
        exit 1
    fi
}

# 运行类型检查
run_type_check() {
    log_info "运行类型检查..."
    
    if npm run type-check; then
        log_success "类型检查通过"
    else
        log_error "类型检查失败"
        exit 1
    fi
}

# 运行测试
run_tests() {
    log_info "运行测试..."
    
    if npm test; then
        log_success "测试通过"
    else
        log_error "测试失败"
        exit 1
    fi
}

# 构建项目
build_project() {
    log_info "构建项目..."
    
    # 清理之前的构建
    if [ -d "dist" ]; then
        rm -rf dist
        log_info "已清理之前的构建文件"
    fi
    
    # 构建项目
    if npm run build; then
        log_success "项目构建完成"
    else
        log_error "项目构建失败"
        exit 1
    fi
    
    # 检查构建产物
    if [ ! -f "dist/dynamic-form.es.js" ] || [ ! -f "dist/dynamic-form.umd.js" ]; then
        log_error "构建产物不完整"
        exit 1
    fi
    
    log_success "构建产物检查通过"
}

# 更新版本号
update_version() {
    local version_type=${1:-patch}
    
    log_info "更新版本号 ($version_type)..."
    
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    log_info "当前版本: $CURRENT_VERSION"
    
    # 使用 npm version 更新版本号
    if npm version $version_type --no-git-tag-version; then
        NEW_VERSION=$(node -p "require('./package.json').version")
        log_success "版本已更新: $CURRENT_VERSION -> $NEW_VERSION"
    else
        log_error "版本更新失败"
        exit 1
    fi
}

# 创建 Git 标签
create_git_tag() {
    local version=$1
    
    log_info "创建 Git 标签..."
    
    if git add package.json package-lock.json 2>/dev/null || true; then
        git commit -m "chore: bump version to $version" || true
    fi
    
    if git tag -a "v$version" -m "Release version $version"; then
        log_success "Git 标签创建成功: v$version"
    else
        log_warning "Git 标签创建失败，可能已存在"
    fi
}

# 发布到 npm
publish_to_npm() {
    log_info "发布到 npm..."
    
    # 检查是否已经发布过这个版本
    CURRENT_VERSION=$(node -p "require('./package.json').version")
    if npm view @chl1860/dynamic-form-vue3@$CURRENT_VERSION version > /dev/null 2>&1; then
        log_error "版本 $CURRENT_VERSION 已经发布过了"
        exit 1
    fi
    
    # 发布到 npm
    if npm publish --access public; then
        log_success "发布成功!"
        log_info "包地址: https://www.npmjs.com/package/@chl1860/dynamic-form-vue3"
    else
        log_error "发布失败"
        exit 1
    fi
}

# 推送 Git 更改
push_git_changes() {
    log_info "推送 Git 更改..."
    
    if git push origin $(git branch --show-current); then
        log_success "代码推送成功"
    else
        log_warning "代码推送失败"
    fi
    
    if git push origin --tags; then
        log_success "标签推送成功"
    else
        log_warning "标签推送失败"
    fi
}

# 验证发布
verify_publish() {
    local version=$1
    
    log_info "验证发布..."
    
    # 等待 npm 更新
    sleep 10
    
    # 检查包是否可安装
    if npm view @chl1860/dynamic-form-vue3@$version version > /dev/null 2>&1; then
        log_success "发布验证成功: 版本 $version 可在 npm 上找到"
    else
        log_warning "发布验证失败: 版本 $version 在 npm 上不可见"
    fi
}

# 显示发布信息
show_publish_info() {
    local version=$1
    
    echo
    log_success "🎉 发布完成!"
    echo
    echo "📦 包信息:"
    echo "   - 包名: @chl1860/dynamic-form-vue3"
    echo "   - 版本: $version"
    echo "   - npm 地址: https://www.npmjs.com/package/@chl1860/dynamic-form-vue3"
    echo
    echo "📋 安装命令:"
    echo "   npm install @chl1860/dynamic-form-vue3"
    echo "   yarn add @chl1860/dynamic-form-vue3"
    echo "   pnpm add @chl1860/dynamic-form-vue3"
    echo
    echo "🔗 CDN 地址:"
    echo "   https://unpkg.com/@chl1860/dynamic-form-vue3@$version/dist/dynamic-form.umd.js"
    echo
}

# 主函数
main() {
    local version_type=${1:-patch}
    
    echo "🚀 Dynamic Form Vue3 发布脚本"
    echo "================================"
    echo
    
    # 验证版本类型
    if [[ ! "$version_type" =~ ^(patch|minor|major)$ ]]; then
        log_error "无效的版本类型: $version_type"
        log_info "支持的版本类型: patch, minor, major"
        exit 1
    fi
    
    # 执行发布流程
    check_directory
    check_git_status
    check_npm_login
    install_dependencies
    run_lint
    run_type_check
    run_tests
    build_project
    update_version $version_type
    
    # 获取新版本号
    NEW_VERSION=$(node -p "require('./package.json').version")
    
    # 确认发布
    echo
    log_warning "准备发布版本: $NEW_VERSION"
    read -p "确认发布? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "发布已取消"
        exit 0
    fi
    
    create_git_tag $NEW_VERSION
    publish_to_npm
    push_git_changes
    verify_publish $NEW_VERSION
    show_publish_info $NEW_VERSION
}

# 运行主函数
main "$@"
