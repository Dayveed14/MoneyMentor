import { useState } from "react";
import ModuleHero from "../components/ModuleHero";
import ModuleNext from "../components/ModuleNext";
import budgetingImg from "../assets/images/budgeting.webp";
import "./ModulePage.css";

function Budget() {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <ModuleHero
        title="Budgeting and expense tracking"
        image={budgetingImg}
        imageAlt="Hands using a calculator over a budget sheet"
        quote="“Where you'll unlock the power of smart money management.”"
        animate
      />

      <div className="savings-btn">
        <button
          type="button"
          onClick={() => setShowMore((prev) => !prev)}
          className="savingsButton"
          aria-expanded={showMore}
          aria-controls="budget-more">
          {showMore ? "Show less" : "Get started"}
        </button>
      </div>

      {showMore && (
        <div className="expandedContent" id="budget-more">
          {/* Previously this repeated the Savings page text by mistake */}
          <div className="centeredTextSection">
            <p className="centeredText">
              Budgeting and expense tracking is where you'll unlock the power of
              smart money management. Discover the art of setting realistic
              financial goals, creating budgets that align with your
              aspirations, and gaining insights into your spending habits.
            </p>
          </div>

          <div className="tipsSection">
            <div className="tipsContent">
              <h2 className="tipsTitle">Getting started with a budget</h2>
              <p className="tipsText">
                List your monthly income, then write down every fixed expense
                such as rent, transport and bills. Give the rest of your money a
                job: a common starting point is 50% for needs, 30% for wants and
                20% for savings. Track what you actually spend for a month,
                compare it with your plan, and adjust. A budget is not a
                restriction — it's a plan that tells your money where to go.
              </p>
            </div>
          </div>
        </div>
      )}
      <ModuleNext current="/budget" />
    </>
  );
}

export default Budget;
