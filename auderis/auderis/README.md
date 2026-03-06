# AUDERIS (MVP)

Sistema web + API para gestionar auditorías internas y externas. Pensado para firmas auditoras en Honduras y Latinoamérica.

## Requisitos (Windows)

- Docker Desktop instalado y en ejecución
- Git (opcional para clonar)

## Puesta en marcha

```bash
docker compose up --build
```

Servicios:

- API: http://localhost:4000/health
- Web: http://localhost:5173

## Credenciales iniciales

- Usuario: `admin@auderis.local`
- Contraseña: `Admin123!`

## Probar la API (curl)

```bash
# Health check
curl http://localhost:4000/health

# Login
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@auderis.local","password":"Admin123!"}'

# Listar clientes (usa el token del login)
curl http://localhost:4000/clients \
  -H "Authorization: Bearer <TOKEN>"

# Crear cliente
curl -X POST http://localhost:4000/clients \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Cliente Nuevo","taxId":"0801199912345","contact":"contacto@cliente.com"}'

# Listar auditorías
curl http://localhost:4000/audits \
  -H "Authorization: Bearer <TOKEN>"

# Crear auditoría
curl -X POST http://localhost:4000/audits \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Auditoría 2024","scope":"Finanzas","clientId":"<CLIENT_ID>"}'
```

## Notas de arquitectura

- Backend: Node.js 20 + TypeScript + Express (ESM) + Prisma + PostgreSQL
- Frontend: React + Vite + TypeScript
- Autenticación: JWT + bcrypt
- Validación: Zod
- Docker: `docker compose` con servicios `db`, `backend`, `web`
- En Docker se usa `prisma migrate deploy` y seed idempotente

## Solución a errores comunes

Si el backend falla con errores de Prisma relacionados a OpenSSL (por ejemplo, `failed to detect the libssl/openssl version`), reconstruye el contenedor con `docker compose up --build`. La imagen del backend usa Debian Slim e instala OpenSSL durante el build para evitar este problema.