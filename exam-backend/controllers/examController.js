const CryptoJS = require('crypto-js');
const { Exam, Result } = require('../models/models');

// 1. Create Exam (AES-256 Encryption)
// Satisfies Requirement: "Confidentiality of exam content"
const createExam = async (req, res) => {
    try {
        const { title, questions } = req.body; // 'questions' is the MCQ object array

        // Encrypt the entire MCQ object array using AES-256
        const encryptedData = CryptoJS.AES.encrypt(
            JSON.stringify(questions), 
            process.env.AES_SECRET_KEY
        ).toString();

        const newExam = new Exam({
            title,
            encryptedQuestions: encryptedData,
            createdBy: req.user.id // Subject (Teacher) in Access Control Matrix
        });

        await newExam.save();
        res.status(201).json({ message: "Exam created and MCQ data encrypted with AES-256." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Submit Exam (Digital Signature for Integrity & Non-Repudiation)
// Satisfies Requirement: "Demonstrate data integrity using Digital Signature"
const submitExam = async (req, res) => {
    try {
        const { examId, answers } = req.body;

        // Step A: Create a SHA-256 Hash of the student's selected answers
        const dataHash = CryptoJS.SHA256(JSON.stringify(answers)).toString();

        // Step B: Sign the hash with the SIGNATURE_KEY to create a Digital Signature (HMAC)
        // This ensures the student cannot deny the submission (Non-repudiation)
        const signature = CryptoJS.HmacSHA256(dataHash, process.env.SIGNATURE_KEY).toString();

        const newResult = new Result({
            student: req.user.id, // Links result to the specific student
            exam: examId,         // Links result to the specific exam for completion tracking
            answers,
            digitalSignature: signature // The "Seal" of integrity
        });

        await newResult.save();
        res.json({ 
            message: "Exam submitted successfully.", 
            signature: signature // Returning signature for demo visibility
        });
    } catch (error) {
        // This catch block handles the Duplicate Submission error from the DB level
        if (error.code === 11000) {
            return res.status(403).json({ message: "Integrity Error: You have already submitted this exam." });
        }
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createExam, submitExam };