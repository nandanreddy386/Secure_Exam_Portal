import React, { useState } from 'react';
import axios from 'axios'; 
import { useLocation, useNavigate } from 'react-router-dom'; 

const VerifyOTP = () => {
    const [otp, setOtp] = useState(''); 
    const location = useLocation();
    const navigate = useNavigate(); 
    
    // Safely gets username from the previous Login screen
    const username = location.state?.username; 

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            // Sends request to backend to verify Subject identity
            const res = await axios.post('http://localhost:5000/api/login/verify-otp', { username, otp });
            
            if (res.data.success || res.data.token) {
                // Save session for the Access Control Matrix
                localStorage.setItem('token', res.data.token);
                localStorage.setItem('role', res.data.role);
                
                // CRITICAL UPDATE: Store username to display on the dashboard
                localStorage.setItem('username', username); 
                
                alert(`Login Successful! Logged in as: ${username} (${res.data.role})`);
                
                // Redirecting Subjects to their specific Objects
                if (res.data.role === 'Admin') {
                    navigate('/admin-dashboard'); 
                } else if (res.data.role === 'Teacher') {
                    navigate('/teacher-dashboard'); 
                } else if (res.data.role === 'Student') {
                    navigate('/student-dashboard'); 
                } else {
                    navigate('/'); 
                }
            }
        } catch (err) {
            console.error(err);
            alert("Invalid OTP or Verification Failed");
        }
    };

    return (
        <div className="auth-container" style={{ padding: '20px', maxWidth: '400px', margin: 'auto' }}>
            <h2>Step 2: MFA Verification</h2>
            <p>Enter the 6-digit security code sent to: <br/>
               <strong style={{ color: '#2563eb' }}>{username}</strong>
            </p>
            <form onSubmit={handleVerify}>
                <input 
                    type="text" 
                    placeholder="Enter 6-digit OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)} 
                    required 
                />
                <button type="submit" style={{ marginTop: '10px' }}>
                    Verify & Access Portal
                </button>
            </form>
        </div>
    );
};

export default VerifyOTP;