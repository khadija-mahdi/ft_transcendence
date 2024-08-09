const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));

// Middleware to remove the trailing slash and redirect if necessary
app.use((req, res, next) => {
    if (req.path.endsWith('/') && req.path.length > 1) {
        const newPath = req.path.slice(0, -1);
        res.redirect(301, newPath);
    } else {
        next();
    }
});

// Serve index.html for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
