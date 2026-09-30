const steps = [
  {
    number: "01",
    title: "Discover",
    description:
      "I start by understanding the purpose, audience and message behind the project before shaping the creative direction."
  },
  {
    number: "02",
    title: "Design",
    description:
      "I turn ideas into visual systems, layouts and concepts that communicate clearly and feel distinct."
  },
  {
    number: "03",
    title: "Refine",
    description:
      "I review details, adjust the design for impact and make sure the work feels polished and intentional."
  },
  {
    number: "04",
    title: "Deliver",
    description:
      "I prepare final assets in the right formats so they’re ready to use across print, digital and social platforms."
  }
];

function Process() {
  return (
    <section className="section process-section" id="process">
      <div className="container">
        <div className="section-label">
          <span>04</span>
          WORKFLOW
        </div>

        <h2 className="section-title">
          HOW I BUILD
          <br />
          CREATIVE <span>IMPACT</span>
        </h2>

        <div className="process-grid">
          {steps.map((step) => (
            <div key={step.number} className="process-card">
              <span className="process-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Process;
