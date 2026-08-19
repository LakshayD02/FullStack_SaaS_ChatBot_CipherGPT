import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import "../index.css";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "",
    desc: "Get started with CipherGPT at no cost. Perfect for casual and exploratory use.",
    highlight: false,
    badge: null,
    features: [
      "Access to standard AI model",
      "Up to 20 messages per day",
      "Standard response speed",
      "Save up to 5 conversation threads",
      "Markdown & code block rendering",
      "Light & dark mode support",
    ],
    cta: "Get started free",
    link: "/signup",
  },
  {
    name: "Pro",
    price: "$20",
    period: "/month",
    desc: "The complete CipherGPT experience. Built for developers, researchers, and power users.",
    highlight: true,
    badge: "Most Popular",
    features: [
      "Access to advanced AI model",
      "Unlimited daily messages",
      "Priority streaming response speed",
      "Unlimited persistent chat history",
      "Profile & credential management",
      "OTP-secured password recovery",
      "Early access to new features",
    ],
    cta: "Upgrade to Pro",
    link: "/signup",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For teams and organizations that need scale, control, and dedicated support.",
    highlight: false,
    badge: null,
    features: [
      "Custom AI model fine-tuning",
      "Dedicated API key & rate limits",
      "RBAC — role-based access control",
      "SLA uptime & priority support",
      "Audit logs & data retention",
      "SSO / SAML integration",
    ],
    cta: "Contact sales",
    link: "mailto:sales@ciphergpt.com",
  },
];

const PricingPage = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
    <div style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 620, margin: "0 auto" }}>
        <h1 className="glow-text-purple" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, marginBottom: 16 }}>
          Simple, transparent pricing
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7 }}>
          Start free. Scale when you're ready. No hidden fees, no surprise bills.
        </p>
      </section>

      {/* Plans */}
      <section style={{ padding: "0 24px 80px", maxWidth: 1050, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
          {plans.map((plan, i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: `1px solid ${plan.highlight ? "var(--neon-blue)" : "var(--border)"}`,
              borderRadius: "var(--radius)",
              padding: "36px 28px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              boxShadow: plan.highlight ? "0 0 30px rgba(0,240,255,0.12)" : "none",
            }}>
              {plan.badge && (
                <div style={{
                  position: "absolute",
                  top: -12,
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "linear-gradient(135deg, var(--neon-blue), var(--neon-purple))",
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "4px 14px",
                  borderRadius: 999,
                  whiteSpace: "nowrap",
                  letterSpacing: "0.4px",
                }}>
                  {plan.badge}
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.6px" }}>{plan.name}</span>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 42, fontWeight: 900, color: "var(--text-primary)" }}>{plan.price}</span>
                {plan.period && <span style={{ fontSize: 14, color: "var(--text-muted)" }}>{plan.period}</span>}
              </div>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: 28 }}>{plan.desc}</p>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 12, flex: 1, marginBottom: 32 }}>
                {plan.features.map((feat, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 14, color: "var(--text-secondary)" }}>
                    <span style={{ color: "var(--neon-blue)", fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                to={plan.link}
                className={`btn ${plan.highlight ? "glow-button" : "btn-ghost"}`}
                style={{ width: "100%", padding: "13px", textAlign: "center", border: plan.highlight ? "none" : "1px solid var(--border)" }}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* FAQ note */}
        <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: 13, marginTop: 40 }}>
          All plans include free account recovery via OTP email. Have questions?{" "}
          <Link to="/docs" style={{ color: "var(--neon-blue)", textDecoration: "none" }}>Check our FAQ →</Link>
        </p>
      </section>
    </div>
    <Footer />
  </div>
);

export default PricingPage;
