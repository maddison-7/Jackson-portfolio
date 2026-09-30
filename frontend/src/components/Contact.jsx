import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    projectType: "",
    budget: "",
    message: ""
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.message
    ) {
      setStatus("Please complete the required fields.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          projectType: formData.projectType,
          budget: formData.budget,
          message: formData.message
        })
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Unable to send message.");
      }

      setStatus("Message sent successfully. Jackson will be in touch soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        projectType: "",
        budget: "",
        message: ""
      });
    } catch (error) {
      setStatus(error.message || "Unable to send message.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section contact-section" id="contact">

      <div className="container">

        <div className="section-label">
          <span>06</span>
          CONTACT
        </div>

        <div className="contact-heading">

          <h2 className="section-title">
            LET'S CREATE
            <br />
            SOMETHING
            <br />
            <span>GREAT.</span>
          </h2>

          <p>
            Have a project, idea or brand that needs
            a fresh visual direction? Let's talk.
          </p>

        </div>

        <div className="contact-grid">

          <div className="contact-info">

            <div className="contact-item">
              <Mail size={21} />
              <div>
                <span>EMAIL</span>
                <a href="mailto:jacksonmadila99@gmail.com">
                  jacksonmadila99@gmail.com
                </a>
              </div>
            </div>

            <div className="contact-item">
              <Phone size={21} />
              <div>
                <span>PHONE</span>
                <a href="tel:+255747616168">
                  0747616168
                </a>
              </div>
            </div>

            <div className="contact-item">
              <MapPin size={21} />
              <div>
                <span>LOCATION</span>
                <p>Tanzania</p>
              </div>
            </div>

            <a
              className="btn btn-primary"
              href="https://wa.me/255747616168?text=Hello%20Jackson%2C%20I%27d%20like%20to%20discuss%20a%20project."
              target="_blank"
              rel="noreferrer"
              aria-label="Contact Jackson on WhatsApp"
            >
              WhatsApp Chat
            </a>

          </div>

          <form
            className="contact-form"
            onSubmit={handleSubmit}
          >

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="name">YOUR NAME *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">EMAIL *</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
              </div>

            </div>

            <div className="form-row">

              <div className="form-group">
                <label htmlFor="phone">PHONE</label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+255..."
                />
              </div>

              <div className="form-group">
                <label htmlFor="projectType">
                  PROJECT TYPE
                </label>

                <select
                  id="projectType"
                  name="projectType"
                  value={formData.projectType}
                  onChange={handleChange}
                >
                  <option value="">Select type</option>
                  <option value="Brand Identity">
                    Brand Identity
                  </option>
                  <option value="Poster">
                    Poster Design
                  </option>
                  <option value="Social Media">
                    Social Media Design
                  </option>
                  <option value="Logo">
                    Logo Design
                  </option>
                  <option value="Photo Editing">
                    Photo Editing
                  </option>
                  <option value="Other">
                    Other
                  </option>
                </select>

              </div>

            </div>

            <div className="form-group">
              <label htmlFor="budget">BUDGET</label>

              <select
                id="budget"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
              >
                <option value="">Select budget</option>
                <option value="Under TZS 100,000">
                  Under TZS 100,000
                </option>
                <option value="TZS 100,000 - 300,000">
                  TZS 100,000 - 300,000
                </option>
                <option value="TZS 300,000 - 500,000">
                  TZS 300,000 - 500,000
                </option>
                <option value="Above TZS 500,000">
                  Above TZS 500,000
                </option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="message">TELL ME ABOUT YOUR PROJECT *</label>

              <textarea
                id="message"
                name="message"
                rows="6"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me what you want to create..."
              ></textarea>
            </div>

            {status && (
              <p className="form-status">{status}</p>
            )}

            <button
              type="submit"
              className="btn btn-primary submit-btn"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Sending..." : "Send Inquiry"}
              <Send size={18} />
            </button>

          </form>

        </div>

      </div>

    </section>
  );
}

export default Contact;