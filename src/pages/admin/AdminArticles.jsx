import { useState } from "react";
import { Link } from "react-router-dom";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, Pager, shortDate } from "./adminShared";

function AdminArticles() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [notice, setNotice] = useState("");
  const { data, loading, error, reload } = useAdmin(`api/admin_articles.php?page=${page}&status=${status}`);

  const act = async (action, id) => {
    setBusy(id);
    setNotice("");
    try {
      const res = await apiPost("api/admin_articles.php", { action, id });
      if (!res.success) throw new Error(res.message);
      setNotice(res.message);
      setConfirmId(null);
      reload();
    } catch (err) {
      setNotice(err.message || "That didn't work. Try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="content-section">
      <div className="dash-toolbar">
        <div className="dash-filter" role="group" aria-label="Filter by status">
          {[["", "All"], ["published", "Published"], ["draft", "Drafts"]].map(([v, label]) => (
            <button key={v} type="button" className={status === v ? "on" : ""} aria-pressed={status === v}
              onClick={() => { setStatus(v); setPage(1); }}>{label}</button>
          ))}
        </div>
        {notice && <span className="dash-notice" role="status">{notice}</span>}
      </div>
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Author</th><th>Date</th><th>Views</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr><td colSpan={7} className="table-empty">No articles here yet. Click <strong>Add New</strong> to write one.</td></tr>
              ) : data.data.map((a) => (
                <tr key={a.id}>
                  <td><Link to={`/article/${a.id}`} className="dash-link">{a.title}</Link></td>
                  <td>{a.category}</td>
                  <td>{a.author_name || "—"}</td>
                  <td>{shortDate(a.published_date || a.created_at)}</td>
                  <td className="num">{Number(a.view_count).toLocaleString()}</td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                  <td className="dash-actions">
                    <Link to={`/editarticle/${a.id}`} className="action-btn">Edit</Link>
                    {a.status === "draft" ? (
                      <button type="button" className="action-btn" disabled={busy === a.id} onClick={() => act("publish", a.id)}>Publish</button>
                    ) : (
                      <button type="button" className="action-btn" disabled={busy === a.id} onClick={() => act("unpublish", a.id)}>Unpublish</button>
                    )}
                    {confirmId === a.id ? (
                      <>
                        <button type="button" className="action-btn danger" disabled={busy === a.id} onClick={() => act("delete", a.id)}>Confirm delete</button>
                        <button type="button" className="action-btn" onClick={() => setConfirmId(null)}>Keep</button>
                      </>
                    ) : (
                      <button type="button" className="action-btn" onClick={() => setConfirmId(a.id)}>Delete</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pager page={page} totalPages={data.pagination.total_pages} onChange={setPage} />}
    </div>
  );
}
export default AdminArticles;
