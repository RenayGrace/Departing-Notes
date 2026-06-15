<div align="center">

# DepartingNotes.com

### *Leave a note. Just in case.*

**A digital legacy platform — write letters, store final wishes, and have your words delivered to the people you love, when it matters most.**

[**View Live Site →**](https://renaygrace.github.io/Departing-Notes/) · [Design System](DESIGN-SYSTEM.md)

</div>

---

> *"Everyone deserves the right to say goodbye. And no one should have to do it alone."*

DepartingNotes is a membership-based digital legacy platform. Members write letters, upload documents and photos, and designate recipients. Everything is stored in an encrypted vault and released to those recipients **only** when the member passes away — triggered by a death certificate submitted by their executor.

This repository contains the **marketing-site base**: a complete, polished, front-end build.

---

## ✨ What's inside

A **dependency-free static site** — pure HTML, custom CSS, and vanilla JavaScript. No build step, no framework, no `npm install`. Open any page in a browser and it works. Designed to port cleanly into Wix for production.

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, the problem, 3-step flow, tier preview, Tribes, partners, social proof, final CTA |
| How It Works | `how-it-works.html` | 4-step member journey, security overview, FAQ accordion |
| Membership Plans | `plans.html` | 4 tiers, annual/monthly toggle, full comparison table, card showcase |
| Our Partners | `partners.html` | Life Story, financial planning, and estate-law partners |
| About | `about.html` | The origin story and mission |
| Contact | `contact.html` | Validated contact form |
| Release Portal | `release.html` · `release-confirm.html` | Executor flow — submit a death certificate |
| Register | `register.html` | 4-step account creation wizard |
| Log In | `login.html` | Member sign-in |
| Legal | `privacy.html` · `terms.html` · `ccpa.html` | Privacy, Terms, CCPA |

```
.
├── index.html, how-it-works.html, plans.html, ...   # pages
├── assets/
│   ├── css/styles.css      # the full "Letters & Light" design system
│   ├── js/main.js          # nav, scroll reveals, counters, pricing toggle, forms
│   └── img/logo.svg        # brand mark
├── DESIGN-SYSTEM.md        # design tokens, type, color, principles
└── .claude/launch.json     # local preview config
```

---

## 🎨 Design system — "Letters & Light"

Warm, premium, human — the feeling of fine stationery and candlelight, never clinical or corporate. Full details in [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md).

| | |
|---|---|
| **Paper** `#FBF8F3` | warm ivory background |
| **Forest** `#1F3D34` | primary — permanence & trust |
| **Candlelight Gold** `#B9802F` | accent — honor & legacy |
| **Sage** `#8BA888` | soft secondary — life |
| **Dusty Rose** `#C97B6B` | love (used sparingly) |

**Type:** Playfair Display (headings) · Caveat (handwritten accents) · Inter (body)

Built mobile-first with scroll-reveal animations, animated counters, and accessible forms — all respecting `prefers-reduced-motion`, with AA+ contrast and visible focus states.

---

## 🚀 Preview locally

**Option A — just open it.** Double-click `index.html`. That's it.

**Option B — local server** (nicer for clean URLs):

```bash
npx serve .
# then open http://localhost:3000
```

---

## 🌐 Deploy

**GitHub Pages** (live now): the site is served from the `main` branch at
**https://renaygrace.github.io/Departing-Notes/**

**Wix** (production target): pages and the design system are structured to be recreated in the Wix editor. Use `DESIGN-SYSTEM.md` for the color and type tokens.

---

## 📝 Notes

- Forms are front-end demonstrations — they validate and show success states but do not yet submit to a backend.
- Testimonials and member counts are clearly labeled as **illustrative placeholders** — replace with real content before launch.

---

<div align="center">

*A platform by R. Grace Rodriguez, Esq. · © 2026 DepartingNotes Co.*

</div>
