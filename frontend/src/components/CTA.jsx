import { ArrowUpRight } from "lucide-react";

function CTA() {
  return (
    <section className="cta-section">

      <div className="container cta-content">

        <span className="cta-label">
          HAVE A PROJECT IN MIND?
        </span>

        <h2>
          LET'S CREATE
          <br />
          SOMETHING <span>GREAT.</span>
        </h2>

        <a href="#contact" className="btn cta-btn">
          Start a Project
          <ArrowUpRight size={20} />
        </a>

      </div>

    </section>
  );
}

export default CTA;