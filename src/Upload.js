import React, { useState } from 'react';

const Upload = () => {
    const [file, setFile] = useState(null);
    const [tableData, setTableData] = useState([]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            alert('Please select a file first.');
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
    
                setTableData((prevTableData) => [
                    ...prevTableData,
                    {
                        id: prevTableData.length + 1,
                        name: result.file.originalname,
                        type: result.file.mimetype,
                        time: new Date().toLocaleString(),
                    },
                ]);
    
                console.log(`File "${result.file.originalname}" uploaded successfully!`);
            } else {
                const errorData = await response.json();
                console.log(`Failed to upload file: ${errorData.error}`);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            console.log('Error uploading file. Please check the server.');
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
                        <th>ลำดับ</th>
                        <th>ชื่อไฟล์</th>
                        <th>ประเภทไฟล์</th>
                        <th>เวลาอัปโหลด</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.id}>
                            <td>{row.id}</td>
                            <td>{row.name}</td>
                            <td>{row.type}</td>
                            <td>{row.time}</td>
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
    },
    td: {
        border: '1px solid #ddd',
        padding: '8px',
    },
};


export default Upload;