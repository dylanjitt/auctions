
# 🛒 Real-Time Auctions App

Aplicación de subastas en tiempo real construida con React, Zustand, JSON Server y Server-Sent Events (SSE).

---

## 🚀 Instalación y ejecución

### 1. Clona el repositorio

```bash
git clone https://github.com/dylanjitt/auctions.git
cd auctions-project
```

### 2. Instala dependencias

```bash
npm install
```

### 3. Ejecuta el frontend (React)

```bash
npm run dev
```

Esto levantará la app en `http://localhost:5173`.

---

## 🔌 Ejecutar servidores backend en terminales separadas

> Asegúrate de tener instalados `json-server` y `nodemon` globalmente o usa `npx`.

### Terminal 1 - Usuarios (puerto 3001)

```bash
npx json-server src/users.json --port 3001
```

### Terminal 2 - Productos (puerto 3002)

```bash
npx json-server --watch src/products.json --port 3002
```

---

## 📡 Ejecutar servidor SSE (puerto 3003)

### Terminal 3

1. Ve al directorio del servidor SSE:

```bash
cd sse-server
```

2. Si aún no lo hiciste:

```bash
npm init -y
npm install
```

3. Ejecuta el servidor:

```bash
node mock-server.js
```

Esto levantará el SSE en:

```
http://localhost:3003
```

---

## ⚙️ Configuración de entorno

Crea un archivo `.env` en la raíz del proyecto con este contenido:

```env
VITE_API_USERS=http://localhost:3001
VITE_API_PRODUCTS=http://localhost:3002
VITE_API_SSE=http://localhost:3003

# Cloudinary (rellenar con tus datos reales)
VITE_CLOUDINARY_NAME=your-cloud-name
VITE_CLOUDINARY_PRESET=your-upload-preset
VITE_CLOUDINARY_API=https://api.cloudinary.com/v1_1/your-cloud-name/image/upload
```

> ⚠️ Debes obtener tus datos de Cloudinary creando una cuenta en: https://cloudinary.com

---

## 🗂 Estructura del proyecto

```
auctions-project/
├── src/
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   ├── interfaces/
│   ├── services/
│   ├── store/
│   └── users.json
├── products.json
├── .env
├── sse-server/
│   ├── mock-server.js
│   └── ssemanager.js
├── README.md
├── package.json
└── ...
```

---

## ✅ Todo listo

Una vez que los tres servidores estén corriendo y `.env` esté configurado, abre:

```
http://localhost:5173
```

Y ya puedes interactuar con subastas en tiempo real. 🚀

