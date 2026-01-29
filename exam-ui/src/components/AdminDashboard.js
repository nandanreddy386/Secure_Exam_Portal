import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [exams, setExams] = useState([]);
    const [selectedDate, setSelectedDate] = useState('');

    const fetchExams = async () => {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/exams', {
            headers: { Authorization: `Bearer ${token}` }
        });
        setExams(res.data);
    };

    useEffect(() => { fetchExams(); }, []);

    const handleUpdateDate = async (examId) => {
        const token = localStorage.getItem('token');
        try {
            await axios.put(`http://localhost:5000/api/admin/exams/${examId}`, 
                { examDate: selectedDate }, 
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Exam Date Scheduled successfully!");
            fetchExams();
        } catch (err) {
            alert("Update failed. Check Admin permissions.");
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h2>Admin Portal: Exam Scheduling</h2>
            <p>Subject: Admin | Object: Exam Timeline</p>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#eee' }}>
                        <th>Exam Title</th>
                        <th>Current Date</th>
                        <th>Set New Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {exams.map(exam => (
                        <tr key={exam._id}>
                            <td>{exam.title}</td>
                            <td>{exam.examDate ? new Date(exam.examDate).toLocaleDateString() : 'Not Set'}</td>
                            <td>
                                <input type="date" onChange={(e) => setSelectedDate(e.target.value)} />
                            </td>
                            <td>
                                <button onClick={() => handleUpdateDate(exam._id)}>Update Date</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;