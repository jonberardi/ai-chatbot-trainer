DROP TABLE IF EXISTS personas;
DROP TABLE IF EXISTS evaluation_criteria;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS conversations;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS evaluations;
DROP TABLE IF EXISTS student_performance;

-- Create personas table
CREATE TABLE personas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    background TEXT,
    expertise TEXT,
    personality TEXT,
    avatar_url TEXT,
    conversation_style TEXT,
    knowledge_domains TEXT,
    difficulty_level TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create evaluation_criteria table
CREATE TABLE evaluation_criteria (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    weight REAL DEFAULT 1.0,
    persona_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE
);

-- Create students table
CREATE TABLE students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create conversations table
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    persona_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    status TEXT DEFAULT 'active',
    started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    ended_at DATETIME,
    FOREIGN KEY (persona_id) REFERENCES personas(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
);

-- Create messages table
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    sender_type TEXT NOT NULL, -- 'student' or 'persona'
    content TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Create evaluations table
CREATE TABLE evaluations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL,
    message_id INTEGER NOT NULL,
    criteria_id INTEGER NOT NULL,
    score REAL,
    feedback TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(id) ON DELETE CASCADE
);

-- Create student_performance table
CREATE TABLE student_performance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER NOT NULL,
    conversation_id INTEGER NOT NULL,
    overall_score REAL,
    strengths TEXT,
    areas_for_improvement TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
);

-- Insert sample personas
INSERT INTO personas (name, background, expertise, personality, conversation_style, knowledge_domains, difficulty_level)
VALUES 
('Interview Coach', 'Experienced HR professional with 15 years in tech recruitment', 'Technical interviews, behavioral questions, resume review', 'Professional, supportive, analytical', 'Formal with constructive feedback', 'Software engineering, data science, product management', 'Intermediate'),
('Customer Service Trainer', 'Former customer support manager for Fortune 500 companies', 'Conflict resolution, empathy, problem-solving', 'Patient, empathetic, detail-oriented', 'Conversational with specific scenarios', 'Retail, hospitality, technical support', 'Beginner');

-- Insert sample evaluation criteria for Interview Coach
INSERT INTO evaluation_criteria (name, description, weight, persona_id)
VALUES 
('Technical Accuracy', 'Correctness of technical information provided', 2.0, 1),
('Communication Clarity', 'Clear and concise expression of ideas', 1.5, 1),
('Problem-Solving Approach', 'Structured and logical approach to solving problems', 1.8, 1),
('Confidence', 'Appropriate level of confidence in responses', 1.0, 1);

-- Insert sample evaluation criteria for Customer Service Trainer
INSERT INTO evaluation_criteria (name, description, weight, persona_id)
VALUES 
('Empathy', 'Demonstration of understanding and concern for customer feelings', 2.0, 2),
('Solution Orientation', 'Focus on resolving issues effectively', 1.5, 2),
('Professionalism', 'Maintaining composure and professional tone', 1.3, 2),
('Active Listening', 'Acknowledging and addressing all customer concerns', 1.7, 2);
