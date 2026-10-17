import { Link } from "react-router-dom";
import savingsImg from "../assets/images/savings.webp";
import budgetingImg from "../assets/images/budgeting.webp";
import finlitImg from "../assets/images/finlit.webp";

const ALL = [
  { to: "/savings", img: savingsImg, title: "Saving strategy", note: "Build a plan that adapts to your goals" },
  { to: "/budget", img: budgetingImg, title: "Budgeting & expense tracking", note: "See where every payday goes" },
  { to: "/finlit", img: finlitImg, title: "Financial literacy 101", note: "Interest, credit and fraud safety" },
];

/** Links to the other modules, shown at the bottom of a module page. */
function ModuleNext({ current }) {
  return (
    <section className="moduleNext">
      <div className="wrap">
        <h2>Keep learning</h2>
        <div className="moduleNextGrid">
          {ALL.filter((m) => m.to !== current).map((m) => (
            <Link key={m.to} to={m.to} className="moduleNextCard">
              <img src={m.img} alt="" loading="lazy" />
              <div>
                <strong>{m.title}</strong>
                <span>{m.note}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
export default ModuleNext;
