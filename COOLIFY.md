# Despliegue en Coolify con Nixpacks

Esta aplicación es una SPA de Vite. El modelo `PS_Vita.glb` está dentro de `public/`, por lo que Vite lo copia automáticamente a `dist/` durante el build.

## Configuración de la aplicación

- **Build Pack:** `Nixpacks`
- **Base Directory:** `/`
- **Is it a static site?:** activado
- **Publish Directory:** `/dist`
- **Puerto:** `80` (Nginx)
- **Install Command:** `npm ci`
- **Build Command:** `npm run build`
- **Start Command:** vacío

No necesita variables de entorno para funcionar.

## Pasos

1. Conecta el repositorio y selecciona la rama que contiene este proyecto.
2. Configura los valores anteriores en `Configuration > General`.
3. Añade el dominio en Coolify si quieres publicarlo.
4. Ejecuta **Deploy**.

El archivo `nixpacks.toml` ya deja definidos el proveedor Node, `npm ci` y `npm run build`. `package.json` fija Node 22 para evitar que Nixpacks elija una versión incompatible.
