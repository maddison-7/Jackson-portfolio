import { ArrowUpRight } from "lucide-react";

function Footer() {
  return (
    <footer className="footer">

      <div className="container">

        <div className="footer-top">

          <div>
            <div className="footer-logo">
              JACKSON MADILA
            </div>

            <p>
              Graphic Designer & Visual Creative
            </p>
          </div>

          <a href="#home" className="back-top">
            BACK TO TOP
            <ArrowUpRight size={18} />
          </a>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 Jackson Madila. All Rights Reserved.
          </span>

          <div className="footer-socials">
            <a href="#">Instagram</a>
            <a href="#">Behance</a>
            <a href="#">LinkedIn</a>
            <a href="#">WhatsApp</a>
            <a href="/admin">Admin</a>
          </div>

        </div>

      </div>

    </footer>
  );
}

export default Footer;