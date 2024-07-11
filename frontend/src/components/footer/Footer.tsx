import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div
        style={{
          width: "100%",
          minHeight: "20vh",
          maxHeight: "30vh",
          marginTop: 60,
        }}
      >
        <p style={{ fontSize: "30px", textAlign: "center", padding: "20px" }}>
        © 2024 Cipher GPT. All rights reserved.<p style={{ fontSize: "25px"}}>Created By <span style={{ fontSize: "25px"}} ><a href="https://lakshaydhoundiyal.cloud" target="_blank" style={{fontSize: '25px', color:'#39a3ff', textDecoration: 'none'}}> Lakshay Dhoundiyal</a></span></p> 
          <span>
            <Link
              style={{ color: "white", fontSize: '30px' }}
              className="nav-link"
          
              to={"https://lakshaydhoundiyal.cloud"}
            >
             
            </Link>
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
