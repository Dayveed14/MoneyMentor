import { Link } from "react-router-dom";
import savingsImg from "../assets/images/savings.webp";
import budgetingImg from "../assets/images/budgeting.webp";
import finlitImg from "../assets/images/finlit.webp";
import "./ModulesShowcase.css";

const MODULES = [
  {
    to: "/savings", img: savingsImg, title: "Saving strategy",
    text: "Create a saving plan that adapts to your life goals and financial circumstances.",
    topics: ["Emergency funds", "Paying yourself first", "Cutting hidden costs"],
  },
  {
    to: "/budget", img: budgetingImg, title: "Budgeting & expense tracking",
    text: "Unlock the power of smart money management and see where every payday goes.",
    topics: ["The 50/30/20 rule", "Tracking spending", "Realistic goals"],
  },
  {
    to: "/finlit", img: finlitImg, title: "Financial literacy 101",
    text: "Gain the confidence to navigate money conversations, and to spot fraud early.",
    topics: ["Interest & credit", "Phishing and OTP scams", "Card safety"],
  },
];

function ModulesShowcase() {
  return (
    <section className="modulesBand" id="modules">
      <div className="wrap">
        <div className="modulesHead">
          <div>
            <p className="kicker kickerLight">Our modules</p>
            <h2>Three modules to start your money journey</h2>
          </div>
          <p>
            Each module is designed with you in mind: actionable steps,
            real-world scenarios and the tools you need to master your finances.
          </p>
        </div>

        <div className="moduleCards">
          {MODULES.map((m) => (
            <Link to={m.to} className="moduleCard" key={m.to}>
              <div className="moduleImg">
                <img src={m.img} alt="" width="360" height="400" loading="lazy" />
              </div>
              <div className="moduleBody">
                <h3>{m.title}</h3>
                <p>{m.text}</p>
                <ul>
                  {m.topics.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <span className="moduleLink">Start module</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ModulesShowcase;
