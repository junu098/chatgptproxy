const express = require('express');
const app = express();
const PORT = 3000;

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.get('/api/chat', async (req, res) => {
    const userMessage = req.query.msg;
    if (!userMessage) return res.status(400).send('Missing message');

    try {
        const response = await fetch(`https://chatgpt.hosters.club/?chat=${encodeURIComponent(userMessage)}`);
        const text = await response.text();
        res.send(text);
    } catch (error) {
        console.error(error);
        res.status(500).send('Proxy error');
    }
});

app.listen(PORT, () => {
    console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
