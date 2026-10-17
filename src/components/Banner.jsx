import { Link } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import bannerImg from "../assets/images/banner.webp";
import HeroText from "./HeroText";
import "./Banner.css";

function Banner() {
  return (
    <section className="mainBanner">
      <div className="bannerLeft">
        <HeroText />

        <p>
          We can guarantee building a foundation of financial understanding
          that empowers you to make informed finance choices.
        </p>

        <div className="bannerLink">
          <Link to="/signup" className="first">
            Get started
          </Link>

          <Link to="/modules" className="last">
            Learn More
            <FaArrowRightLong className="arrow" aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="bannerImg">
        <img
          src={bannerImg}
          alt="People learning about money together"
          width="800"
          height="720"
          fetchPriority="high"
        />
      </div>
    </section>
  );
}

export default Banner;
