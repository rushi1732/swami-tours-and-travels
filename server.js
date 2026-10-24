/**
 * Swami Tours & Travels - Production Express Server
 * Serves website static assets & provides secure /api/chat endpoint.
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { handleChatRequest, getPublicConfig } from './server/chat-handler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON with safety limit
app.use(express.json({ limit: '50kb' }));

// Determine static directory: dist if built, otherwise project root
const distPath = path.join(__dirname, 'dist');
const staticPath = fs.existsSync(distPath) ? distPath : __dirname;
app.use(express.static(staticPath));

/**
 * Public configuration endpoint (safe public business metadata)
 */
app.get('/api/config', (req, res) => {
  res.json(getPublicConfig());
});

/**
 * Secure Server-Side Chatbot Endpoint
 */
app.post('/api/chat', async (req, res) => {
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
  try {
    const result = await handleChatRequest(req.body, clientIp);
    res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[Swami Chatbot] Server route error:', error);
    res.status(500).json({
      status: 500,
      error: 'An internal server error occurred.',
      reply: 'क्षमस्व! सर्व्हरमध्ये काही तांत्रिक त्रुटी आली आहे. कृपया +91 70838 08483 वर कॉल करा.'
    });
  }
});

// Fallback to index.html for single-page routing if needed
app.get('*', (req, res) => {
  const indexPath = path.join(staticPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Page not found');
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Swami Tours & Travels] Server running on http://0.0.0.0:${PORT}`);
  console.log(`[Swami Tours & Travels] Serving static assets from: ${staticPath}`);
  console.log(`[Swami Tours & Travels] Chatbot endpoint active at POST /api/chat`);
});
