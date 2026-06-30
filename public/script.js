// API Base URL
const API_URL = 'http://localhost:5000/api/students';

// DOM Elements
const studentForm = document.getElementById('studentForm');
const studentList = document.getElementById('studentList');
const loading = document.getElementById('loading');
const formMessage = document.getElementById('formMessage');

let editingId = null;

// Fetch all students
async function fetchStudents() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.success) {
            renderStudents(data.data);
        } else {
            showError('Failed to load students');
        }
    } catch (error) {
        showError('Error connecting to server');
        console.error('Error:', error);
    }
}

// Render students
function renderStudents(students) {
    loading.style.display = 'none';
    
    if (students.length === 0) {
        studentList.innerHTML = '<div class="empty-state">📭 No students found. Add one above!</div>';
        return;
    }
    
    studentList.innerHTML = `
        <div class="student-grid">
            ${students.map(student => `
                <div class="student-card" data-id="${student.id}">
                    <div class="name">${student.first_name} ${student.last_name}</div>
                    <div class="email">✉️ ${student.email}</div>
                    <div class="details">🎓 ${student.grade} Grade • Age: ${student.age}</div>
                    ${student.subjects ? `
                        <div class="subjects">
                            📚 ${student.subjects.split(',').map(sub => `<span>${sub.trim()}</span>`).join('')}
                        </div>
                    ` : ''}
                    <div class="actions">
                        <button class="btn btn-edit" onclick="editStudent(${student.id})">✏️ Edit</button>
                        <button class="btn btn-danger" onclick="deleteStudent(${student.id})">🗑️ Delete</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Add or Update student
studentForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideMessage();
    
    const formData = {
        firstName: document.getElementById('firstName').value.trim(),
        lastName: document.getElementById('lastName').value.trim(),
        email: document.getElementById('email').value.trim(),
        age: parseInt(document.getElementById('age').value),
        grade: document.getElementById('grade').value,
        subjects: document.getElementById('subjects').value.split(',').map(s => s.trim()).filter(s => s),
    };
    
    // Validate
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.age || !formData.grade) {
        showError('Please fill in all required fields (*)');
        return;
    }
    
    try {
        let response;
        const url = editingId ? `${API_URL}/${editingId}` : API_URL;
        const method = editingId ? 'PUT' : 'POST';
        
        response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess(editingId ? 'Student updated successfully!' : 'Student added successfully!');
            studentForm.reset();
            editingId = null;
            document.querySelector('.btn-primary').textContent = 'Add Student';
            document.querySelector('.form-section h2').textContent = 'Add New Student';
            fetchStudents();
        } else {
            const errorMsg = data.errors ? data.errors.join(', ') : data.message || 'Operation failed';
            showError(errorMsg);
        }
    } catch (error) {
        showError('Error connecting to server');
        console.error('Error:', error);
    }
});

// Edit student
async function editStudent(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        const data = await response.json();
        
        if (data.success) {
            const student = data.data;
            document.getElementById('firstName').value = student.first_name;
            document.getElementById('lastName').value = student.last_name;
            document.getElementById('email').value = student.email;
            document.getElementById('age').value = student.age;
            document.getElementById('grade').value = student.grade;
            document.getElementById('subjects').value = student.subjects || '';
            
            editingId = id;
            document.querySelector('.btn-primary').textContent = 'Update Student';
            document.querySelector('.form-section h2').textContent = 'Edit Student';
            
            // Scroll to form
            document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        }
    } catch (error) {
        showError('Error loading student data');
        console.error('Error:', error);
    }
}

// Delete student
async function deleteStudent(id) {
    if (!confirm('Are you sure you want to delete this student?')) return;
    
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        
        const data = await response.json();
        
        if (data.success) {
            showSuccess('Student deleted successfully!');
            fetchStudents();
        } else {
            showError('Failed to delete student');
        }
    } catch (error) {
        showError('Error connecting to server');
        console.error('Error:', error);
    }
}

// Show messages
function showSuccess(message) {
    formMessage.className = 'message success';
    formMessage.textContent = message;
    setTimeout(hideMessage, 5000);
}

function showError(message) {
    formMessage.className = 'message error';
    formMessage.textContent = message;
    setTimeout(hideMessage, 5000);
}

function hideMessage() {
    formMessage.className = 'message';
    formMessage.textContent = '';
}

// Load students on page load
fetchStudents();