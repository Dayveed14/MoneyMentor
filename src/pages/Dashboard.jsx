import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiGrid, FiUsers, FiFileText, FiBookOpen, FiHelpCircle, FiAward,
  FiDollarSign, FiMessageSquare, FiTv, FiLogOut, FiPlus, FiHome, FiClock,
  FiEye, FiMail, FiRefreshCw,
} from "react-icons/fi";
import { apiFetch, apiPost } from "../config/api";
import { clearSession, getUser } from "../utils/auth";
import "./Dashboard.css";

const TABS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "articles", label: "Articles", icon: FiFileText, addPath: "/addarticle" },
  { id: "modules", label: "Learning Modules", icon: FiBookOpen },
  { id: "quizzes", label: "Quizzes & Assessments", icon: FiHelpCircle },
  { id: "achievements", label: "Achievements", icon: FiAward },
  { id: "simulations", label: "Simulations", icon: FiDollarSign },
  { id: "community", label: "Community", icon: FiMessageSquare },
  { id: "webinars", label: "Webinars", icon: FiTv },
];

const ACTIVITY_ICON = { user: "👤", article: "📝", message: "✉️" };

function timeAgo(value) {
  const d = new Date(String(value).replace(" ", "T") + "Z");
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (Number.isNaN(mins)) return "";
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs === 1 ? "" : "s"} ago`;
  const days = Math.round(hrs / 24);
  return days < 30 ? `${days} day${days === 1 ? "" : "s"} ago` : d.toLocaleDateString();
}

const shortDate = (v) => (v ? new Date(String(v).replace(" ", "T") + "Z").toLocaleDateString() : "—");

/** Loads an admin endpoint; returns { data, loading, error, reload }. */
function useAdmin(path) {
  const [state, setState] = useState({ data: null, loading: true, error: "" });
  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: "" }));
    try {
      const res = await apiFetch(path);
      if (!res.success) throw new Error(res.message || "Couldn't load this section.");
      setState({ data: res, loading: false, error: "" });
    } catch (err) {
      setState({ data: null, loading: false, error: err.message });
    }
  }, [path]);
  useEffect(() => {
    load();
  }, [load]);
  return { ...state, reload: load };
}

function SectionState({ loading, error, onRetry }) {
  if (loading) return <p className="dash-loading">Loading…</p>;
  if (error)
    return (
      <div className="dash-error" role="alert">
        <p>{error}</p>
        <button type="button" className="btn-secondary" onClick={onRetry}>
          <FiRefreshCw size={14} aria-hidden="true" /> Try again
        </button>
      </div>
    );
  return null;
}

function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="dash-pager">
      <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" className="btn-secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

function Overview() {
  const { data, loading, error, reload } = useAdmin("api/admin_stats.php");
  if (!data) return <div className="content-section"><SectionState loading={loading} error={error} onRetry={reload} /></div>;
  const s = data.stats;
  const cards = [
    { label: "Total users", value: s.users_total, change: `+${s.users_last_30_days} in the last 30 days`, color: "blue", icon: FiUsers, positive: s.users_last_30_days > 0 },
    { label: "Published articles", value: s.articles_published, change: `${s.articles_draft} draft${s.articles_draft === 1 ? "" : "s"} waiting`, color: "green", icon: FiFileText },
    { label: "Article views", value: s.views_total, change: "All time", color: "purple", icon: FiEye },
    { label: "Newsletter subscribers", value: s.subscribers_total, change: `${s.messages_unread} unread contact message${s.messages_unread === 1 ? "" : "s"}`, color: "orange", icon: FiMail },
  ];
  return (
    <div className="content-section">
      <div className="stats-grid">
        {cards.map(({ label, value, change, color, icon: Icon, positive }) => (
          <div className="stat-card" key={label}>
            <div className={`stat-icon ${color}`}><Icon size={24} aria-hidden="true" /></div>
            <div className="stat-info">
              <p className="stat-label">{label}</p>
              <h3 className="stat-value">{Number(value).toLocaleString()}</h3>
              <p className={`stat-change ${positive ? "positive" : ""}`}>{change}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="recent-activity">
        <h2>Recent activity</h2>
        {data.activity.length === 0 ? (
          <p className="dash-muted">Nothing yet. New sign-ups, articles and messages will show up here.</p>
        ) : (
          <div className="activity-list">
            {data.activity.map((a, i) => (
              <div className="activity-item" key={i}>
                <div className="activity-icon" aria-hidden="true">{ACTIVITY_ICON[a.type] || "•"}</div>
                <div className="activity-details">
                  <p className="activity-title">{a.title}</p>
                  <p className="activity-time">{timeAgo(a.at)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function UsersTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const { data, loading, error, reload } = useAdmin(
    `api/admin_users.php?page=${page}&search=${encodeURIComponent(query)}`
  );
  useEffect(() => {
    const t = setTimeout(() => { setQuery(search.trim()); setPage(1); }, 350);
    return () => clearTimeout(t);
  }, [search]);
  return (
    <div className="content-section">
      <div className="dash-toolbar">
        <input type="search" className="dash-search" placeholder="Search by name or email"
          aria-label="Search users" value={search} onChange={(e) => setSearch(e.target.value)} />
        {data && <span className="dash-muted">{data.pagination.total} users</span>}
      </div>
      <SectionState loading={loading && !data} error={error} onRetry={reload} />
      {data && (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Last login</th></tr>
            </thead>
            <tbody>
              {data.data.length === 0 ? (
                <tr><td colSpan={5} className="table-empty">{query ? "No users match that search." : "No users yet."}</td></tr>
              ) : data.data.map((u) => (
                <tr key={u.id}>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td><span className={`badge ${u.role === "admin" ? "published" : "active"}`}>{u.role}</span></td>
                  <td>{shortDate(u.created_at)}</td>
                  <td>{u.last_login ? timeAgo(u.last_login) : "Never"}</td>
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

function ArticlesTab() {
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
                  <td>{Number(a.view_count).toLocaleString()}</td>
                  <td><span className={`badge ${a.status}`}>{a.status}</span></td>
                  <td className="dash-actions">
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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();
  const user = getUser();
  const tab = TABS.find((t) => t.id === activeTab);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <h2>MoneyMentor Admin</h2>
          {user?.email && <p className="sidebar-user">{user.email}</p>}
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard sections">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              className={activeTab === id ? "nav-item active" : "nav-item"}
              aria-current={activeTab === id ? "page" : undefined}
              title={label}
              onClick={() => setActiveTab(id)}>
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item" title="View site">
            <FiHome size={20} aria-hidden="true" />
            <span>View Site</span>
          </Link>
          <button type="button" className="nav-item" onClick={handleLogout} title="Logout">
            <FiLogOut size={20} aria-hidden="true" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>{tab.label}</h1>
          <div className="header-actions">
            <button type="button" className="btn-secondary" disabled title="Coming soon">
              Export Data
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate(tab.addPath)}
              disabled={!tab.addPath}
              title={tab.addPath ? `Add new ${tab.label.toLowerCase()}` : "Coming soon"}>
              <FiPlus size={16} aria-hidden="true" />
              Add New
            </button>
          </div>
        </div>

        {activeTab === "overview" && <Overview />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "articles" && <ArticlesTab />}

        {!["overview", "users", "articles"].includes(activeTab) && (
          <div className="content-section">
            <div className="dash-empty">
              <FiClock size={44} aria-hidden="true" />
              <h3>{tab.label} coming soon</h3>
              <p>This section is being built. Check back soon to manage {tab.label.toLowerCase()} here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
