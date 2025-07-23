const httpProxy = require('http-proxy');

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false
});

export default function handler(req, res) {
  
  const target = 'http://159.138.29.140:9001';
  
 
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.status(200).end();
    return;
  }

  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  
  const originalUrl = req.url;
  const apiPath = originalUrl.replace('/api/proxy', '');
  

  req.url = apiPath;
  
  console.log(`Proxying request: ${originalUrl} -> ${target}${apiPath}`);
  

  proxy.web(req, res, { 
    target,
    secure: false,
    changeOrigin: true,
    xfwd: true
  }, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.status(500).json({ error: 'Proxy error', details: err.message });
    }
  });
}

export const config = {
  api: {
    bodyParser: false 
  }
};
