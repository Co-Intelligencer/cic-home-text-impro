import fs from 'node:fs/promises';
import { load } from 'cheerio';

const origin = 'https://www.co-intelligence.online';
const directory = '.reference/pages';
await fs.mkdir(directory, { recursive: true });
const sitemap = await (await fetch(origin + '/sitemap.xml')).text();
const xml = load(sitemap, { xml: true });
const queue = ['/', ...xml('loc').map((_, el) => new URL(xml(el).text()).pathname).get()];
const seen = new Set();
const records = [];
const excluded = /^\/(?:dashboard|sessions|billing|settings|roles|admin|api)(?:\/|$)/;
while (queue.length) {
  const route = queue.shift().replace(/\/$/, '') || '/';
  if (seen.has(route) || excluded.test(route)) continue;
  seen.add(route);
  if (seen.size > 60) throw new Error('Review crawler scope before capturing further pages');
  const response = await fetch(origin + route, { redirect: 'follow' });
  const source = await response.text();
  const $ = load(source);
  const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '--');
  const links = [...new Set($('a[href]').map((_, el) => $(el).attr('href')).get())];
  const record = { route, slug, status: response.status, finalURL: response.url, title: $('title').text(), links };
  await fs.writeFile(`${directory}/${slug}.html`, source);
  $('script,style,nav,header,footer').remove();
  const blocks = $('h1,h2,h3,h4,p,li,summary,label,button').map((_, el) => ({ tag: el.tagName, class: $(el).attr('class') || '', text: $(el).text().trim() })).get().filter(item => item.text);
  await fs.writeFile(`${directory}/${slug}.json`, JSON.stringify({ ...record, blocks }, null, 2));
  records.push(record);
  console.log(`${response.status} ${route}: ${record.title} (${blocks.length} text blocks)`);
  if (!response.ok) continue;
  for (const href of links) {
    const url = new URL(href, origin + route);
    if (url.origin !== origin || url.search || excluded.test(url.pathname) || /\.[a-z0-9]+$/i.test(url.pathname)) continue;
    queue.push(url.pathname);
  }
}
await fs.writeFile(`${directory}/index.json`, JSON.stringify(records, null, 2));
// Capture AI content using the public audience preference form in an isolated HTTP session.
const home = load(await fs.readFile(`${directory}/home.html`, 'utf8'));
const modeForm = home('form.mnav-mode');
const preference = new FormData();
modeForm.find('input').each((_,el)=>preference.set(home(el).attr('name'),home(el).attr('value')||''));
preference.set('mode','milo');
const preferenceResponse = await fetch(origin,{method:'POST',body:preference,redirect:'manual'});
const cookie = preferenceResponse.headers.getSetCookie().map(value=>value.split(';')[0]).join('; ');
if (!cookie) throw new Error('The public AI preference could not be set; inspect it before refreshing templates.');
for (const record of records.filter(page=>page.route!=='/login')) {
  const response = await fetch(origin+record.route,{headers:{Cookie:cookie}});
  if (!response.ok) throw new Error(`AI page ${record.route}: ${response.status}`);
  await fs.writeFile(`${directory}/${record.slug}-ai.html`,await response.text());
}
console.log(`Captured ${records.length} public routes.`);
