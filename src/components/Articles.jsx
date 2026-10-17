import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch, apiUrl } from "../config/api";
import "./Articles.css";

export const FALLBACK_ARTICLE_IMG =
  "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=600&fit=crop";

const Articles = ({ title = "Articles", limit = 4 }) => {
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const previousPage = useRef(1);

  const [articles, setArticles] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchArticles = useCallback(
    async (page) => {
      setLoading(true);
      setError("");

      try {
        const data = await apiFetch(
          `api/get_articles.php?page=${page}&limit=${limit}`
        );

        if (data.success) {
          setArticles(Array.isArray(data.data) ? data.data : []);
          setTotalPages(data.pagination?.total_pages || 1);
        } else {
          setError(data.message || "Failed to load articles");
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
        setError("Failed to load articles. Please try again.");
      } finally {
        setLoading(false);
      }
    },
    [limit]
  );

  // Fetch articles whenever the current page changes.
  useEffect(() => {
    fetchArticles(currentPage);
  }, [currentPage, fetchArticles]);

  // Scroll to the Articles section only when pagination changes.
  // This does not scroll on the initial render, including in StrictMode.
  useEffect(() => {
    if (previousPage.current === currentPage) {
      return;
    }

    previousPage.current = currentPage;

    sectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [currentPage]);

  const openArticle = (article) => {
    navigate(`/article/${article.id}`, {
      state: { article },
    });
  };

  const handleKeyDown = (e, article) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openArticle(article);
    }
  };

  return (
    <section className="articles-container" ref={sectionRef}>
      <div className="articles-header">
        <h2>{title}</h2>
        <div className="divider"></div>
      </div>

      {loading ? (
        <div
          className="articles-grid"
          aria-busy="true"
          aria-label="Loading articles"
        >
          {Array.from({ length: limit }).map((_, i) => (
            <div className="article-box skeleton" key={i}>
              <div className="article-image-wrapper"></div>

              <div className="article-content">
                <div className="skeleton-line"></div>
                <div className="skeleton-line short"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="error-state">
          <p>{error}</p>

          <button
            type="button"
            onClick={() => fetchArticles(currentPage)}
          >
            Try Again
          </button>
        </div>
      ) : articles.length === 0 ? (
        <div className="empty-state">
          <p>No articles published yet.</p>
        </div>
      ) : (
        <>
          <div className="articles-grid">
            {articles.map((article) => (
              <article
                key={article.id}
                role="link"
                tabIndex={0}
                onClick={() => openArticle(article)}
                onKeyDown={(e) => handleKeyDown(e, article)}
                className="article-box"
              >
                <div className="article-image-wrapper">
                  <img
                    src={apiUrl(article.image_path)}
                    alt={article.title}
                    className="article-image"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = FALLBACK_ARTICLE_IMG;
                    }}
                  />

                  <div className="article-overlay">
                    <p className="article-summary">
                      {article.summary}
                    </p>
                  </div>
                </div>

                <div className="article-content">
                  <h3 className="article-title">
                    {article.title}
                  </h3>

                  <div className="article-meta">
                    <span className="article-category">
                      {article.category}
                    </span>

                    <span className="article-views">
                      {Number(
                        article.view_count || 0
                      ).toLocaleString()}{" "}
                      views
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {totalPages > 1 && (
            <nav
              className="pagination"
              aria-label="Articles pages"
            >
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) => Math.max(1, p - 1))
                }
                disabled={currentPage === 1}
                className="pagination-btn"
                aria-label="Previous page"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>

              <div className="pagination-numbers">
                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                ).map((page) => (
                  <button
                    type="button"
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    className={`pagination-number ${
                      currentPage === page ? "active" : ""
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="pagination-btn"
                aria-label="Next page"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </nav>
          )}
        </>
      )}
    </section>
  );
};

export default Articles;