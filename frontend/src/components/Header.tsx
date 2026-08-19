import { useEffect, useState } from "react";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import "../index.css";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "dark";
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Close mobile menu on route change
  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <>
      <header className="header">
        <Logo />

        {/* Desktop — Centered Navigation Links */}
        <nav className="nav-links-center">
          <Link to="/features" className="nav-link-item">Features</Link>
          <Link to="/pricing" className="nav-link-item">Pricing</Link>
          <Link to="/about" className="nav-link-item">About</Link>
          <Link to="/docs" className="nav-link-item">Docs</Link>
        </nav>

        {/* Right-side actions */}
        <div className="nav-actions">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost theme-toggle-btn"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          {/* Desktop auth buttons */}
          <div className="nav-auth-btns">
            {auth?.isLoggedIn ? (
              <>
                <Link to="/chat" className="btn btn-ghost">Dashboard</Link>
                <button className="btn btn-danger" onClick={auth.logout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">Sign in</Link>
                <Link to="/signup" className="btn btn-primary glow-button">Get started</Link>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-menu-btn"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
            title="Toggle menu"
          >
            {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </header>

      {/* Mobile overlay — outside header so it doesn't affect header layout */}
      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay">
          <button onClick={() => handleNavClick("/features")} className="nav-link-item mobile-nav-link">Features</button>
          <button onClick={() => handleNavClick("/pricing")} className="nav-link-item mobile-nav-link">Pricing</button>
          <button onClick={() => handleNavClick("/about")} className="nav-link-item mobile-nav-link">About</button>
          <button onClick={() => handleNavClick("/docs")} className="nav-link-item mobile-nav-link">Docs</button>
          <div className="mobile-nav-divider" />
          {auth?.isLoggedIn ? (
            <>
              <button onClick={() => handleNavClick("/chat")} className="btn btn-primary glow-button" style={{ width: "100%" }}>
                Dashboard
              </button>
              <button className="btn btn-danger" style={{ width: "100%", padding: "12px" }} onClick={() => { auth.logout(); setIsMobileMenuOpen(false); }}>
                Sign out
              </button>
            </>
          ) : (
            <>
              <button onClick={() => handleNavClick("/login")} className="btn btn-ghost" style={{ width: "100%", padding: "12px" }}>
                Sign in
              </button>
              <button onClick={() => handleNavClick("/signup")} className="btn btn-primary glow-button" style={{ width: "100%" }}>
                Get started
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Header;
