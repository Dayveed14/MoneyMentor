import { useState } from "react";
import TryIt from "./TryIt";
import { buzz } from "../motion/hooks";

const MESSAGES = {
  otp: {
    from: "+234 901 555 0192",
    channel: "SMS",
    parts: [
      { t: "Dear Customer, " },
      { t: "your account will be BLOCKED within 24 hours", flag: "Pressure and threats. Banks don't threaten to block you by text." },
      { t: " due to BVN update. " },
      { t: "Reply with the 6-digit OTP sent to your phone", flag: "Nobody legitimate ever asks for your OTP. Not your bank, not anyone." },
      { t: " to keep it active. " },
      { t: "Do not share this message with anyone.", flag: "Secrecy. They don't want someone to warn you." },
      { t: " Thank you. " },
      { t: "Bank Support Team", flag: "Vague sender. Real messages come from your bank's registered name, not a random number." },
    ],
  },
  phishing: {
    from: "security@myb4nk-verify.com",
    channel: "Email",
    parts: [
      { t: "Hello, " },
      { t: "we noticed unusual activity on your account", flag: "Scary but vague. It's designed to make you act before thinking." },
      { t: ". To avoid suspension, " },
      { t: "click here: http://myb4nk-verify.com/login", flag: "Lookalike web address. Type your bank's address yourself or use the app." },
      { t: " and " },
      { t: "enter your card number, PIN and password", flag: "No real bank asks for your PIN or password by email or on a link." },
      { t: " " },
      { t: "within 2 hours", flag: "A deadline to rush you." },
      { t: ". Regards, Customer Care." },
    ],
  },
};

/** Tap the parts of a message that give the scam away. */
function SpotTheFlags({ message = "otp" }) {
  const msg = MESSAGES[message];
  const flags = msg.parts.filter((p) => p.flag);
  const [found, setFound] = useState([]);
  const [miss, setMiss] = useState(null);
  const [last, setLast] = useState(null);
  const all = found.length === flags.length;

  const tap = (idx, part) => {
    if (part.flag) {
      if (!found.includes(idx)) {
        setFound((f) => [...f, idx]);
        setLast(part.flag);
        buzz(15);
      }
    } else {
      setMiss(idx);
      setTimeout(() => setMiss(null), 450);
    }
  };

  return (
    <TryIt title="Spot the red flags" hint={`Tap every part of this ${msg.channel.toLowerCase()} that gives the scam away.`}>
      <div className="phoneMsg">
        <div className="pmHead"><span className="pmAvatar" aria-hidden="true">?</span><div><strong>{msg.from}</strong><span>{msg.channel}</span></div></div>
        <p className="pmBody">
          {msg.parts.map((p, idx) => (
            <button key={idx} type="button"
              className={`seg ${found.includes(idx) ? "found" : ""} ${miss === idx ? "miss" : ""}`}
              onClick={() => tap(idx, p)}>
              {p.t}
            </button>
          ))}
        </p>
      </div>
      <div className="flagMeter" aria-live="polite">
        <div className="fmDots" aria-hidden="true">{flags.map((_, i) => <span key={i} className={i < found.length ? "on" : ""} />)}</div>
        <span className="num">{found.length} of {flags.length} red flags found</span>
      </div>
      {last && !all && <p key={last} className="tryNote pop bad">{last}</p>}
      {all && (
        <div className="tryNote pop good">
          <strong>All found. You&apos;d have spotted this one.</strong>
          <ul>{flags.map((f) => <li key={f.flag}>{f.flag}</li>)}</ul>
        </div>
      )}
      {!all && found.length > 0 && (
        <button type="button" className="linkBtn" onClick={() => setFound(msg.parts.map((p, i) => (p.flag ? i : -1)).filter((i) => i >= 0))}>Show me all of them</button>
      )}
    </TryIt>
  );
}
export default SpotTheFlags;
