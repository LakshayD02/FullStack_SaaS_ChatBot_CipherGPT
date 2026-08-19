import "../../index.css";

const Footer = () => (
  <footer className="footer">
    <span className="footer-left">© {new Date().getFullYear()} CipherGPT. All rights reserved.</span>
    <span className="footer-right">
      Created by{" "}
      <a href="https://lakshay-3d-website.netlify.app" target="_blank" rel="noopener noreferrer">
        Lakshay Dhoundiyal
      </a>
    </span>
  </footer>
);

export default Footer;
