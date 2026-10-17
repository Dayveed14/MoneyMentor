import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { HiCheck } from "react-icons/hi";
import Guilloche from "./Guilloche";
import SavingsGrowth from "./SavingsGrowth";
import bannerImg from "../assets/images/banner.webp";
import "./Hero.css";

function Hero() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <Guilloche className="heroPattern" />
      <div className="heroInner">
        <div className="heroCopy">
          <h1>Small savings. Serious growth.</h1>
          <p className="heroLead">
            MoneyMentor teaches budgeting, saving and staying safe with money in
            short, practical lessons. Move the sliders and watch a weekly habit
            compound.
          </p>
          <div className="heroActions">
            <Link to={user ? "/account" : "/signup"} className="btn btn-solid">
              {user ? "Go to my dashboard" : "Start learning free"}
            </Link>
            <Link to="/#modules" className="btn btn-ghost">
              Explore modules
            </Link>
          </div>
          <ul className="heroPoints">
            <li><HiCheck aria-hidden="true" /> Lessons you can finish on a lunch break</li>
            <li><HiCheck aria-hidden="true" /> A quiz at the end of every module</li>
            <li><HiCheck aria-hidden="true" /> Free to start, no card needed</li>
          </ul>
        </div>

        <div className="heroVisual">
          <div className="heroArch">
            <img src={bannerImg} alt="" width="800" height="720" fetchPriority="high" />
          </div>
          <SavingsGrowth />
        </div>
      </div>
    </section>
  );
}
export default Hero;
