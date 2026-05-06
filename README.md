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

## 3) Instrucciones de instalación y ejecución (vía Docker)

El proyecto está completamente dockerizado. Para levantarlo, sigue estos pasos:

### Paso 1: clonar el repositorio
```bash
git clone <URL_DEL_REPO>
cd pruebaTecnicaFS
```

### Paso 2: configurar variables de entorno (opcional)
Los archivos `docker-compose.yml` y los Dockerfiles ya incluyen valores por defecto funcionales. Si necesitas cambiarlos, puedes editar el archivo `docker-compose.yml` o crear los archivos `.env` en las carpetas `backend/` y `frontend/`.

### Paso 3: levantar la aplicación
Desde la raíz del proyecto, ejecuta:

```bash
docker-compose up --build
```

Este comando:
1. Construirá las imágenes del Backend (Node.js) y Frontend (React/Nginx).
2. Levantará un contenedor de PostgreSQL.
3. **Ejecutará automáticamente las migraciones** para crear las tablas necesarias en la base de datos.
4. Sincronizará los tres servicios.

Una vez que los logs indiquen que los servicios están listos, accede a:
- **Frontend:** [http://localhost:5173](http://localhost:5173)
- **Backend API:** [http://localhost:3000](http://localhost:3000)

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
docker-compose exec backend npm test
```