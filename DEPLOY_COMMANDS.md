# JaceLee1 - 专属部署命令

## 你的 GitHub 仓库信息

- **用户名**: JaceLee1
- **仓库地址**: https://github.com/JaceLee1/feishu-douyin-plugin.git
- **GitHub Pages URL**: https://JaceLee1.github.io/feishu-douyin-plugin/index.html

---

## 一键部署（推荐）

双击运行项目中的 `deploy.bat` 文件

---

## 手动部署命令

复制以下命令到 Git Bash 执行：

```bash
# 进入项目目录
cd C:/Users/asus/feishu-douyin-plugin

# 添加远程仓库
git remote add origin https://github.com/JaceLee1/feishu-douyin-plugin.git

# 切换到 main 分支
git branch -M main

# 推送到 GitHub
git push -u origin main
```

---

## 部署后配置

### 1. 启用 GitHub Pages

1. 访问：https://github.com/JaceLee1/feishu-douyin-plugin/settings/pages
2. Build and deployment → Source: Deploy from a branch
3. Branch: main, Folder: / (root)
4. 点击 **Save**

### 2. 等待部署

等待 1-2 分钟后，访问：
```
https://JaceLee1.github.io/feishu-douyin-plugin/index.html
```

### 3. 飞书插件配置

访问飞书开放平台：https://open.feishu.cn/

1. 创建企业自建应用
2. 添加多维表格插件
3. **前端页面 URL** 填入：
   ```
   https://JaceLee1.github.io/feishu-douyin-plugin/index.html
   ```
4. 申请权限：bitable:table, bitable:table:read, bitable:table:write
5. 发布应用

---

## 推送认证问题

如果使用密码推送失败，请生成 Personal Access Token：

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token (classic)**
3. Note: `feishu-plugin-deploy`
4. 勾选 **repo** (全选)
5. 点击底部 **Generate token**
6. 复制 Token
7. 推送时使用 Token 代替密码

---

## 快速验证清单

- [ ] GitHub 仓库已创建
- [ ] 代码已推送（git push）
- [ ] GitHub Pages 已启用
- [ ] 页面可以访问（https://JaceLee1.github.io/feishu-douyin-plugin/index.html）
- [ ] 飞书应用已创建
- [ ] 插件已添加（前端 URL 已填写）
- [ ] 权限已申请
- [ ] 应用已发布
- [ ] 飞书多维表格中可看到插件
- [ ] 表格字段已创建（9 个）

---

**生成日期**: 2026-04-01
**GitHub 用户**: JaceLee1
