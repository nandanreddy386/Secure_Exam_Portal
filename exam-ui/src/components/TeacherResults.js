import React, { useState, useEffect } from 'react';
import axios from 'axios';

const TeacherResults = () => {
    const [results, setResults] = useState([]);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const token = localStorage.getItem('token');
                // Fetches results with populated student and exam details
                const res = await axios.get('http://localhost:5000/api/results', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setResults(res.data);
            } catch (err) {
                console.error("Error fetching results:", err);
            }
        };
        fetchResults();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '1000px', margin: 'auto' }}>
            <h2>Teacher Panel: Student Submissions & Integrity Logs</h2>
            <p>Every submission below is verified via <strong>HMAC-SHA256 Digital Signatures</strong>.</p>
            <hr />
            <table border="1" cellPadding="10" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th>Student</th>
                        <th>Exam Title</th>
                        <th>Selected Options (Indices)</th>
                        <th>Integrity Signature</th>
                    </tr>
                </thead>
                <tbody>
                    {results.length === 0 ? <tr><td colSpan="4">No submissions yet.</td></tr> : 
                        results.map((r) => (
                            <tr key={r._id}>
                                <td><strong>{r.student?.username}</strong></td>
                                <td>{r.exam?.title}</td>
                                <td>{JSON.stringify(r.answers)}</td>
                                <td style={{ fontSize: '11px', wordBreak: 'break-all', color: '#0056b3', fontFamily: 'monospace' }}>
                                    {r.digitalSignature}
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default TeacherResults;