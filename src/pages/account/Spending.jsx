import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { HiChevronLeft, HiChevronRight, HiTrash, HiPlus } from "react-icons/hi";
import { apiFetch, apiPost } from "../../config/api";
import { money } from "../../lib/format";
import { CURRENCY } from "../../components/SavingsGrowth";

const TYPES = [
  { id: "need", label: "Need", color: "var(--teal)" },
  { id: "want", label: "Want", color: "var(--coin)" },
  { id: "saving", label: "Saving", color: "var(--growth)" },
];
const COMMON = ["Food", "Transport", "Rent", "Electricity", "Data & airtime", "School fees", "Health", "Family support", "Eating out", "Clothes", "Entertainment", "Savings", "Debt repayment"];

const today = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => today().slice(0, 7);
const shiftMonth = (m, by) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(Date.UTC(y, mo - 1 + by, 1));
  return d.toISOString().slice(0, 7);
};
const monthName = (m) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString(undefined, { month: "long", year: "numeric", timeZone: "UTC" });
const shortMonth = (m) => new Date(`${m}-01T00:00:00Z`).toLocaleDateString(undefined, { month: "short", timeZone: "UTC" });

/** Log what you actually spend and compare it with your budget plan. */
function Spending() {
  const [month, setMonth] = useState(thisMonth);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ amount: "", category: "", type: "need", spent_on: today(), note: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const load = useCallback(() => {
    setError("");
    apiFetch(`api/expenses.php?month=${month}`)
      .then((r) => (r.success ? setData(r) : setError(r.message)))
      .catch((e) => setError(e.message));
  }, [month]);
  useEffect(load, [load]);

  const plan = data?.budget;
  const planned = useMemo(() => {
    const byType = { need: 0, want: 0, saving: 0 };
    (plan?.items || []).forEach((i) => (byType[i.type] += Number(i.amount) || 0));
    return byType;
  }, [plan]);

  // Planned vs actual for each budget line (matched by name, ignoring case)
  const lines = useMemo(() => {
    if (!plan?.items?.length) return [];
    const actual = Object.fromEntries((data?.by_category || []).map((c) => [c.category.toLowerCase(), c.total]));
    // Merge lines with the same name and hide empty ones
    const merged = new Map();
    plan.items.forEach((i) => {
      const key = i.name.trim().toLowerCase();
      const prev = merged.get(key);
      merged.set(key, prev ? { ...prev, amount: prev.amount + (Number(i.amount) || 0) } : { ...i, amount: Number(i.amount) || 0 });
    });
    return [...merged.entries()]
      .map(([key, l]) => ({ ...l, spent: actual[key] || 0 }))
      .filter((l) => l.amount > 0 || l.spent > 0);
  }, [plan, data]);

  const categories = useMemo(() => {
    const fromPlan = (plan?.items || []).map((i) => i.name);
    return [...new Set([...fromPlan, ...COMMON])];
  }, [plan]);

  const setField = (k, v) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      // Picking one of your budget lines fills in its type
      if (k === "category") {
        const line = (plan?.items || []).find((i) => i.name.toLowerCase() === v.trim().toLowerCase());
        if (line) next.type = line.type;
      }
      return next;
    });
    setMsg({ type: "", text: "" });
  };

  const add = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const r = await apiPost("api/expenses.php", { action: "add", ...form, amount: Number(form.amount) });
      if (!r.success) throw new Error(r.message);
      setMsg({ type: "ok", text: `Added ${money(form.amount)} for ${form.category}.` });
      setForm((f) => ({ ...f, amount: "", note: "" }));
      const addedMonth = form.spent_on.slice(0, 7);
      if (addedMonth !== month) setMonth(addedMonth);
      else load();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    const r = await apiPost("api/expenses.php", { action: "delete", id }).catch(() => null);
    if (r?.success) load();
  };

  const income = Number(plan?.income) || 0;
  const total = data?.total || 0;
  const maxTrend = Math.max(1, ...(data?.trend || []).map((t) => t.total));
  const isCurrent = month >= thisMonth();

  return (
    <>
      <header className="accHead spendHead">
        <div>
          <h1>Spending tracker</h1>
          <p>Log what you actually spend, and see how it compares with your budget plan.</p>
        </div>
        <div className="monthNav" aria-label="Choose month">
          <button type="button" className="iconBtn" onClick={() => setMonth((m) => shiftMonth(m, -1))} aria-label="Previous month"><HiChevronLeft /></button>
          <strong aria-live="polite">{monthName(month)}</strong>
          <button type="button" className="iconBtn" onClick={() => setMonth((m) => shiftMonth(m, 1))} disabled={isCurrent} aria-label="Next month"><HiChevronRight /></button>
        </div>
      </header>

      {error && <div className="accError" role="alert">{error} <button type="button" onClick={load}>Try again</button></div>}

      <div className="spendGrid">
        <section className="accPanel">
          <h2 className="panelTitle">Add an expense</h2>
          <form className="expenseForm" onSubmit={add}>
            <label>
              <span>Amount</span>
              <div className="moneyInput">
                <span>{CURRENCY}</span>
                <input type="number" inputMode="decimal" min="0" step="any" required placeholder="0"
                  value={form.amount} onChange={(e) => setField("amount", e.target.value)} />
              </div>
            </label>
            <label>
              <span>Category</span>
              <input list="expense-cats" required maxLength={80} placeholder="e.g. Food" value={form.category}
                onChange={(e) => setField("category", e.target.value)} />
              <datalist id="expense-cats">{categories.map((c) => <option key={c} value={c} />)}</datalist>
            </label>
            <fieldset className="typePick">
              <legend>Type</legend>
              {TYPES.map((t) => (
                <label key={t.id} className={form.type === t.id ? "on" : ""}>
                  <input type="radio" name="type" value={t.id} checked={form.type === t.id} onChange={() => setField("type", t.id)} />
                  {t.label}
                </label>
              ))}
            </fieldset>
            <label>
              <span>Date</span>
              <input type="date" required max={today()} value={form.spent_on} onChange={(e) => setField("spent_on", e.target.value)} />
            </label>
            <label className="wide">
              <span>Note <em>(optional)</em></span>
              <input maxLength={200} placeholder="e.g. Market run" value={form.note} onChange={(e) => setField("note", e.target.value)} />
            </label>
            <button type="submit" className="btn btn-solid" disabled={saving}><HiPlus aria-hidden="true" /> {saving ? "Adding..." : "Add expense"}</button>
            {msg.text && <p className={msg.type === "ok" ? "formOk" : "formErr"} role="status">{msg.text}</p>}
          </form>
        </section>

        <aside className="accPanel spendSummary">
          <h2 className="panelTitle">{monthName(month)}</h2>
          <dl className="miniStats num">
            <div><dt>Spent</dt><dd>{money(total)}</dd></div>
            {income > 0 && (
              <div>
                <dt>{income - total >= 0 ? "Left from income" : "Over income"}</dt>
                <dd className={income - total >= 0 ? "pos" : "neg"}>{money(Math.abs(income - total))}</dd>
              </div>
            )}
          </dl>
          {plan ? (
            <div className="splitBars">
              {TYPES.map((t) => {
                const spent = data?.by_type?.[t.id] || 0;
                const cap = planned[t.id];
                // Spending on something with nothing planned counts as over budget
                const pct = cap ? Math.round((spent / cap) * 100) : spent ? 101 : 0;
                return (
                  <div key={t.id} className="splitBar">
                    <div className="splitLabel num">
                      <span>{t.label}s</span>
                      <span><strong>{money(spent)}</strong> of {money(cap)} planned</span>
                    </div>
                    <div className="splitTrack">
                      <span className={`splitFill ${pct > 100 ? "over" : ""}`} style={{ width: `${Math.min(100, pct)}%`, background: pct > 100 ? "#c9302c" : t.color }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="advice">
              <Link to="/account/budget">Make a budget plan</Link> to compare your spending with what you planned.
            </p>
          )}
          {(data?.trend?.length || 0) > 1 && (
            <div className="trend" aria-label="Spending over recent months">
              {data.trend.map((t) => (
                <div key={t.month} className={t.month === month ? "on" : ""}>
                  <span className="trendBar" style={{ height: `${Math.max(4, (t.total / maxTrend) * 100)}%` }} title={money(t.total)} />
                  <span className="trendLbl">{shortMonth(t.month)}</span>
                </div>
              ))}
            </div>
          )}
        </aside>
      </div>

      {lines.length > 0 && (
        <section className="accPanel">
          <h2 className="panelTitle">Plan vs actual</h2>
          <ul className="planLines">
            {lines.map((l) => {
              const pct = l.amount ? Math.round((l.spent / l.amount) * 100) : l.spent ? 101 : 0;
              return (
                <li key={l.name}>
                  <div className="num">
                    <strong>{l.name}</strong>
                    <span className={pct > 100 ? "neg" : ""}>{money(l.spent)} / {money(l.amount)}</span>
                  </div>
                  <div className="splitTrack">
                    <span className="splitFill" style={{ width: `${Math.min(100, pct)}%`, background: pct > 100 ? "#c9302c" : TYPES.find((t) => t.id === l.type)?.color }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="accPanel">
        <div className="panelHead"><h2>Expenses this month</h2></div>
        {!data ? (
          <p className="muted">Loading…</p>
        ) : data.data.length === 0 ? (
          <p className="muted">Nothing logged for {monthName(month)} yet. Add your first expense above. Small daily amounts add up fastest.</p>
        ) : (
          <ul className="expenseList">
            {data.data.map((x) => (
              <li key={x.id}>
                <span className={`typeDot t-${x.type}`} aria-hidden="true" />
                <div>
                  <strong>{x.category}</strong>
                  <span className="muted">{new Date(`${x.spent_on}T00:00:00`).toLocaleDateString(undefined, { day: "numeric", month: "short" })}{x.note ? ` · ${x.note}` : ""}</span>
                </div>
                <span className="num amt">{money(x.amount)}</span>
                <button type="button" className="iconBtn" aria-label={`Delete ${x.category} expense`} onClick={() => remove(x.id)}><HiTrash /></button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
export default Spending;
