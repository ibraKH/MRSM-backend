CREATE TABLE events (
  eventID SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES mrsm_users(user_id),
  eventType VARCHAR(255) NOT NULL,
  eventName VARCHAR(255) NOT NULL,
  eventDate VARCHAR(255) NOT NULL,
  eventURL VARCHAR(255) NOT NULL
);