import {
  ArrowUpRight,
  Palette,
  Smartphone,
  Printer,
  Camera
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Brand Identity",
    description:
      "Logos, visual systems, colors and brand direction that make businesses recognizable.",
    icon: Palette
  },
  {
    number: "02",
    title: "Digital Design",
    description:
      "Social media graphics, digital campaigns and visual content designed for modern platforms.",
    icon: Smartphone
  },
  {
    number: "03",
    title: "Print Design",
    description:
      "Posters, flyers, brochures, business cards and marketing materials.",
    icon: Printer
  },
  {
    number: "04",
    title: "Photo Editing",
    description:
      "Professional retouching, manipulation and creative image enhancement.",
    icon: Camera
  }
];

function Services() {
  return (
    <section className="section services-section" id="services">

      <div className="container">

        <div className="section-label">
          <span>02</span>
          WHAT I DO
        </div>

        <div className="services-heading">
          <h2 className="section-title">
            CREATIVE
            <br />
            SERVICES
          </h2>

          <p>
            From brand identity to digital experiences,
            I create visual solutions designed around
            your goals.
          </p>
        </div>

        <div className="services-list">

          {services.map((service) => {
            const Icon = service.icon;

            return (
              <div className="service-item" key={service.number}>

                <span className="service-number">
                  {service.number}
                </span>

                <div className="service-icon">
                  <Icon size={26} />
                </div>

                <div className="service-info">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </div>

                <ArrowUpRight className="service-arrow" />

              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}

export default Services;