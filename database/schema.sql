-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,   -- hashed password (bcrypt)
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    project_name VARCHAR(150) NOT NULL,
    language VARCHAR(50) DEFAULT 'javascript',
    source_code TEXT,                 -- the pasted/uploaded code
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    review_type VARCHAR(20) NOT NULL, -- 'static' or 'ai'
    overall_score INTEGER,            -- 0-100
    summary TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. REVIEW FINDINGS TABLE
CREATE TABLE IF NOT EXISTS review_findings (
    id SERIAL PRIMARY KEY,
    review_id INTEGER NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    severity VARCHAR(20) NOT NULL,    -- 'low', 'medium', 'high', 'critical'
    issue VARCHAR(255) NOT NULL,
    explanation TEXT,
    suggested_fix TEXT,
    file_name VARCHAR(150),
    line_number INTEGER
);

-- Helpful indexes for faster dashboard queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_findings_review_id ON review_findings(review_id);