import { useEffect, useMemo, useState } from "react";
import { HiPlus, HiTrash } from "react-icons/hi";
import { apiFetch, apiPost } from "../../config/api";
import { CURRENCY } from "../../components/SavingsGrowth";
import { money } from "../../lib/format";

const TYPES = [
  { id: "need", label: "Need", target: 50, color: "var(--teal)" },
  { id: "want", label: "Want", target: 30, color: "var(--coin)" },
  { id: "saving", label: "Saving", target: 20, color: "var(--growth)" },
];

const STARTER = [
  { name: "Rent", amount: "", type: "need" },
  { name: "Food", amount: "", type: "need" },
  { name: "Transport", amount: "", type: "need" },
  { name: "Data & airtime", amount: "", type: "need" },
  { name: "Eating out & fun", amount: "", type: "want" },
  { name: "Emergency fund", amount: "", type: "saving" },
];

let rowKey = 0;
const withKeys = (items) => items.map((i) => ({ ...i, key: ++rowKey }));

function BudgetPlanner() {
  const [income, setIncome] = useState("");
  const [items, setItems] = useState(() => withKeys(STARTER));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    apiFetch("api/budget.php")
      .then((r) => {
        if (r.success && r.budget) {
          setIncome(String(r.budget.income || ""));
          setItems(withKeys(r.budget.items.length ? r.budget.items : STARTER));
        }
      })
      .catch(() => setMessage({ type: "error", text: "Your saved budget didn't load. You can still plan and save." }))
      .finally(() => setLoading(false));
  }, []);

  const totals = useMemo(() => {
    const t = { need: 0, want: 0, saving: 0 };
    items.forEach((i) => (t[i.type] += Number(i.amount) || 0));
    return { ...t, all: t.need + t.want + t.saving };
  }, [items]);

  const inc = Number(income) || 0;
  const left = inc - totals.all;

  const update = (key, field, value) => {
    setItems((list) => list.map((i) => (i.key === key ? { ...i, [field]: value } : i)));
    setDirty(true);
  };
  const addRow = () => {
    setItems((list) => [...list, ...withKeys([{ name: "", amount: "", type: "need" }])]);
    setDirty(true);
  };
  const removeRow = (key) => {
    setItems((list) => list.filter((i) => i.key !== key));
    setDirty(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await apiPost("api/budget.php", {
        income: inc,
        items: items.map(({ name, amount, type }) => ({ name, amount: Number(amount) || 0, type })),
      });
      if (!res.success) throw new Error(res.message);
      setMessage({ type: "ok", text: "Budget saved." });
      setDirty(false);
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Your budget didn't save. Try again." });
    } finally {
      setSaving(false);
    }
  };

  // One plain-language suggestion based on the split
  const advice = (() => {
    if (!inc) return "Add your monthly take-home pay to see how your plan compares with 50/30/20.";
    if (left < 0) return `You've planned ${money(-left)} more than you earn. Trim wants first, then needs.`;
    const savingPct = (totals.saving / inc) * 100;
    if (savingPct < 10) return "Savings are under 10% of income. Try moving a little from wants to savings.";
    if (left > 0) return `${money(left)} isn't assigned yet. Give it a job, such as your emergency fund.`;
    return "Every part of your income has a job. Review this plan at the end of the month.";
  })();

  return (
    <>
      <header className="accHead">
        <div>
          <h1>Budget planner</h1>
          <p>Plan a month of spending and see how it compares with the 50/30/20 rule.</p>
        </div>
      </header>

      <form className="budgetGrid" onSubmit={save} aria-busy={loading}>
        <section className="accPanel">
          <label className="incomeField">
            <span>Monthly take-home income</span>
            <div className="moneyInput">
              <span>{CURRENCY}</span>
              <input type="number" inputMode="decimal" min="0" step="any" placeholder="0"
                value={income} onChange={(e) => { setIncome(e.target.value); setDirty(true); }} />
            </div>
          </label>

          <div className="budgetRows" role="table" aria-label="Budget lines">
            <div className="budgetRow budgetRowHead" role="row">
              <span role="columnheader">What</span>
              <span role="columnheader">Amount</span>
              <span role="columnheader">Type</span>
              <span />
            </div>
            {items.map((i) => (
              <div className="budgetRow" role="row" key={i.key}>
                <input aria-label="Budget line name" placeholder="e.g. Electricity" value={i.name} maxLength={60}
                  onChange={(e) => update(i.key, "name", e.target.value)} />
                <input aria-label={`Amount for ${i.name || "line"}`} type="number" inputMode="decimal" min="0" step="any"
                  placeholder="0" value={i.amount} onChange={(e) => update(i.key, "amount", e.target.value)} />
                <select aria-label={`Type for ${i.name || "line"}`} value={i.type} onChange={(e) => update(i.key, "type", e.target.value)}>
                  {TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <button type="button" className="iconBtn" aria-label={`Remove ${i.name || "line"}`} onClick={() => removeRow(i.key)}>
                  <HiTrash />
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="addRow" onClick={addRow}><HiPlus aria-hidden="true" /> Add a line</button>
        </section>

        <aside className="accPanel budgetSummary">
          <h2>Your split</h2>
          <dl className="miniStats num">
            <div><dt>Income</dt><dd>{money(inc)}</dd></div>
            <div><dt>Planned</dt><dd>{money(totals.all)}</dd></div>
            <div>
              <dt>{left >= 0 ? "Left to assign" : "Over budget"}</dt>
              <dd className={left >= 0 ? "pos" : "neg"}>{money(Math.abs(left))}</dd>
            </div>
          </dl>

          <div className="splitBars">
            {TYPES.map((t) => {
              const pct = inc ? Math.round((totals[t.id] / inc) * 100) : 0;
              return (
                <div key={t.id} className="splitBar">
                  <div className="splitLabel num">
                    <span>{t.label}s</span>
                    <span><strong>{pct}%</strong> of income, target {t.target}%</span>
                  </div>
                  <div className="splitTrack">
                    <span className="splitFill" style={{ width: `${Math.min(100, pct)}%`, background: t.color }} />
                    <span className="splitTarget" style={{ left: `${t.target}%` }} aria-hidden="true" />
                  </div>
                </div>
              );
            })}
          </div>

          <p className="advice">{advice}</p>

          {message.text && (
            <p className={message.type === "ok" ? "formOk" : "formErr"} role="status">{message.text}</p>
          )}
          <button type="submit" className="btn btn-solid saveBtn" disabled={saving || loading}>
            {saving ? "Saving..." : dirty ? "Save budget" : "Saved"}
          </button>
        </aside>
      </form>
    </>
  );
}
export default BudgetPlanner;
