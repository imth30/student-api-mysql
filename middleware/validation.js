const validateStudent = (req, res, next) => {
    const { firstName, lastName, email, age, grade } = req.body;
    const errors = [];

    if (!firstName || firstName.trim().length < 2) {
        errors.push('First name is required and must be at least 2 characters');
    } else if (firstName.trim().length > 50) {
        errors.push('First name cannot exceed 50 characters');
    }

    if (!lastName || lastName.trim().length < 2) {
        errors.push('Last name is required and must be at least 2 characters');
    } else if (lastName.trim().length > 50) {
        errors.push('Last name cannot exceed 50 characters');
    }

    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!email || !emailRegex.test(email)) {
        errors.push('Please enter a valid email address');
    }

    if (!age) {
        errors.push('Age is required');
    } else if (isNaN(age) || age < 5 || age > 100) {
        errors.push('Age must be between 5 and 100');
    }

    const validGrades = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
    if (!grade || !validGrades.includes(grade)) {
        errors.push('Please enter a valid grade (1st - 12th)');
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, errors: errors });
    }

    next();
};

module.exports = { validateStudent };