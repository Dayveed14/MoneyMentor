import { Link } from "react-router-dom";
import ScamChecker from "../components/ScamChecker";
import GoldenRules from "../components/GoldenRules";
import ScamAlerts from "../components/ScamAlerts";
import AskBand from "../components/AskBand";
import "./AlertsPage.css";

function AlertsPage() {
  return (
    <>
      <header className="alertsHero">
        <div className="wrap alertsHeroInner">
          <div>
            <h1>Scam alerts and checks</h1>
            <p>
              Check a suspicious message, learn the signs of the scams going around right now, and
              know exactly what to do if something feels wrong.
            </p>
            <div className="alreadyBox">
              <h2>Already shared a code or sent money?</h2>
              <ol>
                <li>Call your bank now, using the number on your card or in its app, and ask them to block your account and cards.</li>
                <li>Change your banking and email passwords from a device you trust.</li>
                <li>Report it to your bank in writing and keep screenshots of the messages.</li>
                <li><Link to={`/contactUs?subject=${encodeURIComponent("I think I've been scammed")}`}>Tell us what happened</Link> and we&apos;ll help you work out next steps.</li>
              </ol>
            </div>
          </div>
          <ScamChecker />
        </div>
      </header>
      <ScamAlerts showHeader={false} />
      <GoldenRules />
      <AskBand />
    </>
  );
}
export default AlertsPage;
