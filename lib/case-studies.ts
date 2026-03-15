// lib/case-studies.ts

export type FrictionType = 'clarity' | 'identity' | 'trust' | 'attention' | 'decision'

export type NarrativeStory = 'Rebellion' | 'Mastery' | 'Intelligence' | 'Freedom' | 'Simplicity' | 'Wealth'

export interface LearningStep {
  from: string
  to: string
  how: string
}

export interface CaseStudy {
  slug: string
  index: string
  name: string
  outcome: string
  color: string
  image: string
  headline: string
  subhead: string
  meta: {
    platforms: string[]
    offers: string[]
    audienceType: string
    audienceSize: string
  }
  situation: string[]
  situationQuote: string
  coreChallenge: string
  frictionTypes: FrictionType[]
  behavioralMoves: {
    attention: string[]
    cognitiveAnchors: string[]
    knowledgePackaging: string[]
    authoritySignals: string[]
  }
  learningFlow: [LearningStep, LearningStep, LearningStep, LearningStep]
  narrativeSystem: {
    stories: NarrativeStory[]
    dominant: NarrativeStory
    description: string
    quote: string
  }
  whatWorks: string[]
  missedOpportunities: string[]
  curiosityUpgrade: string[]
  founderTakeaways: string[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'dan-koe',
    index: '01',
    name: 'Dan Koe',
    outcome: 'Authority',
    color: 'var(--tang)',
    image: '/images/dan-koe.jpg',
    headline: 'How Dan Koe Engineers Authority',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['X / Twitter (~800K)', 'YouTube (~1M)', 'Newsletter (~200K)'],
      offers: ['The 2-Hour Writer', 'Modern Mastery', 'Digital Economics'],
      audienceType: 'Creators, solopreneurs, builders seeking depth',
      audienceSize: '2M+ across platforms',
    },
    situation: [
      'Dan Koe operates in the most crowded vertical on the internet — self-improvement for aspiring creators. Yet he has carved a distinct position by refusing to compete on tactics.',
      'His market play is philosophical authority. While competitors optimize for hooks and hacks, Koe packages complex ideas about work, identity, and economics into a coherent worldview. The result: audiences don\'t follow him for tips. They follow him for a framework for living.',
      'His product ecosystem reflects this. The 2-Hour Writer teaches output systems. Digital Economics maps the opportunity. Modern Mastery is the integrating container. Each product trains a specific cognitive skill while reinforcing the same core belief: one focused person can outperform a team.',
      'The sophistication of his audience is high. They have already consumed Atomic Habits and The 4-Hour Workweek. Koe\'s authority comes from being the person who can synthesize what all of that means — and where to go next.',
    ],
    situationQuote: 'He doesn\'t sell productivity. He sells a philosophy of self-directed evolution — and then teaches you the craft to execute it.',
    coreChallenge: 'The core friction for Koe\'s audience is clarity — specifically, the gap between inspiration and action. His ideas are dense and require active engagement. A reader can feel illuminated after a thread and have no idea what to do differently on Monday. The cognitive load of synthesis is high, and the conversion path from idea-consumer to course-buyer depends entirely on the audience resolving that gap themselves.',
    frictionTypes: ['clarity', 'identity'],
    behavioralMoves: {
      attention: [
        '"Most people will never..." — opens by naming the failure state',
        'Long-form threads that reward patience — filter for high-attention audience',
        'Philosophical provocation as hook: "Work is the new meditation"',
        'Consistent aesthetic: minimal design, no thumbnails, no noise',
      ],
      cognitiveAnchors: [
        '"The 1-person business" — makes solo operation feel architectural',
        '"Infinite leverage" — reframes digital output as asymmetric asset',
        '"Deep work is a spiritual practice" — elevates productivity to identity',
        '"Most people are optimizing for the wrong thing" — creates in-group',
      ],
      knowledgePackaging: [
        'Thread → newsletter essay → course — each layer adds depth to the same idea',
        'Ideas presented as frameworks with named components (leverage, depth, craft)',
        'Products teach skills that make the philosophy executable',
        'Free content is indistinguishable in quality from paid — trust driver',
      ],
      authoritySignals: [
        'Transparent revenue milestones ($1M, $2M) — proof the model works',
        'Long-form thinking published daily — signals genuine intellectual depth',
        'Zero paid ads — organic authority signals independence',
        'Building in public: shares the system, not just the outcome',
      ],
    },
    learningFlow: [
      { from: 'Skeptical', to: 'Curious', how: 'A thread challenges a belief they already hold — low risk, high novelty' },
      { from: 'Curious', to: 'Aligned', how: 'Newsletter essay gives them a framework that explains something confusing about their own life' },
      { from: 'Aligned', to: 'Convinced', how: 'Multiple touchpoints confirm: this person\'s worldview is consistent and earns results' },
      { from: 'Convinced', to: 'Committed', how: 'Product solves the specific execution gap the content revealed' },
    ],
    narrativeSystem: {
      stories: ['Mastery', 'Intelligence', 'Freedom'],
      dominant: 'Mastery',
      description: 'Koe\'s primary narrative is mastery — specifically, the idea that depth of skill and clarity of thought compound into extraordinary leverage over time. Freedom is the promised outcome, but mastery is the path. Intelligence is the social signal that makes both legible.',
      quote: 'The person who reads one book deeply outperforms the person who reads fifty books shallowly.',
    },
    whatWorks: [
      'Idea repetition across formats (thread → essay → product) builds deep cognitive imprints',
      'Philosophical positioning removes him from commodity comparison',
      'Product ladder maps cleanly to audience sophistication tiers',
      'Long-form signals high IQ to a high-IQ audience — filters perfectly',
      'Revenue transparency converts authority into social proof without bragging',
    ],
    missedOpportunities: [
      'Framework visualization is largely absent — his ideas are dense and would benefit from diagrams',
      'The journey from free content to first purchase has no explicit bridge — relies on audience self-motivation',
      'No community infrastructure — audience loyalty is high but untethered',
      'Concept naming is strong but inconsistent — some core ideas lack persistent labels across products',
    ],
    curiosityUpgrade: [
      'Visualize the frameworks — give each mental model a diagram that makes the architecture visible at a glance',
      'Add an explicit conversion sequence: after each long-form essay, a 3-sentence "what to do with this" bridge',
      'Map the product ladder visually on the site — show audience exactly where they are and what\'s next',
      'Build a concept glossary — one place where all named ideas live, cross-referenced across products',
    ],
    founderTakeaways: [
      'A coherent worldview is a moat — it\'s harder to copy than tactics',
      'Filtering for a high-attention audience creates smaller but far more loyal cohorts',
      'Revenue transparency is an authority signal when the product delivers',
      'Free content at product quality removes the trust barrier entirely',
      'Ideas need visual architecture — prose alone leaves comprehension to chance',
    ],
  },
  {
    slug: 'ali-abdaal',
    index: '02',
    name: 'Ali Abdaal',
    outcome: 'Trust',
    color: 'var(--lav)',
    image: '/images/ali-abdaal.jpg',
    headline: 'How Ali Abdaal Engineers Trust',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['YouTube (~5.5M)', 'Newsletter (~500K)', 'Podcast (Top 50)'],
      offers: ['Part-Time YouTuber Academy', 'Feel-Good Productivity (book)', 'Productivity Lab'],
      audienceType: 'Students, aspiring creators, professionals optimizing their lives',
      audienceSize: '6M+ across platforms',
    },
    situation: [
      'Ali Abdaal built the largest productivity creator brand in the world by treating trust as the primary product. His background as a Cambridge-trained doctor gives him a credibility baseline that no amount of marketing can manufacture.',
      'His market position is evidence-based self-improvement — the reasonable, kind, science-adjacent alternative to the hustle-culture playbook. Where others demand sacrifice, Abdaal offers permission: to enjoy the process, to go at your pace, to feel good doing the work.',
      'His business model is a masterclass in top-of-funnel generosity. YouTube videos average 15–25 minutes of substantive value. The newsletter deepens the relationship. The book scales trust globally. The course monetizes the most committed learners.',
      'Audience sophistication is deliberately broad — he meets students, early professionals, and career-changers where they are, speaking in plain language even about complex cognitive science.',
    ],
    situationQuote: 'Trust at scale requires being consistently, demonstrably right about things that matter to your audience\'s daily life.',
    coreChallenge: 'Abdaal\'s central friction is trust maintenance across a massive and heterogeneous audience. With 5M+ subscribers, every piece of advice must survive scrutiny from millions of people with wildly different contexts. The risk of misalignment — advice that doesn\'t transfer — is high. He manages this by anchoring to evidence, framing everything as experiments, and being transparent about what he doesn\'t know.',
    frictionTypes: ['trust', 'clarity'],
    behavioralMoves: {
      attention: [
        '"I\'m a doctor, and here\'s what I found..." — credibility hook before the insight',
        'Question-based titles that mirror audience\'s own inner dialogue',
        'Thumbnail: direct eye contact + single clear claim — trust before click',
        'Video intros that prove value in the first 90 seconds before the premise',
      ],
      cognitiveAnchors: [
        '"Feel-good productivity" — reframes effort as enjoyable, not punishing',
        '"Evidence-based" — signals rigor without requiring the audience to verify',
        '"Second brain" — makes knowledge management feel architectural and prestigious',
        '"You don\'t have to be miserable to be productive" — permission structure',
      ],
      knowledgePackaging: [
        'YouTube: long-form, structured like a lecture with clear sections and summaries',
        'Book: synthesizes YouTube content into a single, gift-able, shareable object',
        'Course: live cohort with accountability — converts knowledge to behavior',
        'Newsletter: personal, reflective, lower production — builds intimacy at scale',
      ],
      authoritySignals: [
        'Medical degree mentioned organically, not performatively',
        'Academic citations and book references in every video',
        'Transparent income reports — shows the model working',
        'Publicly updated "what I use" lists — shows ongoing practice, not theory',
      ],
    },
    learningFlow: [
      { from: 'Curious', to: 'Engaged', how: 'Thumbnail + title resolves to a video that over-delivers on the premise' },
      { from: 'Engaged', to: 'Trusting', how: 'Advice is tested in real life — it works — credibility is earned through experience' },
      { from: 'Trusting', to: 'Loyal', how: 'Newsletter creates parasocial intimacy — audience feels they know him, not just his content' },
      { from: 'Loyal', to: 'Buyer', how: 'Course offer arrives at the natural next-step moment — audience was already looking for more' },
    ],
    narrativeSystem: {
      stories: ['Mastery', 'Simplicity', 'Freedom'],
      dominant: 'Simplicity',
      description: 'Abdaal\'s master narrative is that productivity doesn\'t have to be hard — and that simplicity, applied with evidence, produces better results than complexity applied with discipline. The Simplicity narrative is the emotional permission structure that makes everything else land.',
      quote: 'The most effective system is the one you\'ll actually use.',
    },
    whatWorks: [
      'Medical credential creates an asymmetric trust baseline competitors can\'t replicate',
      'Permission-based framing ("you don\'t have to be miserable") removes identity resistance',
      'Long-form YouTube trains high-attention habits — audience learns to spend time with him',
      'Book creates an artifact that audiences gift — extends trust network organically',
      'Consistent visual identity (thumbnail style, warm palette) builds pattern recognition at scale',
    ],
    missedOpportunities: [
      'Framework visualization is underused — most ideas are prose-only with no visual architecture',
      'The product ladder could be made more explicit — many audience members don\'t know what\'s available beyond YouTube',
      'Newsletter and YouTube feel siloed — cross-content references would deepen engagement',
      'Cognitive overload risk in long-form videos — section navigation tools rarely used',
    ],
    curiosityUpgrade: [
      'Build a visual "system map" — show how YouTube → newsletter → book → course connect as a learning journey',
      'Add visual summaries to each video: a single diagram capturing the core framework',
      'Create explicit onramp pathways by audience type (student / professional / creator) — removes decision friction',
      'Use the newsletter as a lab report for YouTube ideas — creates feedback loop and deepens both channels',
    ],
    founderTakeaways: [
      'An un-fakeable credential is a permanent moat — develop yours and make it visible',
      'Permission structures ("you\'re allowed to enjoy this") remove the biggest hidden resistance',
      'Trust compounds — each piece of advice that works in someone\'s life earns the next',
      'Physical products (books) extend your reach into networks you\'ll never directly touch',
      'Breadth is a moat when paired with depth — but you need systems to maintain both',
    ],
  },
  {
    slug: 'justin-welsh',
    index: '03',
    name: 'Justin Welsh',
    outcome: 'Demand',
    color: 'var(--must)',
    image: '/images/justin-welsh.jpg',
    headline: 'How Justin Welsh Engineers Demand',
    subhead: 'A behavioral design and knowledge-architecture analysis.',
    meta: {
      platforms: ['LinkedIn (~600K)', 'Newsletter (~220K)', 'X / Twitter (~180K)'],
      offers: ['LinkedIn OS', 'Content OS', 'The Operating System'],
      audienceType: 'Aspiring solopreneurs, corporate professionals planning an exit',
      audienceSize: '1M+ across platforms',
    },
    situation: [
      'Justin Welsh is the most visible architect of the solopreneur content stack on LinkedIn. He built a $5M+ one-person business by making the mechanics of that build radically visible — and then selling the system he used.',
      'His position is operational transparency. While most creators teach what to do, Welsh teaches exactly how: which tools, which sequences, which posts, which offers. The specificity is the product.',
      'His audience is predominantly corporate professionals who feel trapped and are actively planning an exit. They don\'t need to be convinced the solopreneur path is possible. Welsh\'s job is to remove the perceived skill gap between their current self and the person who can execute that path.',
      'His content machine is notable for its efficiency. He writes every weekday, maintains a strict format, and achieves extraordinary consistency — modeling the very operating discipline he sells.',
    ],
    situationQuote: 'Welsh doesn\'t sell inspiration. He sells the specific operational knowledge that turns aspiration into execution.',
    coreChallenge: 'The dominant friction Welsh faces is decision friction — his audience knows they want to leave, knows they want to build online, but is paralyzed by the number of decisions between here and there. He resolves this with extreme specificity: exact post formats, exact posting frequencies, exact tool stacks. The system removes decisions by making each choice obvious.',
    frictionTypes: ['attention', 'decision'],
    behavioralMoves: {
      attention: [
        'Specific numbers in the hook: "$5M one-person business" cuts through vague success claims',
        'Problem-first opening: names the frustration before offering the frame',
        'Consistent post format (hook / insight / lesson) trains audience to expect value',
        'LinkedIn algorithm mastery — optimal post timing, format, and engagement hooks',
      ],
      cognitiveAnchors: [
        '"LinkedIn OS" — turns content strategy into an operating system (prestigious, architectural)',
        '"Solopreneur" — creates a distinct identity category that audience self-selects into',
        '"One-person business" — normalizes solo scale, makes it feel achievable not lonely',
        '"$5M" — the specific number is the anchor, not the round number',
      ],
      knowledgePackaging: [
        'Daily LinkedIn posts: single insight, tight format — trains fast consumption',
        'Newsletter: goes deeper on the same ideas — extends relationship beyond feed',
        'Products are pure how-to: step-by-step, tool-specific, format-specific',
        'Free content IS the product preview — posts are chapters; course is the book',
      ],
      authoritySignals: [
        'Specific revenue figures cited consistently ($5M, not "millions")',
        'Process transparency: shows the actual workflow, not just the results',
        'Track record with named clients — makes success feel reproducible',
        'LinkedIn follower count visible and growing — social proof compounds daily',
      ],
    },
    learningFlow: [
      { from: 'Scrolling', to: 'Stopped', how: 'A specific number or named pain point matches their exact internal frustration' },
      { from: 'Stopped', to: 'Following', how: 'Three posts in a row deliver a useful, specific insight — pattern recognition triggers follow' },
      { from: 'Following', to: 'Trusting', how: 'Newsletter deepens the relationship — more context, more vulnerability, more specificity' },
      { from: 'Trusting', to: 'Buying', how: 'Product offer arrives as the logical next step to a system they\'ve already started building mentally' },
    ],
    narrativeSystem: {
      stories: ['Freedom', 'Mastery', 'Wealth'],
      dominant: 'Freedom',
      description: 'Welsh\'s dominant narrative is escape and freedom — the specific, operational freedom of building a business that doesn\'t require a team, an office, or a boss. Wealth is the evidence that freedom is real. Mastery is the path. But freedom is the emotional engine.',
      quote: 'The most dangerous thing you can do is build someone else\'s dream with your best hours.',
    },
    whatWorks: [
      'Extreme format consistency trains audience attention — they know exactly what they\'re getting',
      'Specificity (exact numbers, exact tools) removes the ambiguity that kills execution',
      'Daily posting compounds reach while modeling the discipline he sells',
      'Product names (LinkedIn OS, Content OS) make abstract skills feel like concrete systems',
      'The solopreneur identity category creates strong community cohesion without a community platform',
    ],
    missedOpportunities: [
      'Visual system is minimal — the "OS" framing would benefit enormously from a visible architecture diagram',
      'No explicit learning path visible on site — buyers have to infer which product to start with',
      'Narrative is freedom-focused but rarely explores the psychological transition from employee to owner',
      'Newsletter content and LinkedIn content are largely parallel, not compounding — a sequential design would deepen each',
    ],
    curiosityUpgrade: [
      'Build a visual "Operating System" diagram — make the architecture of his method visible, not just described',
      'Create an explicit decision tree for new visitors: "Which OS do you need?" — eliminates purchase friction',
      'Develop a "Transition Map" — visual journey from corporate employee to solopreneur, with his products as waypoints',
      'Design the newsletter as a layer beneath LinkedIn, not a mirror — each deepens the other\'s ideas',
    ],
    founderTakeaways: [
      'Specificity is the premium — "exactly $5M" converts better than "millions"',
      'Naming your system (OS, Method, Framework) elevates it from advice to architecture',
      'Daily repetition is a trust-building machine — consistency at scale is its own authority signal',
      'Freedom is the most powerful emotional hook for an audience that feels trapped',
      'Decision removal is a product feature — the less your buyer has to figure out, the faster they act',
    ],
  },
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find(cs => cs.slug === slug)
}
