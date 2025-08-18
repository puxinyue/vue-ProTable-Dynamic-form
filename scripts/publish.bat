@echo off
setlocal enabledelayedexpansion

REM Dynamic Form Vue3 发布脚本 (Windows)
REM 使用方法: publish.bat [patch|minor|major]

echo 🚀 Dynamic Form Vue3 发布脚本
echo ================================

REM 检查参数
set VERSION_TYPE=%1
if "%VERSION_TYPE%"=="" set VERSION_TYPE=patch

REM 验证版本类型
if not "%VERSION_TYPE%"=="patch" if not "%VERSION_TYPE%"=="minor" if not "%VERSION_TYPE%"=="major" (
    echo 错误: 无效的版本类型
    echo 支持的版本类型: patch, minor, major
    exit /b 1
)

REM 检查 npm 登录
echo 检查 npm 登录状态...
npm whoami >nul 2>&1
if errorlevel 1 (
    echo 错误: 请先登录 npm
    echo 运行: npm login
    exit /b 1
)

for /f "tokens=*" %%i in ('npm whoami') do set NPM_USER=%%i
echo 当前用户: %NPM_USER%

REM 构建项目
echo 📦 构建项目...
call npm run build
if errorlevel 1 (
    echo 构建失败
    exit /b 1
)

REM 更新版本
echo 📝 更新版本 (%VERSION_TYPE%)...
call npm version %VERSION_TYPE% --no-git-tag-version
if errorlevel 1 (
    echo 版本更新失败
    exit /b 1
)

REM 获取新版本
for /f "tokens=*" %%i in ('node -p "require('./package.json').version"') do set NEW_VERSION=%%i
echo 新版本: %NEW_VERSION%

REM 确认发布
echo.
set /p CONFIRM="确认发布到 npm? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo 发布已取消
    exit /b 0
)

REM 发布
echo 🚀 发布到 npm...
call npm publish --access public
if errorlevel 1 (
    echo 发布失败
    exit /b 1
)

echo ✅ 发布成功!
echo 📦 包地址: https://www.npmjs.com/package/@chl1860/dynamic-form-vue3
echo 📋 安装: npm install @chl1860/dynamic-form-vue3@%NEW_VERSION%

pause
