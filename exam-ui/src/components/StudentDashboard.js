import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import navigate hook

const StudentDashboard = () => {
    const [exams, setExams] = useState([]);
    const [completedExams, setCompletedExams] = useState([]);
    const navigate = useNavigate(); // Initialize navigate

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { Authorization: `Bearer ${token}` } };
                
                // 1. Fetch available exams (Object: Exam Content)
                const examRes = await axios.get('http://localhost:5000/api/exams', config);
                setExams(examRes.data);

                // 2. Fetch student's previous submissions
                const resultRes = await axios.get('http://localhost:5000/api/my-results', config);
                const submittedIds = resultRes.data.map(r => r.exam._id || r.exam);
                setCompletedExams(submittedIds);
            } catch (err) {
                console.error("Dashboard data load error:", err);
            }
        };
        fetchDashboardData();
    }, []);

    // Helper: Compare current time with Timeline Object
    const getExamStatus = (examDate) => {
        if (!examDate) return "Upcoming";
        const now = new Date();
        const target = new Date(examDate);
        
        const isToday = now.toDateString() === target.toDateString();
        if (isToday) return "Ongoing";
        if (target < now) return "Completed";
        return "Upcoming";
    };

    return (
        <div className="dashboard-container" style={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', color: '#1e293b' }}>Secure Student Portal</h2>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <span className="badge" style={{ background: '#e2e8f0', padding: '5px 15px', borderRadius: '20px', fontSize: '0.8rem' }}>
                    🛡️ MFA Authenticated Session
                </span>
            </div>

            <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                {exams.map(exam => {
                    const status = getExamStatus(exam.examDate);
                    const isCompleted = completedExams.includes(exam._id);
                    const canAttend = status === "Ongoing" && !isCompleted;

                    return (
                        <div key={exam._id} className="exam-card" style={{ 
                            background: 'white', 
                            padding: '25px', 
                            borderRadius: '12px', 
                            boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                            borderLeft: `6px solid ${status === 'Ongoing' ? '#22c55e' : status === 'Completed' ? '#ef4444' : '#3b82f6'}`,
                            opacity: status === 'Completed' ? 0.7 : 1,
                            position: 'relative'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h3 style={{ margin: '0 0 10px 0', color: '#0f172a' }}>{exam.title}</h3>
                                    <p style={{ margin: '0', color: '#64748b', fontSize: '0.9rem' }}>
                                        📅 Scheduled: <strong>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : "TBA"}</strong>
                                    </p>
                                </div>
                                <span style={{ 
                                    padding: '4px 10px', 
                                    borderRadius: '4px', 
                                    fontSize: '0.75rem', 
                                    fontWeight: 'bold',
                                    background: status === 'Ongoing' ? '#dcfce7' : status === 'Completed' ? '#fee2e2' : '#dbeafe',
                                    color: status === 'Ongoing' ? '#166534' : status === 'Completed' ? '#991b1b' : '#1e40af'
                                }}>
                                    {isCompleted ? "FINISHED" : status.toUpperCase()}
                                </span>
                            </div>

                            <div style={{ marginTop: '20px' }}>
                                {canAttend ? (
                                    <button 
                                        className="btn-primary" 
                                        style={{ width: '100%', background: '#22c55e', color: 'white', padding: '10px', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
                                        onClick={() => navigate(`/take-exam/${exam._id}`)} // Redirect to dedicated webpage
                                    >
                                        Attend Exam Now
                                    </button>
                                ) : (
                                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ color: '#94a3b8', fontSize: '0.85rem', margin: 0 }}>
                                            {isCompleted ? "✅ Submission recorded in secure vault." : 
                                             status === "Upcoming" ? "🕒 Waiting for the scheduled timeline." : 
                                             "❌ The session has concluded."}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StudentDashboard;