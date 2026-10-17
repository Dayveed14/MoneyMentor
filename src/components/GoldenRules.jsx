import { HiKey, HiPhone, HiLink, HiClock, HiCash, HiUserGroup } from "react-icons/hi";
import "./GoldenRules.css";

const RULES = [
  { icon: HiKey, title: "Never share your OTP, PIN or password", text: "Not with a caller, not with \"customer care\", not with anyone. Your bank already has what it needs." },
  { icon: HiPhone, title: "Hang up and call back yourself", text: "Use the number on your card or in the official app, never a number the caller gives you." },
  { icon: HiLink, title: "Don't tap links in surprise messages", text: "Open your bank's app or type its website address yourself." },
  { icon: HiClock, title: "Pressure is a red flag", text: "\"Act now or lose your account\" is designed to stop you thinking. Real banks give you time." },
  { icon: HiCash, title: "Never pay to receive money", text: "No genuine prize, loan, grant or job asks for a fee first." },
  { icon: HiUserGroup, title: "Talk to someone before you act", text: "A friend, family member, your bank, or us. Scammers want you alone and in a hurry." },
];

function GoldenRules() {
  return (
    <section className="rules" id="safety">
      <div className="wrap">
        <div className="rulesHead">
          <h2>Six rules that stop most scams</h2>
          <p>Share them with your family. Most fraud works because someone, somewhere, didn&apos;t know one of these.</p>
        </div>
        <ul className="rulesGrid">
          {RULES.map(({ icon: Icon, title, text }) => (
            <li key={title}>
              <span className="ruleIcon"><Icon aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
export default GoldenRules;
