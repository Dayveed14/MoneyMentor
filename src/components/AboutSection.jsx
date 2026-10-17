import { FaLightbulb } from "react-icons/fa6";
import { FaRocket } from "react-icons/fa";
import savingsImg from "../assets/images/savings.webp";
import finlitImg from "../assets/images/finlit.webp";
import "./AboutSection.css";

function AboutSection() {
  return (
    <section className="aboutSection" id="about">
      <div className="wrap aboutInner">
        <div className="aboutArches" aria-hidden="true">
          <div className="arch archTall"><img src={finlitImg} alt="" loading="lazy" width="365" height="415" /></div>
          <div className="arch archShort"><img src={savingsImg} alt="" loading="lazy" width="334" height="390" /></div>
        </div>

        <div className="aboutCopy">
          <p className="kicker">About us</p>
          <h2>We believe financial empowerment is the cornerstone of a brighter future</h2>
          <p>
            Our mission is to democratize financial knowledge and give people the
            tools they need to make informed decisions about their money.
            Navigating personal finance can be daunting, especially if no one
            ever taught you. That&apos;s why we built a comprehensive,
            user-friendly platform to guide you towards financial literacy and
            success.
          </p>

          <div className="aboutPillars">
            <div>
              <span className="pillarIcon"><FaLightbulb aria-hidden="true" /></span>
              <h3>Our vision</h3>
              <p>
                People confidently making financial decisions, setting goals and
                creating a better future for themselves and their families.
              </p>
            </div>
            <div>
              <span className="pillarIcon"><FaRocket aria-hidden="true" /></span>
              <h3>Our mission</h3>
              <p>
                To keep evolving and expanding our content so you always have the
                latest insights and tools.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
export default AboutSection;
