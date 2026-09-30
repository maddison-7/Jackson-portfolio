import { useMemo, useState } from "react";
import { ArrowUpRight, X } from "lucide-react";
import fallbackProjects from "../data/projects";

const filters = [
  "All",
  "Branding",
  "Posters",
  "Social Media",
  "Logos",
  "Flyers",
  "Photo Editing"
];

const isVideo = (media = "") => /\.(mp4|webm|ogg|mov)(\?|$)/i.test(media);

function Portfolio({ projects: projectList = [], projectsLoading = false, projectsError = "" }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = Array.isArray(projectList) && projectList.length > 0 ? projectList : fallbackProjects;

  const visibleProjects = useMemo(() => {
    if (activeFilter === "All") {
      return projects;
    }

    return projects.filter((project) => project.category === activeFilter);
  }, [activeFilter, projects]);

  return (
    <section className="section portfolio-section" id="work">
      <div className="container">
        <div className="portfolio-heading">
          <div className="section-label">
            <span>03</span>
            SELECTED WORK
          </div>

          <p>
            A collection of visual stories shaped through branding,
            digital communication and creative direction.
          </p>
        </div>

        <div className="filter-buttons">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              className={`filter-btn ${activeFilter === filter ? "active" : ""}`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="portfolio-grid">
          {projectsLoading && <p className="portfolio-status">Loading live projects...</p>}
          {projectsError && <p className="portfolio-status portfolio-status-warning">{projectsError}</p>}

          {visibleProjects.map((project) => (
            <article
              key={project.id}
              className="project-card"
              onClick={() => setSelectedProject(project)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setSelectedProject(project);
                }
              }}
            >
              <div className="project-image">
                {isVideo(project.image) ? (
                  <video src={project.image} muted loop autoPlay playsInline aria-label={project.title} />
                ) : (
                  <img src={project.image} alt={project.title} />
                )}
                <div className="project-overlay">
                  <span>VIEW PROJECT</span>
                  <ArrowUpRight size={16} />
                </div>
              </div>

              <div className="project-info">
                <div>
                  <h3>{project.title}</h3>
                  <span>{project.category}</span>
                </div>

                <span>{project.year}</span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selectedProject && (
        <div
          className="modal-backdrop"
          onClick={() => setSelectedProject(null)}
          role="presentation"
        >
          <div
            className="project-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label={selectedProject.title}
          >
            <button
              type="button"
              className="modal-close"
              onClick={() => setSelectedProject(null)}
              aria-label="Close project preview"
            >
              <X size={20} />
            </button>

            {isVideo(selectedProject.image) ? (
              <video src={selectedProject.image} controls autoPlay playsInline aria-label={selectedProject.title} />
            ) : (
              <img src={selectedProject.image} alt={selectedProject.title} />
            )}

            <div className="modal-content">
              <span>{selectedProject.category}</span>
              <h2>{selectedProject.title}</h2>
              <p>{selectedProject.description}</p>

              <div className="modal-meta">
                <div>
                  <small>YEAR</small>
                  <strong>{selectedProject.year}</strong>
                </div>

                <div>
                  <small>TOOLS</small>
                  <strong>{selectedProject.tools}</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Portfolio;
