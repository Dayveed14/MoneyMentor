import WelcomeBanner from "../components/WelcomeBanner";
import Hero from "../components/Hero";
import Advantage from "../components/Advantage";
import ModulesShowcase from "../components/ModulesShowcase";
import MoneyCheck from "../components/MoneyCheck";
import AboutSection from "../components/AboutSection";
import ArticlesPreview from "../components/ArticlesPreview";
import CtaBand from "../components/CtaBand";

function Home() {
  return (
    <>
      <WelcomeBanner />
      <Hero />
      <Advantage />
      <ModulesShowcase />
      <MoneyCheck />
      <AboutSection />
      <ArticlesPreview />
      <CtaBand />
    </>
  );
}
export default Home;
