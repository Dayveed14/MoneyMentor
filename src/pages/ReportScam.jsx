import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { HiPhone, HiChatAlt, HiMail, HiGlobe, HiUsers, HiDotsHorizontal, HiDeviceMobile } from "react-icons/hi";
import { FaWhatsapp } from "react-icons/fa";
import { apiPost } from "../config/api";
import { useAuth } from "../context/AuthContext";
import "./SafetyPages.css";

const CHANNELS = [
  { id: "call", label: "Phone call", icon: HiPhone },
  { id: "sms", label: "SMS", icon: HiDeviceMobile },
  { id: "whatsapp", label: "WhatsApp", icon: FaWhatsapp },
  { id: "email", label: "Email", icon: HiMail },
  { id: "social", label: "Social media", icon: HiChatAlt },
  { id: "website", label: "Website or app", icon: HiGlobe },
  { id: "in_person", label: "In person", icon: HiUsers },
  { id: "other", label: "Other", icon: HiDotsHorizontal },
];

/** Anyone can report a scam; admins review reports and turn them into public alerts. */
function ReportScam() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    channel: "",
    scammer_contact: "",
    description: params.get("message") ? `The message said:\n${params.get("message")}\n\n` : "",
    lost_money: params.get("lost") === "1",
    amount_lost: "",
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.channel) return setError("Choose how the scammer contacted you.");
    setSending(true);
    try {
      const r = await apiPost("api/report_scam.php", { ...form, amount_lost: form.lost_money ? Number(form.amount_lost) || null : null });
      if (!r.success) throw new Error(r.message);
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setError(err.message || "That didn't send. Try again.");
    } finally {
      setSending(false);
    }
  };

  if (done) {
    return (
      <div className="safetyPage">
        <div className="wrap safetyBody narrow">
          <div className="reportDone">
            <h1>Thank you. Your report helps protect others.</h1>
            <p>Our team reviews every report. When we see a scam spreading, we publish an alert so other people can spot it.</p>
            {form.lost_money && (
              <div className="alreadyBox">
                <h2>You lost money: act quickly</h2>
                <p>Call your bank now and ask them to block your account and flag the transfer. <Link to="/help-now">See every step to take now</Link>.</p>
              </div>
            )}
            <div className="helpCtaBtns">
              <Link to="/alerts" className="btn btn-solid">See current scam alerts</Link>
              <Link to="/" className="btn btn-ghost">Back to home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="safetyPage">
      <header className="verifyHero">
        <div className="wrap">
          <h1>Report a scam</h1>
          <p>Seen a scam, or been caught by one? Tell us about it. We use reports to warn other people. Never include your own PIN, OTP or password.</p>
        </div>
      </header>

      <div className="wrap safetyBody narrow">
        <form className="reportForm" onSubmit={submit} noValidate>
          {error && <div className="formErr" role="alert">{error}</div>}

          <fieldset>
            <legend>How did they contact you?</legend>
            <div className="chipGrid">
              {CHANNELS.map(({ id, label, icon: Icon }) => (
                <label key={id} className={`chip ${form.channel === id ? "on" : ""}`}>
                  <input type="radio" name="channel" value={id} checked={form.channel === id} onChange={() => set("channel", id)} />
                  <Icon aria-hidden="true" /> {label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="field">
            <label htmlFor="contact">Number, account, link or username they used <span className="opt">(optional)</span></label>
            <input id="contact" value={form.scammer_contact} maxLength={190} onChange={(e) => set("scammer_contact", e.target.value)}
              placeholder="e.g. 0801 234 5678, an account number, a website" />
          </div>

          <div className="field">
            <label htmlFor="desc">What happened?</label>
            <textarea id="desc" rows={7} value={form.description} maxLength={5000} required onChange={(e) => set("description", e.target.value)}
              placeholder="What did they say or send? What did they ask you to do?" />
          </div>

          <div className="field">
            <label className="check">
              <input type="checkbox" checked={form.lost_money} onChange={(e) => set("lost_money", e.target.checked)} />
              I lost money
            </label>
            {form.lost_money && (
              <div className="amountRow">
                <label htmlFor="amount">About how much? (₦) <span className="opt">(optional)</span></label>
                <input id="amount" type="number" inputMode="decimal" min="0" value={form.amount_lost} onChange={(e) => set("amount_lost", e.target.value)} />
              </div>
            )}
          </div>

          {!user && (
            <div className="fieldRow">
              <div className="field">
                <label htmlFor="rname">Your name <span className="opt">(optional)</span></label>
                <input id="rname" value={form.name} maxLength={120} onChange={(e) => set("name", e.target.value)} />
              </div>
              <div className="field">
                <label htmlFor="remail">Email, if you&apos;d like a reply <span className="opt">(optional)</span></label>
                <input id="remail" type="email" value={form.email} maxLength={190} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
          )}

          <button type="submit" className="btn btn-solid" disabled={sending}>{sending ? "Sending..." : "Send report"}</button>
          <p className="muted small">We never publish your name or contact details.</p>
        </form>
      </div>
    </div>
  );
}
export default ReportScam;
