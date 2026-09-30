import { ArrowDown, ArrowUpRight } from "lucide-react";
import heroArtwork from "../assets/hero.png";

function Hero() {
  return (
    <section className="hero" id="home">

      <div className="container hero-grid">

        <div className="hero-content">

          <div className="eyebrow">
            <span className="dot"></span>
            GRAPHIC DESIGNER / VISUAL CREATIVE
          </div>

          <h1>
            I DESIGN
            <span>VISUALS</span>
            THAT GET
            <span>NOTICED.</span>
          </h1>

          <p className="hero-description">
            I transform ideas into bold visual identities,
            digital experiences and creative designs that
            help brands stand out.
          </p>

          <div className="hero-buttons">
            <a href="#work" className="btn btn-primary">
              View My Work
              <ArrowUpRight size={18} />
            </a>

            <a href="#contact" className="btn btn-outline">
              Start a Project
            </a>
          </div>

          <div className="hero-socials">
            <a href="#" aria-label="Instagram">IG</a>
            <a href="#" aria-label="Behance">BE</a>
            <a href="#" aria-label="LinkedIn">LI</a>
            <a href="#" aria-label="WhatsApp">WA</a>
          </div>

        </div>

        <div className="hero-visual">

          <div className="hero-card hero-card-main">
            <div className="portrait-frame">
              <img
                src="/profile.jpg"
                alt="Jackson Madila"
                onError={(event) => {
                  event.currentTarget.src = heroArtwork;
                }}
              />
              <div className="portrait-overlay">
                <span>JACKSON MADILA</span>
                <strong>VISUAL<br />CREATIVE</strong>
              </div>
            </div>
          </div>

          <div className="floating-card card-one">
            <span>01</span>
            BRAND<br />IDENTITY
          </div>

          <div className="floating-card card-two">
            <span>02</span>
            DIGITAL<br />DESIGN
          </div>

          <div className="hero-circle">
            <span>JACKSON<br />MADILA</span>
          </div>

        </div>

      </div>

      <a href="#about" className="scroll-indicator">
        <ArrowDown size={18} />
        SCROLL TO EXPLORE
      </a>

    </section>
  );
}

export default Hero;