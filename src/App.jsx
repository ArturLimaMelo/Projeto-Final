import "./styles/global.css";
import "./styles/themes.css";
import { Route, Routes } from "react-router";

import { Header } from "./components/Header.jsx";
import Landing from "./screens/Landing/Landing.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./screens/Login/Login.jsx";
import SignIn from "./screens/SignIn/SignIn.jsx";
import Shop from "./screens/Shop/Shop.jsx";
import { SessionProvider } from "./context/SessionContext";

export default function App() {
  return (
    <>
      <SessionProvider>
        <div className="app-container">
          <Header />

          <div className="app-content">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/shop" element={<Shop />} />
            </Routes>
          </div>

          <Footer />
        </div>
      </SessionProvider>
    </>
  );
}
