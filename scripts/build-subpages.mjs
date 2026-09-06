import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';
import { pageCopy } from '../src/pages/copy.mjs';

const base = 'https://co-intelligencer.github.io/cic-home-text-impro/';
const origin = 'https://www.co-intelligence.online';
const records = JSON.parse(await fs.readFile('src/pages/routes.json', 'utf8'));
const knownRoutes = new Set(['/', ...records.map(page => page.route)]);
const ui = JSON.parse(await fs.readFile('src/ui-copy.json', 'utf8'));
const homes = Object.fromEntries(await Promise.all(['human', 'ai'].map(async audience => [audience, load(await fs.readFile(`docs/${audience}/index.html`, 'utf8'))])));
const navTemplate = load(await fs.readFile('src/pages/templates/ai/how-it-works.html', 'utf8'))('nav.mnav').prop('outerHTML');
const relative = (directory, target) => (path.posix.relative(directory || '.', target || '.') || '.') + '/';

function replaceText($, from, to) {
  $('body *').contents().filter((_, node) => node.type === 'text' && node.data.trim() === from).each((_, node) => { node.data = node.data.replace(from, to); });
}
function media($) {
  $('img').each((_, el) => {
    const node = $(el), label = /logo/i.test(node.attr('src') || '') ? 'Logo placeholder' : 'Image placeholder';
    const replacement = $('<span class="media-placeholder" role="img"><span></span></span>');
    replacement.attr('aria-label', label).children().text(label);
    if (node.attr('class')) replacement.addClass(node.attr('class'));
    if (/Logo/.test(label)) replacement.addClass('logo-placeholder');
    replacement.attr('style', (node.attr('style') || '') + (node.attr('width') ? `;width:${node.attr('width')}px` : '') + (node.attr('height') ? `;height:${node.attr('height')}px` : ''));
    node.replaceWith(replacement);
  });
  $('svg').each((_, el) => $(el).replaceWith('<span class="icon-placeholder" aria-hidden="true"></span>'));
  $('audio,video,canvas,iframe').each((_, el) => $(el).replaceWith('<span class="media-placeholder"><span>Media placeholder</span></span>'));
  $('.milo-visual,.translation-visual,.hearth').empty().addClass('media-placeholder').append('<span>Illustration placeholder</span>');
  $('[style]').each((_, el) => {
    const node = $(el), style = node.attr('style');
    if (/url\(/.test(style)) { node.attr('style', style.replace(/url\([^)]*\)/g, 'none')); node.addClass('media-placeholder').append('<span class="card-media-label">Image placeholder</span>'); }
  });
}
function navigation($, audience, directory, route) {
  const siteURL = (target, targetAudience = audience) => relative(directory, `${targetAudience}${target === '/' ? '' : target}`);
  const routeURL = target => { const [pathname, hash] = target.split('#'); return siteURL(pathname) + (hash ? '#' + hash : ''); };
  if ($('nav.mnav').length) $('nav.mnav').replaceWith(navTemplate);
  else $('.auth').before(navTemplate);
  $('#mmenu,.mnav-mode').remove();
  const menu = {
    'The method': ['The method', 'Give each person time to speak and listen.', '/how-it-works#method'],
    Milo: ['Milo', 'Invite AI into the conversation in real time.', '/how-it-works#milo', true],
    'Live translation': ['Live translation', 'Choose a listening language.', '/how-it-works#translation', true],
    'The first minute': ['Prepare a circle', 'Set up a room and invite your group.', '/how-it-works#steps'],
    'Facilitators & coaches': ['Facilitators & coaches', 'Stay present with the groups you guide.', '/for/facilitators'],
    'Therapists & group practices': ['Therapists & group practices', 'Review the tools for your practice.', '/for/therapists'],
    'Teams & leaders': ['Teams & leaders', 'Build understanding through shared turns.', '/who-its-for#teams'],
    'Education & community': ['Education & community', 'Give each voice room to contribute.', '/who-its-for#education'],
    'The practice': ['The practice', 'Bring a listening practice to your group.', '/philosophy#practice'],
    'Why it works': ['What listening can make possible', 'Explore shared understanding and coherence.', '/philosophy#why-it-works'],
    'AI in the circle': ['AI in the circle', 'Your group chooses when AI participates.', '/philosophy#ai', true],
    Privacy: ['Privacy', 'Know how your conversation is handled.', '/privacy'],
    'The Learner': [audience === 'ai' ? 'The Learner' : 'Listening research', 'Explore a private research cohort.', '/learner'],
    Plans: ['Plans', 'Compare plans for your circles.', '/pricing#plans'],
    'Credits, plainly': ['AI credits', 'Understand active minutes and credit use.', '/pricing#credits', true],
    'Quiet questions': ['Questions and answers', audience === 'ai' ? 'Understand plans, guests, and credits.' : 'Understand plans and guests.', '/pricing#faq']
  };
  $('.mnav-panel .group').each((_, el) => {
    const node = $(el), entry = menu[node.children('span').first().text().trim()];
    if (!entry) throw new Error(`Unreviewed navigation label: ${node.text()}`);
    if (entry[3] && audience === 'human') return node.remove();
    node.children('span').first().text(entry[0]); node.children('span').last().text(entry[1]); node.attr('href', entry[2]);
  });
  const featureLink = $('.mnav-panel .group').first().clone();
  featureLink.children('span').first().text('All features'); featureLink.children('span').last().text('See available tools and what is in development.'); featureLink.attr('href', '/features');
  $('.mnav-panel > div').first().find('.group').last().after(featureLink);
  $('.mnav-links a').each((i, el) => $(el).attr('data-menu', i).attr('aria-expanded', 'false'));
  $('.mnav-start').text('Start your circle');
  $('.mnav-panel').attr('aria-hidden', 'true');
  $('.flinks form,.flinks [data-toggle-mode],.flinks .audience-switch').remove();
  $('.flinks a[href$="/learner"]').text(audience === 'ai' ? 'The Learner' : 'Listening research');
  if (!$('.flinks a[href$="/learner"]').length) $('.flinks').prepend($('<a>').attr('href', '/learner').text(audience === 'ai' ? 'The Learner' : 'Listening research'));
  $('.flinks').append($('<a class="audience-switch">').attr('href', siteURL(route, audience === 'ai' ? 'human' : 'ai')).text(audience === 'ai' ? 'View the human version' : 'View the AI version'));
  $('.landing-mode-dock').remove();
  const dock = $('<nav class="landing-mode-dock" aria-label="Choose a website version"></nav>');
  for (const target of ['human', 'ai']) {
    const link = $('<a class="audience-switch">').attr('href', siteURL(route, target)).text(target === 'ai' ? 'AI on' : 'AI off');
    link.attr('aria-label', target === 'ai' ? 'AI version, AI on' : 'Human version, AI off');
    if (target === audience) link.addClass('is-active').attr('aria-current', 'page');
    if (target === 'ai') link.addClass('is-ai');
    dock.append(link);
  }
  $('body').append(dock);
  $('a[href]').each((_, el) => {
    const node = $(el), href = node.attr('href');
    if (node.hasClass('audience-switch') || node.is('[data-live-link]')) return;
    if (href.startsWith('/') || href.startsWith(origin)) {
      const url = new URL(href, origin);
      if (url.origin !== origin) return;
      const target = url.pathname.replace(/\/$/, '') || '/';
      if (knownRoutes.has(target)) node.attr('href', siteURL(target) + url.search + url.hash);
    }
  });
  // Homepage navigation opens the full subpages; in-page demonstration links remain local.
  $('.ftagline').text('Every voice. A shared way forward.');
  $('a').filter((_, el) => /^Start (?:a|your) circle/.test($(el).text().trim())).each((_, el) => $(el).text('Start your circle'));
  if (!$('#main').length) $('main').attr('id', 'main');
  return {siteURL, routeURL};
}
function preparePricing($, audience) {
  const home = homes[audience];
  $('.price-card').each((index, el) => {
    const node = $(el), source = home('.price-card').eq(index);
    node.find('ul').replaceWith(source.find('ul').clone());
    node.find('.plan-desc').text(ui[audience === 'ai' ? 'aiPlanNotes' : 'humanPlanNotes'][index]);
    if (index === 0) node.find('.plan-note').text('Free video circles · 7-day trial on your first paid plan');
    if (index > 0 && index < 4) {
      node.attr('data-plan', ['free','starter','basic','pro','studio'][index]);
      node.find('.plan-price').attr('data-monthly-html', node.find('.plan-price').html());
      node.find('.plan-note').attr('data-billing-note', '');
      node.find('.plan-alt').text('Start a paid plan now');
    }
    node.find('button').not('.info-dot,.rail-handle').each((_, button) => {
      const control = $(button), link = $('<a>').attr('href','/login?intent=host').attr('class',control.attr('class')).html(control.html());
      control.replaceWith(link);
    });
  });
  $('.popular').text('For regular circles');
  $('[role="radio"]').each((index, el) => $(el).attr('data-billing', index ? 'annual' : 'monthly'));
  $('#examples button').each((_, el) => {
    const button = $(el); button.replaceWith($('<a data-live-link>').attr('href',origin+'/pricing#examples').attr('class',button.attr('class')).html(button.html()));
  });
}

const generated = [];
for (const family of ['', 'human', 'ai']) {
  const audience = family === 'ai' ? 'ai' : 'human';
  for (const record of [{route:'/',slug:'home'}, ...records]) {
    const routePart = record.route === '/' ? '' : record.route.slice(1);
    const directory = [family, routePart].filter(Boolean).join('/');
    const file = `docs/${directory ? directory + '/' : ''}index.html`;
    const isHome = record.slug === 'home';
    const $ = load(isHome ? homes[audience].html() : await fs.readFile(`src/pages/templates/${audience}/${record.slug}.html`, 'utf8'));
    if (isHome) $('link[rel="stylesheet"],script[src]').each((_,el)=>{
      const node=$(el),attribute=el.tagName==='link'?'href':'src';
      const asset=node.attr(attribute).split('assets/')[1];
      if (asset) node.attr(attribute,path.posix.relative(directory || '.','assets/'+asset));
    });
    if (!isHome) {
      const copy = pageCopy[record.slug];
      for (const [key, value] of Object.entries({...copy.shared,...copy[audience]})) {
        const node = $(`[data-copy="${key}"]`);
        if (node.length !== 1) throw new Error(`Copy key ${record.slug}/${audience}/${key} matches ${node.length}`);
        if (value === '') node.remove(); else node.html(value);
      }
      const title = copy.title[audience] + ' | Co-Intelligence Circle';
      $('title').text(title);
      $('meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]').attr('content',copy.description[audience]);
      $('meta[property="og:title"],meta[name="twitter:title"]').attr('content',title);
      $('link[rel="stylesheet"]').each((_,el)=>$(el).attr('href',path.posix.relative(directory || '.',$(el).attr('href'))));
      $('head').append($('<link rel="stylesheet">').attr('href',path.posix.relative(directory || '.','assets/site.css')));
      $('body').append($('<script defer>').attr('src',path.posix.relative(directory || '.','assets/site.js')));
      if (record.slug === 'pricing') preparePricing($,audience);
      if (record.slug === 'how-it-works') {
        $('.product-window').replaceWith(homes[audience]('.product-window').clone());
        const descriptions = [
          ['At the center','The stick rests between turns. Pick it up to speak, or choose an open round for free conversation.'],
          ['With the speaker','The stick shows who has the speaking turn. Give that person time to finish.'],
          ['Ready to pass','The next eligible seat shows where the stick can go. Pass it when your turn is complete.']
        ];
        $('.engine-state').each((index,el)=>{const card=$(el);card.find('code').remove();card.find('strong').text(descriptions[index][0]);card.find('figcaption > span').text(descriptions[index][1]);});
      }
      if (record.slug === 'features') {
        $('#roles').remove();
        if (audience === 'human') $('#transcript-export').remove();
        $('#parallel-rooms .text-sage').text('Contact us for plan availability');
        $('#milo .text-sage,#translation .text-sage').text('Eligible plans, billed in credits');
        $('#transcription .text-sage').text('Eligible plans; see pricing');
      }
      if (record.slug === 'for--facilitators') $('.faq-list details').eq(2).find('summary b').text(audience === 'ai' ? 'How can my group see when AI is active?' : 'How can my group see when recording is active?');
      if (record.slug === 'for--therapists') $('.faq-list details').first().find('summary b').text(audience === 'ai' ? 'How is transcription controlled?' : 'Which tools are included in Starter?');
      if (record.slug === 'privacy') $('.prose').append('<p>The complete privacy policy is being prepared. Contact Poetic Design with questions.</p>');
      if (record.slug === 'join') {
        const form=$('.join-code form'); form.attr('class','room-code-form').removeAttr('enctype').attr('action',origin+'/join').attr('method','get');
        form.find('input[type="hidden"]').remove(); form.find('#code').removeAttr('name').attr('pattern','[0-9 ]{6,9}');
        form.find('button').text('Continue to join');
        form.append('<p class="room-code-note" aria-live="polite">Join the live circle on Co-Intelligence Circle.</p>');
      }
      if (record.slug === 'learner') {
        const entries=['Example: a session summary approved by the group.','Example: a recurring theme named by the circle.','Example: a quote flagged by a steward for removal and review.'];
        $('.ledger').attr('aria-label','Examples of research ledger entries');
        $('.ledger-text').each((index,el)=>$(el).text(entries[index]));
        $('.ledger-reversed .ledger-state').text('Review requested');
        const form=$('.join-form'); form.attr('action',origin+'/learner').attr('method','get').attr('data-signup-destination',origin+'/learner');
        $('.join-trap').remove(); $('.join-input').removeAttr('name').attr('aria-label','Your email address');
        form.find('button').text('Continue to cohort signup'); form.append('<p class="signup-note" aria-live="polite">Register your interest on the <a data-live-link href="https://www.co-intelligence.online/learner">Co-Intelligence Circle website</a>.</p>');
      }
      if (record.slug === 'login') {
        $('.auth').wrap('<div class="landing-mode"></div>');
        $('.auth-card').wrap('<main id="main"></main>');
        $('.auth-card h1').html('Come into the <em>circle</em>.');
        $('.auth-card .sub').text('Sign in or create an account to host. Guests join through their invitation.');
        $('.auth-card .field,.auth-card button,.auth-or,.auth-create-note').remove();
        $('.auth-card .sub').after('<p class="auth-handoff">Continue to Co-Intelligence Circle to use your password, an email code, or Google.</p><a class="btn btn-primary" data-live-link href="https://www.co-intelligence.online/login">Continue to sign in</a><p class="auth-create-note">You can also create a free hosting account there.</p>');
        $('.auth-foot').html('Read the <a href="/terms">Terms</a> and <a href="/privacy">Privacy</a> details.');
      }
    }
    $('html').attr('lang','en').attr('data-audience',audience).attr('data-route',record.route);
    $('.landing-mode').attr('data-mode',audience === 'ai' ? 'milo' : 'human');
    $('.lv3').attr('data-variant',audience === 'ai' ? 'milo' : 'human');
    const canonical=base+audience+'/'+(routePart?routePart+'/':'');
    if (!$('link[rel="canonical"]').length) $('head').append('<link rel="canonical">');
    $('link[rel="canonical"]').attr('href',canonical); $('meta[property="og:url"]').attr('content',canonical);
    $('meta[name="twitter:card"]').attr('content','summary');
    const banner=$('.landing-mode > div').first(); if (banner.text().startsWith('This is an early public beta')) banner.text(ui.betaBanner);
    navigation($,audience,directory,record.route);
    media($);
    $('.beta-chip').attr('title',ui.betaDetail).empty().text('Beta').append($('<span class="sr-only">').text('. '+ui.betaDetail));
    $('.pricing-free-limits').remove();
    $('.reveal').addClass('in');
    if (isHome && audience === 'ai') $('#method .step').first().find('p').append(' <a href="'+relative(directory,'ai/how-it-works')+'#steps">Prepare your circle</a>.');
    if (record.slug === 'who-its-for') {
      const details = {
        'Guests always free': ['Guests join free','Share a link or six-digit room code.'],
        "A turn that can't be taken": ['A visible speaking turn','Use the optional timer to guide the pace of each turn.'],
        'Milo with a role you write': ['AI in the live conversation','Invite Milo to listen and contribute in real time.'],
        'Milo as timekeeper or mirror': ['Milo contributes on its turn','Hear its perspective alongside the people in your group.'],
        'Transcripts & summaries': audience === 'ai' ? ['Transcripts & summaries','Revisit a session when these features are enabled on your plan.'] : ['Session recordings','Save a circle when recording is included in your plan.'],
        'Scheduling': ['Scheduling','Find a time together and share your invitation.'],
        'Open floor when you need it': ['Open the round','Choose free conversation for a brainstorm, then return to speaking turns.'],
        'Video circles cost nothing': ['Start with free video circles','Your plan sets the participant and time allowances.'],
        'Live translation per listener': ['Live translation per listener','Each person chooses a language, with original voices softly present underneath.'],
        'Low barrier': ['Guests join in a browser','Share the six-digit code with your group.'],
        'Order the group chooses': ['Choose a speaking order','Use clockwise, counterclockwise, or open turns.'],
        'Built under EU privacy law': ['Visible room settings','Your group can see the speaking order, timer, and recording status.']
      };
      $('main b').each((_,el)=>{const node=$(el), entry=details[node.text()];if(entry)node.parent().html(`<b>${entry[0]}</b> ${entry[1]}`);});
    }
    const replacements = [
      ['One stick. One voice.','Every voice. A shared way forward.'],
      ['Guests always free','Guests join free'],["A turn that can't be taken",'A visible speaking turn'],
      ['Milo with a role you write','AI in the live conversation'],['Milo as timekeeper or mirror','Milo contributes on its turn'],
      ['Video circles cost nothing','Start with free video circles'],['for every guest you invite — forever','for guests joining your circle'],
      ['100%','Time'],['of the round gets equal airtime','for each voice to contribute'],
      ['Video circles, whoever you invite','Video circles within your plan allowance'],
      ['Built under EU privacy law','Visible room settings'],['GDPR at heart','Settings your group can see'],
      ['Low barrier','Guests join in a browser'],
      ['Do my participants pay anything?','How do guests join?'],
      ['Milo sits silent. It never takes a turn.','An observing research seat.'],
      ['Present · never speaking','Present · observing'],
      ['What if a client has never sat in a circle before?','How do I introduce the circle to a new participant?'],
      ['Can I be certain nothing is transcribed?',audience === 'ai' ? 'How is transcription controlled?' : 'Which tools are included in Starter?'],
      ['A quote attributed too narrowly — removed by the steward, and unlearned','Example: a quote flagged by a steward for removal and review'],
      ['Read our philosophy','Explore the circle practice']
    ];
    for (const [from,to] of replacements) replaceText($,from,to);
    $('body *').contents().filter((_,node)=>node.type==='text').each((_,node)=>{node.data=node.data.replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/1103\s*[—–]\s*11871/g,'1103 - 11871').replace(/\s*[—–]\s*/g,', ').replace(/(?<!active )minutes of Milo/g,'active minutes of Milo');});
    $('[title],[aria-label],[data-monthly-html]').each((_,el)=>{for(const attribute of ['title','aria-label','data-monthly-html'])if($(el).attr(attribute))$(el).attr(attribute,$(el).attr(attribute).replace(/\s*[—–]\s*/g,', '));});
    $('form input[type="hidden"][name^="$ACTION"]').remove();
    $('form').not('.join-form,.room-code-form').each((_,el)=>$(el).remove());
    $('[data-copy]').removeAttr('data-copy');
    await fs.mkdir(path.dirname(file),{recursive:true}); await fs.writeFile(file,$.html());
    generated.push({file,directory,audience,route:record.route,canonical});
  }
}
await fs.writeFile('docs/routes.json',JSON.stringify(generated.map(({directory,audience,route,canonical})=>({directory,audience,route,canonical})),null,2));
await fs.writeFile('docs/sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+generated.filter(p=>p.directory.startsWith(p.audience+'/')||p.directory===p.audience).map(p=>`<url><loc>${p.canonical}</loc></url>`).join('')+'</urlset>');
await fs.writeFile('docs/404.html','<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Page not found | Co-Intelligence Circle</title><body><h1>Page not found</h1><p>Choose a version to continue.</p><a href="'+base+'human/">Human version</a> · <a href="'+base+'ai/">AI version</a></body></html>');
console.log(`Built ${generated.length} pages: 15 public routes, each with human and AI versions plus default human links.`);
