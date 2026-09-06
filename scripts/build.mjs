import fs from 'node:fs/promises';
import { load } from 'cheerio';

const template = await fs.readFile('src/template.html', 'utf8');
const sharedCopy = JSON.parse(await fs.readFile('src/copy.json', 'utf8'));
const variants = JSON.parse(await fs.readFile('src/variants.json', 'utf8'));
const ui = JSON.parse(await fs.readFile('src/ui-copy.json', 'utf8'));
const base = 'https://co-intelligencer.github.io/cic-home-text-impro/';
const origin = 'https://www.co-intelligence.online';
function merge(baseValue, override) {
  const result = structuredClone(baseValue);
  for (const [key, value] of Object.entries(override)) {
    result[key] = value && typeof value === 'object' && !Array.isArray(value)
      ? merge(result[key] || {}, value) : structuredClone(value);
  }
  return result;
}

for (const { audience, directory } of [
  { audience: 'human', directory: '' },
  { audience: 'human', directory: 'human' },
  { audience: 'ai', directory: 'ai' }
]) {
const $ = load(template);
const copy = merge(sharedCopy, variants[audience]);
const isAI = audience === 'ai';
const prefix = directory ? '../' : '';
const audienceURL = target => `${prefix}${target}/`;
$('#mmenu').remove();
const html = (selector, value) => {
  if (!$(selector).length) throw new Error(`Missing selector: ${selector}`);
  $(selector).first().html(value);
};
const text = (selector, value) => {
  if (!$(selector).length) throw new Error(`Missing selector: ${selector}`);
  $(selector).first().text(value);
};
function label(selector, value) {
  $(selector).each((_, el) => {
    const icon = $(el).children('svg, .icon-placeholder').last().clone();
    $(el).empty().text(value).append(icon);
  });
}
function heading(selector, data) {
  text(`${selector} .lv3-eyebrow`, data.eyebrow);
  html(`${selector} h2`, data.heading);
}
function cards(selector, values) {
  $(selector).each((i, el) => {
    if (!values[i]) return;
    $(el).find('h3').text(values[i][0]);
    $(el).find('p').not('.card-eyebrow').last().text(values[i][1]);
  });
}

$('title').text(copy.title);
$('meta[name="description"], meta[property="og:description"], meta[name="twitter:description"]').attr('content', copy.description);
$('meta[property="og:title"], meta[name="twitter:title"]').attr('content', copy.title);
$('meta[property="og:url"]').attr('content', base + audience + '/');
$('meta[name="twitter:card"]').attr('content', 'summary');
$('link[rel="canonical"]').attr('href', base + audience + '/');
$('html').attr('lang', 'en').attr('data-audience', audience);
$('head').append('<link rel="stylesheet" href="assets/site.css">');
$('body').append('<script src="assets/site.js" defer></script>');
$('script').not('[src="assets/site.js"]').remove();
$('.landing-mode').attr('data-mode', isAI ? 'milo' : 'human');
$('.lv3').attr('data-variant', isAI ? 'milo' : 'human');
$('.landing-mode > div').first().text(ui.betaBanner);

html('#top h1', copy.hero.heading);
$('#top h1').before($('<p class="hero-eyebrow">').text(copy.hero.eyebrow));
$('#top h1').after($('<p class="hero-lead">').text(copy.hero.lead));
text('.hero-intro', copy.hero.intro);
label('.hero-cta', copy.hero.cta);
label('.hero-jump', copy.hero.secondary);
heading('#benefits', copy.benefits);
cards('.benefit', copy.benefits.cards);
heading('#room', copy.room);
text('.product-heading > p', copy.room.intro);
heading('#method', copy.method);
text('#method .section-heading > p:last-child', copy.method.intro);
cards('.step', copy.method.steps);
text('.practice-band-eyebrow', copy.practice.eyebrow);
text('.practice-band-line', copy.practice.heading);
text('.practice-band p:last-child', copy.practice.intro);
heading('#human-mode', copy.modes);
text('#human-mode .section-heading > p:last-child', copy.modes.intro);
text('.is-default .compare-lead', copy.modes.humanLead);
text('.is-optional .compare-lead', copy.modes.aiLead);
text('.compare-boundary', copy.modes.boundary);
heading('#for-whom', copy.audience);
text('#for-whom .section-heading > p:last-child', copy.audience.intro);
const multilingual = $('.audience-card').last().clone();
multilingual.find('.card-eyebrow').text('Multilingual groups');
multilingual.addClass('ai-detail');
$('.audience-card').last().before(multilingual);
$('.audience-card').each((i, el) => $(el).find('.audience-index').text(String(i + 1).padStart(2, '0')));
cards('.audience-card', copy.audience.cards);
text('#manifesto .section-label', copy.manifesto.eyebrow);
html('#manifesto h2', copy.manifesto.heading);
text('#manifesto .manifesto-copy > p', copy.manifesto.intro);
heading('#privacy', copy.privacy);
text('.privacy-copy > p:not(.lv3-eyebrow)', copy.privacy.intro);
label('.privacy-copy .text-link', copy.privacy.cta);
$('.trust-row > div').eq(1).after('<div class="ai-detail"><strong>Invited</strong><span>AI joins by invitation</span></div>');
heading('#pricing', copy.pricing);
text('.pricing-heading > p:not(.pricing-free-limits)', copy.pricing.intro);
heading('#faq', copy.faq);
$('.faq-list').empty();
for (const [i, [question, answer]] of copy.faq.items.entries()) {
  const detail = $('<details><summary><span></span><b></b><i aria-hidden="true">+</i></summary><p></p></details>');
  detail.find('summary > span').text(String(i + 1).padStart(2, '0'));
  detail.find('b').text(question);
  detail.find('p').text(answer);
  $('.faq-list').append(detail);
}
$('.join-slim-line').empty().text(copy.newsletter.title + ' ').append($('<span>').text(copy.newsletter.intro));
heading('#final-cta', copy.final);
text('#final-cta > p:not(.lv3-eyebrow)', copy.final.intro);
label('#final-cta > a', copy.final.cta);
label('.mnav-start', 'Start your circle');
text('.ftagline', 'Every voice. A shared way forward.');

// Every visual asset is replaced in place; typography and layout remain local.
$('img').each((i, el) => {
  const image = $(el);
  const width = image.attr('width');
  const height = image.attr('height');
  const isLogo = /logo-mark/.test(image.attr('src') || '');
  const name = isLogo ? 'Logo placeholder' : image.attr('alt') || 'Participant image placeholder';
  const replacement = $('<span class="media-placeholder" role="img"><span></span></span>');
  replacement.attr('aria-label', `${name}${name.includes('placeholder') ? '' : ' (placeholder)'}`);
  replacement.attr('style', (image.attr('style') || '') + (width ? `;width:${width}px` : '') + (height ? `;height:${height}px` : ''));
  if (image.attr('class')) replacement.addClass(image.attr('class'));
  if (isLogo) replacement.addClass('logo-placeholder');
  replacement.children().text(isLogo ? 'Logo' : image.closest('.seat, .product-avatar').length ? 'Photo' : 'Image placeholder');
  image.replaceWith(replacement);
});
$('audio, video, canvas, iframe').remove();
$('.privacy-lock').empty().addClass('media-placeholder').attr('role', 'img').attr('aria-label', 'Privacy illustration placeholder').append('<span>Icon</span>');
$('svg').each((_, el) => {
  const svg = $(el);
  const icon = $('<span class="icon-placeholder" aria-hidden="true"></span>');
  const w = svg.attr('width') || '16';
  const h = svg.attr('height') || '16';
  icon.attr('style', `--icon-w:${w}px;--icon-h:${h}px`);
  svg.replaceWith(icon);
});
$('[style]').each((_, el) => {
  let style = $(el).attr('style').replace(/url\([^)]*\)/g, 'none');
  $(el).attr('style', style);
});
$('.audience-card.has-photo').addClass('has-placeholder');
$('.audience-card.has-placeholder').prepend('<span class="card-media-label" aria-hidden="true">Image placeholder</span>');
$('.hero').addClass('has-background-placeholder');
$('.hero-stage .hs-photo').removeClass('is-on');
$('.hero-stage .hs-circle').addClass('is-on');
$('.hs-dot').first().removeClass('is-on').attr('aria-pressed', 'false');
$('.hs-dot').last().addClass('is-on').attr('aria-pressed', 'true');
$('.hs-dot').first().attr('aria-label', 'Show image placeholder');

// Use local anchors for landing-page destinations and the original app for accounts and other pages.
const routes = { '/how-it-works': '#method', '/who-its-for': '#for-whom', '/philosophy': '#manifesto', '/pricing': '#pricing' };
$('a[href]').each((_, el) => {
  const a = $(el), href = a.attr('href');
  if (href === '/') a.attr('href', '#top');
  else if (routes[href]) a.attr('href', routes[href]);
  else if (href.startsWith('/')) a.attr('href', origin + href);
});
$('.mnav-panel a[href]').each((_, el) => {
  const a = $(el), href = a.attr('href');
  const targets = { '/how-it-works#method': '#method', '/how-it-works#steps': '#method', '/philosophy#practice': '#practice', '/philosophy#why-it-works': '#benefits', '/philosophy#privacy': '#privacy', '/pricing#plans': '#pricing', '/pricing#faq': '#faq' };
  for (const [route, local] of Object.entries(targets)) if (href === origin + route) a.attr('href', local);
});
$('.practice-band').attr('id', 'practice').attr('aria-label', copy.practice.heading);
const menuDescriptions = [
  'Give every person a full turn.', 'Prepare your first circle.',
  'Stay present with the people you guide.', 'Give each person room to finish.', 'Find a shared way forward.', 'Learn with every voice in the room.',
  'Carry a shared practice into your group.', 'Build understanding through listening.', 'Know how your conversation is handled.', 'Explore research into an intelligence learning to listen.',
  'Begin free and choose a plan as your practice grows.', 'Find answers before your first circle.'
];
$('.mnav-panel .group > span:last-child').each((i, el) => $(el).text(menuDescriptions[i] || $(el).text()));
$('.mnav-panel .group > span:first-child').filter((_, el) => $(el).text() === 'Quiet questions').text('Questions and answers');
function menuItem(title, description, href) {
  const item = $('.mnav-panel .group').first().clone().addClass('ai-detail');
  item.attr('href', href);
  item.children('span').first().text(title);
  item.children('span').last().text(description);
  return item;
}
$('.mnav-panel > div').eq(0).find('.group').last().before(
  menuItem('Milo', 'Invite AI to join your conversation in real time.', '#human-mode'),
  menuItem('Live translation', 'Listen across languages.', '#human-mode')
);
$('.mnav-panel > div').eq(2).find('.group').eq(1).after(menuItem('AI in the circle', 'Your group chooses when AI joins.', '#human-mode'));
$('.mnav-panel > div').eq(3).find('.group').first().after(menuItem('Your AI credits', 'See how your credits are used.', '#credits'));

// Server actions become explicit local interactions on this static page.
$('form').not('.join-form').each((_, el) => {
  const form = $(el);
  const mode = form.find('input[name="mode"]').attr('value') || 'human';
  form.find('input').remove();
  form.find('button').attr('type', 'button').attr('data-set-mode', mode);
  form.replaceWith(form.contents());
});
$('.compare-switch').remove();
$('.compare-col.is-default').append('<button type="button" class="mode-demo-link" data-set-mode="human">Explore Human Mode <span aria-hidden="true">→</span></button>');
$('.compare-col.is-optional button').attr('data-set-mode', 'milo').text('Explore with AI invited');
$('.flinks button').attr('data-toggle-mode', '').removeAttr('data-set-mode');
$('.landing-mode-dock button').eq(0).attr('data-set-mode', 'human').removeAttr('disabled');
$('.landing-mode-dock button').eq(1).attr('data-set-mode', 'milo').removeAttr('disabled');

// Keep the original signup destination; the prototype itself stores no addresses.
$('.join-form').attr('action', origin + '/#join').attr('method', 'get');
$('.join-input').attr('aria-label', 'Email address').removeAttr('name');
$('.join-trap').remove();
$('.join-form').append('<p class="signup-note" aria-live="polite"></p>');
$('.mnav-panel').attr('aria-hidden', 'true');
$('.mnav-links a').each((i, el) => $(el).attr('data-menu', i).attr('aria-expanded', 'false'));

// Full plan terms are kept as published, including the optional AI allowances.
const planLists = $('.price-card ul');
planLists.eq(2).prepend('<li class="ai-detail">200 credits each month</li>');
planLists.eq(3).prepend('<li class="ai-detail">600 credits each month</li>');
planLists.eq(3).append('<li class="ai-detail">600 transcription minutes each month</li>');
planLists.eq(4).prepend('<li class="ai-detail">1,500 pooled credits each month</li>');
planLists.eq(4).append('<li class="ai-detail">1,200 transcription minutes each month</li>');
for (const index of [2, 3]) {
  planLists.eq(index).find('li').filter((_, el) => $(el).text().startsWith('Up to 12 participants')).append('<span class="ai-detail"> + Milo</span>');
}
$('.pricing-footnote').before('<div id="credits" class="credit-plainly ai-detail"><div><p class="lv3-eyebrow">Your AI credits</p><h3>See how your credits are used.</h3></div><div class="credit-facts"><p><strong>1 credit</strong><span>€0.10</span></p><p><strong>Milo</strong><span>1 credit per active minute</span></p><p><strong>Translation</strong><span>2 credits per listener per active minute</span></p><p><strong>Human circle</strong><span>0 AI credits; uses participant-hours</span></p></div></div>');
$('.pricing-footnote').append('<span class="ai-detail"> · purchased credits carry over · plan credits reset monthly</span>');

// Rewrite residual UI explanations without changing plan numbers or limits.
const replacements = new Map([
  ['One stick. One voice.', 'Every voice. A shared way forward.'],
  ['The whole product.', 'A place for every voice.'],
  ['Only when the circle asks for it.', 'At your group\'s invitation.'],
  ['With AI invited', 'With AI invited'],
  ['Try it — pass the stick, turn the round, or open the floor.', 'Pass the stick, choose a direction, or open the round.'],
  ["The interaction uses the engine's direction, turn-order and open-round rules. The surrounding participant video and audio are illustrative.", 'Try the speaking order here. Photos, artwork and audio are represented by placeholders.'],
  ['Live translation, chosen per listener — still', 'Live translation, chosen by each listener. Currently'],
  ['How many people can be in one circle at the same time, you included. Guests never need an account and never pay.', 'The number of people in a circle, including you. Your guests join freely by link or room code.'],
  ['How long a single circle may run before it closes. Nothing else is limited by it — you can hold as many circles as your monthly hours allow.', 'The length of each circle. Hold as many circles as your monthly participant-hours allow.'],
  ['Participant-hours are participants × hours, added up across all your circles in a month. An hour with eight people uses eight; an hour on your own uses one. We count it this way because a bigger circle genuinely costs more to run — everyone receives everyone else\'s video.', 'Participant-hours are participants × hours across your circles each month. An hour with eight people uses eight; an hour on your own uses one. Larger circles cost more to run because each person receives everyone else\'s video.'],
  ['How many people can host their own circles on this account. Participants joining a circle are never a seat.', 'The number of people who can host circles on this account. Guests join separately and freely.'],
  ['Record a circle to a video file and export the transcript as text. Recordings stay available for seven days, then delete themselves.', ui.tooltips['Recording & transcript export']],
  ['For regular human-only circles with one facilitator.', 'For your regular Human Mode circles with one facilitator.'],
  ['For regular circles with Milo and live translation.', 'For your regular circles with Milo and live translation.'],
  ['For professionals who host circles as part of their work.', 'For the circles you host as part of your professional practice.'],
  ['For practices and teams of facilitators.', 'For your practice or team of facilitators.']
]);
$('body *').contents().filter((_, el) => el.type === 'text').each((_, el) => {
  const trimmed = el.data.trim();
  if (replacements.has(trimmed)) el.data = el.data.replace(trimmed, replacements.get(trimmed));
  el.data = el.data.replace(/\s*[—–]\s*/g, ', ').replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
});
$('[title], [aria-label]').each((_, el) => {
  for (const attr of ['title', 'aria-label']) if ($(el).attr(attr)) $(el).attr(attr, $(el).attr(attr).replace(/\s*[—–]\s*/g, ', '));
});
$('.product-person').each((_, el) => $(el).attr('aria-label', `Participant ${$(el).find('.seat-name').text()}`));

// Audience-specific content is rendered into separate shareable HTML pages.
$('.popular').text('For regular circles');
$('.price-card li').filter((_, el) => $(el).text().trim() === 'Everything in Pro').text('Includes Pro features');
$('.price-card').each((i, el) => $(el).find('.plan-note').text((isAI ? ui.aiPlanNotes : ui.humanPlanNotes)[i]));
$('.price-card .feat b').filter((_, el) => $(el).text() === 'Video circles').parent().contents().filter((_, el) => el.type === 'text').remove();
$('.plan-was .sr-only').text(' regular monthly price');
$('.ai-badge').attr('title', 'AI joins when you invite it');
$('.beta-chip').attr('title', ui.betaDetail).empty().text('Beta').append($('<span class="sr-only">').text('. ' + ui.betaDetail));
$('.compare-col.is-optional li').eq(0).text('Milo listens in real time and speaks on its turn');
const beta = $('.compare-col.is-optional .beta-chip').clone();
$('.compare-col.is-optional li').eq(1).empty().text('Choose a listening language with live translation. ').append(beta);
$('.compare-col.is-optional li').eq(2).text('Everyone can see which features are active');
$('.compare-col.is-optional li').eq(3).text('Switch to Human Mode when your group chooses');
$('.product-settings > small').text('Your group can see the room settings.');
$('.trust-row > div').each((_, el) => {
  const item = $(el), oldLabel = item.find('strong').text();
  if (item.find('span').text().includes('Recording')) { item.find('strong').text('Recording'); item.find('span').text('Starts when you choose'); }
  else if (oldLabel === 'Yours') { item.find('strong').text('Visible'); item.find('span').text('Your group can see room settings'); }
  else if (oldLabel === 'European') { item.find('strong').text('Storage'); item.find('span').text('Recordings kept temporarily'); }
});
$('.demo-note').html('<strong>Demo.</strong> Try the speaking order with placeholder photos and audio.');
$('.join-form button').text('Continue to signup');
$('.join-input').attr('placeholder', 'Your email address');
$('.signup-note').html('Complete your subscription on the <a href="https://www.co-intelligence.online/#join">Co-Intelligence Circle website</a>.');

if (!isAI) {
  $('.ai-detail').remove();
  $('a[href$="/learner"]').remove();
  $('.compare-col.is-default .compare-badge').text('The conversation');
  $('.compare-col.is-default h3').text('Every person has a turn');
  $('.compare-col.is-default ul').html('<li>One visible talking stick</li><li>Clockwise, counterclockwise, or open turns</li><li>Optional turn timers</li><li>Start recording when you choose</li>');
  $('.compare-col.is-optional .compare-badge').text('Your practice');
  $('.compare-col.is-optional h3').text('Room for deep listening');
  $('.compare-col.is-optional ul').html('<li>Time to finish each thought</li><li>Space for silence between turns</li><li>A shared center for the group</li><li>Room settings everyone can see</li>');
  $('.price-card li').filter((_, el) => /AI session summaries/.test($(el).text())).remove();
  $('.price-card .feat b').filter((_, el) => $(el).text() === 'Recording & transcript export').text('Recording export');
}

$('.info-bubble').each((_, el) => {
  const row = $(el).closest('.feat');
  const rowLabel = row.find('b').text();
  const key = rowLabel.includes('participants') ? 'participants'
    : rowLabel.includes('participant-hours') ? 'participantHours' : rowLabel;
  if (!ui.tooltips[key]) throw new Error(`Tooltip copy missing for ${rowLabel}`);
  $(el).text(ui.tooltips[key]);
  row.find('.info-dot').attr('aria-label', `About ${rowLabel.toLowerCase()}`);
});

// Render the selected room state before JavaScript runs.
if (isAI) {
  const milo = $('.product-person').first().clone().addClass('milo-person');
  milo.find('.seat-name').text('Milo');
  milo.find('.media-placeholder').attr('aria-label', 'Milo image placeholder');
  milo.find('.media-placeholder > span').text('Milo');
  $('.product-room').append(milo);
}
const seats = $('.product-person');
const currentSpeaker = isAI ? seats.length - 1 : 0;
const nextSpeaker = (currentSpeaker + 1) % seats.length;
seats.each((i, el) => {
  const seat = $(el), name = seat.find('.seat-name').text();
  const angle = (-90 + i * 360 / seats.length) * Math.PI / 180;
  seat.attr('style', `left:${50 + Math.cos(angle) * 34}%;top:${50 + Math.sin(angle) * 34}%;transform:translate(-50%,-50%)`);
  seat.toggleClass('is-speaking', i === currentSpeaker).toggleClass('is-next', i === nextSpeaker);
  seat.attr('aria-pressed', String(i === currentSpeaker));
  if (i === nextSpeaker) seat.removeAttr('disabled'); else seat.attr('disabled', '');
  seat.attr('aria-label', i === currentSpeaker ? `${name} holds the stick` : i === nextSpeaker ? `Pass the stick to ${name}` : `${name}, waiting for their turn`);
});
$('.product-room').removeAttr('style');
$('.product-orbit-line').attr('style', 'width:68%;height:68%');
$('.product-room-meta > span').first().text(`Demo circle · ${seats.length} participants`);
$('.product-room-title div > span').text(`#530129 · ${isAI ? 'AI invited' : 'Human Mode'}`);
$('.demo-stick-card strong').text(`${isAI ? 'Milo' : 'Kenji'} · 02:47`);
const nextName = seats.eq(nextSpeaker).find('.seat-name').text();
$('.seat-hand').attr('aria-label', `Pass the stick to ${nextName}`).attr('title', `Pass the stick to ${nextName}`).attr('style', seats.eq(nextSpeaker).attr('style'));

$('.compare-col [data-set-mode]').each((_, el) => {
  const node = $(el);
  const link = $('<a class="mode-demo-link">');
  if (isAI && node.attr('data-set-mode') === 'human') link.attr('href', audienceURL('human') + '#room').text('Explore the human circle');
  else link.attr('href', '#room').text(isAI ? 'Try the circle with Milo' : 'Try the speaking order');
  node.replaceWith(link);
});
$('.flinks [data-toggle-mode]').replaceWith($('<a class="audience-switch">').attr('href', audienceURL(isAI ? 'human' : 'ai')).text(isAI ? 'View the human version' : 'View the AI version'));
$('.landing-mode-dock').empty().attr('aria-label', 'Choose a website version');
for (const [target, labelText] of [['human', 'AI off'], ['ai', 'AI on']]) {
  const link = $('<a class="audience-switch">').attr('href', audienceURL(target)).text(labelText);
  link.attr('aria-label', target === 'human' ? 'Human version, AI off' : 'AI version, AI on');
  if (target === audience) link.addClass('is-active').attr('aria-current', 'page');
  if (target === 'ai') link.addClass('is-ai');
  $('.landing-mode-dock').append(link);
}
$('link[rel="stylesheet"]').each((_, el) => $(el).attr('href', prefix + $(el).attr('href')));
$('script[src="assets/site.js"]').attr('src', prefix + 'assets/site.js');
await fs.mkdir(`docs/${directory}`, { recursive: true });
await fs.writeFile(`docs/${directory ? directory + '/' : ''}index.html`, $.html());
console.log(`Built ${audience} version at /${directory ? directory + '/' : ''}`);
}

await fs.mkdir('docs/assets', { recursive: true });
await fs.cp('assets', 'docs/assets', { recursive: true });
await fs.copyFile('src/site.css', 'docs/assets/site.css');
await fs.copyFile('src/site.js', 'docs/assets/site.js');
for (const name of await fs.readdir('docs/assets')) {
  if (!name.endsWith('.css')) continue;
  const file = `docs/assets/${name}`;
  const css = (await fs.readFile(file, 'utf8')).replace(/image-set\("[^"]+"\s+type\("[^"]+"\)\)/g, 'linear-gradient(#e1e7e8,#e1e7e8)');
  await fs.writeFile(file, css);
}
await fs.writeFile('docs/.nojekyll', '');
console.log('Built both audience versions for GitHub Pages.');
