import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import { useState } from "react";
import "../index.css";

const faqs = [
  {
    q: "Is CipherGPT completely free?",
    a: "Yes — we have a Free tier that lets you send up to 20 messages per day, save 5 chat threads, and access all standard features with no credit card required.",
  },
  {
    q: "How does the password reset work?",
    a: "Click 'Forgot password?' on the login page. Enter your email to receive a 6-digit OTP code. After verification, you can set a new password instantly.",
  },
  {
    q: "Is my chat history private?",
    a: "Yes. All conversations are stored under your account, encrypted at rest, and never shared. Only you can access your chat history.",
  },
  {
    q: "Can I delete a conversation?",
    a: "Absolutely. Each thread in the sidebar has a delete icon. You can also clear all conversations at once from the sidebar settings.",
  },
  {
    q: "Can I update my name, email, or password?",
    a: "Yes — open the Settings panel from the sidebar. You can update your display name, email, and change your password after verifying your current one.",
  },
  {
    q: "Does the app work on mobile?",
    a: "Yes. CipherGPT is fully responsive. The sidebar collapses on smaller screens, and the chat interface adapts to all screen sizes.",
  },
  {
    q: "What AI model powers CipherGPT?",
    a: "CipherGPT is powered by a state-of-the-art large language model accessed through the OpenRouter API. The specific model version is not disclosed.",
  },
  {
    q: "How do I start a new chat?",
    a: "Click the '+ New Chat' button at the top of the sidebar at any time. Each new chat becomes its own thread with its own history.",
  },
];

const quickLinks = [
  { label: "Getting Started", desc: "Create an account and start chatting in under a minute.", link: "/signup" },
  { label: "Features Overview", desc: "Explore everything CipherGPT has to offer.", link: "/features" },
  { label: "Pricing Plans", desc: "Compare Free, Pro, and Enterprise tiers.", link: "/pricing" },
  { label: "Forgot Password", desc: "Recover access to your account via OTP email.", link: "/forgot-password" },
];

const DocsPage = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ flex: 1 }}>
        {/* Hero */}
        <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 640, margin: "0 auto" }}>
          <h1 className="glow-text-purple" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, marginBottom: 16 }}>
            Help & Documentation
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7 }}>
            Everything you need to get the most out of CipherGPT — quick links, FAQs, and platform guides.
          </p>
        </section>

        {/* Quick links */}
        <section style={{ padding: "0 24px 60px", maxWidth: 900, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Quick Links</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
            {quickLinks.map((item, i) => (
              <Link
                to={item.link}
                key={i}
                style={{
                  background: "var(--bg-surface)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "20px 20px",
                  textDecoration: "none",
                  transition: "border-color 0.2s",
                  display: "block",
                }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--neon-purple)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
              >
                <div style={{ fontWeight: 700, fontSize: 15, color: "var(--text-primary)", marginBottom: 6 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>{item.desc}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ Accordion */}
        <section style={{ padding: "0 24px 100px", maxWidth: 800, margin: "0 auto" }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20 }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "var(--bg-surface)",
                  border: `1px solid ${openIdx === i ? "var(--neon-purple)" : "var(--border)"}`,
                  borderRadius: "var(--radius-sm)",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenIdx(openIdx === i ? null : i)}
                  style={{
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "18px 20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    textAlign: "left",
                    color: "var(--text-primary)",
                    fontWeight: 600,
                    fontSize: 15,
                    fontFamily: "Inter, sans-serif",
                  }}
                >
                  {faq.q}
                  <span style={{
                    fontSize: 18,
                    color: "var(--text-muted)",
                    transform: openIdx === i ? "rotate(45deg)" : "rotate(0deg)",
                    transition: "transform 0.2s",
                    flexShrink: 0,
                    marginLeft: 12,
                  }}>+</span>
                </button>
                {openIdx === i && (
                  <div style={{ padding: "0 20px 18px", fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.7 }}>
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default DocsPage;
