import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([
        { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
    const navigate = useNavigate();

    // Restoration of your original requirement logic
    const handleAddQuestion = () => {
        setQuestions([...questions, { questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    };

    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index].questionText = value;
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const handleCorrectAnswerChange = (qIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].correctAnswer = parseInt(value);
        setQuestions(newQuestions);
    };

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            // AES-256 Protection requirement
            await axios.post('http://localhost:5000/api/exams', 
                { title, questions }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Exam created and encrypted successfully!");
            setTitle('');
            setQuestions([{ questionText: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        } catch (err) {
            alert("Error creating exam.");
        }
    };

    return (
        <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
            
            {/* Sidebar Navigation */}
            <div style={{ width: '260px', backgroundColor: '#2c3e50', color: 'white', padding: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <h3 style={{ borderBottom: '1px solid #555', paddingBottom: '10px' }}>Teacher Menu</h3>
                <button onClick={() => navigate('/teacher-dashboard')} style={{ background: '#34495e', color: 'white', border: 'none', padding: '12px', textAlign: 'left', cursor: 'pointer', borderRadius: '4px' }}>📝 Create New Quiz</button>
                <button onClick={() => navigate('/teacher-results')} style={{ background: '#27ae60', color: 'white', border: 'none', padding: '12px', textAlign: 'left', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' }}>📊 View Results & Signatures</button>
                <div style={{ marginTop: 'auto' }}>
                    <button onClick={() => { localStorage.clear(); navigate('/login'); }} style={{ width: '100%', background: '#c0392b', color: 'white', border: 'none', padding: '12px', cursor: 'pointer', borderRadius: '4px' }}>Logout</button>
                </div>
            </div>

            {/* Restored MCQ Quiz Creation Area */}
            <div style={{ flex: 1, padding: '40px', backgroundColor: '#f4f7f6', overflowY: 'auto' }}>
                <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
                    <h2 style={{ marginBottom: '20px' }}>Teacher Dashboard - Create MCQ Quiz</h2>
                    <form onSubmit={handleCreateExam}>
                        <input 
                            type="text" 
                            placeholder="Exam Title (e.g. Cyber Security Quiz)" 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            required 
                            style={{ width: '100%', padding: '12px', marginBottom: '30px', border: '1px solid #ddd', borderRadius: '6px' }}
                        />

                        {questions.map((q, qIndex) => (
                            <div key={qIndex} style={{ border: '1px solid #eee', padding: '20px', marginBottom: '25px', borderRadius: '8px', background: '#fafafa' }}>
                                <h4 style={{ marginTop: 0 }}>Question {qIndex + 1}</h4>
                                <input 
                                    type="text" 
                                    placeholder="Enter Question Text" 
                                    value={q.questionText} 
                                    onChange={(e) => handleQuestionChange(qIndex, e.target.value)} 
                                    required 
                                    style={{ width: '100%', padding: '10px', marginBottom: '15px', border: '1px solid #ddd', borderRadius: '4px' }}
                                />
                                
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                                    {q.options.map((opt, oIndex) => (
                                        <div key={oIndex}>
                                            <label style={{ fontSize: '0.9em' }}>Option {oIndex + 1}: </label>
                                            <input 
                                                type="text" 
                                                value={opt} 
                                                onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)} 
                                                required 
                                                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div style={{ marginTop: '15px' }}>
                                    <label><strong>Correct Option: </strong></label>
                                    <select value={q.correctAnswer} onChange={(e) => handleCorrectAnswerChange(qIndex, e.target.value)} style={{ padding: '8px', borderRadius: '4px' }}>
                                        <option value={0}>Option 1</option>
                                        <option value={1}>Option 2</option>
                                        <option value={2}>Option 3</option>
                                        <option value={3}>Option 4</option>
                                    </select>
                                </div>
                            </div>
                        ))}

                        <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
                            <button type="button" onClick={handleAddQuestion} style={{ padding: '12px 20px', borderRadius: '6px', border: '1px solid #007bff', color: '#007bff', background: 'white', cursor: 'pointer' }}>
                                + Add Another Question
                            </button>
                            <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', padding: '12px 30px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                                Finalize & Encrypt Exam
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;