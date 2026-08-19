import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import {
  FiMessageSquare,
  FiCpu,
  FiHardDrive,
  FiZap,
  FiSun,
  FiLock,
  FiEdit,
  FiSmartphone,
} from "react-icons/fi";
import "../index.css";

const features = [
  {
    icon: <FiMessageSquare size={24} style={{ color: "var(--neon-blue)" }} />,
    title: "Natural Language Understanding",
    desc: "CipherGPT understands context, tone, and intent — enabling fluid, multi-turn conversations that feel genuinely intelligent.",
    tag: "Core AI",
  },
  {
    icon: <FiCpu size={24} style={{ color: "var(--neon-purple)" }} />,
    title: "Advanced Reasoning & Analysis",
    desc: "From solving math problems to debugging code — our AI reasons step by step, so you always know how it got there.",
    tag: "Reasoning",
  },
  {
    icon: <FiHardDrive size={24} style={{ color: "var(--neon-blue)" }} />,
    title: "Persistent Chat History",
    desc: "All your conversations are encrypted and saved. Switch between threads, pick up mid-session, or search past chats instantly.",
    tag: "Storage",
  },
  {
    icon: <FiZap size={24} style={{ color: "var(--neon-purple)" }} />,
    title: "Streaming Responses",
    desc: "Responses stream word-by-word in real-time, just like a real conversation — no waiting for the full answer to load.",
    tag: "Performance",
  },
  {
    icon: <FiSun size={24} style={{ color: "var(--neon-blue)" }} />,
    title: "Light & Dark Modes",
    desc: "CipherGPT adapts to your preference with system-synced or manual dark and light themes — easy on the eyes, day or night.",
    tag: "UX",
  },
  {
    icon: <FiLock size={24} style={{ color: "var(--neon-purple)" }} />,
    title: "Secure Authentication",
    desc: "JWT-based sessions, bcrypt-hashed passwords, and OTP-verified password resets — your account is protected at every layer.",
    tag: "Security",
  },
  {
    icon: <FiEdit size={24} style={{ color: "var(--neon-blue)" }} />,
    title: "Markdown & Code Support",
    desc: "Render markdown, format tables, and display syntax-highlighted code blocks with one-click copy actions.",
    tag: "Formatting",
  },
  {
    icon: <FiSmartphone size={24} style={{ color: "var(--neon-purple)" }} />,
    title: "Fully Responsive Design",
    desc: "Built mobile-first. The sidebar, chat interface, and settings all work seamlessly across phones, tablets, and desktops.",
    tag: "Responsive",
  },
];

const FeaturesPage = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
    <div style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "var(--bg-surface)", border: "1px solid var(--border)", borderRadius: 999, padding: "5px 14px", fontSize: 12, color: "var(--text-muted)", marginBottom: 24, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.6px" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--neon-blue)", display: "inline-block" }} />
          Platform Features
        </div>
        <h1 className="glow-text" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, lineHeight: 1.15, marginBottom: 16 }}>
          Everything you need to<br />build with AI
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.7, marginBottom: 36 }}>
          CipherGPT ships with a production-grade feature set — so you can focus on conversations, not configuration.
        </p>
        <Link to="/signup" className="btn btn-primary glow-button" style={{ padding: "12px 28px", fontSize: 15 }}>
          Start for free →
        </Link>
      </section>

      {/* Feature Grid */}
      <section style={{ padding: "0 24px 100px", maxWidth: 1100, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "28px",
              transition: "border-color 0.2s, transform 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--neon-blue)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}
            >
              <div style={{ fontSize: 28, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <h3 style={{ fontSize: 16, fontWeight: 700 }}>{f.title}</h3>
              </div>
              <span style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px", color: "var(--neon-blue)", background: "rgba(0,240,255,0.08)", padding: "2px 8px", borderRadius: 4 }}>{f.tag}</span>
              <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.6, marginTop: 12 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
    <Footer />
  </div>
);

export default FeaturesPage;
