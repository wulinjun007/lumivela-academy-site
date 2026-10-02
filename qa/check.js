/* QA 脚本：9 页全检（截图 + 溢出 + 控制台错误 + 交互） */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE = 'http://127.0.0.1:8123';
const OUT = path.join(__dirname, 'qa');
const PAGES = ['index', 'courses', 'course', 'teachers', 'works', 'employment', 'campus', 'news', 'about'];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch();
  const issues = [];

  const scanOverflow = async (page, label) => {
    const o = await page.evaluate(() => {
      const bad = [];
      const docW = document.documentElement.clientWidth;
      if (document.documentElement.scrollWidth > docW + 1) bad.push('DOCUMENT ' + document.documentElement.scrollWidth + '>' + docW);
      const clipped = el => {
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          const cs = getComputedStyle(a);
          if (/(hidden|clip|auto|scroll)/.test(cs.overflowX)) return true;
        }
        return false;
      };
      document.querySelectorAll('body *').forEach(el => {
        if (clipped(el)) return;
        const r = el.getBoundingClientRect();
        if (r.width > 0 && (r.right > docW + 6 || r.left < -6)) {
          const cs = getComputedStyle(el);
          if (cs.position === 'fixed') return;
          bad.push((el.tagName + '.' + String(el.className).split(' ').slice(0, 2).join('.')) + ' right=' + Math.round(r.right));
        }
      });
      return bad.slice(0, 8);
    });
    if (o.length) issues.push(`[${label}] 横向溢出: ${o.join(' | ')}`);
  };

  const checkConsole = (page, label) => {
    page.on('console', m => { if (m.type() === 'error') issues.push(`[${label}] console.error: ${m.text()}`); });
    page.on('pageerror', e => issues.push(`[${label}] pageerror: ${e.message}`));
  };

  // ===== 桌面 1440 =====
  const ctxD = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctxD.newPage();
  for (const p of PAGES) {
    checkConsole(page, p + '@1440');
    await page.goto(`${BASE}/${p}.html`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    // 触发懒渲染：滚到底再回顶
    await page.evaluate(async () => {
      await new Promise(res => { let y = 0; const t = setInterval(() => { y += 900; window.scrollTo(0, y); if (y > document.body.scrollHeight) { clearInterval(t); res(); } }, 60); });
    });
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await scanOverflow(page, p + '@1440');
    await page.screenshot({ path: path.join(OUT, p + '-desktop-full.png'), fullPage: true });
    console.log('shot', p + '@1440');
  }

  // ===== 交互测试（桌面） =====
  await page.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
  // 1. 巨型下拉
  await page.hover('#megaBtn');
  await page.waitForTimeout(400);
  const megaVisible = await page.isVisible('#megaMenu .mega__col');
  const megaLinks = await page.locator('#megaMenu a').count();
  if (!megaVisible || megaLinks < 16) issues.push(`[mega] 可见=${megaVisible} 链接数=${megaLinks}`);
  await page.screenshot({ path: path.join(OUT, 'i-mega.png') });
  // 2. 轮播
  await page.mouse.move(10, 860);
  await page.click('#heroNext');
  await page.waitForTimeout(900);
  const tx = await page.$eval('#heroTrack', el => el.style.transform);
  if (!tx.includes('-100%')) issues.push('[carousel] transform=' + tx);
  // 3. 教程 tab
  await page.click('.tab[data-tab="游戏设计"]');
  await page.waitForTimeout(400);
  const tutN = await page.locator('#tutorialGrid .tutorial-card').count();
  if (tutN !== 2) issues.push('[tutorials] 游戏设计卡数=' + tutN);
  // 4. 咨询浮窗
  await page.click('.cta-band [data-consult-open]');
  await page.waitForTimeout(400);
  const panelOpen = await page.$eval('#consultPanel', el => el.classList.contains('is-open'));
  if (!panelOpen) issues.push('[consult] 面板未打开');
  await page.fill('#consultText', '测试问题');
  await page.click('#consultForm .btn');
  await page.waitForTimeout(300);
  const done = await page.$eval('#consultPanel', el => el.classList.contains('is-done'));
  if (!done) issues.push('[consult] 提交后未进入完成态');
  await page.screenshot({ path: path.join(OUT, 'i-consult.png') });
  await page.keyboard.press('Escape');
  // 5. FAQ 手风琴
  const q2 = await page.$$('#faqList .faq-item');
  await q2[1].$eval('.faq-q', el => el.click());
  await page.waitForTimeout(500);
  const h = await q2[1].$eval('.faq-a', el => el.style.maxHeight);
  if (!h || h === '0px') issues.push('[faq] 手风琴未展开');
  // 6. 校区切换
  await page.click('[data-city="1"]');
  await page.waitForTimeout(400);
  const cityTxt = await page.$eval('#campusInfo h3', el => el.textContent);
  if (!cityTxt.includes('上海')) issues.push('[campus] 切换失败: ' + cityTxt);

  // 7. 课程详情页参数渲染
  await page.goto(`${BASE}/course.html?id=game-unreal`, { waitUntil: 'networkidle' });
  const cdTitle = await page.$eval('#cdTitle', el => el.textContent);
  if (!cdTitle.includes('虚幻引擎')) issues.push('[course?id] 渲染失败: ' + cdTitle);
  await page.screenshot({ path: path.join(OUT, 'i-course-detail.png'), fullPage: true });

  // 8. courses 页筛选
  await page.goto(`${BASE}/courses.html?cat=游戏设计`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const courseN = await page.locator('#coursesGrid .course-card').count();
  const countTxt = await page.$eval('#coursesCount', el => el.textContent);
  if (courseN !== 4) issues.push('[courses?cat] 卡数=' + courseN);
  if (!countTxt.includes('4')) issues.push('[courses?cat] 计数=' + countTxt);
  await ctxD.close();

  // ===== 平板 768 / 移动 390 =====
  for (const [name, w, h] of [['tablet', 768, 1024], ['mobile', 390, 844]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const pg = await ctx.newPage();
    checkConsole(pg, `index@${name}`);
    await pg.goto(`${BASE}/index.html`, { waitUntil: 'networkidle' });
    await pg.waitForTimeout(600);
    await pg.evaluate(async () => {
      await new Promise(res => { let y = 0; const t = setInterval(() => { y += 700; window.scrollTo(0, y); if (y > document.body.scrollHeight) { clearInterval(t); res(); } }, 50); });
    });
    await pg.waitForTimeout(400);
    await pg.evaluate(() => window.scrollTo(0, 0));
    await pg.waitForTimeout(300);
    await scanOverflow(pg, `index@${name}`);
    await pg.screenshot({ path: path.join(OUT, `index-${name}-full.png`), fullPage: true });
    // 移动端菜单
    if (name === 'mobile') {
      await pg.click('#navBurger');
      await pg.waitForTimeout(300);
      await pg.click('#megaBtn');
      await pg.waitForTimeout(300);
      const menuOpen = await pg.$eval('#navMenu', el => el.classList.contains('is-open'));
      if (!menuOpen) issues.push('[mobile menu] 未打开');
      await pg.screenshot({ path: path.join(OUT, 'index-mobile-menu.png') });
    }
    await ctx.close();
  }

  await browser.close();
  console.log('\n===== QA RESULT =====');
  if (issues.length) { issues.forEach(i => console.log('⚠️ ' + i)); process.exitCode = 2; }
  else console.log('✅ 全部通过：9页×3视口 无溢出 / 无console错误 / 8项交互 PASS');
})();
