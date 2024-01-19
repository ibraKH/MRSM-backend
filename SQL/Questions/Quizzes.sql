CREATE TABLE quizzes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255) NOT NULL,
  author_username VARCHAR(255) NOT NULL,
  created_at VARCHAR(255) NOT NULL,
  FOREIGN KEY (author_username) REFERENCES mrsm_users(username)
);