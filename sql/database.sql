-- Create database
CREATE DATABASE IF NOT EXISTS student_db;
USE student_db;

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    age INT NOT NULL CHECK (age >= 5 AND age <= 100),
    grade VARCHAR(10) NOT NULL,
    subjects TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample data
INSERT INTO students (first_name, last_name, email, age, grade, subjects) VALUES
('John', 'Doe', 'john@example.com', 18, '12th', 'Math, Science, English'),
('Jane', 'Smith', 'jane@example.com', 17, '11th', 'Physics, Chemistry, Biology'),
('Alice', 'Johnson', 'alice@example.com', 16, '10th', 'History, Geography, English');

-- Create index for better performance
CREATE INDEX idx_email ON students(email);
CREATE INDEX idx_grade ON students(grade);