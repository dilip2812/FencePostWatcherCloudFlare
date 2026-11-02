# Lead forms on fencepostwatcher.com

Forms on this site don't store anything themselves. They post to the shared **watcher-leads** Cloudflare Worker, which writes each lead into Attio.

```
fencepostwatcher.com page ── POST ──▶ https://watcher-leads.dan-09c.workers.dev/lead ──▶ Attio
                                (Worker "watcher-leads")              list: web_leads
                                                                      Vertical: FencePostWatcher
```

- **Code, docs and the form snippet:** [Seven-Signals-LLC/watcher-lead-forms](https://github.com/Seven-Signals-LLC/watcher-lead-forms)
- **This site's Vertical:** `FencePostWatcher`. The Worker sets it from the domain (`SITES` in that repo's `wrangler.toml`), so pages don't send it.
- **In Attio, each lead creates:** a Person (matched on email), a Company (matched on domain), a **web_leads** entry with Priority `1 Call now`, Status `New`, page URL, referrer, UTMs and message, and a Note with the full submission.

## Adding a form to a page

1. Copy [`form/lead-form-snippet.html`](https://github.com/Seven-Signals-LLC/watcher-lead-forms/blob/main/form/lead-form-snippet.html) into the page where the form should go. The endpoint is already filled in.
2. To match this site's colors, set the `--wl-*` variables in the page CSS, e.g. `.wl-form { --wl-accent: #1f4e79; }`.
3. Make sure this repo has a `thank-you.html` (served at `/thank-you`). Visitors without JavaScript are sent there after submitting. With JavaScript, the form shows its thank-you message on the page.

## Checking it

- Submit a test from the live page, then open Attio → **web_leads**. The entry should show Vertical `FencePostWatcher`.
- A `403 origin_not_allowed` error means `fencepostwatcher.com` is missing from `SITES` in watcher-lead-forms.
- To see live logs, run `npx wrangler tail watcher-leads` while submitting.

This file is internal. It's listed in `.assetsignore`, so it isn't published to the site.
