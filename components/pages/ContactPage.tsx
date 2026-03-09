"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export function ContactPage() {
  const pageRef = useRef<HTMLDivElement>(null);
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    system: "",
    challenge: "",
    newsletter: false,
  });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-contact-header]",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.3 }
      );
      gsap.fromTo(
        "[data-contact-form]",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "expo.out", delay: 0.6 }
      );
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    gsap.fromTo(
      "[data-success]",
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" }
    );
  };

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    background: "transparent",
    border: "1px solid rgba(234,228,218,0.08)",
    color: "var(--paper)",
    padding: "0.875rem 1.25rem",
    fontSize: "0.875rem",
    fontFamily: "var(--font-inter)",
    fontWeight: 300,
    outline: "none",
    transition: "border-color 0.3s ease",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "var(--font-inter)",
    fontSize: "0.6rem",
    fontWeight: 700,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(234,228,218,0.35)",
    marginBottom: "0.5rem",
  };

  return (
    <div
      ref={pageRef}
      className="min-h-screen"
      style={{ background: "var(--ink)", color: "var(--paper)" }}
    >
      <div className="max-w-[1440px] mx-auto px-8 md:px-14 pt-36 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Left: Header */}
          <div data-contact-header className="opacity-0">
            <div className="flex items-center gap-4 mb-8">
              <span className="label-type">Book a Build Call</span>
              <span className="rule-line w-12 inline-block" />
            </div>
            <h1
              style={{
                fontFamily: "var(--font-bebas)",
                fontSize: "clamp(3.5rem, 6vw, 7rem)",
                color: "var(--paper)",
                lineHeight: 0.9,
                letterSpacing: "0.02em",
                marginBottom: "2rem",
              }}
            >
              Tell us what{" "}
              <span style={{ color: "var(--tangerine)" }}>you&apos;re building.</span>
            </h1>
            <p
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.9375rem",
                lineHeight: 1.85,
                color: "rgba(234,228,218,0.45)",
                marginBottom: "2.5rem",
                maxWidth: "400px",
              }}
            >
              We book a limited number of build calls each month. This form is your intake — it helps us understand your operation before we talk.
            </p>

            {/* What to expect */}
            <div className="space-y-5">
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase" as const,
                  color: "rgba(234,228,218,0.2)",
                }}
              >
                WHAT HAPPENS NEXT
              </p>
              {[
                ["01", "We review your intake within 48 hours"],
                ["02", "If there's a fit, we schedule a 45-minute build call"],
                ["03", "We map your current system and identify the right build"],
                ["04", "You receive a scoped proposal within 5 business days"],
              ].map(([num, step]) => (
                <div key={num} className="flex items-start gap-4">
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.6rem",
                      fontWeight: 700,
                      color: "rgba(234,228,218,0.25)",
                      marginTop: "0.1rem",
                      flexShrink: 0,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.875rem",
                      lineHeight: 1.6,
                      color: "rgba(234,228,218,0.45)",
                    }}
                  >
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div data-contact-form className="opacity-0">
            {submitted ? (
              <div
                data-success
                className="opacity-0"
                style={{
                  border: "1px solid rgba(234,228,218,0.08)",
                  padding: "2.5rem",
                }}
              >
                <div className="mb-6">
                  <svg viewBox="0 0 40 40" className="w-10 h-10 mb-4" fill="none">
                    <circle cx="20" cy="20" r="19" stroke="#ED773C" strokeWidth="1" />
                    <path d="M12 20l6 6 10-12" stroke="#ED773C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <h2
                    style={{
                      fontFamily: "var(--font-cormorant)",
                      fontSize: "2rem",
                      fontWeight: 400,
                      color: "var(--paper)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    We&apos;ve got your intake.
                  </h2>
                  <p
                    style={{
                      fontFamily: "var(--font-inter)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      color: "rgba(234,228,218,0.45)",
                    }}
                  >
                    Expect a response within 48 hours. If there&apos;s a fit, we&apos;ll schedule the call from there.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label style={labelStyle}>Name</label>
                    <input
                      type="text"
                      placeholder="Your name"
                      style={fieldStyle}
                      value={formState.name}
                      onChange={(e) => setFormState((s) => ({ ...s, name: e.target.value }))}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(128,139,197,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(234,228,218,0.08)")}
                      required
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input
                      type="email"
                      placeholder="you@company.com"
                      style={fieldStyle}
                      value={formState.email}
                      onChange={(e) => setFormState((s) => ({ ...s, email: e.target.value }))}
                      onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(128,139,197,0.5)")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(234,228,218,0.08)")}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Which system interests you?</label>
                  <select
                    style={{ ...fieldStyle, appearance: "none" as const }}
                    value={formState.system}
                    onChange={(e) => setFormState((s) => ({ ...s, system: e.target.value }))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(128,139,197,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(234,228,218,0.08)")}
                    required
                  >
                    <option value="" disabled style={{ background: "#1D1D1B" }}>Select a system</option>
                    <option value="css" style={{ background: "#1D1D1B" }}>Content Services System</option>
                    <option value="vkb" style={{ background: "#1D1D1B" }}>Verified Knowledge Base</option>
                    <option value="ahrl" style={{ background: "#1D1D1B" }}>Audience Hub + Resource Library</option>
                    <option value="all" style={{ background: "#1D1D1B" }}>All three — full stack</option>
                    <option value="unsure" style={{ background: "#1D1D1B" }}>Not sure yet</option>
                  </select>
                </div>

                <div>
                  <label style={labelStyle}>Describe your current challenge</label>
                  <textarea
                    rows={5}
                    placeholder="What's breaking in your current content operation? What are you trying to build?"
                    style={{ ...fieldStyle, resize: "none" }}
                    value={formState.challenge}
                    onChange={(e) => setFormState((s) => ({ ...s, challenge: e.target.value }))}
                    onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(128,139,197,0.5)")}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "rgba(234,228,218,0.08)")}
                    required
                  />
                </div>

                {/* Newsletter */}
                <div
                  id="newsletter"
                  className="flex items-start gap-4 py-5"
                  style={{ borderTop: "1px solid rgba(234,228,218,0.06)" }}
                >
                  <button
                    type="button"
                    onClick={() => setFormState((s) => ({ ...s, newsletter: !s.newsletter }))}
                    className="flex items-center justify-center flex-shrink-0"
                    style={{
                      width: "1.25rem",
                      height: "1.25rem",
                      border: `1px solid ${formState.newsletter ? "#ED773C" : "rgba(234,228,218,0.2)"}`,
                      background: formState.newsletter ? "rgba(237,119,60,0.15)" : "transparent",
                      marginTop: "0.1rem",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {formState.newsletter && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4l3 3 5-6" stroke="#ED773C" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </button>
                  <div>
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.8125rem",
                        lineHeight: 1.5,
                        color: "rgba(234,228,218,0.5)",
                      }}
                    >
                      Add me to the Curiosity Inc list
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-inter)",
                        fontSize: "0.75rem",
                        marginTop: "0.25rem",
                        color: "rgba(234,228,218,0.25)",
                      }}
                    >
                      Occasional thinking on systems, content, and intellectual infrastructure.
                    </p>
                  </div>
                </div>

                <button type="submit" className="btn-primary w-full justify-center" style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
                  <span>Submit Intake</span>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <p
                  className="text-center"
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.75rem",
                    color: "rgba(234,228,218,0.2)",
                  }}
                >
                  No sales pressure. No cold follow-ups. Just a real conversation.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
