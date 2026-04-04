# API 配置说明

## 问题说明

免费的抖音解析 API 非常不稳定，经常失效。以下是可用的解决方案：

---

## 方案一：注册 TikHub（推荐，有免费额度）

### 注册地址
https://tikhub.io/

### 获取 API Key
1. 注册账号
2. 进入控制台获取 API Key
3. 免费额度：每日约 100 次调用

### 修改代码
打开 `main.js`，找到 `parseWithApi` 函数，修改为：

```javascript
async function parseWithApi(videoUrl) {
  const response = await fetch(
    `https://api.tikhub.io/api/v1/short_video/?url=${encodeURIComponent(videoUrl)}`,
    {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer YOUR_API_KEY',
        'Accept': 'application/json'
      }
    }
  );

  // ...后续代码不变
}
```

将 `YOUR_API_KEY` 替换为你的实际 API Key。

---

## 方案二：自建解析服务（最稳定）

使用 GitHub 开源项目自行部署：

### 项目地址
https://github.com/Evil0ctal/Douyin_TikTok_Download_API

### 部署步骤
1. 克隆项目
2. 使用 Docker 或本地运行
3. 部署到你的服务器或 Vercel/Railway

### 优点
- 完全免费
- 无调用限制
- 最稳定

---

## 方案三：使用多个备用 API

在 `main.js` 中已配置多个备用接口：
- api.qjapi.com
- tenapi.cn
- api.vvhan.com

如果其中一个失效，代码会自动尝试下一个。

---

## 临时测试方案

如果只是测试功能，可以：

1. 手动复制抖音视频数据
2. 在插件界面添加"手动输入"功能
3. 直接填写数据到表格

---

## 更新代码后

修改 `main.js` 后，执行以下命令更新：

```bash
cd C:/Users/asus/feishu-douyin-plugin
git add main.js
git commit -m "更新 API 配置"
git push origin main
```

等待 1-2 分钟，GitHub Pages 会自动更新。
