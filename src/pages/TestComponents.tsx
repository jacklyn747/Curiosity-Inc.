import React from 'react';
import { SectionLabel } from '../components/typography/SectionLabel';
import { DisplayHeading } from '../components/typography/DisplayHeading';
import { Scaffold } from '../components/visualizations/Scaffold';
import { FlowPulse } from '../components/visualizations/FlowPulse';
import { DeltaBridge } from '../components/visualizations/DeltaBridge';
import { Lens } from '../components/visualizations/Lens';
import { GridReveal } from '../components/visualizations/GridReveal';
import { ConvergenceMap } from '../components/visualizations/ConvergenceMap';

export const TestComponents: React.FC = () => {
  return (
    <div className="test-page pt-40 pb-32 px-6 md:px-12 max-w-[1200px] mx-auto flex flex-col gap-40">
      
      {/* Component 1: THE SCAFFOLD (Phase 3) */}
      <section className="flex flex-col gap-12">
        <div className="max-w-[800px]">
          <SectionLabel>THE PATTERN</SectionLabel>
          <DisplayHeading as="h2" className="mt-6">
            You have an audience. You don't have a learning experience.
          </DisplayHeading>
        </div>
        
        <Scaffold 
          bands={[
            {
              label: '01 — STATIC CONSUMPTION',
              accentColor: 'structure',
              content: 'Your audience watches. They nod. They save your post. They don\'t change. You\'re producing content. You\'re not producing transformation.',
              detail: 'Architecture: Content without transformation is just noise. We restructure information to produce behavior change via active intent.'
            },
            {
              label: '03 — ALGORITHMIC HUNGER',
              accentColor: 'transformation',
              content: 'Your growth plateaued because algorithms reward what\'s new. Your audience needs what\'s deep. You keep feeding the algorithm. Your audience stays hungry.',
              detail: 'Architecture: Depth creates defensibility. We build systems that reward deep engagement over shallow reach, creating compound value.'
            }
          ]} 
        />
      </section>

      {/* Component 2: THE FLOW PULSE (Phase 3) */}
      <section className="flex flex-col gap-12">
        <div className="max-w-[800px]">
          <SectionLabel>THE INSIGHT</SectionLabel>
          <DisplayHeading as="h2" accent="Accidental" className="mt-6">
            Every creator with an audience is an Accidental educator.
          </DisplayHeading>
          <p className="body-text mt-8 opacity-70">
            Your tutorials. Your frameworks. Your "how I did it" threads. That's not content. That's curriculum. 
            The funnel optimizes for the transaction. Learning architecture optimizes for the transformation.
          </p>
        </div>

        <FlowPulse 
          flows={[
            {
              id: 'funnel-model',
              label: 'The Funnel Model',
              color: 'structure',
              stages: [
                { label: 'Attention', width: 1.0 },
                { label: 'Decision', width: 0.35 },
                { label: 'Action', width: 0.12 }
              ],
              dropoffs: [
                { afterStage: 1.0, label: '72% exit before converting', severity: 0.8 }
              ],
              outputLabel: 'Purchase'
            },
            {
              id: 'learning-architecture',
              label: 'Learning Architecture',
              color: 'transformation',
              stages: [
                { label: 'Attention', width: 1.0 },
                { label: 'Decision', width: 0.85 },
                { label: 'Intention', width: 0.78 },
                { label: 'Capability', width: 0.72 }
              ],
              dropoffs: [
                { afterStage: 3.0, label: '3.2× longer engagement', severity: 0.4 }
              ],
              outputLabel: 'Identity Shift → Purchase'
            }
          ]}
        />
      </section>

      {/* Component 3: THE DELTA BRIDGE (Phase 4) */}
      <section className="flex flex-col gap-16">
        <div className="max-w-[800px]">
          <SectionLabel>PROJECTED ARCHITECTURE</SectionLabel>
          <DisplayHeading as="h2" accent="Projections" className="mt-6">
            Modeled Projections: The Dan Koe Transformation.
          </DisplayHeading>
        </div>

        <DeltaBridge 
          metrics={[
            {
              label: 'Repeat Engagement Rate',
              category: 'Audience Behavior',
              before: '12%',
              after: '38%',
              delta: '+217%',
              magnitude: 0.65
            },
            {
              label: 'Revenue per Subscriber',
              category: 'Business Outcome',
              before: '$0.82',
              after: '$2.62',
              delta: '+220%',
              magnitude: 0.70
            },
            {
              label: 'Identity Language in Community',
              category: 'Transformation Signal',
              before: '4%',
              after: '31%',
              delta: '+675%',
              magnitude: 0.90
            },
            {
              label: 'Time to First Purchase',
              category: 'Conversion Velocity',
              before: '47 days',
              after: '28 days',
              delta: '−40%',
              magnitude: 0.35
            }
          ]}
        />
      </section>

      {/* Component 4: THE LENS (Phase 4) */}
      <section className="flex flex-col items-center gap-12 text-center">
        <div className="max-w-[600px]">
          <SectionLabel className="justify-center">THE FOCAL POINT</SectionLabel>
          <DisplayHeading as="h3" className="mt-6">The Single Multiplier.</DisplayHeading>
        </div>

        <Lens 
          value="3.2×"
          sublabel="PROJECTED LTV MULTIPLIER"
          beforeLabel={["CURRENT", "MODEL"]}
          afterLabel={["ORBITAL", "MODEL"]}
        />
      </section>

      {/* Component 5: THE GRID REVEAL (Phase 4) */}
      <section className="flex flex-col gap-16">
        <div className="max-w-[800px]">
          <SectionLabel>THE LABORATORY</SectionLabel>
          <DisplayHeading as="h2" accent="Experiments" className="mt-6">
            Selected Experiments.
          </DisplayHeading>
        </div>

        <GridReveal 
          items={[
            {
              id: 'dan-koe',
              number: '01',
              category: 'BRAND ARCHITECTURE',
              title: 'Dan Koe',
              subtitle: 'What if 2.3M followers were students, not subscribers?',
              link: '/work/dan-koe-brand-architecture'
            },
            {
              id: 'justin-welsh',
              number: '02',
              category: 'CONVERSION DESIGN',
              title: 'Justin Welsh',
              subtitle: 'Removing the last 1% of friction between insight and action.',
              link: '/work/justin-welsh-conversion-design'
            },
            {
              id: 'tiago-forte',
              number: '03',
              category: 'COGNITIVE INTERFACES',
              title: 'Tiago Forte',
              subtitle: 'The Second Brain already has a curriculum. It just isn\'t built yet.',
              link: '/work/tiago-forte-cognitive-interfaces'
            }
          ]}
        />
      </section>

      {/* Component 6: THE CONVERGENCE MAP (Phase 5) */}
      <section className="flex flex-col items-center gap-16 py-20">
        <div className="max-w-[700px] text-center">
          <SectionLabel className="justify-center">ABOUT</SectionLabel>
          <DisplayHeading as="h2" accent="Ideas" className="mt-6">
            The Constellation of Ideas.
          </DisplayHeading>
          <p className="body-text mt-8 opacity-70 mx-auto">
            Hover to explore the relationships between disciplines that shape our practice.
          </p>
        </div>

        <ConvergenceMap />
      </section>

    </div>
  );
};
