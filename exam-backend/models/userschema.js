const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: true, 
        unique: true 
    },
    // Required for Hashing & Digital Signature component 
    passwordHash: { 
        type: String, 
        required: true 
    },
    salt: { 
        type: String, 
        required: true 
    },
    // Required for Authorization / Access Control component 
    // Subjects: Student, Teacher, Admin
    role: { 
        type: String, 
        enum: ['Student', 'Teacher', 'Admin'], 
        default: 'Student' 
    },
    // Required for Multi-Factor Authentication (NIST Model) [cite: 10, 16]
    mfaSecret: { 
        type: String 
    }
});