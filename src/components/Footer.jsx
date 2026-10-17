import { useState } from "react";
import { Link } from "react-router-dom";
import { BsTwitterX, BsFacebook } from "react-icons/bs";
import { AiFillInstagram } from "react-icons/ai";
import { FaLongArrowAltRight } from "react-icons/fa";
import logo from "../assets/images/logo.png";
import { apiPost } from "../config/api";
import "./Footer.css";

function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await apiPost("api/subscribe.php", { email });
      if (!data.success) throw new Error(data.message);
      setSubscribed(true);
      setEmail("");
    } catch (err) {
      setError(err.message || "That didn't work. Try again.");
    }
  };

  return (
    <footer className="mainFooter">
      <div className="wrap footerGrid">
        <div className="footerBrand">
          <Link to="/">
            <img src={logo} alt="MoneyMentor home" width="197" height="47" />
          </Link>
          <p>Practical money lessons for everyday people.</p>
          <div className="footerIcons">
            <a href="#" aria-label="MoneyMentor on X"><BsTwitterX /></a>
            <a href="#" aria-label="MoneyMentor on Facebook"><BsFacebook /></a>
            <a href="#" aria-label="MoneyMentor on Instagram"><AiFillInstagram /></a>
          </div>
        </div>

        <nav className="footerCol" aria-label="Learn">
          <h3>Learn</h3>
          <Link to="/savings">Saving strategy</Link>
          <Link to="/budget">Budgeting</Link>
          <Link to="/finlit">Financial literacy 101</Link>
          <Link to="/articles">Articles</Link>
        </nav>

        <nav className="footerCol" aria-label="Company">
          <h3>Know more</h3>
          <Link to="/#about">About</Link>
          <Link to="/contactUs">Contact us</Link>
          <Link to="/login">Log in</Link>
          <Link to="/signup">Sign up</Link>
        </nav>

        <div className="footerSub">
          <h3>Subscribe</h3>
          <p>Get new articles and money tips in your inbox.</p>
          {subscribed ? (
            <p className="footerThanks">You&apos;re subscribed. Look out for our next email.</p>
          ) : (
            <form className="subForm" onSubmit={handleSubscribe}>
              <input
                type="email"
                placeholder="you@example.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" aria-label="Subscribe">
                <FaLongArrowAltRight />
              </button>
            </form>
          )}
          {error && <p className="footerError" role="alert">{error}</p>}
        </div>
      </div>
      <div className="wrap footerBottom">
        <p>© {new Date().getFullYear()} MoneyMentor. All rights reserved.</p>
      </div>
    </footer>
  );
}
export default Footer;
