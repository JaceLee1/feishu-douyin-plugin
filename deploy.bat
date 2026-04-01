@echo off
chcp 65001 >nul
echo ========================================
echo   飞书抖音插件 - GitHub 部署脚本
echo   GitHub 用户：JaceLee1
echo ========================================
echo.

:: 设置 Git 用户信息（请根据实际情况修改）
echo [1/5] 配置 Git 用户信息...
git config --global user.name "JaceLee1"
git config --global user.email "JaceLee1@users.noreply.github.com"
echo ✓ Git 用户信息已配置
echo.

:: 添加远程仓库
echo [2/5] 添加远程仓库...
git remote remove origin 2>nul
git remote add origin https://github.com/JaceLee1/feishu-douyin-plugin.git
echo ✓ 远程仓库已添加：https://github.com/JaceLee1/feishu-douyin-plugin.git
echo.

:: 切换分支到 main
echo [3/5] 切换到 main 分支...
git branch -M main
echo ✓ 分支已切换
echo.

:: 推送到 GitHub
echo [4/5] 推送到 GitHub...
echo.
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo  重要提示：
echo  1. 请先在 GitHub 创建仓库：
echo     https://github.com/new?name=feishu-douyin-plugin
echo  2. 如果推送失败，请使用 Personal Access Token
echo     https://github.com/settings/tokens
echo !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
echo.
echo 按任意键开始推送...
pause >nul
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   部署成功！
    echo ========================================
    echo.
    echo GitHub Pages 地址：
    echo https://JaceLee1.github.io/feishu-douyin-plugin/index.html
    echo.
    echo 请等待 1-2 分钟让 Pages 部署完成
    echo.
    echo 下一步：
    echo 1. 访问上面的 URL 确认页面正常
    echo 2. 前往飞书开放平台配置插件
    echo    https://open.feishu.cn/
    echo.
) else (
    echo.
    echo ========================================
    echo   部署失败
    echo ========================================
    echo.
    echo 可能的原因：
    echo 1. GitHub 仓库不存在
    echo 2. 认证失败（需要 Personal Access Token）
    echo.
    echo 解决方案：
    echo 1. 创建仓库：https://github.com/new?name=feishu-douyin-plugin
    echo 2. 获取 Token: https://github.com/settings/tokens
    echo.
)

pause
