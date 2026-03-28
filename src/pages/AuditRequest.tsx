import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SectionLabel } from '../components/typography/SectionLabel';
import { DisplayHeading } from '../components/typography/DisplayHeading';

interface AuditFormState {
  name: string;
  email: string;
  audienceSize: string;
  primaryPlatforms: string;
  currentBottleneck: string;
  goal: string;
}

export const AuditRequest: React.FC = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<AuditFormState>({
    name: '',
    email: '',
    audienceSize: '',
    primaryPlatforms: '',
    currentBottleneck: '',
    goal: '',
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.name || !form.email || !form.currentBottleneck || !form.goal) {
      // Minimal guardrail; future: replace with inline validation UI.
      window.alert('Please fill in name, email, bottleneck, and goal.');
      return;
    }

    // TODO: Wire to real backend / email workflow.
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 md:px-12">
        <div className="max-w-[640px] w-full text-left space-y-8">
          <SectionLabel>Curiosity Audit</SectionLabel>
          <DisplayHeading as="h1" className="mt-6">
            Your curriculum is now on our desk.
          </DisplayHeading>
          <p className="body-text opacity-70">
            We&apos;ll review your answers and map the first version of your learning
            architecture. Next, book a session so we can walk you through what
            we&apos;re seeing.
          </p>

          <div className="flex flex-col gap-4 mt-8">
            <a
              href="https://calendly.com/your-calendly-link"
              className="inline-flex items-center justify-center px-8 py-3 transition-opacity hover:opacity-80"
              style={{
                borderRadius: 24,
                border: '1px solid var(--color-insight)',
                color: 'var(--color-insight)',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Book your audit session
            </a>

            <a
              href="mailto:jacklyn@curiosityinc.online?subject=Curiosity%20Audit%20Request"
              className="body-text opacity-70 hover:opacity-100 transition-opacity"
              style={{ fontSize: 13 }}
            >
              Prefer email? Send details to{' '}
              <span style={{ color: 'var(--color-insight)' }}>
                jacklyn@curiosityinc.online
              </span>
              .
            </a>

            <button
              type="button"
              onClick={() => navigate('/')}
              style={{
                marginTop: '1.5rem',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--color-context)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              ← Back to The Sanctuary
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6 md:px-12 py-20">
      <form
        onSubmit={handleSubmit}
        className="max-w-[720px] w-full space-y-10"
        aria-label="Request a Curiosity Audit"
      >
        <div className="space-y-6">
          <SectionLabel>Curiosity Audit</SectionLabel>
          <DisplayHeading as="h1" className="mt-6">
            Before we talk, show us the architecture.
          </DisplayHeading>
          <p className="body-text opacity-70 max-w-[540px]">
            A short diagnostic so we can treat your audience like a classroom,
            not a funnel.
          </p>
        </div>

        <div className="w-full h-[0.5px] bg-[rgba(232,230,224,0.1)]" aria-hidden="true" />

        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label className="data-label text-[10px]" htmlFor="name">
              Name *
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-[rgba(232,230,224,0.2)] px-0 py-3 focus:outline-none focus:border-[var(--color-insight)] transition-colors font-body text-white"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="data-label text-[10px]" htmlFor="email">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="bg-transparent border-b border-[rgba(232,230,224,0.2)] px-0 py-3 focus:outline-none focus:border-[var(--color-insight)] transition-colors font-body text-white"
            />
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-2">
          <div className="flex flex-col gap-3">
            <label className="data-label text-[10px]" htmlFor="audienceSize">
              Approximate audience size
            </label>
            <input
              id="audienceSize"
              name="audienceSize"
              placeholder="e.g. 250K across platforms"
              value={form.audienceSize}
              onChange={handleChange}
              className="bg-transparent border-b border-[rgba(232,230,224,0.2)] px-0 py-3 focus:outline-none focus:border-[var(--color-insight)] transition-colors font-body text-white placeholder:opacity-30"
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="data-label text-[10px]" htmlFor="primaryPlatforms">
              Primary platforms
            </label>
            <input
              id="primaryPlatforms"
              name="primaryPlatforms"
              placeholder="e.g. YouTube, X, newsletter"
              value={form.primaryPlatforms}
              onChange={handleChange}
              className="bg-transparent border-b border-[rgba(232,230,224,0.2)] px-0 py-3 focus:outline-none focus:border-[var(--color-insight)] transition-colors font-body text-white placeholder:opacity-30"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <label className="data-label text-[10px]" htmlFor="currentBottleneck">
            What feels like the real bottleneck right now? *
          </label>
          <textarea
            id="currentBottleneck"
            name="currentBottleneck"
            rows={3}
            value={form.currentBottleneck}
            onChange={handleChange}
            required
            className="bg-transparent border border-[rgba(232,230,224,0.15)] px-4 py-4 focus:outline-none focus:border-[var(--color-insight)] transition-colors font-body text-white leading-relaxed"
          />
        </div>

        <div className="flex flex-col gap-3">
          <label className="data-label text-[10px]" htmlFor="goal">
            If this architecture worked perfectly, what would change? *
          </label>
          <textarea
            id="goal"
            name="goal"
            rows={3}
            value={form.goal}
            onChange={handleChange}
            required
            className="bg-transparent border border-[rgba(232,230,224,0.15)] px-4 py-4 focus:outline-none focus:border-[var(--color-insight)] transition-colors font-body text-white leading-relaxed"
          />
        </div>

        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center px-10 py-4 transition-all hover:bg-[rgba(247,38,88,0.05)] active:scale-[0.98]"
          style={{
            borderRadius: 24,
            border: '1px solid var(--color-insight)',
            color: 'var(--color-insight)',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            cursor: 'pointer'
          }}
        >
          Request a Curiosity Audit
        </button>
      </form>
    </main>

  );
};

