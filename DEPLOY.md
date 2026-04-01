# 快速部署指南

## 项目文件结构

```
feishu-douyin-plugin/
├── index.html          # 主页面（UI 界面）
├── main.js             # 核心逻辑代码
├── package.json        # 项目配置
├── manifest.yaml       # 飞书插件清单
└── README.md           # 详细文档
```

---

## 第一步：部署前端代码

### 方式 A：使用 Vercel 部署（推荐，免费）

1. 安装 Vercel CLI（如已有可跳过）：
```bash
npm install -g vercel
```

2. 进入项目目录并部署：
```bash
cd feishu-douyin-plugin
vercel --prod
```

3. 获取部署后的 URL，格式类似：
```
https://feishu-douyin-plugin-xxx.vercel.app
```

### 方式 B：使用 GitHub Pages

1. 将代码推送到 GitHub 仓库
2. 进入仓库 Settings → Pages
3. 选择 `main` 分支，`/ (root)` 目录
4. 获取 Pages URL

### 方式 C：本地测试

```bash
# 使用 npx serve 启动本地服务器
npx serve feishu-douyin-plugin -p 8080

# 或使用 Python
python -m http.server 8080
```

---

## 第二步：在飞书开放平台配置

1. 访问 [飞书开放平台](https://open.feishu.cn/)

2. 创建企业自建应用
   - 点击「创建应用」
   - 选择「企业自建应用」
   - 填写应用名称：抖音数据提取

3. 添加多维表格插件功能
   - 进入应用管理页面
   - 点击左侧「应用功能」→「添加功能」
   - 选择「多维表格插件」
   - 填写：
     - 插件名称：抖音数据提取
     - **前端页面 URL**：填入第一步获得的 URL
     - 例如：`https://your-domain.vercel.app/index.html`

4. 配置权限
   - 点击「权限管理」
   - 申请以下权限：
     - `bitable:table` - 多维表格
     - `bitable:table:read` - 读取表格
     - `bitable:table:write` - 写入表格

5. 发布应用
   - 点击「版本管理与发布」
   - 创建新版本
   - 提交审核（企业自建通常自动通过）
   - 点击「发布」

---

## 第三步：在多维表格中使用

1. 创建多维表格
   - 打开飞书
   - 新建一个多维表格

2. 创建必需字段（按顺序）：

| 字段名 | 字段类型 |
|-------|---------|
| 视频链接 | 文本 |
| 视频文案 | 多行文本 |
| 封面图 | 附件/图片 |
| 点赞数 | 数字 |
| 评论数 | 数字 |
| 转发数 | 数字 |
| 播放数 | 数字 |
| 发布时间 | 日期 |
| 作者昵称 | 文本 |

3. 添加插件
   - 点击表格右上角「···」
   - 选择「插件」
   - 找到「抖音数据提取」
   - 点击「添加」

4. 使用插件
   - 点击右侧边栏的插件图标
   - 粘贴抖音视频链接
   - 点击「提取数据」

---

## 验证部署

1. 检查前端页面是否可以访问
   ```
   浏览器打开：https://your-domain.vercel.app/index.html
   应该能看到插件界面
   ```

2. 检查飞书插件是否安装成功
   ```
   打开飞书多维表格 → 插件 → 应该能看到「抖音数据提取」
   ```

3. 测试数据提取
   ```
   - 复制一个抖音视频链接
   - 粘贴到插件输入框
   - 点击提取，查看是否成功写入表格
   ```

---

## 常见问题

### Q1: 前端页面 URL 应该填什么？
填部署后的 HTTPS 地址，例如：
- Vercel: `https://xxx.vercel.app/index.html`
- GitHub Pages: `https://user.github.io/repo/index.html`

### Q2: 插件无法加载？
- 检查 URL 是否正确（必须是 HTTPS）
- 检查是否有跨域问题
- 查看浏览器控制台错误信息

### Q3: 权限不足？
- 确保已申请并通过了权限审核
- 重新安装插件
- 检查用户对表格的编辑权限

### Q4: 解析失败？
- 检查链接格式是否正确
- 更换其他抖音视频测试
- API 服务可能有调用限制

---

## 推荐的 API 服务

如果默认 API 不稳定，可以注册以下服务并修改 `main.js`：

| 服务 | 地址 | 免费额度 |
|-----|------|---------|
| TikHub | https://tikhub.io/ | 每日 100 次 |
| 轻解析 | https://api.qjapi.com/ | 免费 |
| TENAPI | https://tenapi.cn/ | 免费 |

修改位置：`main.js` 第 241 行和第 313 行

---

## 技术支持

- 飞书开放平台：https://open.feishu.cn/
- 飞书插件文档：https://open.feishu.cn/document/home/add-on-introduction
- 项目 Issues: （如有 GitHub 仓库可填写）
