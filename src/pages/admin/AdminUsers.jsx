import { useEffect, useState } from "react";
import { apiFetch, apiPost } from "../../config/api";
import { useAdmin, SectionState, Pager, Modal, timeAgo, shortDate, suggestPassword } from "./adminShared";
import { moduleById } from "../../data/modules";
import { TOPICS } from "../../data/assessment";

function AddUserModal({ onClose, onDone }) {
  const [form, setForm] = useState({ name: "", email: "", password: suggestPassword(), role: "user" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_users.php", { action: "create", ...form });
      if (!res.success) throw new Error(res.message);
      onDone(`${res.message} Their temporary password is ${form.password}. Ask them to change it in Settings.`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <Modal title="Add a user" onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <label><span>Full name</span><input value={form.name} onChange={set("name")} required minLength={2} maxLength={120} /></label>
        <label><span>Email</span><input type="email" value={form.email} onChange={set("email")} required /></label>
        <label>
          <span>Temporary password</span>
          <div className="inlineField">
            <input value={form.password} onChange={set("password")} required minLength={8} maxLength={72} />
            <button type="button" className="btn-secondary" onClick={() => setForm({ ...form, password: suggestPassword() })}>New</button>
          </div>
          <small>Share it with them privately. They can change it in Settings.</small>
        </label>
        <label>
          <span>Role</span>
          <select value={form.role} onChange={set("role")}>
            <option value="user">Learner</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        {error && <p className="formErr" role="alert">{error}</p>}
        <div className="modalActions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Creating..." : "Create account"}</button>
        </div>
      </form>
    </Modal>
  );
}

function ResetPasswordModal({ user, onClose, onDone }) {
  const [password, setPassword] = useState(suggestPassword());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const res = await apiPost("api/admin_users.php", { action: "reset_password", id: user.id, password });
      if (!res.success) throw new Error(res.message);
      onDone(`Password reset for ${user.name}. New password: ${password}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };
  return (
    <Modal title={`Reset password for ${user.name}`} onClose={onClose}>
      <form className="modalForm" onSubmit={submit}>
        <label>
          <span>New password</span>
          <div className="inlineField">
            <input value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} maxLength={72} />
            <button type="button" className="btn-secondary" onClick={() => setPassword(suggestPassword())}>New</button>
          </div>
          <small>Their old password stops working straight away.</small>
        </label>
        {error && <p className="formErr" role="alert">{error}</p>}
        <div className="modalActions">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={busy}>{busy ? "Saving..." : "Reset password"}</button>
        </div>
      </form>
    </Modal>
  );
}

function UserDetailModal({ userId, onClose }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    apiFetch(`api/admin_user.php?id=${userId}`)
      .then((r) => (r.success ? setData(r) : setError(r.message)))
      .catch((e) => setError(e.message));
  }, [userId]);

  return (
    <Modal title={data ? data.user.name : "Learner"} onClose={onClose} wide>
      {error && <p className="formErr">{error}</p>}
      {!data && !error && <p className="dash-loading">Loading…</p>}
      {data && (
        <div className="userDetail">
          <p className="dash-muted">
            {data.user.email}, {data.user.role === "admin" ? "admin" : "learner"}. Joined {shortDate(data.user.created_at)},
            last login {data.user.last_login ? timeAgo(data.user.last_login) : "never"}.
          </p>

          <h3>Knowledge check</h3>
          {data.assessment ? (
            <>
              <p>
                <span className={`levelChip level-${data.assessment.level.toLowerCase()}`}>{data.assessment.level}</span>{" "}
                {data.assessment.score}/{data.assessment.total} on {shortDate(data.assessment.created_at)}
              </p>
              <div className="topicBars">
                {Object.entries(data.assessment.topic_scores).map(([t, v]) => (
                  <div key={t} className="topicBar">
                    <span>{TOPICS[t]?.label || t}</span>
                    <div className="hbar"><span style={{ width: `${(v / 2) * 100}%` }} /></div>
                    <span className="num">{v}/2</span>
                  </div>
                ))}
              </div>
              {data.assessment.goals.length > 0 && (
                <p className="dash-muted">Goals: {data.assessment.goals.map((g) => TOPICS[g]?.label || g).join(", ")}</p>
              )}
            </>
          ) : (
            <p className="dash-muted">Hasn&apos;t taken the knowledge check yet.</p>
          )}

          <h3>Modules</h3>
          <div className="table-container">
            <table className="data-table">
              <thead><tr><th>Module</th><th>Lessons</th><th>Best quiz</th><th>Attempts</th></tr></thead>
              <tbody>
                {data.modules.map((m) => (
                  <tr key={m.module}>
                    <td>{moduleById(m.module)?.title || m.module}</td>
                    <td className="num">{m.lessons_done}/{m.lessons_total}</td>
                    <td className="num">{m.quiz_best !== null ? `${m.quiz_best}%` : "—"}</td>
                    <td className="num">{m.quiz_attempts}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </Modal>
  );
}

function AdminUsers({ addTick, me }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null); // {type, user}
  const [confirmId, setConfirmId] = useState(null);
  const [notice, setNotice] = useState({ ok: true, text: "" });
  const { data, loading, error, reload } = useAdmin(`api/admin_users.php?page=${page}&search=${encodeURIComponent(query)}`);

  useEffect(() => {
    const t = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    if (addTick) setModal({ type: "add" });
  }, [addTick]);

  const act = async (body, after) => {
    setNotice({ ok: true, text: "" });
    try {
      const res = await apiPost("api/admin_users.php", body);
      if (!res.success) throw new Error(res.message);
      setNotice({ ok: true, text: res.message });
      after?.();
      reload();
    } catch (err) {
      setNotice({ ok: false, text: err.message });
    }
  };

  const done = (text) => {
    setModal(null);
    setNotice({ ok: true, text });
    reload();
  };

  return (
    <div className="content-section">
      <div className="dash-toolbar">
        <input type="search" className="dash-search" placeholder="Search by name or email"
          aria-label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
        {data && <span className="dash-muted">{data.pagination.total} users</span>}
      </div>
      {notice.text && <p className={notice.ok ? "formOk" : "formErr"} role="status">{notice.text}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Level</th><th>Lessons</th><th>Joined</th><th>Last login</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr><td colSpan={8} className="table-empty">{query ? "No users match that search." : "No users yet."}</td></tr>
              ) : data.data.map((u) => (
                <tr key={u.id}>
                  <td><button type="button" className="dash-link linkLike" onClick={() => setModal({ type: "view", user: u })}>{u.name}</button></td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === "admin" ? "published" : "active"}`}>{u.role === "admin" ? "admin" : "learner"}</span></td>
                  <td>{u.level ? <span className={`levelChip level-${u.level.toLowerCase()}`}>{u.level}</span> : <span className="dash-muted">—</span>}</td>
                  <td className="num">{u.lessons_done}</td>
                  <td>{shortDate(u.created_at)}</td>
                  <td>{u.last_login ? timeAgo(u.last_login) : "Never"}</td>
                  <td className="dash-actions">
                    {u.id !== me?.id && (
                      <button type="button" className="action-btn"
                        onClick={() => act({ action: "set_role", id: u.id, role: u.role === "admin" ? "user" : "admin" })}>
                        {u.role === "admin" ? "Make learner" : "Make admin"}
                      </button>
                    )}
                    <button type="button" className="action-btn" onClick={() => setModal({ type: "reset", user: u })}>Reset password</button>
                    {u.id !== me?.id && (confirmId === u.id ? (
                      <>
                        <button type="button" className="action-btn danger" onClick={() => act({ action: "delete", id: u.id }, () => setConfirmId(null))}>Confirm delete</button>
                        <button type="button" className="action-btn" onClick={() => setConfirmId(null)}>Keep</button>
                      </>
                    ) : (
                      <button type="button" className="action-btn" onClick={() => setConfirmId(u.id)}>Delete</button>
                    ))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {data && <Pager page={page} totalPages={data.pagination.total_pages} onChange={setPage} />}

      {modal?.type === "add" && <AddUserModal onClose={() => setModal(null)} onDone={done} />}
      {modal?.type === "reset" && <ResetPasswordModal user={modal.user} onClose={() => setModal(null)} onDone={done} />}
      {modal?.type === "view" && <UserDetailModal userId={modal.user.id} onClose={() => setModal(null)} />}
    </div>
  );
}
export default AdminUsers;
