import { useState } from "react";
import { apiPost } from "../../config/api";
import { updateStoredUser } from "../../utils/auth";
import { useAuth } from "../../context/AuthContext";

function Settings() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [nameMsg, setNameMsg] = useState(null);
  const [pw, setPw] = useState({ current: "", next: "", confirm: "" });
  const [pwMsg, setPwMsg] = useState(null);
  const [busy, setBusy] = useState("");

  const saveName = async (e) => {
    e.preventDefault();
    setBusy("name");
    setNameMsg(null);
    try {
      const res = await apiPost("api/profile.php", { action: "update_name", name });
      if (!res.success) throw new Error(res.message);
      updateStoredUser(res.user);
      setNameMsg({ ok: true, text: "Name updated." });
    } catch (err) {
      setNameMsg({ ok: false, text: err.message });
    } finally {
      setBusy("");
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.next !== pw.confirm) {
      setPwMsg({ ok: false, text: "The new passwords don't match." });
      return;
    }
    setBusy("pw");
    try {
      const res = await apiPost("api/profile.php", {
        action: "change_password", current_password: pw.current, new_password: pw.next,
      });
      if (!res.success) throw new Error(res.message);
      setPw({ current: "", next: "", confirm: "" });
      setPwMsg({ ok: true, text: "Password changed. Use it next time you log in." });
    } catch (err) {
      setPwMsg({ ok: false, text: err.message });
    } finally {
      setBusy("");
    }
  };

  return (
    <>
      <header className="accHead">
        <div>
          <h1>Settings</h1>
          <p>Manage your profile and password.</p>
        </div>
      </header>

      <div className="settingsGrid">
        <form className="accPanel settingsForm" onSubmit={saveName}>
          <h2>Profile</h2>
          <label>
            <span>Full name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required minLength={2} maxLength={120} />
          </label>
          <label>
            <span>Email</span>
            <input value={user?.email || ""} disabled />
            <small>Contact us if you need to change your email.</small>
          </label>
          {nameMsg && <p className={nameMsg.ok ? "formOk" : "formErr"} role="status">{nameMsg.text}</p>}
          <button type="submit" className="btn btn-solid" disabled={busy === "name" || name.trim() === user?.name}>
            {busy === "name" ? "Saving..." : "Save name"}
          </button>
        </form>

        <form className="accPanel settingsForm" onSubmit={savePassword}>
          <h2>Password</h2>
          <label>
            <span>Current password</span>
            <input type="password" value={pw.current} onChange={(e) => setPw({ ...pw, current: e.target.value })} autoComplete="current-password" required />
          </label>
          <label>
            <span>New password</span>
            <input type="password" value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} autoComplete="new-password" minLength={8} maxLength={72} required />
            <small>At least 8 characters.</small>
          </label>
          <label>
            <span>Confirm new password</span>
            <input type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} autoComplete="new-password" required />
          </label>
          {pwMsg && <p className={pwMsg.ok ? "formOk" : "formErr"} role="status">{pwMsg.text}</p>}
          <button type="submit" className="btn btn-solid" disabled={busy === "pw"}>
            {busy === "pw" ? "Changing..." : "Change password"}
          </button>
        </form>

        <section className="accPanel settingsForm">
          <h2>Log out</h2>
          <p className="muted">Sign out of MoneyMentor on this device.</p>
          <button type="button" className="btn btn-ghost" onClick={logout}>Log out</button>
        </section>
      </div>
    </>
  );
}
export default Settings;
