import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ModuleHero from "../components/ModuleHero";
import ModuleNext from "../components/ModuleNext";
import savingsImg from "../assets/images/savings.webp";
import habitImg from "../assets/images/saving-habit.webp";
import expensesImg from "../assets/images/expenses.webp";
import "./ModulePage.css";

function Savings() {
  const [showMore, setShowMore] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <ModuleHero
        title="Saving Strategy"
        image={savingsImg}
        imageAlt="Coins being dropped into a savings jar"
        quote="“Learn how to create a saving plan that adapts to your life goals and financial circumstances.”"
        animate
      />

      <div className="savings-btn">
        <Link to={user ? "/learn/savings" : "/signup"} className="savingsButton">
          {user ? "Start the lessons" : "Sign up to start the lessons"}
        </Link>
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="savingsButton savingsButtonGhost"
          aria-expanded={showMore}
          aria-controls="savings-more">
          {showMore ? "Show less" : "Read the overview"}
        </button>
      </div>

      {showMore && (
        <div className="expandedContent" id="savings-more">
          <div className="centeredTextSection">
            <p className="centeredText">
              Building a solid savings strategy is the foundation of financial
              security. Whether you're saving for an emergency fund, a major
              purchase, or your future, having a clear plan helps you stay
              focused and motivated.
            </p>
          </div>

          <div className="tipsSection">
            <div className="tipsContent">
              <h2 className="tipsTitle">Here are a few tips for beginners</h2>
              <p className="tipsText">
                Start by setting specific, measurable goals. Automate your
                savings, track your spending, and redirect extra funds toward
                your goals. Consistency is key — even small amounts add up.
              </p>
            </div>
          </div>

          <div className="imageTextSection">
            <div className="imageTextWrapper">
              <div className="leftImageContainer">
                <img src={habitImg} width="900" height="900" alt="Planning finances at a desk" className="sectionImage" loading="lazy" />
              </div>
              <div className="rightTextContainer">
                <h2 className="sectionHeading">Make saving a habit</h2>
                <p className="sectionText">
                  Treat saving as a non-negotiable expense. Pay yourself first,
                  follow the 50/30/20 rule, and review your plan regularly.
                  Celebrate milestones to stay motivated.
                </p>
              </div>
            </div>
          </div>

          <div className="tipsSection">
            <div className="tipsContent">
              <h2 className="tipsTitle">Here's another beginner tip</h2>
              <p className="tipsText">
                Set financial goals. What are you saving for? A down payment on
                a house? A new car? Retirement? Once you know what you're saving
                for, you can create a plan to reach your goal. Create a budget.
                A budget will help you track your income and expenses so you can
                see where your money is going. Once you know where your money is
                going, you can start to identify areas where you can cut back.
                Automate your savings. One of the best ways to save money is to
                automate your savings. This means setting up a recurring
                transfer from your checking account to your savings account each
                month. This way, you'll save money without even having to think
                about it. Pay yourself first. When you get paid, set aside a
                certain amount of money for savings before you pay any other
                bills. This will help you make sure that you're saving money
                each month.
              </p>
            </div>
          </div>

          <div className="imageTextSection">
            <div className="imageTextWrapper">
              <div className="leftImageContainer">
                <img src={expensesImg} width="500" height="500" alt="Reviewing monthly expenses" className="sectionImage" loading="lazy" />
              </div>
              <div className="rightTextContainer">
                <h2 className="sectionHeading">Expenses</h2>
                <p className="sectionText">
                  Cut back on unnecessary expenses. Take a close look at your
                  budget and see if there are any areas where you can cut back.
                  Maybe you can eat out less, cancel unused subscriptions, or
                  find cheaper alternatives to your favorite products. Find ways
                  to make extra money. If you can find ways to make extra money,
                  you can put that money towards your savings goal. Maybe you
                  can start a side hustle, get a part-time job, or sell unwanted
                  items. Saving money can be challenging, but it's important to
                  stick with it. By following these tips, you can reach your
                  financial goals and build a brighter future for yourself.
                </p>
              </div>
            </div>
          </div>

          <div className="tipsSection">
            <div className="tipsContent">
              <h2 className="tipsTitle">In addition</h2>
              <p className="tipsText">
                Don't be afraid to start small. Even if you can only save $10 a
                week, that's still $520 a year. Over time, your savings will
                grow and you'll be able to reach your financial goals. Don't
                give up. There will be times when you're tempted to spend your
                savings on something else. But it's important to stay focused on
                your goal and keep saving. Celebrate your successes. When you
                reach a savings milestone, take the time to celebrate. This will
                help you stay motivated and keep saving. Saving money is an
                important part of financial planning. By following these tips,
                you can start saving money today and reach your financial goals.
              </p>
            </div>
          </div>
        </div>
      )}
      <ModuleNext current="/savings" />
    </>
  );
}

export default Savings;
