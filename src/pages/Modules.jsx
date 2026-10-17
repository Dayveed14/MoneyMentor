import { Link } from "react-router-dom";
import ModuleHero from "../components/ModuleHero";
import savingsImg from "../assets/images/savings.webp";
import finlitImg from "../assets/images/finlit.webp";
import budgetingImg from "../assets/images/budgeting.webp";
import "./ModulePage.css";

const modules = [
  {
    to: "/savings",
    title: "Saving Strategy",
    image: savingsImg,
    imageAlt: "Coins being dropped into a savings jar",
    quote: "“Learn how to create a saving plan that adapts to your life goals and financial circumstances.”",
    text: "The “Savings Strategies” section is your gateway to a more secure and prosperous future. Dive into modules that delve into the various methods of saving, from emergency funds to long-term investments. Learn how to create a savings plan that adapts to your life goals and financial circumstances. With MoneyMentor by your side, you'll gain the knowledge to make informed decisions that maximize your savings potential. These sections are just a glimpse of the valuable insights waiting for you on MoneyMentor. Each module is designed to empower you with actionable steps, real-world scenarios, and the tools you need to master your finances. As you explore our platform, remember that financial literacy is a journey, and we're here to guide you every step of the way.",
  },
  {
    to: "/finlit",
    title: "Financial literacy 101",
    image: finlitImg,
    imageAlt: "Person reviewing financial charts",
    quote: "“Where you'll gain the confidence to navigate financial discussions with ease.”",
    text: "In the “Financial Literacy 101” section, we lay the foundation for your financial education. From understanding basic financial concepts to demystifying complex terminology, these modules provide a solid grounding in the world of finance. We'll guide you through topics such as understanding interest rates, deciphering credit scores, and grasping the nuances of loans and debts. With interactive tutorials, videos, and quizzes, you'll gain the confidence to navigate financial discussions with ease.",
  },
  {
    to: "/budget",
    title: "Budgeting and expense tracking",
    image: budgetingImg,
    imageAlt: "Hands using a calculator over a budget sheet",
    quote: "“Where you'll unlock the power of smart money management.”",
    text: "“Budgeting and Expense Tracking” is where you'll unlock the power of smart money management. Discover the art of setting realistic financial goals, creating budgets that align with your aspirations, and gaining insights into your spending habits. Our intuitive tools allow you to track every dollar, ensuring you stay on course to achieve your financial milestones. Say goodbye to guesswork, and say hello to a clearer, more organized financial future.",
  },
];

function Modules() {
  return (
    <>
      {modules.map((m) => (
        <section className="moduleContent" key={m.to}>
          <ModuleHero crumb={false} title={m.title} image={m.image} imageAlt={m.imageAlt} quote={m.quote} />
          <div className="centeredTextSection">
            <p className="centeredText">{m.text}</p>
          </div>
          <div className="savings-btn">
            <Link to={m.to} className="savingsButton">
              Get started
            </Link>
          </div>
        </section>
      ))}
    </>
  );
}
export default Modules;
