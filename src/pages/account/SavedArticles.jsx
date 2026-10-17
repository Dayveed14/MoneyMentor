import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiFetch, apiPost } from "../../config/api";
import ArticleCard, { ArticleCardSkeleton } from "../../components/ArticleCard";

function SavedArticles() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("api/saved_articles.php")
      .then((r) => (r.success ? setArticles(r.data) : setError(r.message)))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const remove = async (id) => {
    setArticles((list) => list.filter((a) => a.id !== id));
    try {
      await apiPost("api/saved_articles.php", { article_id: id, saved: false });
    } catch {
      /* will reappear on next load if it failed */
    }
  };

  return (
    <>
      <header className="accHead">
        <div>
          <h1>Saved articles</h1>
          <p>Articles you&apos;ve saved to read later.</p>
        </div>
      </header>
      {error && <div className="accError" role="alert">{error}</div>}
      {loading ? (
        <div className="savedGrid">
          <ArticleCardSkeleton /><ArticleCardSkeleton /><ArticleCardSkeleton />
        </div>
      ) : articles.length === 0 ? (
        <section className="accPanel emptyPanel">
          <h2>Nothing saved yet</h2>
          <p>When you find an article worth coming back to, tap “Save” and it will appear here.</p>
          <Link to="/articles" className="btn btn-solid">Browse articles</Link>
        </section>
      ) : (
        <div className="savedGrid">
          {articles.map((a) => (
            <div className="savedItem" key={a.id}>
              <ArticleCard article={a} />
              <button type="button" className="removeSaved" onClick={() => remove(a.id)}>
                Remove from saved
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
export default SavedArticles;
