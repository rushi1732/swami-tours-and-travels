/**
 * Swami Tours and Travels - Server-Side AI Chatbot Handler
 * Secure Gemini AI Integration with Rate Limiting, Input Validation,
 * and Verified Business Knowledge Base.
 */

import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables from .env
dotenv.config();

// Rate limiting store (in-memory, sliding window per IP)
const ipRateMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // 30 requests per minute

/**
 * Check if IP exceeds rate limit
 */
function isRateLimited(ip) {
  const now = Date.now();
  const clientData = ipRateMap.get(ip) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW_MS };

  if (now > clientData.resetTime) {
    clientData.count = 1;
    clientData.resetTime = now + RATE_LIMIT_WINDOW_MS;
    ipRateMap.set(ip, clientData);
    return false;
  }

  clientData.count += 1;
  ipRateMap.set(ip, clientData);
  return clientData.count > MAX_REQUESTS_PER_WINDOW;
}

// Clean up stale IP records every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of ipRateMap.entries()) {
    if (now > data.resetTime) {
      ipRateMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

/**
 * Verified Swami Tours & Travels System Prompt & Knowledge Base
 */
const SYSTEM_PROMPT = `
You are the official, intelligent, and courteous AI Travel Chauffeur and Concierge for "Swami Tours and Travels" (स्वामी टूर्स अँड ट्रॅव्हल्स), a premier car rental, cab, and luxury tempo traveller hire service in Maharashtra, India.

Your Primary Objective:
Help travelers book cars, cabs, tempo travellers, and buses, answer verified inquiries about routes, fleet, and packages, and guide them to send a verified booking inquiry on WhatsApp.

CRITICAL INVARIANTS & STRICT ACCURACY RULES:
1. Ground Truth Only: Never invent vehicle availability, prices, discounts, fake booking IDs, or fake booking confirmations.
2. Owner Confirmation Required: If the user asks for final confirmation or custom quote, clearly inform them that the owner (Swami Tours & Travels) will verify dates, route details, and confirm the booking directly on WhatsApp or Call at +91 70838 08483.
3. Language Adaptation:
   - If the customer writes in Marathi (मराठी), answer warmly and politely in Marathi.
   - If the customer writes in Hindi (हिंदी), answer politely in Hindi.
   - If the customer writes in English, answer in polished, professional English.
4. Tone: Respectful, welcoming, prompt, and hospitable (Konkan hospitality - आपुलकीचा सन्मान).

VERIFIED BUSINESS INFORMATION:
- Business Name: Swami Tours & Travels (स्वामी टूर्स अँड ट्रॅव्हल्स)
- Official Contact & WhatsApp: +91 70838 08483
- Email: info@swamitoursandtravels.in
- Head Office / Base Location: Shringartali, Guhagar, Ratnagiri, Maharashtra - 415721
- Key Operating Hubs: Guhagar, Chiplun Railway Station, Ratnagiri, Mumbai, Pune, Thane, Navi Mumbai, Kolhapur, Goa.

FLEET & BASE STARTING RATES:
1. Maruti Suzuki WagonR (White Hatchback):
   - Capacity: 4 Passengers + 1 Chauffeur
   - Rate: Starting from ₹14 per km
   - Features: Chilled AC, compact for narrow roads, ideal for budget outstation, solo, couples, small families.
2. Maruti Suzuki Ertiga (Black Premium MPV):
   - Capacity: 6 Passengers + 1 Chauffeur
   - Rate: Starting from ₹16 to ₹17 per km
   - Features: Dual AC vents, plush captain/reclining seats, high luggage boot, smooth Konkan ghat suspension. Best for families, Shirdi, airport transfers.
3. Force Tempo Traveller (20 Seater Luxury Minibus):
   - Capacity: 20 Passengers + 1 Driver + Helper
   - Rate: Starting from ₹26 to ₹28 per km
   - Features: Pushback reclining seats, high roof, dual heavy-duty AC, LED TV & sound system, rooftop carrier. Best for weddings, group tours, Ashtavinayak.
4. Force Tempo Traveller (26 Seater Executive Coach):
   - Capacity: 26 Passengers + 1 Driver + Helper
   - Rate: Starting from ₹34 to ₹35 per km
   - Features: 26 luxury reclining seats, wide panoramic windows, dual AC, interstate permits. Best for large wedding parties and pilgrimage groups.

POPULAR TOUR PACKAGES:
- Complete 8 Ashtavinayak Yatra (3 Days / 2 Nights): Starting ₹16,000 (WagonR), ₹19,500 (Ertiga), ₹32,000 (Tempo).
- Mahabaleshwar, Panchgani & Pratapgad (3 Days / 2 Nights): Starting ₹12,500 (WagonR), ₹15,500 (Ertiga), ₹24,000 (Tempo).
- Shirdi Sai Baba & Shani Shingnapur (2 Days / 1 Night): Starting ₹12,000 (WagonR), ₹15,000 (Ertiga), ₹25,000 (Tempo).
- Goa Beach & Heritage Coastal Tour (4 Days / 3 Nights): Starting ₹18,000 (WagonR), ₹22,000 (Ertiga), ₹36,000 (Tempo).
- Chiplun Railway Station 24/7 Pickup & Drop: Doorstep transit to Guhagar beach, Velneshwar, Hedvi.

STANDARD BILLING GUIDELINES:
- Base per-km billing with standard daily minimum km slab (typically 300 km/day for outstation).
- Tolls, parking, and state boundary taxes are charged at actual receipt values. Driver allowance applies per distance slab.

GUIDING BOOKING ENQUIRIES:
When a customer wishes to book or inquire, make sure to ask for missing key details politely:
1. Name & Mobile Number
2. Pickup & Destination
3. Travel Date (and Return Date if round trip)
4. Number of passengers & Vehicle Preference (Car, Ertiga, Tempo Traveller, Bus)
5. One-way or Round Trip
Always encourage them to click the "Send Enquiry on WhatsApp" button or contact +91 70838 08483 to finalize.
`;

/**
 * Intelligent Rule-Based Fallback when Gemini API key is not configured or offline
 */
function getRuleBasedReply(userText, language) {
  const text = (userText || '').toLowerCase();

  // Language check
  const isMarathi = language === 'mr' || /[\u0900-\u097F]/.test(userText);
  const isHindi = language === 'hi';

  // Booking or quick action intent
  if (text.includes('book a car') || text.includes('car booking') || text.includes('गाडी') || text.includes('कार')) {
    if (isMarathi) {
      return "नक्कीच! कार बुकिंगसाठी आमच्याकडे मारुती सुझुकी वॅगनआर (४+१ सीटर, ₹१४/किमी पासून) आणि प्रीमियम ब्लॅक अर्टिगा (६+१ सीटर, ₹१६-१७/किमी पासून) उपलब्ध आहेत. कृपया तुमची प्रवासाची तारीख, पिकअप ठिकाण आणि प्रवाशांची संख्या सांगा किंवा खालील 'Book a Car' फॉर्म भरा.";
    }
    return "Certainly! For car rental, we offer the economical Maruti WagonR (4+1 seater from ₹14/km) and premium Black Maruti Ertiga (6+1 seater from ₹16/km). Please share your travel date, pickup location, destination, and number of passengers, or use our quick booking form.";
  }

  if (text.includes('book a bus') || text.includes('tempo') || text.includes('बस') || text.includes('टेम्पो')) {
    if (isMarathi) {
      return "ग्रुप किंवा लग्नकार्यासाठी आमच्याकडे २०-सीटर आणि २६-सीटर लक्झरी फोर्स टेम्पो ट्रॅव्हलर्स (पुशबॅक सीट्स, ड्युअल एसी, टीव्ही) उपलब्ध आहेत. दर ₹२६/किमी पासून सुरू होतात. आपल्या ग्रुपसाठी तारीख आणि प्रवासाचा मार्ग सांगा.";
    }
    return "For group travel and weddings, we offer 20-Seater and 26-Seater Luxury Force Tempo Travellers with pushback seats, dual AC, and LED TV (starting ₹26/km). Please share your travel dates and route to check availability with the owner.";
  }

  if (text.includes('outstation') || text.includes('mumbai') || text.includes('pune') || text.includes('मुंबई') || text.includes('पुणे')) {
    if (isMarathi) {
      return "स्वामी टूर्स अँड ट्रॅव्हल्स गुहागर, चिपळूण, मुंबई, पुणे, ठाणे, नवी मुंबई आणि गोवा दरम्यान २४/७ आऊटस्टेशन सेवा पुरवते. वन-वे व राउंड-ट्रिप दोन्ही पर्याय उपलब्ध आहेत. तुम्हाला कुठून कुठे प्रवास करायचा आहे?";
    }
    return "Swami Tours & Travels provides 24/7 outstation cab service connecting Guhagar, Chiplun, Mumbai, Pune, Thane, Navi Mumbai, and Goa. Both one-way and round trips are available. Where would you like to travel?";
  }

  if (text.includes('one day') || text.includes('एक दिवस') || text.includes('trip')) {
    if (isMarathi) {
      return "एक दिवसाच्या सहलीसाठी गुहागर बीच, वेळणेश्वर, हेदवी, गणपतीपुळे किंवा चिपळूण स्थानिक फिरण्यासाठी आमच्याकडे एसी कार व टेम्पो ट्रॅव्हलर उपलब्ध आहेत. तुमचे पिकअप ठिकाण सांगा.";
    }
    return "For one-day trips, we cover Guhagar Beach, Velneshwar, Hedvi, Ganpatipule, and local sightseeing in Konkan. Please tell us your pickup location and group size.";
  }

  if (text.includes('wedding') || text.includes('लग्न') || text.includes('group')) {
    if (isMarathi) {
      return "लग्नकार्य व ग्रुप प्रवासासाठी आमचे २० व २६ सीटर लक्झरी टेम्पो ट्रॅव्हलर उत्तम आहेत. आरामदायी पुशबॅक सीट्स, म्युझिक सिस्टीम आणि मोठा लगेज कॅरियर उपलब्ध आहे. बुकिंग व तारखा कन्फर्म करण्यासाठी व्हॉट्सअॅपवर संपर्क साधा.";
    }
    return "For wedding parties and group tours, our 20-seater and 26-seater Force Tempo Travellers provide the ultimate comfort with pushback seating and ample luggage space. You can share your dates to get an instant WhatsApp quote.";
  }

  if (text.includes('contact') || text.includes('phone') || text.includes('नंबर') || text.includes('फोन') || text.includes('संपर्क')) {
    if (isMarathi) {
      return "स्वामी टूर्स अँड ट्रॅव्हल्सचा अधिकृत संपर्क क्रमांक आणि व्हॉट्सअॅप: +91 70838 08483 आहे. आमचे कार्यालय शृंगारतळी, गुहागर, जि. रत्नागिरी येथे आहे. आम्ही २४/७ सेवेत आहोत!";
    }
    return "You can reach Swami Tours & Travels directly via phone or WhatsApp at +91 70838 08483, or email info@swamitoursandtravels.in. Our office is located at Shringartali, Guhagar, Ratnagiri (415721).";
  }

  // Default response
  if (isMarathi) {
    return "नमस्कार! स्वामी टूर्स अँड ट्रॅव्हल्समध्ये आपले स्वागत आहे. आम्ही गुहागर, चिपळूण, मुंबई, पुणे आणि संपूर्ण महाराष्ट्रात कार व बस बुकिंग सेवा पुरवतो. तुम्हाला कोणत्या प्रवासासाठी गाडी हवी आहे?";
  }
  return "Hello! Welcome to Swami Tours & Travels. We provide premium car and luxury tempo traveller rentals across Guhagar, Chiplun, Mumbai, Pune, and Maharashtra. How can we assist your travel plans today?";
}

/**
 * Main Chat Request Handler
 * @param {Object} body - Request body { message, history, language }
 * @param {string} clientIp - Client IP address for rate limiting
 * @returns {Promise<Object>} Response object { reply, provider, status }
 */
export async function handleChatRequest(body, clientIp = '127.0.0.1') {
  // 1. Rate Limiting Check
  if (isRateLimited(clientIp)) {
    return {
      status: 429,
      error: 'Too many requests. Please wait a moment before sending another message.',
      reply: 'आपण खूप जलद संदेश पाठवले आहेत. कृपया थोडा वेळ थांबा. (Please wait a moment before sending another message.)'
    };
  }

  // 2. Input Validation
  const rawMessage = body?.message;
  if (!rawMessage || typeof rawMessage !== 'string' || !rawMessage.trim()) {
    return {
      status: 400,
      error: 'Message is required and must be non-empty text.',
      reply: 'कृपया तुमचा प्रश्न किंवा प्रवासाची माहिती लिहा.'
    };
  }

  const userMessage = rawMessage.trim().slice(0, 1000);
  const userLanguage = body.language || 'mr';
  const rawHistory = Array.isArray(body.history) ? body.history.slice(-10) : [];

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

  // 3. Fallback if no API key is present or invalid placeholder
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length < 10) {
    const fallbackReply = getRuleBasedReply(userMessage, userLanguage);
    return {
      status: 200,
      reply: fallbackReply,
      provider: 'rule_engine',
      notice: 'Running in direct booking assistant mode.'
    };
  }

  // 4. Real Gemini AI Integration using @google/genai SDK
  try {
    const ai = new GoogleGenAI({ apiKey });

    // Format contents for Gemini
    const contents = [];

    // Append past turns (user & model)
    for (const h of rawHistory) {
      if (h.role === 'user' && typeof h.text === 'string') {
        contents.push({ role: 'user', parts: [{ text: h.text }] });
      } else if ((h.role === 'model' || h.role === 'assistant' || h.role === 'bot') && typeof h.text === 'string') {
        contents.push({ role: 'model', parts: [{ text: h.text }] });
      }
    }

    // Append current user message
    contents.push({ role: 'user', parts: [{ text: userMessage }] });

    // Call Gemini API with system instructions
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 800,
      }
    });

    const replyText = response.text || response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (replyText && replyText.trim()) {
      return {
        status: 200,
        reply: replyText.trim(),
        provider: 'gemini_ai'
      };
    }

    throw new Error('Empty response from Gemini AI');
  } catch (err) {
    console.warn('[Swami Chatbot] Gemini API error, falling back to rule engine:', err?.message || err);

    // Graceful fallback to verified business rules
    const fallbackReply = getRuleBasedReply(userMessage, userLanguage);
    return {
      status: 200,
      reply: fallbackReply,
      provider: 'fallback_rule_engine',
      warning: 'Live AI temporarily unavailable. Using direct business concierge.'
    };
  }
}

/**
 * Public Config Handler (WhatsApp Number, Business Metadata)
 */
export function getPublicConfig() {
  return {
    whatsappNumber: process.env.WHATSAPP_NUMBER || '917083808483',
    businessPhone: '+91 70838 08483',
    businessName: 'Swami Tours and Travels',
    businessLocation: 'Shringartali, Guhagar, Ratnagiri, Maharashtra 415721'
  };
}
