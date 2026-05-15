import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve React build assets (Path B)
app.use(express.static(path.join(process.cwd(), 'dist')));

// Fallback for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`React + .NET Shell Preview running on port ${PORT}`);
});
