# GitHub 部署步骤指南

## 第一步：创建 GitHub 仓库

1. 访问 [GitHub](https://github.com) 并登录
2. 点击右上角 **「+」** → **「New repository」**
3. 填写仓库信息：
   - Repository name: `feishu-douyin-plugin`
   - 选择 **Private** (私有仓库) 或 **Public** (公开仓库)
4. **不要** 勾选 "Add a README file"
5. 点击 **「Create repository」**

## 第二步：推送代码到 GitHub

在终端中执行以下命令（替换 `YOUR_USERNAME` 为你的 GitHub 用户名）：

```bash
# 进入项目目录
cd C:/Users/asus/feishu-douyin-plugin

# 添加远程仓库（替换 YOUR_USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/feishu-douyin-plugin.git

# 推送代码
git branch -M main
git push -u origin main
```

**如果遇到认证问题**，使用 Personal Access Token：
1. 访问 https://github.com/settings/tokens
2. 点击 「Generate new token (classic)」
3. 勾选 `repo` 权限
4. 生成后复制 Token
5. 推送时使用 Token 代替密码

## 第三步：启用 GitHub Pages

1. 进入你的 GitHub 仓库页面
2. 点击 **「Settings」** → 左侧 **「Pages」**
3. 在 **Build and deployment** 下：
   - Source: Deploy from a branch
   - Branch: 选择 `main`，文件夹选择 `/ (root)`
4. 点击 **「Save」**

等待 1-2 分钟，Pages 将部署完成。

你的网站地址将是：
```
https://YOUR_USERNAME.github.io/feishu-douyin-plugin/index.html
```

## 第四步：验证部署

1. 打开浏览器访问上面的 URL
2. 应该能看到插件界面
3. 复制此 URL，用于飞书插件配置

## 第五步：配置飞书插件

访问 [飞书开放平台](https://open.feishu.cn/)

### 5.1 创建应用
1. 点击 **「创建应用」**
2. 选择 **「企业自建应用」**
3. 填写：
   - 应用名称：抖音数据提取
   - 应用图标：可选
4. 点击 **「创建」**

### 5.2 添加多维表格插件
1. 进入应用管理页
2. 点击左侧 **「应用功能」** → **「添加功能」**
3. 选择 **「多维表格插件」**
4. 填写：
   - 插件名称：抖音数据提取
   - 插件描述：输入抖音链接自动提取视频数据
   - **前端页面 URL**: `https://YOUR_USERNAME.github.io/feishu-douyin-plugin/index.html`
5. 点击 **「确定」**

### 5.3 配置权限
1. 点击左侧 **「权限管理」**
2. 点击 **「申请权限」**
3. 搜索并添加：
   - `bitable:table`
   - `bitable:table:read`
   - `bitable:table:write`
4. 点击 **「确定」**

### 5.4 发布应用
1. 点击左侧 **「版本管理与发布」**
2. 点击 **「创建版本」**
3. 填写版本信息，点击 **「提交审核」**
4. 审核通过后点击 **「发布」**

## 第六步：在飞书中安装使用

1. 打开飞书桌面客户端
2. 进入任意多维表格
3. 点击右上角 **「···」** → **「插件」**
4. 找到 **「抖音数据提取」**
5. 点击 **「添加」**

## 第七步：创建表格字段

在多维表格中创建以下字段：

| 字段名 | 类型 |
|-------|------|
| 视频链接 | 文本 |
| 视频文案 | 多行文本 |
| 封面图 | 附件/图片 |
| 点赞数 | 数字 |
| 评论数 | 数字 |
| 转发数 | 数字 |
| 播放数 | 数字 |
| 发布时间 | 日期 |
| 作者昵称 | 文本 |

## 完成！

现在你可以：
1. 点击右侧边栏的插件图标
2. 粘贴抖音视频链接
3. 点击「提取数据」
4. 数据将自动写入表格

---

## 常见问题

### Q: 推送时提示认证失败？
A: 使用 Personal Access Token 代替密码：
1. https://github.com/settings/tokens
2. 生成 Token (勾选 repo 权限)
3. 推送时粘贴 Token

### Q: GitHub Pages 显示 404？
A: 等待 1-2 分钟，部署需要时间

### Q: 飞书中插件无法加载？
A: 确保 URL 是 HTTPS 且可以公开访问

### Q: 需要修改代码？
A: 修改后重新 push 即可：
```bash
git add .
git commit -m "更新说明"
git push
```
