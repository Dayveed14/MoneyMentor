import { Link } from "react-router-dom";
import { useArticles } from "../lib/articles";
import ArticleCard, { ArticleCardSkeleton } from "./ArticleCard";
import "./ArticlesPreview.css";

function ArticlesPreview() {
  const { articles, loading, error, reload } = useArticles({ page: 1, limit: 4 });
  const [featured, ...rest] = articles;

  return (
    <section className="articlesPreview" id="articles">
      <div className="wrap">
        <div className="previewHead">
          <div>
            <p className="kicker">Articles</p>
            <h2>Fresh reads on money, minus the jargon</h2>
          </div>
          <Link to="/articles" className="btn btn-ghost">See all articles</Link>
        </div>

        {loading ? (
          <div className="previewGrid">
            <ArticleCardSkeleton variant="card" />
            <div className="previewList">
              <ArticleCardSkeleton variant="row" />
              <ArticleCardSkeleton variant="row" />
              <ArticleCardSkeleton variant="row" />
            </div>
          </div>
        ) : error ? (
          <div className="previewState">
            <p>{error}</p>
            <button type="button" className="btn btn-solid" onClick={reload}>Try again</button>
          </div>
        ) : !featured ? (
          <div className="previewState">
            <p>No articles yet. New guides are on the way.</p>
          </div>
        ) : (
          <div className="previewGrid">
            <ArticleCard article={featured} variant="card" />
            <div className="previewList">
              {rest.map((a) => (
                <ArticleCard key={a.id} article={a} variant="row" />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
export default ArticlesPreview;
