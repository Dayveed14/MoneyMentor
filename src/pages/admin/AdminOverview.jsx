import { FiUsers, FiFileText, FiAward, FiMail, FiAlertTriangle } from "react-icons/fi";
import { useAdmin, SectionState, timeAgo } from "./adminShared";

const ACTIVITY_ICON = { user: "👤", article: "📝", message: "✉️" };

function AdminOverview({ goTo }) {
  const { data, loading, error, reload } = useAdmin("api/admin_stats.php");
  if (!data) return <div className="content-section"><SectionState loading={loading} error={error} onRetry={reload} /></div>;
  const s = data.stats;
  const cards = [
    { label: "Total users", value: s.users_total, change: `+${s.users_last_30_days} in the last 30 days`, color: "blue", icon: FiUsers, positive: s.users_last_30_days > 0, tab: "users" },
    { label: "Lessons completed", value: s.lessons_completed ?? 0, change: `${s.quiz_attempts ?? 0} quiz attempts, ${s.active_learners ?? 0} active this month`, color: "purple", icon: FiAward, tab: "learning" },
    { label: "Published articles", value: s.articles_published, change: `${s.articles_draft} draft${s.articles_draft === 1 ? "" : "s"}, ${Number(s.views_total).toLocaleString()} views`, color: "green", icon: FiFileText, tab: "articles" },
    { label: "Unread messages", value: s.messages_unread, change: `${s.subscribers_total} newsletter subscriber${s.subscribers_total === 1 ? "" : "s"}`, color: "orange", icon: FiMail, tab: "messages" },
  ];
  return (
    <div className="content-section">
      <div className="stats-grid">
        {cards.map(({ label, value, change, color, icon: Icon, positive, tab }) => (
          <button type="button" className="stat-card stat-link" key={label} onClick={() => goTo(tab)}>
            <div className={`stat-icon ${color}`}><Icon size={24} aria-hidden="true" /></div>
            <div className="stat-info">
              <p className="stat-label">{label}</p>
              <h3 className="stat-value">{Number(value).toLocaleString()}</h3>
              <p className={`stat-change ${positive ? "positive" : ""}`}>{change}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="quickActions">
        <button type="button" className="quickAction" onClick={() => goTo("alerts", true)}>
          <FiAlertTriangle aria-hidden="true" /> Publish a scam alert
        </button>
        <button type="button" className="quickAction" onClick={() => goTo("articles", true)}>
          <FiFileText aria-hidden="true" /> Write an article
        </button>
        <button type="button" className="quickAction" onClick={() => goTo("users", true)}>
          <FiUsers aria-hidden="true" /> Add a user
        </button>
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
export default AdminOverview;
