import { Link } from "react-router-dom";
import { HiPlay } from "react-icons/hi";
import Reveal from "../motion/Reveal";
import "./SimulatorBand.css";

/** Home page invitation to the scam simulator, with a looping mini chat. */
function SimulatorBand() {
  return (
    <section className="simBand" aria-labelledby="simband-h">
      <div className="wrap simBandGrid">
        <Reveal>
          <p className="simKicker">New · Scam simulator</p>
          <h2 id="simband-h">Can you spot the scam before it&apos;s too late?</h2>
          <p>
            Answer a &quot;bank&quot; call, read a BVN text, deal with a pushy loan agent. Six real situations, played out on a pretend phone.
            Get it wrong here, so you never get it wrong for real.
          </p>
          <Link to="/simulator" className="btn simBandBtn"><HiPlay aria-hidden="true" /> Play the simulator</Link>
        </Reveal>
        <div className="miniPhone" aria-hidden="true">
          <div className="mpHead"><span className="mpDot" /> 0700 225 5000</div>
          <div className="mpChat">
            <span className="mp b1">This is your bank. Your account is being emptied!</span>
            <span className="mp b2">Read me the code we just sent you, quickly.</span>
            <span className="mp b3 sys">Your OTP is 482 913. Do not share.</span>
            <span className="mpStamp">SCAM</span>
          </div>
          <div className="mpChoices"><span>Read the code</span><span className="good">Hang up</span></div>
        </div>
      </div>
    </section>
  );
}
export default SimulatorBand;
