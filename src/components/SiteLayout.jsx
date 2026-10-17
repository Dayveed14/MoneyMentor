import { Outlet } from "react-router-dom";
import Navigation from "./Navigation";
import Footer from "./Footer";
import SafetyBar from "./SafetyBar";

function SiteLayout() {
  return (
    <div className="home-container">
      <SafetyBar />
      <Navigation />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
export default SiteLayout;
