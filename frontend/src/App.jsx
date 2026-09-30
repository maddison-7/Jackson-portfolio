import { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Services from "./components/Services";
import Portfolio from "./components/Portfolio";
import Process from "./components/Process";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import AdminDashboard from "./pages/AdminDashboard";
import fallbackProjects from "./data/projects";
import "./App.css";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [projects, setProjects] = useState(fallbackProjects);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState("");
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setCurrentPath(window.location.pathname);

    window.addEventListener("popstate", syncPath);
    syncPath();

    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const response = await fetch("/api/projects");
        if (!response.ok) {
          throw new Error("Unable to load projects");
        }

        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
      } catch (error) {
        setProjectsError("Showing featured projects while the live portfolio is unavailable.");
        console.warn("Falling back to local project data:", error.message);
      } finally {
        setProjectsLoading(false);
      }
    };

    loadProjects();
  }, []);

  if (currentPath === "/admin") {
    return <AdminDashboard />;
  }

  return (
    <div className={darkMode ? "app dark" : "app light"}>
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      <main>
        <Hero />
        <About />
        <Services />
        <Portfolio
          projects={projects}
          projectsLoading={projectsLoading}
          projectsError={projectsError}
        />
        <Process />
        <Testimonials />
        <CTA />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

export default App;