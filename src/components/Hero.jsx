import { Link } from "react-router-dom";
import { HiCheck } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import Guilloche from "./Guilloche";
import ScamChecker from "./ScamChecker";
import "./Hero.css";

function Hero() {
  const { user } = useAuth();
  return (
    <section className="hero">
      <Guilloche className="heroPattern" />
      <div className="heroInner">
        <div className="heroCopy">
          <h1>In doubt about money? Check here first.</h1>
          <p className="heroLead">
            MoneyMentor is a free, trusted place to learn how money works and how scammers operate,
            so your OTP, your PIN and your savings stay yours.
          </p>
          <div className="heroActions">
            <Link to={user ? "/account" : "/signup"} className="btn btn-solid">
              {user ? "Go to my dashboard" : "Start learning free"}
            </Link>
            <Link to="/#safety" className="btn btn-ghost">The 6 golden rules</Link>
          </div>
          <ul className="heroPoints">
            <li><HiCheck aria-hidden="true" /> Spot scams before they cost you</li>
            <li><HiCheck aria-hidden="true" /> Short lessons on saving and budgeting</li>
            <li><HiCheck aria-hidden="true" /> Free, with no card needed</li>
          </ul>
        </div>

        <div className="heroVisual">
          <ScamChecker compact />
        </div>
      </div>
    </section>
  );
}
export default Hero;
