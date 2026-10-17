import { Link } from "react-router-dom";
import Guilloche from "./Guilloche";
import "./CtaBand.css";

function CtaBand() {
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
