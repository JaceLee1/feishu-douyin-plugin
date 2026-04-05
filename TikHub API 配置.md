# TikHub API 正确配置

## TikHub 抖音 API 端点

根据官方文档，正确的 API 调用方式：

### API 地址

**中国大陆用户**：
```
https://api.tikhub.dev
```

**非中国大陆用户**：
```
https://api.tikhub.io
```

### 抖音数据获取端点

```
GET /api/v1/douyin/web/video_data
```

### 完整请求示例

```bash
curl -X GET "https://api.tikhub.dev/api/v1/douyin/web/video_data?url=https://v.douyin.com/ieZbDhKv/" \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### JavaScript 调用

```javascript
const response = await fetch(
  `https://api.tikhub.dev/api/v1/douyin/web/video_data?url=${encodeURIComponent(videoUrl)}`,
  {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Accept': 'application/json'
    }
  }
);

const data = await response.json();
```

### 返回格式

```json
{
  "code": 0,
  "msg": "success",
  "data": {
    "aweme_id": "视频 ID",
    "desc": "视频文案",
    "create_time": 1234567890,
    "author": {
      "nickname": "作者昵称",
      "unique_id": "作者 ID"
    },
    "statistics": {
      "digg_count": 点赞数,
      "comment_count": 评论数,
      "share_count": 分享数,
      "play_count": 播放数
    },
    "cover": {
      "url_list": ["封面图 URL"]
    }
  }
}
```

### 获取 API Key

1. 登录 https://tikhub.io/
2. 进入 Dashboard
3. API Keys → 创建 API Key
4. 复制保存（以 `sk-` 开头）

### 免费额度

- 新用户注册赠送约 50-100 次调用
- 每日签到可获得额外额度
- 付费套餐从 $9.9/月起

---

## 如果 TikHub 不可用

### 替代方案 1：自建服务

使用开源项目自建：
- https://github.com/Evil0ctal/Douyin_TikTok_Download_API
- 部署到 Railway/Vercel（免费）

### 替代方案 2：使用其他平台

- 起零数据：https://api.istero.com/
- ALAPI: https://alapi.cn/
