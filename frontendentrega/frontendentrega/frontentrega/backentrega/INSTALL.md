# Instalación

Proceso de instalación y configuración para entornos de desarrollo.

## Clonar el proyecto frontend

```bash
git clone https://git.oruro.gob.bo/sistemas/pagador.git
cd pagador
git checkout mastertest
```
**Nota.-**
-   La rama mastertest se utiliza para realizar actualizaciones y correcciones de codigo antes de llevarlo a produccion

## Configuración de la aplicación web (admin)

```bash
cd pagador
npm install 
```

Crea el archivo de configuración:

| Archivo de configuración                   | Archivo de ejemplo                                |
| ------------------------------------------ | ------------------------------------------------- |
| `admin/src/config/app-config.ts`           | `admin/src/config/app-config.ts.sample`           |

Ingresar al fichero y actualizar los valores según sea necesario.

**Nota.-**

-   Algunos parámetros de configuración se obtienen desde sus respectivos paginas API para sus tokens.

### Despliegue en desarrollo

```bash
npm run local
```

### Despliegue en producción

Ver el archivo [DEPLOY.md](./DEPLOY.md).



## Clonar el proyecto backend

```bash
git clone https://git.oruro.gob.bo/sistemas/server.git
cd server
git checkout mastertest
```

## Configuración del servicio (server)
```bash
cd server
npm install
```

Crea los archivos de configuración:

| Archivo de configuración                   | Archivo de ejemplo                                |
| ------------------------------------------ | ------------------------------------------------- |
| `server/src/config/app.config.ts`          | `server/src/config/app.config.ts.sample`          |

Ingresar al fichero y actualizar los valores según sea necesario.

**Nota.-**

-   Algunos parámetros de configuración se obtienen desde sus respectivos paginas API para sus tokens.

-   Luego de tener listo todos los archivos de configuración ejecutar los siguientes comandos para completar la instalación.

```bash
# Instalación completa (database, etc)
npm run install
```

Instalación por partes:

```bash
# Crea la base de datos
npm run create-database
```

### Despliegue en desarrollo

```bash
npm run dev
```

### Despliegue en producción

Ver el archivo [DEPLOY.md](./DEPLOY.md).

**Nota.-** Para la generación de PDF's se utiliza [Puppeteer](https://pptr.dev/), en Debian 10 se requieren los siguientes paquetes:

```bash
sudo apt-get install libpangocairo-1.0-0 libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libgconf2-4 libasound2 libatk1.0-0 libgtk-3-0
```

```bash
sudo apt-get install -y libgbm-dev
```
