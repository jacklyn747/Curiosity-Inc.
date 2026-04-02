# Favicon Design Concepts

We need a favicon that feels as "architectural" and "premium" as the rest of the site. A browser tab is small (16px to 32px), so simple, high-contrast shapes work best.

## Option 01: The Energy Diamond (Recommended)
This uses the brand's accent orange (`#ED773C`). It pops in browser tabs and immediately identifies the "Digital Sanctuary."

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="#121211"/>
  <path d="M16 6L18.8 13.2L26 16L18.8 18.8L16 26L13.2 18.8L6 16L13.2 13.2L16 6Z" fill="#ED773C"/>
</svg>
```

## Option 02: Total Minimalism (Monochrome)
A stark white or silver diamond on a deep void background. Clean, elite, and quiet.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="#121211"/>
  <path d="M16 6L18.8 13.2L26 16L18.8 18.8L16 26L13.2 18.8L6 16L13.2 13.2L16 6Z" fill="#FFFFFF"/>
</svg>
```

## Option 03: The Blueprint Grid
A slightly more complex design using a grid pattern, signaling the "Instructional Architecture" foundation.

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" fill="none">
  <rect width="32" height="32" rx="6" fill="#121211"/>
  <path d="M16 0V32M0 16H32" stroke="rgba(255,255,255,0.05)" stroke-width="0.5"/>
  <path d="M16 8L18 14L24 16L18 18L16 24L14 18L8 16L14 14L16 8Z" fill="#ED773C"/>
</svg>
```

---

**Which one feels "coolest" to you?** I recommend **Option 01** because it's the most legible at tiny sizes.
