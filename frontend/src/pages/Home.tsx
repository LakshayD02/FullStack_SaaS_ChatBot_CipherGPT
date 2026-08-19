import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import { FiMessageSquare, FiCpu, FiHardDrive, FiZap } from "react-icons/fi";
import "../index.css";

const features = [
  {
    icon: <FiMessageSquare size={20} />,
    className: "home-feature-icon-1",
    title: "Natural Conversations",
    desc: "Engage in fluid, context-aware conversations that feel genuinely intelligent and responsive to your needs.",
  },
  {
    icon: <FiCpu size={20} />,
    className: "home-feature-icon-2",
    title: "Advanced Reasoning",
    desc: "Tackle complex problems, write code, analyze data, and get step-by-step breakdowns of any topic.",
  },
  {
    icon: <FiHardDrive size={20} />,
    className: "home-feature-icon-3",
    title: "Persistent History",
    desc: "Every conversation is securely saved so you can always pick up right where you left off.",
  },
  {
    icon: <FiZap size={20} />,
    className: "home-feature-icon-4",
    title: "Lightning Fast",
    desc: "Optimized for speed without sacrificing quality — get responses in seconds, not minutes.",
  },
];

const pricingPlans = [
  {
    name: "Free Tier",
    price: "$0",
    desc: "Perfect for testing and personal use.",
    features: [
      "Access to standard AI model",
      "Up to 20 messages per day",
      "Standard response speed",
      "Save up to 5 chat histories",
    ],
    cta: "Get Started",
    link: "/signup",
    highlight: false,
  },
  {
    name: "Pro Tier",
    price: "$20",
    period: "/mo",
    desc: "For developers and power users.",
    features: [
      "Access to advanced Nemotron-3 model",
      "Unlimited daily messages",
      "Priority response speed",
      "Infinite persistent chat history",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
    link: "/signup",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Dedicated support for organizations.",
    features: [
      "Custom model training",
      "Dedicated API key access",
      "SLA support & custom uptime",
      "Advanced security and RBAC",
    ],
    cta: "Contact Sales",
    link: "mailto:sales@ciphergpt.com",
    highlight: false,
  },
];

const faqs = [
  {
    q: "Is CipherGPT free to use?",
    a: "Yes! We offer a fully functional Free Tier which includes standard access. If you need more speed and unlimited messages, you can upgrade to the Pro plan.",
  },
  {
    q: "How does password reset work?",
    a: "If you forget your password, simply click on the 'Forgot password?' link on the Sign In page. We will send a secure 6-digit OTP code to your registered email to verify it's you.",
  },
  {
    q: "Is my chat history saved?",
    a: "Absolutely. All your conversations are saved securely in your profile. You can switch between active sessions or delete threads at any time.",
  },
  {
    q: "Can I change my account credentials?",
    a: "Yes, you can edit your profile name, email, or change your password at any time by clicking the Settings icon in the sidebar.",
  },
];

const Home = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <div className="home-page" style={{ flex: 1 }}>
        
        {/* Hero Section */}
        <section className="home-hero">
          <div className="home-hero-glow" />
          <div className="home-badge">
            <span className="home-badge-dot" />
            AI-Powered Assistant — Available Now
          </div>
          <h1 className="home-h1">
            The AI assistant that<br />
            <span>thinks with you</span>
          </h1>
          <p className="home-desc">
            CipherGPT is a professional AI chat platform built for developers, thinkers, and creators.
            Ask anything, build anything, understand everything.
          </p>
          <div className="home-cta-group">
            <Link to="/signup" className="home-cta-primary glow-button">
              Start for free →
            </Link>
            <Link to="/login" className="home-cta-secondary">
              Sign in
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" style={{ padding: "80px 24px", scrollMarginTop: "var(--header-height)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto 48px", textAlign: "center" }}>
            <h2 className="glow-text" style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Designed for Productivity</h2>
            <p style={{ color: "var(--text-secondary)" }}>Get access to a powerful set of features designed to make code and text generation seamless.</p>
          </div>
          <div className="home-features">
            {features.map((f, i) => (
              <div className="home-feature-card" key={i} style={{ borderBottom: i % 2 === 0 ? "3px solid var(--neon-blue)" : "3px solid var(--neon-purple)" }}>
                <div className={`home-feature-icon ${f.className}`}>{f.icon}</div>
                <div className="home-feature-title">{f.title}</div>
                <div className="home-feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" style={{ padding: "80px 24px", background: "var(--bg-surface)", scrollMarginTop: "var(--header-height)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto 48px", textAlign: "center" }}>
            <h2 className="glow-text-purple" style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Simple, Transparent Pricing</h2>
            <p style={{ color: "var(--text-secondary)" }}>Choose the plan that fits your workflow. Cancel or upgrade at any time.</p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
            maxWidth: 1000,
            margin: "0 auto",
          }}>
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className="glow-card"
                style={{
                  background: "var(--bg)",
                  border: plan.highlight ? "1px solid var(--neon-blue)" : "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                  padding: "32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  boxShadow: plan.highlight ? "0 0 20px rgba(0,240,255,0.15)" : "none",
                }}
              >
                <div>
                  <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>{plan.name}</h3>
                  <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 20 }}>{plan.desc}</p>
                  <div style={{ display: "flex", alignItems: "baseline", marginBottom: 24 }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: "var(--text-primary)" }}>{plan.price}</span>
                    {plan.period && <span style={{ fontSize: 14, color: "var(--text-muted)", marginLeft: 4 }}>{plan.period}</span>}
                  </div>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
                    {plan.features.map((feat, index) => (
                      <li key={index} style={{ fontSize: 14, color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ color: "var(--neon-blue)" }}>✓</span> {feat}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link
                  to={plan.link}
                  className={`btn ${plan.highlight ? "glow-button" : "btn-ghost"}`}
                  style={{ width: "100%", padding: "12px", textAlign: "center" }}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ padding: "80px 24px", scrollMarginTop: "var(--header-height)" }}>
          <div style={{
            maxWidth: 800,
            margin: "0 auto",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(91,141,239,0.06), rgba(157,78,221,0.04))",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-lg)",
            padding: "48px 32px",
          }}>
            <h2 className="glow-text" style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>About CipherGPT</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.8, marginBottom: 24 }}>
              CipherGPT is built with speed and security in mind. Our goal is to provide a clean, uncluttered
              workspace for developers and writers to collaborate with artificial intelligence. With support for
              markdown rendering, code block copy features, persistent sessions, and robust recovery, it is
              designed to keep you in your flow.
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 32, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--neon-blue)" }}>99.9%</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Uptime Guarantee</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--neon-purple)" }}>100ms</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Average Latency</div>
              </div>
              <div>
                <div style={{ fontSize: 24, fontWeight: 900, color: "var(--neon-blue)" }}>AES-256</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)" }}>Secure Encryption</div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ/Docs Section */}
        <section id="docs" style={{ padding: "80px 24px 100px", background: "var(--bg-surface)", scrollMarginTop: "var(--header-height)" }}>
          <div style={{ maxWidth: 800, margin: "0 auto 48px", textAlign: "center" }}>
            <h2 className="glow-text-purple" style={{ fontSize: 32, fontWeight: 800, marginBottom: 12 }}>Frequently Asked Questions</h2>
            <p style={{ color: "var(--text-secondary)" }}>Need help? Find quick answers below, or read our platform docs.</p>
          </div>
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 24,
            maxWidth: 1000,
            margin: "0 auto",
          }}>
            {faqs.map((faq, i) => (
              <div key={i} style={{
                background: "var(--bg)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius)",
                padding: "24px",
              }}>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 10 }}>{faq.q}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6 }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
};

export default Home;
