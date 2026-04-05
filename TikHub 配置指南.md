# TikHub API Key 配置指南

## 步骤 1: 登录 TikHub

访问：https://tikhub.io/
使用你注册的账号登录

---

## 步骤 2: 获取 API Key

### 方法一：用户中心
1. 点击右上角 **用户头像** 或 **Dashboard**
2. 进入 **API Keys** 或 **我的密钥** 页面
3. 点击 **创建 API Key** 或 **Generate API Key**
4. 复制生成的 API Key（通常以 `sk-` 开头）

### 方法二：直接访问
访问：https://tikhub.io/dashboard/api-keys
（如无法访问，请从首页进入 Dashboard）

---

## 步骤 3: 在插件中配置

1. 打开插件页面：
   ```
   https://JaceLee1.github.io/feishu-douyin-plugin/index.html
   ```

2. 找到 **API Key 配置** 输入框

3. 粘贴你的 API Key

4. 输入抖音链接，点击 **提取数据**

---

## 步骤 4: 测试

测试链接：
```
https://v.douyin.com/ieZbDhKv/
```

或去抖音复制任意一个视频链接测试。

---

## 免费额度

TikHub 新注册账号通常有：
- 每日免费调用次数：约 50-100 次
- 试用额度：$1-5 不等

查看额度：进入 Dashboard → Usage 或 Billing

---

## 常见问题

**Q: API Key 格式是什么样的？**
A: 通常类似 `sk_xxxxxxxxxxxxxxxxxxxx`

**Q: 提示余额不足？**
A: 新账号可能需要邮箱验证，或者绑定支付方式获取更多额度

**Q: 调用失败？**
A: 检查：
1. API Key 是否正确复制（无空格）
2. 账号是否已验证
3. 额度是否充足

---

## 下一步

配置好 API Key 并测试成功后，继续配置飞书插件，让数据自动写入表格。
