# Feed de Instagram en el sitio

La sección "Lo último del jardín" (entre *Nuestra historia* y el catálogo) muestra las últimas
3 publicaciones de `@eljardindejazmin.deco`. Se alimenta de la **Instagram API with Instagram
Login** (Meta) a través de `GET /api/instagram/feed`, que la CDN de Vercel cachea 1 hora.

El token de Meta dura 60 días. Para que no haya que tocar nada, un **Vercel Cron** diario
(`/api/cron/instagram-refresh`) lo renueva cuando tiene más de 7 días y guarda el nuevo en
**Vercel Edge Config** (las env vars no se pueden actualizar en runtime; Edge Config sí).

Si algo falla (token vencido, Instagram caído, sin configurar) la sección simplemente no se
muestra: el sitio nunca se rompe.

## Configuración (una sola vez)

Requisito: la cuenta de Instagram tiene que ser **Creator o Business** (ya lo es).

### 1. App en Meta y token inicial

1. Entrar a <https://developers.facebook.com/apps> con la cuenta de Facebook vinculada a
   Instagram → **Crear app**.
2. Caso de uso: **"Administrar mensajes y contenido en Instagram"**. (No elegir "Insertar
   contenido de Facebook, Instagram y Threads en otros sitios web": eso es oEmbed, sirve para
   incrustar un post suelto por URL pero no da la lista de últimas publicaciones.) Ya no hay
   selector de "tipo Business"; el wizard lo deduce del caso de uso.
3. Completar nombre de la app y mail, crear.
4. Menú izquierdo → **Instagram → Configuración de la API con inicio de sesión de Instagram**.
5. Sección **Generar tokens de acceso** → **Agregar cuenta** → iniciar sesión con
   `@eljardindejazmin.deco` y aceptar.
6. Al lado de la cuenta → **Generar token** → copiarlo (empieza con `IGAA…`, dura 60 días).
   Solo hace falta el permiso `instagram_business_basic`; no agregar el de mensajes.

No hace falta App Review ni publicar la app: en modo desarrollo funciona para la cuenta agregada
en el dashboard, que es la única que leemos.

### 2. Edge Config en Vercel

1. Vercel → proyecto → **Storage** → **Create** → **Edge Config** (nombre p. ej. `jardin`).
2. **Connect project** al proyecto del sitio: Vercel agrega sola la env var `EDGE_CONFIG`.
3. Anotar el **ID** del store (`ecfg_…`) para `EDGE_CONFIG_ID`.

### 3. Token de la API de Vercel

Vercel → avatar → **Account Settings → Tokens → Create**. Scope: la cuenta/equipo donde vive el
proyecto; expiración a gusto (si vence, el cron deja de poder guardar el token y hay que rotarlo).
Es un token de toda la cuenta: solo vive en las env vars del server, nunca en el cliente.

Si el proyecto está bajo un team, anotar también el **Team ID** (Team Settings → General).

### 4. Variables de entorno

Vercel → proyecto → **Settings → Environment Variables** (Production, y Preview si se quiere):

| Variable | Valor |
| --- | --- |
| `INSTAGRAM_ACCESS_TOKEN` | El token del paso 1. Solo se usa hasta que el cron guarde uno en Edge Config. |
| `EDGE_CONFIG` | La agrega Vercel al conectar el store (paso 2). |
| `EDGE_CONFIG_ID` | `ecfg_…` |
| `VERCEL_API_TOKEN` | Token del paso 3. |
| `VERCEL_TEAM_ID` | `team_…` (solo si aplica). |
| `CRON_SECRET` | `openssl rand -hex 32`. Vercel lo manda al invocar el cron. |

Después: **Redeploy** (las env vars nuevas se toman en el próximo deploy) y
`vercel env pull .env.local` para tener todo en local.

### 5. Primera renovación a mano

Verifica todo el circuito y deja el token guardado en Edge Config:

```bash
curl -H "Authorization: Bearer $CRON_SECRET" https://eljardindejazmin.com.ar/api/cron/instagram-refresh
# → {"refreshed":true,"refreshedAt":"…","expiresInDays":60}
```

En Vercel → Storage → el Edge Config tienen que aparecer `instagramToken` y
`instagramTokenRefreshedAt`. Luego `https://eljardindejazmin.com.ar/api/instagram/feed`
devuelve los posts y el sitio muestra la sección.

> Ojo: el token recién generado en Meta necesita **24 h** antes de poder renovarse. Si el curl
> devuelve error de Instagram, esperar un día y repetir. Mientras tanto el feed funciona con
> `INSTAGRAM_ACCESS_TOKEN`.

## Si el token muere igual

Instagram invalida los tokens si Mar cambia la contraseña, cierra sesión en todos los
dispositivos o cambia el tipo de cuenta. Síntoma: la sección desaparece del sitio y en los logs
de `/api/instagram/feed` aparece `Instagram /me/media respondió 400`.

Solución: generar un token nuevo en Meta (paso 1.6), cargarlo en `INSTAGRAM_ACCESS_TOKEN`,
**borrar** las claves `instagramToken` y `instagramTokenRefreshedAt` del Edge Config (para que
gane la env var), redeploy y repetir el paso 5.

## En desarrollo

- `npm run dev` (solo Vite): no hay Functions, la sección no se muestra. Normal.
- `npm run dev:full` (`vercel dev`) con `.env.local`: `http://localhost:3000/api/instagram/feed`
  responde con el token de `INSTAGRAM_ACCESS_TOKEN` (o de Edge Config si `EDGE_CONFIG` está).
- El cron se prueba a mano con el curl del paso 5 contra `localhost:3000`.
