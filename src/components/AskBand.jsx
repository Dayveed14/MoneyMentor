import { Link } from "react-router-dom";
import "./AskBand.css";

/** The "trusted place to ask" promise. */
function AskBand() {
  return (
    <section className="askBand">
      <div className="wrap askInner">
        <div>
          <h2>Not sure about a call, text or offer? Ask us first.</h2>
          <p>
            Send us the message or tell us what happened. We&apos;ll tell you plainly whether it looks
            like a scam and what to do next. It&apos;s free, and there&apos;s no such thing as a silly question.
          </p>
        </div>
        <div className="askActions">
          <Link to={`/contactUs?subject=${encodeURIComponent("Is this a scam?")}`} className="btn askBtn">Ask about a message</Link>
          <Link to="/alerts#check" className="askLink">Or check it yourself</Link>
        </div>
      </div>
    </section>
  );
}
export default AskBand;
