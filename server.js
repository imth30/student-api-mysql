const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const studentRoutes = require('./routes/students');

connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api/students', studentRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ success: false, message: 'Server Error', error: err.message });
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API: http://localhost:${PORT}/api/students`);
});