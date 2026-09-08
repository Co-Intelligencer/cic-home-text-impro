import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { Window } from 'happy-dom';

const base = 'https://co-intelligencer.github.io/cic-home-text-impro/';
const script = await fs.readFile('src/site.js', 'utf8');
for (const route of ['', 'human/', 'ai/']) {
const isAI = route === 'ai/';
const audience = isAI ? 'ai' : 'human';
const source = await fs.readFile(`docs/${route}index.html`, 'utf8');
const $ = load(source);
assert.equal($('html').attr('data-audience'), audience, 'Audience is rendered before JavaScript');
assert.equal($('.landing-mode').attr('data-mode'), isAI ? 'milo' : 'human');
assert.equal($('link[rel="canonical"]').attr('href'), base + audience + '/');
assert.equal($('meta[property="og:url"]').attr('content'), base + audience + '/');
assert.ok($('meta[name="description"]').attr('content').includes(isAI ? 'real time' : 'deep listening'));
assert.equal($('h1').length, 1, 'One primary heading');
assert.equal($('h1').text(), 'Help your groupfind coherence.');
assert.equal($('.hero-cta').text().trim(), 'Start your circle');
assert.equal($('section').length, 13, 'All original sections retained');
assert.equal($('.audience-card').length, isAI ? 6 : 5, 'Audience-specific use cases');
assert.equal($('.price-card').length, 5, 'All plans retained');
assert.equal($('#faq details').length, 8, 'All AI-view FAQ topics retained');
assert.equal($('img,svg,video,audio,canvas,iframe').length, 0, 'Visual media replaced');
assert.ok($('.media-placeholder').length >= 20, 'Media slots retain labeled placeholders');
assert.ok(!/[—–]/.test($('body').text()), 'Copy contains no em or en dashes');
assert.ok(!/not (?:just|only)|but rather|not .*? but /i.test($('body').text()), 'No formulaic negative comparisons');
assert.ok($('body').text().includes('peace of mind'), 'Required reader benefit is present');
assert.ok($('.price-card').first().text().includes('12 participant-hours each month'), 'Free plan allowance preserved');
if (isAI) assert.ok($('body').text().includes('1,500 pooled credits'), 'Studio credits preserved');
const prose = $('body *').contents().filter((_, el) => el.type === 'text').map((_, el) => el.data).get().join(' ');
const attributes = $('[title],[aria-label],meta[content]').map((_, el) => ['title', 'aria-label', 'content'].map(attr => $(el).attr(attr) || '').join(' ')).get().join(' ');
const allCopy = prose + ' ' + attributes;
assert.ok(!/\b(?:always|forever|never|guarantee\w*|gdpr|germany|german|european)\b|EU privacy|nothing else|everything you need|[—–]/i.test(allCopy), 'No broad promises, compliance claims or unwanted punctuation');
assert.ok(!/seven[ -]day|after (?:7|seven) days/i.test(allCopy), 'No fixed recording-retention promise');
assert.ok(prose.includes('after a period of time to reduce server costs'), 'Updated retention explanation');
assert.equal((prose.match(/\brole\b/gi) || []).length, 0, 'Role customization belongs in the setup subpage');
if (isAI) {
  assert.ok($('#method a[href$="how-it-works/#steps"]').length, 'AI setup links to the full guide');
  assert.match($('.hero-intro').text(), /real-time AI that listens and contributes to the conversation/);
  assert.match($('#credits').text(), /2 credits per listener per active minute/);
} else {
  const human = load(source);
  human('.audience-switch,.landing-mode-dock,script').remove();
  assert.ok(!/\b(?:AI|Milo|translation|credits)\b/i.test(human('body').text()), 'Human copy stays focused on human participation');
}
assert.equal($('.product-person').length, isAI ? 7 : 6, 'Initial room matches the selected version');
assert.ok($('.demo-stick-card strong').text().startsWith(isAI ? 'Milo' : 'Kenji'));
const switches = $('.landing-mode-dock a');
assert.equal(switches.length, 2);
for (const [index, target] of ['human', 'ai'].entries()) {
  const link = switches.eq(index);
  assert.equal(new URL(link.attr('href'), base + route).href, base + target + '/');
  assert.equal(link.attr('aria-current'), target === audience ? 'page' : undefined);
}
for (const el of $('.info-bubble').toArray()) {
  const label = $(el).closest('.feat').find('b').text();
  const detail = $(el).text();
  if (label === 'Unlimited session length') {
    assert.match(detail, /circles of any length/);
    assert.match(detail, /monthly participant-hours/);
    assert.ok(!/closes|30 minutes|length of each/.test(detail));
  }
  if (label === '30-minute sessions') assert.match(detail, /up to 30 minutes/);
}

for (const el of $('a[href]').toArray()) {
  const href = $(el).attr('href');
  if (/^(?:https?:|mailto:)/.test(href)) continue;
  const url = new URL(href, base + route);
  assert.ok(url.href.startsWith(base), `Local link stays within GitHub Pages project: ${href}`);
  const relative = url.pathname.slice(new URL(base).pathname.length);
  const destination = path.join('docs', relative, relative.endsWith('/') || !relative ? 'index.html' : '');
  const target = load(await fs.readFile(destination, 'utf8'));
  if (url.hash) assert.equal(target(`[id="${url.hash.slice(1)}"]`).length, 1, `Anchor ${href} resolves once`);
}
for (const el of $('link[rel="stylesheet"],script[src]').toArray()) {
  const file = $(el).attr('href') || $(el).attr('src');
  assert.ok(!/^https?:|^\//.test(file), `Local asset ${file}`);
  await fs.access(path.join('docs', route, file));
}
for (const file of await fs.readdir('docs/assets')) {
  if (!file.endsWith('.css')) continue;
  const css = await fs.readFile(`docs/assets/${file}`, 'utf8');
  assert.ok(!/image-set\(|url\(["']?(?:https?:|\/|data:image)/.test(css), `${file} has no original media or external URL`);
  for (const match of css.matchAll(/url\(["']?([^)'"\s]+)["']?\)/g)) {
    await fs.access(path.resolve('docs/assets', match[1]));
  }
}

// Exercise interaction contracts in a DOM environment without browser or network access.
const window = new Window({ url: base + route, settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true } });
window.document.write(source);
window.document.close();
window.ResizeObserver = class { observe() {} disconnect() {} };
window.HTMLElement.prototype.scrollIntoView = function () {};
window.eval(script);
const q = s => window.document.querySelector(s);
const all = s => [...window.document.querySelectorAll(s)];
assert.equal(all('#mmenu').length, 1, 'Mobile menu has a unique ID');
assert.ok(all('#mmenu a').some(link => new URL(link.href).href === base + audience + '/join/'), 'Mobile menu retains Join a circle');
q('button[aria-controls="mmenu"]').click();
assert.equal(q('#mmenu').hidden, false, 'Mobile menu opens');
window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
assert.equal(q('#mmenu').hidden, true, 'Escape closes mobile menu');
assert.equal(q('.landing-mode').dataset.mode, isAI ? 'milo' : 'human', 'Runtime preserves the shared audience');
if (isAI) {
  q('.demo-pass').click();
  assert.ok(q('.demo-stick-card strong').textContent.startsWith('Kenji'), 'AI turn passes to first human');
}
q('.demo-pass').click();
assert.ok(q('.demo-stick-card strong').textContent.startsWith('Amara'), 'Sunwise turn moves to next person');
all('.demo-flow button')[1].click();
q('.demo-pass').click();
assert.ok(q('.demo-stick-card strong').textContent.startsWith('Kenji'), 'Earthwise reverses the turn');
all('.demo-flow button')[2].click();
all('.product-person')[3].click();
assert.ok(q('.demo-stick-card strong').textContent.startsWith('Ravi'), 'Open round accepts any other voice');
if (isAI) {
  q('.demo-milo').click();
  assert.equal(q('.milo-person').hidden, true, 'Milo can leave independently');
  assert.match(q('.product-room-title').textContent, /Human Mode/);
  q('.demo-milo').click();
  assert.equal(q('.milo-person').hidden, false, 'Milo can be invited back');
} else assert.equal(q('.milo-person'), null, 'Human version has no AI seat or control');
for (const button of all('.info-dot')) {
  button.click();
  assert.equal(button.getAttribute('aria-expanded'), 'true', 'Pricing explanation opens');
  assert.equal(button.nextElementSibling.getAttribute('aria-hidden'), 'false');
  button.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  assert.equal(button.getAttribute('aria-expanded'), 'false', 'Escape closes pricing explanation');
}
q('.join-input').value = 'preview@example.com';
q('.join-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
assert.equal(q('.signup-note a').getAttribute('href'), 'https://www.co-intelligence.online/#join', 'Signup gives an honest handoff');
assert.equal(q('.join-input').getAttribute('name'), null, 'Email is not sent by static form');
await window.happyDOM.close();
console.log(`Passed /${route}: audience copy and metadata, shareable links, placeholders, local assets, circle flows, mobile menu, pricing tooltips and signup.`);
}
