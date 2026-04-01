@echo off
chcp 65001 >nul
echo ========================================
echo   飞书抖音插件 - GitHub 部署脚本
echo ========================================
echo.

:: 设置 Git 用户信息（如果需要）
echo [1/5] 配置 Git 用户信息...
git config --global user.name "YourName"
git config --global user.email "your-email@example.com"
echo ✓ Git 用户信息已配置（请根据实际情况修改）
echo.

:: 提示用户输入 GitHub 用户名
echo [2/5] 请输入你的 GitHub 用户名:
set /p GITHUB_USER=
if "%GITHUB_USER%"=="" (
    echo ✗ 错误：GitHub 用户名不能为空
    pause
    exit /b
)
echo ✓ GitHub 用户名：%GITHUB_USER%
echo.

:: 添加远程仓库
echo [3/5] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/%GITHUB_USER%/feishu-douyin-plugin.git
echo ✓ 远程仓库已添加
echo.

:: 切换分支到 main
echo [4/5] 切换到 main 分支...
git branch -M main
echo ✓ 分支已切换
echo.

:: 推送到 GitHub
echo [5/5] 推送到 GitHub...
echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo  重要提示：
echo  1. 如果推送失败，请使用 Personal Access Token
echo  2. 访问 https://github.com/settings/tokens
echo  3. 生成 Token (勾选 repo 权限)
echo  4. 推送时粘贴 Token 代替密码
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   部署成功！
    echo ========================================
    echo.
    echo GitHub Pages 地址：
    echo https://%GITHUB_USER%.github.io/feishu-douyin-plugin/index.html
    echo.
    echo 请等待 1-2 分钟让 Pages 部署完成
    echo.
) else (
    echo.
    echo ========================================
    echo   部署失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. GitHub 仓库不存在 - 请先在 GitHub 创建仓库
    echo 2. 认证失败 - 请使用 Personal Access Token
    echo.
    echo 创建仓库地址：
    echo https://github.com/new?name=feishu-douyin-plugin
    echo.
)

pause
