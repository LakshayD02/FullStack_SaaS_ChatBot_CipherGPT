import { Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import ForgotPassword from "./pages/ForgotPassword";
import FeaturesPage from "./pages/FeaturesPage";
import PricingPage from "./pages/PricingPage";
import AboutPage from "./pages/AboutPage";
import DocsPage from "./pages/DocsPage";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import "./index.css";
import "./App.css";

function App() {
  const auth = useAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={auth?.isLoggedIn && auth.user ? <Navigate to="/chat" replace /> : <Login />}
        />
        <Route
          path="/signup"
          element={auth?.isLoggedIn && auth.user ? <Navigate to="/chat" replace /> : <Signup />}
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/chat"
          element={
            auth?.isLoggedIn && auth.user ? (
              <Chat />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
