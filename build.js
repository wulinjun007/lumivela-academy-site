/* 光帆数艺 · 页面组装构建（node build.js） */
'use strict';
const fs = require('fs');
const path = require('path');
const root = __dirname;

const read = f => fs.readFileSync(path.join(root, 'src', f), 'utf8');
const nav = read('partials/nav.html');
const footer = read('partials/footer.html');

const PAGES = {
  index: { title: '光帆数艺 LUMIVELA ACADEMY · 数字艺术教育（设计演示站）', desc: '光帆数艺：AI设计、游戏设计、影视后期、UI设计、插画原画、空间室内四大学院 16 门主力课程，五城直营校区，项目制教学。本站为设计演示站点。' },
  courses: { title: '精品课程 · 光帆数艺 LUMIVELA ACADEMY', desc: '16 门数字艺术主力课程：AI设计、游戏设计、影视后期、UI设计、插画原画、空间室内，按方向筛选查看课程详情。' },
  course: { title: '课程详情 · 光帆数艺 LUMIVELA ACADEMY', desc: '课程特色、大纲、适应人群与就业方向。' },
  teachers: { title: '师资力量 · 光帆数艺 LUMIVELA ACADEMY', desc: '全职导师团队：总监级主讲 + 助教双辅导，行业经验 8–15 年。' },
  works: { title: '学员作品 · 光帆数艺 LUMIVELA ACADEMY', desc: '按商业规格交付的结业作品：AI设计、游戏、影视、UI、插画、空间。' },
  employment: { title: '学员就业 · 光帆数艺 LUMIVELA ACADEMY', desc: '简历打磨、模拟面试、双选会与内推的一站式就业服务体系。' },
  campus: { title: '全国校区 · 光帆数艺 LUMIVELA ACADEMY', desc: '北京、上海、广州、杭州、成都五城直营校区，支持预约参观与试听。' },
  news: { title: '学院动态 · 光帆数艺 LUMIVELA ACADEMY', desc: '学院动态、学员就业、赛事获奖与课程研发进展。' },
  about: { title: '关于我们 · 光帆数艺 LUMIVELA ACADEMY', desc: '光帆数艺的品牌故事、教学理念与发展时间线。' }
};

let n = 0;
for (const [key, meta] of Object.entries(PAGES)) {
  const body = read('pages/' + key + '.html');
  const html = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${meta.title}</title>
<meta name="description" content="${meta.desc}">
<meta name="robots" content="noindex, nofollow">
<link rel="icon" type="image/svg+xml" href="assets/favicon.svg">
<link rel="stylesheet" href="assets/css/style.css">
</head>
<body data-page="${key}">
${nav}
<main>
${body}
</main>
${footer}
<script src="assets/js/data.js"></script>
<script src="assets/js/main.js"></script>
</body>
</html>
`;
  fs.writeFileSync(path.join(root, key + '.html'), html);
  n++;
}
console.log('built ' + n + ' pages:', Object.keys(PAGES).join(', '));
