import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { Window } from 'happy-dom';

const base = 'https://co-intelligencer.github.io/cic-home-text-impro/';
const routes = JSON.parse(await fs.readFile('docs/routes.json', 'utf8'));
assert.equal(routes.length,45);
const pages = new Map();
for (const route of routes) {
  const source=await fs.readFile(`docs/${route.directory ? route.directory+'/' : ''}index.html`,'utf8');
  pages.set(route.directory,{...route,source,$:load(source)});
}
const problems=[];
function check(condition, message) { if (!condition) problems.push(message); }
for (const [directory,page] of pages) {
  const {$,audience,route}=page, url=base+(directory?directory+'/':'');
  check($('h1').length===1,`${directory}: one main heading`);
  check($('title').text().length>15,`${directory}: meaningful title`);
  check(($('meta[name="description"]').attr('content')||'').length>30,`${directory}: description`);
  check($('html').attr('data-audience')===audience,`${directory}: audience`);
  check($('link[rel="canonical"]').attr('href')===page.canonical,`${directory}: canonical`);
  check($('img,svg,video,audio,canvas,iframe').length===0,`${directory}: media placeholders`);
  check($('input[type="password"]').length===0,`${directory}: credentials handled on original service`);
  check($('[name^="$ACTION"]').length===0,`${directory}: server actions removed`);
  const ids=$('[id]').map((_,e)=>$(e).attr('id')).get();
  check(new Set(ids).size===ids.length,`${directory}: unique IDs`);
  const text=$('body *').contents().filter((_,n)=>n.type==='text').map((_,n)=>n.data).get().join(' ');
  const labels=$('[title],[aria-label],meta[content]').map((_,e)=>['title','aria-label','content'].map(a=>$(e).attr(a)||'').join(' ')).get().join(' ');
  const forbidden=/[—–]|\b(?:always|forever|never|guarantee\w*|GDPR|Germany|European)\b|EU privacy|nothing else|everything you need|after (?:7|seven) days|kept (?:7|seven) days/i;
  check(!forbidden.test(text+' '+labels),`${directory}: copy contains ${String((text+' '+labels).match(forbidden)?.[0])}`);
  check(!/not (?:just|only)|but rather|not .*? but /i.test(text),`${directory}: negative comparison`);
  check(!text.includes('Hosting is free to start:'),`${directory}: redundant hosting summary removed`);
  const roleCount=(text.match(/\brole\b/gi)||[]).length;
  check(roleCount===(audience==='ai'&&route==='/how-it-works'?1:0),`${directory}: customization only in setup`);
  const switches=$('.landing-mode-dock a');
  check(switches.length===2,`${directory}: audience switch`);
  for (const [index,target] of ['human','ai'].entries()) {
    const expected=base+target+'/' +(route==='/'?'':route.slice(1)+'/');
    check(new URL(switches.eq(index).attr('href')||'.',url).href===expected,`${directory}: switch keeps subpage for ${target}`);
  }
  for (const element of $('a[href]').toArray()) {
    const link=$(element),target=new URL(link.attr('href'),url);
    if(target.origin===new URL(base).origin && target.pathname.startsWith(new URL(base).pathname)) {
      const key=target.pathname.slice(new URL(base).pathname.length).replace(/\/$/,'');
      const destination=pages.get(key);
      check(Boolean(destination),`${directory}: link to missing ${key}`);
      if(target.hash&&destination)check(destination.$(`[id="${target.hash.slice(1)}"]`).length===1,`${directory}: missing anchor ${target.href}`);
    } else if(target.origin==='https://www.co-intelligence.online') {
      check(link.is('[data-live-link]')||link.closest('.signup-note').length>0,`${directory}: content link still external ${target.href}`);
    }
  }
  for (const element of $('link[rel="stylesheet"],script[src]').toArray()) {
    const asset=$(element).attr('href')||$(element).attr('src');
    check(!/^https?:|^\//.test(asset),`${directory}: local asset ${asset}`);
    check(path.resolve('docs',directory,asset).startsWith(path.resolve('docs')+path.sep),`${directory}: asset stays inside published directory`);
    try { await fs.access(path.join('docs',directory,asset)); } catch { problems.push(`${directory}: missing asset ${asset}`); }
  }
  if(route==='/how-it-works')check($('.product-person').length===(audience==='ai'?7:6),`${directory}: initial circle state`);
}
if(problems.length) { console.error(problems.join('\n')); throw new Error(`${problems.length} site checks failed`); }

const runtime=await fs.readFile('src/site.js','utf8');
for (const page of [...pages.values()].filter(p=>p.directory.startsWith(p.audience+'/'))) {
  const window=new Window({url:base+page.directory+'/' +(page.route==='/login'?'?intent=host':''),settings:{disableCSSFileLoading:true,disableJavaScriptFileLoading:true}});
  window.document.write(page.source);window.document.close();
  window.ResizeObserver=class{observe(){}disconnect(){}};
  window.HTMLElement.prototype.scrollIntoView=function(){};
  window.eval(runtime);
  const q=s=>window.document.querySelector(s);
  const all=s=>[...window.document.querySelectorAll(s)];
  q('button[aria-controls="mmenu"]').click();assert.equal(q('#mmenu').hidden,false,`${page.directory}: mobile navigation`);
  window.document.dispatchEvent(new window.KeyboardEvent('keydown',{key:'Escape',bubbles:true}));assert.equal(q('#mmenu').hidden,true);
  if(page.route==='/pricing') {
    q('[data-billing="annual"]').click();
    for(const [plan,price] of [['starter','10.00'],['basic','22.50'],['pro','40.83']])assert.ok(q(`[data-plan="${plan}"] .plan-price`).textContent.startsWith('€'+price));
    assert.equal(q('[data-plan="basic"] .plan-offer').textContent,'Introductory rate');
    q('[data-billing="monthly"]').click();assert.ok(q('[data-plan="basic"] .plan-price').textContent.startsWith('€29'));
    assert.ok(!/[—–]/.test(q('[data-plan="basic"] .plan-price').textContent));
    for(const button of all('.info-dot')) { button.click();assert.equal(button.getAttribute('aria-expanded'),'true'); }
  }
  if(page.route==='/how-it-works') { q('.demo-pass').click();assert.ok(q('.demo-stick-card strong').textContent.startsWith(page.audience==='ai'?'Kenji':'Amara')); }
  if(page.route==='/join') {
    q('#code').value='530 129';q('.room-code-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(q('.room-code-note a').href,'https://www.co-intelligence.online/join');assert.equal(q('#code').getAttribute('name'),null);
  }
  if(page.route==='/learner') {
    q('.join-input').value='review@example.com';q('.join-form').dispatchEvent(new window.Event('submit',{bubbles:true,cancelable:true}));
    assert.equal(q('.signup-note a').href,'https://www.co-intelligence.online/learner');assert.equal(q('.join-input').getAttribute('name'),null);
  }
  if(page.route==='/login')assert.equal(q('.auth-card a[data-live-link]').href,'https://www.co-intelligence.online/login?intent=host');
  await window.happyDOM.close();
}
console.log('Passed: all 45 pages, internal links and anchors, audience switching, metadata, placeholders, copy rules, and subpage interactions.');
