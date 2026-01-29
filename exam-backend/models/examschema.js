const ExamSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    // Instead of plain text, we store the AES Encrypted string here 
    encryptedQuestions: { 
        type: String, 
        required: true 
    },
    // Authorization: Tracks which 'Teacher' subject owns this object [cite: 16, 17]
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});