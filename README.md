# Prueba Técnica FS — Pokémon Favorites

Aplicación full stack que consume la PokéAPI para listar y detallar pokémones, permite gestionar favoritos con persistencia en PostgreSQL y sincroniza cambios en tiempo real con Socket.IO.

## 1) Descripción breve del proyecto y decisiones técnicas

### Funcionalidad principal
- Listado paginado de pokémones (`GET /pokemon`)
- Detalle de pokémon por nombre (`GET /pokemon/:name`)
- CRUD de favoritos en BD local (`POST`, `GET`, `DELETE`)
- Edición de nota personal por favorito (`PATCH /favorites/:id/note`)
- Sincronización en tiempo real entre clientes conectados (`favorite:added`, `favorite:removed`, `favorite:updated`)

### Decisiones técnicas
- **Backend:** Node.js + Express + TypeScript
- **Frontend:** React + TypeScript + Axios
- **Base de datos:** PostgreSQL (dockerizada)
- **Sockets:** Socket.IO
- **Arquitectura:** separación por responsabilidades en `routes`, `controllers`, `services`, `db`, `sockets`, `config`
- **Configuración:** variables de entorno en `.env` y `.env.example`

---

## 2) Requisitos previos

- Node.js 20+
- npm 10+ (o versión compatible con Node 20)
- Docker Desktop 4+ (con `docker compose`)

---

## 3) Instrucciones de instalación y ejecución (paso a paso)

### Paso 1: clonar el repositorio
```bash
git clone <URL_DEL_REPO>
cd pruebaTecnicaFS
```

### Paso 2: configurar variables de entorno

Crear archivo `backend/.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=prueba_fs
DB_USER=postgres
DB_PASSWORD=postgres

POKEAPI_BASE_URL=https://pokeapi.co/api/v2
FRONTEND_ORIGIN=http://localhost:5173
```

Crear archivo `frontend/.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

### Paso 3: levantar PostgreSQL dockerizado

Desde la raíz del proyecto:

```bash
docker compose up -d
```

Verificar estado:

```bash
docker compose ps
```

### Paso 4: ejecutar migración de favoritos

Desde la raíz del proyecto:

```bash
docker compose exec -T db psql -U postgres -d prueba_fs < backend/src/db/migrations/001_create_favorites.sql
```

### Paso 5: instalar dependencias y ejecutar backend

```bash
cd backend
npm install
npm run dev
```

### Paso 6: instalar dependencias y ejecutar frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev
```

---

## 4) Puertos utilizados por cada servicio

- **Frontend (Vite):** `5173`
- **Backend (Express + Socket.IO):** `3000`
- **PostgreSQL (Docker):** `5432`

---

## 5) Cómo probar el feature de tiempo real

1. Asegúrate de tener corriendo:
   - frontend en `http://localhost:5173`
   - backend en `http://localhost:3000`
2. Abre dos pestañas en `http://localhost:5173`.
3. En la pestaña A, agrega un pokémon a favoritos.
4. En la pestaña B, verifica que aparece automáticamente sin refrescar.
5. En la pestaña A, elimina un favorito.
6. En la pestaña B, verifica que desaparece automáticamente sin refrescar.
7. (Opcional) Edita la nota en A y verifica actualización en B en tiempo real.

---

## 6) Endpoints del backend

### Health
- `GET /health`
- `GET /db-health`

### Pokémon
- `GET /pokemon?limit=20&offset=0`
- `GET /pokemon/:name`

### Favoritos
- `GET /favorites`
- `POST /favorites`
- `PATCH /favorites/:id/note`
- `DELETE /favorites/:id`

### Ejemplos rápidos con curl

Crear favorito:
```bash
curl -X POST http://localhost:3000/favorites \
  -H "Content-Type: application/json" \
  -d "{\"pokemon_name\":\"pikachu\",\"pokemon_id\":25,\"image_url\":\"https://example.com/pikachu.png\"}"
```

Editar nota:
```bash
curl -X PATCH http://localhost:3000/favorites/1/note \
  -H "Content-Type: application/json" \
  -d "{\"note\":\"Mi favorito por su velocidad\"}"
```

Eliminar favorito:
```bash
curl -X DELETE http://localhost:3000/favorites/1
```

---

## 7) Tests

Tests mínimos implementados con Vitest + Supertest:
- `GET /health` responde `200` y `OK`
- validación de `POST /favorites` sin `pokemon_name`
- validación de `PATCH /favorites/:id/note` con longitud inválida
- ruta inexistente responde `404`

Ejecutar tests:

```bash
cd backend
npm test
```