const mongoose = require('mongoose');

// 1. User Schema (MFA & Role Based Access Control)
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    salt: { type: String }, // For your salt/hashing demo
    role: { type: String, enum: ['Student', 'Teacher','Admin'], required: true },
    mfaSecret: { type: String } // Stores the OTP for NIST MFA
});

// 2. Exam Schema (AES-256 Confidentiality)
const examSchema = new mongoose.Schema({
    title: { type: String, required: true },
    // This stores the entire MCQ object (Questions + Options) as ciphertext
    encryptedQuestions: { type: String, required: true }, 
    examDate: { type: Date }, // New field for Admin to manage
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});


// 3. Result Schema (Integrity & Prevention of Duplicate Submissions)
const resultSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exam: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    answers: { type: Object, required: true }, // Stores selected option indices
    digitalSignature: { type: String, required: true }, // HMAC-SHA256 for Integrity
    submittedAt: { type: Date, default: Date.now }
});

// Adding a Unique Compound Index to prevent duplicate submissions at the DB level
resultSchema.index({ student: 1, exam: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);
const Exam = mongoose.model('Exam', examSchema);
const Result = mongoose.model('Result', resultSchema);

module.exports = { User, Exam, Result };