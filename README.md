# Not-AI · Landing de registro

Landing page para captar personas y empresas interesadas en conocer **Not-AI**
(*NotCo, pero para el trabajo · powered by Verdi*) e implementarlo en su empresa.

El contenido y la paleta de colores están tomados del *Elevator Pitch* de Not-AI.

## Paleta

| Uso | Color |
| --- | --- |
| Fondo (casi negro con tinte violeta) | `#0e0d13` |
| Verde lima (firma) | `#c6f135` |
| Magenta / acento | `#f62178` |
| Blanco hueso | `#f2f1ee` |

## Estructura

```
index.html      Marcado de la landing (hero, problema, comparación,
                productos, Verdi y formulario de registro).
css/styles.css  Estilos y sistema de diseño con la paleta de la marca.
js/main.js      Validación del formulario, estado de éxito y animaciones.
```

## Cómo verla

Es un sitio estático. Abrí `index.html` en el navegador, o serví la carpeta:

```bash
python3 -m http.server 8000
# luego abrí http://localhost:8000
```

## Formulario de registro

Los campos obligatorios (nombre, email, empresa y aceptación de contacto)
se validan en el cliente. Al enviar, los datos se guardan en
`localStorage` bajo la clave `notai_leads` como respaldo temporal.

> **Para producción:** reemplazá el bloque `persist()` en `js/main.js` por un
> `POST` a tu endpoint / CRM (por ejemplo HubSpot) para persistir los leads.
