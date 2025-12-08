// ============================================
// CONFIGURACIÓN DE FIREBASE
// ============================================
const firebaseConfig = {
  apiKey: "AIzaSyDPxGm78abHs38JN68HFyzS9R2owmeoQUw",
  authDomain: "plataforma-encuestas-3e026.firebaseapp.com",
  projectId: "plataforma-encuestas-3e026",
  storageBucket: "plataforma-encuestas-3e026.firebasestorage.app",
  messagingSenderId: "955272510578",
  appId: "1:955272510578:web:d92f4c471ddea3415c96eb"
};

// ============================================
// CONFIGURACIÓN DE EMAILJS
// ============================================
const emailJSConfig = {
  publicKey: "vPoQgWPzHt2fdfgsL",      // Public Key
  serviceId: "service_3o1ef2g",         // Service ID
  templateId: "template_2zwoqtm"        // Template ID
};

// ============================================
// URL BASE DE LA APLICACIÓN
// ============================================
// Esta URL se detecta automáticamente
// Funciona tanto en local como en producción
const APP_CONFIG = {
  baseUrl: window.location.origin,
  appName: "Plataforma de Encuestas"
};

// Exportar configuraciones (no modificar)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { firebaseConfig, emailJSConfig, APP_CONFIG };
}