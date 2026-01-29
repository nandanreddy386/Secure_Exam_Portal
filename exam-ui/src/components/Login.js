import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Factor 1: Verify Password and Trigger OTP
            const res = await axios.post('http://localhost:5000/api/login/step1', { username, password });
            alert(res.data.message);
            
            // Move to the OTP verification screen, passing the username along
            navigate('/verify-otp', { state: { username } });
        } catch (err) {
            alert("Login Failed: " + err.response.data.message);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Login - Factor 1 (Password)</h2>
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" onChange={(e) => setUsername(e.target.value)} required /><br/>
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required /><br/>
                <button type="submit">Send OTP</button>
            </form>
        </div>
    );
};

export default Login;