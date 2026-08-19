import Footer from "../components/footer/Footer";
import { Link } from "react-router-dom";
import "../index.css";

const stats = [
  { label: "Uptime Guarantee", value: "99.9%", color: "var(--neon-blue)" },
  { label: "Avg. Response Latency", value: "~100ms", color: "var(--neon-purple)" },
  { label: "Encryption Standard", value: "AES-256", color: "var(--neon-blue)" },
  { label: "Data Stored in Transit", value: "TLS 1.3", color: "var(--neon-purple)" },
];

const team = [
  { initials: "LK", name: "Laksh", role: "Founder & Lead Engineer", color: "var(--accent)" },
  { initials: "AI", name: "AI Core", role: "Nemotron-3 Ultra 550B", color: "var(--neon-purple)" },
];

const AboutPage = () => (
  <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
    <div style={{ flex: 1 }}>
      {/* Hero */}
      <section style={{ padding: "80px 24px 60px", textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <h1 className="glow-text" style={{ fontSize: "clamp(28px, 5vw, 48px)", fontWeight: 900, marginBottom: 16 }}>
          Built for the way you think
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: 16, lineHeight: 1.75 }}>
          CipherGPT is an AI-powered chat platform designed for developers, writers, and researchers
          who value speed, clarity, and privacy. It's built from the ground up with a focus on
          clean UX, persistent sessions, and powerful underlying models.
        </p>
      </section>

      {/* Stats */}
      <section style={{ padding: "0 24px 80px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 20, marginBottom: 80 }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "28px 20px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color, marginBottom: 8 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Mission */}
        <div style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          padding: "40px",
          marginBottom: 60,
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16 }}>Our Mission</h2>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.8, marginBottom: 16 }}>
            We believe AI should be accessible, reliable, and delightful to use. CipherGPT exists to
            bridge the gap between powerful language model APIs and real-world productivity tools.
          </p>
          <p style={{ color: "var(--text-secondary)", fontSize: 15, lineHeight: 1.8 }}>
            We don't lock you into a black box. Conversations are yours — stored securely, portable,
            and always accessible. We're building toward a future where AI augments every workflow,
            not replaces it.
          </p>
        </div>

        {/* Team */}
        <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24 }}>The Team</h2>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {team.map((t, i) => (
            <div key={i} style={{
              background: "var(--bg-surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
              padding: "24px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              minWidth: 260,
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                background: t.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 16,
                color: "#fff",
                flexShrink: 0,
              }}>{t.initials}</div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 15 }}>{t.name}</div>
                <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ marginTop: 60, textAlign: "center" }}>
          <Link to="/signup" className="btn btn-primary glow-button" style={{ padding: "13px 32px", fontSize: 15 }}>
            Join CipherGPT today →
          </Link>
        </div>
      </section>
    </div>
    <Footer />
  </div>
);

export default AboutPage;
