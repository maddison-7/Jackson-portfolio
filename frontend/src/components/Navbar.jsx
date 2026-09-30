import { ArrowUpRight, Menu, Moon, Sun } from "lucide-react";

function Navbar({ darkMode, setDarkMode }) {
  const links = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Work", href: "#work" },
    { label: "Process", href: "#process" },
    { label: "Contact", href: "#contact" }
  ];

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="logo" aria-label="Jackson Madila home">
          <span>JM</span>
          <strong>JACKSON MADILA</strong>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-actions">
          <button
            type="button"
            className="theme-btn"
            onClick={() => setDarkMode((value) => !value)}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button type="button" className="menu-btn" aria-label="Open menu">
            <Menu size={18} />
          </button>

          <a href="#contact" className="nav-cta">
            Let’s Talk
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
    </header>
  );
}

export default Navbar;