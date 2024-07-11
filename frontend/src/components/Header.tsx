import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Logo from "./shared/Logo";
import { useAuth } from "../context/AuthContext";
import NavigationLink from "./shared/NavigationLink";

const Header = () => {
  const auth = useAuth();
  return (
    <AppBar
      sx={{backgroundImage: `linear-gradient(to top, rgb(6, 0, 32), rgba(1, 1, 121, 0.822))`, 
        position: "static", 
        boxShadow: "none" }}
    >
      <Toolbar sx={{ display: "flex" }}>
        <Logo />
        <div>
          {auth?.isLoggedIn ? (
            <>
              <NavigationLink
                bg="#008cff"
                to="/chat"
                text="Go To Chat"
                textColor="white"
              />
              <NavigationLink
                bg="#fe0000"
                textColor="white"
                to="/"
                text="logout"
                onClick={auth.logout}
              />
            </>
          ) : (
            <>
             <NavigationLink
                bg="#008cff"
                to="/login"
                text="Login"
                textColor="white"
              />
              <NavigationLink
                bg="#ffffff"
                textColor="black"
                to="/signup"
                text="Signup"
              />
            </>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
