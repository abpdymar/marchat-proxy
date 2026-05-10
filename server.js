const http = require('http');
const https = require('https');

const SUPA_HOST = 'sdsyiopaaioczfevdtrf.supabase.co';
const PORT = process.env.PORT || 3000;

// Simple CORS + proxy
const server = http.createServer((req, res) => {
  // CORS headers — needed so the WebView can call this
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, apikey, Prefer, X-Client-Info');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Collect request body
  let body = [];
  req.on('data', chunk => body.push(chunk));
  req.on('end', () => {
    body = Buffer.concat(body);

    // Forward headers, replace host
    const headers = Object.assign({}, req.headers);
    headers['host'] = SUPA_HOST;
    // Remove headers that cause issues
    delete headers['accept-encoding']; // avoid compressed responses we can't forward easily

    const options = {
      hostname: SUPA_HOST,
      port: 443,
      path: req.url,
      method: req.method,
      headers: headers,
      // Force TLS 1.2
      secureProtocol: 'TLSv1_2_method'
    };

    const proxyReq = https.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err.message);
      res.writeHead(502);
      res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
    });

    if (body.length > 0) {
      proxyReq.write(body);
    }
    proxyReq.end();
  });
});

server.listen(PORT, () => {
  console.log('MarChat Proxy running on port ' + PORT);
});
