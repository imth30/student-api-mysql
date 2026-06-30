const { promisePool } = require('../config/database');

const getAllStudents = async () => {
    const [rows] = await promisePool.query(
        'SELECT * FROM students WHERE is_active = TRUE ORDER BY created_at DESC'
    );
    return rows;
};

const getStudentById = async (id) => {
    const [rows] = await promisePool.query(
        'SELECT * FROM students WHERE id = ? AND is_active = TRUE',
        [id]
    );
    return rows[0];
};

const createStudent = async (studentData) => {
    const { firstName, lastName, email, age, grade, subjects } = studentData;
    const subjectsStr = Array.isArray(subjects) ? subjects.join(', ') : subjects || '';
    
    const [result] = await promisePool.query(
        `INSERT INTO students (first_name, last_name, email, age, grade, subjects) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [firstName, lastName, email, age, grade, subjectsStr]
    );
    
    return result.insertId;
};

const updateStudent = async (id, studentData) => {
    const { firstName, lastName, email, age, grade, subjects } = studentData;
    const subjectsStr = Array.isArray(subjects) ? subjects.join(', ') : subjects || '';
    
    const [result] = await promisePool.query(
        `UPDATE students 
         SET first_name = ?, last_name = ?, email = ?, age = ?, grade = ?, subjects = ?
         WHERE id = ? AND is_active = TRUE`,
        [firstName, lastName, email, age, grade, subjectsStr, id]
    );
    
    return result.affectedRows > 0;
};

const deleteStudent = async (id) => {
    const [result] = await promisePool.query(
        'UPDATE students SET is_active = FALSE WHERE id = ?',
        [id]
    );
    return result.affectedRows > 0;
};

const emailExists = async (email, excludeId = null) => {
    let query = 'SELECT id FROM students WHERE email = ? AND is_active = TRUE';
    const params = [email];
    
    if (excludeId) {
        query += ' AND id != ?';
        params.push(excludeId);
    }
    
    const [rows] = await promisePool.query(query, params);
    return rows.length > 0;
};

module.exports = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
    emailExists,
};