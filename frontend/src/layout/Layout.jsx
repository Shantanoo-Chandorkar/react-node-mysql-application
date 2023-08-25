import Navbar from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { Outlet, useLocation } from "react-router-dom";

const Layout = ({ children }) => {
  const location = useLocation();
  const shouldRenderNavbarAndFooter = !["/register", "/login"].includes(
    location.pathname
  );

  return (
    <div className="container">
      {shouldRenderNavbarAndFooter && <Navbar />}
      <div className="outerContainer">
        <Outlet />
      </div>
      {shouldRenderNavbarAndFooter && <Footer />}
    </div>
  );
};

export default Layout;
