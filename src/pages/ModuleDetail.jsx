import { Link, useParams } from "react-router-dom";
import { HiOutlineClock, HiOutlineBookOpen } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";
import { moduleById } from "../data/modules";
import ModuleHero from "../components/ModuleHero";
import ModuleNext from "../components/ModuleNext";
import NotFound from "./NotFound";
import "./ModulePage.css";

/** Public page for the data-driven modules (debt, investing, planning). */
function ModuleDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const mod = moduleById(id);
  if (!mod || !mod.overview) return <NotFound />;

  const minutes = mod.lessons.reduce((n, l) => n + l.minutes, 0);

  return (
    <>
      <ModuleHero title={mod.title} image={mod.image} imageAlt="" quote={mod.quote} animate />

      <div className="savings-btn">
        <Link to={user ? `/learn/${mod.id}` : "/signup"} className="savingsButton">
          {user ? "Start the lessons" : "Sign up to start the lessons"}
        </Link>
      </div>

      <div className="centeredTextSection">
        <p className="centeredText">{mod.overview}</p>
      </div>

      <section className="moduleSyllabus wrap" aria-label="What you'll learn">
        <div className="syllabusHead">
          <h2>What you'll learn</h2>
          <p>
            <HiOutlineBookOpen aria-hidden="true" /> {mod.lessons.length} short lessons + a quiz
            <span aria-hidden="true"> · </span>
            <HiOutlineClock aria-hidden="true" /> about {minutes} minutes
          </p>
        </div>
        <ol className="syllabusList">
          {mod.lessons.map((l) => (
            <li key={l.id}>
              <strong>{l.title}</strong>
              <span>{l.takeaways[0]}</span>
            </li>
          ))}
        </ol>
      </section>

      <ModuleNext current={mod.page} />
    </>
  );
}
export default ModuleDetail;
