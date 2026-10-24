/**
 * Vercel Serverless Function: /api/chat
 */
import { handleChatRequest } from '../server/chat-handler.js';

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body || {});
    const result = await handleChatRequest(body, clientIp);
    return res.status(result.status || 200).json(result);
  } catch (error) {
    console.error('[Vercel Serverless] Error:', error);
    return res.status(500).json({
      status: 500,
      error: 'Serverless execution error',
      reply: 'क्षमस्व! सर्व्हरमध्ये काही तांत्रिक त्रुटी आली आहे.'
    });
  }
}
