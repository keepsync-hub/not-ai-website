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
    ".section__title, .section__lead, .chain, .compare, .cards, .verdi, .register, .hero__stats"
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

  function persist(data) {
    /* Sin backend: guardamos localmente para no perder el lead.
       Reemplazá este bloque por un POST a tu endpoint / CRM cuando esté listo. */
    try {
      var key = "notai_leads";
      var leads = JSON.parse(localStorage.getItem(key) || "[]");
      leads.push(data);
      localStorage.setItem(key, JSON.stringify(leads));
    } catch (e) { /* almacenamiento no disponible: seguimos igual */ }
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validate()) {
      var firstInvalid = form.querySelector(".invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = {
      nombre: form.elements.nombre.value.trim(),
      email: form.elements.email.value.trim(),
      empresa: form.elements.empresa.value.trim(),
      cargo: form.elements.cargo.value.trim(),
      telefono: form.elements.telefono.value.trim(),
      equipo: form.elements.equipo.value,
      interes: form.elements.interes.value,
      mensaje: form.elements.mensaje.value.trim(),
      fecha: new Date().toISOString()
    };

    persist(data);

    /* Estado de éxito */
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", function () {
      form.reset();
      form.hidden = false;
      if (success) success.hidden = true;
      form.elements.nombre.focus();
    });
  }
})();
