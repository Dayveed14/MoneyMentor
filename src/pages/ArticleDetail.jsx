import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { HiArrowLeft, HiLink, HiCheck } from "react-icons/hi";
import { BsTwitterX, BsWhatsapp, BsFacebook } from "react-icons/bs";
import {
  articleImage, FALLBACK_ARTICLE_IMG, fetchArticle, formatDate, readingTime, useArticles,
} from "../lib/articles";
import ArticleCard from "../components/ArticleCard";
import "./ArticleDetail.css";

// Point readers to the module that matches the article's topic
const MODULE_FOR = {
  Savings: { to: "/savings", label: "Saving strategy" },
  Budgeting: { to: "/budget", label: "Budgeting & expense tracking" },
  "Debt Management": { to: "/budget", label: "Budgeting & expense tracking" },
};
const DEFAULT_MODULE = { to: "/finlit", label: "Financial literacy 101" };

function useReadingProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.getElementById("article-body");
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const seen = Math.min(Math.max(-top + window.innerHeight * 0.6, 0), height);
      setProgress(height ? seen / height : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return progress;
}

function ShareButtons({ title }) {
  const [copied, setCopied] = useState(false);
  const url = window.location.href;
  const enc = encodeURIComponent;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  return (
    <div className="shareRow">
      <span>Share</span>
      <button type="button" onClick={copy} aria-label="Copy link">
        {copied ? <HiCheck /> : <HiLink />}
      </button>
      <a href={`https://wa.me/?text=${enc(`${title} ${url}`)}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp"><BsWhatsapp /></a>
      <a href={`https://twitter.com/intent/tweet?text=${enc(title)}&url=${enc(url)}`} target="_blank" rel="noreferrer" aria-label="Share on X"><BsTwitterX /></a>
      <a href={`https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook"><BsFacebook /></a>
      {copied && <em role="status">Link copied</em>}
    </div>
  );
}

function Related({ article }) {
  const { articles } = useArticles({ page: 1, limit: 4, category: article.category || "" });
  const latest = useArticles({ page: 1, limit: 4 });
  const pool = (articles.length > 1 ? articles : latest.articles).filter((a) => String(a.id) !== String(article.id));
  if (!pool.length) return null;
  return (
    <section className="relatedBlock">
      <div className="wrap">
        <h2>Keep reading</h2>
        <div className="relatedGrid">
          {pool.slice(0, 3).map((a) => <ArticleCard key={a.id} article={a} />)}
        </div>
      </div>
    </section>
  );
}

function ArticleDetail() {
  const { id } = useParams();
  const { state } = useLocation();
  const passed = state?.article && String(state.article.id) === String(id) ? state.article : null;
  const [article, setArticle] = useState(passed);
  const [loading, setLoading] = useState(!passed);
  const [error, setError] = useState("");
  const progress = useReadingProgress();

  useEffect(() => {
    let cancelled = false;
    setError("");
    fetchArticle(id)
      .then((data) => {
        if (cancelled) return;
        if (data.success && data.data) setArticle(data.data);
        else if (!passed) setError(data.message || "We couldn't find that article.");
      })
      .catch(() => {
        if (!cancelled && !passed) setError("This article didn't load. Check your connection and try again.");
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [id, passed]);

  useEffect(() => {
    if (article?.title) document.title = `${article.title} | MoneyMentor`;
    return () => {
      document.title = "MoneyMentor";
    };
  }, [article?.title]);

  if (loading) {
    return (
      <div className="wrap articleShell" aria-busy="true">
        <span className="skLine short" />
        <span className="skLine big" />
        <span className="skLine big" />
        <div className="skHero" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="wrap articleShell articleMissing">
        <h1>Article not found</h1>
        <p>{error || "It may have been moved or unpublished."}</p>
        <Link to="/articles" className="btn btn-solid">Browse all articles</Link>
      </div>
    );
  }

  const body = article.body || article.summary || "";
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const module = MODULE_FOR[article.category] || DEFAULT_MODULE;
  const date = formatDate(article.published_date || article.created_at);

  return (
    <>
      <div className="readProgress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />

      <article>
        <header className="articleHead">
          <div className="wrap articleHeadInner">
            <Link to="/articles" className="backLink"><HiArrowLeft /> All articles</Link>
            {article.category && (
              <Link to={`/articles?category=${encodeURIComponent(article.category)}`} className="aTag">
                {article.category}
              </Link>
            )}
            <h1>{article.title}</h1>
            {article.summary && <p className="articleLede">{article.summary}</p>}
            <p className="articleMeta num">
              {date && <span>{date}</span>}
              <span>{readingTime(article)} min read</span>
              {article.view_count != null && <span>{Number(article.view_count).toLocaleString()} views</span>}
            </p>
          </div>
        </header>

        <div className="wrap articleFigure">
          <img
            src={articleImage(article, 1600)}
            alt=""
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = FALLBACK_ARTICLE_IMG;
            }}
          />
        </div>

        <div className="wrap articleLayout">
          <aside className="articleAside">
            <ShareButtons title={article.title} />
          </aside>

          <div className="articleBody" id="article-body">
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}

            <div className="articleModule">
              <div>
                <h2>Put this into practice</h2>
                <p>Go deeper with short lessons and a quiz in {module.label}.</p>
              </div>
              <Link to={module.to} className="btn btn-solid">Start the module</Link>
            </div>
          </div>
        </div>
      </article>

      <Related article={article} />
    </>
  );
}
export default ArticleDetail;
