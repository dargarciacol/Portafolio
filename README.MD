# Santiago García — Portafolio

Portafolio web estático con dos perfiles: **Desarrollo Backend** (Java, Spring Boot, PostgreSQL) y **Ciberseguridad / SOC en formación**.

## Estructura

```text
index.html                         Página de entrada (elige perfil)
pages/portafolio/backend/          Perfil Backend (Bootstrap + css/ + js/)
pages/portafolio/ciberseguridad/   Perfil Ciberseguridad (Tailwind por CDN)
css/  js/                          Estilos y scripts compartidos
assets/docs/                       CV y certificaciones.json
assets/img/  assets/icons/         Imágenes
```

## Ejecutar en local

Los navegadores bloquean `fetch` de archivos locales (necesario para las certificaciones), así que usa un servidor:

```bash
python3 -m http.server 8080
# abrir http://localhost:8080
```

## Administrar certificaciones

Edita `assets/docs/certificaciones.json`. Copia el objeto de `_ejemplo` dentro de la lista `certificaciones` y completa **solo lo que tengas**: los campos vacíos se muestran como "pendiente". Guarda los PDF/imágenes en `assets/docs/certificados/` y referencia la ruta relativa a la raíz (ej. `assets/docs/certificados/curso.pdf`). Con `categoria` eliges en qué página aparece: `backend`, `ciberseguridad`, `redes` o `general` (todas).

## Publicar

Sitio 100 % estático: sirve la raíz del repositorio en Netlify, GitHub Pages o similar (sin paso de compilación). Despliegue actual: https://delightful-llama-ffbd51.netlify.app/

## Notas

- Las páginas de proyectos enlazan a servicios en Render (plan gratuito): pueden tardar en responder al "despertar".
- Contacto del perfil Backend: formulario de [Web3Forms](https://web3forms.com); conviene restringir su clave por dominio en el panel del servicio.

## Contacto

GitHub: https://github.com/dargarciacol · Correo: santigarcua@hotmail.com
