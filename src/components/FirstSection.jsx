import { FaHeadSideVirus, FaUserClock } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { PiMoneyWavyFill } from "react-icons/pi";
import "./FirstSection.css";

const features = [
  {
    icon: FaHeadSideVirus,
    title: "Personalized learning path",
    text: "We tailor your learning experience, assessing your current knowledge & crafting a personalized path to address your specific needs & goals.",
  },
  {
    icon: FaUserClock,
    title: "Interactive and Engaging Modules",
    text: "Learning about finance should never be dull. Our interactive modules are designed to make financial concepts accessible & engaging.",
  },
  {
    icon: HiUserGroup,
    title: "Community Support",
    text: "Join a community of like-minded individuals & financial experts who are eager to share experiences, insights, & advice.",
  },
  {
    icon: PiMoneyWavyFill,
    title: "Budgeting made easy",
    text: "Whether you’re a budgeting novice or looking to refine your financial strategy, MoneyMentor’s budgeting tools help you set goals.",
  },
];

function FirstSection() {
  return (
    <section className="advantage">
      <div className="firstSection">
        <h5>The MoneyMentor Advantage</h5>
        <h2>Why Choose MoneyMentor?</h2>
        <p>
          We pride ourselves in creating opportunities for you to build a strong
          foundation of financial knowledge
        </p>
      </div>
      <div className="mainSection">
        {features.map(({ icon: Icon, title, text }) => (
          <div className="FsDiv" key={title}>
            <div className="icon-wrapper">
              <Icon size={50} fill="#4186ad" aria-hidden="true" />
            </div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
export default FirstSection;
