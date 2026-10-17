import { Link } from "react-router-dom";
import { articleImage, FALLBACK_ARTICLE_IMG, readingTime } from "../lib/articles";
import "./ArticleCard.css";

/** variant: "card" (grid), "feature" (large, image left), "row" (compact list) */
// Image width to request from Cloudinary for each layout (2x for sharp screens)
const IMAGE_WIDTH = { card: 800, feature: 1200, row: 300 };

function ArticleCard({ article, variant = "card" }) {
  return (
    <Link to={`/article/${article.id}`} state={{ article }} className={`aCard aCard-${variant}`}>
      <div className="aCardImg">
        <img
          src={articleImage(article, IMAGE_WIDTH[variant])}
          alt=""
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK_ARTICLE_IMG;
          }}
        />
      </div>
      <div className="aCardBody">
        {article.category && <span className="aTag">{article.category}</span>}
        <h3>{article.title}</h3>
        {variant !== "row" && article.summary && <p>{article.summary}</p>}
        <span className="aMeta num">
          {readingTime(article)} min read
          {article.view_count != null && (
            <span>{Number(article.view_count).toLocaleString()} views</span>
          )}
        </span>
      </div>
    </Link>
  );
}

export function ArticleCardSkeleton({ variant = "card" }) {
  return (
    <div className={`aCard aCard-${variant} aSkeleton`} aria-hidden="true">
      <div className="aCardImg" />
      <div className="aCardBody">
        <span className="skLine short" />
        <span className="skLine" />
        <span className="skLine" />
      </div>
    </div>
  );
}

export default ArticleCard;
