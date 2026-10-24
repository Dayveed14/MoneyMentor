import { HiExternalLink } from "react-icons/hi";
import { Link } from "react-router-dom";
import ScamChecker from "../components/ScamChecker";
import RedFlagCheck from "../components/RedFlagCheck";
import ShareButtons from "../components/ShareButtons";
import "../components/ScamChecker.css";
import "./SafetyPages.css";

const FCCPC = "https://fccpc.gov.ng/registration-of-digital-money-lenders/approvals-of-dmls/";
const SEC = "https://sec.gov.ng/";

const LOAN_QS = [
  { q: "Is the app or company missing from the FCCPC list of approved digital lenders?", why: "Only lenders approved by the FCCPC may lend digitally in Nigeria.", critical: true },
  { q: "Do they want a fee before you receive the loan?", why: "Real lenders never charge before paying out. Upfront fees are a classic loan scam.", critical: true },
  { q: "Does the app ask for access to your contacts, photos or call logs?", why: "That access can be used to shame you to your friends if you pay late." },
  { q: "Is the interest quoted per day or per week, or not shown at all?", why: "Daily or weekly rates hide very high yearly costs. Ask for the total you'll repay." },
  { q: "Are they pushing you to decide right now?", why: "Pressure stops you from comparing or checking the lender." },
];

const INVEST_QS = [
  { q: "Are returns guaranteed, or more than a few percent a month?", why: "No real investment guarantees high returns. This is how Ponzi schemes attract people.", critical: true },
  { q: "Do you earn bonuses for bringing in new people?", why: "Schemes that pay for recruiting need new money to survive, and collapse when it slows.", critical: true },
  { q: "Can you not find the company or scheme registered with SEC Nigeria?", why: "Investment schemes offered to the public should be registered. Check SEC's website and warnings." },
  { q: "Is it vague about how the money is actually made?", why: "If you can't explain where the profit comes from, you can't judge the risk." },
  { q: "Are withdrawals \"delayed\", or do you have to pay to withdraw?", why: "Delayed withdrawals and withdrawal fees are often the first sign of collapse." },
];

/** One place to check a message, a loan app or an investment before trusting it. */
function Verify() {
  return (
    <div className="safetyPage">
      <header className="verifyHero">
        <div className="wrap">
          <h1>Check before you trust</h1>
          <p>Three quick checks that catch most scams: a suspicious message, a loan app, and an investment offer.</p>
          <nav className="verifyJump" aria-label="Checks on this page">
            <a href="#check">A message or call</a>
            <a href="#loan">A loan app</a>
            <a href="#invest">An investment</a>
          </nav>
        </div>
      </header>

      <div className="wrap safetyBody">
        <section className="verifySection" aria-label="Check a message">
          <ScamChecker />
        </section>

        <section className="verifySection" id="loan" aria-labelledby="loan-h">
          <div className="verifyHead">
            <h2 id="loan-h">Is this loan app safe?</h2>
            <p>
              Start by searching for the app and company name on the{" "}
              <a href={FCCPC} target="_blank" rel="noopener noreferrer">FCCPC list of approved digital lenders <HiExternalLink aria-hidden="true" /></a>.
              Then answer these:
            </p>
          </div>
          <RedFlagCheck
            id="loan"
            questions={LOAN_QS}
            verdicts={{ high: "Don't borrow from this lender", medium: "Be careful: check this before you borrow", low: "No red flags. Still read the total cost before you sign" }}>
            <p className="verdictMore">
              Being harassed by a loan app? Report it to the FCCPC and keep screenshots. <Link to="/module/debt">Learn more about loan apps</Link>.
            </p>
          </RedFlagCheck>
        </section>

        <section className="verifySection" id="invest" aria-labelledby="invest-h">
          <div className="verifyHead">
            <h2 id="invest-h">Is this investment real?</h2>
            <p>
              Check the company on <a href={SEC} target="_blank" rel="noopener noreferrer">SEC Nigeria&apos;s website <HiExternalLink aria-hidden="true" /></a>,
              including its warnings about unregistered schemes. Then answer these:
            </p>
          </div>
          <RedFlagCheck
            id="invest"
            questions={INVEST_QS}
            verdicts={{ high: "This looks like a Ponzi scheme. Don't invest", medium: "Warning signs: get advice before you invest", low: "No red flags. Only invest money you can afford to leave alone" }}>
            <p className="verdictMore">
              <Link to="/module/investing">Learn how to spot Ponzi schemes</Link> · <Link to="/report">Report a scheme</Link>
            </p>
          </RedFlagCheck>
        </section>

        <div className="helpShare">
          <p>Know someone about to borrow or invest? Send them this page:</p>
          <ShareButtons share="page=verify" text="Before you borrow from a loan app or join an investment, check it here:" />
        </div>
      </div>
    </div>
  );
}
export default Verify;
