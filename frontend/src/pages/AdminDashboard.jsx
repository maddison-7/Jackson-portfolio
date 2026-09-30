import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  category: "Branding",
  year: String(new Date().getFullYear()),
  image: "",
  description: "",
  tools: ""
};

const tokenStorageKey = "portfolio-admin-token";

function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(() => Boolean(localStorage.getItem(tokenStorageKey)));
  const [authLoading, setAuthLoading] = useState(() => Boolean(localStorage.getItem(tokenStorageKey)));
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });

  const getToken = () => localStorage.getItem(tokenStorageKey) || "";

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      if (!response.ok) {
        throw new Error("Unable to load projects");
      }

      const data = await response.json();
      setProjects(data);
    } catch (error) {
      setStatus(error.message || "Unable to load projects.");
    } finally {
      setLoading(false);
    }
  };

  const validateSession = async () => {
    const token = getToken();

    if (!token) {
      return;
    }

    try {
      const response = await fetch("/api/admin/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error("Session expired");
      }

      await fetchProjects();
    } catch {
      localStorage.removeItem(tokenStorageKey);
      setIsAuthenticated(false);
      setStatus("Your session expired. Please log in again.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginForm((previous) => ({
      ...previous,
      [name]: value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials.");
      }

      localStorage.setItem(tokenStorageKey, data.token);
      setIsAuthenticated(true);
      setStatus("");
      setLoginForm({ username: "", password: "" });
      await fetchProjects();
    } catch (error) {
      setStatus(error.message || "Unable to log in.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(tokenStorageKey);
    setIsAuthenticated(false);
    setStatus("You have been logged out.");
    setProjects([]);
    setFormData(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.title || !formData.category || !formData.year || !formData.description || (!editingId && !mediaFile)) {
      setStatus("Please complete the required fields and choose an image or video.");
      return;
    }

    try {
      const token = getToken();
      const endpoint = editingId ? `/api/projects/${editingId}` : "/api/projects";
      const method = editingId ? "PUT" : "POST";

      const requestData = new FormData();
      Object.entries(formData).forEach(([key, value]) => requestData.append(key, value));
      if (mediaFile) {
        requestData.append("media", mediaFile);
      }

      const response = await fetch(endpoint, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: requestData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Project save failed.");
      }

      setStatus(editingId ? "Project updated successfully." : "Project created successfully.");
      setFormData(emptyForm);
      setMediaFile(null);
      setEditingId(null);
      await fetchProjects();
    } catch (error) {
      setStatus(error.message || "Project save failed.");
    }
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setFormData({
      title: project.title,
      category: project.category,
      year: project.year,
      image: project.image || "",
      description: project.description,
      tools: project.tools || ""
    });
    setMediaFile(null);
    setStatus("Editing project: " + project.title);
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) {
      return;
    }

    try {
      const token = getToken();
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Delete failed.");
      }

      setStatus("Project deleted successfully.");
      await fetchProjects();
    } catch (error) {
      setStatus(error.message || "Delete failed.");
    }
  };

  const resetForm = () => {
    setFormData(emptyForm);
    setMediaFile(null);
    setEditingId(null);
    setStatus("");
  };

  if (authLoading) {
    return <div className="admin-page"><div className="container"><p className="admin-empty">Checking access...</p></div></div>;
  }

  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="container auth-shell">
          <div className="admin-card login-card">
            <span className="section-label admin-label"><span>ADMIN</span> ACCESS</span>
            <h1 className="section-title">JACKSON <span>PORTFOLIO</span></h1>

            <form onSubmit={handleLogin} className="admin-form">
              <div className="form-group">
                <label htmlFor="admin-username">Username</label>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  value={loginForm.username}
                  onChange={handleLoginChange}
                  placeholder="jackson"
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  placeholder="Enter your password"
                />
              </div>

              {status && <p className="form-status">{status}</p>}

              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary">Log in</button>
                <a href="/" className="btn btn-outline">Back to site</a>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="container admin-shell">
        <header className="admin-header">
          <div>
            <span className="section-label admin-label">
              <span>ADMIN</span>
              PORTFOLIO DASHBOARD
            </span>
            <h1 className="section-title">MANAGE <span>PROJECTS</span></h1>
          </div>

          <div className="admin-header-actions">
            <a href="/" className="btn btn-outline">Back to site</a>
            <button type="button" className="btn btn-primary" onClick={handleLogout}>Log out</button>
          </div>
        </header>

        <div className="admin-grid">
          <section className="admin-card">
            <h2>{editingId ? "Edit project" : "Add a new project"}</h2>

            <form onSubmit={handleSubmit} className="admin-form">
              <div className="form-group">
                <label htmlFor="title">Title</label>
                <input id="title" name="title" value={formData.title} onChange={handleChange} placeholder="Urban Identity" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="category">Category</label>
                  <select id="category" name="category" value={formData.category} onChange={handleChange}>
                    <option value="Branding">Branding</option>
                    <option value="Posters">Posters</option>
                    <option value="Social Media">Social Media</option>
                    <option value="Logos">Logos</option>
                    <option value="Flyers">Flyers</option>
                    <option value="Photo Editing">Photo Editing</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="year">Year</label>
                  <input id="year" name="year" value={formData.year} onChange={handleChange} placeholder="2026" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="media">Project image or video</label>
                <input
                  id="media"
                  name="media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(event) => setMediaFile(event.target.files?.[0] || null)}
                />
                <small className="form-help">
                  {mediaFile ? `Selected: ${mediaFile.name}` : editingId && formData.image ? "Choose a new file to replace the current media." : "Upload an image or video, up to 50 MB."}
                </small>
              </div>

              <div className="form-group">
                <label htmlFor="tools">Tools</label>
                <input id="tools" name="tools" value={formData.tools} onChange={handleChange} placeholder="Adobe Illustrator, Photoshop" />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea id="description" name="description" rows="5" value={formData.description} onChange={handleChange} placeholder="Project summary..." />
              </div>

              {status && <p className="form-status">{status}</p>}

              <div className="admin-form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update project" : "Save project"}
                </button>
                {editingId && (
                  <button type="button" className="btn btn-outline" onClick={resetForm}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </section>

          <section className="admin-card">
            <h2>Project list</h2>

            {loading ? (
              <p className="admin-empty">Loading projects...</p>
            ) : projects.length === 0 ? (
              <p className="admin-empty">No projects saved yet.</p>
            ) : (
              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Year</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((project) => (
                      <tr key={project.id}>
                        <td>{project.title}</td>
                        <td>{project.category}</td>
                        <td>{project.year}</td>
                        <td className="admin-actions">
                          <button type="button" className="admin-action edit" onClick={() => handleEdit(project)}>
                            Edit
                          </button>
                          <button type="button" className="admin-action delete" onClick={() => handleDelete(project.id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
