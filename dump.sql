CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    xp INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE challenges (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    difficulty VARCHAR(20) CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    points INTEGER DEFAULT 0,
    type VARCHAR(10) CHECK (type IN ('individu', 'tim')),
    deadline DATE,
    creator_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    creator_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE badges (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    condition TEXT
);


CREATE TABLE leaderboards (
    id SERIAL PRIMARY KEY,
    type VARCHAR(10) CHECK (type IN ('user', 'team')),
    reference_id INTEGER, 
    xp INTEGER DEFAULT 0,
    period VARCHAR(20) 
);