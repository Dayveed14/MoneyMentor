import { FaLightbulb } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa";
import "./Vision.css";

function Vision() {
  return (
    <section className="mainVision">
      <div className="vision">
        <div className="visionIcon">
          <FaLightbulb size={30} aria-hidden="true" />
        </div>
        <h2>Our Vision</h2>
        <p>
          We envision individuals confidently making financial decisions,
          setting goals, and creating a better future for themselves and their
          families.
        </p>
      </div>
      <div className="mision">
        <div className="misionIcon">
          <FaRocket size={30} aria-hidden="true" />
        </div>
        <h2>Our Mission</h2>
        <p>
          We are continuously evolving and expanding our content to ensure that
          you have access to the latest insights and tools.
        </p>
      </div>
    </section>
  );
}
export default Vision;
