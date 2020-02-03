<h1 align="center">MACbot</h1>

<div align="center">

[![MACbot](https://img.shields.io/badge/MACbot-v1.5-0088cc?style=flat-square&logo=github)](https://telegram.me/thed10sbot)

[![Bot API](https://img.shields.io/badge/Bot%20API-v4.6-0088cc?style=flat-square&logo=telegram)](https://core.telegram.org/bots/api)
[![Node.js](https://img.shields.io/badge/Node.js-v13.7.0-6cc24a?style=flat-square)](https://nodejs.org/en/)
[![npm](https://img.shields.io/badge/npm-v6.13.6-cb3837?style=flat-square&logo=npm)](https://www.npmjs.com/)

</div>

Este bot en la confiable herramienta de bolsillo que todo Mackenzie debe tener. Él te mantendrá al tanto de tus responsabilidades como miembro de la agrupación (y también como futuro miembro).

<h2 align='center'>Install</h2>

### **Clone and start the project**

Tienes que llenar todas las variables de entorno para que el proyecto funcione.

```bash
git clone https://github.com/MAC-USB/MACbot.git
cd MACbot
npm install
mv .env-example .env
```

### **Database**

No seas estúpido y crea una contraseña segura para la base de datos.

```sql
CREATE DATABASE macbot;

CREATE USER macbot_user PASSWORD 'macbot_password';

GRANT ALL PRIVILEGES ON DATABASE macbot TO macbot_user;

ALTER DATABASE macbot OWNER TO macbot_user;
```

No olvides de inicializar la base de datos.

```bash
psql -U macbot_user macbot < database/tables.sql
```

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
