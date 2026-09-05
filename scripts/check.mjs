import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { Window } from 'happy-dom';

const source = await fs.readFile('docs/index.html', 'utf8');
const $ = load(source);
assert.equal($('h1').length, 1, 'One primary heading');
assert.equal($('section').length, 13, 'All original sections retained');
assert.equal($('.audience-card').length, 6, 'All audience groups retained');
assert.equal($('.price-card').length, 5, 'All plans retained');
assert.equal($('#faq details').length, 8, 'All AI-view FAQ topics retained');
assert.equal($('img,svg,video,audio,canvas,iframe').length, 0, 'Visual media replaced');
assert.ok($('.media-placeholder').length >= 20, 'Media slots retain labeled placeholders');
assert.ok(!/[—–]/.test($('body').text()), 'Copy contains no em or en dashes');
assert.ok(!/not (?:just|only)|but rather|not .*? but /i.test($('body').text()), 'No formulaic negative comparisons');
assert.ok($('body').text().includes('peace of mind'), 'Required reader benefit is present');
assert.ok($('body').text().includes('twelve participant-hours a month'), 'Free plan allowance preserved');
assert.ok($('body').text().includes('1,500 pooled credits'), 'Studio credits preserved');

for (const el of $('a[href^="#"]').toArray()) {
  const id = $(el).attr('href').slice(1);
  assert.equal($(`[id="${id}"]`).length, 1, `Anchor #${id} resolves once`);
}
for (const el of $('link[rel="stylesheet"],script[src]').toArray()) {
  const file = $(el).attr('href') || $(el).attr('src');
  assert.ok(!/^https?:|^\//.test(file), `Local asset ${file}`);
  await fs.access(path.join('docs', file));
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
const window = new Window({ url: 'http://localhost/', settings: { disableCSSFileLoading: true, disableJavaScriptFileLoading: true } });
window.document.write(source);
window.document.close();
window.ResizeObserver = class { observe() {} disconnect() {} };
window.HTMLElement.prototype.scrollIntoView = function () {};
window.eval(await fs.readFile('src/site.js', 'utf8'));
const q = s => window.document.querySelector(s);
const all = s => [...window.document.querySelectorAll(s)];
assert.equal(all('#mmenu').length, 1, 'Mobile menu has a unique ID');
assert.ok(q('#mmenu a[href="https://www.co-intelligence.online/join"]'), 'Mobile menu retains Join a circle');
q('button[aria-controls="mmenu"]').click();
assert.equal(q('#mmenu').hidden, false, 'Mobile menu opens');
window.document.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
assert.equal(q('#mmenu').hidden, true, 'Escape closes mobile menu');
q('.demo-pass').click();
assert.ok(q('.demo-stick-card strong').textContent.startsWith('Amara'), 'Sunwise turn moves to next person');
all('.demo-flow button')[1].click();
q('.demo-pass').click();
assert.ok(q('.demo-stick-card strong').textContent.startsWith('Kenji'), 'Earthwise reverses the turn');
all('.demo-flow button')[2].click();
all('.product-person')[3].click();
assert.ok(q('.demo-stick-card strong').textContent.startsWith('Ravi'), 'Open round accepts any other voice');
q('.landing-mode-dock [data-set-mode="human"]').click();
assert.equal(q('.landing-mode').dataset.mode, 'human');
assert.equal(q('.milo-person').hidden, true, 'Human Mode removes Milo');
q('.landing-mode-dock [data-set-mode="milo"]').click();
assert.equal(q('.milo-person').hidden, false, 'AI view restores Milo');
q('.demo-milo').click();
assert.equal(q('.milo-person').hidden, true, 'Milo can leave independently');
q('.info-dot').click();
assert.equal(q('.info-dot').getAttribute('aria-expanded'), 'true', 'Pricing explanation opens');
q('.join-input').value = 'preview@example.com';
q('.join-form').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
assert.equal(q('.signup-note a').getAttribute('href'), 'https://www.co-intelligence.online/#join', 'Signup gives an honest handoff');
assert.equal(q('.join-input').getAttribute('name'), null, 'Email is not sent by static form');
await window.happyDOM.close();
console.log('Passed: section and plan parity, placeholders, local assets, links, copy, mobile menu, circle flows, AI controls, pricing details and signup handoff.');
