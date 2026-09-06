import fs from 'node:fs/promises';
import path from 'node:path';
import { load } from 'cheerio';

const origin = 'https://www.co-intelligence.online';
const records = JSON.parse(await fs.readFile('.reference/pages/index.json', 'utf8'));
const styles = new Map();
await fs.mkdir('src/pages/templates', { recursive: true });
for (const record of records.filter(page => page.route !== '/')) {
  for (const audience of ['human', 'ai']) {
    const suffix = audience === 'ai' && record.route !== '/login' ? '-ai' : '';
    const $ = load(await fs.readFile(`.reference/pages/${record.slug}${suffix}.html`, 'utf8'));
    for (const el of $('link[rel="stylesheet"]').toArray()) {
      const link = $(el), url = new URL(link.attr('href'), origin);
      if (!styles.has(url.pathname)) {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Stylesheet ${response.status}: ${url}`);
        let css = await response.text();
        const sources = [...new Set([...css.matchAll(/url\(([^)]+)\)/g)].map(m => m[1].replace(/^['"]|['"]$/g, '')))];
        for (const source of sources) {
          if (/\.woff2?(?:\?|$)/.test(source)) {
            const fontURL = new URL(source, url), basename = path.basename(fontURL.pathname);
            try { await fs.access(`assets/fonts/${basename}`); } catch {
              const font = await fetch(fontURL);
              if (!font.ok) throw new Error(`Font ${font.status}`);
              await fs.writeFile(`assets/fonts/${basename}`, Buffer.from(await font.arrayBuffer()));
            }
            css = css.split(source).join(`fonts/${basename}`);
          } else if (!source.startsWith('#')) css = css.split(`url(${source})`).join('none');
        }
        css = css.replace(/image-set\("[^"]+"\s+type\("[^"]+"\)\)/g, 'linear-gradient(#e1e7e8,#e1e7e8)');
        const target = `assets/subpage-${styles.size + 1}.css`;
        styles.set(url.pathname, target);
        await fs.writeFile(target, css);
      }
      link.attr('href', styles.get(url.pathname)).removeAttr('data-precedence');
    }
    $('script,link[rel="preload"],link[rel="manifest"],link[rel="icon"],link[rel="apple-touch-icon"],meta[name="next-size-adjust"]').remove();
    $('meta[property^="og:image"],meta[name^="twitter:image"]').remove();
    $('html').removeAttr('data-dpl-id');
    $('*').contents().filter((_, node) => node.type === 'comment').remove();
    $('body > div[hidden]').remove();
    const catalog = [];
    // Stable copy identifiers preserve the captured layout while prose is edited separately.
    for (const tag of ['h1','h2','h3','h4','p','dt','dd','blockquote']) {
      $(`main ${tag}`).each((index, el) => {
        const key = `${tag}${index}`;
        $(el).attr('data-copy', key);
        catalog.push({ key, text: $(el).text(), html: $(el).html(), class: $(el).attr('class') });
      });
    }
    const folder = `src/pages/templates/${audience}`;
    await fs.mkdir(folder, { recursive: true });
    await fs.writeFile(`${folder}/${record.slug}.html`, $.html());
    await fs.writeFile(`.reference/pages/${record.slug}-${audience}-catalog.json`, JSON.stringify(catalog, null, 2));
  }
}
await fs.writeFile('src/pages/routes.json', JSON.stringify(records.filter(p => p.route !== '/').map(({route,slug}) => ({route,slug})), null, 2));
console.log(`Prepared ${records.length - 1} subpages for both audiences and ${styles.size} local stylesheets.`);
