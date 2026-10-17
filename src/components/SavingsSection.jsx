import { Link } from "react-router-dom";
import SavingsGrowth from "./SavingsGrowth";
import bannerImg from "../assets/images/banner.webp";
import "./SavingsSection.css";

function SavingsSection() {
  return (
    <section className="savingsSection">
      <div className="wrap savingsInner">
        <div className="savingsCopy">
          <h2>Small savings. Serious growth.</h2>
          <p>
            Move the sliders and watch a weekly habit compound. Our Saving strategy module shows you
            how to build one, starting with an emergency fund.
          </p>
          <Link to="/savings" className="btn btn-ghost">Explore saving strategy</Link>
          <img src={bannerImg} alt="" width="800" height="720" loading="lazy" className="savingsArt" />
        </div>
        <SavingsGrowth />
      </div>
    </section>
  );
}
export default SavingsSection;
