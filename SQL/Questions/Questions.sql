CREATE TABLE questions (
  id SERIAL PRIMARY KEY,
  quiz_id INTEGER REFERENCES quizzes(id),
  question VARCHAR(255) NOT NULL,
  type VARCHAR(20) NOT NULL CHECK (type IN ('multiple choice', 'short response', 'true/false')),
  answer VARCHAR(255) NOT NULL
);