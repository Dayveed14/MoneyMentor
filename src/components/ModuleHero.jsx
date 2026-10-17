import { Link } from "react-router-dom";
import FadeUp from "./FadeUp";
import "./ModuleHero.css";

/**
 * Title + offset-framed image + big quote.
 * Shared by the Modules list and the Savings / Budget / FinLit pages.
 */
function ModuleHero({ title, image, imageAlt, quote, animate = false, long = false, crumb = true }) {
  return (
    <div className="savingsContainer">
      <div className="savingsWrapper">
        {crumb && (
          <nav className="moduleCrumb" aria-label="Breadcrumb">
            <Link to="/#modules">Modules</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page">{title}</span>
          </nav>
        )}
        <h1 className="savingsTitle">{title}</h1>

        <div className="savingsContent">
          <div className="imageContainer">
            <div className="backgroundBox" aria-hidden="true"></div>
            <img src={image} alt={imageAlt} className="savingsImage" />
          </div>

          <div className={long ? "textContainer2" : "textContainer"}>
            {animate ? (
              <FadeUp className={long ? "savingsQuote2" : "savingsQuote"}>{quote}</FadeUp>
            ) : (
              <p className={long ? "savingsQuote2" : "savingsQuote"}>{quote}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ModuleHero;
