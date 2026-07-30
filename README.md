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

Es un sitio estático. Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
# luego abrí http://localhost:8000
```

## Formulario de registro → HubSpot

Los campos obligatorios (nombre, email, empresa y aceptación de contacto)
se validan en el cliente. Al enviar, el registro se crea como **contacto
(lead) en HubSpot** mediante la *Forms Submission API*
(`api.hsforms.com`), que es pública y **no requiere ningún token secreto**
—ideal para un sitio estático—. Además, cada registro se guarda en
`localStorage` (`notai_leads`) como respaldo.

### Configuración (una sola vez)

La integración se configura en **`js/config.js`**:

```js
window.NOTAI_CONFIG = {
  hubspot: {
    portalId: "51599870",  // Portal / Hub ID (no es secreto)
    formGuid: "",          // ← pega aquí el GUID del formulario de HubSpot
    region:   "na1"        // na1 = api.hsforms.com · eu1 = api-eu1.hsforms.com
  }
};
```

Pasos:

1. En HubSpot: **Marketing → Formularios → Crear formulario**.
2. Agrega los campos (nombre interno de la propiedad de contacto):
   `email` *(obligatorio)*, `firstname`, `lastname`, `company`,
   `phone`, `message`. HubSpot rechaza cualquier campo que **no** esté
   en el formulario, así que el envío manda solo estos.
3. *(Opcional)* Fija la etapa del ciclo de vida del formulario en **"Lead"**.
4. Publica y copia el **Form GUID**
   (`xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).
5. Pégalo en `formGuid` dentro de `js/config.js` y sube el cambio.

### Mapeo de campos

| Campo del formulario | Propiedad de HubSpot |
| --- | --- |
| Nombre completo | `firstname` + `lastname` (se divide por el primer espacio) |
| Email corporativo | `email` |
| Empresa | `company` |
| Teléfono | `phone` |
| Cargo · Tamaño del equipo · Interés · Mensaje | `message` (combinados) |

> **Mientras `formGuid` esté vacío**, el formulario funciona en modo local
> (solo `localStorage`) sin enviar nada a HubSpot, útil para previsualizar.
