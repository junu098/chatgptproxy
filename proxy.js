const express = require('express');
const app = express();
const path = require('path');
const PORT = process.env.PORT || 3000;
const fetch = require('node-fetch'); // Important if you're not on Node 18+

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
        let text = await response.text();

        // Remove HTML tags if any
        text = text.replace(/<[^>]+>/g, '').trim();

        // Try parsing as JSON to extract clean content
        try {
            const json = JSON.parse(text);
            if (json.content) {
                return res.send(json.content);
            }
        } catch (e) {
            // Not JSON - send cleaned plain text
        }

        res.send(text); // fallback to cleaned plain text
    } catch (error) {
        console.error(error);
        res.status(500).send('Proxy error');
    }
});

// Catch-all route for frontend SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
    console.log(`✅ Proxy running at http://localhost:${PORT}`);
});
