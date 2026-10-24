import { useEffect, useState } from "react";
import { apiFetch, apiPost } from "../../config/api";
import { MODULES } from "../../data/modules";

/** Attach a YouTube video to any lesson. Learners see it above the lesson text. */
function LessonVideos() {
  const [moduleId, setModuleId] = useState(MODULES[0].id);
  const [videos, setVideos] = useState({});
  const [drafts, setDrafts] = useState({});
  const [msg, setMsg] = useState({ key: "", ok: true, text: "" });

  useEffect(() => {
    apiFetch("api/get_lesson_videos.php").then((r) => r.success && setVideos(r.data || {})).catch(() => {});
  }, []);

  const mod = MODULES.find((m) => m.id === moduleId);
  const current = videos[moduleId] || {};

  const save = async (lessonId, url) => {
    const key = `${moduleId}/${lessonId}`;
    try {
      const res = await apiPost("api/admin_lesson_videos.php", { module: moduleId, lesson: lessonId, url });
      if (!res.success) throw new Error(res.message);
      setVideos((v) => {
        const m = { ...(v[moduleId] || {}) };
        if (res.youtube_id) m[lessonId] = res.youtube_id;
        else delete m[lessonId];
        return { ...v, [moduleId]: m };
      });
      setDrafts((d) => ({ ...d, [key]: undefined }));
      setMsg({ key, ok: true, text: res.message });
    } catch (err) {
      setMsg({ key, ok: false, text: err.message });
    }
  };

  return (
    <section className="content-section">
      <h2 className="sectionTitle">Lesson videos</h2>
      <p className="dash-muted">Paste a YouTube link to show a video at the top of a lesson. Leave it empty and save to remove it.</p>
      <div className="dash-filter videoTabs" role="group" aria-label="Choose module">
        {MODULES.map((m) => (
          <button key={m.id} type="button" className={moduleId === m.id ? "on" : ""} aria-pressed={moduleId === m.id} onClick={() => setModuleId(m.id)}>
            {m.title}
          </button>
        ))}
      </div>
      <ul className="videoRows">
        {mod.lessons.map((l) => {
          const key = `${moduleId}/${l.id}`;
          const saved = current[l.id] ? `https://youtu.be/${current[l.id]}` : "";
          const value = drafts[key] ?? saved;
          return (
            <li key={l.id}>
              <label htmlFor={`v-${key}`}>{l.title}</label>
              <div className="videoInput">
                <input id={`v-${key}`} value={value} placeholder="https://www.youtube.com/watch?v=..." onChange={(e) => setDrafts((d) => ({ ...d, [key]: e.target.value }))} />
                <button type="button" className="btn-secondary" disabled={value === saved} onClick={() => save(l.id, value.trim())}>Save</button>
              </div>
              {msg.key === key && <span className={msg.ok ? "formOk" : "formErr"}>{msg.text}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
export default LessonVideos;
