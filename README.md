# Co-Intelligence Circle landing page

Two shareable versions:

- [Human version](https://co-intelligencer.github.io/cic-home-text-impro/human/): personal insight, collective intelligence, deep listening and trust.
- [AI version](https://co-intelligencer.github.io/cic-home-text-impro/ai/): invite Milo to participate in the conversation in real time, with optional live translation.

The [root page](https://co-intelligencer.github.io/cic-home-text-impro/) defaults to the human version. The AI off/on switch uses ordinary links between the two pages, so each version survives sharing, refreshes, and browser navigation. Each page has its own title, description, and canonical URL.

A static recreation of the Co-Intelligence Circle home page for [POE-59](https://linear.app/poetic-design/issue/POE-59/rewriting-the-whole-landing-page-based-on-the-deeper-logic-behind-it). The page follows the original section order, typography, colors, spacing, card layouts, and responsive rules. Photos, logos, illustrations, icons, and audio use placeholders. The copy puts the visitor and their group at the center, with coherence, shared understanding, trust, clearer collaboration, and time saved over the long run.

## Editing and publishing

- Edit shared copy in `src/copy.json`, audience-specific copy in `src/variants.json`, and tooltips and plan notes in `src/ui-copy.json`.
- `src/template.html` contains the captured public home-page structure.
- `assets/` contains the original public stylesheets and fonts. `src/site.css` adapts media placeholders and static behavior.
- `src/site.js` handles navigation, the talking-stick demonstration, Milo's participation in the AI demo, pricing explanations, and the signup handoff.
- Run `pnpm install --frozen-lockfile`, `pnpm build`, and `pnpm check`.
- Run `pnpm dev` to preview at http://127.0.0.1:4173/.
- GitHub Pages publishes the committed `docs/` directory on `main`. Commit the regenerated `docs/` files with source edits.

Account, hosting, legal, and other application destinations link to the original website. This project is the landing page. The newsletter form validates an email locally, then offers a link to complete signup on the original website; this page does not submit or retain email addresses. The room is an interactive local demonstration, with placeholder media.

## Copy sources

The live website supplied product behavior and pricing. Its public page was captured on September 5, 2026. The following references informed the wording:

- [From cohesion to coherence](https://nadimhamdan.substack.com/p/from-cohesion-to-coherence)
- [The three operating states of people](https://nadimhamdan.substack.com/p/the-three-operating-states-of-people)
- [Co-Intelligence Circle](https://nadimhamdan.substack.com/p/co-intelligence-circle)
- [Shared editorial discussion](https://claude.ai/share/1f6b1499-1107-4f9b-b644-eae413fe8cfc), whose conversation was readable but interactive artifact was unavailable
- [Customer-as-hero reference](https://www.instagram.com/reel/DQSEraLDN2R/)

The rewrite uses the requested humanizer skill. It avoids em dashes, formulaic negative comparisons, vague reassurance, and broad promises such as “always” or “forever.” Duration tooltips explain the associated plan limit. Role customization is explained once in AI circle setup. Following the owner's copy corrections, recordings are described as deleted after a period of time to reduce server costs, and Germany/GDPR compliance claims are omitted. The separate seven-day paid trial remains. The source articles describe a practice that takes attention and time; the page frames time savings as a possible benefit of shared understanding over the long run.
