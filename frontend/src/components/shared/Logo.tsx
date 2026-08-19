import { Link } from "react-router-dom";

const Logo = () => (
  <Link to="/" className="logo">
    <div className="logo-icon">C</div>
    <span className="logo-text">
      Cipher<span>GPT</span>
    </span>
  </Link>
);

export default Logo;