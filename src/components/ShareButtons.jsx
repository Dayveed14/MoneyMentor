import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { HiLink, HiCheck } from "react-icons/hi";
import { apiUrl } from "../config/api";
import "./ShareButtons.css";

/**
 * WhatsApp share + copy link. `share` is the query for the API's share page,
 * e.g. "alert=3" or "article=12" or "page=help-now". That page gives WhatsApp
 * a proper preview (title, summary, image) and then opens the real page.
 */
function shareLink(share) {
  return apiUrl(`api/share.php?${share}`);
}

function ShareButtons({ share, text, label = "Share on WhatsApp", compact = false }) {
  const [copied, setCopied] = useState(false);
  const url = shareLink(share);
  const wa = `https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  };

  return (
    <div className={`shareBtns ${compact ? "compact" : ""}`}>
      <a className="shareWa" href={wa} target="_blank" rel="noopener noreferrer">
        <FaWhatsapp aria-hidden="true" />
        <span>{label}</span>
      </a>
      <button type="button" className="shareCopy" onClick={copy} aria-label="Copy link">
        {copied ? <HiCheck aria-hidden="true" /> : <HiLink aria-hidden="true" />}
        <span>{copied ? "Copied" : "Copy link"}</span>
      </button>
    </div>
  );
}
export default ShareButtons;
