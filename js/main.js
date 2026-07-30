/* ============================================================
   Not-AI · Landing — interacción del registro
   ============================================================ */
(function () {
  "use strict";

  /* Año dinámico en el footer */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Reveal on scroll ---------- */
  var revealTargets = document.querySelectorAll(
    ".section__title, .section__lead, .chain, .compare, .cards, .verdi, .register, .hero__stats, " +
    ".manifesto__lead, .manifesto__statement, .manifesto__tagline"
  );
  revealTargets.forEach(function (el) { el.setAttribute("data-reveal", ""); });

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealTargets.forEach(function (el) { io.observe(el); });
  } else {
    revealTargets.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- Formulario de registro ---------- */
  var form = document.getElementById("registro-form");
  var success = document.getElementById("registro-success");
  var resetBtn = document.getElementById("registro-reset");
  if (!form) return;

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(name, message) {
    var msgEl = form.querySelector('[data-error-for="' + name + '"]');
    var input = form.elements[name];
    if (msgEl) msgEl.textContent = message || "";
    if (input && input.classList) {
      input.classList.toggle("invalid", !!message);
    }
  }

  function validate() {
    var ok = true;
    var f = form.elements;

    if (!f.nombre.value.trim()) { setError("nombre", "Ingresa tu nombre."); ok = false; }
    else setError("nombre", "");

    if (!f.email.value.trim()) { setError("email", "Ingresa tu email."); ok = false; }
    else if (!EMAIL_RE.test(f.email.value.trim())) { setError("email", "Revisa el formato del email."); ok = false; }
    else setError("email", "");

    if (!f.empresa.value.trim()) { setError("empresa", "Ingresa el nombre de tu empresa."); ok = false; }
    else setError("empresa", "");

    if (!f.acepto.checked) { setError("acepto", "Necesitamos tu autorización para contactarte."); ok = false; }
    else setError("acepto", "");

    return ok;
  }

  /* Limpia el error de un campo mientras el usuario lo corrige */
  ["nombre", "email", "empresa"].forEach(function (name) {
    var input = form.elements[name];
    if (input) input.addEventListener("input", function () { setError(name, ""); });
  });
  form.elements.acepto.addEventListener("change", function () { setError("acepto", ""); });

  var submitBtn = document.getElementById("registro-submit");
  var formError = document.getElementById("registro-form-error");

  function persistLocal(data) {
    /* Respaldo local para no perder el lead si HubSpot no está
       configurado o si la red falla. */
    try {
      var key = "notai_leads";
      var leads = JSON.parse(localStorage.getItem(key) || "[]");
      leads.push(data);
      localStorage.setItem(key, JSON.stringify(leads));
    } catch (e) { /* almacenamiento no disponible: seguimos igual */ }
  }

  /* Configuración de HubSpot (js/config.js) */
  function hubspotConfig() {
    var cfg = (window.NOTAI_CONFIG && window.NOTAI_CONFIG.hubspot) || {};
    if (!cfg.portalId || !cfg.formGuid) return null;
    var host = cfg.region === "eu1" ? "api-eu1.hsforms.com" : "api.hsforms.com";
    return "https://" + host + "/submissions/v3/integration/submit/" +
      cfg.portalId + "/" + cfg.formGuid;
  }

  /* Divide "Nombre Apellido(s)" en firstname / lastname */
  function splitName(fullName) {
    var parts = fullName.trim().split(/\s+/);
    var first = parts.shift() || fullName;
    var last = parts.join(" ");
    return { first: first, last: last };
  }

  /* Envía el registro a HubSpot como contacto (lead).
     Devuelve una promesa que resuelve true/false. */
  function submitToHubSpot(data) {
    var endpoint = hubspotConfig();
    if (!endpoint) return Promise.resolve(null); // HubSpot no configurado aún

    var name = splitName(data.nombre);

    var fields = [
      { name: "email", value: data.email },
      { name: "firstname", value: name.first }
    ];
    if (name.last) fields.push({ name: "lastname", value: name.last });
    if (data.empresa) fields.push({ name: "company", value: data.empresa });
    if (data.telefono) fields.push({ name: "phone", value: data.telefono });
    if (data.mensaje) fields.push({ name: "message", value: data.mensaje });

    var payload = {
      fields: fields,
      context: {
        pageUri: window.location.href,
        pageName: document.title
      }
    };

    return fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.ok;
    }).catch(function () {
      return false;
    });
  }

  function setSubmitting(on) {
    if (!submitBtn) return;
    submitBtn.disabled = on;
    submitBtn.textContent = on ? "Enviando…" : "Solicitar acceso";
  }

  function showSuccess() {
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function showFormError() {
    if (!formError) return;
    formError.textContent =
      "No pudimos enviar tu solicitud en este momento. Revisa tu conexión e inténtalo de nuevo.";
    formError.hidden = false;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (formError) formError.hidden = true;

    if (!validate()) {
      var firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      nombre: form.elements.nombre.value.trim(),
      email: form.elements.email.value.trim(),
      empresa: form.elements.empresa.value.trim(),
      telefono: form.elements.telefono.value.trim(),
      mensaje: form.elements.mensaje.value.trim(),
      fecha: new Date().toISOString()
    };

    /* Respaldo local siempre */
    persistLocal(data);

    setSubmitting(true);
    submitToHubSpot(data).then(function (result) {
      setSubmitting(false);
      // result === null → HubSpot no configurado (modo local): mostramos éxito.
      // result === true → enviado a HubSpot: éxito.
      // result === false → falló el envío: mostramos error y permitimos reintentar.
      if (result === false) {
        showFormError();
      } else {
        showSuccess();
      }
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      if (success) success.hidden = true;
      if (formError) formError.hidden = true;
      form.elements.nombre.focus();
    });
  }
})();
