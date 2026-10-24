/**
 * Swami Tours & Travels — Premium AI Chatbot Controller
 * Vanilla JS Widget with Guided Booking Flow, Marathi/Hindi/English Support,
 * WhatsApp Deep-Linking & Server-Side Gemini AI Integration.
 */

(function () {
  'use strict';

  // State Management
  const state = {
    isOpen: false,
    language: 'mr', // 'mr' (Marathi), 'hi' (Hindi), 'en' (English)
    whatsappNumber: '917083808483', // Default verified WhatsApp number
    history: [], // [{ role: 'bot'|'user', text: string, time: string }]
    enquiry: {
      active: false,
      step: 0,
      data: {
        name: '',
        phone: '',
        pickup: '',
        destination: '',
        travelDate: '',
        returnDate: '',
        tripType: 'Round Trip',
        passengers: '4',
        vehicle: 'Car (Ertiga / WagonR)',
        notes: ''
      }
    }
  };

  // Multilingual Strings & Questions
  const i18n = {
    mr: {
      welcome: "नमस्कार! Swami Tours and Travels मध्ये आपले स्वागत आहे. तुम्हाला Car किंवा Bus Booking साठी मदत हवी आहे का?",
      subtitle: "२४/७ ट्रॅव्हल असिस्टंट • गुहागर व चिपळूण",
      status: "ऑनलाइन",
      placeholder: "मराठी, हिंदी किंवा इंग्रजीत प्रश्न विचारा...",
      quickActionsLabel: "जलद पर्याय:",
      quickActions: [
        { id: 'car', label: 'Book a Car', query: 'मला कार भाड्याने हवी आहे (Book a Car)' },
        { id: 'bus', label: 'Book a Bus', query: 'मला बस / टेम्पो ट्रॅव्हलर हवा आहे (Book a Bus)' },
        { id: 'outstation', label: 'Outstation Travel', query: 'आऊटस्टेशन प्रवासाची माहिती हवी आहे (Outstation Travel)' },
        { id: 'oneday', label: 'One Day Trip', query: 'एक दिवसाच्या सहलीचे नियोजन (One Day Trip)' },
        { id: 'wedding', label: 'Wedding / Group Travel', query: 'लग्नकार्य किंवा ग्रुप ट्रॅव्हल बुकिंग (Wedding Travel)' },
        { id: 'contact', label: 'Contact Us', query: 'स्वामी टूर्स संपर्क माहिती (Contact Us)' }
      ],
      steps: [
        { field: 'name', prompt: 'कृपया आपले पूर्ण नाव सांगा:' },
        { field: 'phone', prompt: 'आपला १० अंकी मोबाईल नंबर द्या (WhatsApp / संपर्क):' },
        { field: 'pickup', prompt: 'गाडी कुठून हवी आहे? (उदा. गुहागर, चिपळूण स्टेशन, मुंबई, पुणे):' },
        { field: 'destination', prompt: 'प्रवासाचे शेवटचे ठिकाण (Destination) कोणते आहे?:' },
        { field: 'travelDate', prompt: 'प्रवासाची तारीख कोणती आहे? (उदा. 15 नोव्हेंबर):' },
        { field: 'tripType', prompt: 'प्रवास वन-वे (One-way) आहे की राउंड-ट्रिप (Round-trip)?:', options: ['One-way', 'Round-trip'] },
        { field: 'passengers', prompt: 'एकूण किती प्रवासी (Passengers) असतील?:' },
        { field: 'vehicle', prompt: 'आपली वाहनाची पसंती काय आहे?', options: ['WagonR (4+1)', 'Ertiga (6+1)', 'Tempo Traveller (20S)', 'Tempo Coach (26S)'] },
        { field: 'notes', prompt: 'काही विशेष सूचना किंवा वेळ आहे का? (नसल्यास "काही नाही" लिहा):' }
      ],
      whatsappBtnText: "Send Enquiry on WhatsApp",
      disclaimer: "टीप: ही प्राथमिक चौकशी आहे. वाहन उपलब्धता आणि अंतिम दर स्वामी टूर्स मालकांकडून व्हॉट्सअॅपवर कन्फर्म केले जातील.",
      confirmedNotice: "आपली माहिती तयार झाली आहे! बुकिंग निश्चित करण्यासाठी खालील बटण दाबून व्हॉट्सअॅपवर पाठवा."
    },
    hi: {
      welcome: "नमस्ते! Swami Tours and Travels में आपका स्वागत है। क्या आपको Car या Bus Booking में सहायता चाहिए?",
      subtitle: "24/7 ट्रेवल असिस्टेंट • गुहागर और चिपळूण",
      status: "ऑनलाइन",
      placeholder: "हिंदी, मराठी या अंग्रेजी में पूछें...",
      quickActionsLabel: "त्वरित विकल्प:",
      quickActions: [
        { id: 'car', label: 'Book a Car', query: 'मुझे कार बुक करनी है (Book a Car)' },
        { id: 'bus', label: 'Book a Bus', query: 'मुझे बस या टेम्पो ट्रेवलर चाहिए (Book a Bus)' },
        { id: 'outstation', label: 'Outstation Travel', query: 'आउटस्टेशन यात्रा की जानकारी चाहिए' },
        { id: 'oneday', label: 'One Day Trip', query: 'एक दिवसीय ट्रिप प्लान करना है' },
        { id: 'wedding', label: 'Wedding / Group Travel', query: 'शादी या ग्रुप ट्रेवल बुकिंग' },
        { id: 'contact', label: 'Contact Us', query: 'स्वामी टूर्स से संपर्क करें' }
      ],
      steps: [
        { field: 'name', prompt: 'कृपया अपना पूरा नाम बताएं:' },
        { field: 'phone', prompt: 'अपना 10 अंकों का मोबाइल नंबर दर्ज करें:' },
        { field: 'pickup', prompt: 'पिकअप स्थान कौन सा है? (उदा. गुहागर, चिपळूण स्टेशन, मुंबई, पुणे):' },
        { field: 'destination', prompt: 'आप कहाँ जाना चाहते हैं (Destination)?:' },
        { field: 'travelDate', prompt: 'यात्रा की तारीख क्या है?:' },
        { field: 'tripType', prompt: 'यात्रा वन-वे है या राउंड-ट्रिप?:', options: ['One-way', 'Round-trip'] },
        { field: 'passengers', prompt: 'कुल कितने यात्री (Passengers) होंगे?:' },
        { field: 'vehicle', prompt: 'वाहन का चयन करें:', options: ['WagonR (4+1)', 'Ertiga (6+1)', 'Tempo Traveller (20S)', 'Tempo Coach (26S)'] },
        { field: 'notes', prompt: 'कोई अतिरिक्त आवश्यकता या समय?:' }
      ],
      whatsappBtnText: "Send Enquiry on WhatsApp",
      disclaimer: "नोट: अंतिम पुष्टि और दर स्वामी टूर्स द्वारा व्हाट्सएप पर तय किए जाएंगे।",
      confirmedNotice: "विवरण तैयार है! कृपया व्हाट्सएप पर पूछताछ भेजने के लिए नीचे क्लिक करें।"
    },
    en: {
      welcome: "Hello! Welcome to Swami Tours and Travels. Do you need help booking a Car, SUV, or Bus?",
      subtitle: "24/7 AI Chauffeur • Guhagar & Chiplun",
      status: "Online",
      placeholder: "Ask in Marathi, Hindi, or English...",
      quickActionsLabel: "Quick Actions:",
      quickActions: [
        { id: 'car', label: 'Book a Car', query: 'I want to book a car (WagonR / Ertiga)' },
        { id: 'bus', label: 'Book a Bus', query: 'I want to book a Luxury Tempo Traveller / Bus' },
        { id: 'outstation', label: 'Outstation Travel', query: 'Inquire about outstation cab service' },
        { id: 'oneday', label: 'One Day Trip', query: 'One day sightseeing trip in Konkan' },
        { id: 'wedding', label: 'Wedding / Group Travel', query: 'Wedding party or large group travel' },
        { id: 'contact', label: 'Contact Us', query: 'Swami Tours contact number & address' }
      ],
      steps: [
        { field: 'name', prompt: 'Please tell us your full name:' },
        { field: 'phone', prompt: 'Please enter your 10-digit mobile number:' },
        { field: 'pickup', prompt: 'What is your pickup location? (e.g. Guhagar, Chiplun Station, Mumbai, Pune):' },
        { field: 'destination', prompt: 'What is your drop / travel destination?:' },
        { field: 'travelDate', prompt: 'What is your planned travel date?:' },
        { field: 'tripType', prompt: 'Is this a One-way or Round-trip journey?:', options: ['One-way', 'Round-trip'] },
        { field: 'passengers', prompt: 'How many passengers will be traveling?:' },
        { field: 'vehicle', prompt: 'Select vehicle preference:', options: ['WagonR (4+1)', 'Ertiga (6+1)', 'Tempo Traveller (20S)', 'Tempo Coach (26S)'] },
        { field: 'notes', prompt: 'Any special requirements or pickup timing? (or type "None"):' }
      ],
      whatsappBtnText: "Send Enquiry on WhatsApp",
      disclaimer: "Note: This is an enquiry request. Exact availability, toll estimations, and final confirmation will be verified by the owner on WhatsApp.",
      confirmedNotice: "Your details are ready! Click below to send your enquiry directly on WhatsApp."
    }
  };

  /**
   * Initialize Chatbot Widget
   */
  async function initChatbot() {
    fetchConfig();
    renderDOM();
    bindEvents();
    // Add initial greeting message
    addBotMessage(i18n[state.language].welcome);
  }

  /**
   * Fetch Public Config (WhatsApp Number)
   */
  async function fetchConfig() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const data = await res.json();
        if (data.whatsappNumber) {
          state.whatsappNumber = data.whatsappNumber.replace(/\D/g, '');
        }
      }
    } catch {
      // Fallback stays as default 917083808483
    }
  }

  /**
   * Render HTML Elements
   */
  function renderDOM() {
    if (document.getElementById('stt-chatbot-root')) return;

    const root = document.createElement('div');
    root.id = 'stt-chatbot-root';

    root.innerHTML = `
      <!-- Floating Launcher Button -->
      <button type="button" id="stt-chat-launcher" class="stt-chat-launcher" aria-label="Open Swami Tours AI Chatbot" title="Chat with Swami Tours AI">
        <span class="stt-launcher-tooltip">24/7 Booking Assistant</span>
        <span class="stt-launcher-status-dot"></span>
        
        <!-- Chat Icon (SVG) -->
        <span class="stt-launcher-icon-chat">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </span>

        <!-- Close Icon (SVG) -->
        <span class="stt-launcher-icon-close">
          <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </span>
      </button>

      <!-- Chat Window Dialog -->
      <div id="stt-chat-window" class="stt-chat-window" role="dialog" aria-modal="true" aria-labelledby="stt-chat-title">
        <!-- Header -->
        <div class="stt-chat-header">
          <div class="stt-header-brand-wrap">
            <div class="stt-header-avatar">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <circle cx="12" cy="5" r="2"></circle>
                <path d="M12 7v4"></path>
                <line x1="8" y1="16" x2="8" y2="16"></line>
                <line x1="16" y1="16" x2="16" y2="16"></line>
              </svg>
            </div>
            <div class="stt-header-info">
              <h3 id="stt-chat-title" class="stt-header-title">Swami Tours & Travels</h3>
              <p class="stt-header-subtitle">
                <span class="stt-status-indicator"></span>
                <span id="stt-status-text">Active Now</span> • Guhagar
              </p>
            </div>
          </div>
          
          <div class="stt-header-actions">
            <!-- Reset Button -->
            <button type="button" id="stt-reset-btn" class="stt-header-btn" title="Reset Conversation" aria-label="Reset Conversation">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
                <path d="M3 3v5h5"></path>
              </svg>
            </button>
            <!-- Close Button -->
            <button type="button" id="stt-close-btn" class="stt-header-btn" title="Close Chat" aria-label="Close Chat">
              <svg viewBox="0 0 24 24" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <!-- Language Switcher Bar -->
        <div class="stt-quick-lang-bar">
          <div class="stt-lang-chips">
            <button type="button" class="stt-lang-btn ${state.language === 'mr' ? 'active' : ''}" data-lang="mr">मराठी</button>
            <button type="button" class="stt-lang-btn ${state.language === 'hi' ? 'active' : ''}" data-lang="hi">हिंदी</button>
            <button type="button" class="stt-lang-btn ${state.language === 'en' ? 'active' : ''}" data-lang="en">English</button>
          </div>
          <div class="stt-location-badge">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            <span>Shringartali, Guhagar</span>
          </div>
        </div>

        <!-- Message Body -->
        <div id="stt-chat-body" class="stt-chat-body"></div>

        <!-- Quick Action Suggestion Chips -->
        <div class="stt-quick-actions-wrap">
          <div class="stt-quick-actions-label" id="stt-quick-label">${i18n[state.language].quickActionsLabel}</div>
          <div class="stt-quick-actions-grid" id="stt-quick-grid"></div>
        </div>

        <!-- Input Footer -->
        <div class="stt-chat-footer">
          <div class="stt-input-wrap">
            <input type="text" id="stt-chat-input" class="stt-chat-input" placeholder="${i18n[state.language].placeholder}" autocomplete="off" />
          </div>
          <button type="button" id="stt-send-btn" class="stt-chat-send-btn" aria-label="Send Message">
            <svg viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(root);
    renderQuickActions();
  }

  /**
   * Bind DOM Events
   */
  function bindEvents() {
    const launcher = document.getElementById('stt-chat-launcher');
    const closeBtn = document.getElementById('stt-close-btn');
    const resetBtn = document.getElementById('stt-reset-btn');
    const sendBtn = document.getElementById('stt-send-btn');
    const input = document.getElementById('stt-chat-input');
    const langBtns = document.querySelectorAll('.stt-lang-btn');

    launcher.addEventListener('click', toggleChat);
    closeBtn.addEventListener('click', closeChat);
    resetBtn.addEventListener('click', resetChat);

    sendBtn.addEventListener('click', handleSendMessage);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && state.isOpen) {
        closeChat();
      }
    });

    // Language selection
    langBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang');
        switchLanguage(lang);
      });
    });
  }

  /**
   * Switch Active Language
   */
  function switchLanguage(lang) {
    if (!i18n[lang]) return;
    state.language = lang;

    // Update active button
    document.querySelectorAll('.stt-lang-btn').forEach((b) => {
      b.classList.toggle('active', b.getAttribute('data-lang') === lang);
    });

    // Update input placeholder & quick action labels
    const input = document.getElementById('stt-chat-input');
    if (input) input.placeholder = i18n[lang].placeholder;

    const quickLabel = document.getElementById('stt-quick-label');
    if (quickLabel) quickLabel.textContent = i18n[lang].quickActionsLabel;

    renderQuickActions();

    // Acknowledge language switch
    const langNames = { mr: 'मराठी', hi: 'हिंदी', en: 'English' };
    addBotMessage(`भाषा बदलली: ${langNames[lang]}. आता आम्ही तुम्हाला या भाषेत सहाय्य करू.`);
  }

  /**
   * Render Quick Action Chips
   */
  function renderQuickActions() {
    const container = document.getElementById('stt-quick-grid');
    if (!container) return;

    container.innerHTML = '';
    const actions = i18n[state.language].quickActions;

    // Icons map for quick actions (custom SVGs)
    const iconSvgs = {
      car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="8" rx="2"/><circle cx="7" cy="19" r="2"/><circle cx="17" cy="19" r="2"/><path d="M5 11l2-5h10l2 5"/></svg>',
      bus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="3" width="16" height="16" rx="2"/><path d="M4 11h16"/><circle cx="8" cy="15" r="1.5"/><circle cx="16" cy="15" r="1.5"/><path d="M6 19v2"/><path d="M18 19v2"/></svg>',
      outstation: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>',
      oneday: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
      wedding: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
      contact: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>'
    };

    actions.forEach((act) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'stt-action-chip';
      chip.innerHTML = `${iconSvgs[act.id] || ''} <span>${act.label}</span>`;

      chip.addEventListener('click', () => {
        addUserMessage(act.label);
        handleQuickActionClick(act);
      });

      container.appendChild(chip);
    });
  }

  /**
   * Handle Quick Action Trigger
   */
  function handleQuickActionClick(act) {
    if (act.id === 'car' || act.id === 'bus' || act.id === 'wedding' || act.id === 'outstation') {
      // Start guided booking flow
      startGuidedEnquiry(act.id);
    } else {
      // Normal AI request
      sendToAi(act.query);
    }
  }

  /**
   * Toggle & Window Controls
   */
  function toggleChat() {
    state.isOpen ? closeChat() : openChat();
  }

  function openChat() {
    state.isOpen = true;
    const win = document.getElementById('stt-chat-window');
    const launcher = document.getElementById('stt-chat-launcher');
    win.classList.add('is-open');
    launcher.classList.add('is-open');

    setTimeout(() => {
      const input = document.getElementById('stt-chat-input');
      if (input && window.innerWidth > 640) input.focus();
    }, 280);
  }

  function closeChat() {
    state.isOpen = false;
    const win = document.getElementById('stt-chat-window');
    const launcher = document.getElementById('stt-chat-launcher');
    win.classList.remove('is-open');
    launcher.classList.remove('is-open');
  }

  function resetChat() {
    state.history = [];
    state.enquiry.active = false;
    state.enquiry.step = 0;
    state.enquiry.data = {
      name: '', phone: '', pickup: '', destination: '',
      travelDate: '', returnDate: '', tripType: 'Round Trip',
      passengers: '4', vehicle: 'Car (Ertiga / WagonR)', notes: ''
    };

    const body = document.getElementById('stt-chat-body');
    if (body) body.innerHTML = '';

    addBotMessage(i18n[state.language].welcome);
  }

  /**
   * Add User Message Bubble
   */
  function addUserMessage(text) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.history.push({ role: 'user', text, time });

    const body = document.getElementById('stt-chat-body');
    const row = document.createElement('div');
    row.className = 'stt-msg-row is-user';

    row.innerHTML = `
      <div class="stt-msg-bubble">
        <div>${escapeHtml(text)}</div>
        <span class="stt-msg-time">${time}</span>
      </div>
    `;

    body.appendChild(row);
    scrollToBottom();
  }

  /**
   * Add Bot Message Bubble
   */
  function addBotMessage(text, extraHtml = '') {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    state.history.push({ role: 'bot', text, time });

    const body = document.getElementById('stt-chat-body');
    const row = document.createElement('div');
    row.className = 'stt-msg-row';

    row.innerHTML = `
      <div class="stt-bot-avatar-small" title="Swami Tours Assistant">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
          <circle cx="12" cy="12" r="9"/>
          <path d="M12 7v5l3 3"/>
        </svg>
      </div>
      <div class="stt-msg-bubble">
        <div>${formatBotText(text)}</div>
        ${extraHtml}
        <span class="stt-msg-time">${time}</span>
      </div>
    `;

    body.appendChild(row);
    scrollToBottom();
  }

  /**
   * Show Typing Indicator
   */
  function showTypingIndicator() {
    const body = document.getElementById('stt-chat-body');
    const typing = document.createElement('div');
    typing.id = 'stt-typing';
    typing.className = 'stt-msg-row';
    typing.innerHTML = `
      <div class="stt-bot-avatar-small">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="9"/></svg>
      </div>
      <div class="stt-typing-indicator">
        <div class="stt-typing-dot"></div>
        <div class="stt-typing-dot"></div>
        <div class="stt-typing-dot"></div>
      </div>
    `;
    body.appendChild(typing);
    scrollToBottom();
  }

  function hideTypingIndicator() {
    const typing = document.getElementById('stt-typing');
    if (typing) typing.remove();
  }

  function scrollToBottom() {
    const body = document.getElementById('stt-chat-body');
    if (body) {
      body.scrollTop = body.scrollHeight;
    }
  }

  /**
   * Handle Free-form User Input Send
   */
  async function handleSendMessage() {
    const input = document.getElementById('stt-chat-input');
    const text = input.value.trim();
    if (!text) return;

    input.value = '';
    addUserMessage(text);

    // If currently in a guided enquiry flow
    if (state.enquiry.active) {
      handleEnquiryStepInput(text);
      return;
    }

    // Check if user wants to initiate booking
    const lower = text.toLowerCase();
    if (lower.includes('book') || lower.includes('booking') || lower.includes('भाड्याने') || lower.includes('गाडी पाहिजे')) {
      startGuidedEnquiry();
      return;
    }

    // Call server AI endpoint
    await sendToAi(text);
  }

  /**
   * Send Message to Server-Side AI (/api/chat)
   */
  async function sendToAi(message) {
    showTypingIndicator();
    const sendBtn = document.getElementById('stt-send-btn');
    if (sendBtn) sendBtn.disabled = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message,
          language: state.language,
          history: state.history.slice(-8)
        })
      });

      hideTypingIndicator();

      if (response.ok) {
        const data = await response.json();
        addBotMessage(data.reply || 'धन्यवाद! अधिक माहितीसाठी कृपया व्हॉट्सअॅपवर संपर्क साधा.');
      } else {
        throw new Error('Server error');
      }
    } catch {
      hideTypingIndicator();
      // Friendly fallback
      const fallbackMsg = state.language === 'mr'
        ? "धन्यवाद! आम्ही २४/७ सेवेत आहोत. आपल्या प्रवासाचे तपशील निश्चित करण्यासाठी कृपया थेट +91 70838 08483 वर कॉल किंवा व्हॉट्सअॅप करा."
        : "Thank you! Swami Tours is available 24/7. To lock in your travel dates or get an instant quote, please call or WhatsApp us directly at +91 70838 08483.";

      const directWaBtn = `
        <div style="margin-top: 8px;">
          <a href="https://wa.me/${state.whatsappNumber}?text=${encodeURIComponent('Hello Swami Tours, I need cab assistance.')}" target="_blank" rel="noopener" class="stt-btn-whatsapp-action">
            <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            <span>Chat on WhatsApp (+91 70838 08483)</span>
          </a>
        </div>
      `;
      addBotMessage(fallbackMsg, directWaBtn);
    } finally {
      if (sendBtn) sendBtn.disabled = false;
    }
  }

  /**
   * Guided Travel Booking Flow
   */
  function startGuidedEnquiry(vehicleHint) {
    state.enquiry.active = true;
    state.enquiry.step = 0;

    if (vehicleHint === 'car') {
      state.enquiry.data.vehicle = 'Maruti Ertiga (6+1) or WagonR';
    } else if (vehicleHint === 'bus' || vehicleHint === 'wedding') {
      state.enquiry.data.vehicle = 'Force Tempo Traveller (20 or 26 Seater)';
    }

    const currentLang = i18n[state.language];
    const greeting = state.language === 'mr'
      ? "नक्कीच! बुकिंग चौकशीसाठी मी काही सोपे प्रश्न विचारत आहे, जेणेकरून आम्ही योग्य गाडी व सर्वोत्तम दर देऊ शकू."
      : "Great! Let's collect a few travel details so we can assist you with the right vehicle and estimate.";

    addBotMessage(greeting);
    askCurrentStepQuestion();
  }

  function askCurrentStepQuestion() {
    const steps = i18n[state.language].steps;
    const current = steps[state.enquiry.step];
    if (!current) {
      finishGuidedEnquiry();
      return;
    }

    let optionPillsHtml = '';
    if (current.options && current.options.length) {
      optionPillsHtml = `
        <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-top: 8px;">
          ${current.options.map((opt) => `
            <button type="button" class="stt-action-chip stt-step-opt" data-val="${opt}">
              <span>${opt}</span>
            </button>
          `).join('')}
        </div>
      `;
    }

    addBotMessage(current.prompt, optionPillsHtml);

    // Bind option click handlers
    setTimeout(() => {
      document.querySelectorAll('.stt-step-opt').forEach((btn) => {
        btn.addEventListener('click', () => {
          const val = btn.getAttribute('data-val');
          addUserMessage(val);
          handleEnquiryStepInput(val);
        });
      });
    }, 50);
  }

  function handleEnquiryStepInput(text) {
    const steps = i18n[state.language].steps;
    const current = steps[state.enquiry.step];
    if (!current) return;

    // Field-specific validation
    if (current.field === 'phone') {
      const cleanPhone = text.replace(/\D/g, '');
      if (cleanPhone.length < 10) {
        addBotMessage(state.language === 'mr'
          ? "कृपया योग्य १० अंकी मोबाईल नंबर प्रविष्ट करा (उदा. 9876543210):"
          : "Please enter a valid 10-digit mobile number:");
        return;
      }
      state.enquiry.data.phone = cleanPhone;
    } else {
      state.enquiry.data[current.field] = text;
    }

    state.enquiry.step += 1;

    if (state.enquiry.step < steps.length) {
      askCurrentStepQuestion();
    } else {
      finishGuidedEnquiry();
    }
  }

  /**
   * Finalize Guided Enquiry & Render Summary Card with WhatsApp Deep Link
   */
  function finishGuidedEnquiry() {
    state.enquiry.active = false;
    const data = state.enquiry.data;
    const lang = i18n[state.language];

    // Formatted WhatsApp Message
    const waText = [
      `*New Booking Enquiry — Swami Tours & Travels*`,
      `━━━━━━━━━━━━━━━━━━`,
      `👤 *Customer:* ${data.name || 'Not provided'}`,
      `📱 *Phone:* ${data.phone || 'Not provided'}`,
      `📍 *Pickup:* ${data.pickup || 'Guhagar / Chiplun'}`,
      `🏁 *Destination:* ${data.destination || 'Maharashtra'}`,
      `🗓️ *Travel Date:* ${data.travelDate || 'As discussed'}`,
      `🔄 *Trip Type:* ${data.tripType || 'Round Trip'}`,
      `👥 *Passengers:* ${data.passengers || '4'}`,
      `🚗 *Vehicle Preference:* ${data.vehicle || 'Car / Tempo Traveller'}`,
      data.notes && data.notes.toLowerCase() !== 'none' && data.notes !== 'काही नाही' ? `📝 *Notes:* ${data.notes}` : null,
      `━━━━━━━━━━━━━━━━━━`,
      `_Sent via Swami Tours AI Assistant_`
    ].filter(Boolean).join('\n');

    const waUrl = `https://wa.me/${state.whatsappNumber}?text=${encodeURIComponent(waText)}`;

    const summaryCardHtml = `
      <div class="stt-enquiry-card">
        <div class="stt-card-header">
          <div class="stt-card-title">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            <span>Booking Enquiry Summary</span>
          </div>
          <span class="stt-card-badge">${escapeHtml(data.tripType || 'Trip')}</span>
        </div>

        <div class="stt-card-fields">
          <div class="stt-card-field is-full">
            <div class="stt-field-label">Route</div>
            <div class="stt-field-val">${escapeHtml(data.pickup || 'Pickup')} ➔ ${escapeHtml(data.destination || 'Destination')}</div>
          </div>
          <div class="stt-card-field">
            <div class="stt-field-label">Date</div>
            <div class="stt-field-val">${escapeHtml(data.travelDate || 'Date')}</div>
          </div>
          <div class="stt-card-field">
            <div class="stt-field-label">Passengers</div>
            <div class="stt-field-val">${escapeHtml(data.passengers || '4')} Seats</div>
          </div>
          <div class="stt-card-field is-full">
            <div class="stt-field-label">Vehicle Selected</div>
            <div class="stt-field-val" style="color: #F7DF8A;">${escapeHtml(data.vehicle || 'Car / Tempo')}</div>
          </div>
          <div class="stt-card-field is-full">
            <div class="stt-field-label">Contact</div>
            <div class="stt-field-val">${escapeHtml(data.name || 'Customer')} (${escapeHtml(data.phone || 'Phone')})</div>
          </div>
        </div>

        <div class="stt-card-notice">
          ${lang.disclaimer}
        </div>

        <a href="${waUrl}" target="_blank" rel="noopener" class="stt-btn-whatsapp-action" id="stt-wa-submit-btn">
          <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          <span>${lang.whatsappBtnText}</span>
        </a>
      </div>
    `;

    addBotMessage(lang.confirmedNotice, summaryCardHtml);
  }

  // Utilities
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function formatBotText(text) {
    if (!text) return '';
    // Format basic bold tags and newlines
    let html = escapeHtml(text)
      .replace(/\n/g, '<br/>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    return html;
  }

  // Auto-boot on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatbot);
  } else {
    initChatbot();
  }
})();
