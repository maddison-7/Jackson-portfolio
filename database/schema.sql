CREATE DATABASE IF NOT EXISTS jackson_portfolio CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE jackson_portfolio;

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  year VARCHAR(20) NOT NULL,
  image TEXT,
  description TEXT NOT NULL,
  tools VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS contact_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(255),
  project_type VARCHAR(255),
  budget VARCHAR(255),
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO projects (title, category, year, image, description, tools)
VALUES
  (
    'Urban Identity',
    'Branding',
    '2026',
    'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200&q=80',
    'A modern visual identity concept focused on creating a bold and memorable brand presence.',
    'Adobe Illustrator, Photoshop'
  ),
  (
    'Creative Poster',
    'Posters',
    '2026',
    'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    'An experimental poster composition combining typography, photography and geometric forms.',
    'Adobe Photoshop, Illustrator'
  )
ON DUPLICATE KEY UPDATE
  title = VALUES(title),
  category = VALUES(category),
  year = VALUES(year),
  image = VALUES(image),
  description = VALUES(description),
  tools = VALUES(tools);
