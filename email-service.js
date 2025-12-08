// ============================================
// SERVICIO DE EMAIL CON EMAILJS
// ============================================

class EmailService {
  constructor() {
    this.publicKey = emailJSConfig.publicKey;
    this.serviceId = emailJSConfig.serviceId;
    this.templateId = emailJSConfig.templateId;
    this.initialized = false;
  }

  // Inicializar EmailJS
  async init() {
    if (this.initialized) return;
    
    try {
      emailjs.init(this.publicKey);
      this.initialized = true;
      console.log('✅ EmailJS inicializado correctamente');
    } catch (error) {
      console.error('❌ Error al inicializar EmailJS:', error);
      throw error;
    }
  }

  // Enviar email de invitación a UN participante
  async enviarInvitacion(participante) {
    try {
      await this.init();

      // Generar token único para este participante
      const token = await this.generarToken(participante.correo);
      
      // 🔥 URL CORREGIDA: Usa appConfig.baseUrl que ya incluye /Encuesta
      const urlVotacion = `${appConfig.baseUrl}/votar.html?token=${token}&correo=${encodeURIComponent(participante.correo)}`;

      // Parámetros del template
      const templateParams = {
        to_email: participante.correo,  // 🔥 CORREGIDO: Envía al correo del participante
        to_name: participante.nombre,
        url_votacion: urlVotacion,
        app_name: appConfig.nombre
      };

      console.log('📧 Enviando email a:', participante.correo);
      console.log('🔗 URL de votación:', urlVotacion);

      // Enviar el email
      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      console.log('✅ Email enviado correctamente:', response);
      return {
        success: true,
        token: token,
        urlVotacion: urlVotacion
      };

    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw error;
    }
  }

  // Enviar emails a MÚLTIPLES participantes
  async enviarInvitacionesMasivas(participantes, onProgress = null) {
    const resultados = {
      exitosos: [],
      fallidos: [],
      total: participantes.length
    };

    for (let i = 0; i < participantes.length; i++) {
      const participante = participantes[i];
      
      try {
        const resultado = await this.enviarInvitacion(participante);
        resultados.exitosos.push({
          ...participante,
          ...resultado
        });

        // Callback de progreso
        if (onProgress) {
          onProgress({
            actual: i + 1,
            total: participantes.length,
            participante: participante.nombre,
            exito: true
          });
        }

        // Pequeña pausa entre emails para evitar rate limiting
        if (i < participantes.length - 1) {
          await this.esperar(1000); // 1 segundo entre emails
        }

      } catch (error) {
        resultados.fallidos.push({
          ...participante,
          error: error.message
        });

        if (onProgress) {
          onProgress({
            actual: i + 1,
            total: participantes.length,
            participante: participante.nombre,
            exito: false,
            error: error.message
          });
        }
      }
    }

    return resultados;
  }

  // Generar token único para un email
  async generarToken(email) {
    const data = email + Date.now() + Math.random();
    const msgBuffer = new TextEncoder().encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
  }

  // Función auxiliar para esperar
  esperar(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Verificar si EmailJS está configurado correctamente
  verificarConfiguracion() {
    const errores = [];

    if (!this.publicKey || this.publicKey === 'TU_PUBLIC_KEY') {
      errores.push('Public Key no configurada');
    }
    if (!this.serviceId || this.serviceId === 'TU_SERVICE_ID') {
      errores.push('Service ID no configurado');
    }
    if (!this.templateId || this.templateId === 'TU_TEMPLATE_ID') {
      errores.push('Template ID no configurado');
    }

    if (errores.length > 0) {
      console.error('❌ Errores de configuración de EmailJS:', errores);
      return false;
    }

    console.log('✅ Configuración de EmailJS correcta');
    return true;
  }
}

// Instancia global del servicio
const emailService = new EmailService();
