/**
 * Netlify Serverless Function for Swami Tours AI Chatbot
 */
import { handleChatRequest } from '../../server/chat-handler.js';

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const clientIp = event.headers['client-ip'] || event.headers['x-forwarded-for'] || '127.0.0.1';

  try {
    const body = JSON.parse(event.body || '{}');
    const result = await handleChatRequest(body, clientIp);
    return {
      statusCode: result.status || 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        status: 500,
        error: 'Netlify function error',
        reply: 'क्षमस्व! सर्व्हरमध्ये तांत्रिक त्रुटी आली आहे.'
      })
    };
  }
}
