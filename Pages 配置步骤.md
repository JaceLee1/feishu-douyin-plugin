# GitHub Pages 配置详细步骤

## 第一步：进入设置页面

访问：https://github.com/JaceLee1/feishu-douyin-plugin/settings/pages

---

## 第二步：找到 Pages 设置

在左侧菜单中找到并点击 **Pages**（在 Code and automation 部分下）

---

## 第三步：配置 Source

在 **Build and deployment** 区域：

1. **Source** 下拉框 → 选择 `Deploy from a branch`

---

## 第四步：选择分支

在 **Branch** 设置：
- 左边下拉框 → 选择 `main`
- 右边下拉框 → 选择 `/ (root)`

如下图所示：
```
Branch: [ main ▼ ]    Folder: [ / (root) ▼ ]
```

---

## 第五步：保存

点击 **Save** 按钮

---

## 第六步：等待部署

等待 1-2 分钟，页面顶部会显示绿色提示：
```
Your site is live at https://JaceLee1.github.io/feishu-douyin-plugin/
```

---

## 第七步：验证访问

访问：https://JaceLee1.github.io/feishu-douyin-plugin/index.html

应该能看到一个蓝色标题「抖音数据提取」的页面

---

## 如果还是看不到

1. 刷新 Pages 设置页面
2. 查看 File version 是否显示最新的 commit
3. 等待 3-5 分钟再试
