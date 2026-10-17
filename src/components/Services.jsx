import { Link } from "react-router-dom";
import budgetingImg from "../assets/images/budgeting.webp";
import finlitImg from "../assets/images/finlit.webp";
import savingsImg from "../assets/images/savings.webp";
import "./Services.css";

const services = [
  {
    to: "/budget",
    img: budgetingImg, w: 344, h: 390,
    alt: "Hands using a calculator over a budget sheet",
    title: "Budgeting & expense tracking",
    hover: "is where you’ll unlock the power of smart money management",
  },
  {
    to: "/finlit",
    img: finlitImg, w: 365, h: 415,
    alt: "Person reviewing financial charts",
    title: "Financial Literacy 101",
    hover: "you’ll gain the confidence to navigate financial discussions with ease",
  },
  {
    to: "/savings",
    img: savingsImg, w: 334, h: 390,
    alt: "Coins being dropped into a savings jar",
    title: "Saving Strategy",
    hover:
      "Learn how to create saving plans that adapt to your life goals and financial circumstances",
  },
];

function Services() {
  return (
    <section className="serviceBanner">
      <div className="serviceText">
        <p>
          Welcome to the heart of MoneyMentor, where you’ll discover a wealth of
          knowledge and practical skills to transform your financial journey.
          Our platform is designed with you in mind, offering a diverse range of
          modules that cover essential aspects of financial literacy. Let’s
          delve into some of our standout sections:
        </p>
      </div>

      {services.map((s) => (
        // The whole card is the link, so it also works on touch screens
        <Link to={s.to} className="serviceCard" key={s.to}>
          <img src={s.img} alt={s.alt} width={s.w} height={s.h} loading="lazy" />
          <div className="overlay">
            <span className="text-default">
              <span className="styled-text">{s.title}</span>
            </span>
            <span className="text-hover">{s.hover}</span>
          </div>
        </Link>
      ))}
    </section>
  );
}
export default Services;
