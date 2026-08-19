import { Link } from "react-router-dom";
import Footer from "../components/footer/Footer";
import "../index.css";

const NotFound = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
        
        {/* Neon 404 badge */}
        <div 
          className="glow-border" 
          style={{ 
            fontSize: "clamp(60px, 10vw, 100px)", 
            fontWeight: 900, 
            lineHeight: 1, 
            padding: "20px 40px", 
            borderRadius: "var(--radius-lg)", 
            background: "var(--bg-surface)", 
            marginBottom: 32,
            fontFamily: "'JetBrains Mono', monospace",
            animation: "pulse-dot 3s infinite"
          }}
        >
          404
        </div>

        <h1 className="glow-text" style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 800, marginBottom: 12 }}>
          Lost in the Cipher?
        </h1>
        
        <p style={{ color: "var(--text-secondary)", fontSize: 16, maxWidth: 480, lineHeight: 1.7, marginBottom: 36 }}>
          The page you are looking for does not exist or has been moved. Use the options below to get back on track.
        </p>

        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          <Link to="/" className="btn btn-ghost" style={{ padding: "12px 24px" }}>
            Return Home
          </Link>
          <Link to="/chat" className="btn btn-primary glow-button" style={{ padding: "12px 24px" }}>
            Go to Dashboard
          </Link>
        </div>

      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
