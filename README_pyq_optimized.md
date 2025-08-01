# 朋友圈图片生成器 - 优化版

## 优化功能说明

### 1. 多图片支持
- **功能**：朋友圈图片支持大于1个的图片，最多9个
- **显示方式**：每个图片都显示为正方形（不是拉伸，而是裁剪显示）
- **尺寸**：宽度为可显示区域的1/3
- **布局**：3列网格布局，自动换行

### 2. 自定义顶部图片
- **功能**：去掉顶部时间、电量、朋友圈的绘制，改为使用指定的顶部图片
- **缩放**：如果给定的顶部图片宽度与设定不一致，则先进行缩放
- **内容区域**：用设定高度减去顶部图片缩放后的高度，作为绘制朋友圈内容的图片高度
- **时间显示**：在顶部图片上绘制当前时间
- **时间设置**：
  - 字体大小：可设置时间字体大小
  - 左边距比例：距离左边的比例（0-1）
  - 右边距比例：距离右边的比例（0-1）

### 3. 本地点赞图标
- **功能**：朋友圈点赞图标替换为本地png文件
- **文件路径**：`res/pyq/like_icon.png`
- **备选方案**：如果本地图标加载失败，自动使用emoji ❤️作为备选

### 4. 评论优化
- **功能**：评论区的评论者名字后面加上冒号
- **格式**：`用户名：评论内容`
- **背景**：评论区有灰色背景，仅限于评论区

### 5. 评论区灰色背景
- **功能**：朋友圈部分的灰色底，仅限于评论区
- **颜色**：`#f8f8f8`
- **范围**：只覆盖评论区域，不影响其他内容

## 配置参数

### 新增配置项
- `content_images`: 配图文件名数组（逗号分隔，最多9张）
- `top_image_file`: 顶部图片文件名
- `time_font_size`: 时间字体大小（默认16）
- `time_left_ratio`: 时间左边距比例（默认0.1）
- `time_right_ratio`: 时间右边距比例（默认0.1）

### Excel文件格式
```
index, content
publisher_name, 飞书-Ben
publish_time, 昨天
avatar_file, 1.jpg
content, 发布内容
content_images, ["1.png","2.png","3.png"]
top_image_file, 
time_font_size, 16
time_left_ratio, 0.1
time_right_ratio, 0.1
like_count, 2
likers, ["1.jpg","2.jpg"]
comments, [{"name":"用户","content":"评论内容"}]
end,
```

## 使用说明

### 单次生成
1. 填写配置表单
2. 点击"生成朋友圈图片"按钮
3. 预览并下载生成的图片

### 批量生成
1. 准备Excel文件，按照上述格式填写
2. 上传Excel文件
3. 点击"生成朋友圈图片"按钮
4. 批量下载生成的图片

### 图片文件
- 头像和配图文件放在 `res/pyq/` 目录下
- 点赞图标文件：`res/pyq/like_icon.png`
- 支持jpg、png等常见图片格式

## 技术实现

### 图片裁剪
使用Canvas的drawImage方法，计算最小尺寸进行正方形裁剪：
```javascript
const minDimension = Math.min(contentImage.width, contentImage.height);
const sourceX = (contentImage.width - minDimension) / 2;
const sourceY = (contentImage.height - minDimension) / 2;
```

### 顶部图片时间显示
在顶部图片上绘制时间，支持自定义位置和大小：
```javascript
const timeX = canvas.width * time_left_ratio + (canvas.width * (1 - time_left_ratio - time_right_ratio)) / 2;
const timeY = topImageHeight * 0.15;
```

### 评论区背景
只对评论区域绘制灰色背景：
```javascript
ctx.fillStyle = '#f8f8f8';
ctx.fillRect(15, currentY - 5, width - 30, commentAreaHeight);
```

## 文件结构
```
├── toolsOrigin/weixin_pyq_imgCreat.html    # 优化后的主文件
├── tools/weixin_pyq_optimized.html         # 简化版优化文件
├── res/pyq/
│   ├── like_icon.png                       # 点赞图标
│   ├── pyq_example_optimized.xlsx          # 优化版示例Excel
│   └── *.jpg, *.png                        # 头像和配图文件
└── README_pyq_optimized.md                 # 本说明文件
``` 