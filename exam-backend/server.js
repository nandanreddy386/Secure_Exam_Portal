require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');
const { registerUser, loginStepOne, verifyOTP } = require('./controllers/authController');
const { createExam, submitExam } = require('./controllers/examController');
const { authenticateToken, authorizeRole } = require('./middleware');
const { Exam, Result } = require('./models/models');

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to Secure Database"))
    .catch(err => console.error("Database Connection Error:", err));

// 2. Authentication (NIST MFA Model)
app.post('/api/register', registerUser);
app.post('/api/login/step1', loginStepOne);
app.post('/api/login/verify-otp', verifyOTP);

// 3. Exam Management (AES-256 Confidentiality)

// TEACHER: Create Exams (Encrypts MCQ Objects)
app.post('/api/exams', authenticateToken, authorizeRole(['Teacher']), createExam);

// STUDENT/TEACHER: View All Exams (Decrypted list for Dashboard)
app.get('/api/exams', authenticateToken, async (req, res) => {
    try {
        const exams = await Exam.find();
        const decryptedExams = exams.map(exam => {
            try {
                const bytes = CryptoJS.AES.decrypt(exam.encryptedQuestions, process.env.AES_SECRET_KEY);
                const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
                if (!decryptedData) throw new Error("Decryption failed");
                return { ...exam._doc, questions: JSON.parse(decryptedData) };
            } catch (err) {
                return { ...exam._doc, questions: [] };
            }
        });
        res.json(decryptedExams);
    } catch (err) {
        res.status(500).json({ error: "Data retrieval error" });
    }
});

// NEW ROUTE: Fetch Single Exam (Fixes the 404 error when clicking Attend)
app.get('/api/exams/:id', authenticateToken, async (req, res) => {
    try {
        const exam = await Exam.findById(req.params.id);
        if (!exam) return res.status(404).json({ message: "Exam Object not found" });

        // Decrypt Questions for the authorized Subject
        const bytes = CryptoJS.AES.decrypt(exam.encryptedQuestions, process.env.AES_SECRET_KEY);
        const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
        
        res.json({
            ...exam._doc,
            questions: JSON.parse(decryptedData)
        });
    } catch (err) {
        res.status(500).json({ error: "Failed to load the specific exam object" });
    }
});

// ADMIN: Update Exam Date (Timeline Object Management)
app.put('/api/admin/exams/:id', authenticateToken, authorizeRole(['Admin']), async (req, res) => {
    try {
        const { examDate } = req.body;
        await Exam.findByIdAndUpdate(req.params.id, { examDate });
        res.json({ message: "Exam date updated by Admin." });
    } catch (err) {
        res.status(500).json({ error: "Unauthorized scheduling." });
    }
});

// 4. Integrity & Submission Management

// STUDENT: Fetch history for Dashboard status badges
app.get('/api/my-results', authenticateToken, async (req, res) => {
    try {
        const results = await Result.find({ student: req.user.id });
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Could not fetch submission history" });
    }
});

// STUDENT: Submit Exam with HMAC Signature
app.post('/api/submit', authenticateToken, authorizeRole(['Student']), async (req, res) => {
    try {
        const { examId } = req.body;
        const alreadySubmitted = await Result.findOne({ student: req.user.id, exam: examId });
        if (alreadySubmitted) {
            return res.status(403).json({ message: "Integrity violation: Multiple attempts blocked." });
        }
        await submitExam(req, res); 
    } catch (err) {
        res.status(500).json({ error: "Submission processing failed" });
    }
});

// TEACHER: Integrity Verification Panel
app.get('/api/results', authenticateToken, authorizeRole(['Teacher']), async (req, res) => {
    try {
        const results = await Result.find()
            .populate('student', 'username') // Subject Identification
            .populate('exam', 'title');     // Object Identification
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch integrity logs" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Secure Server running on port ${PORT}`));