const studentModel = require('../models/studentModel');

// @desc    Get all students
// @route   GET /api/students
const getStudents = async (req, res) => {
    try {
        const students = await studentModel.getAllStudents();
        res.status(200).json({
            success: true,
            count: students.length,
            data: students,
        });
    } catch (error) {
        console.error('Error in getStudents:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Get single student
// @route   GET /api/students/:id
const getStudentById = async (req, res) => {
    try {
        const student = await studentModel.getStudentById(req.params.id);
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.status(200).json({
            success: true,
            data: student,
        });
    } catch (error) {
        console.error('Error in getStudentById:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Create a student
// @route   POST /api/students
const createStudent = async (req, res) => {
    try {
        // Check if student with same email exists
        const exists = await studentModel.emailExists(req.body.email);
        if (exists) {
            return res.status(400).json({
                success: false,
                message: 'Student with this email already exists',
            });
        }

        const id = await studentModel.createStudent(req.body);
        const newStudent = await studentModel.getStudentById(id);
        
        res.status(201).json({
            success: true,
            data: newStudent,
        });
    } catch (error) {
        console.error('Error in createStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
const updateStudent = async (req, res) => {
    try {
        // Check if student exists
        const existingStudent = await studentModel.getStudentById(req.params.id);
        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        // Check if email is being changed and already exists
        if (req.body.email && req.body.email !== existingStudent.email) {
            const exists = await studentModel.emailExists(req.body.email, req.params.id);
            if (exists) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already in use by another student',
                });
            }
        }

        const updated = await studentModel.updateStudent(req.params.id, req.body);
        
        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or could not be updated',
            });
        }

        const updatedStudent = await studentModel.getStudentById(req.params.id);
        res.status(200).json({
            success: true,
            data: updatedStudent,
        });
    } catch (error) {
        console.error('Error in updateStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

// @desc    Delete a student
// @route   DELETE /api/students/:id
const deleteStudent = async (req, res) => {
    try {
        // Check if student exists
        const existingStudent = await studentModel.getStudentById(req.params.id);
        if (!existingStudent) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        const deleted = await studentModel.deleteStudent(req.params.id);
        
        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully',
        });
    } catch (error) {
        console.error('Error in deleteStudent:', error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};

module.exports = {
    getStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent,
};