import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { apiPost } from "../config/api";
import "./ContactUs.css";

const EMPTY = { name: "", email: "", subject: "", message: "" };

const infoCards = [
  {
    title: "Address",
    lines: ["123 Financial Street", "Money District, FN 12345"],
    icon: (
      <>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </>
    ),
  },
  {
    title: "Phone",
    lines: ["+1 (555) 123-4567", "Mon-Fri 9am-6pm"],
    icon: (
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
    ),
  },
  {
    title: "Email",
    lines: ["support@moneymentor.com", "info@moneymentor.com"],
    icon: (
      <>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
      </>
    ),
  },
];

const ContactUs = () => {
  const [params] = useSearchParams();
  // Links like "Ask us about this message" open the form ready to send
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    subject: (params.get("subject") || "").slice(0, 200),
    message: (params.get("message") || "").slice(0, 5000),
  }));
  const isScamQuestion = /scam/i.test(params.get("subject") || "");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSending(true);
    try {
      const data = await apiPost("api/contact.php", form);
      if (!data.success) throw new Error(data.message || "Your message didn't send. Try again.");
      setSent(true);
      setForm(EMPTY);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-container">
        <div className="contact-header">
          <h1 className="contact-title">{isScamQuestion ? "Ask us about a message" : "Get in touch"}</h1>
          <p className="contact-subtitle">
            {isScamQuestion
              ? "Paste the message or describe what happened. Don't include your PIN, OTP or passwords. We'll reply with a plain answer and what to do next."
              : "Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible."}
          </p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            {infoCards.map((card) => (
              <div className="info-card" key={card.title}>
                <div className="info-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    {card.icon}
                  </svg>
                </div>
                <h3>{card.title}</h3>
                <p>
                  {card.lines[0]}
                  <br />
                  {card.lines[1]}
                </p>
              </div>
            ))}
          </div>

          <div className="contact-form-wrapper">
            {sent && (
              <div className="success-message" role="status">
                Message sent. We&apos;ll reply to your email within two working days.
              </div>
            )}
            {error && (
              <div className="error-message" role="alert">
                {error}
              </div>
            )}
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input type="text" id="name" name="name" placeholder="Enter your name" autoComplete="name" value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input type="email" id="email" name="email" placeholder="Enter your email" autoComplete="email" value={form.email} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label htmlFor="subject">Subject</label>
                <input type="text" id="subject" name="subject" placeholder="What is this regarding?" value={form.subject} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea id="message" name="message" rows="6" placeholder="Tell us how we can help you" value={form.message} onChange={handleChange} required></textarea>
              </div>

              <button type="submit" className="contact-btn" disabled={sending}>
                {sending ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
