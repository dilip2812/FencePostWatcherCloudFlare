# fencepostwatcher.com

The marketing site for **FencePostWatcher by 7 Signals**, competitive intelligence for residential fence contractors. It follows the shared Watcher page pattern (DecorWatcher / ShingleWatcher / GarageWatcher / ShadeWatcher): hero, why it matters, two buyer funnels, pain points, seven signals, capabilities, industry data, how it works, get started form, process, pricing, testimonials, FAQ, and closing CTA.

Copy and figures come from the *North American Fence Contracting and Manufacturing Landscape* research brief (Oct 2026). Sources are listed on the page under **Sources**.

## How it's built

The site uses [watcher-site-core](https://github.com/Seven-Signals-LLC/watcher-site-core), the shared framework for every Watcher site. The core supplies the page `<head>`, header, the standard Watcher menu and **Try the demo** button, mobile menu, footer (with the Watcher family links), `sitemap.xml`, and the shared demo wording, **get started** form and **pricing** sections (DecorWatcher wording). This repo keeps the FencePostWatcher look, pages and copy, and fills the shared sections with its own words (`words` and `pricing` in `site.json`).

Every push to `main` deploys to the Cloudflare Worker `fencepostwatcher` (Workers Builds):

- **Build command:** `python3 tools/build.py`
- **Deploy command:** `npx wrangler deploy`

Set the same build command on **both** tabs under Settings → Builds: **Production** and **Previews Base** (pull-request previews use `npx wrangler preview`). Without it a deploy publishes the CSS and images but no pages.

`wrangler.jsonc` serves the `public/` folder, attaches fencepostwatcher.com and www.fencepostwatcher.com as custom domains, and serves `404.html` for missing pages.

```
/
├── core.version          The watcher-site-core version this site builds with
├── site.json             Brand, words for the shared sections, pricing, footer, fonts, favicon
├── tools/build.py        Downloads the pinned core and builds the site
├── src/pages/            The pages. Each starts with a <!--meta {...} --> block
│   ├── home.html           /
│   ├── contact.html        /contact/   (lead form → watcher-leads Worker → Attio)
│   ├── sample-form.html    /sample-form/ (test page, not in sitemap)
│   ├── thank-you.html      /thank-you/
│   └── 404.html            not-found page
├── public/               Static files, published as the site
│   ├── assets/css/site.css   "Cedar & Iron" styles, including the shared header/footer
│   ├── assets/js/site.js     Mobile menu
│   ├── assets/img/           mark.svg (logo), favicon.svg, hero photos (960/1600/2400 webp), hero.svg
│   ├── _headers              Security headers + pre-launch X-Robots-Tag: noindex
│   └── robots.txt            Pre-launch: disallow all
├── wrangler.jsonc
└── FORMS.md              How the lead forms reach Attio (not published)
```

Built pages (`public/index.html`, `public/*/index.html`, `public/404.html`, `public/sitemap.xml`) are made on every deploy and are not committed.

### Editing

- **Copy on a page:** edit the file in `src/pages/`. Everything after the `-->` line is the page body.
- **Title, description, page-only styles:** the `<!--meta {...} -->` block at the top of the page (`title`, `description`, `head`, `robots`).
- **Footer links, phone, email, plan name:** `site.json`. Price and the Stripe link are shared in watcher-site-core `defaults.json`. The menu and demo button come from watcher-site-core.
- **Shared sections:** `<!--core:demo-button-->`, `<!--core:get-started-->`, `<!--core:pricing-->` and friends in `src/pages/home.html` are filled in by the core. Change their wording in watcher-site-core so every Watcher site gets it.
- **Look:** `public/assets/css/site.css`.

### Building on your computer

```bash
python3 tools/build.py          # downloads the core version in core.version, writes public/
# or against a local checkout of the core:
WATCHER_CORE_PATH=../watcher-site-core python3 tools/build.py
```

### Updating the core

Change the line in `core.version` to the new release (for example `v0.1.1`), open a pull request, check the Cloudflare preview, then merge.

## Hero image

The hero is a full-screen photo (Gemini-generated, see the `gemini-hero-image-prompts` repo, `prompts/fencing.md`, Option A). It is served as WebP at 960/1600/2400 px wide via `srcset`, and preloaded from the home page's meta `head`. The hero overrides (full-viewport height, focal point) are in the same `head` block in `src/pages/home.html`.

## Before go-live checklist

- [ ] Remove `"robots": "noindex, nofollow"` from the meta block in `src/pages/home.html` and `src/pages/contact.html` (they then appear in `sitemap.xml`)
- [ ] Remove `X-Robots-Tag: noindex` from `public/_headers` and set `public/robots.txt` to `Allow: /`
- [ ] Add FencePostWatcher to `family.json` in watcher-site-core so the other Watcher footers link here
- [ ] Replace `XX,XXX` / `XX,000+` with the live fence company count (stat bar, Step 1)
- [x] Stripe: the Subscribe button uses the shared Stripe link from watcher-site-core (`pricing.checkout_url` in its `defaults.json`)
- [ ] Replace the three placeholder testimonials with approved, attributable quotes
- [ ] Confirm the seven-signal weights for fencing (currently the shared Watcher defaults: 25/20/15/15/10/10/5)
- [ ] Build `/industry-report/` from the research brief and repoint the "Industry Data" links
- [ ] Add an og image (1200×630) and set `og_image` / `og_image_alt` in `site.json`
- [ ] Build `/privacy/` and `/terms/`, plus Free Tools and Blog if wanted
- [ ] Add GA4/GTM; turn on UXWizz in `site.json` (`tracking`) if wanted

## Lead forms → Attio

The **get started** form (shared, from watcher-site-core) and the contact form both post to the shared **watcher-leads** Cloudflare Worker, which writes the lead to Attio (`web_leads`, Vertical `FencePostWatcher`). See `FORMS.md`.
