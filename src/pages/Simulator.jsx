import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { HiPhone, HiChatAlt2, HiMail, HiShieldCheck, HiExclamation, HiArrowLeft, HiRefresh, HiCheckCircle, HiXCircle } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { SCENARIOS, START_BALANCE, loadResults, saveResult } from "../data/simulator";
import { money } from "../lib/format";
import { useCountUp, useReducedMotion, buzz } from "../motion/hooks";
import Confetti from "../motion/Confetti";
import ShareButtons from "../components/ShareButtons";
import "./Simulator.css";

const CHANNEL = {
  call: { icon: HiPhone, label: "Phone call" },
  sms: { icon: HiChatAlt2, label: "SMS" },
  whatsapp: { icon: FaWhatsapp, label: "WhatsApp" },
  email: { icon: HiMail, label: "Email" },
};

function Balance({ value }) {
  const v = useCountUp(value, { duration: 1400 });
  return <span className="num">{money(v)}</span>;
}

/** Plays one scenario: messages arrive one at a time, then the learner chooses. */
function Play({ scenario, onExit, onDone }) {
  const reduced = useReducedMotion();
  const [log, setLog] = useState([]); // messages shown so far
  const [queue, setQueue] = useState(scenario.nodes.start.msgs);
  const [node, setNode] = useState("start");
  const [typing, setTyping] = useState(false);
  const [outcome, setOutcome] = useState(null); // { end, lost, story }
  const [balance, setBalance] = useState(START_BALANCE);
  const scroller = useRef(null);
  const side = useRef(null);
  const ch = CHANNEL[scenario.channel];

  // Reveal queued messages one by one with a typing indicator
  useEffect(() => {
    if (!queue.length) return;
    const [msg, ...rest] = queue;
    const wait = reduced ? 0 : msg.from === "them" ? Math.min(1600, 500 + msg.text.length * 12) : 450;
    setTyping(msg.from === "them" && !reduced);
    const t = setTimeout(() => {
      setTyping(false);
      setLog((l) => [...l, msg]);
      setQueue(rest);
      if (msg.from !== "me") buzz(10);
    }, wait);
    return () => clearTimeout(t);
  }, [queue, reduced]);

  // On phones the result sits under the phone: bring it into view
  useEffect(() => {
    if (outcome && window.innerWidth < 860) {
      setTimeout(() => side.current?.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "start" }), 300);
    }
  }, [outcome, reduced]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: reduced ? "auto" : "smooth" });
  }, [log, typing, outcome, reduced]);

  const choose = (c) => {
    const mine = c.reply ? [{ from: "me", text: c.reply }] : [];
    if (c.goto) {
      setNode(c.goto);
      setLog((l) => [...l, ...mine]);
      setQueue(scenario.nodes[c.goto].msgs);
      return;
    }
    setLog((l) => [...l, ...mine]);
    setNode(null);
    const lost = c.end === "lose" ? c.lost || 0 : 0;
    setTimeout(() => {
      setOutcome({ end: c.end, lost, story: c.story });
      if (lost) {
        setBalance(START_BALANCE - lost);
        buzz([60, 80, 60]);
      }
      onDone(scenario.id, c.end);
    }, reduced ? 0 : 600);
  };

  const current = node && !queue.length && !typing ? scenario.nodes[node] : null;

  return (
    <div className="simPlay">
      <button type="button" className="simBack" onClick={onExit}><HiArrowLeft aria-hidden="true" /> All scenarios</button>
      <div className="simStage">
        <div className={`phone ${outcome ? `ended ${outcome.end}` : ""}`}>
          <div className="phoneTop">
            <span className="phoneNotch" aria-hidden="true" />
            <div className="balanceBar">
              <span>Your balance</span>
              <strong className={outcome?.lost ? "drain" : ""}><Balance value={balance} /></strong>
            </div>
            <div className={`chatHead ch-${scenario.channel}`}>
              <span className="chAvatar" aria-hidden="true"><ch.icon /></span>
              <div>
                <strong>{scenario.contact}</strong>
                <span>{scenario.contactNote || ch.label}</span>
              </div>
            </div>
          </div>
          <div className="chat" ref={scroller} aria-live="polite">
            {log.map((m, i) => (
              <div key={i} className={`bubble ${m.from}`}>{m.text}</div>
            ))}
            {typing && <div className="bubble them typing" aria-label="Typing"><i /><i /><i /></div>}
          </div>
          {current && (
            <div className="choices">
              <p>What do you do?</p>
              {current.choices.map((c) => (
                <button key={c.label} type="button" onClick={() => choose(c)}>{c.label}</button>
              ))}
            </div>
          )}
        </div>

        <aside className="simSide" aria-live="polite" ref={side}>
          {!outcome ? (
            <div className="simHint">
              <h2>{scenario.title}</h2>
              <p>{scenario.teaser}</p>
              <p className="muted small">Play it like real life. Nothing here touches your real money.</p>
            </div>
          ) : (
            <div className={`simOutcome ${outcome.end}`}>
              {outcome.end === "win" && <Confetti pieces={60} />}
              <div className="soIcon">{outcome.end === "win" ? <HiShieldCheck aria-hidden="true" /> : <HiExclamation aria-hidden="true" />}</div>
              <h2>{outcome.end === "win" ? "You spotted the scam!" : `You lost ${money(outcome.lost)}`}</h2>
              <p>{outcome.story}</p>
              <h3>The red flags</h3>
              <ul className="stagger">
                {scenario.flags.map((f) => <li key={f}>{f}</li>)}
              </ul>
              <div className="soActions">
                <button type="button" className="btn btn-ghost" onClick={() => onExit("again")}><HiRefresh aria-hidden="true" /> Try again</button>
                <button type="button" className="btn btn-solid" onClick={() => onExit("next")}>Next scenario</button>
              </div>
              {scenario.lesson && (
                <Link className="soLesson" to={`/learn/${scenario.lesson.module}?lesson=${scenario.lesson.lesson}`}>Learn more in the lesson</Link>
              )}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

/** Can you spot the scam? Six real-life scenarios in a pretend phone. */
function Simulator() {
  const [results, setResults] = useState(loadResults);
  const [playing, setPlaying] = useState(null);
  const [round, setRound] = useState(0);
  const won = SCENARIOS.filter((s) => results[s.id] === "win").length;
  const all = won === SCENARIOS.length;

  const exit = (what) => {
    const i = SCENARIOS.findIndex((s) => s.id === playing);
    if (what === "again") setRound((r) => r + 1);
    else if (what === "next") setPlaying(SCENARIOS[(i + 1) % SCENARIOS.length].id);
    else setPlaying(null);
    window.scrollTo({ top: 0 });
  };

  if (playing) {
    const s = SCENARIOS.find((x) => x.id === playing);
    return (
      <div className="simulator">
        <div className="wrap">
          <Play key={`${playing}-${round}`} scenario={s} onExit={exit} onDone={(id, end) => setResults(saveResult(id, end))} />
        </div>
      </div>
    );
  }

  return (
    <div className="simulator">
      <header className="simHero">
        <div className="wrap">
          <p className="simKicker">Scam simulator</p>
          <h1>Can you spot the scam?</h1>
          <p>Six situations Nigerians face every day. Answer the call, read the text, decide what to do, and see what happens. It&apos;s safe to get it wrong here.</p>
          <div className="simScore" aria-label={`${won} of ${SCENARIOS.length} spotted`}>
            <div className="ssBar"><span style={{ width: `${(won / SCENARIOS.length) * 100}%` }} /></div>
            <span className="num">{won} of {SCENARIOS.length} spotted{all ? " · Scam spotter!" : ""}</span>
          </div>
        </div>
      </header>
      <div className="wrap simGridWrap">
        <ul className="simGrid stagger">
          {SCENARIOS.map((s) => {
            const Icon = CHANNEL[s.channel].icon;
            const r = results[s.id];
            return (
              <li key={s.id}>
                <button type="button" className={`simCard ${r || ""}`} onClick={() => { setPlaying(s.id); window.scrollTo({ top: 0 }); }}>
                  <span className={`simIcon ch-${s.channel}`}><Icon aria-hidden="true" /></span>
                  <strong>{s.title}</strong>
                  <span>{s.teaser}</span>
                  <em>
                    {r === "win" ? <><HiCheckCircle aria-hidden="true" /> Spotted</> : r === "lose" ? <><HiXCircle aria-hidden="true" /> Caught out. Try again</> : `${CHANNEL[s.channel].label} · Play`}
                  </em>
                </button>
              </li>
            );
          })}
        </ul>
        <div className="helpShare">
          <p>Think your family would get caught? Challenge them:</p>
          <ShareButtons share="page=simulator" text={`I spotted ${won} of ${SCENARIOS.length} scams on MoneyMentor's scam simulator. Can you beat me?`} />
        </div>
      </div>
    </div>
  );
}
export default Simulator;
