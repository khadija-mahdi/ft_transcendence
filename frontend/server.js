const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the 'src' directory
app.use(express.static(path.join(__dirname, 'src')));



// Serve index.html for all other routes
app.get('*', (req, res) => {
	console.log(`Serving ${req.path}`);
	res.sendFile(path.join(__dirname, 'src', 'index.html'));
});

app.listen(PORT, () => {
	console.log(`Server is running on http://localhost:${PORT}`);
});
