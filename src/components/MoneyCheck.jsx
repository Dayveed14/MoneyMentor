import { useState } from "react";
import { Link } from "react-router-dom";
import { HiCheckCircle, HiXCircle } from "react-icons/hi";
import "./MoneyCheck.css";

const QUESTIONS = [
  {
    q: "You put ₦100,000 in savings at 10% a year. After 5 years, roughly how much do you have?",
    options: [
      "Exactly ₦150,000",
      "More than ₦150,000",
      "Less than ₦150,000",
    ],
    answer: 1,
    why: "Interest can earn interest. That's compounding, and with annual compounding, ₦100,000 grows to about ₦161,051 after 5 years.",
    module: { to: "/finlit", label: "Financial literacy 101" },
  },
  {
    q: "You receive a message from 'your bank' asking you to share the OTP sent to your phone. What do you do?",
    options: [
      "Send it because the message claims to be from my bank",
      "Ignore the request and contact the bank through its official channels",
      "Reply to the message to ask who they are",
    ],
    answer: 1,
    why: "Never share your OTP with someone who contacts you. Scammers can impersonate banks to gain access to your account. Contact your bank using its official phone number or app.",
    module: { to: "/finlit", label: "Financial literacy 101" },
  },
  {
    q: "Using the 50/30/20 budgeting rule, how much of a ₦100,000 monthly income should go towards savings and debt repayment?",
    options: ["₦10,000", "₦20,000", "₦30,000"],
    answer: 1,
    why: "The 50/30/20 rule allocates 50% to needs, 30% to wants, and 20% to savings and debt repayment. You can adjust these percentages to suit your income and living costs.",
    module: { to: "/budget", label: "Budgeting & expense tracking" },
  },
];

function MoneyCheck() {
  const [step, setStep] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);

  const done = step >= QUESTIONS.length;
  const item = QUESTIONS[step];

  const choose = (i) => {
    if (picked !== null) return;

    setPicked(i);

    if (i === item.answer) {
      setScore((s) => s + 1);
    }
  };

  const next = () => {
    setPicked(null);
    setStep((s) => s + 1);
  };

  const restart = () => {
    setStep(0);
    setPicked(null);
    setScore(0);
  };

  return (
    <section className="moneyCheck" id="quiz">
      <div className="wrap checkInner">
        <div className="checkIntro">
          <h2>How money-smart are you?</h2>

          <p>
            Three quick questions. No sign-up, and your answers stay on this page.
          </p>

          <div className="checkProgress" aria-hidden="true">
            {QUESTIONS.map((_, i) => (
              <span
                key={i}
                className={
                  i < step || done
                    ? "filled"
                    : i === step
                      ? "current"
                      : ""
                }
              />
            ))}
          </div>
        </div>

        <div className="checkCard" aria-live="polite">
          {done ? (
            <div className="checkResult">
              <p className="checkScore num">
                {score}/{QUESTIONS.length}
              </p>

              <h3>
                {score === 3
                  ? "Sharp. You've got the basics down."
                  : score === 2
                    ? "Nearly there. One gap to close."
                    : "Good start. These modules will fill the gaps."}
              </h3>

              <p>
                Pick up where the questions left off with a full module.
              </p>

              <div className="checkActions">
                <Link to="/#modules" className="btn btn-solid">
                  See the modules
                </Link>

                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={restart}
                >
                  Try again
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="checkCount">
                Question {step + 1} of {QUESTIONS.length}
              </p>

              <h3>{item.q}</h3>

              <div className="checkOptions">
                {item.options.map((opt, i) => {
                  const state =
                    picked === null
                      ? ""
                      : i === item.answer
                        ? "right"
                        : i === picked
                          ? "wrong"
                          : "dim";

                  return (
                    <button
                      key={opt}
                      type="button"
                      className={`checkOpt ${state}`}
                      onClick={() => choose(i)}
                      disabled={picked !== null}
                    >
                      {opt}

                      {state === "right" && (
                        <HiCheckCircle aria-label="Correct" />
                      )}

                      {state === "wrong" && (
                        <HiXCircle aria-label="Incorrect" />
                      )}
                    </button>
                  );
                })}
              </div>

              {picked !== null && (
                <div className="checkWhy">
                  <p>{item.why}</p>

                  <div className="checkWhyRow">
                    <Link to={item.module.to}>
                      Learn more in {item.module.label}
                    </Link>

                    <button
                      type="button"
                      className="btn btn-solid"
                      onClick={next}
                    >
                      {step === QUESTIONS.length - 1
                        ? "See my score"
                        : "Next question"}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default MoneyCheck;