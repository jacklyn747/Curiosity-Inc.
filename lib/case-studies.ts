// lib/case-studies.ts

export interface LearningStep { from: string; to: string; how: string }

export interface CaseStudy {
  slug: string; index: string; name: string; outcome: string
  color: string; image: string
  headline: string; subhead: string
  meta: { platforms: string[]; offers: string[]; audienceType: string; audienceSize: string }
  situation: string[]; challenge: string; frictionTypes: string[]; awarenessQuote: string
  behavioralMoves: { attention: string[]; cognitiveAnchors: string[]; knowledgePackaging: string[]; authoritySignals: string[] }
  insightQuote: string
  learningFlow: [LearningStep, LearningStep, LearningStep, LearningStep]
  actionQuote: string
  narrativeSystem: { stories: string[]; dominant: string; description: string; quote: string }
  whatWorks: string[]; missedOpportunities: string[]; systemQuote: string
  curiosityUpgrade: string[]
  takeaways: [string, string, string, string, string]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dan-koe', index: '01', name: 'Dan Koe', outcome: 'Authority',
    color: 'var(--tang)', image: '/images/dan-koe.jpg',
    headline: 'How Dan Koe Engineers Authority',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['X / Twitter (~1.2M)', 'YouTube (~650K)', 'Newsletter (~350K+)'],
      offers: ['The 2-Hour Writer', 'Modern Mastery (community)', '1-on-1 consulting'],
      audienceType: 'Ambitious generalists building a 1-person business',
      audienceSize: '2.4M+ across platforms',
    },
    situation: [
      'Dan Koe operates in one of the noisiest categories online: self-improvement. Thousands of creators compete for the same searcher — someone who feels stuck, wants more freedom, and is open to new frameworks.',
      'What sets Koe apart is that he doesn\'t position himself inside the self-improvement category. He positions himself against it. His brand is built on the premise that conventional productivity advice is a distraction from building real leverage.',
      'His audience is not looking for morning routines. They\'re looking for a philosophy. Koe gives them one — and then sells them the tools to act on it.',
      'The sophistication of his market position is unusual for a solo creator: he operates at the level of worldview architecture, not tactical advice.',
    ],
    challenge: 'The core friction is trust. Why would a young man with no conventional credentials be worth listening to on life philosophy? Koe solves this not with credentials but with epistemological positioning — he makes the reader feel smarter for agreeing with him, which creates instant identity alignment.',
    frictionTypes: ['trust', 'identity'],
    awarenessQuote: 'He doesn\'t sell information. He sells a way of seeing.',
    behavioralMoves: {
      attention: ['Contrarian hook: "Most advice is wrong"', 'Philosophy framing over tactical framing', 'Long-form threads that reward careful reading', 'Visual identity of solitude and focus'],
      cognitiveAnchors: ['"The 1-person business"', '"Modern Mastery"', '"Generalist advantage"', '"Work less, earn more"'],
      knowledgePackaging: ['Thread → email → essay → product pipeline', 'Single idea expressed across 5 formats', 'Books and philosophy cited as credibility proxies', 'Paid community as idea laboratory'],
      authoritySignals: ['Revenue transparency (income reports)', 'Longevity (5+ years consistent)', 'Refusal to follow platform conventions', 'Philosophical depth as differentiator'],
    },
    insightQuote: '"The generalist advantage" — three words that reframe a perceived weakness as a competitive moat.',
    learningFlow: [
      { from: 'Skeptical', to: 'Intrigued', how: 'Contrarian hook challenges their current belief system' },
      { from: 'Intrigued', to: 'Aligned', how: 'Philosophy content creates identity resonance' },
      { from: 'Aligned', to: 'Trusting', how: 'Consistent depth signals genuine expertise, not performance' },
      { from: 'Trusting', to: 'Buying', how: 'Product offer feels like a natural extension of the worldview adopted' },
    ],
    actionQuote: 'The identity alignment happens before the pitch. By the time the offer appears, the reader already sees themselves inside it.',
    narrativeSystem: {
      stories: ['Mastery', 'Freedom', 'Intelligence'],
      dominant: 'Freedom',
      description: 'The dominant narrative is freedom — not hustle, not wealth as an end, but the philosophical freedom to design your own life. This narrative pre-selects for an audience that will resonate deeply and filter out people who want tactics.',
      quote: '"Freedom is the goal. Everything else is a metric."',
    },
    whatWorks: [
      'Idea repetition — same core concepts expressed across years and formats without exhaustion',
      'Identity-first positioning — sells a self-image before any product',
      'Long-form tolerance — audience is self-selected for patience and depth',
      'Philosophy as moat — hard to copy because it requires genuine worldview, not just content',
      'Pipeline clarity — thread → email → community → consulting is a clean behavioral funnel',
    ],
    missedOpportunities: [
      'No visual system — the philosophy is advanced but the design language is generic',
      'Framework visualization lacking — ideas expressed in prose but never diagrammed',
      'Offer stack requires effort to understand from content alone',
      'Cross-platform experience inconsistent in depth and format',
    ],
    systemQuote: 'The content system is sophisticated. The visual and structural system hasn\'t caught up.',
    curiosityUpgrade: [
      '→ Map the "Modern Mastery" framework visually — make the philosophy legible as a system diagram',
      '→ Create a visual identity layer that signals intellectual sophistication at first glance',
      '→ Build a clearer offer hierarchy that mirrors the audience journey: philosophy → tools → access',
      '→ Use knowledge architecture to make the funnel feel inevitable, not discovered accidentally',
    ],
    takeaways: [
      'Identity before offer — people buy who they want to become, not what they want to know.',
      'Philosophy builds authority faster than tactics because it\'s harder to fake.',
      'Consistent language compounds — saying the same true thing many ways is a strategy.',
      'The contrarian position only works if the depth is real.',
      'Sell the worldview. The product is just the vehicle.',
    ],
  },
  {
    slug: 'ali-abdaal', index: '02', name: 'Ali Abdaal', outcome: 'Trust',
    color: 'var(--lav)', image: '/images/ali-abdaal.jpg',
    headline: 'How Ali Abdaal Engineers Trust',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['YouTube (~5.8M)', 'Newsletter (~500K+)', 'Podcast (~200K)'],
      offers: ['Feel-Good Productivity (book)', 'Part-Time YouTuber Academy', 'Productivity Lab (community)'],
      audienceType: 'Students and young professionals seeking sustainable high performance',
      audienceSize: '6M+ across platforms',
    },
    situation: [
      'Ali Abdaal is the most-subscribed productivity creator on YouTube. He built his audience during medical school at Cambridge — a credential that does extraordinary work before he says a single word.',
      'His market position is "evidence-based productivity that doesn\'t burn you out." This is a precise and intelligent positioning move: it acknowledges the failure mode of the category and promises to solve it.',
      'His audience skews student and early career — people in high-pressure environments who are anxious about performance and receptive to systems that promise to make work feel better, not just more efficient.',
      'The brand promise — "feel-good productivity" — is a behavioral design masterstroke. It pre-empts the primary objection to productivity content: that it makes life feel like a relentless optimization.',
    ],
    challenge: 'The core friction is attention — YouTube is crowded with productivity content, and most of it is interchangeable. Abdaal solves this with production quality, credential signaling, and a distinct emotional brand ("feel-good") that differentiates at the emotional level rather than the tactical one.',
    frictionTypes: ['attention', 'decision'],
    awarenessQuote: 'The Cambridge credential is doing more conversion work than any CTA he\'s ever written.',
    behavioralMoves: {
      attention: ['Medical school credential as instant authority signal', 'Thumbnail + title optimized for search intent', '"Feel-good" as emotional differentiator in a fear-based category', 'High production quality signals investment and permanence'],
      cognitiveAnchors: ['"Feel-good productivity"', '"Evidence-based"', '"Part-time YouTuber"', '"Working smarter, not harder"'],
      knowledgePackaging: ['Research → accessible summary → actionable takeaway pipeline', 'Book recommendations as credibility proxies', 'Personal experiments as relatable case studies', 'Tiered offer: free video → book → community → course'],
      authoritySignals: ['Cambridge / doctor credential', 'Book deal with major publisher', 'Interview format with other authorities', 'Transparent business updates'],
    },
    insightQuote: '"Feel-Good Productivity" — two words that invalidate every competitor\'s fear-based framing with a single phrase.',
    learningFlow: [
      { from: 'Searching', to: 'Watching', how: 'SEO-optimized title captures existing intent, thumbnail confirms quality' },
      { from: 'Watching', to: 'Trusting', how: 'Credential + research backing + relatable personal story builds layered credibility' },
      { from: 'Trusting', to: 'Subscribing', how: 'Consistent value across multiple videos creates dependency and reciprocity' },
      { from: 'Subscribing', to: 'Buying', how: 'Email nurture + book launch + community invitation converts fans to customers' },
    ],
    actionQuote: 'Trust is built in layers, not moments. Every video is a micro-deposit into the credibility account.',
    narrativeSystem: {
      stories: ['Mastery', 'Simplicity', 'Freedom'],
      dominant: 'Simplicity',
      description: 'The dominant narrative is simplicity — complex ideas made accessible, high performance made sustainable. This narrative is inclusive (anyone can do this) and aspirational (you can be like the Cambridge doctor), which maximizes audience breadth.',
      quote: '"You don\'t have to suffer to succeed."',
    },
    whatWorks: [
      'Credential leverage — the doctor positioning does the trust-building before the content has to',
      'Emotional brand differentiation — "feel-good" separates from the fear-based productivity mainstream',
      'Volume of value — years of free content creates deep reciprocity in the audience',
      'Searchable content strategy — videos rank for years, compounding audience acquisition',
      'Email as conversion layer — newsletter bridges YouTube audience to paid products',
    ],
    missedOpportunities: [
      'Offer stack complexity — too many products at different price points without clear journey mapping',
      'Brand coherence across products could be stronger — book, course, and community feel slightly disconnected',
      'Conversion clarity at scale — a 5.8M subscriber audience deserves a more architecturally clear path to purchase',
      'Visual framework for the productivity system — "feel-good productivity" is a concept, not yet a diagram',
    ],
    systemQuote: 'At this scale, unclear architecture leaves significant conversion on the table.',
    curiosityUpgrade: [
      '→ Map the "Feel-Good Productivity" system as a visual behavioral framework — make the philosophy a diagram',
      '→ Clarify the offer journey: free → book → community → course with explicit behavioral triggers at each gate',
      '→ Create stronger visual coherence across book, course, and community design systems',
      '→ Use cognitive load reduction at the decision point — fewer, clearer choices with better-framed value propositions',
    ],
    takeaways: [
      'Trust is built in layers — no single moment creates it, many consistent moments accumulate it.',
      'Emotional positioning beats tactical positioning in crowded markets.',
      'Education is the best conversion tool — teach generously, sell naturally.',
      'Volume creates reciprocity — people who have learned from you feel obligated to support you.',
      'Credentials do conversion work that content alone cannot replicate.',
    ],
  },
  {
    slug: 'justin-welsh', index: '03', name: 'Justin Welsh', outcome: 'Demand',
    color: 'var(--must)', image: '/images/justin-welsh.jpg',
    headline: 'How Justin Welsh Engineers Demand',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['LinkedIn (~550K)', 'X / Twitter (~230K)', 'Newsletter (~210K+)'],
      offers: ['The LinkedIn OS', 'The Content OS', 'Saturday Solopreneur (newsletter)'],
      audienceType: 'Mid-career professionals building a solo business from existing expertise',
      audienceSize: '850K+ across platforms',
    },
    situation: [
      'Justin Welsh is the premier case study in LinkedIn-native audience building. A former SaaS VP who burned out at scale, he turned his exit into a brand — and his brand into a $5M+ solo business.',
      'His market position is hyper-specific: the solopreneur operating system. He doesn\'t serve generalists or beginners. He serves mid-career professionals who have expertise and want to monetize it without building a team.',
      'This specificity is the signal. In a creator space crowded with "build an audience" advice, Welsh goes deeper: he teaches the exact system, with exact numbers, with his own results as the case study.',
      'The transparency is the product. He shows his revenue. He shows his process. This is not just content — it is behavioral proof that the system works.',
    ],
    challenge: 'The primary friction is identity — "is this for someone like me?" Welsh solves this with radical specificity. Every piece of content is written for a very particular person: mid-career, expertise-rich, wants freedom, skeptical of hype.',
    frictionTypes: ['identity', 'clarity'],
    awarenessQuote: 'Specificity is his biggest distribution strategy. The narrower the target, the stronger the pull.',
    behavioralMoves: {
      attention: ['Revenue transparency as credibility ("I made $X with this system")', 'Short-form LinkedIn posts optimized for scroll-stopping first lines', 'Repeatable post formats that train audience expectations', 'Personal transformation story as origin myth'],
      cognitiveAnchors: ['"The Solopreneur"', '"LinkedIn OS"', '"Content OS"', '"Saturday Solopreneur"', '"$5M solo business"'],
      knowledgePackaging: ['Operating system metaphor — makes the system feel comprehensive and learnable', 'Case study format in every post (before → after)', 'Newsletter as weekly system demonstration', 'Productized courses as system documentation'],
      authoritySignals: ['Revenue numbers shared publicly', 'SaaS VP background as expertise signal', 'Longevity — years of daily LinkedIn posting', 'Specific outcomes promised and demonstrated'],
    },
    insightQuote: '"The LinkedIn OS" — not a course, not a community — a system. The language implies that everything else is chaos.',
    learningFlow: [
      { from: 'Scrolling', to: 'Pausing', how: 'Specific first line of LinkedIn post speaks directly to their situation' },
      { from: 'Pausing', to: 'Believing', how: 'Revenue proof + case study format makes the claim credible, not aspirational' },
      { from: 'Believing', to: 'Following', how: 'Consistent format across posts makes the system feel learnable, not lucky' },
      { from: 'Following', to: 'Buying', how: 'Newsletter deepens the relationship; product appears as the next logical step' },
    ],
    actionQuote: 'Every post is a micro case study. By the time the product launches, the audience has already been shown 200 proofs of concept.',
    narrativeSystem: {
      stories: ['Freedom', 'Mastery', 'Wealth'],
      dominant: 'Freedom',
      description: 'The dominant narrative is freedom — specifically, freedom from corporate dependency. Welsh\'s burnout story is the origin, and the solopreneur system is the solution. Every piece of content reinforces that the system enables this freedom.',
      quote: '"You don\'t need a team. You need a system."',
    },
    whatWorks: [
      'Extreme specificity — the narrow targeting makes every piece of content feel personally written',
      'Proof over promise — revenue numbers and case studies do the persuasion that copy alone cannot',
      'Consistency of format — audiences know what to expect, reducing cognitive load and building ritual',
      'Operating system framing — positions the product as infrastructure, not information',
      'Transparency as differentiation — showing the numbers is rare enough to be a competitive advantage',
    ],
    missedOpportunities: [
      'Visual differentiation is low — text-heavy content blends into LinkedIn aesthetics without a distinct visual signature',
      'Framework visualization lacking — "The LinkedIn OS" could be far more powerful as a visible system diagram',
      'Cross-platform experience is inconsistent — LinkedIn-native posts don\'t translate cleanly to X or newsletter',
      'No visual identity layer that signals the system sophistication of the brand',
    ],
    systemQuote: 'The system is real. It just hasn\'t been made visible enough to do its full conversion work.',
    curiosityUpgrade: [
      '→ Visualize "The LinkedIn OS" and "Content OS" as behavioral architecture diagrams — the system should be seeable',
      '→ Build a distinct visual identity that travels across platforms and reinforces the system brand',
      '→ Create a cross-platform content architecture so the audience journey doesn\'t reset on each channel',
      '→ Map the decision triggers more explicitly — what makes someone go from follower to buyer, diagrammed',
    ],
    takeaways: [
      'Specificity creates demand — the narrower the audience, the stronger the pull on the right person.',
      'Proof beats persuasion at every stage of the funnel.',
      'Consistency of format reduces cognitive load and builds audience ritual.',
      'Transparency is a competitive advantage in a space full of vague promises.',
      'A system that isn\'t visible isn\'t fully doing its conversion work.',
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug)
}

export function getNextCaseStudy(currentSlug: string): CaseStudy {
  const idx = caseStudies.findIndex(cs => cs.slug === currentSlug)
  return caseStudies[(idx + 1) % caseStudies.length]
}
