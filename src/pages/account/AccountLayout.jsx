import { NavLink, Outlet } from "react-router-dom";
import { FiGrid, FiBookOpen, FiPieChart, FiBookmark, FiSettings } from "react-icons/fi";
import "./Account.css";

const TABS = [
  { to: "/account", label: "Overview", icon: FiGrid, end: true },
  { to: "/account/modules", label: "My modules", icon: FiBookOpen },
  { to: "/account/budget", label: "Budget planner", icon: FiPieChart },
  { to: "/account/saved", label: "Saved articles", icon: FiBookmark },
  { to: "/account/settings", label: "Settings", icon: FiSettings },
];

function AccountLayout() {
  return (
    <div className="account">
      <div className="accountTabsBar">
        <nav className="wrap accountTabs" aria-label="Your account">
          {TABS.map(({ to, label, icon: Icon, end }) => (
            <NavLink key={to} to={to} end={end} className="accountTab">
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="wrap accountBody">
        <Outlet />
      </div>
    </div>
  );
}
export default AccountLayout;
