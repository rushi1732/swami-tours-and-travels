/**
 * Swami Tours & Travels - Core Interactive Engine
 * Responsive UX, Dynamic Estimator, Lightbox, WhatsApp Integration
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFareEstimator();
  initQuickQuotePopup();
  initDeveloperCreditModal();
  initGallery();
  initFaqAccordion();
  initBookingForm();
  initFeedbackModal();
  initScrollSpy();
  initScrollReveal();
  initHeroParallax();
  initSmoothScrollLinks();
});

// -----------------------------------------------------------------------------
// 1. Mobile Navigation & Drawer
// -----------------------------------------------------------------------------
function initMobileNav() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const drawer = document.querySelector('.mobile-drawer');
  const navLinks = document.querySelectorAll('.mobile-drawer .nav-link, .mobile-drawer a');

  if (!menuBtn || !drawer) return;

  const burgerSvg = '<svg class="hamburger-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>';
  const closeSvg = '<svg class="hamburger-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>';

  menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    menuBtn.innerHTML = isOpen ? closeSvg : burgerSvg;
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = burgerSvg;
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (drawer.classList.contains('open') && !drawer.contains(e.target) && !menuBtn.contains(e.target)) {
      drawer.classList.remove('open');
      menuBtn.setAttribute('aria-expanded', 'false');
      menuBtn.innerHTML = burgerSvg;
    }
  });
}

// -----------------------------------------------------------------------------
// 2. Interactive Route & Fare Estimator
// -----------------------------------------------------------------------------
const FLEET_RATES = {
  'white-wagonr': {
    name: 'White WagonR (4+1 Seater)',
    perKm: 14,
    driverAllowance: 300,
    minKmPerDay: 250
  },
  'black-ertiga': {
    name: 'Black Ertiga (6+1 Seater)',
    perKm: 16,
    driverAllowance: 400,
    minKmPerDay: 300
  },
  'tempo-20': {
    name: 'White 20-Seater Tempo Traveller',
    perKm: 26,
    driverAllowance: 600,
    minKmPerDay: 300
  },
  'tempo-26': {
    name: 'White 26-Seater Force Tempo Traveller',
    perKm: 35,
    driverAllowance: 700,
    minKmPerDay: 300
  }
};

const POPULAR_ROUTES = {
  "guhagar_to_chiplun": {
    "distance": 45,
    "from": "Guhagar",
    "to": "Chiplun",
    "name": "Guhagar to Chiplun"
  },
  "guhagar_to_ratnagiri": {
    "distance": 85,
    "from": "Guhagar",
    "to": "Ratnagiri",
    "name": "Guhagar to Ratnagiri"
  },
  "guhagar_to_mumbai": {
    "distance": 280,
    "from": "Guhagar",
    "to": "Mumbai",
    "name": "Guhagar to Mumbai"
  },
  "guhagar_to_navi-mumbai": {
    "distance": 265,
    "from": "Guhagar",
    "to": "Navi Mumbai",
    "name": "Guhagar to Navi Mumbai"
  },
  "guhagar_to_thane": {
    "distance": 295,
    "from": "Guhagar",
    "to": "Thane",
    "name": "Guhagar to Thane"
  },
  "guhagar_to_pune": {
    "distance": 240,
    "from": "Guhagar",
    "to": "Pune",
    "name": "Guhagar to Pune"
  },
  "guhagar_to_mumbai-airport-bom": {
    "distance": 285,
    "from": "Guhagar",
    "to": "Mumbai Airport",
    "name": "Guhagar to Mumbai Airport"
  },
  "guhagar_to_pune-airport-pnq": {
    "distance": 245,
    "from": "Guhagar",
    "to": "Pune Airport",
    "name": "Guhagar to Pune Airport"
  },
  "guhagar_to_navi-mumbai-airport-nmia": {
    "distance": 260,
    "from": "Guhagar",
    "to": "Navi Mumbai Airport",
    "name": "Guhagar to Navi Mumbai Airport"
  },
  "guhagar_to_satara": {
    "distance": 175,
    "from": "Guhagar",
    "to": "Satara",
    "name": "Guhagar to Satara"
  },
  "guhagar_to_kolhapur": {
    "distance": 195,
    "from": "Guhagar",
    "to": "Kolhapur",
    "name": "Guhagar to Kolhapur"
  },
  "guhagar_to_pandharpur": {
    "distance": 310,
    "from": "Guhagar",
    "to": "Pandharpur",
    "name": "Guhagar to Pandharpur"
  },
  "guhagar_to_karad": {
    "distance": 130,
    "from": "Guhagar",
    "to": "Karad",
    "name": "Guhagar to Karad"
  },
  "guhagar_to_goa": {
    "distance": 360,
    "from": "Guhagar",
    "to": "Goa",
    "name": "Guhagar to Goa"
  },
  "guhagar_to_malvan": {
    "distance": 225,
    "from": "Guhagar",
    "to": "Malvan",
    "name": "Guhagar to Malvan"
  },
  "guhagar_to_alibag": {
    "distance": 210,
    "from": "Guhagar",
    "to": "Alibag",
    "name": "Guhagar to Alibag"
  },
  "guhagar_to_shirdi": {
    "distance": 420,
    "from": "Guhagar",
    "to": "Shirdi",
    "name": "Guhagar to Shirdi"
  },
  "guhagar_to_mahabaleshwar": {
    "distance": 155,
    "from": "Guhagar",
    "to": "Mahabaleshwar",
    "name": "Guhagar to Mahabaleshwar"
  },
  "chiplun_to_guhagar": {
    "distance": 45,
    "from": "Chiplun",
    "to": "Guhagar",
    "name": "Chiplun to Guhagar"
  },
  "chiplun_to_ratnagiri": {
    "distance": 85,
    "from": "Chiplun",
    "to": "Ratnagiri",
    "name": "Chiplun to Ratnagiri"
  },
  "chiplun_to_mumbai": {
    "distance": 245,
    "from": "Chiplun",
    "to": "Mumbai",
    "name": "Chiplun to Mumbai"
  },
  "chiplun_to_navi-mumbai": {
    "distance": 230,
    "from": "Chiplun",
    "to": "Navi Mumbai",
    "name": "Chiplun to Navi Mumbai"
  },
  "chiplun_to_thane": {
    "distance": 260,
    "from": "Chiplun",
    "to": "Thane",
    "name": "Chiplun to Thane"
  },
  "chiplun_to_pune": {
    "distance": 200,
    "from": "Chiplun",
    "to": "Pune",
    "name": "Chiplun to Pune"
  },
  "chiplun_to_mumbai-airport-bom": {
    "distance": 250,
    "from": "Chiplun",
    "to": "Mumbai Airport",
    "name": "Chiplun to Mumbai Airport"
  },
  "chiplun_to_pune-airport-pnq": {
    "distance": 205,
    "from": "Chiplun",
    "to": "Pune Airport",
    "name": "Chiplun to Pune Airport"
  },
  "chiplun_to_navi-mumbai-airport-nmia": {
    "distance": 225,
    "from": "Chiplun",
    "to": "Navi Mumbai Airport",
    "name": "Chiplun to Navi Mumbai Airport"
  },
  "chiplun_to_satara": {
    "distance": 115,
    "from": "Chiplun",
    "to": "Satara",
    "name": "Chiplun to Satara"
  },
  "chiplun_to_kolhapur": {
    "distance": 190,
    "from": "Chiplun",
    "to": "Kolhapur",
    "name": "Chiplun to Kolhapur"
  },
  "chiplun_to_pandharpur": {
    "distance": 265,
    "from": "Chiplun",
    "to": "Pandharpur",
    "name": "Chiplun to Pandharpur"
  },
  "chiplun_to_karad": {
    "distance": 85,
    "from": "Chiplun",
    "to": "Karad",
    "name": "Chiplun to Karad"
  },
  "chiplun_to_goa": {
    "distance": 360,
    "from": "Chiplun",
    "to": "Goa",
    "name": "Chiplun to Goa"
  },
  "chiplun_to_malvan": {
    "distance": 235,
    "from": "Chiplun",
    "to": "Malvan",
    "name": "Chiplun to Malvan"
  },
  "chiplun_to_alibag": {
    "distance": 175,
    "from": "Chiplun",
    "to": "Alibag",
    "name": "Chiplun to Alibag"
  },
  "chiplun_to_shirdi": {
    "distance": 385,
    "from": "Chiplun",
    "to": "Shirdi",
    "name": "Chiplun to Shirdi"
  },
  "chiplun_to_mahabaleshwar": {
    "distance": 110,
    "from": "Chiplun",
    "to": "Mahabaleshwar",
    "name": "Chiplun to Mahabaleshwar"
  },
  "ratnagiri_to_guhagar": {
    "distance": 85,
    "from": "Ratnagiri",
    "to": "Guhagar",
    "name": "Ratnagiri to Guhagar"
  },
  "ratnagiri_to_chiplun": {
    "distance": 85,
    "from": "Ratnagiri",
    "to": "Chiplun",
    "name": "Ratnagiri to Chiplun"
  },
  "ratnagiri_to_mumbai": {
    "distance": 340,
    "from": "Ratnagiri",
    "to": "Mumbai",
    "name": "Ratnagiri to Mumbai"
  },
  "ratnagiri_to_navi-mumbai": {
    "distance": 325,
    "from": "Ratnagiri",
    "to": "Navi Mumbai",
    "name": "Ratnagiri to Navi Mumbai"
  },
  "ratnagiri_to_thane": {
    "distance": 355,
    "from": "Ratnagiri",
    "to": "Thane",
    "name": "Ratnagiri to Thane"
  },
  "ratnagiri_to_pune": {
    "distance": 305,
    "from": "Ratnagiri",
    "to": "Pune",
    "name": "Ratnagiri to Pune"
  },
  "ratnagiri_to_mumbai-airport-bom": {
    "distance": 345,
    "from": "Ratnagiri",
    "to": "Mumbai Airport",
    "name": "Ratnagiri to Mumbai Airport"
  },
  "ratnagiri_to_pune-airport-pnq": {
    "distance": 310,
    "from": "Ratnagiri",
    "to": "Pune Airport",
    "name": "Ratnagiri to Pune Airport"
  },
  "ratnagiri_to_navi-mumbai-airport-nmia": {
    "distance": 320,
    "from": "Ratnagiri",
    "to": "Navi Mumbai Airport",
    "name": "Ratnagiri to Navi Mumbai Airport"
  },
  "ratnagiri_to_satara": {
    "distance": 205,
    "from": "Ratnagiri",
    "to": "Satara",
    "name": "Ratnagiri to Satara"
  },
  "ratnagiri_to_kolhapur": {
    "distance": 130,
    "from": "Ratnagiri",
    "to": "Kolhapur",
    "name": "Ratnagiri to Kolhapur"
  },
  "ratnagiri_to_pandharpur": {
    "distance": 260,
    "from": "Ratnagiri",
    "to": "Pandharpur",
    "name": "Ratnagiri to Pandharpur"
  },
  "ratnagiri_to_karad": {
    "distance": 145,
    "from": "Ratnagiri",
    "to": "Karad",
    "name": "Ratnagiri to Karad"
  },
  "ratnagiri_to_goa": {
    "distance": 260,
    "from": "Ratnagiri",
    "to": "Goa",
    "name": "Ratnagiri to Goa"
  },
  "ratnagiri_to_malvan": {
    "distance": 140,
    "from": "Ratnagiri",
    "to": "Malvan",
    "name": "Ratnagiri to Malvan"
  },
  "ratnagiri_to_alibag": {
    "distance": 270,
    "from": "Ratnagiri",
    "to": "Alibag",
    "name": "Ratnagiri to Alibag"
  },
  "ratnagiri_to_shirdi": {
    "distance": 470,
    "from": "Ratnagiri",
    "to": "Shirdi",
    "name": "Ratnagiri to Shirdi"
  },
  "ratnagiri_to_mahabaleshwar": {
    "distance": 210,
    "from": "Ratnagiri",
    "to": "Mahabaleshwar",
    "name": "Ratnagiri to Mahabaleshwar"
  },
  "mumbai_to_guhagar": {
    "distance": 280,
    "from": "Mumbai",
    "to": "Guhagar",
    "name": "Mumbai to Guhagar"
  },
  "mumbai_to_chiplun": {
    "distance": 245,
    "from": "Mumbai",
    "to": "Chiplun",
    "name": "Mumbai to Chiplun"
  },
  "mumbai_to_ratnagiri": {
    "distance": 340,
    "from": "Mumbai",
    "to": "Ratnagiri",
    "name": "Mumbai to Ratnagiri"
  },
  "mumbai_to_navi-mumbai": {
    "distance": 35,
    "from": "Mumbai",
    "to": "Navi Mumbai",
    "name": "Mumbai to Navi Mumbai"
  },
  "mumbai_to_thane": {
    "distance": 30,
    "from": "Mumbai",
    "to": "Thane",
    "name": "Mumbai to Thane"
  },
  "mumbai_to_pune": {
    "distance": 150,
    "from": "Mumbai",
    "to": "Pune",
    "name": "Mumbai to Pune"
  },
  "mumbai_to_mumbai-airport-bom": {
    "distance": 20,
    "from": "Mumbai",
    "to": "Mumbai Airport",
    "name": "Mumbai to Mumbai Airport"
  },
  "mumbai_to_pune-airport-pnq": {
    "distance": 160,
    "from": "Mumbai",
    "to": "Pune Airport",
    "name": "Mumbai to Pune Airport"
  },
  "mumbai_to_navi-mumbai-airport-nmia": {
    "distance": 35,
    "from": "Mumbai",
    "to": "Navi Mumbai Airport",
    "name": "Mumbai to Navi Mumbai Airport"
  },
  "mumbai_to_satara": {
    "distance": 260,
    "from": "Mumbai",
    "to": "Satara",
    "name": "Mumbai to Satara"
  },
  "mumbai_to_kolhapur": {
    "distance": 380,
    "from": "Mumbai",
    "to": "Kolhapur",
    "name": "Mumbai to Kolhapur"
  },
  "mumbai_to_pandharpur": {
    "distance": 360,
    "from": "Mumbai",
    "to": "Pandharpur",
    "name": "Mumbai to Pandharpur"
  },
  "mumbai_to_karad": {
    "distance": 315,
    "from": "Mumbai",
    "to": "Karad",
    "name": "Mumbai to Karad"
  },
  "mumbai_to_goa": {
    "distance": 580,
    "from": "Mumbai",
    "to": "Goa",
    "name": "Mumbai to Goa"
  },
  "mumbai_to_malvan": {
    "distance": 510,
    "from": "Mumbai",
    "to": "Malvan",
    "name": "Mumbai to Malvan"
  },
  "mumbai_to_alibag": {
    "distance": 95,
    "from": "Mumbai",
    "to": "Alibag",
    "name": "Mumbai to Alibag"
  },
  "mumbai_to_shirdi": {
    "distance": 240,
    "from": "Mumbai",
    "to": "Shirdi",
    "name": "Mumbai to Shirdi"
  },
  "mumbai_to_mahabaleshwar": {
    "distance": 260,
    "from": "Mumbai",
    "to": "Mahabaleshwar",
    "name": "Mumbai to Mahabaleshwar"
  },
  "navi-mumbai_to_guhagar": {
    "distance": 265,
    "from": "Navi Mumbai",
    "to": "Guhagar",
    "name": "Navi Mumbai to Guhagar"
  },
  "navi-mumbai_to_chiplun": {
    "distance": 230,
    "from": "Navi Mumbai",
    "to": "Chiplun",
    "name": "Navi Mumbai to Chiplun"
  },
  "navi-mumbai_to_ratnagiri": {
    "distance": 325,
    "from": "Navi Mumbai",
    "to": "Ratnagiri",
    "name": "Navi Mumbai to Ratnagiri"
  },
  "navi-mumbai_to_mumbai": {
    "distance": 35,
    "from": "Navi Mumbai",
    "to": "Mumbai",
    "name": "Navi Mumbai to Mumbai"
  },
  "navi-mumbai_to_thane": {
    "distance": 28,
    "from": "Navi Mumbai",
    "to": "Thane",
    "name": "Navi Mumbai to Thane"
  },
  "navi-mumbai_to_pune": {
    "distance": 130,
    "from": "Navi Mumbai",
    "to": "Pune",
    "name": "Navi Mumbai to Pune"
  },
  "navi-mumbai_to_mumbai-airport-bom": {
    "distance": 30,
    "from": "Navi Mumbai",
    "to": "Mumbai Airport",
    "name": "Navi Mumbai to Mumbai Airport"
  },
  "navi-mumbai_to_pune-airport-pnq": {
    "distance": 135,
    "from": "Navi Mumbai",
    "to": "Pune Airport",
    "name": "Navi Mumbai to Pune Airport"
  },
  "navi-mumbai_to_navi-mumbai-airport-nmia": {
    "distance": 15,
    "from": "Navi Mumbai",
    "to": "Navi Mumbai Airport",
    "name": "Navi Mumbai to Navi Mumbai Airport"
  },
  "navi-mumbai_to_satara": {
    "distance": 240,
    "from": "Navi Mumbai",
    "to": "Satara",
    "name": "Navi Mumbai to Satara"
  },
  "navi-mumbai_to_kolhapur": {
    "distance": 360,
    "from": "Navi Mumbai",
    "to": "Kolhapur",
    "name": "Navi Mumbai to Kolhapur"
  },
  "navi-mumbai_to_pandharpur": {
    "distance": 340,
    "from": "Navi Mumbai",
    "to": "Pandharpur",
    "name": "Navi Mumbai to Pandharpur"
  },
  "navi-mumbai_to_karad": {
    "distance": 295,
    "from": "Navi Mumbai",
    "to": "Karad",
    "name": "Navi Mumbai to Karad"
  },
  "navi-mumbai_to_goa": {
    "distance": 560,
    "from": "Navi Mumbai",
    "to": "Goa",
    "name": "Navi Mumbai to Goa"
  },
  "navi-mumbai_to_malvan": {
    "distance": 490,
    "from": "Navi Mumbai",
    "to": "Malvan",
    "name": "Navi Mumbai to Malvan"
  },
  "navi-mumbai_to_alibag": {
    "distance": 75,
    "from": "Navi Mumbai",
    "to": "Alibag",
    "name": "Navi Mumbai to Alibag"
  },
  "navi-mumbai_to_shirdi": {
    "distance": 220,
    "from": "Navi Mumbai",
    "to": "Shirdi",
    "name": "Navi Mumbai to Shirdi"
  },
  "navi-mumbai_to_mahabaleshwar": {
    "distance": 235,
    "from": "Navi Mumbai",
    "to": "Mahabaleshwar",
    "name": "Navi Mumbai to Mahabaleshwar"
  },
  "thane_to_guhagar": {
    "distance": 295,
    "from": "Thane",
    "to": "Guhagar",
    "name": "Thane to Guhagar"
  },
  "thane_to_chiplun": {
    "distance": 260,
    "from": "Thane",
    "to": "Chiplun",
    "name": "Thane to Chiplun"
  },
  "thane_to_ratnagiri": {
    "distance": 355,
    "from": "Thane",
    "to": "Ratnagiri",
    "name": "Thane to Ratnagiri"
  },
  "thane_to_mumbai": {
    "distance": 30,
    "from": "Thane",
    "to": "Mumbai",
    "name": "Thane to Mumbai"
  },
  "thane_to_navi-mumbai": {
    "distance": 28,
    "from": "Thane",
    "to": "Navi Mumbai",
    "name": "Thane to Navi Mumbai"
  },
  "thane_to_pune": {
    "distance": 155,
    "from": "Thane",
    "to": "Pune",
    "name": "Thane to Pune"
  },
  "thane_to_mumbai-airport-bom": {
    "distance": 25,
    "from": "Thane",
    "to": "Mumbai Airport",
    "name": "Thane to Mumbai Airport"
  },
  "thane_to_pune-airport-pnq": {
    "distance": 160,
    "from": "Thane",
    "to": "Pune Airport",
    "name": "Thane to Pune Airport"
  },
  "thane_to_navi-mumbai-airport-nmia": {
    "distance": 35,
    "from": "Thane",
    "to": "Navi Mumbai Airport",
    "name": "Thane to Navi Mumbai Airport"
  },
  "thane_to_satara": {
    "distance": 275,
    "from": "Thane",
    "to": "Satara",
    "name": "Thane to Satara"
  },
  "thane_to_kolhapur": {
    "distance": 395,
    "from": "Thane",
    "to": "Kolhapur",
    "name": "Thane to Kolhapur"
  },
  "thane_to_pandharpur": {
    "distance": 375,
    "from": "Thane",
    "to": "Pandharpur",
    "name": "Thane to Pandharpur"
  },
  "thane_to_karad": {
    "distance": 330,
    "from": "Thane",
    "to": "Karad",
    "name": "Thane to Karad"
  },
  "thane_to_goa": {
    "distance": 595,
    "from": "Thane",
    "to": "Goa",
    "name": "Thane to Goa"
  },
  "thane_to_malvan": {
    "distance": 525,
    "from": "Thane",
    "to": "Malvan",
    "name": "Thane to Malvan"
  },
  "thane_to_alibag": {
    "distance": 105,
    "from": "Thane",
    "to": "Alibag",
    "name": "Thane to Alibag"
  },
  "thane_to_shirdi": {
    "distance": 225,
    "from": "Thane",
    "to": "Shirdi",
    "name": "Thane to Shirdi"
  },
  "thane_to_mahabaleshwar": {
    "distance": 270,
    "from": "Thane",
    "to": "Mahabaleshwar",
    "name": "Thane to Mahabaleshwar"
  },
  "pune_to_guhagar": {
    "distance": 240,
    "from": "Pune",
    "to": "Guhagar",
    "name": "Pune to Guhagar"
  },
  "pune_to_chiplun": {
    "distance": 200,
    "from": "Pune",
    "to": "Chiplun",
    "name": "Pune to Chiplun"
  },
  "pune_to_ratnagiri": {
    "distance": 305,
    "from": "Pune",
    "to": "Ratnagiri",
    "name": "Pune to Ratnagiri"
  },
  "pune_to_mumbai": {
    "distance": 150,
    "from": "Pune",
    "to": "Mumbai",
    "name": "Pune to Mumbai"
  },
  "pune_to_navi-mumbai": {
    "distance": 130,
    "from": "Pune",
    "to": "Navi Mumbai",
    "name": "Pune to Navi Mumbai"
  },
  "pune_to_thane": {
    "distance": 155,
    "from": "Pune",
    "to": "Thane",
    "name": "Pune to Thane"
  },
  "pune_to_mumbai-airport-bom": {
    "distance": 160,
    "from": "Pune",
    "to": "Mumbai Airport",
    "name": "Pune to Mumbai Airport"
  },
  "pune_to_pune-airport-pnq": {
    "distance": 18,
    "from": "Pune",
    "to": "Pune Airport",
    "name": "Pune to Pune Airport"
  },
  "pune_to_navi-mumbai-airport-nmia": {
    "distance": 135,
    "from": "Pune",
    "to": "Navi Mumbai Airport",
    "name": "Pune to Navi Mumbai Airport"
  },
  "pune_to_satara": {
    "distance": 110,
    "from": "Pune",
    "to": "Satara",
    "name": "Pune to Satara"
  },
  "pune_to_kolhapur": {
    "distance": 235,
    "from": "Pune",
    "to": "Kolhapur",
    "name": "Pune to Kolhapur"
  },
  "pune_to_pandharpur": {
    "distance": 215,
    "from": "Pune",
    "to": "Pandharpur",
    "name": "Pune to Pandharpur"
  },
  "pune_to_karad": {
    "distance": 165,
    "from": "Pune",
    "to": "Karad",
    "name": "Pune to Karad"
  },
  "pune_to_goa": {
    "distance": 440,
    "from": "Pune",
    "to": "Goa",
    "name": "Pune to Goa"
  },
  "pune_to_malvan": {
    "distance": 385,
    "from": "Pune",
    "to": "Malvan",
    "name": "Pune to Malvan"
  },
  "pune_to_alibag": {
    "distance": 140,
    "from": "Pune",
    "to": "Alibag",
    "name": "Pune to Alibag"
  },
  "pune_to_shirdi": {
    "distance": 190,
    "from": "Pune",
    "to": "Shirdi",
    "name": "Pune to Shirdi"
  },
  "pune_to_mahabaleshwar": {
    "distance": 120,
    "from": "Pune",
    "to": "Mahabaleshwar",
    "name": "Pune to Mahabaleshwar"
  },
  "mumbai-airport-bom_to_guhagar": {
    "distance": 285,
    "from": "Mumbai Airport",
    "to": "Guhagar",
    "name": "Mumbai Airport to Guhagar"
  },
  "mumbai-airport-bom_to_chiplun": {
    "distance": 250,
    "from": "Mumbai Airport",
    "to": "Chiplun",
    "name": "Mumbai Airport to Chiplun"
  },
  "mumbai-airport-bom_to_ratnagiri": {
    "distance": 345,
    "from": "Mumbai Airport",
    "to": "Ratnagiri",
    "name": "Mumbai Airport to Ratnagiri"
  },
  "mumbai-airport-bom_to_mumbai": {
    "distance": 20,
    "from": "Mumbai Airport",
    "to": "Mumbai",
    "name": "Mumbai Airport to Mumbai"
  },
  "mumbai-airport-bom_to_navi-mumbai": {
    "distance": 35,
    "from": "Mumbai Airport",
    "to": "Navi Mumbai",
    "name": "Mumbai Airport to Navi Mumbai"
  },
  "mumbai-airport-bom_to_thane": {
    "distance": 28,
    "from": "Mumbai Airport",
    "to": "Thane",
    "name": "Mumbai Airport to Thane"
  },
  "mumbai-airport-bom_to_pune": {
    "distance": 160,
    "from": "Mumbai Airport",
    "to": "Pune",
    "name": "Mumbai Airport to Pune"
  },
  "mumbai-airport-bom_to_pune-airport-pnq": {
    "distance": 165,
    "from": "Mumbai Airport",
    "to": "Pune Airport",
    "name": "Mumbai Airport to Pune Airport"
  },
  "mumbai-airport-bom_to_navi-mumbai-airport-nmia": {
    "distance": 35,
    "from": "Mumbai Airport",
    "to": "Navi Mumbai Airport",
    "name": "Mumbai Airport to Navi Mumbai Airport"
  },
  "mumbai-airport-bom_to_satara": {
    "distance": 265,
    "from": "Mumbai Airport",
    "to": "Satara",
    "name": "Mumbai Airport to Satara"
  },
  "mumbai-airport-bom_to_kolhapur": {
    "distance": 385,
    "from": "Mumbai Airport",
    "to": "Kolhapur",
    "name": "Mumbai Airport to Kolhapur"
  },
  "mumbai-airport-bom_to_pandharpur": {
    "distance": 365,
    "from": "Mumbai Airport",
    "to": "Pandharpur",
    "name": "Mumbai Airport to Pandharpur"
  },
  "mumbai-airport-bom_to_karad": {
    "distance": 320,
    "from": "Mumbai Airport",
    "to": "Karad",
    "name": "Mumbai Airport to Karad"
  },
  "mumbai-airport-bom_to_goa": {
    "distance": 585,
    "from": "Mumbai Airport",
    "to": "Goa",
    "name": "Mumbai Airport to Goa"
  },
  "mumbai-airport-bom_to_malvan": {
    "distance": 515,
    "from": "Mumbai Airport",
    "to": "Malvan",
    "name": "Mumbai Airport to Malvan"
  },
  "mumbai-airport-bom_to_alibag": {
    "distance": 100,
    "from": "Mumbai Airport",
    "to": "Alibag",
    "name": "Mumbai Airport to Alibag"
  },
  "mumbai-airport-bom_to_shirdi": {
    "distance": 240,
    "from": "Mumbai Airport",
    "to": "Shirdi",
    "name": "Mumbai Airport to Shirdi"
  },
  "mumbai-airport-bom_to_mahabaleshwar": {
    "distance": 265,
    "from": "Mumbai Airport",
    "to": "Mahabaleshwar",
    "name": "Mumbai Airport to Mahabaleshwar"
  },
  "pune-airport-pnq_to_guhagar": {
    "distance": 245,
    "from": "Pune Airport",
    "to": "Guhagar",
    "name": "Pune Airport to Guhagar"
  },
  "pune-airport-pnq_to_chiplun": {
    "distance": 205,
    "from": "Pune Airport",
    "to": "Chiplun",
    "name": "Pune Airport to Chiplun"
  },
  "pune-airport-pnq_to_ratnagiri": {
    "distance": 310,
    "from": "Pune Airport",
    "to": "Ratnagiri",
    "name": "Pune Airport to Ratnagiri"
  },
  "pune-airport-pnq_to_mumbai": {
    "distance": 160,
    "from": "Pune Airport",
    "to": "Mumbai",
    "name": "Pune Airport to Mumbai"
  },
  "pune-airport-pnq_to_navi-mumbai": {
    "distance": 135,
    "from": "Pune Airport",
    "to": "Navi Mumbai",
    "name": "Pune Airport to Navi Mumbai"
  },
  "pune-airport-pnq_to_thane": {
    "distance": 160,
    "from": "Pune Airport",
    "to": "Thane",
    "name": "Pune Airport to Thane"
  },
  "pune-airport-pnq_to_pune": {
    "distance": 18,
    "from": "Pune Airport",
    "to": "Pune",
    "name": "Pune Airport to Pune"
  },
  "pune-airport-pnq_to_mumbai-airport-bom": {
    "distance": 165,
    "from": "Pune Airport",
    "to": "Mumbai Airport",
    "name": "Pune Airport to Mumbai Airport"
  },
  "pune-airport-pnq_to_navi-mumbai-airport-nmia": {
    "distance": 140,
    "from": "Pune Airport",
    "to": "Navi Mumbai Airport",
    "name": "Pune Airport to Navi Mumbai Airport"
  },
  "pune-airport-pnq_to_satara": {
    "distance": 115,
    "from": "Pune Airport",
    "to": "Satara",
    "name": "Pune Airport to Satara"
  },
  "pune-airport-pnq_to_kolhapur": {
    "distance": 240,
    "from": "Pune Airport",
    "to": "Kolhapur",
    "name": "Pune Airport to Kolhapur"
  },
  "pune-airport-pnq_to_pandharpur": {
    "distance": 220,
    "from": "Pune Airport",
    "to": "Pandharpur",
    "name": "Pune Airport to Pandharpur"
  },
  "pune-airport-pnq_to_karad": {
    "distance": 170,
    "from": "Pune Airport",
    "to": "Karad",
    "name": "Pune Airport to Karad"
  },
  "pune-airport-pnq_to_goa": {
    "distance": 445,
    "from": "Pune Airport",
    "to": "Goa",
    "name": "Pune Airport to Goa"
  },
  "pune-airport-pnq_to_malvan": {
    "distance": 390,
    "from": "Pune Airport",
    "to": "Malvan",
    "name": "Pune Airport to Malvan"
  },
  "pune-airport-pnq_to_alibag": {
    "distance": 145,
    "from": "Pune Airport",
    "to": "Alibag",
    "name": "Pune Airport to Alibag"
  },
  "pune-airport-pnq_to_shirdi": {
    "distance": 190,
    "from": "Pune Airport",
    "to": "Shirdi",
    "name": "Pune Airport to Shirdi"
  },
  "pune-airport-pnq_to_mahabaleshwar": {
    "distance": 125,
    "from": "Pune Airport",
    "to": "Mahabaleshwar",
    "name": "Pune Airport to Mahabaleshwar"
  },
  "navi-mumbai-airport-nmia_to_guhagar": {
    "distance": 260,
    "from": "Navi Mumbai Airport",
    "to": "Guhagar",
    "name": "Navi Mumbai Airport to Guhagar"
  },
  "navi-mumbai-airport-nmia_to_chiplun": {
    "distance": 225,
    "from": "Navi Mumbai Airport",
    "to": "Chiplun",
    "name": "Navi Mumbai Airport to Chiplun"
  },
  "navi-mumbai-airport-nmia_to_ratnagiri": {
    "distance": 320,
    "from": "Navi Mumbai Airport",
    "to": "Ratnagiri",
    "name": "Navi Mumbai Airport to Ratnagiri"
  },
  "navi-mumbai-airport-nmia_to_mumbai": {
    "distance": 35,
    "from": "Navi Mumbai Airport",
    "to": "Mumbai",
    "name": "Navi Mumbai Airport to Mumbai"
  },
  "navi-mumbai-airport-nmia_to_navi-mumbai": {
    "distance": 15,
    "from": "Navi Mumbai Airport",
    "to": "Navi Mumbai",
    "name": "Navi Mumbai Airport to Navi Mumbai"
  },
  "navi-mumbai-airport-nmia_to_thane": {
    "distance": 35,
    "from": "Navi Mumbai Airport",
    "to": "Thane",
    "name": "Navi Mumbai Airport to Thane"
  },
  "navi-mumbai-airport-nmia_to_pune": {
    "distance": 135,
    "from": "Navi Mumbai Airport",
    "to": "Pune",
    "name": "Navi Mumbai Airport to Pune"
  },
  "navi-mumbai-airport-nmia_to_mumbai-airport-bom": {
    "distance": 35,
    "from": "Navi Mumbai Airport",
    "to": "Mumbai Airport",
    "name": "Navi Mumbai Airport to Mumbai Airport"
  },
  "navi-mumbai-airport-nmia_to_pune-airport-pnq": {
    "distance": 140,
    "from": "Navi Mumbai Airport",
    "to": "Pune Airport",
    "name": "Navi Mumbai Airport to Pune Airport"
  },
  "navi-mumbai-airport-nmia_to_satara": {
    "distance": 240,
    "from": "Navi Mumbai Airport",
    "to": "Satara",
    "name": "Navi Mumbai Airport to Satara"
  },
  "navi-mumbai-airport-nmia_to_kolhapur": {
    "distance": 360,
    "from": "Navi Mumbai Airport",
    "to": "Kolhapur",
    "name": "Navi Mumbai Airport to Kolhapur"
  },
  "navi-mumbai-airport-nmia_to_pandharpur": {
    "distance": 340,
    "from": "Navi Mumbai Airport",
    "to": "Pandharpur",
    "name": "Navi Mumbai Airport to Pandharpur"
  },
  "navi-mumbai-airport-nmia_to_karad": {
    "distance": 295,
    "from": "Navi Mumbai Airport",
    "to": "Karad",
    "name": "Navi Mumbai Airport to Karad"
  },
  "navi-mumbai-airport-nmia_to_goa": {
    "distance": 560,
    "from": "Navi Mumbai Airport",
    "to": "Goa",
    "name": "Navi Mumbai Airport to Goa"
  },
  "navi-mumbai-airport-nmia_to_malvan": {
    "distance": 490,
    "from": "Navi Mumbai Airport",
    "to": "Malvan",
    "name": "Navi Mumbai Airport to Malvan"
  },
  "navi-mumbai-airport-nmia_to_alibag": {
    "distance": 75,
    "from": "Navi Mumbai Airport",
    "to": "Alibag",
    "name": "Navi Mumbai Airport to Alibag"
  },
  "navi-mumbai-airport-nmia_to_shirdi": {
    "distance": 220,
    "from": "Navi Mumbai Airport",
    "to": "Shirdi",
    "name": "Navi Mumbai Airport to Shirdi"
  },
  "navi-mumbai-airport-nmia_to_mahabaleshwar": {
    "distance": 235,
    "from": "Navi Mumbai Airport",
    "to": "Mahabaleshwar",
    "name": "Navi Mumbai Airport to Mahabaleshwar"
  }
};


// Function to generate clean printable / PDF estimate receipt
function printEstimateReceipt(estimateData) {
  const printWindow = window.open('', '_blank', 'width=800,height=900');
  if (!printWindow) {
    alert('Please allow popups in your browser to print / save your PDF summary.');
    return;
  }

  const dateStr = estimateData.date ? estimateData.date : new Date().toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric'
  });
  const receiptNo = 'STT-' + Math.floor(100000 + Math.random() * 900000);

  const receiptHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Swami Tours & Travels - Booking Quote ${receiptNo}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
    body { background: #f8fafc; color: #0f172a; padding: 40px 20px; }
    .receipt-card { max-width: 680px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 36px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border: 1px solid #e2e8f0; }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #e2e8f0; padding-bottom: 24px; margin-bottom: 24px; }
    .brand-title { font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; }
    .brand-sub { font-size: 13px; color: #64748b; margin-top: 4px; font-weight: 500; }
    .quote-badge { background: #eff6ff; color: #2563eb; font-weight: 700; font-size: 12px; padding: 6px 14px; border-radius: 9999px; border: 1px solid #bfdbfe; text-align: right; }
    .section-title { font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #64748b; font-weight: 700; margin-bottom: 12px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 28px; background: #f8fafc; padding: 18px; border-radius: 8px; border: 1px solid #edf2f7; }
    .detail-item { font-size: 14px; }
    .detail-label { color: #64748b; font-size: 12px; margin-bottom: 4px; }
    .detail-val { font-weight: 600; color: #1e293b; }
    .fare-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .fare-table th { text-align: left; padding: 12px 14px; background: #f1f5f9; font-size: 12px; color: #475569; text-transform: uppercase; font-weight: 600; border-radius: 4px; }
    .fare-table td { padding: 14px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
    .fare-table td:last-child { text-align: right; font-weight: 600; }
    .total-row { background: #0f172a; color: #ffffff; }
    .total-row td { padding: 16px 14px; font-size: 18px; font-weight: 800; color: #ffffff; border: none; border-radius: 8px; }
    .total-row td:last-child { color: #38bdf8; font-size: 20px; }
    .note-box { font-size: 12px; color: #64748b; line-height: 1.6; background: #fffbeb; border: 1px solid #fef3c7; padding: 14px; border-radius: 6px; margin-bottom: 28px; }
    .footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #e2e8f0; padding-top: 20px; font-size: 12px; color: #64748b; }
    .contact-info { font-weight: 600; color: #0f172a; }
    .no-print { margin-top: 24px; text-align: center; }
    .print-btn { background: #2563eb; color: #ffffff; border: none; padding: 12px 28px; font-size: 14px; font-weight: 600; border-radius: 6px; cursor: pointer; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .receipt-card { box-shadow: none; border: none; padding: 0; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="receipt-card">
    <div class="header">
      <div>
        <div class="brand-title">SWAMI TOURS & TRAVELS</div>
        <div class="brand-sub">Guhagar • Chiplun • Ratnagiri • Mumbai • Pune</div>
        <div class="brand-sub">Phone: +91 70838 08483</div>
      </div>
      <div>
        <div class="quote-badge">ESTIMATE QUOTE</div>
        <div style="font-size: 12px; color: #64748b; margin-top: 6px; text-align: right;">Ref: ${receiptNo}</div>
        <div style="font-size: 12px; color: #64748b; text-align: right;">Date: ${dateStr}</div>
      </div>
    </div>

    <div class="section-title">Trip & Vehicle Details</div>
    <div class="details-grid">
      <div class="detail-item">
        <div class="detail-label">Route</div>
        <div class="detail-val">${estimateData.route}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Trip Type</div>
        <div class="detail-val">${estimateData.tripType}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Vehicle Selected</div>
        <div class="detail-val">${estimateData.vehicleName}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Per KM Rate</div>
        <div class="detail-val">${estimateData.rate}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Total Distance</div>
        <div class="detail-val">${estimateData.distance}</div>
      </div>
      <div class="detail-item">
        <div class="detail-label">Billable Distance</div>
        <div class="detail-val">${estimateData.billableKm}</div>
      </div>
    </div>

    <div class="section-title">Fare Breakdown</div>
    <table class="fare-table">
      <thead>
        <tr>
          <th>Description</th>
          <th style="text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Base Running Fare (${estimateData.billableKm} × ${estimateData.rate})</td>
          <td>${estimateData.baseFare}</td>
        </tr>
        <tr>
          <td>Driver Allowance (DA Distance Slab)</td>
          <td>${estimateData.da}</td>
        </tr>
        <tr class="total-row">
          <td>Estimated Total</td>
          <td>${estimateData.total}</td>
        </tr>
      </tbody>
    </table>

    <div class="note-box">
      <strong>Important Notes:</strong><br>
      • Driver Allowance (DA) slab: Up to 500 km = ₹1,500 | Above 500 km = ₹2,000.<br>
      • Tolls, state permit taxes, and parking fees are charged actuals as per journey receipts.<br>
      • AC running throughout journey. Clean, verified vehicles with experienced Konkan drivers.
    </div>

    <div class="footer">
      <div>Thank you for choosing Swami Tours & Travels!</div>
      <div class="contact-info">Call/WhatsApp: +91 70838 08483</div>
    </div>

    <div class="no-print">
      <button class="print-btn" onclick="window.print()"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;margin-right:6px;"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>Print / Save as PDF</button>
      <div style="font-size: 12px; color: #64748b; margin-top: 8px;">Select "Save as PDF" destination in your print dialog.</div>
    </div>
  </div>

  <script>
    window.addEventListener('load', () => {
      setTimeout(() => { window.print(); }, 400);
    });
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(receiptHtml);
  printWindow.document.close();
}

function initFareEstimator() {
  const vehicleSelect = document.getElementById('estimator-vehicle');
  const routeSelect = document.getElementById('estimator-route');
  const tripTypeRadios = document.querySelectorAll('input[name="estimator-trip-type"]');
  const distEl = document.getElementById('est-distance');
  const rateEl = document.getElementById('est-rate');
  const baseEl = document.getElementById('est-base');
  const daEl = document.getElementById('est-da');
  const totalEl = document.getElementById('est-total');
  const bookBtn = document.getElementById('est-book-btn');
  const whatsappBtn = document.getElementById('est-whatsapp-btn');
  const pdfBtn = document.getElementById('est-pdf-btn');

  if (!vehicleSelect || !routeSelect || !totalEl) return;

  let currentEstimateData = null;

  function recalculate() {
    const vehicleKey = vehicleSelect.value || 'black-ertiga';
    const routeKey = routeSelect.value || 'guhagar-mumbai';
    
    let tripType = 'round-trip';
    tripTypeRadios.forEach(r => {
      if (r.checked) tripType = r.value;
    });

    const vehicle = FLEET_RATES[vehicleKey] || FLEET_RATES['black-ertiga'];
    const route = POPULAR_ROUTES[routeKey] || POPULAR_ROUTES['guhagar-mumbai'];

    let distance = route.distance;
    if (tripType === 'round-trip') {
      distance = distance * 2;
    }

    // Driver allowance slab:
    // Up to 500 km: ₹1,500
    // Above 500 km: ₹2,000
    // Applicable for both Round Trip & One-Way Drop
    let da = (distance > 500) ? 2000 : 1500;

    const billableKm = Math.max(distance, tripType === 'round-trip' ? vehicle.minKmPerDay : Math.round(vehicle.minKmPerDay * 0.7));
    const baseFare = billableKm * vehicle.perKm;
    const estimatedTotal = baseFare + da;

    if (distEl) distEl.textContent = `${distance} km (Billable: ${billableKm} km)`;
    if (rateEl) rateEl.textContent = `₹${vehicle.perKm}/km`;
    if (baseEl) baseEl.textContent = `₹${baseFare.toLocaleString('en-IN')}`;
    if (daEl) daEl.textContent = `₹${da.toLocaleString('en-IN')} (Slab)`;
    totalEl.textContent = `₹${estimatedTotal.toLocaleString('en-IN')}*`;

    currentEstimateData = {
      route: route.name,
      tripType: tripType === 'round-trip' ? 'Round Trip' : 'One Way Drop',
      vehicleName: vehicle.name,
      rate: `₹${vehicle.perKm}/km`,
      distance: `${distance} km`,
      billableKm: `${billableKm} km`,
      baseFare: `₹${baseFare.toLocaleString('en-IN')}`,
      da: `₹${da.toLocaleString('en-IN')}`,
      total: `₹${estimatedTotal.toLocaleString('en-IN')}`
    };

    // Update WhatsApp action link
    if (whatsappBtn) {
      const msg = encodeURIComponent(
        `Hello Swami Tours & Travels, I checked the Fare Estimator:

` +
        `• Vehicle: ${vehicle.name}
` +
        `• Route: ${route.name}
` +
        `• Trip Type: ${tripType === 'round-trip' ? 'Round Trip' : 'One Way Drop'}
` +
        `• Approx Distance: ${distance} km
` +
        `• Driver Allowance: ₹${da.toLocaleString('en-IN')}
` +
        `• Estimated Fare: ₹${estimatedTotal.toLocaleString('en-IN')}

` +
        `Please confirm vehicle availability and book this trip for me.`
      );
      whatsappBtn.href = `https://wa.me/917083808483?text=${msg}`;
    }
    // Scroll & Pre-fill booking form
    if (bookBtn) {
      bookBtn.onclick = () => {
        const bookFormVehicle = document.getElementById('booking-vehicle');
        const bookFormPickup = document.getElementById('booking-pickup');
        const bookFormDrop = document.getElementById('booking-drop');
        const bookFormTripType = document.getElementById('booking-trip-type');

        if (bookFormVehicle) bookFormVehicle.value = vehicleKey;
        if (bookFormTripType) bookFormTripType.value = tripType;
        if (bookFormPickup && route) {
          bookFormPickup.value = route.from;
          if (bookFormDrop) {
            bookFormDrop.value = route.to;
          }
        }

        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }
  }

  vehicleSelect.addEventListener('change', recalculate);
  routeSelect.addEventListener('change', recalculate);
  tripTypeRadios.forEach(r => r.addEventListener('change', recalculate));

  if (pdfBtn) {
    pdfBtn.addEventListener('click', () => {
      if (currentEstimateData) {
        printEstimateReceipt(currentEstimateData);
      }
    });
  }

  recalculate();
}

// -----------------------------------------------------------------------------
// 3. Interactive Gallery & Lightbox
// -----------------------------------------------------------------------------
function initGallery() {
  const filterBtns = document.querySelectorAll('.gallery-filter-tabs .filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
  const lightbox = document.getElementById('lightbox-modal');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCap = document.getElementById('lightbox-caption');
  const lightboxClose = document.getElementById('lightbox-close');

  // Filter tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const cat = item.getAttribute('data-category') || '';
        if (filter === 'all' || cat.includes(filter)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });

  // Lightbox
  if (!lightbox || !lightboxImg || !lightboxClose) return;

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const caption = item.querySelector('.gallery-caption');
      if (img) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || 'Gallery photo';
        if (lightboxCap) {
          lightboxCap.textContent = caption ? caption.textContent : img.alt;
        }
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// -----------------------------------------------------------------------------
// 4. Accessible FAQ Accordion
// -----------------------------------------------------------------------------
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all others for single open state
      faqItems.forEach(other => {
        other.classList.remove('active');
        const t = other.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

// -----------------------------------------------------------------------------
// 5. Booking Form & Instant WhatsApp Bridge
// -----------------------------------------------------------------------------
function initBookingForm() {
  const form = document.getElementById('main-booking-form');
  const whatsappBtn = document.getElementById('btn-book-whatsapp');

  if (!form) return;

  // WhatsApp quick bridge
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', (e) => {
      e.preventDefault();

      const name = (document.getElementById('booking-name')?.value || '').trim();
      const phone = (document.getElementById('booking-phone')?.value || '').trim();
      const vehicle = document.getElementById('booking-vehicle')?.value || 'Not selected';
      const tripType = document.getElementById('booking-trip-type')?.value || 'Outstation';
      const pickup = (document.getElementById('booking-pickup')?.value || '').trim();
      const drop = (document.getElementById('booking-drop')?.value || '').trim();
      const date = document.getElementById('booking-date')?.value || 'As soon as possible';
      const passengers = document.getElementById('booking-passengers')?.value || '1';
      const notes = (document.getElementById('booking-notes')?.value || '').trim();

      const vehicleName = FLEET_RATES[vehicle]?.name || vehicle;

      const text = encodeURIComponent(
        `Hello Swami Tours & Travels! I would like to book a trip:\n\n` +
        `• Name: ${name || 'Inquirer'}\n` +
        `• Contact: ${phone || 'Available on WhatsApp'}\n` +
        `• Vehicle: ${vehicleName}\n` +
        `• Trip Type: ${tripType}\n` +
        `• Pickup: ${pickup || 'To be specified'}\n` +
        `• Destination: ${drop || 'To be specified'}\n` +
        `• Travel Date: ${date}\n` +
        `• Passengers: ${passengers}\n` +
        (notes ? `• Special Notes: ${notes}\n` : '') +
        `\nPlease check schedule and share quote.`
      );

      window.open(`https://wa.me/917083808483?text=${text}`, '_blank');
    });
  }

  // Handle standard Netlify form submit
  form.addEventListener('submit', (e) => {
    // If Netlify is hosting, standard POST submission works.
    // In local dev preview, provide seamless feedback redirect to thank-you.html
    const name = (document.getElementById('booking-name')?.value || '').trim();
    const phone = (document.getElementById('booking-phone')?.value || '').trim();

    if (!name || !phone) {
      alert('Please enter your Name and Phone Number to confirm booking.');
      e.preventDefault();
      return;
    }

    // Set fallback redirect if running in static Vite preview
    if (!window.location.host.includes('netlify.app')) {
      // Let standard action="/thank-you.html" execute smoothly
    }
  });
}

// -----------------------------------------------------------------------------
// 6. Scroll Spy for Header Links
// -----------------------------------------------------------------------------
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.site-nav .nav-link');

  if (!sections.length || !navLinks.length) return;

  const headerEl = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollY = window.pageYOffset;
    if (headerEl) {
      if (scrollY > 40) {
        headerEl.classList.add('scrolled');
      } else {
        headerEl.classList.remove('scrolled');
      }
    }

    if (scrollY < 200) {
      currentId = 'home';
    } else {
      sections.forEach(section => {
        const top = section.offsetTop - 140;
        const height = section.offsetHeight;
        if (scrollY >= top && scrollY < top + height) {
          currentId = section.getAttribute('id');
        }
      });
    }

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}


// -----------------------------------------------------------------------------
// 7. Dynamic Reviews & Guest Feedback System (Show 3 latest + View More toggle)
// -----------------------------------------------------------------------------
const DEFAULT_TESTIMONIALS = [
  {
    name: "Sachin Patil",
    rating: 5,
    trip: "Family Tour · Ashtavinayak Circuit",
    vehicle: "20-Seater Force Tempo Traveller",
    comment: "We booked the 20-seater Force Tempo Traveller for our family Ashtavinayak yatra from Pune. The vehicle was spotless, pushback seats were exceptionally comfortable for elderly parents, and the chauffeur Rajesh was polite and punctual."
  },
  {
    name: "Anand Kulkarni",
    rating: 5,
    trip: "Airport Drop · Pune to Mumbai CSMIA",
    vehicle: "Black Ertiga (6+1)",
    comment: "The Black Ertiga we hired for our Pune to Mumbai Airport run was in showroom condition. Chilled AC, smooth driving through the ghats, and zero toll confusion. Truly transparent billing and highly recommended!"
  },
  {
    name: "Priya Deshmukh",
    rating: 5,
    trip: "Corporate Offsite · Pune to Mahabaleshwar",
    vehicle: "26-Seater Force Tempo Traveller",
    comment: "Booked the 26-seater Tempo Traveller for a 3-day corporate offsite to Mahabaleshwar. Ample space for 24 colleagues with heavy bags, great sound system, and smooth driving on steep mountain turns."
  },
  {
    name: "Ramesh Tawade",
    rating: 5,
    trip: "Guhagar to Mumbai Family Trip",
    vehicle: "White WagonR (4+1)",
    comment: "Our Guhagar to Mumbai journey was truly exceptional. The driver was very calm and drove safely across the ghats. Chilled AC and transparent billing."
  },
  {
    name: "Dr. Sandeep Joshi",
    rating: 5,
    trip: "Ratnagiri to Pune Emergency Travel",
    vehicle: "Black Ertiga (6+1)",
    comment: "Had an urgent travel from Ratnagiri to Pune. Swami Tours arranged a spotless Black Ertiga within 30 minutes. Courteous chauffeur and smooth ride."
  },
  {
    name: "Meenal Shinde",
    rating: 5,
    trip: "Konkan Shringartali Sightseeing",
    vehicle: "20-Seater Tempo Traveller",
    comment: "We booked the Tempo Traveller for our 18-member family pilgrimage to Guhagar and Velneshwar. Clean vehicle, comfortable pushback seating, and highly experienced driver."
  }
];

function initFeedbackModal() {
  const container = document.getElementById('testimonials-container');
  const toggleBtn = document.getElementById('btn-toggle-reviews');
  const toggleText = document.getElementById('btn-toggle-reviews-text');
  const toggleIcon = document.getElementById('btn-toggle-reviews-icon');
  const openBtn = document.getElementById('btn-open-feedback-modal');
  const modal = document.getElementById('feedback-modal');
  const backdrop = document.getElementById('feedback-modal-backdrop');
  const closeBtn = document.getElementById('btn-close-feedback-modal');
  const form = document.getElementById('guest-feedback-form');
  const successMsg = document.getElementById('feedback-success-msg');

  if (!container) return;

  // Retrieve user submitted reviews from localStorage to persist them across refreshes
  let storedReviews = [];
  try {
    const raw = localStorage.getItem('swami_guest_reviews');
    if (raw) storedReviews = JSON.parse(raw);
  } catch (e) {
    storedReviews = [];
  }

  // All reviews array: newly submitted first, then defaults
  let allReviews = [...storedReviews, ...DEFAULT_TESTIMONIALS];
  let isExpanded = false;

  function renderReviews() {
    container.innerHTML = '';
    // Show only 3 latest unless expanded
    const reviewsToShow = isExpanded ? allReviews : allReviews.slice(0, 3);

    reviewsToShow.forEach((data, index) => {
      const card = document.createElement('div');
      card.className = 'testimonial-card';
      // If newly revealed in expanded state, add soft fade
      if (index >= 3) {
        card.style.animation = 'fadeInUp 0.3s ease-out';
      }

      const safeRating = Math.min(Math.max(data.rating || 5, 1), 5);
      const starFilled = '<svg class="icon-star filled" width="14" height="14" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:1px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      const starEmpty = '<svg class="icon-star empty" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px;margin-right:1px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>';
      const stars = starFilled.repeat(safeRating) + starEmpty.repeat(5 - safeRating);
      const initials = (data.name || 'ST')
        .split(' ')
        .map(n => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

      card.innerHTML = `
        <div class="stars-row">${stars}</div>
        <p class="testimonial-quote">"${data.comment}"</p>
        <div class="testimonial-author">
          <div class="author-initials">${initials}</div>
          <div>
            <div class="author-name">${data.name}</div>
            <div class="author-trip">${data.trip} · ${data.vehicle}</div>
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Update toggle button visibility and text
    if (toggleBtn) {
      if (allReviews.length <= 3) {
        toggleBtn.parentElement.style.display = 'none';
      } else {
        toggleBtn.parentElement.style.display = 'flex';
        if (isExpanded) {
          if (toggleText) toggleText.textContent = 'View Less';
          if (toggleIcon) toggleIcon.textContent = '▲';
        } else {
          const hiddenCount = allReviews.length - 3;
          if (toggleText) toggleText.textContent = `View More Reviews (+${hiddenCount})`;
          if (toggleIcon) toggleIcon.textContent = '▼';
        }
      }
    }
  }

  // Initial render with exactly 3 reviews
  renderReviews();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      isExpanded = !isExpanded;
      renderReviews();
      if (!isExpanded) {
        // Scroll back smoothly to section top
        const header = document.querySelector('#testimonials-container');
        if (header) {
          header.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }
    });
  }

  // Modal open / close logic
  if (modal && openBtn) {
    function openModal() {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }

    function closeModal() {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      if (successMsg) successMsg.style.display = 'none';
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (backdrop) backdrop.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = (document.getElementById('fb-name')?.value || '').trim();
        const rating = parseInt(document.getElementById('fb-rating')?.value || '5', 10);
        const vehicle = document.getElementById('fb-vehicle')?.value || 'Swami Tours Fleet';
        const trip = (document.getElementById('fb-trip')?.value || '').trim() || 'Maharashtra Tour';
        const comment = (document.getElementById('fb-comment')?.value || '').trim();

        if (!name || !comment) return;

        const newReview = { name, rating, vehicle, trip, comment };

        // Prepend to list so it becomes the latest review at position 0
        storedReviews.unshift(newReview);
        try {
          localStorage.setItem('swami_guest_reviews', JSON.stringify(storedReviews));
        } catch (err) {}

        allReviews = [newReview, ...allReviews];
        
        // Re-render: immediately shows this new review in the top 3!
        renderReviews();

        if (successMsg) successMsg.style.display = 'block';

        setTimeout(() => {
          closeModal();
          form.reset();
        }, 1200);
      });
    }
  }
}

// -----------------------------------------------------------------------------
// Approximate Distance Mapping for All Maharashtra Districts (from Pickup Hubs)
// -----------------------------------------------------------------------------
// Distance lookup matrix tailored specifically to customer selected Drop destinations
const SPECIFIC_DESTINATIONS = {
  'Guhagar': {
    'Satara': 175,
    'Kolhapur': 195,
    'Pandharpur': 310,
    'Karad': 130,
    'Goa': 360,
    'Malvan': 225,
    'Alibag': 210,
    'Shirdi': 420,
    'Mahabaleshwar': 155,
    'Guhagar': 20,
    'Chiplun': 45,
    'Ratnagiri': 85,
    'Mumbai': 280,
    'Navi Mumbai': 265,
    'Thane': 295,
    'Pune': 240,
    'Mumbai Airport': 285,
    'Pune Airport': 245,
    'Navi Mumbai Airport': 260
  },
  'Chiplun': {
    'Satara': 115,
    'Kolhapur': 190,
    'Pandharpur': 265,
    'Karad': 85,
    'Goa': 360,
    'Malvan': 235,
    'Alibag': 175,
    'Shirdi': 385,
    'Mahabaleshwar': 110,
    'Guhagar': 45,
    'Chiplun': 20,
    'Ratnagiri': 85,
    'Mumbai': 245,
    'Navi Mumbai': 230,
    'Thane': 260,
    'Pune': 200,
    'Mumbai Airport': 250,
    'Pune Airport': 205,
    'Navi Mumbai Airport': 225
  },
  'Ratnagiri': {
    'Satara': 205,
    'Kolhapur': 130,
    'Pandharpur': 260,
    'Karad': 145,
    'Goa': 260,
    'Malvan': 140,
    'Alibag': 270,
    'Shirdi': 470,
    'Mahabaleshwar': 210,
    'Guhagar': 85,
    'Chiplun': 85,
    'Ratnagiri': 20,
    'Mumbai': 340,
    'Navi Mumbai': 325,
    'Thane': 355,
    'Pune': 305,
    'Mumbai Airport': 345,
    'Pune Airport': 310,
    'Navi Mumbai Airport': 320
  },
  'Mumbai': {
    'Satara': 260,
    'Kolhapur': 380,
    'Pandharpur': 360,
    'Karad': 315,
    'Goa': 580,
    'Malvan': 510,
    'Alibag': 95,
    'Shirdi': 240,
    'Mahabaleshwar': 260,
    'Guhagar': 280,
    'Chiplun': 245,
    'Ratnagiri': 340,
    'Mumbai': 25,
    'Navi Mumbai': 35,
    'Thane': 30,
    'Pune': 150,
    'Mumbai Airport': 20,
    'Pune Airport': 160,
    'Navi Mumbai Airport': 35
  },
  'Navi Mumbai': {
    'Satara': 240,
    'Kolhapur': 360,
    'Pandharpur': 340,
    'Karad': 295,
    'Goa': 560,
    'Malvan': 490,
    'Alibag': 75,
    'Shirdi': 220,
    'Mahabaleshwar': 235,
    'Guhagar': 265,
    'Chiplun': 230,
    'Ratnagiri': 325,
    'Mumbai': 35,
    'Navi Mumbai': 20,
    'Thane': 28,
    'Pune': 130,
    'Mumbai Airport': 30,
    'Pune Airport': 135,
    'Navi Mumbai Airport': 15
  },
  'Thane': {
    'Satara': 275,
    'Kolhapur': 395,
    'Pandharpur': 375,
    'Karad': 330,
    'Goa': 595,
    'Malvan': 525,
    'Alibag': 105,
    'Shirdi': 225,
    'Mahabaleshwar': 270,
    'Guhagar': 295,
    'Chiplun': 260,
    'Ratnagiri': 355,
    'Mumbai': 30,
    'Navi Mumbai': 28,
    'Thane': 20,
    'Pune': 155,
    'Mumbai Airport': 25,
    'Pune Airport': 160,
    'Navi Mumbai Airport': 35
  },
  'Pune': {
    'Satara': 110,
    'Kolhapur': 235,
    'Pandharpur': 215,
    'Karad': 165,
    'Goa': 440,
    'Malvan': 385,
    'Alibag': 140,
    'Shirdi': 190,
    'Mahabaleshwar': 120,
    'Guhagar': 240,
    'Chiplun': 200,
    'Ratnagiri': 305,
    'Mumbai': 150,
    'Navi Mumbai': 130,
    'Thane': 155,
    'Pune': 25,
    'Mumbai Airport': 160,
    'Pune Airport': 18,
    'Navi Mumbai Airport': 135
  }
};

function getApproxDistance(pickupCity, dropDistrict) {
  const pLower = pickupCity.toLowerCase();
  const dLower = dropDistrict.toLowerCase();

  // Resolve Pickup key
  let pKey = 'Guhagar';
  if (pLower.includes('mumbai airport') || (pLower.includes('mumbai') && pLower.includes('airport'))) {
    pKey = 'Mumbai';
  } else if (pLower.includes('pune airport') || (pLower.includes('pune') && pLower.includes('airport'))) {
    pKey = 'Pune';
  } else if (pLower.includes('navi mumbai airport')) {
    pKey = 'Navi Mumbai';
  } else if (pLower.includes('navi mumbai')) {
    pKey = 'Navi Mumbai';
  } else if (pLower.includes('thane')) {
    pKey = 'Thane';
  } else if (pLower.includes('mumbai')) {
    pKey = 'Mumbai';
  } else if (pLower.includes('chiplun')) {
    pKey = 'Chiplun';
  } else if (pLower.includes('ratnagiri')) {
    pKey = 'Ratnagiri';
  } else if (pLower.includes('pune')) {
    pKey = 'Pune';
  }

  const lookup = SPECIFIC_DESTINATIONS[pKey] || SPECIFIC_DESTINATIONS['Guhagar'];

  // Check matching drop location from specific table
  for (const [targetKey, distVal] of Object.entries(lookup)) {
    if (dLower.includes(targetKey.toLowerCase())) {
      return distVal;
    }
  }

  return 250;
}

function initQuickQuotePopup() {
  const calcBtn = document.getElementById('btn-calculate-quote');
  const modal = document.getElementById('quote-result-modal');
  const backdrop = document.getElementById('quote-modal-backdrop');
  const closeBtn = document.getElementById('btn-close-quote-modal');

  const qmRoute = document.getElementById('qm-route');
  const qmTripType = document.getElementById('qm-trip-type');
  const qmDate = document.getElementById('qm-date');
  const qmVehicle = document.getElementById('qm-vehicle');
  const qmDistance = document.getElementById('qm-distance');
  const qmRate = document.getElementById('qm-rate');
  const qmBase = document.getElementById('qm-base');
  const qmDa = document.getElementById('qm-da');
  const qmTotal = document.getElementById('qm-total');
  const qmWhatsappBtn = document.getElementById('qm-whatsapp-btn');
  const qmBookFormBtn = document.getElementById('qm-book-form-btn');
  const qmPdfBtn = document.getElementById('qm-pdf-btn');

  if (!calcBtn || !modal) return;

  let currentModalEstimateData = null;

  function closeModal() {
    modal.style.display = 'none';
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function openModal() {
    modal.style.display = 'flex';
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target === backdrop) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (modal.style.display === 'flex' || modal.classList.contains('active'))) {
      closeModal();
    }
  });

  calcBtn.addEventListener('click', (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const pickup = document.getElementById('quick-pickup')?.value || 'Guhagar';
    const drop = document.getElementById('quick-drop')?.value || 'Mumbai';
    const vehicleKey = document.getElementById('quick-vehicle')?.value || 'black-ertiga';
    const dateVal = document.getElementById('quick-date')?.value || '';
    const tripType = document.getElementById('quick-type')?.value || 'round-trip';

    const vehicle = FLEET_RATES[vehicleKey] || FLEET_RATES['black-ertiga'];
    const oneWayDistance = getApproxDistance(pickup, drop);

    let totalKm = oneWayDistance;
    if (tripType === 'round-trip') {
      totalKm = oneWayDistance * 2;
    }

    // Driver allowance slab:
    // Up to 500 km: ₹1,500
    // Above 500 km: ₹2,000
    // Applicable for both Round Trip & One-Way Drop
    let da = (totalKm > 500) ? 2000 : 1500;

    const billableKm = Math.max(totalKm, tripType === 'round-trip' ? vehicle.minKmPerDay : Math.round(vehicle.minKmPerDay * 0.7));
    const baseFare = billableKm * vehicle.perKm;
    const estimatedTotal = baseFare + da;

    // Fill UI
    if (qmRoute) qmRoute.innerHTML = `${pickup} <span style="color:var(--accent-primary);margin:0 6px;">&rarr;</span> ${drop}`;
    if (qmTripType) {
      qmTripType.textContent = tripType === 'round-trip' ? 'Round Trip' : (tripType === 'one-way' ? 'One Way Drop' : 'Local Sightseeing');
    }
    if (qmDate) {
      qmDate.textContent = dateVal ? `Date: ${dateVal}` : 'Immediate / Flexible';
    }
    if (qmVehicle) qmVehicle.textContent = vehicle.name;
    if (qmDistance) qmDistance.textContent = `${totalKm} km (Billable: ${billableKm} km)`;
    if (qmRate) qmRate.textContent = `₹${vehicle.perKm}/km`;
    if (qmBase) qmBase.textContent = `₹${baseFare.toLocaleString('en-IN')}`;
    if (qmDa) qmDa.textContent = `₹${da.toLocaleString('en-IN')} (KM Slab)`;
    if (qmTotal) qmTotal.textContent = `₹${estimatedTotal.toLocaleString('en-IN')}*`;

    currentModalEstimateData = {
      route: `${pickup} → ${drop}`,
      tripType: tripType === 'round-trip' ? 'Round Trip' : 'One Way Drop',
      vehicleName: vehicle.name,
      rate: `₹${vehicle.perKm}/km`,
      distance: `${totalKm} km`,
      billableKm: `${billableKm} km`,
      baseFare: `₹${baseFare.toLocaleString('en-IN')}`,
      da: `₹${da.toLocaleString('en-IN')}`,
      total: `₹${estimatedTotal.toLocaleString('en-IN')}`,
      date: dateVal
    };

    // WhatsApp Direct Booking
    if (qmWhatsappBtn) {
      const msg = encodeURIComponent(
        `Hello Swami Tours & Travels, I calculated an Instant Quote on your website:\n\n` +
        `• Pickup: ${pickup}\n` +
        `• Drop: ${drop}\n` +
        `• Vehicle: ${vehicle.name}\n` +
        `• Trip Type: ${tripType === 'round-trip' ? 'Round Trip' : 'One Way Drop'}\n` +
        `• Travel Date: ${dateVal || 'Flexible'}\n` +
        `• Est. Distance: ${totalKm} km\n` +
        `• Driver Allowance: ₹${da.toLocaleString('en-IN')}\n` +
        `• Total Est. Fare: ₹${estimatedTotal.toLocaleString('en-IN')}\n\n` +
        `Please confirm cab availability and send final booking details.`
      );
      qmWhatsappBtn.href = `https://wa.me/917083808483?text=${msg}`;
    }

    // Scroll & Pre-fill Booking Form
    if (qmBookFormBtn) {
      qmBookFormBtn.onclick = () => {
        closeModal();
        const bookFormVehicle = document.getElementById('booking-vehicle');
        const bookFormPickup = document.getElementById('booking-pickup');
        const bookFormDrop = document.getElementById('booking-drop');
        const bookFormTripType = document.getElementById('booking-trip-type');
        const bookFormDate = document.getElementById('booking-date');

        if (bookFormVehicle) bookFormVehicle.value = vehicleKey;
        if (bookFormTripType) bookFormTripType.value = tripType;
        if (bookFormPickup) bookFormPickup.value = pickup;
        if (bookFormDrop) bookFormDrop.value = drop;
        if (bookFormDate && dateVal) bookFormDate.value = dateVal;

        const bookingSection = document.getElementById('booking');
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth' });
        }
      };
    }

    openModal();
  });

  if (qmPdfBtn) {
    qmPdfBtn.addEventListener('click', () => {
      if (currentModalEstimateData) {
        printEstimateReceipt(currentModalEstimateData);
      }
    });
  }
}

// -----------------------------------------------------------------------------
// Developer Credit Modal (Rushikesh Online Services)
// -----------------------------------------------------------------------------
function initDeveloperCreditModal() {
  const openBtn = document.getElementById('btn-open-dev-modal');
  const modal = document.getElementById('dev-contact-modal');
  const backdrop = document.getElementById('dev-modal-backdrop');
  const closeBtn = document.getElementById('btn-close-dev-modal');
  const dismissBtn = document.getElementById('btn-dismiss-dev-modal');

  if (!openBtn || !modal) return;

  function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  function openModal() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  openBtn.addEventListener('click', openModal);

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (dismissBtn) dismissBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
}

// -----------------------------------------------------------------------------
// 10. Premium Luxury Animations & Smooth Interactions
// -----------------------------------------------------------------------------
function initScrollReveal() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const targets = document.querySelectorAll(
    '.section-header, .fleet-card, .estimator-card, .service-card, .package-card, .testimonial-card, .booking-container-card, .faq-item, .footer-grid > div'
  );

  if (!targets.length || !('IntersectionObserver' in window)) return;

  // Assign stagger classes to sibling card grids
  const assignStagger = (selector, prefix = 'reveal-delay-') => {
    document.querySelectorAll(selector).forEach(container => {
      const items = container.children;
      Array.from(items).forEach((item, idx) => {
        const delayStep = (idx % 4) + 1;
        item.classList.add(`${prefix}${delayStep}`);
      });
    });
  };

  assignStagger('.fleet-grid');
  assignStagger('.services-grid');
  assignStagger('.packages-grid');
  assignStagger('.testimonials-grid');

  targets.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        obs.unobserve(entry.target);
      }
    });
  }, {
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.12
  });

  targets.forEach(el => observer.observe(el));
}

function initHeroParallax() {
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }
  // Disable on mobile/touch screens for maximum battery and performance
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const hero = document.querySelector('.hero-section');
  if (!hero) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollY = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollY <= hero.offsetHeight) {
          hero.style.backgroundPositionY = `${scrollY * 0.28}px`;
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

function initSmoothScrollLinks() {
  const links = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href || href === '#' || href.length < 2) return;

      const targetEl = document.querySelector(href);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 80;
      const targetRect = targetEl.getBoundingClientRect();
      const targetPosition = targetRect.top + window.pageYOffset - headerHeight - 10;

      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });

      // Update URL hash smoothly without page jump
      if (history.pushState) {
        history.pushState(null, null, href);
      }
    });
  });
}
