import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { HiSearch, HiX } from "react-icons/hi";
import { useArticles, ARTICLE_CATEGORIES } from "../lib/articles";
import ArticleCard, { ArticleCardSkeleton } from "../components/ArticleCard";
import "./ArticlesPage.css";

const PER_PAGE = 9;

function ArticlesPage() {
  // Filters live in the URL, so a filtered view can be shared or bookmarked
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const search = params.get("q") || "";
  const page = Math.max(1, Number(params.get("page")) || 1);
  const [query, setQuery] = useState(search);

  const { articles, totalPages, loading, error, reload } = useArticles({
    page, limit: PER_PAGE, category, search,
  });

  const update = (changes) => {
    const next = new URLSearchParams(params);
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    if (!("page" in changes)) next.delete("page");
    setParams(next);
  };

  // Search after the user stops typing
  useEffect(() => {
    if (query === search) return;
    const t = setTimeout(() => update({ q: query.trim() }), 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const goToPage = (p) => {
    update({ page: p > 1 ? String(p) : "" });
    document.getElementById("article-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filtered = Boolean(category || search);
  const showFeature = !filtered && page === 1 && articles.length > 2;
  const [feature, ...others] = articles;
  const gridItems = showFeature ? others : articles;

  return (
    <div className="articlesPage">
      <header className="articlesHero">
        <div className="wrap">
          <h1>Articles</h1>
          <p>Plain-language guides on budgeting, saving, investing and keeping your money safe.</p>

          <div className="articleSearch">
            <HiSearch aria-hidden="true" />
            <input
              type="search"
              placeholder="Search articles"
              aria-label="Search articles"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button type="button" aria-label="Clear search" onClick={() => setQuery("")}>
                <HiX />
              </button>
            )}
          </div>

          <div className="chipRow" role="toolbar" aria-label="Filter by topic">
            <button type="button" className={!category ? "chip on" : "chip"} aria-pressed={!category}
              onClick={() => update({ category: "" })}>
              All topics
            </button>
            {ARTICLE_CATEGORIES.map((c) => (
              <button key={c} type="button" className={category === c ? "chip on" : "chip"}
                aria-pressed={category === c} onClick={() => update({ category: category === c ? "" : c })}>
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      <section className="wrap articlesResults" id="article-results">
        {filtered && !loading && !error && (
          <p className="resultsNote">
            {articles.length} {articles.length === 1 ? "article" : "articles"}
            {category && <> in <strong>{category}</strong></>}
            {search && <> matching <strong>“{search}”</strong></>}
          </p>
        )}

        {loading ? (
          <div className="articlesGrid">
            {Array.from({ length: 6 }).map((_, i) => <ArticleCardSkeleton key={i} />)}
          </div>
        ) : error ? (
          <div className="resultsState">
            <h2>Articles didn&apos;t load</h2>
            <p>{error}</p>
            <button type="button" className="btn btn-solid" onClick={reload}>Try again</button>
          </div>
        ) : articles.length === 0 ? (
          <div className="resultsState">
            <h2>{filtered ? "No articles match that" : "No articles yet"}</h2>
            <p>{filtered ? "Try another topic or a shorter search." : "New guides are on the way. Check back soon."}</p>
            {filtered && (
              <button type="button" className="btn btn-ghost" onClick={() => { setQuery(""); setParams({}); }}>
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <>
            {showFeature && (
              <div className="featureSlot">
                <ArticleCard article={feature} variant="feature" />
              </div>
            )}
            <div className="articlesGrid">
              {gridItems.map((a) => <ArticleCard key={a.id} article={a} />)}
            </div>

            {totalPages > 1 && (
              <nav className="pager" aria-label="Pages">
                <button type="button" onClick={() => goToPage(page - 1)} disabled={page === 1}>Previous</button>
                <div className="pagerNums">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button key={p} type="button" className={p === page ? "on" : ""}
                      aria-current={p === page ? "page" : undefined} onClick={() => goToPage(p)}>
                      {p}
                    </button>
                  ))}
                </div>
                <button type="button" onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</button>
              </nav>
            )}
          </>
        )}
      </section>
    </div>
  );
}
export default ArticlesPage;
