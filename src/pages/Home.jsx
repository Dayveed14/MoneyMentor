import Hero from "../components/Hero";
import GoldenRules from "../components/GoldenRules";
import ScamAlerts from "../components/ScamAlerts";
import AskBand from "../components/AskBand";
import Advantage from "../components/Advantage";
import ModulesShowcase from "../components/ModulesShowcase";
import MoneyCheck from "../components/MoneyCheck";
import SavingsSection from "../components/SavingsSection";
import AboutSection from "../components/AboutSection";
import ArticlesPreview from "../components/ArticlesPreview";
import CtaBand from "../components/CtaBand";

/* Order follows the platform's purpose: protect first, then educate. */
function Home() {
  return (
    <>
      <Hero />
      <GoldenRules />
      <ScamAlerts limit={3} />
      <AskBand />
      <Advantage />
      <ModulesShowcase />
      <MoneyCheck />
      <SavingsSection />
      <AboutSection />
      <ArticlesPreview />
      <CtaBand />
    </>
  );
}
export default Home;
