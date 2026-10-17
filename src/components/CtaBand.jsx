import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Guilloche from "./Guilloche";
import "./CtaBand.css";

function CtaBand() {
  const { user } = useAuth();
  if (user) {
    return (
      <section className="ctaBand">
        <Guilloche className="ctaPattern" />
        <div className="wrap ctaInner">
          <h2>Pick up where you left off</h2>
          <p>Your lessons, budget and saved articles are waiting in your dashboard.</p>
          <div className="ctaActions">
            <Link to="/account" className="btn ctaBtn">Open my dashboard</Link>
          </div>
        </div>
      </section>
    );
  }
  return (
    <section className="ctaBand">
      <Guilloche className="ctaPattern" />
      <div className="wrap ctaInner">
        <h2>Start with one module this week</h2>
        <p>Create a free account to save your progress, take the quizzes and track your goals.</p>
        <div className="ctaActions">
          <Link to="/signup" className="btn ctaBtn">Create free account</Link>
          <Link to="/login" className="ctaLink">I already have an account</Link>
        </div>
      </div>
    </section>
  );
}
export default CtaBand;
