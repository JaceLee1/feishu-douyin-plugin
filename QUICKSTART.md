# 飞书抖音插件 - 快速开始

## 一行命令部署

```bash
# 1. 在 GitHub 创建仓库后，执行以下命令（替换 USERNAME）
git remote add origin https://github.com/YOUR_USERNAME/feishu-douyin-plugin.git && git branch -M main && git push -u origin main
```

## 或者双击运行

```
deploy.bat
```

## 部署后访问

```
https://YOUR_USERNAME.github.io/feishu-douyin-plugin/index.html
```

---

## 飞书配置（5 分钟完成）

1. **创建应用**: https://open.feishu.cn/ → 企业自建 → 创建应用
2. **添加插件**: 应用功能 → 添加功能 → 多维表格插件
3. **填写 URL**: `https://YOUR_USERNAME.github.io/feishu-douyin-plugin/index.html`
4. **申请权限**: bitable:table, bitable:table:read, bitable:table:write
5. **发布应用**: 版本管理与发布 → 创建版本 → 发布

## 表格字段（9 个）

| 字段名 | 类型 |
|-------|------|
| 视频链接 | 文本 |
| 视频文案 | 多行文本 |
| 封面图 | 附件 |
| 点赞数 | 数字 |
| 评论数 | 数字 |
| 转发数 | 数字 |
| 播放数 | 数字 |
| 发布时间 | 日期 |
| 作者昵称 | 文本 |

---

详细教程请查看：
- `TUTORIAL.md` - 图文教程
- `GITHUB_DEPLOY.md` - GitHub 部署指南
- `README.md` - 项目说明
- `DEPLOY.md` - 部署步骤
