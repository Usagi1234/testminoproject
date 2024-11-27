import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await fetch('http://localhost:3000/files');
                if (response.ok) {
                    const files = await response.json();
                    setTableData(files);
                } else {
                    toast.error('Failed to fetch files.');
                }
            } catch (error) {
                console.error('Error fetching files:', error);
                toast.error('Error fetching files. Please check the server.');
            }
        };

        fetchFiles();
    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.error('Please select a file first.');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('http://localhost:3000/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();

                setTableData((prev) => [
                    ...prev,
                    {
                        id: prev.length + 1,
                        name: result.file.originalname,
                        type: result.file.mimetype,
                        time: new Date().toLocaleString(),
                    },
                ]);

                toast.success(`File "${result.file.originalname}" uploaded successfully!`);
            } else {
                const errorData = await response.json();
                toast.error(`Failed to upload file: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            toast.error('Error uploading file. Please check the server.');
        }
    };

    return (
        <div style={styles.container}>
            <h1>Upload File</h1>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} style={styles.button}>
                Upload
            </button>

            <h2>Uploaded Files</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>ลำดับ</th>
                        <th style={styles.th}>ชื่อไฟล์</th>
                        <th style={styles.th}>ประเภทไฟล์</th>
                        <th style={styles.th}>เวลาอัปโหลด</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row, index) => (
                        <tr key={index}>
                            <td style={styles.td}>{row.id}</td>
                            <td style={styles.td}>{row.name}</td>
                            <td style={styles.td}>{row.type}</td>
                            <td style={styles.td}>{row.time}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
    },
    button: {
        marginTop: '10px',
        padding: '10px',
        fontSize: '16px',
        backgroundColor: '#28a745',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
    },
    table: {
        marginTop: '20px',
        borderCollapse: 'collapse',
        width: '80%',
    },
    th: {
        border: '1px solid #ddd',
        padding: '8px',
        textAlign: 'left',
        backgroundColor: '#f4f4f4',
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
    },
};

export default Upload;
