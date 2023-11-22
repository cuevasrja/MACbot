<h1 align="center">MACbot</h1>

<div align="center">

[![MACbot](https://img.shields.io/badge/MACbot-v2.0-0088cc?style=flat-square&logo=github)](https://telegram.me/mac_usb_bot)

[![Bot API](https://img.shields.io/badge/Bot%20API-v6.7-0088cc?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
[![Node.js](https://img.shields.io/badge/Node.js-v18-43853D?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/es/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v15-336791?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)](https://www.docker.com/)
[![Docker Compose](https://img.shields.io/badge/Docker%20Compose-2496ED?style=flat-square&logo=docker&logoColor=white)](https://github.com/docker/compose)
[![License](https://img.shields.io/badge/License-MIT-0088cc?style=flat-square&logo=github)](https://github.com/MAC-USB/MACbot/blob/master/LICENSE)

</div>

Este bot es la nueva y mejorada herramienta de bolsillo que todo Mackienzie debe tener. Él te mantendrá al tanto de tus responsabilidades como miembro de la agrupación (y también como futuro miembro).

<h2 align='center'>Install</h2>

### **Clone and start the project**

Tienes que llenar todas las variables de entorno para que el proyecto funcione.

```bash
git clone https://github.com/MAC-USB/MACbot.git
cd MACbot
cp .env-example .env
```

### **Running the bot with Docker**

Después de llenar las variables de entorno, puedes iniciar el proyecto con [_Docker-compose_](https://github.com/docker/compose).

NOTA: Si no tienes instalado Docker, puedes seguir la guía de instalación [_aquí_](https://docs.docker.com/get-docker/).

Puedes correr el bot en el entorno de desarrollo o en el de producción. Simplemente especifica el entorno en la variable de entorno `NODE_ENV` en el archivo `.env`. Para correr el bot en el entorno de desarrollo, debes especificar `development` y para el de producción, `production`.

```bash
docker compose build
docker compose up -d
```

- Para ver los logs del bot y la bd en conjunto, puedes usar el siguiente comando:

```bash
docker compose logs -f
```
- Para ver los logs del bot y la bd por separado:

```bash
docker compose logs -f macbot
docker compose logs -f postgres
```

- Finalmente, para detener el bot puedes usar el siguiente comando:

```bash
docker compose down
```

### **Development**

Si quieres contribuir al proyecto, si es necesario que tengas instalado [_Node.js_](https://nodejs.org/es/) y hacer la instalación de las dependencias.

```bash
npm install
```

Esto para que puedan cargarse las configuraciones de [_ESLint_](https://eslint.org/) y [_Prettier_](https://prettier.io/).

### **Google Sheet API credentials**

Para sacar las credenciales de la API de Google Sheets tienes que visitar: https://console.developers.google.com

```bash
mkdir credentials
touch credentials/MACbot_secret.json
```

<h2 align='center'>Documentation</h2>

...

<h2 align='center'>License</h2>

### **The MIT License (MIT)**

Copyright © 2020 MAC (labf-ldac)
