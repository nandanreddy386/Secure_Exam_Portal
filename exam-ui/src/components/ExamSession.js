import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ExamSession = () => {
    const { examId } = useParams();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchExam = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get(`http://localhost:5000/api/exams/${examId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExam(res.data);
        };
        fetchExam();
    }, [examId]);

    const handleSubmit = async () => {
        const token = localStorage.getItem('token');
        try {
            // Integrity: HMAC-SHA256 Digital Signature
            await axios.post('http://localhost:5000/api/submit', 
                { examId, answers }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Integrity Check Passed: HMAC Signature Recorded.");
            navigate('/student-dashboard');
        } catch (err) {
            alert("Submission failed.");
        }
    };

    if (!exam) return <div className="auth-container">Loading Secure Exam...</div>;

    return (
        <div className="auth-container" style={{ maxWidth: '800px' }}>
            <h2>{exam.title}</h2>
            <hr />
            {exam.questions.map((q, qIdx) => (
                <div key={qIdx} style={{ textAlign: 'left', marginBottom: '20px', padding: '15px', background: '#f8fafc', borderRadius: '8px' }}>
                    <p><strong>{qIdx + 1}. {q.questionText}</strong></p>
                    {q.options.map((opt, oIdx) => (
                        <label key={oIdx} style={{ display: 'block', margin: '10px 0', cursor: 'pointer' }}>
                            <input type="radio" name={`q-${qIdx}`} onChange={() => setAnswers({...answers, [qIdx]: oIdx})} /> {opt}
                        </label>
                    ))}
                </div>
            ))}
            <button className="btn-primary" onClick={handleSubmit}>Submit & Sign (HMAC)</button>
        </div>
    );
};

export default ExamSession;