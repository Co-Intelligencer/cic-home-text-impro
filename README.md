# Co-Intelligence Circle website

Two shareable versions:

- [Human version](https://co-intelligencer.github.io/cic-home-text-impro/human/): personal insight, collective intelligence, deep listening and trust.
- [AI version](https://co-intelligencer.github.io/cic-home-text-impro/ai/): invite Milo to participate in the conversation in real time, with optional live translation.

The [root page](https://co-intelligencer.github.io/cic-home-text-impro/) defaults to the human version. The AI off/on switch links to the equivalent subpage in the other audience version, so the selected page survives sharing, refreshes, and browser navigation. Each page has its own title, description, and canonical URL.

A static recreation of the complete public Co-Intelligence Circle website for [POE-59](https://linear.app/poetic-design/issue/POE-59/rewriting-the-whole-landing-page-based-on-the-deeper-logic-behind-it). Pages follow the captured section order, typography, colors, spacing, card layouts, and responsive rules. Photos, logos, illustrations, icons, and audio use placeholders. The copy puts the visitor and their group at the center, with coherence, shared understanding, trust, clearer collaboration, and time saved over the long run.

## Public page coverage

The original sitemap and all public same-origin navigation links were checked on September 6, 2026. All 15 discovered routes are included: Home, How it works, Who it's for, Facilitators & coaches, Therapists & group practices, Philosophy, Pricing, Features, The Learner, About, Join, Sign in, Imprint, Privacy, and Terms.

Each route has a `/human/…/` page, an `/ai/…/` page, and a default human alias. For example, `/human/pricing/`, `/ai/pricing/`, and `/pricing/`. This produces 45 pages, plus a sitemap and a 404 page. The Learner remains clearly identified as AI research on both versions because that is the subject of the page; the human version emphasizes participants' consent and stewardship.

## Editing and publishing

- Edit shared copy in `src/copy.json`, audience-specific copy in `src/variants.json`, and tooltips and plan notes in `src/ui-copy.json`.
- `src/template.html` contains the captured public home-page structure.
- `src/pages/templates/` contains the captured subpage layouts. Edit subpage prose in `src/pages/copy.mjs`; stable copy identifiers keep the layout separate from the wording.
- `assets/` contains the original public stylesheets and fonts. `src/site.css` adapts media placeholders and static behavior.
- `src/site.js` handles navigation, the talking-stick demonstration, Milo's participation in the AI demo, monthly/annual pricing, pricing explanations, and live-service handoffs.
- Run `pnpm install --frozen-lockfile`, `pnpm build`, and `pnpm check`.
- Run `pnpm dev` to preview at http://127.0.0.1:4173/.
- GitHub Pages publishes the committed `docs/` directory on `main`. Commit the regenerated `docs/` files with source edits.

Content and legal navigation stays inside this website. Live sign-in, account creation, calls, credit purchases, newsletter subscriptions, and cohort registration continue on the original service. The public sign-in page provides an explicit handoff instead of collecting credentials on this static site. Join validates a six-digit code and directs the visitor to enter it on the live service. Newsletter and cohort forms validate an address locally and offer a signup link; they do not submit or retain addresses. The circle is an interactive local demonstration with placeholder media. Private account dashboards and active sessions are application functionality outside the public page recreation.

The original Terms page contained only a notice that terms were being prepared; its privacy-policy body was also empty. These pages retain a clear availability notice and contact details rather than invented legal terms. The provider's name, address, registry details, and copyright information remain in Imprint. The source used an obsolete “Practitioner” label for parallel-room eligibility, so the feature page asks visitors to confirm plan availability. Annual displayed prices were checked in the original pricing control: Starter €10.00, Basic €22.50 introductory (€32.50 regular), and Pro €40.83 per month, billed annually.

To refresh the captured source, run `node scripts/capture-pages.mjs` and `node scripts/prepare-subpages.mjs`. Review source changes and copy identifiers before rebuilding. Ordinary copy builds use only committed templates and local assets; they require no original-site network access.

## Copy sources

The live website supplied product behavior and pricing. The landing page was captured on September 5, 2026, and the full public site on September 6, 2026. The following references informed the wording:

- [From cohesion to coherence](https://nadimhamdan.substack.com/p/from-cohesion-to-coherence)
- [The three operating states of people](https://nadimhamdan.substack.com/p/the-three-operating-states-of-people)
- [Co-Intelligence Circle](https://nadimhamdan.substack.com/p/co-intelligence-circle)
- [Shared editorial discussion](https://claude.ai/share/1f6b1499-1107-4f9b-b644-eae413fe8cfc), whose conversation was readable but interactive artifact was unavailable
- [Customer-as-hero reference](https://www.instagram.com/reel/DQSEraLDN2R/)

The rewrite uses the requested humanizer skill. It avoids em dashes, formulaic negative comparisons, vague reassurance, and broad promises such as “always” or “forever.” Duration tooltips explain the associated plan limit. Role customization is explained once in AI circle setup. Following the owner's copy corrections, recordings are described as deleted after a period of time to reduce server costs, and Germany/GDPR compliance claims are omitted. The separate seven-day paid trial remains. The source articles describe a practice that takes attention and time; the page frames time savings as a possible benefit of shared understanding over the long run.
