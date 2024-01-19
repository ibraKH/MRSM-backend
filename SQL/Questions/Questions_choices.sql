CREATE TABLE question_choices (
  id SERIAL PRIMARY KEY,
  question_id INTEGER REFERENCES questions(id),
  choice VARCHAR(255) NOT NULL
);
