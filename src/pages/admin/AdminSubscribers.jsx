import { useState } from "react";
import { apiPost } from "../../config/api";
import { useAdmin, SectionState, Pager, shortDate } from "./adminShared";

function AdminSubscribers() {
  const [page, setPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const { data, loading, error, reload } = useAdmin(`api/admin_subscribers.php?page=${page}`);

  const remove = async (id) => {
    await apiPost("api/admin_subscribers.php", { action: "delete", id }).catch(() => {});
    setConfirmId(null);
    reload();
  };

  return (
    <div className="content-section">
      <div className="dash-toolbar">
        {data && <span className="dash-muted">{data.pagination.total} subscriber{data.pagination.total === 1 ? "" : "s"}. Use Export Data to download the list.</span>}
      </div>
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <div className="table-container">
          <table className="data-table">
            <thead><tr><th>Email</th><th>Subscribed</th><th>Actions</th></tr></thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr><td colSpan={3} className="table-empty">No subscribers yet. People join from the form in the site footer.</td></tr>
              ) : data.data.map((s) => (
                <tr key={s.id}>
                  <td>{s.email}</td>
                  <td>{shortDate(s.created_at)}</td>
                  <td className="dash-actions">
                    {confirmId === s.id ? (
                      <>
                        <button type="button" className="action-btn danger" onClick={() => remove(s.id)}>Confirm remove</button>
                        <button type="button" className="action-btn" onClick={() => setConfirmId(null)}>Keep</button>
                      </>
                    ) : (
                      <button type="button" className="action-btn" onClick={() => setConfirmId(s.id)}>Remove</button>
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
export default AdminSubscribers;
