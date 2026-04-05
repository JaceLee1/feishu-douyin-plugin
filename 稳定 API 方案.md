# 稳定 API 配置方案

## 问题原因

浏览器直接调用 TikHub API 会遇到 **CORS 跨域限制**，导致 "Failed to fetch" 错误。

---

## 解决方案

### 方案 A：使用飞书插件方式（推荐）

飞书插件在飞书环境中运行，没有 CORS 限制。

**配置步骤：**

1. **访问飞书开放平台**
   ```
   https://open.feishu.cn/console
   ```

2. **创建企业自建应用**
   - 创建应用 → 企业自建
   - 名称：抖音数据提取

3. **添加多维表格插件**
   - 应用功能 → 添加功能 → 多维表格插件
   - 前端页面 URL: `https://JaceLee1.github.io/feishu-douyin-plugin/index.html`

4. **申请权限**
   - 权限管理 → 申请权限
   - 添加：bitable:table, bitable:table:read, bitable:table:write

5. **发布并试用**
   - 版本管理与发布 → 创建版本
   - 添加自己为试用成员
   - 保存

6. **在飞书多维表格中使用**
   - 打开多维表格
   - 右侧插件 → 抖音数据提取

---

### 方案 B：使用云函数中转（稳定）

用腾讯云/阿里云云函数做 API 中转，避免 CORS 问题。

#### 腾讯云云函数配置

1. **访问云函数**
   ```
   https://cloud.tencent.com/product/scf
   ```

2. **创建函数**
   - 地区：广州
   - 运行环境：Nodejs 16
   - 函数代码：

```javascript
exports.main_handler = async (event) => {
    const https = require('https');
    const url = event.queryStringParameters.url;
    const apiKey = event.queryStringParameters.key;

    return new Promise((resolve, reject) => {
        const req = https.get(
            `https://api.tikhub.io/api/v1/short_video/?url=${encodeURIComponent(url)}`,
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json'
                }
            },
            (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        resolve({ data: JSON.parse(data) });
                    } catch (e) {
                        reject(e);
                    }
                });
            }
        );
        req.on('error', reject);
    });
};
```

3. **触发方式**
   - 启用 API 网关触发
   - 集成响应：启用

4. **获取 API 地址**
   - 触发器 → 复制服务地址
   - 格式：`https://xxx.apigw.tencentcs.com/release/xxx`

5. **修改插件代码**
   将 API 调用地址改为你的云函数地址

---

### 方案 C：使用支持 CORS 的 API

有些 API 服务支持直接浏览器调用：

1. **APISpace**
   ```
   https://www.apispace.com/
   ```
   - 搜索"抖音"
   - 选择支持 CORS 的接口
   - 免费额度：每日约 100 次

2. **RapidAPI**
   ```
   https://rapidapi.com/search/douyin
   ```
   - 部分接口支持浏览器调用
   - 免费额度：每月 50 次

---

### 方案 D：本地运行（无需部署）

直接在本地浏览器打开使用，不通过飞书：

1. **修改 index.html**
   添加 `<meta http-equiv="Access-Control-Allow-Origin" content="*">`

2. **用 Chrome 禁用 CORS 模式打开**

   Windows:
   ```
   chrome.exe --disable-web-security --user-data-dir=C:\temp
   ```

   ⚠️ 仅用于测试，不安全

---

## 推荐方案

**最快落地：方案 A（飞书插件）**
- 无需额外配置
- 飞书环境没有 CORS 限制
- TikHub API 可以正常工作

**最稳定：方案 B（云函数中转）**
- 完全控制
- 无调用限制
- 成本：几乎免费（每月几毛钱）

---

## 需要我帮你配置哪个方案？

告诉我你的选择，我继续指导你完成配置。
