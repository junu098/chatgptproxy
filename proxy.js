const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Allow CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// API route
app.get('/api/chat', async (req, res) => {
    const userMessage = req.query.msg;
    if (!userMessage) return res.status(400).send('Missing message');

    try {
        const response = await fetch(`https://nggemini.tiiny.io/?prompt=${encodeURIComponent(userMessage)}`);
        const data = await response.json();

        // Extract only the reply text
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!replyText) return res.status(502).send('Invalid response from Gemini');

        res.send(replyText); // Return plain text only
    } catch (error) {
        console.error(error);
        res.status(500).send('Proxy error');
    }
});

// Catch-all to serve index.html on any unmatched route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
