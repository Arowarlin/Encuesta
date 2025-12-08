# 📊 Plataforma de Encuestas - Cloud Edition

Sistema completo de encuestas en la nube, sin necesidad de servidor local. Utiliza Firebase para la base de datos y EmailJS para el envío de correos.

![](https://img.shields.io/badge/Firebase-Cloud-orange)
![](https://img.shields.io/badge/EmailJS-Enabled-blue)
![](https://img.shields.io/badge/Deploy-Ready-green)
![](https://img.shields.io/badge/License-Free-lightgrey)

---

## ✨ Características

- 🔥 **100% Cloud** - Sin servidor local necesario
- 📧 **Envío automático de emails** - Con EmailJS
- 🔒 **Votación segura** - Un voto por correo electrónico
- 📊 **Resultados en tiempo real** - Actualizados al instante
- 🎨 **Interfaz moderna** - Diseñada con Tailwind CSS
- 📱 **Responsive** - Funciona en móviles, tablets y desktop
- 🆓 **Totalmente gratis** - Usando planes gratuitos
- 🚀 **Fácil de desplegar** - En Netlify, Vercel, GitHub Pages

---

## 🎯 Funcionalidades Principales

### 1. Gestión de Participantes
- Registro de participantes con campos personalizables
- Generación automática de tokens únicos
- Control de estado de votación

### 2. Configuración de Encuestas
- Creación de cargos/posiciones/preguntas
- Registro de aspirantes/opciones
- Descripciones detalladas

### 3. Votación Segura
- Enlace único por participante
- Validación de token + correo
- Prevención de votación duplicada
- Opciones: Aspirante, No sé, Ninguno

### 4. Reportes y Resultados
- Gráficos interactivos con Chart.js
- Estadísticas generales
- Desglose detallado por cargo
- Porcentajes y totales

---

## 🏗️ Arquitectura

```
┌─────────────────┐
│   Frontend      │ → HTML + JavaScript (ES6 Modules)
│   (Hosting)     │   Tailwind CSS + Chart.js
└────────┬────────┘
         │
         ├─────────→ Firebase Firestore (Base de datos)
         │           - participantes
         │           - cargos
         │           - aspirantes
         │           - votos
         │
         └─────────→ EmailJS (Envío de correos)
                     200 emails/mes gratis
```

---

## 📦 Estructura del Proyecto

```
encuestas-cloud/
├── index.html              # Página principal
├── admin.html              # Panel de administración
├── votar.html              # Interface de votación
├── resultados.html         # Visualización de resultados
├── config.js               # Configuración (Firebase + EmailJS)
├── firebase-service.js     # Servicio de base de datos
├── email-service.js        # Servicio de emails
├── SETUP.md                # Guía de configuración detallada
└── README.md               # Este archivo
```

---

## 🚀 Inicio Rápido

### 1. Requisitos
- Cuenta de Google (Firebase)
- Cuenta de correo (EmailJS)
- Navegador web moderno

### 2. Configuración

```bash
# 1. Descarga todos los archivos del proyecto
# 2. Configura Firebase (ver SETUP.md)
# 3. Configura EmailJS (ver SETUP.md)
# 4. Edita config.js con tus credenciales
```

### 3. Configurar Credenciales

Edita `config.js`:

```javascript
const firebaseConfig = {
  apiKey: "TU_FIREBASE_API_KEY",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:abc"
};

const emailJSConfig = {
  publicKey: "TU_EMAILJS_PUBLIC_KEY",
  serviceId: "service_abc123",
  templateId: "template_xyz789"
};
```

### 4. Probar Localmente

```bash
# Opción 1: Python
python -m http.server 8000

# Opción 2: Node.js
npx http-server -p 8000

# Abrir: http://localhost:8000
```

### 5. Desplegar

**Netlify (Más fácil):**
- Arrastra tu carpeta a [netlify.com/drop](https://app.netlify.com/drop)
- ¡Listo!

**Otras opciones:**
- Vercel
- GitHub Pages
- Firebase Hosting

---

## 📖 Guía de Uso

### Para Administradores

1. **Registrar Participantes**
   - Ir a "Admin" → "Participantes"
   - Llenar formulario (correo obligatorio)
   - Click en "Registrar"

2. **Crear Cargos**
   - Ir a "Cargos y Aspirantes"
   - Registrar cargo (ej: "Presidente")
   - Agregar aspirantes al cargo

3. **Enviar Encuestas**
   - Ir a "Enviar Encuestas"
   - Verificar estadísticas
   - Click en "Enviar Encuestas a Todos"
   - Cada participante recibe un email

### Para Participantes

1. Recibes un email con tu enlace único
2. Haces click en el enlace
3. Seleccionas tus opciones para cada cargo
4. Envías tu voto
5. ¡Listo! Puedes ver los resultados

---

## 🔐 Seguridad

✅ **Token único** por participante  
✅ **Validación doble** (token + correo)  
✅ **Un voto por persona**  
✅ **Votos inmutables** (no se pueden editar)  
✅ **Enlaces personalizados** no transferibles  

**Nota de Seguridad**: Las reglas de Firestore incluidas son para desarrollo. En producción, implementa autenticación adecuada.

---

## 🎨 Personalización

### Cambiar Colores

Los archivos HTML usan Tailwind CSS. Busca y reemplaza:
- `indigo-600` → Tu color principal
- `green-600` → Color de éxito
- `red-600` → Color de error

### Agregar Campos

Edita `firebase-service.js` y los formularios HTML para agregar más campos personalizados.

### Modificar Email

Edita la plantilla en EmailJS con tu diseño y contenido.

---

## 📊 Límites (Planes Gratuitos)

| Servicio | Límite | Suficiente Para |
|----------|--------|-----------------|
| **Firebase Firestore** | 50K lecturas/día | Miles de participantes |
| **Firebase Hosting** | 10 GB/mes | Cientos de miles de visitas |
| **EmailJS** | 200 emails/mes | 200 participantes/mes |
| **Netlify** | 100 GB bandwidth | Tráfico ilimitado prácticamente |

---

## 🐛 Solución de Problemas

### Firebase no conecta
- Verifica credenciales en `config.js`
- Revisa reglas de Firestore
- Abre consola del navegador (F12)

### Emails no se envían
- Verifica Public Key de EmailJS
- Confirma Service ID y Template ID
- Revisa límite mensual (200 emails)

### Módulos no cargan
- Usa un servidor local (no abras archivos directamente)
- Prueba con Python: `python -m http.server`

**Más ayuda**: Ver `SETUP.md` para guía completa

---

## 📱 Compatibilidad

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Móviles modernos

---

## 🔄 Actualizaciones Futuras

Posibles mejoras:
- [ ] Autenticación de administradores
- [ ] Exportar resultados a PDF/Excel
- [ ] Encuestas con fecha límite
- [ ] Múltiples encuestas simultáneas
- [ ] Recordatorios automáticos
- [ ] Análisis avanzado de datos

---

## 📄 Licencia

Este proyecto es de código abierto y está disponible para uso educativo y comercial.

---

## 🤝 Contribuciones

¡Las contribuciones son bienvenidas! Si encuentras un bug o tienes una mejora:

1. Reporta el issue
2. Propón una solución
3. Crea un pull request

---

## 📞 Soporte

Para obtener ayuda:
1. Lee `SETUP.md` primero
2. Revisa la sección de solución de problemas
3. Abre la consola del navegador para ver errores
4. Verifica que todas las credenciales sean correctas

---

## 🎉 Créditos

- **Firebase** - Base de datos en tiempo real
- **EmailJS** - Servicio de envío de emails
- **Tailwind CSS** - Framework de estilos
- **Chart.js** - Gráficos interactivos

---

## ⭐ Características Destacadas

- 🚀 **Despliegue en minutos** - Sin configuración compleja
- 💰 **100% Gratis** - Con planes gratuitos generosos
- 🔧 **Sin mantenimiento** - Firebase gestiona todo
- 📈 **Escalable** - Crece con tu proyecto
- 🌐 **Accesible globalmente** - Desde cualquier lugar

---

**¿Listo para empezar?** Lee `SETUP.md` para configurar tu proyecto en menos de 30 minutos.

---

**Desarrollado con ❤️ para comunidades que necesitan sistemas de votación seguros y confiables**