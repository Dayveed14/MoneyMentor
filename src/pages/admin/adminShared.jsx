/* eslint-disable react-refresh/only-export-components -- shared admin helpers + small components */
import { useCallback, useEffect, useRef, useState } from "react";
import { FiRefreshCw, FiX } from "react-icons/fi";
import { apiFetch, apiUrl } from "../../config/api";
import { getToken } from "../../utils/auth";

export function timeAgo(value) {
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

export const shortDate = (v) => (v ? new Date(String(v).replace(" ", "T") + "Z").toLocaleDateString() : "—");

/** Loads an admin endpoint; returns { data, loading, error, reload }. */
export function useAdmin(path) {
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

export function SectionState({ loading, error, onRetry }) {
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

export function Pager({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="dash-pager">
      <button type="button" className="btn-secondary" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
      <span>Page {page} of {totalPages}</span>
      <button type="button" className="btn-secondary" disabled={page >= totalPages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}

/** Accessible dialog: closes on Escape or backdrop click, focuses the first field. */
export function Modal({ title, onClose, children, wide = false }) {
  const ref = useRef(null);
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    ref.current?.querySelector("input, select, textarea, button")?.focus();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);
  return (
    <div className="modalBackdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? "wide" : ""}`} role="dialog" aria-modal="true" aria-label={title} ref={ref}>
        <div className="modalHead">
          <h2>{title}</h2>
          <button type="button" className="modalClose" aria-label="Close" onClick={onClose}><FiX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

/** Downloads a CSV from api/admin_export.php (needs the auth header, so no plain link). */
export async function downloadCsv(type) {
  const res = await fetch(apiUrl(`api/admin_export.php?type=${type}`), {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) throw new Error("Export failed. Please try again.");
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `moneymentor-${type}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** A small random password admins can hand over when creating or resetting an account. */
export function suggestPassword() {
  const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => chars[b % chars.length]).join("");
}
