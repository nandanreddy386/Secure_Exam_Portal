

🛡️ SecurePortal: NIST-Compliant Exam Management System
SecurePortal is a full-stack, security-first web application designed for academic examinations. This project implements the core pillars of Information Security—Confidentiality, Integrity, and Availability (CIA)—through a robust architecture following NIST guidelines.

🚀 Key Security Features
1. Authentication (NIST SP 800-63-2 Model)
Multi-Factor Authentication (MFA): Implements a two-factor process using a password (Knowledge Factor) and a time-sensitive email OTP (Possession Factor).

Password Hashing: Uses Bcrypt with a salt (cost factor 10) to ensure passwords are never stored in plaintext, protecting against Rainbow Table attacks.

2. Authorization & Access Control

Access Control Matrix (ACM): Programmatically enforces permissions across 3 Subjects (Admin, Teacher, Student) and 3 Objects (Exams, Results, Schedules).

Role-Based Access Control (RBAC): Custom middleware protects API routes, ensuring a Student cannot access Teacher objects like "Create Exam" or "View All Results".

3. Cryptography (Confidentiality & Integrity)
Symmetric Encryption: Exam questions are encrypted using AES-256 before being stored in MongoDB, ensuring confidentiality even if the database is breached.

Digital Signatures: Student answers are signed with HMAC-SHA256 to ensure Data Integrity and prevent tampering after submission.

4. Encoding
Base64 Implementation: Used for data compatibility, transforming binary ciphertext into safe ASCII strings for database storage and network transmission.

🏗️ Project Architecture

Frontend: React.js (Port 3000) - Handles the User Experience and Role-Based Rendering.


Backend: Node.js & Express (Port 5000) - Trusted environment for Encryption, Hashing, and Token Signing.


Database: MongoDB with Mongoose ODM - Parameterized queries to prevent NoSQL/SQL Injection.

⚙️ Setup and Installation
Step 1: Backend Setup (/exam-backend)
Navigate to the backend folder: cd exam-backend

Install dependencies: npm install

Create a .env file and configure the following:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_signing_key
AES_SECRET_KEY=your_256bit_encryption_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
Start the server: node server.js

Step 2: Frontend Setup (/exam-ui)
Navigate to the frontend folder: cd exam-ui

Install dependencies: npm install

Start the application: npm start

Access the portal at: http://localhost:3000
