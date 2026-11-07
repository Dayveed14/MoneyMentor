import CompoundGrowth from "./CompoundGrowth";
import BudgetSplit from "./BudgetSplit";
import NeedsWants from "./NeedsWants";
import SpotTheFlags from "./SpotTheFlags";
import LoanCost from "./LoanCost";
import InflationShrink from "./InflationShrink";
import PonziCollapse from "./PonziCollapse";
import NetWorthScale from "./NetWorthScale";

/** Which interactive widget appears in which lesson ("module/lesson"). */
export const LESSON_WIDGETS = {
  "savings/why-save": () => <CompoundGrowth />,
  "finlit/foundations": () => <CompoundGrowth />,
  "budgeting/rule-50-30-20": () => <BudgetSplit />,
  "budgeting/needs-vs-wants": () => <NeedsWants />,
  "finlit/phishing": () => <SpotTheFlags message="phishing" />,
  "finlit/otp-fraud": () => <SpotTheFlags message="otp" />,
  "debt/true-cost": () => <LoanCost />,
  "investing/why-invest": () => <InflationShrink />,
  "investing/ponzi": () => <PonziCollapse />,
  "planning/net-worth": () => <NetWorthScale />,
};
