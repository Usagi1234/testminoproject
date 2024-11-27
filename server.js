const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploadfile');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['*'],
}));

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.get('/files', (req, res) => {
    const uploadDir = path.join(__dirname, 'uploadfile');

    fs.readdir(uploadDir, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to read files' });
        }

        const fileData = files.map((file, index) => {
            const filePath = path.join(uploadDir, file);
            const stats = fs.statSync(filePath);

            return {
                id: index + 1,
                name: file,
                type: path.extname(file),
                time: new Date(stats.mtime).toLocaleString(), // ใช้เวลาล่าสุดของไฟล์
            };
        });

        res.status(200).json(fileData);
    });
});

app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send({ error: 'No file uploaded' });
    }
    res.send({
        message: 'File uploaded successfully',
        file: {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
        },
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
