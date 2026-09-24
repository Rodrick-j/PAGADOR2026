# pasos para depliegue en produccion (pagador)

Proceso de instalación y configuración para entornos de produccion.

# repositorio actualizado
- se debera hacer un merge a la rama master para el despliegue
- antes usted deberia hacer sus cambios en la etapa de desarrollo en la rama mastertest

```
git checkout master
git merge mastertest
```

# compilacion de versiones antes del despliegue a produccion
- debera realizar la actualizacion segun version que necesita:
| Esquema de versiones        | comando a ejecutar            |
| ----------------------------| ----------------------------- |
| `x.0.0`                     | `npm run version-major`       |
| `0.x.0`                     | `npm run version-minor`       |
| `0.0.x`                     | `npm run version-patch`(*)    |

**Nota.-**

-   el comando `npm run version-patch` actualiza la version directa esto nos sirve para actualizar en el caprover

# proceso de despligue caprover + docker

Para este proceso se necesita tener instalado Docker Desktop  

# Despliegue de frontend y backend en CapRover usando GHCR

## 0) Rotar credenciales expuestas
```bash
# Revocar el PAT anterior en GitHub
# Cambiar password de CapRover
# Generar nuevas credenciales antes de seguir
```

## 1) Crear cuenta en GitHub
```text
GitHub -> Sign up -> crear cuenta
```

## 2) Crear Personal Access Token (classic)
```text
GitHub -> Settings -> Developer settings -> Personal access tokens (classic) -> Generate new token (classic)
Scopes:
- read:packages
- write:packages
```

## 3) Definir variables locales
```bash
export GHCR_USER="TU_USUARIO_GITHUB"
export GHCR_PAT="TU_TOKEN_NUEVO"
export CAPROVER_URL="https://captain.app.oruro.gob.bo"
export CAPROVER_APP_TOKEN_PAGADOR="TOKEN_APP_PAGADOR"
export CAPROVER_APP_TOKEN_API="TOKEN_APP_API"
```

## 4) Preparar servidor Ubuntu
```bash
sudo apt update
sudo apt install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

sudo tee /etc/apt/sources.list.d/docker.sources <<EOF2
Types: deb
URIs: https://download.docker.com/linux/ubuntu
Suites: $(. /etc/os-release && echo "${UBUNTU_CODENAME:-$VERSION_CODENAME}")
Components: stable
Architectures: $(dpkg --print-architecture)
Signed-By: /etc/apt/keyrings/docker.asc
EOF2

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo systemctl enable docker
sudo systemctl start docker
sudo docker run hello-world
```

## 5) Abrir puertos necesarios
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw allow 996/tcp
sudo ufw allow 2377/tcp
sudo ufw allow 7946/tcp
sudo ufw allow 7946/udp
sudo ufw allow 4789/udp
sudo ufw reload
```

## 6) Configurar DNS
```text
A   *.app.oruro.gob.bo       -> TU_IP_PUBLICA
A   captain.app.oruro.gob.bo -> TU_IP_PUBLICA
A   pagador.oruro.gob.bo     -> TU_IP_PUBLICA
A   api.oruro.gob.bo         -> TU_IP_PUBLICA
```

## 7) Instalar CapRover en el servidor
```bash
docker run -p 80:80 -p 443:443 -p 3000:3000 \
  -e ACCEPTED_TERMS=true \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /captain:/captain \
  caprover/caprover
```

## 8) Instalar CLI de CapRover en tu máquina local
```bash
npm install -g caprover
```

## 9) Hacer setup inicial de CapRover
```bash
caprover serversetup
```

## 10) Crear apps en CapRover
```text
Apps -> Create New App -> pagador
Apps -> Create New App -> api
```

## 11) Asignar dominios a cada app
```text
pagador -> App Configs -> Domains -> pagador.oruro.gob.bo
api     -> App Configs -> Domains -> api.oruro.gob.bo
```

## 12) Registrar GHCR dentro de CapRover
```text
Cluster -> Add Remote Registry
Registry Domain: ghcr.io
Username: TU_USUARIO_GITHUB
Password: TU_TOKEN_NUEVO
```

## 13) Login local a GHCR
```bash
echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USER" --password-stdin
```

## 14) Build y push del frontend
```bash
docker build -f .deploy/Dockerfile -t ghcr.io/$GHCR_USER/admin:latest .
docker push ghcr.io/$GHCR_USER/admin:latest
```

## 15) Build y push del backend
```bash
docker build -f .deploy/Dockerfile -t ghcr.io/$GHCR_USER/server:latest .
docker push ghcr.io/$GHCR_USER/server:latest
```

## 16) Deploy del frontend con App Token
```bash
caprover deploy \
  --caproverUrl "$CAPROVER_URL" \
  --appToken "$CAPROVER_APP_TOKEN_PAGADOR" \
  --appName pagador \
  --imageName ghcr.io/$GHCR_USER/admin:latest
```

## 17) Deploy del backend con App Token
```bash
caprover deploy \
  --caproverUrl "$CAPROVER_URL" \
  --appToken "$CAPROVER_APP_TOKEN_API" \
  --appName api \
  --imageName ghcr.io/$GHCR_USER/server:latest
```

## 18) Alternativa usando password de CapRover
```bash
caprover deploy \
  --caproverUrl "$CAPROVER_URL" \
  --caproverPassword "TU_PASSWORD_NUEVO" \
  --appName pagador \
  --imageName ghcr.io/$GHCR_USER/admin:latest

caprover deploy \
  --caproverUrl "$CAPROVER_URL" \
  --caproverPassword "TU_PASSWORD_NUEVO" \
  --appName api \
  --imageName ghcr.io/$GHCR_USER/server:latest
```

## 19) Variables de entorno por app
```text
pagador -> App Configs -> Environment Variables
api     -> App Configs -> Environment Variables
```

## 20) Flujo mínimo final
```bash
export GHCR_USER="TU_USUARIO_GITHUB"
export GHCR_PAT="TU_TOKEN_NUEVO"
export CAPROVER_URL="https://captain.app.oruro.gob.bo"

echo "$GHCR_PAT" | docker login ghcr.io -u "$GHCR_USER" --password-stdin

docker build -f .deploy/Dockerfile -t ghcr.io/$GHCR_USER/admin:latest .
docker push ghcr.io/$GHCR_USER/admin:latest

docker build -f .deploy/Dockerfile -t ghcr.io/$GHCR_USER/server:latest .
docker push ghcr.io/$GHCR_USER/server:latest

caprover deploy --caproverUrl "$CAPROVER_URL" --appToken "TOKEN_APP_PAGADOR" --appName pagador --imageName ghcr.io/$GHCR_USER/admin:latest
caprover deploy --caproverUrl "$CAPROVER_URL" --appToken "TOKEN_APP_API" --appName api --imageName ghcr.io/$GHCR_USER/server:latest
```

## 21) Base de datos caprover
- la base de datos esta desplegada en el caprover con `orurodb-db` 
```text
Crear Una Nueva App -> Apps/Databases de un Clic -> buscar MySql

AppName: orurodb
MySqlVersion: 8.4.3
MySql Root Password: xxxxxxxx
```
- Presiona Deploy y se creara el servidor de la base de datos
los accesos al servidor estan en el archivo app-config del ``server``

## Referencia rápida
```text
Frontend image: ghcr.io/TU_USUARIO_GITHUB/admin:latest
Backend image:  ghcr.io/TU_USUARIO_GITHUB/server:latest
CapRover URL:   https://captain.app.oruro.gob.bo
Apps:           pagador, api, orurodb-db
```

