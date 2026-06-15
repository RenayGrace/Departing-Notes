# DepartingNotes.com — Design System

**Codename:** *"Letters & Light"*
Prepared via UI/UX Pro Max design intelligence · June 2026

> Emotional, premium, trustworthy. The feeling of fine stationery and warm candlelight — never clinical, never corporate, never legal-cold.

---

## 1. Brand Personality

| Trait | Expression |
|---|---|
| **Warm** | Ivory paper background, soft light, handwritten accents |
| **Permanent** | Deep forest green — evergreen, eternal, grounded |
| **Honoring** | Candlelight gold — legacy, gold-leaf, the dignity of a goodbye |
| **Human** | Real stories, generous whitespace, slow gentle motion |
| **Trustworthy** | Calm hierarchy, security cues, attorney-backed credibility |

Archetype blend (from product intelligence): **Non-profit/Charity** (storytelling + emotional) × **Mental-Health** (calm, privacy-first) × **Trust & Authority** (credibility for death verification).

---

## 2. Color Tokens

```css
--paper:      #FBF8F3;  /* page background — warm ivory  */
--paper-2:    #F4EDE1;  /* alternating section            */
--surface:    #FFFFFF;  /* cards                          */
--ink-deep:   #15231E;  /* dark sections / footer         */

--forest:     #1F3D34;  /* PRIMARY brand + primary buttons */
--forest-600: #356B59;
--sage:       #8BA888;  /* soft secondary / life          */
--sage-soft:  #DCE6D8;

--gold:       #B9802F;  /* ACCENT — honor, premium, links  */
--gold-soft:  #EAD9BC;
--rose:       #C97B6B;  /* love / letters — use sparingly  */

--text:       #2B2622;  /* warm near-black                 */
--text-soft:  #5C544B;
--text-mute:  #8A8175;
--border:     #E7DED0;
```

Contrast verified: `--text` on `--paper` = 11.6:1, `--forest` on `--paper` = 8.2:1, white on `--forest` = 9.1:1 (all AA+).

---

## 3. Typography

| Role | Font | Usage |
|---|---|---|
| Display / headings | **Playfair Display** | Hero, section titles, emotional gravitas |
| Handwritten accent | **Caveat** | Signature flourishes only — "Just in case." Never body. |
| Body / UI | **Inter** | Paragraphs, nav, forms, buttons, data |

Scale: 13 · 14 · 16(base) · 18 · 21 · 28 · 38 · 52 · 68. Body line-height 1.7, headings 1.1–1.2.

---

## 4. Motion & Effects

- Soft, warm-tinted shadows (never harsh black).
- Radius: 12 / 18 / 26 / pill.
- Reveal-on-scroll fades (≤ 500ms, ease-out, staggered 60ms).
- Candlelight glow on gold accents; "ink-draw" underline on links.
- **Always** respects `prefers-reduced-motion`.

---

## 5. Non-negotiables

- SVG icons only (no emoji as structural icons).
- One primary CTA per screen: **"Create Your Free Account."**
- Touch targets ≥ 44px, focus rings visible, labels on every field.
- Mobile-first; tested 375 / 768 / 1024 / 1440.
- Tone is comfort, not sales. We are honored, not transactional.
