import { FaHeadSideVirus, FaUserClock } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { PiMoneyWavyFill } from "react-icons/pi";
import "./Advantage.css";

const FEATURES = [
  { icon: FaHeadSideVirus, title: "A learning path that fits you", text: "A short check-in finds what you already know, then builds a path around your gaps and goals." },
  { icon: FaUserClock, title: "Modules that hold your attention", text: "Short lessons, real-world scenarios and quick quizzes make money concepts stick." },
  { icon: HiUserGroup, title: "People to learn with", text: "Swap experiences and questions with other learners and financial experts." },
  { icon: PiMoneyWavyFill, title: "Budgeting that actually happens", text: "Set goals, plan a budget and see where your money goes, without spreadsheets." },
];

function Advantage() {
  return (
    <section className="advantage" id="why">
      <div className="wrap advantageInner">
        <div className="advantageIntro">
          <p className="kicker">The MoneyMentor advantage</p>
          <h2>Built for people who were never taught money at school</h2>
          <p>
            We create opportunities for you to build a strong foundation of
            financial knowledge, one practical step at a time.
          </p>
        </div>
        <ul className="advantageList">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="advIcon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default Advantage;
