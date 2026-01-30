const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { User } = require('../models/models'); // Importing the schema from Step 1

// --- HELPER: Email Transporter ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// --- PART A: Registration (Hashing & Salt) ---
// Requirement: "Secure storage of passwords/data using hashing along with salt" 
const registerUser = async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Allow Admin registration only if no Admin currently exists.
        // This prevents multiple Admin accounts while still allowing the first Admin.
        if (role && role.toLowerCase() === 'admin') {
            const existingAdmin = await User.findOne({ role: { $regex: '^admin$', $options: 'i' } });
            if (existingAdmin) {
                return res.status(403).json({ message: "An Admin already exists. New Admin registration is not allowed." });
            }
        }

        // 1. Generate unique salt 
        const salt = await bcrypt.genSalt(10);

        // 2. Hash password with salt 
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            passwordHash: hashedPassword,
            salt: salt, // Storing for demo purposes to show the examiner
            role: role || 'Student' // default to 'Student' when not provided
        });

        await newUser.save();
        res.status(201).json({ message: "Registration successful. Salted hash stored." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- PART B: Login (NIST MFA Model) ---
// Requirement: "Multi-Factor Authentication... password + email code" 
const loginStepOne = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) return res.status(404).json({ message: "User not found" });

        // Factor 1: Password Verification (Knowledge Factor) 
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        // Factor 2: Dynamic OTP Generation (Possession Factor) 
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        
        // Store OTP in user record (or use Redis/Cache for better security)
        user.mfaSecret = otp; 
        await user.save();

        // Send Email 
        await transporter.sendMail({
            from: '"Secure Exam Portal" <noreply@examportal.com>',
            to: user.username, // Assuming username is the email
            subject: "Your Exam Portal Login OTP",
            text: `Your one-time password is: ${otp}`
        });

        res.json({ message: "Factor 1 success. OTP sent to email." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- PART C: OTP Verification ---
const verifyOTP = async (req, res) => {
    const { username, otp } = req.body;
    const user = await User.findOne({ username });

    if (user && user.mfaSecret === otp) {
        // Clear OTP after use
        user.mfaSecret = null;
        await user.save();

        // Generate JWT for Authorization (Step 3) 
        const token = jwt.sign(
            { id: user._id, role: user.role }, 
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );

        res.json({ message: "MFA Successful", token, role: user.role });
    } else {
        res.status(401).json({ message: "Invalid OTP" });
    }
};

module.exports = { registerUser, loginStepOne, verifyOTP };