const testimonials = [
  {
    id: 1,
    name: "Maya K.",
    role: "Brand Founder",
    quote:
      "Jackson translated our brand ideas into a creative direction that felt premium, clear and memorable from the first concept."
  },
  {
    id: 2,
    name: "Daniel R.",
    role: "Marketing Lead",
    quote:
      "The visuals were polished, strategic and easy for our audience to connect with. The final output elevated our campaign instantly."
  },
  {
    id: 3,
    name: "Aisha T.",
    role: "Creative Consultant",
    quote:
      "Every detail was thoughtful and intentional. The work balanced originality with clarity in a way that felt deeply professional."
  }
];

function Testimonials() {
  return (
    <section className="section testimonials-section" id="testimonials">
      <div className="container">
        <div className="section-label">
          <span>05</span>
          TESTIMONIALS
        </div>

        <h2 className="section-title">
          CLIENTS I’VE
          <br />
          HELPED <span>GROW.</span>
        </h2>

        <div className="testimonial-grid">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="testimonial-card">
              <div className="stars" aria-label="Five star rating">
                ★★★★★
              </div>

              <p>“{testimonial.quote}”</p>

              <div className="testimonial-author">
                <div className="avatar">{testimonial.name.charAt(0)}</div>
                <div>
                  <strong>{testimonial.name}</strong>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;