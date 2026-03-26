// src/data/articles.ts

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
  pullQuote?: string;
}

export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: number;
  order: number;
  sections: ArticleSection[];
}

export const articles: Article[] = [
  {
    slug: 'the-accidental-educator',
    title: 'The Accidental Educator',
    subtitle: 'Why every creator with an audience is running an unstructured classroom.',
    category: 'LEARNING SCIENCE',
    readTime: 12,
    order: 1,
    sections: [
      {
        id: 'the-classroom-you-didnt-build',
        heading: 'The Classroom You Didn\'t Build',
        paragraphs: [
          'When you published your first piece of content, you made an implicit promise. You offered a signal to the world: I know something. Come learn from me.',
          'The problem is that you didn\'t design a classroom. You designed a stage. And stages and classrooms serve fundamentally different purposes. A stage is built for performance — for capturing attention, for demonstrating skill, for building an audience. A classroom is built for transfer — for taking what lives in one mind and reliably getting it into another.',
          'Every creator with a significant audience is running an unstructured classroom. The students are real. The learning is happening. But the curriculum was never designed. And that gap — between the teaching that is occurring and the teaching that was intended — is costing you more than you know.',
        ],
      },
      {
        id: 'how-parasocial-learning-works',
        heading: 'How Parasocial Learning Works',
        paragraphs: [
          'Your audience is not passively consuming your content. They are actively constructing a mental model of the world from it. This is what cognitive scientists call parasocial learning: the process by which an audience member extracts knowledge, beliefs, and frameworks from a one-sided relationship with a creator.',
          'The research on parasocial learning is striking. Audiences who follow creators over time build deep, interconnected mental models — often more durable than what they acquire in formal education. The reason is engagement: when you choose to follow someone, you are selecting for relevance. Every piece of content you produce is pre-filtered for personal meaning by the very act of subscription.',
          'This is powerful. It is also dangerous. Because parasocial learning is shaped almost entirely by what you choose to show, in what order, with what framing. Your audience is building a worldview from your content. The question is whether you are building it intentionally.',
        ],
      },
      {
        id: 'the-curriculum-problem',
        heading: 'The Curriculum Problem',
        paragraphs: [
          'Most creators think about their content calendar in terms of output: what will I publish, when, and on what topic. This is a production mindset. It asks: what can I make? It does not ask: what should they learn?',
          'The difference matters enormously. A curriculum is a learning architecture. It is built around outcomes — what does this person need to understand, believe, and be able to do at the end of this sequence? A content calendar is a production schedule. It is built around availability — what can I publish next week that my audience will engage with?',
          'When you design only for engagement, you optimize for the wrong outcome. Engagement is correlated with novelty, with controversy, with validation. Transformation requires something harder: the right concept, at the right time, connected to what the learner already knows. These are not the same optimization target. Most creators never notice the gap because engagement is measurable and transformation is not.',
        ],
        pullQuote: 'The difference between a curriculum and a content calendar is intent. One is designed to produce transformation. The other is designed to produce engagement.',
      },
      {
        id: 'what-deliberate-teaching-looks-like',
        heading: 'What Deliberate Teaching Looks Like',
        paragraphs: [
          'Deliberate teaching starts with a learning outcome. Not "what topic should I cover" but "what should the person who consumes this be able to do, think, or feel that they could not before?" This is a harder question. It requires you to have a theory of your audience — who they are, what they already know, where the gaps are.',
          'The best creators do this intuitively. They sequence their content so each piece builds on the last. They use consistent language so concepts compound rather than fragment. They return to core ideas from different angles, each time adding depth. This is not accidental. It is the difference between someone who writes and someone who teaches.',
          'Adult learning theory gives us the concept of scaffolding: the temporary structure that supports a learner until they can carry the knowledge themselves. Great content scaffolds. It gives the learner just enough to stand on while reaching for the next level. Mediocre content dumps — it presents information without architecture, leaving the learner to build their own structure or abandon the attempt.',
        ],
      },
      {
        id: 'designing-the-learning',
        heading: 'Designing the Learning, Not Just the Content',
        paragraphs: [
          'If you have an audience of any size, you are already a teacher. The question is whether you are a deliberate one. Becoming deliberate requires three things: a clear theory of your audience, a sequence that compounds rather than fragments, and a feedback mechanism that tells you whether the learning is actually happening.',
          'The feedback mechanism is the hardest part. Unlike a formal classroom, you do not give tests. But you do have signals: the questions your audience asks, the misunderstandings they reveal, the transformations they describe. These are your assessment data. Most creators treat them as social proof. Deliberate teachers treat them as curriculum feedback.',
          'The creator economy is, at its core, an education economy. What people pay for — subscriptions, courses, communities, coaching — is transformation. They are paying to become someone they are not yet. The creators who understand this do not just produce content. They design learning experiences. And the difference in outcomes, for both creator and audience, is enormous.',
        ],
      },
    ],
  },
  {
    slug: 'negative-space-as-active-agent',
    title: 'Negative Space as Active Agent',
    subtitle: 'What you leave out is the design.',
    category: 'DESIGN THEORY',
    readTime: 8,
    order: 2,
    sections: [
      {
        id: 'the-shape-of-absence',
        heading: 'The Shape of Absence',
        paragraphs: [
          'In 1915, Kazimir Malevich exhibited "Black Square" — an oil painting of a black square on a white ground. Critics were baffled and outraged. What was he saying? What was there to see? The answer was everything: the square meant nothing by itself. It was the white space around it that gave the square its presence, its gravity, its meaning.',
          'Negative space — the empty areas in a composition — is not the absence of design. It is design. The gap between elements, the silence between notes, the pause between sentences: these are not voids waiting to be filled. They are active forces that shape everything around them.',
          'Most designers, writers, and creators understand this intellectually and ignore it in practice. The impulse to fill space is almost universal. More information feels more valuable. More elements feel more thorough. The result is noise — compositions where everything is competing for attention and nothing wins.',
        ],
      },
      {
        id: 'how-restraint-communicates',
        heading: 'How Restraint Communicates',
        paragraphs: [
          'Consider two websites. The first fills every pixel: a hero banner, a navigation bar, three feature blocks, a testimonial carousel, a case study grid, a newsletter popup. The second shows a single sentence centered on a white page, a small navigation above, and nothing else. Which one communicates more confidence?',
          'The dense site is anxious. It is trying to convince you of too many things at once, which suggests it is not certain about any of them. The sparse site trusts that what is present is enough — which suggests the person who made it knows exactly what matters. Restraint is a credibility signal. It says: I edited. I chose. I know what is essential.',
          'This applies equally to writing. The sentence that has been compressed five times contains more force than the paragraph that was written once. Every word that remains carries the weight of every word that was cut. The reader feels this, even if they cannot name it.',
        ],
        pullQuote: 'Restraint is not poverty of expression. It is the most precise form of it — the decision to withhold until the remaining elements carry more weight.',
      },
      {
        id: 'the-trust-signal',
        heading: 'The Trust Signal',
        paragraphs: [
          'There is a behavioral economics concept called costly signaling: signals that are credible precisely because they are expensive to fake. Physical fitness signals health because it requires real effort. A sparse portfolio signals taste because it requires ruthless editing — the willingness to exclude your second-best work.',
          'When a brand uses negative space deliberately, it sends a costly signal. It says: we could have filled this. We chose not to. That choice communicates resources, judgment, and confidence. Luxury brands have known this for decades. The product is rarely the centerpiece. The space around it is.',
          'For creators, the trust signal works the same way. The newsletter that is short because it is dense is more trustworthy than the newsletter that is long because it is comprehensive. Length without necessity signals insecurity. Brevity with density signals mastery.',
        ],
      },
      {
        id: 'when-silence-becomes-strategy',
        heading: 'When Silence Becomes Strategy',
        paragraphs: [
          'The most powerful applications of negative space are strategic, not decorative. They are deployed to create tension — to hold the reader, viewer, or user in productive discomfort until the resolution arrives. A paragraph break before the key sentence. A page turn before the answer. A beat of silence before the punchline.',
          'Tension is the mechanism of engagement. Not novelty, not controversy, not emotion — tension. The gap between what is present and what is implied. Negative space is the physical expression of that gap. When you leave space, you invite inference. Inference is the highest form of engagement, because it requires the reader to complete the meaning themselves.',
          'The final argument for negative space is the most practical one: it is free. Adding elements costs attention, cognitive load, and time. Removing them costs nothing except the willingness to trust that less is enough. In most cases — not all, but most — it is more than enough. It is the whole thing.',
        ],
      },
    ],
  },
  {
    slug: 'the-curiosity-loop-protocol',
    title: 'The Curiosity Loop Protocol',
    subtitle: 'How to engineer sustained curiosity.',
    category: 'METHODOLOGY',
    readTime: 15,
    order: 3,
    sections: [
      {
        id: 'the-problem-with-passion',
        heading: 'The Problem With Passion',
        paragraphs: [
          'We are taught that curiosity is a feeling. You either have it about a subject or you do not. The advice that follows from this is always the same: follow your passion, find what lights you up, do what you love. This advice sounds wise. It is also largely useless.',
          'The problem is that passion is a lagging indicator, not a leading one. You do not discover passion and then pursue the subject. You pursue the subject — often through difficulty, boredom, and frustration — and passion emerges as a consequence of competence. Cognitive scientists call this the "passion hypothesis," and the evidence for it is weak. The evidence for the competence-first model is considerably stronger.',
          'If you wait to feel curious, you will wait a long time. Curiosity is not a state that precedes engagement. It is a state that follows a specific kind of engagement — the kind that creates open questions you cannot easily close.',
        ],
      },
      {
        id: 'what-curiosity-actually-is',
        heading: 'What Curiosity Actually Is',
        paragraphs: [
          'The most useful definition of curiosity is not emotional but structural: curiosity is the state of having an open question whose answer is within reach but not yet grasped. It is produced by a gap — specifically, the information gap described by Carnegie Mellon psychologist George Loewenstein. When you know something is knowable but you do not know it, you experience a pull toward closure that feels like curiosity.',
          'This is critical because it means curiosity is engineerable. If curiosity follows from information gaps, and information gaps can be created deliberately, then curiosity is not a personality trait or a talent. It is a technique. One you can practice, refine, and systematize.',
          'The felt experience of curiosity — the itch, the pull, the slightly-uncomfortable need to know — is the cognitive system registering that a gap exists and that the cost of closing it is worth paying. Your job is not to find topics that produce this experience naturally. Your job is to create the conditions for the gap to form.',
        ],
      },
      {
        id: 'the-loop-mechanics',
        heading: 'The Loop Mechanics',
        paragraphs: [
          'The curiosity loop has five stages: Encounter, Question, Pursuit, Partial Resolution, and Re-opening. What makes it a loop — rather than a line — is the fifth stage. Every answer worth having generates more questions than it closes. The loop sustains itself because real understanding is fractal: the closer you look, the more there is to see.',
          'The Encounter is the initial stimulus — a claim that does not quite fit, an anomaly in a familiar pattern, a question that seems simple but resists easy answer. The Question is the gap forming: the recognition that something is unknown. The Pursuit is the work: reading, thinking, experimenting, asking. Partial Resolution is the satisfying-but-incomplete answer that keeps the loop running. The Re-opening is the discovery that the answer was only the entrance to a deeper question.',
          'Most people experience the loop passively — questions arise, they answer them or abandon them, and curiosity comes and goes unpredictably. The Protocol is about running the loop deliberately: engineering the Encounter, sharpening the Question, structuring the Pursuit, and resisting the temptation of full resolution.',
        ],
        pullQuote: 'A question you can answer immediately is not curious — it is just a lookup. Curiosity requires distance between the question and its resolution.',
      },
      {
        id: 'interruption-as-catalyst',
        heading: 'Interruption as Catalyst',
        paragraphs: [
          'The most counterintuitive finding in curiosity research is the role of interruption. The Zeigarnik effect, first documented by Soviet psychologist Bluma Zeigarnik in 1927, describes the phenomenon where incomplete tasks occupy the mind more persistently than completed ones. Waiters remember unpaid orders better than settled ones. Readers remember cliffhangers better than resolved plots.',
          'Applied to the curiosity loop, this means that the moment of suspension — the deliberate stopping before the answer is reached — is not a failure of discipline but a technique of engagement. When you stop pursuing before the gap closes, the gap stays open. The open question continues working in the background, recruiting attention and generating associations even when you are not consciously focused on it.',
          'This is why sleep is so productive for hard problems. It is not that the unconscious works on the problem in a mystical sense. It is that the open question continues to pattern-match against incoming information — memories, conversations, sensory input — and occasionally produces a connection that the focused mind, narrowed by deliberate attention, could not have generated. The interruption is the mechanism. The open question is the engine.',
        ],
      },
      {
        id: 'building-your-loop',
        heading: 'Building Your Loop',
        paragraphs: [
          'To build a deliberate curiosity loop, start with anomaly collection. An anomaly is anything that does not fit your current model — a finding that contradicts your assumptions, a question you cannot answer confidently, a pattern that defies explanation. Keep a running list. The quality of your loop depends on the quality of your anomalies. Weak anomalies produce weak questions. Strong anomalies produce questions that sustain months of investigation.',
          'Once you have a question worth pursuing, structure the pursuit in phases rather than sessions. A phase has a clear scope — a specific sub-question to answer, a specific source to exhaust — and ends with a written summary of what you found and, crucially, what it opened up. The written summary is not optional. Writing forces precision. Precision reveals what you do not actually understand yet. The gaps you find in writing are the seeds of the next phase.',
          'Resist the temptation to declare a question answered. The closure instinct — the desire to resolve the information gap and return to cognitive ease — is the enemy of deep curiosity. Every time you feel the loop closing, ask: what would make this wrong? What am I not seeing? What would the most informed skeptic say? These questions reopen the gap and keep the loop running.',
        ],
      },
      {
        id: 'maintaining-tension',
        heading: 'Maintaining Tension',
        paragraphs: [
          'The curiosity loop is not comfortable. Sustained curiosity requires sustained discomfort — the willingness to live with open questions, partial understanding, and genuine uncertainty. Most people do not sustain curiosity because they resolve their questions too quickly, settling for the first adequate answer rather than the best one. The adequate answer closes the gap. The best answer opens it wider.',
          'The technique for maintaining tension is deliberate incompletion. Stop reading before the chapter ends. Stop a research session before you feel finished. Keep one thread visibly unresolved at the end of every work session. The unresolved thread is not procrastination. It is a hook — a specific, concrete pull that guarantees re-engagement the next day. Without it, re-engagement requires willpower. With it, it requires only remembering where you left off.',
          'The final stage of the Protocol is not resolution but integration. The question that has been running for months accumulates associations, connections, and implications that a freshly-opened question cannot have. When the loop has run long enough, the answer you find is not just the answer to the original question. It is a new framework — a new way of seeing a whole domain. This is what compounding curiosity looks like. It is worth building.',
        ],
      },
    ],
  },
  {
    slug: 'eureka-as-practice',
    title: 'Eureka as Practice',
    subtitle: 'Insight isn\'t accidental. It can be cultivated.',
    category: 'PHILOSOPHY',
    readTime: 10,
    order: 4,
    sections: [
      {
        id: 'the-myth-of-sudden-insight',
        heading: 'The Myth of the Sudden Insight',
        paragraphs: [
          'The story goes like this: Archimedes is given a problem — determine whether the king\'s crown is pure gold without melting it down. He thinks about it, cannot solve it, moves on with his life. Then one day he steps into a bath, watches the water rise, and understands. He leaps from the tub, runs naked through the streets of Syracuse, shouting "Eureka!" — I have found it.',
          'This story has shaped our cultural model of insight: sudden, unpredictable, involuntary. A gift from the unconscious to the conscious, arriving fully formed. The myth of the eureka moment suggests that insight is not something you do but something that happens to you. You cannot force it. You can only wait, and hope.',
          'This model is wrong. Not in its facts — something like the bathtub moment probably happened — but in its implications. The eureka moment was not the work. It was the delivery. The work had been happening for weeks, invisibly, in a mind that had been loaded with the right questions and given the right conditions to generate answers.',
        ],
      },
      {
        id: 'what-happens-before-the-eureka',
        heading: 'What Happens Before the Eureka',
        paragraphs: [
          'Cognitive scientists have spent decades studying creative insight, and the picture that emerges is consistent: the eureka moment is the culmination of a preparation phase, an incubation phase, and an illumination phase. The illumination — the flash of insight — is the shortest and most visible stage. It is also the least important in terms of the work required to produce it.',
          'Preparation is the long stage. It involves saturating the mind with the problem: reading everything relevant, thinking from multiple angles, attempting solutions and noticing why they fail. The preparation phase builds what cognitive scientists call the problem representation — the internal model of the problem that the unconscious will later manipulate. A poorly-formed problem representation produces no insight. A rich, detailed, well-loaded problem representation creates the conditions for the insight to appear.',
          'The incubation phase follows: a period of not consciously working on the problem. This is not rest. It is the period during which the unconscious system — faster, less constrained, and more associative than deliberate conscious thought — works through the problem space in ways the focused mind cannot. The eureka is the moment this work surfaces to consciousness. The work itself happened earlier, invisibly.',
        ],
      },
      {
        id: 'incubation-is-not-idleness',
        heading: 'Incubation Is Not Idleness',
        paragraphs: [
          'The incubation phase is widely misunderstood. It looks like idleness — you are not working on the problem. You are walking, sleeping, showering, talking about something else entirely. But the problem is still active. The open question loaded during preparation continues to pattern-match against every experience, every conversation, every fragment of sensory input. The mind is searching, constantly, for the piece that fits.',
          'The cognitive mechanism behind this is the default mode network — the brain\'s activity during non-focused periods that, far from being idle, is highly active and associated with memory consolidation and the generation of novel connections between previously unrelated concepts. It does its best work when the spotlight of deliberate attention is off. This is why insights rarely come at the desk. They come in the shower, on the walk, at the edge of sleep.',
          'Understanding this reframes what preparation means. You are not just accumulating information — you are loading the default mode network with the material it needs to generate connections. The quality of the incubation depends entirely on the quality of the preparation. You cannot incubate a problem you have not deeply worked.',
        ],
        pullQuote: 'Archimedes was not idle in the bath. He had been working the problem for weeks. The bath was simply the first moment he stopped trying.',
      },
      {
        id: 'designing-for-discovery',
        heading: 'Designing for Discovery',
        paragraphs: [
          'If the eureka is the output of a process, the process can be designed. Preparation, incubation, and illumination are not random events — they are phases that can be structured, sequenced, and optimized.',
          'Preparation is improved by specificity and documentation. Vague questions produce vague insights. A precisely-formulated question — one that captures exactly what is unknown and what constraints the answer must satisfy — gives the unconscious a precise search target. Writing out the problem is not just note-taking. It is problem specification. Every time you articulate what you do not understand yet, you are sharpening the query the default mode network will run during incubation.',
          'Incubation is improved by genuine disengagement. Checking email, scrolling social media, or engaging in any attention-demanding activity does not produce real incubation — it substitutes one focused demand for another. True incubation requires low-demand activity: walking, exercising, doing repetitive physical tasks. The key is that conscious attention must be genuinely unoccupied. A long run, a conversation about something else entirely — these are incubation-compatible. Meetings and notifications are not.',
        ],
      },
      {
        id: 'the-practice',
        heading: 'The Practice',
        paragraphs: [
          'Eureka as a practice means building the cycle into your work deliberately. It means front-loading preparation: spending the first hours with a new problem saturating yourself in it before attempting solutions. It means ending work sessions with an unresolved question rather than a tidy summary, so that incubation begins immediately. It means creating protected space for low-demand activity — not as a reward for productivity but as an integral part of the productive process.',
          'The most practical intervention is also the simplest: write the question down before you stop working. Not the answer, not the progress, not what you accomplished — the question. The specific, concrete thing you do not yet understand. Write it on paper, at the top of tomorrow\'s notes. This act does two things: it sharpens the preparation phase by forcing you to specify the gap, and it primes the incubation phase by giving the default mode network a clear brief.',
          'The eureka is not a stroke of luck. It is the audible crack of a problem that has been under pressure long enough. The preparation builds the pressure. The incubation holds it. Your job is not to wait for the crack. Your job is to load the system correctly and trust the process. The insight will come. And when it does, you will know exactly what it means.',
        ],
      },
    ],
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find(a => a.slug === slug);
}

export function getPrevNext(slug: string): { prev: Article | null; next: Article | null } {
  const article = getArticleBySlug(slug);
  if (!article) return { prev: null, next: null };
  const prev = articles.find(a => a.order === article.order - 1) ?? null;
  const next = articles.find(a => a.order === article.order + 1) ?? null;
  return { prev, next };
}
