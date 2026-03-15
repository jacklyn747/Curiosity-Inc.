# Curiosity Inc — Design Spec v1

## Stack Assumptions
Next.js · Tailwind · Framer Motion · Josefin Sans + Inter (Google Fonts)

---

## Design Tokens

```css
--color-bg:        #1D1D1B   /* noise / ground */
--color-tangerine: #F4622A   /* signal / human behavior */
--color-lavender:  #9B8EC4   /* system / structure */
--color-teal:      #2EC4B6   /* cognition / synthesis */
--color-mustard:   #F7C948   /* behavior / decision */
--color-sky:       #87CEEB   /* stimulus / input */
--color-grain:     4%        /* paper texture opacity */

--font-headline: 'Josefin Sans', sans-serif  /* all caps, tracked */
--font-body:     'Inter', sans-serif

--line-weight:   1px         /* all geometry strokes */
--glow-radius:   40px        /* signal nodes only */
```

---

## Behavioral Design Symbol Language

The 7-stage transformation model. Every surface that shows the Curiosity method
uses these symbols in sequence. Source of truth: `lib/symbols.ts`.

### The Progression

```
CONFUSION → AWARENESS → INSIGHT → ACTION → FRAMEWORK → SYSTEM → AUTHORITY
```

Colors follow a temperature arc — cold uncertainty to warm radiance. Every color is a brand token.

| Stage | Symbol | Geometry | Color | Hex | Color Psychology |
|-------|--------|----------|-------|-----|-----------------|
| 1 — Confusion | Scattered Dots | Noise field | `--sky` | `#9ED6DF` | Cold, diffuse, formless. The undifferentiated field before signal. |
| 2 — Awareness | Incomplete Circle | 270° arc, open gap | `--pink` | `#EAA7C7` | Soft, receptive. The moment of noticing. First signal arriving. |
| 3 — Insight | Vesica Piscis | Two overlapping circles | `--must` | `#EAC119` | Yellow/gold = illumination. The cognitive "aha." Understanding switching on. |
| 4 — Action | Triangle | Equilateral, points up | `--tea` | `#245E55` | Dark green = grounded forward motion. Nature's growth energy. Doing, not thinking. |
| 5 — Framework | Flower of Life | 7 overlapping circles | `--lav` | `#808BC5` | Violet = wisdom, pattern recognition, sacred geometry. Seeing the whole system. |
| 6 — System | Isometric Cube | 3-face cube outline | `--shell @ 75%` | `rgba(234,228,218,0.75)` | Near-white = crystalline clarity. Structure so solid it becomes transparent. |
| 7 — Authority | Radiant Circle | Circle + 12 rays | `--tang` | `#ED773C` | Orange = the radiant signal. Warm, transmitting, impossible to ignore. The source. |

### Rules

- **Symbols are semantic, never decorative.** Each one means exactly one thing.
- **Color = the cognitive layer active at that stage.** Don't mix.
- **Scale signals importance.** Larger symbol = this stage is the focus of the section.
- **Opacity signals completion.** Full opacity = resolved. Low opacity = potential/emerging.
- **Progression is always forward.** Never use a later symbol to describe an earlier state.

### Case Study Section Mapping

Each case study section is anchored to one symbol. The reader arrives confused
and leaves with authority. The progression IS the argument.

| Section | Symbol | Why |
|---------|--------|-----|
| 01 Hero | Confusion (Scattered Dots) | Reader arrives in the noise |
| 02 Situation | Awareness (Incomplete Circle) | The gap becomes visible |
| 03 Challenge | Awareness (Incomplete Circle) | Friction named precisely |
| 04 Behavioral Moves | Insight (Vesica Piscis) | Behavior × design intersect |
| 05 Learning Flow | Action (Triangle) | Direction chosen, movement begins |
| 06 Narrative System | Framework (Flower of Life) | The repeating pattern beneath everything |
| 07 What Works | System (Cube) | Crystallized, solid, repeatable |
| 08 Missed Opportunities | Awareness (Incomplete Circle) | Where signal breaks down |
| 09 Curiosity Upgrade | System (Cube) | The structure they could build |
| 10 Takeaways | Authority (Radiant Circle) | Signal transmitted — reader carries it away |

### Legacy Symbol Map (visual motifs still in use)

| Symbol | Used In |
|--------|---------|
| Focal Circle + Glow | CTA section (Authority symbol, large) |
| Concentric Circles | About portrait overlay, card orbit overlays |
| Horizontal Bands | Hero bottom, section dividers |
| Orbit Lines + Nodes | SystemSection diagram, card overlays |
| ThinLineSystem | NoiseSection bg, SituationSection bg (Confusion support) |

---

## Page Architecture

Single scroll. 6 sections. Each = one moment in the noise → signal sequence.

```
[01 HERO]         Signal arrives
[02 NOISE]        The problem named
[03 SYSTEM]       The framework revealed
[04 WORK]         Proof of practice
[05 ABOUT]        The human behind the system
[06 SIGNAL]       CTA — the focal circle closes
```

---

## Section Specs

### 01 — HERO
**Composition hierarchy:** focal circle → figure → bands → orbit nodes → background

**Visual:**
- Full-bleed hero image (the locked direction: woman / consciousness bands / radiant sun / orbit geometry)
- Overlay: none. Image speaks.
- Bottom edge: first horizontal band bleeds into section 02 (tangerine at 15% opacity)

**Typography:**
```
CURIOSITY INC                    ← Josefin Sans, 11px, tracked 0.3em, top-left
NOISE TO SIGNAL                  ← Josefin Sans, 56–72px, centered, near-white
Behavioral design for people     ← Inter, 18px, 400 weight, centered, 60% opacity
who build what people actually do
[CTA: SEE THE WORK →]            ← Josefin Sans, 12px, tracked, tangerine
```

**Animation:**
- On load: headline fades up from 20px offset, 0.8s ease-out
- Hero image: subtle slow zoom (scale 1.0 → 1.04) over 8s, looped
- Orbit nodes in image: pure CSS, very slow rotation (120s full loop)
- Horizontal bands: slide in from left, staggered 100ms each

---

### 02 — NOISE
**Concept:** Name the problem. Dark, dense. This is what noise looks like.

**Visual:**
- Background: #1D1D1B + grain
- A field of fragmented text/data at low opacity (5–8%) — scattered words: inputs, triggers, data, friction, context, behavior, system, signal... — grid-locked but visually overwhelming
- Over it: a single thin radial grid line system (1px lavender, 10% opacity)
- No images. Typography IS the design.

**Typography:**
```
SECTION LABEL: 02 / NOISE       ← Josefin Sans, 10px, tracked, lavender 50%

HEADLINE (large, left-aligned):
"Most organizations
are optimizing
the wrong thing."              ← Josefin Sans, 48–64px, white

BODY:
They measure clicks, not cognition.    ← Inter, 17px, 65% opacity
Conversions, not comprehension.
They're fluent in noise.
```

**Animation:**
- On scroll into view: fragmented background words assemble from scattered positions into a grid — 1.2s, ease-out
- Headline: staggered line-by-line reveal

---

### 03 — SYSTEM
**Concept:** The framework revealed. This is the intellectual centerpiece of the site.

**Visual:**
- Full-width diagram: the 5-layer stack rendered as thin-line sacred geometry
- Each layer = one horizontal band in its brand color, with a labeled node (circle) on the left
- Center spine: vertical line connecting all 5 nodes (1px, gradient tangerine→sky)
- Background: #1D1D1B + faint radial grid (20% opacity)
- Orbit lines arc around each node

**The 5 Layers (rendered as diagram):**
```
● SIGNAL      #F4622A  ← top / resolved / the goal
● SYSTEM      #9B8EC4
● BEHAVIOR    #F7C948
● COGNITION   #2EC4B6
● STIMULUS    #87CEEB  ← bottom / input / raw
```

**Typography:**
```
THE CURIOSITY SYSTEM            ← Josefin Sans, 11px, tracked, section label

"Signal doesn't emerge.
It's engineered."               ← Josefin Sans, 48px, white

[Each layer node has:]
LAYER NAME                      ← Josefin Sans, 11px, tracked, in layer color
One-line description            ← Inter, 14px, 60% opacity
```

**Animation:**
- Diagram draws in on scroll: center spine first (0.6s), then each node pulses in bottom → top (staggered 150ms each)
- Orbit lines rotate slowly (80s loop) once in view
- Hover on any node: glow radius expands, description fades in

---

### 04 — WORK
**Concept:** Proof. Clean, modular. Let the work speak through the system lens.

**Visual:**
- 2-column grid (desktop) / 1-column (mobile)
- Each case study card: dark card (#242420), thin 1px border in layer color
- Top of card: small geometry mark (the relevant symbol for that engagement type)
- Card hover: border brightens to full color, subtle inner glow

**Typography:**
```
SECTION LABEL: 04 / WORK

CLIENT / SECTOR                 ← Josefin Sans, 10px, tracked, muted
Project title                   ← Josefin Sans, 24px, white
One-sentence outcome            ← Inter, 15px, 70% opacity
[LAYER TAG]                     ← small pill, layer color bg, Josefin Sans 9px
```

**Animation:**
- Cards: staggered fade-up on scroll (50ms between cards)
- Geometry mark on card: slow pulse (opacity 60%→100%, 3s loop)

---

### 05 — ABOUT
**Concept:** The human behind the system. Intellectual glamour. Geometry meets perception.

**Visual:**
- Left: portrait (human element — real photo or illustrated treatment consistent with hero)
- Over/beside portrait: thin orbit lines and 2–3 concentric circles (1px tangerine, 30% opacity)
- Right: text
- Background: #1D1D1B, no grain here — clean

**Typography:**
```
SECTION LABEL: 05 / SIGNAL SOURCE

"I study why people
do what they do —
then build systems
that work with it."            ← Josefin Sans, 40px, white

[Name, role]                   ← Inter, 15px, 60% opacity
[2–3 sentence bio]             ← Inter, 16px, 75% opacity
```

**Animation:**
- Orbit lines: draw in around portrait as section enters view
- Text: simple fade-up

---

### 06 — SIGNAL (CTA)
**Concept:** Everything converges here. The focal circle closes.

**Visual:**
- Full-width, full-height section
- Center: the focal circle — large (200–280px), tangerine gradient, soft glow (--glow-radius)
- Inside circle: a single thin triangle pointing up (direction/strategy symbol)
- Below circle: CTA text + button
- Background: pure #1D1D1B, no grain, no geometry — just the circle and darkness
- This is the only section with no supporting visual noise. Signal = silence around the point.

**Typography:**
```
LET'S WORK.                    ← Josefin Sans, 48–56px, white, centered

[hello@curiosityinc.com]       ← Inter, 18px, tangerine, underline on hover
or
[BOOK A CALL →]                ← Josefin Sans, 12px tracked, inside outlined button
```

**Animation:**
- Focal circle: breathes (scale 1.0 → 1.03, opacity 85% → 100%, 4s ease-in-out loop)
- On hover of button: circle glow expands to 80px radius
- Page scroll completion: circle pulses once on arrival

---

## Navigation

**Fixed top bar:**
```
CURIOSITY INC                  ← Josefin Sans, 11px, tracked, left
                               [WORK]  [SYSTEM]  [ABOUT]  [CONTACT]  ← right, same spec
```
- Background: transparent → #1D1D1B at 90% opacity after 80px scroll
- Active section: nav item in tangerine
- Mobile: hamburger → full-screen overlay, items stacked, large Josefin Sans

---

## Motion System (Global Rules)

| Type | Duration | Easing | Use |
|------|----------|--------|-----|
| Section entry | 0.6–0.8s | ease-out | All scroll reveals |
| Geometry draw | 0.8–1.2s | ease-in-out | Line art SVG stroke |
| Node pulse | 3–4s loop | ease-in-out | Orbit nodes, CTA circle |
| Orbital rotation | 80–120s loop | linear | Orbit path lines |
| Hover state | 0.2s | ease-out | All interactive |
| Page load | 1.0s | ease-out | Hero only |

**Never:** bounce, spring, elastic, playful easing
**Always:** deliberate, calm, inevitable

---

## Component Inventory

```
<Nav />                 fixed top bar
<HeroSection />         full-bleed image + headline overlay
<NoiseSection />        fragmented word field + typography
<SystemDiagram />       SVG 5-layer diagram, animated
<WorkGrid />            case study cards
<AboutSection />        portrait + orbit overlay + bio
<CTASection />          focal circle + contact
<HorizontalBand />      reusable section divider (colored)
<GeometryNode />        reusable labeled circle node
<OrbitLines />          reusable SVG orbital paths
```

---

## Responsive Breakpoints

| Breakpoint | Treatment |
|------------|-----------|
| Mobile <768 | Single column, system diagram simplified to vertical list with nodes, hero image center-cropped |
| Tablet 768–1024 | Hero text scales down, work grid 2-col |
| Desktop 1024+ | Full layout as specced |

---

## File Structure (proposed)

```
app/
  page.tsx              ← single scroll page
  layout.tsx            ← fonts, metadata
components/
  nav.tsx
  hero-section.tsx
  noise-section.tsx
  system-diagram.tsx    ← key SVG component
  work-grid.tsx
  about-section.tsx
  cta-section.tsx
  ui/
    horizontal-band.tsx
    geometry-node.tsx
    orbit-lines.tsx
lib/
  design-tokens.ts      ← all CSS vars as JS constants
  motion-config.ts      ← shared Framer Motion variants
public/images/
  hero.jpg              ← locked hero image
```

---

## Build Order

1. `design-tokens.ts` + global CSS — the foundation
2. `<Nav />` — always first
3. `<HeroSection />` — highest visual priority
4. `<SystemDiagram />` — most complex component, do standalone
5. Remaining sections in page order
6. Motion pass — add all animations last, after layout is solid
7. Responsive pass
8. Performance pass (image optimization, animation GPU hints)
