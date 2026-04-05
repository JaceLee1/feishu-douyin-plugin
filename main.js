/**
 * 抖音数据提取插件 - 主逻辑
 * 基于飞书开放平台多维表格插件 SDK 开发
 */

// ==================== 配置常量 ====================
const CONFIG = {
  // 抖音解析 API 接口（使用公开可用的解析服务）
  // 注意：实际生产环境建议使用自己的后端服务调用这些 API
  DOUYIN_PARSER_API: 'https://api.tikhub.io/api/v1/short_video/',

  // 备用解析接口
  BACKUP_PARSER_APIS: [
    'https://vextractor.com/api/extract?url=',
    'https://api.shazam.com/discovery/v1/zh-CN/US/web/-/search?query='
  ],

  // 飞书多维表格字段映射
  TABLE_FIELDS: {
    videoUrl: '视频链接',
    description: '视频文案',
    coverUrl: '封面图',
    likeCount: '点赞数',
    commentCount: '评论数',
    shareCount: '转发数',
    playCount: '播放数',
    createTime: '发布时间',
    authorName: '作者昵称'
  }
};

// ==================== 全局状态 ====================
let currentExtractedData = null;
let apiKey = ''; // TikHub API Key

// ==================== DOM 元素引用 ====================
const elements = {
  videoUrl: null,
  apiKey: null,
  extractBtn: null,
  statusArea: null,
  statusIcon: null,
  statusText: null,
  resultCard: null,
  previewAuthor: null,
  previewTime: null,
  previewLike: null,
  previewComment: null,
  previewShare: null,
  previewPlay: null,
  previewCover: null
};

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
  initElements();
  initEventListeners();
  initFeishu();
});

/**
 * 初始化 DOM 元素引用
 */
function initElements() {
  elements.videoUrl = document.getElementById('videoUrl');
  elements.apiKey = document.getElementById('apiKey');
  elements.extractBtn = document.getElementById('extractBtn');
  elements.statusArea = document.getElementById('statusArea');
  elements.statusIcon = document.getElementById('statusIcon');
  elements.statusText = document.getElementById('statusText');
  elements.resultCard = document.getElementById('resultCard');
  elements.previewAuthor = document.getElementById('previewAuthor');
  elements.previewTime = document.getElementById('previewTime');
  elements.previewLike = document.getElementById('previewLike');
  elements.previewComment = document.getElementById('previewComment');
  elements.previewShare = document.getElementById('previewShare');
  elements.previewPlay = document.getElementById('previewPlay');
  elements.previewCover = document.getElementById('previewCover');

  // 加载保存的 API Key
  const savedKey = localStorage.getItem('tikhub_api_key');
  if (savedKey && elements.apiKey) {
    elements.apiKey.value = savedKey;
    apiKey = savedKey;
  }

  // 保存 API Key 变化
  if (elements.apiKey) {
    elements.apiKey.addEventListener('change', (e) => {
      apiKey = e.target.value.trim();
      localStorage.setItem('tikhub_api_key', apiKey);
    });
  }
}

/**
 * 初始化事件监听器
 */
function initEventListeners() {
  elements.extractBtn.addEventListener('click', handleExtract);
  elements.videoUrl.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      handleExtract();
    }
  });
}

/**
 * 初始化飞书 SDK
 */
async function initFeishu() {
  try {
    // 飞书多维表格插件 SDK 初始化
    // 使用 bitable.js SDK
    if (window.bitable) {
      await window.bitable.ready();
      console.log('飞书 SDK 初始化成功');
    } else if (window.feishu && window.feishu.bitable) {
      await window.feishu.bitable.ready();
      console.log('飞书 SDK 初始化成功 (feishu.bitable)');
    } else {
      console.warn('未检测到飞书 SDK，可能不在飞书环境中运行');
    }
  } catch (error) {
    console.error('飞书 SDK 初始化失败:', error);
    showStatus('error', '飞书环境初始化失败，请在飞书多维表格中打开此插件');
  }
}

// ==================== 核心业务逻辑 ====================

/**
 * 处理提取按钮点击
 */
async function handleExtract() {
  const url = elements.videoUrl.value.trim();

  // 验证链接
  if (!url) {
    showStatus('error', '请输入抖音视频链接');
    return;
  }

  if (!isDouyinUrl(url)) {
    showStatus('error', '请输入有效的抖音链接格式');
    return;
  }

  // 开始提取
  setLoading(true);
  showStatus('loading', '正在解析抖音视频数据...');
  hideResultCard();

  try {
    // 获取真实视频链接（处理短链接）
    const realUrl = await getRealDouyinUrl(url);
    console.log('真实链接:', realUrl);

    // 调用解析 API 获取数据
    const videoData = await parseDouyinVideo(realUrl);
    console.log('解析数据:', videoData);

    if (!videoData) {
      throw new Error('未能获取到视频数据，请检查链接是否正确');
    }

    // 保存当前提取的数据
    currentExtractedData = {
      ...videoData,
      videoUrl: url
    };

    // 显示预览
    showPreview(videoData);
    showStatus('success', '数据提取成功！即将写入表格...');

    // 自动写入飞书表格
    await writeToFeishuTable(currentExtractedData);

  } catch (error) {
    console.error('提取失败:', error);
    showStatus('error', error.message || '提取失败，请重试');
  } finally {
    setLoading(false);
  }
}

/**
 * 判断是否为抖音链接
 */
function isDouyinUrl(url) {
  const patterns = [
    /v\.douyin\.com/i,
    /www\.douyin\.com\/video/i,
    /douyin\.com\/video/i,
    /ies\.douyin\.com/i
  ];
  return patterns.some(pattern => pattern.test(url));
}

/**
 * 获取抖音真实链接（处理短链接重定向）
 */
async function getRealDouyinUrl(shortUrl) {
  try {
    // 使用 CORS 代理获取重定向后的真实 URL
    // 注意：在生产环境中，这应该由后端服务处理
    const response = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(shortUrl)}`, {
      method: 'HEAD',
      redirect: 'follow'
    });

    const finalUrl = response.url || shortUrl;
    console.log('重定向后的 URL:', finalUrl);
    return finalUrl;
  } catch (error) {
    console.warn('获取真实链接失败，使用原始链接:', error);
    return shortUrl;
  }
}

/**
 * 解析抖音视频数据
 * 使用多个 API 确保稳定性（已在 parseWithApi 中实现）
 */
async function parseDouyinVideo(videoUrl) {
  try {
    const data = await parseWithApi(videoUrl);
    if (data && data.author) {
      return data;
    }
  } catch (error) {
    console.warn('API 解析失败:', error);
  }

  throw new Error('所有解析方法均失败，请检查链接或稍后重试。建议注册 TikHub 获取稳定 API: https://tikhub.io/');
}

/**
 * 使用第三方 API 解析抖音视频\n * 优先使用 TikHub（需要 API Key），备用多个免费接口\n * TikHub 文档：https://docs.tikhub.io/\n */\nasync function parseWithApi(videoUrl) {\n  // 如果有 API Key，使用 TikHub\n  if (apiKey) {\n    try {\n      // 中国大陆使用 dev 域名，其他地区使用 io 域名\n      const baseUrl = apiKey.startsWith('dev_') \n        ? 'https://api.tikhub.dev' \n        : 'https://api.tikhub.io';\n      \n      const response = await fetch(\n        `${baseUrl}/api/v1/douyin/web/video_data?url=${encodeURIComponent(videoUrl)}`,\n        {\n          method: 'GET',\n          headers: {\n            'Authorization': `Bearer ${apiKey}`,\n            'Accept': 'application/json'\n          }\n        }\n      );\n\n      if (!response.ok) {\n        const errorData = await response.json().catch(() => ({}));\n        throw new Error(errorData.detail || errorData.message || `HTTP ${response.status}`);\n      }\n\n      const data = await response.json();\n      console.log('TikHub 返回数据:', data);\n\n      // TikHub 返回格式检查\n      if (data.code === 0 && data.data) {\n        const d = data.data;\n        return {\n          author: d.author?.nickname || d.author?.unique_id || '未知作者',\n          description: d.desc || d.title || '无文案',\n          cover: d.cover?.url_list?.[0] || d.cover?.uri || '',\n          likeCount: formatCount(d.statistics?.digg_count || d.digg_count || 0),\n          commentCount: formatCount(d.statistics?.comment_count || d.comment_count || 0),\n          shareCount: formatCount(d.statistics?.share_count || d.share_count || 0),\n          playCount: formatCount(d.statistics?.play_count || d.play_count || 0),\n          createTime: formatTime(d.create_time || d.createTime)\n        };\n      } else if (data.data && data.data.author) {\n        // 兼容旧格式\n        const d = data.data;\n        return {\n          author: d.author?.nickname || d.author?.unique_id || '未知作者',\n          description: d.desc || d.title || d.description || '无文案',\n          cover: d.cover?.url_list?.[0] || d.cover?.uri || '',\n          likeCount: formatCount(d.digg_count || d.statistics?.digg_count || 0),\n          commentCount: formatCount(d.comment_count || d.statistics?.comment_count || 0),\n          shareCount: formatCount(d.share_count || d.statistics?.share_count || 0),\n          playCount: formatCount(d.play_count || d.statistics?.play_count || 0),\n          createTime: formatTime(d.create_time || d.createTime)\n        };\n      } else {\n        throw new Error(data.msg || '返回数据格式异常');\n      }\n    } catch (error) {\n      console.error('TikHub API 错误:', error);\n      throw error; // 直接抛出错误，让用户知道\n    }\n  }\n\n  // 备用接口（这些接口支持 CORS）\n  const backupApis = [\n    { url: 'https://api.qjapi.com/free3/api.php?url=', name: '轻解析' },\n    { url: 'https://tenapi.cn/douyin?url=', name: 'TENAPI' }\n  ];\n\n  for (const api of backupApis) {\n    try {\n      const response = await fetch(api.url + encodeURIComponent(videoUrl));\n      if (response.ok) {\n        const data = await response.json();\n        if (data.data || (data.code === 200 && data.data !== undefined)) {\n          return adaptApiResponse(data);\n        }\n      }\n    } catch (e) {\n      console.warn(`${api.name} API 失败:`, e.message);\n    }\n  }\n\n  throw new Error('所有 API 均失败');\n}

/**
 * 适配不同 API 的返回格式
 */
function adaptApiResponse(data) {
  // TikHub 格式
  if (data.data) {
    const d = data.data;
    return {
      author: d.author?.nickname || d.author?.unique_id || '未知作者',
      description: d.desc || d.title || d.description || '无文案',
      cover: d.cover?.url_list?.[0] || d.cover?.uri || d.music?.cover_large?.url_list?.[0] || '',
      likeCount: formatCount(d.digg_count || d.statistics?.digg_count || 0),
      commentCount: formatCount(d.comment_count || d.statistics?.comment_count || 0),
      shareCount: formatCount(d.share_count || d.statistics?.share_count || 0),
      playCount: formatCount(d.play_count || d.statistics?.play_count || d.statistics?.collect_count || 0),
      createTime: formatTime(d.create_time || d.createTime)
    };
  }

  // 直接返回格式
  if (data.author || data.desc) {
    return {
      author: data.author || data.authorName || '未知作者',
      description: data.desc || data.description || data.title || '无文案',
      cover: data.cover || data.coverUrl || data.music?.cover || '',
      likeCount: formatCount(data.like || data.likeCount || data.digg_count || 0),
      commentCount: formatCount(data.comment || data.commentCount || data.comment_count || 0),
      shareCount: formatCount(data.share || data.shareCount || data.share_count || 0),
      playCount: formatCount(data.play || data.playCount || data.play_count || 0),
      createTime: formatTime(data.time || data.createTime || data.create_time)
    };
  }

  // 简单格式
  return {
    author: data.nickname || data.author || '未知作者',
    description: data.desc || data.title || '无文案',
    cover: data.cover || data.image || '',
    likeCount: formatCount(data.like || data.digg_count || 0),
    commentCount: formatCount(data.comment || data.comment_count || 0),
    shareCount: formatCount(data.share || data.share_count || 0),
    playCount: formatCount(data.play || 0),
    createTime: formatTime(data.time || data.create_time)
  };
}

/**
 * 格式化数字（添加千分位）
 */
function formatCount(num) {
  if (!num && num !== 0) return '0';
  return Number(num).toLocaleString();
}

/**
 * 格式化时间戳
 */
function formatTime(timestamp) {
  if (!timestamp) return new Date().toLocaleString('zh-CN');

  const date = new Date(Number(timestamp) * 1000);
  if (isNaN(date.getTime())) {
    return new Date().toLocaleString('zh-CN');
  }

  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// ==================== UI 交互 ====================

/**
 * 显示状态提示
 */
function showStatus(type, message) {
  const { statusArea, statusIcon, statusText } = elements;

  // 移除所有状态类
  statusArea.classList.remove('show', 'status-loading', 'status-success', 'status-error');

  // 设置图标和文本
  switch (type) {
    case 'loading':
      statusIcon.innerHTML = '<div class="spinner"></div>';
      statusArea.classList.add('status-loading');
      break;
    case 'success':
      statusIcon.textContent = '✓';
      statusArea.classList.add('status-success');
      break;
    case 'error':
      statusIcon.textContent = '✕';
      statusArea.classList.add('status-error');
      break;
  }

  statusText.textContent = message;
  statusArea.classList.add('show');

  // 成功提示 3 秒后自动隐藏
  if (type === 'success') {
    setTimeout(() => {
      statusArea.classList.remove('show');
    }, 3000);
  }
}

/**
 * 设置加载状态
 */
function setLoading(loading) {
  const btn = elements.extractBtn;
  if (loading) {
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div><span>提取中...</span>';
  } else {
    btn.disabled = false;
    btn.innerHTML = '<span>提取数据</span>';
  }
}

/**
 * 显示预览数据
 */
function showPreview(data) {
  const {
    previewAuthor,
    previewTime,
    previewLike,
    previewComment,
    previewShare,
    previewPlay,
    previewCover,
    resultCard
  } = elements;

  previewAuthor.textContent = data.author || '未知';
  previewTime.textContent = data.createTime || '-';
  previewLike.textContent = data.likeCount || '0';
  previewComment.textContent = data.commentCount || '0';
  previewShare.textContent = data.shareCount || '0';
  previewPlay.textContent = data.playCount || '0';

  if (data.cover) {
    previewCover.src = data.cover;
    previewCover.style.display = 'block';
  } else {
    previewCover.style.display = 'none';
  }

  resultCard.classList.add('show');
}

/**
 * 隐藏结果卡片
 */
function hideResultCard() {
  elements.resultCard.classList.remove('show');
}

// ==================== 飞书表格操作 ====================

/**
 * 获取飞书表格对象（兼容不同 SDK 版本）
 */
async function getFeishuTable() {
  // 尝试使用 bitable SDK（推荐方式）
  if (window.bitable && window.bitable.base) {
    return await window.bitable.base.getActiveTable();
  }

  // 尝试使用 feishu.bitable
  if (window.feishu && window.feishu.bitable) {
    return await window.feishu.bitable.getActiveTable();
  }

  // 尝试使用 window.table（某些版本）
  if (window.table) {
    return window.table;
  }

  throw new Error('无法获取表格对象，请确保在飞书多维表格环境中运行');
}

/**
 * 将数据写入飞书多维表格
 */
async function writeToFeishuTable(data) {
  try {
    showStatus('loading', '正在写入表格...');

    // 获取表格对象
    const table = await getFeishuTable();

    // 获取字段列表
    const fieldList = await table.getFieldMetaList();
    console.log('字段列表:', fieldList);

    // 构建记录数据
    const recordData = buildRecordData(data, fieldList);
    console.log('记录数据:', recordData);

    // 检查是否已存在相同链接的记录
    const existingRecord = await findExistingRecord(table, data.videoUrl, fieldList);

    if (existingRecord) {
      // 更新现有记录
      await table.updateRecord({
        recordId: existingRecord.id,
        fields: recordData
      });
      console.log('记录已更新');
      showStatus('success', '✓ 数据已更新到表格！');
    } else {
      // 新增记录
      await table.addRecord({
        fields: recordData
      });
      console.log('记录已添加');
      showStatus('success', '✓ 数据已添加到表格！');
    }

  } catch (error) {
    console.error('写入表格失败:', error);

    // 根据错误类型提供更友好的提示
    const errorMsg = error.message || String(error);
    if (errorMsg.includes('permission') || errorMsg.includes('权限')) {
      throw new Error('没有权限写入表格，请检查插件权限设置');
    } else if (errorMsg.includes('field') || errorMsg.includes('字段')) {
      throw new Error('表格字段不匹配，请确保已创建所需字段（详见使用说明）');
    } else {
      throw new Error('写入表格失败：' + errorMsg);
    }
  }
}

/**
 * 构建记录数据，匹配表格字段
 */
function buildRecordData(videoData, fieldList) {
  const record = {};

  // 创建字段名到字段 ID 的映射
  const fieldMap = {};
  fieldList.forEach(field => {
    fieldMap[field.name] = field.id;
  });

  // 视频链接
  if (fieldMap[CONFIG.TABLE_FIELDS.videoUrl]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.videoUrl]] = videoData.videoUrl;
  }

  // 视频文案
  if (fieldMap[CONFIG.TABLE_FIELDS.description]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.description]] = videoData.description;
  }

  // 封面图（飞书图片字段需要特殊格式）
  if (fieldMap[CONFIG.TABLE_FIELDS.coverUrl] && videoData.cover) {
    // 飞书图片字段格式：[{type: 'image', url: 'xxx'}] 或直接使用 URL 字符串
    // 根据字段类型决定格式
    const coverField = fieldList.find(f => f.name === CONFIG.TABLE_FIELDS.coverUrl);
    if (coverField && coverField.type === 15) {
      // 附件字段类型
      record[fieldMap[CONFIG.TABLE_FIELDS.coverUrl]] = [
        { type: 'image', url: videoData.cover }
      ];
    } else {
      // 文本字段，直接存 URL
      record[fieldMap[CONFIG.TABLE_FIELDS.coverUrl]] = videoData.cover;
    }
  }

  // 点赞数
  if (fieldMap[CONFIG.TABLE_FIELDS.likeCount]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.likeCount]] = parseCount(videoData.likeCount);
  }

  // 评论数
  if (fieldMap[CONFIG.TABLE_FIELDS.commentCount]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.commentCount]] = parseCount(videoData.commentCount);
  }

  // 转发数
  if (fieldMap[CONFIG.TABLE_FIELDS.shareCount]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.shareCount]] = parseCount(videoData.shareCount);
  }

  // 播放数
  if (fieldMap[CONFIG.TABLE_FIELDS.playCount]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.playCount]] = parseCount(videoData.playCount);
  }

  // 发布时间
  if (fieldMap[CONFIG.TABLE_FIELDS.createTime]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.createTime]] = videoData.createTime;
  }

  // 作者昵称
  if (fieldMap[CONFIG.TABLE_FIELDS.authorName]) {
    record[fieldMap[CONFIG.TABLE_FIELDS.authorName]] = videoData.author;
  }

  return record;
}

/**
 * 解析数字（移除千分位）
 */
function parseCount(str) {
  if (!str) return 0;
  return Number(String(str).replace(/,/g, '')) || 0;
}

/**
 * 查找已存在的记录（根据视频链接）
 */
async function findExistingRecord(table, videoUrl, fieldList) {
  try {
    // 查找视频链接字段的 ID
    const urlFieldName = CONFIG.TABLE_FIELDS.videoUrl;
    const urlField = fieldList.find(f => f.name === urlFieldName);

    if (!urlField) {
      console.warn('未找到视频链接字段');
      return null;
    }

    const urlFieldId = urlField.id;

    // 获取所有记录
    const result = await table.getRecordList({
      maxRecords: 500
    });

    if (!result.records || result.records.length === 0) {
      return null;
    }

    // 查找匹配的记录（比较链接是否包含视频 ID）
    const videoId = extractVideoId(videoUrl);
    for (const record of result.records) {
      const recordUrl = record.fields[urlFieldId];
      if (recordUrl) {
        const recordId = extractVideoId(String(recordUrl));
        if (videoId && recordId && videoId === recordId) {
          return record;
        }
      }
    }

    return null;
  } catch (error) {
    console.warn('查找现有记录失败:', error);
    return null;
  }
}

/**
 * 从抖音链接中提取视频 ID
 */
function extractVideoId(url) {
  if (!url) return null;

  // 匹配各种格式的视频 ID
  const patterns = [
    /video\/(\d+)/i,
    /v\.douyin\.com\/([^/]+)\//i,
    /iesdouyin\.com\/[^/]+\/(\d+)/i
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }

  // 如果都不匹配，返回 URL 本身作为标识
  return url;
}
