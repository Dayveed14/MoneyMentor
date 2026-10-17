import { useState } from "react";
import ModuleHero from "../components/ModuleHero";
import ModuleNext from "../components/ModuleNext";
import finlitImg from "../assets/images/finlit.webp";
import spamImg from "../assets/images/spam.webp";
import scamImg from "../assets/images/scam-mail.webp";
import phishingImg from "../assets/images/phishing.webp";
import otpImg from "../assets/images/otp-fraud.webp";
import atmImg from "../assets/images/atm-fraud.webp";
import "./ModulePage.css";

const threats = [
  {
    title: "Handling Spam",
    img: spamImg,
    text: "Spam emails and messages have become a common nuisance in the digital landscape. These unsolicited communications often promise enticing offers or urgent requests, luring unsuspecting individuals into potential traps. Solution: Be cautious of unsolicited emails or messages. Avoid clicking on links or sharing personal information without verifying the source. Mark suspicious emails as spam and regularly update your email security settings.",
  },
  {
    title: "Scam Mail",
    img: scamImg,
    text: "Scam mail involves receiving fraudulent letters or notices that promise unrealistic rewards or demand urgent actions in exchange for money. Solution: Be skeptical of unexpected correspondence. Verify the authenticity of letters, especially those demanding payments. Reach out to your bank directly to confirm any requests before taking action.",
  },
  {
    title: "Phishing",
    img: phishingImg,
    text: "Phishing is a technique where fraudsters impersonate legitimate entities, such as banks, to deceive individuals into revealing sensitive information. Solution: Always verify the sender's identity before responding to any communication. Check for official email addresses, domain names, and communication channels. Avoid sharing personal or financial details through unfamiliar links.",
  },
  {
    title: "OTP Fraud",
    img: otpImg,
    text: "One-Time Password (OTP) fraud involves cybercriminals tricking individuals into sharing their OTP, usually through fake calls or messages. They use the OTP to gain unauthorized access to accounts. Solution: Never share your OTP with anyone, whether via call, message, or email. Legitimate organizations will never ask for your OTP. If in doubt, contact your bank directly using official contact details.",
  },
  {
    title: "ATM Card Fraud",
    img: atmImg,
    text: "ATM card fraud encompasses various tactics, including card skimming and card cloning, which criminals use to gain unauthorized access to your account. Solution: Regularly inspect ATMs for unusual devices, cover the keypad while entering your PIN, and monitor your account for unauthorized transactions. If your card is lost or stolen, immediately report it to your bank.",
  },
];

function FinLit101() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <ModuleHero
        title="Financial literacy 101"
        image={finlitImg}
        imageAlt="Person reviewing financial charts"
        quote="Welcome to the “Financial Literacy 101” section, where we not only equip you with financial knowledge but also arm you with essential insights to safeguard your hard-earned money. In today's digital age, the banking sector faces a range of security challenges that you need to be aware of."
        animate
        long
      />

      <div className="savings-btn">
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="savingsButton"
          aria-expanded={showMore}
          aria-controls="finlit-more">
          {showMore ? "Show less" : "Get started"}
        </button>
      </div>

      {showMore && (
        <div className="expandedContent" id="finlit-more">
          <div className="centeredTextSection">
            <p className="centeredText">
              In the “Financial Literacy 101” section, we lay the foundation for
              your financial education. From understanding basic financial
              concepts to demystifying complex terminology, these modules
              provide a solid grounding in the world of finance. We'll guide you
              through topics such as understanding interest rates, deciphering
              credit scores, and grasping the nuances of loans and debts. With
              interactive tutorials, videos, and quizzes, you'll gain the
              confidence to navigate financial discussions with ease.
            </p>
          </div>

          {threats.map((t, i) => (
            <div className="imageTextSection" key={t.title}>
              {/* text-left / image-right on every other row, as before */}
              <div className={`imageTextWrapper ${i % 2 === 0 ? "reverse" : ""}`}>
                <div className="leftImageContainer">
                  <img src={t.img} width="500" height="500" alt={t.title} className="sectionImage" loading="lazy" />
                </div>
                <div className="rightTextContainer">
                  <h2 className="sectionHeading">{t.title}</h2>
                  <p className="sectionText">{t.text}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="centeredTextSection">
            <p className="centeredText">
              Your financial security is of utmost importance. By staying
              informed and adopting these precautions, you'll be better equipped
              to navigate the digital landscape and protect yourself from
              potential threats. At MoneyMentor, we're dedicated to ensuring
              that your journey towards financial literacy includes a strong
              foundation in security awareness.
            </p>
          </div>
        </div>
      )}
      <ModuleNext current="/finlit" />
    </>
  );
}

export default FinLit101;
