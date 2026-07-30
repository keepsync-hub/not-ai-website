/* ============================================================
   Not-AI · Configuración de la integración con HubSpot
   ------------------------------------------------------------
   El formulario envía cada registro a HubSpot mediante la
   "Forms Submission API" (pública, no requiere token secreto),
   creando/actualizando un contacto con etapa de ciclo de vida
   "Lead".

   PASO PENDIENTE (una sola vez):
   1. En HubSpot ve a  Marketing → Formularios → Crear formulario.
   2. Agrega estos campos (nombre interno de la propiedad):
        - email        (Email)            · obligatorio
        - firstname    (First Name)
        - lastname     (Last Name)
        - company      (Company Name)
        - phone        (Phone Number)
        - message      (Message)
      NOTA: HubSpot rechaza cualquier campo que no exista en el
      formulario. El envío manda solo estos campos; los datos sin
      campo propio (cargo, tamaño de equipo, interés) se agregan
      dentro de "message".
   3. (Opcional) En las opciones del formulario, fija la
      etapa del ciclo de vida en "Lead" para que los contactos
      entren como leads automáticamente.
   4. Publica el formulario y copia su Form GUID
      (aparece en la URL del editor o en el código embed,
       con formato xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).
   5. Pega ese GUID abajo en FORM_GUID y súbelo al repo.

   Mientras FORM_GUID esté vacío, el formulario sigue funcionando
   en modo local (guarda en localStorage) sin enviar a HubSpot.
   ============================================================ */
window.NOTAI_CONFIG = {
  hubspot: {
    // Portal / Hub ID de tu cuenta de HubSpot (no es secreto).
    portalId: "51599870",

    // GUID del formulario de HubSpot. Pégalo aquí ↓
    formGuid: "986c6383-00e9-485a-8c63-24cf12cc515e",

    // Región de datos de tu cuenta:
    //   "na1" → api.hsforms.com        (Norteamérica, por defecto)
    //   "eu1" → api-eu1.hsforms.com    (Unión Europea)
    region: "na1"
  }
};
