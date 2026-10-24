import { useState } from "react";
import { apiPost } from "../../config/api";
import { money } from "../../lib/format";
import { useAdmin, SectionState, Pager, timeAgo } from "./adminShared";
import AlertForm from "./AlertForm";

const CHANNEL = { call: "Phone call", sms: "SMS", whatsapp: "WhatsApp", email: "Email", social: "Social media", website: "Website or app", in_person: "In person", other: "Other" };
const FILTERS = [["new", "New"], ["reviewed", "Reviewed"], ["published", "Published"], ["rejected", "Rejected"], ["all", "All"]];

/** Scams reported by visitors. Turn the useful ones into public alerts. */
function AdminReports({ onChange }) {
  const [status, setStatus] = useState("new");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [drafting, setDrafting] = useState(null);
  const [notice, setNotice] = useState("");
  const { data, loading, error, reload } = useAdmin(`api/admin_reports.php?status=${status}&page=${page}`);

  const act = async (action, id, extra = {}) => {
    const res = await apiPost("api/admin_reports.php", { action, id, ...extra }).catch(() => null);
    setNotice(res?.message || "");
    reload();
    onChange?.();
  };

  const toAlert = (r) => {
    const firstLine = r.description.split(/[.\n]/)[0].slice(0, 120);
    setDrafting({
      report_id: r.id,
      title: firstLine,
      summary: r.description.slice(0, 380),
      red_flags: "",
      what_to_do: "Don't reply or send money\nCheck through official channels you already trust\nReport it on MoneyMentor",
      severity: r.lost_money ? "high" : "medium",
      status: "published",
    });
  };

  const total = data ? Object.values(data.counts).reduce((a, b) => a + b, 0) : 0;

  return (
    <div className="content-section">
      {data && total > 0 && (
        <div className="reportStats">
          <div><strong className="num">{total}</strong><span>reports in total</span></div>
          <div><strong className="num">{data.money_lost.reports}</strong><span>people lost money</span></div>
          <div><strong className="num">{money(data.money_lost.total)}</strong><span>reported lost</span></div>
          <div className="reportChannels">
            <span>Most common:</span>
            {data.channels.slice(0, 4).map((c) => <em key={c.channel}>{CHANNEL[c.channel] || c.channel} ({c.count})</em>)}
          </div>
        </div>
      )}

      <div className="dash-toolbar">
        <div className="dash-filter" role="group" aria-label="Filter reports">
          {FILTERS.map(([v, label]) => (
            <button key={v} type="button" className={status === v ? "on" : ""} aria-pressed={status === v} onClick={() => { setStatus(v); setPage(1); }}>
              {label}{data && v !== "all" ? ` (${data.counts[v]})` : ""}
            </button>
          ))}
        </div>
      </div>
      {notice && <p className="formOk" role="status">{notice}</p>}
      <SectionState loading={loading && !data} error={error} onRetry={reload} />

      {data && (data.data.length === 0 ? (
        <p className="table-empty">{status === "new" ? "No new reports. Reports from the Report a scam page appear here." : "Nothing here."}</p>
      ) : (
        <ul className="messageList">
          {data.data.map((r) => (
            <li key={r.id} className={r.status === "new" ? "unread" : ""}>
              <button type="button" className="messageHead" aria-expanded={open === r.id} onClick={() => setOpen(open === r.id ? null : r.id)}>
                <span className="messageDot" aria-hidden="true" />
                <strong>{CHANNEL[r.channel] || r.channel}</strong>
                <span className="messageSubject">
                  {r.description.slice(0, 90)}
                  {r.lost_money && <em className="lostTag">Lost {r.amount_lost ? money(r.amount_lost) : "money"}</em>}
                </span>
                <span className="messageTime">{timeAgo(r.created_at)}</span>
              </button>
              {open === r.id && (
                <div className="messageBody">
                  <p className="messageText">{r.description}</p>
                  <dl className="reportMeta">
                    {r.scammer_contact && <><dt>Scammer used</dt><dd>{r.scammer_contact}</dd></>}
                    <dt>Reported by</dt><dd>{r.name || "Anonymous"}{r.email ? ` (${r.email})` : ""}{r.user_id ? " · has an account" : ""}</dd>
                    <dt>Status</dt><dd><span className={`badge ${r.status}`}>{r.status}</span>{r.alert_id ? " · linked to an alert" : ""}</dd>
                  </dl>
                  <div className="dash-actions">
                    {r.status !== "published" && <button type="button" className="action-btn primary" onClick={() => toAlert(r)}>Turn into alert</button>}
                    {r.status === "new" && <button type="button" className="action-btn" onClick={() => act("set_status", r.id, { status: "reviewed" })}>Mark reviewed</button>}
                    {r.status !== "rejected" && r.status !== "published" && <button type="button" className="action-btn" onClick={() => act("set_status", r.id, { status: "rejected" })}>Not a scam / ignore</button>}
                    {r.email && <a className="action-btn" href={`mailto:${r.email}?subject=${encodeURIComponent("Your scam report on MoneyMentor")}`}>Email reporter</a>}
                    <button type="button" className="action-btn danger" onClick={() => act("delete", r.id)}>Delete</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ))}
      {data && <Pager page={page} totalPages={data.pagination.total_pages} onChange={setPage} />}
      {drafting && (
        <AlertForm initial={drafting} onClose={() => setDrafting(null)}
          onDone={(msg) => { setDrafting(null); setNotice(`${msg} The report is marked as published.`); reload(); onChange?.(); }} />
      )}
    </div>
  );
}
export default AdminReports;
