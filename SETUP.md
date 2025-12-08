# 🚀 Guía de Configuración - Plataforma de Encuestas Cloud

## 📋 Índice
1. [Requisitos Previos](#requisitos-previos)
2. [Configurar Firebase](#configurar-firebase)
3. [Configurar EmailJS](#configurar-emailjs)
4. [Configurar el Proyecto](#configurar-el-proyecto)
5. [Desplegar la Aplicación](#desplegar-la-aplicación)
6. [Solución de Problemas](#solución-de-problemas)

---

## 📦 Requisitos Previos

- ✅ Cuenta de Google (para Firebase)
- ✅ Cuenta de correo electrónico (Gmail recomendado para EmailJS)
- ✅ Navegador web moderno
- ✅ Editor de código (VS Code recomendado)

---

## 🔥 Configurar Firebase

### Paso 1: Crear Proyecto

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Click en "Agregar proyecto"
3. Nombre del proyecto: `plataforma-encuestas` (o el nombre que prefieras)
4. Desactiva Google Analytics (opcional)
5. Click en "Crear proyecto"

### Paso 2: Crear Aplicación Web

1. En el panel de Firebase, click en el ícono **Web** `</>`
2. Nombre de la app: `Encuestas Web`
3. **NO** marcar "Firebase Hosting" por ahora
4. Click en "Registrar app"
5. **Copia** la configuración que aparece (la necesitarás después)

### Paso 3: Configurar Firestore Database

1. En el menú lateral, ve a **Compilación** > **Firestore Database**
2. Click en "Crear base de datos"
3. Selecciona **"Iniciar en modo de prueba"** (para desarrollo)
4. Selecciona una ubicación cercana (ej: `us-east1`)
5. Click en "Habilitar"

### Paso 4: Configurar Reglas de Seguridad

En la pestaña "Reglas", reemplaza con:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Participantes
    match /participantes/{document} {
      allow read, write: if true; // En producción, agregar autenticación
    }
    
    // Cargos
    match /cargos/{document} {
      allow read: if true;
      allow write: if true; // En producción, solo admins
    }
    
    // Aspirantes
    match /aspirantes/{document} {
      allow read: if true;
      allow write: if true; // En producción, solo admins
    }
    
    // Votos
    match /votos/{document} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if false; // Votos no se pueden modificar
    }
  }
}
```

**IMPORTANTE**: Estas reglas son para desarrollo. En producción, implementa autenticación adecuada.

### Paso 5: Copiar Credenciales

Tu configuración se verá así:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "tu-proyecto.firebaseapp.com",
  projectId: "tu-proyecto-id",
  storageBucket: "tu-proyecto.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

---

## 📧 Configurar EmailJS

### Paso 1: Crear Cuenta

1. Ve a [EmailJS](https://www.emailjs.com/)
2. Click en "Sign Up" (Registrarse)
3. Usa tu correo de Google o cualquier otro
4. Verifica tu correo electrónico

### Paso 2: Agregar Servicio de Email

1. En el dashboard, ve a **"Email Services"**
2. Click en "Add New Service"
3. Selecciona **Gmail** (o tu proveedor)
4. Click en "Connect Account"
5. Autoriza el acceso a tu cuenta de Gmail
6. Dale un nombre al servicio (ej: "Gmail Service")
7. **Copia el Service ID** (ej: `service_abc123`)

### Paso 3: Crear Plantilla de Email

1. Ve a **"Email Templates"**
2. Click en "Create New Template"
3. Reemplaza el contenido con:

**Subject:**
```
📊 Invitación para participar en encuesta
```

**Content:**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { padding: 30px; background: #f9fafb; border-radius: 0 0 8px 8px; }
    .button { 
      display: inline-block; 
      padding: 15px 40px; 
      background: #4F46E5; 
      color: white; 
      text-decoration: none; 
      border-radius: 8px; 
      margin: 20px 0;
      font-weight: bold;
    }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    ul { background: white; padding: 20px; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🗳️ Invitación a Encuesta</h1>
    </div>
    <div class="content">
      <p>Hola <strong>{{to_name}}</strong>,</p>
      <p>Has sido invitado(a) a participar en nuestra encuesta. Tu opinión es muy importante para nosotros.</p>
      <p>Haz clic en el botón a continuación para emitir tu voto:</p>
      <center>
        <a href="{{url_votacion}}" class="button">PARTICIPAR EN LA ENCUESTA</a>
      </center>
      <p><strong>Importante:</strong></p>
      <ul>
        <li>Este enlace es personal e intransferible</li>
        <li>Solo podrás votar una vez</li>
        <li>Tu voto es confidencial</li>
      </ul>
      <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      <p>Saludos cordiales,<br><strong>{{app_name}}</strong></p>
    </div>
    <div class="footer">
      <p>© 2024 {{app_name}}. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
```

4. En "Settings" asegúrate que esté marcado:
   - ✅ To Email: `{{to_email}}`
   - ✅ To Name: `{{to_name}}`
5. Click en "Save"
6. **Copia el Template ID** (ej: `template_xyz789`)

### Paso 4: Obtener Public Key

1. Ve a **"Account"** en el menú
2. En la sección "API Keys"
3. **Copia tu Public Key** (ej: `1a2b3c4d5e6f7g8h9i`)

---

## ⚙️ Configurar el Proyecto

### Paso 1: Estructura de Archivos

Crea esta estructura:

```
encuestas-cloud/
├── index.html
├── admin.html
├── votar.html
├── resultados.html
├── config.js
├── firebase-service.js
├── email-service.js
└── SETUP.md
```

### Paso 2: Editar config.js

Abre `config.js` y reemplaza con tus credenciales:

```javascript
const firebaseConfig = {
  apiKey: "TU_FIREBASE_API_KEY",           // ← Pega aquí
  authDomain: "tu-proyecto.firebaseapp.com", // ← Pega aquí
  projectId: "tu-proyecto-id",              // ← Pega aquí
  storageBucket: "tu-proyecto.appspot.com", // ← Pega aquí
  messagingSenderId: "123456789",           // ← Pega aquí
  appId: "1:123:web:abc"                    // ← Pega aquí
};

const emailJSConfig = {
  publicKey: "TU_EMAILJS_PUBLIC_KEY",  // ← Pega aquí
  serviceId: "TU_SERVICE_ID",          // ← Pega aquí (ej: service_abc123)
  templateId: "TU_TEMPLATE_ID"         // ← Pega aquí (ej: template_xyz789)
};

const APP_CONFIG = {
  baseUrl: window.location.origin,
  appName: "Plataforma de Encuestas"
};
```

### Paso 3: Probar Localmente

1. Abre `index.html` directamente en tu navegador
2. **IMPORTANTE**: Algunos navegadores bloquean módulos ES6 en archivos locales
3. **Solución**: Usa un servidor local simple:

**Opción A - Python (si lo tienes instalado):**
```bash
# Python 3
python -m http.server 8000

# Luego abre: http://localhost:8000
```

**Opción B - Node.js (si lo tienes instalado):**
```bash
npx http-server -p 8000

# Luego abre: http://localhost:8000
```

**Opción C - VS Code:**
1. Instala la extensión "Live Server"
2. Click derecho en `index.html`
3. Selecciona "Open with Live Server"

---

## 🚀 Desplegar la Aplicación

### Opción 1: Netlify (Recomendado - Más Fácil)

1. Ve a [Netlify](https://www.netlify.com/)
2. Arrastra tu carpeta completa a Netlify Drop
3. Tu sitio estará disponible en: `tu-sitio.netlify.app`
4. Actualiza `APP_CONFIG.baseUrl` en `config.js` con tu nueva URL

### Opción 2: Vercel

1. Ve a [Vercel](https://vercel.com/)
2. Importa tu proyecto desde GitHub o arrastra la carpeta
3. Deploy automático
4. URL: `tu-proyecto.vercel.app`

### Opción 3: Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting
firebase init hosting

# Selecciona tu proyecto
# Public directory: . (punto)
# Single page app: No

# Desplegar
firebase deploy
```

### Opción 4: GitHub Pages

1. Crea un repositorio en GitHub
2. Sube todos los archivos
3. Ve a Settings > Pages
4. Source: main branch
5. URL: `tu-usuario.github.io/nombre-repo`

---

## 🔧 Solución de Problemas

### Error: "Firebase not defined"

**Solución**: Asegúrate de que `config.js` esté cargado ANTES de los otros scripts.

### Error al enviar emails

**Causas comunes**:
- ✅ Verifica que el Public Key sea correcto
- ✅ Verifica que el Service ID y Template ID sean correctos
- ✅ Revisa que la plantilla use las variables correctas: `{{to_email}}`, `{{to_name}}`, etc.
- ✅ EmailJS tiene límite de 200 emails/mes en plan gratuito

### Los módulos ES6 no cargan

**Solución**: Usa un servidor local (ver Paso 3 de Configurar el Proyecto)

### Error: "CORS policy"

**Solución**: 
- No abras `index.html` directamente desde el sistema de archivos
- Usa un servidor local o despliega en un hosting

### Firebase: Permission Denied

**Solución**: Revisa las reglas de Firestore. Para desarrollo, usa las reglas del Paso 4 de Firebase.

### Los votos no se registran

**Causas**:
1. Verifica que las reglas de Firestore permitan escritura
2. Abre la consola del navegador (F12) y busca errores
3. Verifica que el participante tenga un token válido

---

## 📊 Límites del Plan Gratuito

### Firebase (Plan Spark - Gratuito)
- ✅ 50,000 lecturas/día
- ✅ 20,000 escrituras/día
- ✅ 1 GB almacenamiento
- ✅ **Suficiente para miles de participantes**

### EmailJS (Plan Gratuito)
- ✅ 200 emails/mes
- ✅ Si necesitas más, actualiza al plan Pro ($15/mes = 1,000 emails)

### Hosting (Gratuito)
- ✅ Netlify: 100 GB bandwidth/mes
- ✅ Vercel: 100 GB bandwidth/mes
- ✅ GitHub Pages: 100 GB bandwidth/mes
- ✅ Firebase Hosting: 10 GB bandwidth/mes

---

## ✅ Checklist de Configuración

Antes de usar en producción, verifica:

- [ ] Firebase configurado y Firestore activo
- [ ] EmailJS configurado con plantilla correcta
- [ ] `config.js` con todas las credenciales correctas
- [ ] Aplicación desplegada en un hosting
- [ ] `APP_CONFIG.baseUrl` actualizado con la URL de producción
- [ ] Probado el registro de participantes
- [ ] Probado el registro de cargos y aspirantes
- [ ] Probado el envío de emails (al menos 1 test)
- [ ] Probado el proceso completo de votación
- [ ] Verificado que los resultados se actualizan

---

## 🎉 ¡Listo!

Tu plataforma de encuestas cloud está configurada y lista para usar.

### Flujo de Uso:

1. **Administrador**: Registra participantes
2. **Administrador**: Crea cargos y aspirantes
3. **Administrador**: Envía encuestas por email
4. **Participantes**: Reciben email y votan
5. **Todos**: Pueden ver resultados en tiempo real

---

## 📞 Soporte

Si tienes problemas:
1. Revisa la consola del navegador (F12 > Console)
2. Revisa que todas las credenciales sean correctas
3. Verifica los límites de uso de Firebase y EmailJS

---

**Última actualización**: Diciembre 2024
