# 光帆数艺 LUMIVELA ACADEMY · 设计演示站

参考数字艺术教育门户（hxsd 类）功能结构 + LightVela 设计语言（逆向提取规范 `design-system-extraction-2026-10/sites/07-lightvela`）构建的纯静态教育网站。

> ⚠️ 本站为前端设计与开发演示站点：品牌、课程、师资、企业、联系方式均为虚构演示数据。

## 功能结构（对标 hxsd）

| 模块 | 实现 |
|---|---|
| 课程导航巨型下拉 | `main.js` 从 data.js 渲染 6 方向 × 16 课程 |
| 首页轮播 | 3 张幻灯，自动播放 + 圆点 + 箭头 + 触摸滑动 + blur-reveal |
| 办学数据统计 | IntersectionObserver count-up |
| 四大学院 + 课程卡 | 特色/难度星级/学制/就业薪资胶囊，详情页 `course.html?id=` |
| 免费视频教程 | Tab 分类筛选 + 播放模态（占位演示） |
| 师资 / 学员作品 / 就业服务 / 校区切换 / 新闻 / FAQ | 各独立页面，作品与课程支持分类筛选 |
| 在线答疑浮窗 | 快捷问题 + 表单（demo 模式，不伪造发送成功） |

## 技术形态

- 纯静态、零外部依赖（系统字体 PingFang SC + 内联 SVG 图标 + 渐变占位图）
- 页面由 `src/partials` + `src/pages` 经 `node build.js` 组装生成（构建产物已提交）
- 设计 Token：墨 `#2C2A2E` / 深紫 `#211A2A` / 暗橄榄 `#1C2415` / 紫浅底 `#F7F5FA` / 胶囊形状语言 / pinstripe 竖纹 / blur-reveal 入场

## 本地开发

```bash
node build.js     # 重新生成 9 个 HTML
python3 -m http.server 8088   # 本地预览
```

## 改动流程

改 `src/` → `node build.js` → git commit → `netlify deploy --prod --dir . --site <site_id>`
