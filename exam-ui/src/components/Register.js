import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({ username: '', password: '', role: 'Student' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Sends data to your Node.js backend
            const res = await axios.post('http://localhost:5000/api/register', formData);
            alert(res.data.message);
        } catch (err) {
            // This check prevents the 'undefined' error you are seeing
            const errorMessage = err.response && err.response.data 
                ? err.response.data.error 
                : "Server is not responding. Make sure backend is running!";
            alert("Registration failed: " + errorMessage);

        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Register for Secure Exam Portal</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email (Username)" onChange={(e) => setFormData({...formData, username: e.target.value})} required /><br/>
                <input type="password" placeholder="Password" onChange={(e) => setFormData({...formData, password: e.target.value})} required /><br/>
                <select onChange={(e) => setFormData({...formData, role: e.target.value})}>
                    <option value="Student">Student</option>
                    <option value="Teacher">Teacher</option>
                    <option value="Admin">Admin</option>
                </select><br/>
                <button type="submit">Register Account</button>
            </form>
        </div>
    );
};

export default Register;