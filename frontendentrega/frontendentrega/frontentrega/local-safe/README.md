# Entorno local aislado de PAGADOR

Este entorno usa exclusivamente servicios locales:

- Frontend: `http://127.0.0.1:6500`
- Backend: `http://127.0.0.1:8080`
- MySQL para DBeaver: `127.0.0.1:3307`
- Base: `pagador_local`
- Usuario: `pagador_local`
- Clave: `pagador_local_only`

La red Docker `pagador_internal` esta marcada como interna. El backend solo esta
conectado a esa red, no recibe credenciales institucionales y el FTP apunta a un
puerto local cerrado. Una pasarela Nginx sin credenciales publica el backend en
`127.0.0.1:8080`. MySQL publica `127.0.0.1:3307` para DBeaver mediante una red
separada; el backend no pertenece a esa red externa.

## Reglas de seguridad

1. No copiar `.env.local`, `.npmrc`, respaldos ni credenciales reales dentro de
   `backentrega`.
2. No cambiar `DB_HOST` por una IP o dominio institucional.
3. No ejecutar `npm run create-database` fuera del contenedor local: ese comando
   usa sincronizacion destructiva.
4. Antes de inicializar la base se deben revisar los seeders y asegurar que solo
   contengan datos ficticios.
5. En DBeaver, crear una conexion nueva llamada `PAGADOR_LOCAL` y marcarla en
   verde. No reutilizar la conexion institucional.

## Arranque (despues de auditar los seeders)

Desde esta carpeta:

```powershell
docker compose build
docker compose up -d database
docker compose run --rm -e CREATE_DATABASE=true backend
docker compose run --rm backend node local-safe/create-local-user.cjs
docker compose up -d backend
```

El tercer comando borra y recrea tablas, pero queda limitado al contenedor MySQL
local definido en este archivo.

El cuarto comando crea exclusivamente esta cuenta ficticia:

- Correo: `local@demo.invalid`
- Clave: `local-demo-only`

El `Dockerfile.local-safe` sustituye el seeder original de usuarios por uno vacio
antes de compilar. Los usuarios incluidos en el repositorio no se importan.
