import http from 'http';
import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';

const PORT = 8888;
const logoPath = path.resolve('artifacts/rakshak-ai/public/logo.png');

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve HTML page
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Remove Background</title>
      </head>
      <body>
        <h3>Processing Logo Background...</h3>
        <canvas id="canvas" style="display:none;"></canvas>
        <script>
          const img = new Image();
          img.onload = function() {
            const canvas = document.getElementById('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imgData.data;
            
            // Loop through pixels and make white/near-white transparent
            for (let i = 0; i < data.length; i += 4) {
              const r = data[i];
              const g = data[i+1];
              const b = data[i+2];
              // If pixel is near white
              if (r > 240 && g > 240 && b > 240) {
                data[i+3] = 0; // Set alpha to 0
              }
            }
            
            ctx.putImageData(imgData, 0, 0);
            
            // Convert to data url and post to server
            const dataUrl = canvas.toDataURL('image/png');
            fetch('/save', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ image: dataUrl })
            })
            .then(r => r.text())
            .then(txt => {
              document.body.innerHTML = '<h3>SUCCESS: Logo background removed. You can close this tab.</h3>';
              console.log('Saved');
            })
            .catch(err => {
              document.body.innerHTML = '<h3>ERROR: ' + err.message + '</h3>';
            });
          };
          img.src = '/logo.png';
        </script>
      </body>
      </html>
    `);
  } else if (req.method === 'GET' && req.url === '/logo.png') {
    // Serve the current logo image
    fs.readFile(logoPath, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end('Not found');
      } else {
        res.writeHead(200, { 'Content-Type': 'image/png' });
        res.end(data);
      }
    });
  } else if (req.method === 'POST' && req.url === '/save') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body);
        const base64Data = payload.image.replace(/^data:image\/png;base64,/, '');
        fs.writeFileSync(logoPath, base64Data, 'base64');
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('OK');
        console.log('Logo saved successfully.');
        setTimeout(() => {
          process.exit(0);
        }, 1000);
      } catch (err) {
        res.writeHead(500);
        res.end(err.message);
      }
    });
  } else {
    res.writeHead(404);
    res.end();
  }
});

server.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
  // Open default browser to trigger processing
  exec("start http://localhost:" + PORT + "/");
});
