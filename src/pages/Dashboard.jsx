import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FiGrid, FiUsers, FiFileText, FiBarChart2, FiMail, FiSend, FiAlertTriangle,
  FiLogOut, FiPlus, FiHome, FiDownload,
} from "react-icons/fi";
import { getUser } from "../utils/auth";
import { useAuth } from "../context/AuthContext";
import { downloadCsv } from "./admin/adminShared";
import AdminOverview from "./admin/AdminOverview";
import AdminUsers from "./admin/AdminUsers";
import AdminArticles from "./admin/AdminArticles";
import AdminLearning from "./admin/AdminLearning";
import AdminMessages from "./admin/AdminMessages";
import AdminSubscribers from "./admin/AdminSubscribers";
import AdminAlerts from "./admin/AdminAlerts";
import "./Dashboard.css";

const TABS = [
  { id: "overview", label: "Overview", icon: FiGrid },
  { id: "users", label: "Users", icon: FiUsers, add: "Add user", export: "users" },
  { id: "articles", label: "Articles", icon: FiFileText, add: "Write article", export: "articles" },
  { id: "alerts", label: "Scam alerts", icon: FiAlertTriangle, add: "New alert" },
  { id: "learning", label: "Learning & quizzes", icon: FiBarChart2 },
  { id: "messages", label: "Messages", icon: FiMail, export: "messages" },
  { id: "subscribers", label: "Subscribers", icon: FiSend, export: "subscribers" },
];

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [addTick, setAddTick] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const navigate = useNavigate();
  const { logout } = useAuth();
  const user = getUser();
  const tab = TABS.find((t) => t.id === activeTab);

  const handleLogout = () => {
    navigate("/login", { replace: true });
    logout();
  };

  const addNew = (tabId = activeTab) => {
    if (tabId === "articles") {
      navigate("/addarticle");
      return;
    }
    setActiveTab(tabId);
    setAddTick((n) => n + 1); // tells the tab to open its "add" form
  };

  const goTo = (tabId, add = false) => (add ? addNew(tabId) : setActiveTab(tabId));

  const exportCsv = async () => {
    setExporting(true);
    setExportError("");
    try {
      await downloadCsv(tab.export);
    } catch (err) {
      setExportError(err.message);
    } finally {
      setExporting(false);
    }
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
            <button key={id} type="button" className={activeTab === id ? "nav-item active" : "nav-item"}
              aria-current={activeTab === id ? "page" : undefined} title={label}
              onClick={() => { setActiveTab(id); setAddTick(0); }}>
              <Icon size={20} aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <Link to="/" className="nav-item" title="View site">
            <FiHome size={20} aria-hidden="true" />
            <span>View site</span>
          </Link>
          <button type="button" className="nav-item" onClick={handleLogout} title="Log out">
            <FiLogOut size={20} aria-hidden="true" />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>{tab.label}</h1>
          <div className="header-actions">
            {tab.export && (
              <button type="button" className="btn-secondary" onClick={exportCsv} disabled={exporting}>
                <FiDownload size={16} aria-hidden="true" /> {exporting ? "Preparing..." : "Export CSV"}
              </button>
            )}
            {tab.add && (
              <button type="button" className="btn-primary" onClick={() => addNew()}>
                <FiPlus size={16} aria-hidden="true" /> {tab.add}
              </button>
            )}
          </div>
        </div>
        {exportError && <p className="formErr" role="alert">{exportError}</p>}

        {activeTab === "overview" && <AdminOverview goTo={goTo} />}
        {activeTab === "users" && <AdminUsers addTick={addTick} me={user} />}
        {activeTab === "articles" && <AdminArticles />}
        {activeTab === "alerts" && <AdminAlerts addTick={addTick} />}
        {activeTab === "learning" && <AdminLearning />}
        {activeTab === "messages" && <AdminMessages />}
        {activeTab === "subscribers" && <AdminSubscribers />}
      </main>
    </div>
  );
};

export default Dashboard;
