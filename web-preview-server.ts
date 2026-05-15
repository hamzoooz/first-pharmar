import express from 'express';
import path from 'path';

const app = express();
const PORT = 3000;

// Serve statutory assets from wwwroot (What the Native App uses)
app.use(express.static(path.join(process.cwd(), 'wwwroot')));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'native-preview',
    message: 'FastPharma is running in Native .NET mode. This preview serves the Blazor assets.'
  });
});

// Fallback to inform about Native App
app.get('*', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>FastPharma - Native Preview</title>
        <style>
          body { font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #0c4a6e; color: white; text-align: center; }
          .card { background: white; color: #0c4a6e; padding: 2rem; rounded-xl: 1rem; border-radius: 1rem; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1); max-width: 400px; }
          h1 { margin-top: 0; }
          p { opacity: 0.8; font-size: 0.9rem; }
          .btn { display: inline-block; margin-top: 1rem; padding: 0.5rem 1rem; background: #0c4a6e; color: white; text-decoration: none; border-radius: 0.5rem; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>Native Mode Active</h1>
          <p>We have converged the project to the <b>Native .NET (Blazor Hybrid)</b> architecture as requested.</p>
          <p>To see the full application exactly as "made", please <b>clone</b> the repository and run:</p>
          <code>dotnet run</code>
          <br/>
          <a href="/index.html" class="btn">View Blazor Shell Assets</a>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Native Preview Server running on port ${PORT}`);
});
