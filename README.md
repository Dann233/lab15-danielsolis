# DiscoStore API

API REST con Node.js, Express 5, SQLite (`node:sqlite`) y Zod para el catálogo de álbumes de música de DiscoStore. Los datos iniciales se cargan desde un archivo JSON a una base de datos SQLite mediante un script de inicialización; a partir de ahí, las operaciones POST, PUT y DELETE modifican la base de datos directamente.

## Requisitos

- Node.js 22 o superior
- npm

## Instalación

```bash
npm install
```

## Configuración de entorno

El servidor lee el host y el puerto desde un archivo `.env`. Copia el archivo de ejemplo y ajusta los valores si lo necesitas:

```bash
cp .env.example .env
```

El contenido predeterminado de `.env`:

```
HOST=localhost
PORT=4321
```

## Poblar la base de datos

Este paso es **obligatorio** antes de iniciar el servidor por primera vez (y cada vez que quieras restablecer los datos iniciales):

```bash
npm run createdb
```

El script lee `data/albumes.json`, crea la tabla `albumes` en `data/discostore.db` y carga los 8 álbumes de ejemplo.

## Ejecutar el servidor

Modo producción:

```bash
npm start
```

Modo desarrollo (recarga automática con `--watch`):

```bash
npm run dev
```

El servidor queda disponible en `http://localhost:4321` (o el host/puerto configurado en `.env`).

## Rutas disponibles

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Información de la API y listado de rutas |
| GET | `/albumes` | Lista todos los álbumes (slug, titulo, artista, genero, anio) |
| GET | `/albumes?include=full` | Lista todos los álbumes con todos los campos |
| GET | `/album/:slug` | Obtiene un álbum completo por su slug |
| GET | `/genero/:genero` | Lista los slugs de los álbumes de un género (sin distinción de mayúsculas) |
| GET | `/search/:text` | Busca álbumes por texto en título, artista, género, sello, resumen o descripción |
| POST | `/albumes` | Crea un nuevo álbum (cuerpo JSON con todos los campos) |
| PUT | `/album/:slug` | Actualiza un álbum existente (cuerpo JSON con todos los campos) |
| DELETE | `/album/:slug` | Elimina un álbum |
| GET | `/imagenes/*` | Sirve imágenes estáticas desde `public/imagenes/` |

## Códigos de estado

| Código | Cuándo ocurre |
|--------|---------------|
| 200 | Lectura exitosa (GET) o actualización exitosa (PUT) |
| 201 | POST exitoso: se creó el recurso; incluye cabecera `Location` con la URL del nuevo álbum |
| 204 | DELETE exitoso: el álbum fue eliminado, sin cuerpo en la respuesta |
| 400 | La validación Zod falló (campo faltante, tipo incorrecto, longitud inválida, etc.) |
| 404 | El álbum solicitado no existe (GET, PUT o DELETE con slug inexistente) |
| 409 | POST o PUT con un slug que ya pertenece a otro álbum |

## Ejemplos de uso con xh

### GET — información de la API

```bash
xh GET localhost:4321/
```

### GET — lista de álbumes (campos resumidos)

```bash
xh GET localhost:4321/albumes
```

### GET — lista de álbumes (todos los campos)

```bash
xh GET localhost:4321/albumes include==full
```

### GET — álbum por slug

```bash
xh GET localhost:4321/album/thriller
```

### GET — álbumes por género

```bash
xh GET localhost:4321/genero/Jazz
```

### GET — búsqueda por texto

```bash
xh GET localhost:4321/search/miles
```

### GET — búsqueda con texto demasiado corto (devuelve 400)

```bash
xh GET localhost:4321/search/ab
```

### POST — crear un álbum (devuelve 201 con Location)

```bash
xh POST localhost:4321/albumes \
  titulo="OK Computer" \
  artista="Radiohead" \
  genero="Rock" \
  anio:=1997 \
  sello="Parlophone" \
  pistas:=12 \
  imagen="ok-computer.avif" \
  slug="ok-computer" \
  resumen="Album de Radiohead que define el rock alternativo de los anos 90." \
  descripcion="Tercer album de Radiohead, considerado uno de los mejores discos de la historia del rock alternativo, con temas como Paranoid Android y No Surprises."
```

### POST — slug duplicado (devuelve 409)

```bash
xh POST localhost:4321/albumes \
  titulo="Thriller Copia" \
  artista="Artista Cualquiera" \
  genero="Pop" \
  anio:=2000 \
  sello="Sello" \
  pistas:=10 \
  imagen="thriller-copia.avif" \
  slug="thriller" \
  resumen="Resumen de prueba." \
  descripcion="Descripcion de prueba para mostrar el error 409."
```

### PUT — actualizar un álbum existente (devuelve 200)

```bash
xh PUT localhost:4321/album/ok-computer \
  titulo="OK Computer OKNOTOK" \
  artista="Radiohead" \
  genero="Rock" \
  anio:=1997 \
  sello="XL Recordings" \
  pistas:=12 \
  imagen="ok-computer.avif" \
  slug="ok-computer" \
  resumen="Edicion remasterizada del album clasico de Radiohead." \
  descripcion="Tercer album de Radiohead en su edicion remasterizada del 20 aniversario, con bonus tracks."
```

### PUT — álbum inexistente (devuelve 404)

```bash
xh PUT localhost:4321/album/no-existe \
  titulo="Nada" artista="Nadie" genero="Pop" anio:=2000 sello="Sello" \
  pistas:=1 imagen="nada.avif" slug="no-existe" \
  resumen="No existe." descripcion="No existe."
```

### DELETE — eliminar un álbum (devuelve 204)

```bash
xh DELETE localhost:4321/album/ok-computer
```

### DELETE — álbum inexistente (devuelve 404)

```bash
xh DELETE localhost:4321/album/no-existe
```
