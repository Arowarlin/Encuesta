class EmailService {
  constructor(config) {
    this.publicKey = config.publicKey;
    this.serviceId = config.serviceId;
    this.templateId = config.templateId;
    
    // Inicializar EmailJS
    emailjs.init(this.publicKey);
  }

  async enviarEncuesta(participante, baseUrl) {
    try {
      const urlVotacion = `${baseUrl}/votar.html?token=${participante.token}&correo=${encodeURIComponent(participante.correo)}`;

      const templateParams = {
        to_email: participante.correo,
        to_name: `${participante.nombre} ${participante.apellido}`,
        nombre: participante.nombre,
        apellido: participante.apellido,
        url_votacion: urlVotacion,
        app_name: 'Plataforma de Encuestas'
      };

      const response = await emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      return { success: true, response };
    } catch (error) {
      console.error('Error al enviar email:', error);
      return { success: false, error };
    }
  }

  async enviarEncuestaMasiva(participantes, baseUrl, onProgress) {
    let enviados = 0;
    let errores = 0;
    const total = participantes.length;

    for (let i = 0; i < participantes.length; i++) {
      const resultado = await this.enviarEncuesta(participantes[i], baseUrl);
      
      if (resultado.success) {
        enviados++;
      } else {
        errores++;
      }

      // Callback de progreso
      if (onProgress) {
        onProgress({
          actual: i + 1,
          total,
          enviados,
          errores,
          porcentaje: ((i + 1) / total * 100).toFixed(0)
        });
      }

      // Delay para evitar rate limiting (EmailJS tiene límites)
      if (i < participantes.length - 1) {
        await this.delay(1000); // 1 segundo entre emails
      }
    }

    return { enviados, errores, total };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Variable global para el servicio
let emailService = null;

function initEmailService(config) {
  if (!emailService) {
    emailService = new EmailService(config);
  }
  return emailService;
}

export { initEmailService, emailService };
