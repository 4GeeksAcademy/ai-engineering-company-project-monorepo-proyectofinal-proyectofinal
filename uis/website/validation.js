// ===================================================================
// validation.js — TrackFlow
// Validación completa del formulario de solicitud de información
// Mobile-first, tiempo real (input + blur), submit con prevención
// ===================================================================
(function () {
  'use strict';

  // ---- Referencias DOM ------------------------------------------------
  var form = document.getElementById('contactForm');
  if (!form) return;

  // ---- Utilidades -----------------------------------------------------

  /** Busca el error dentro del contenedor más próximo, incluidos grupos. */
  function getErrorSpan(el) {
    var currentContainer = el.parentElement;
    while (currentContainer && currentContainer !== form) {
      var span = currentContainer.querySelector('.field-error');
      if (span) return span;
      currentContainer = currentContainer.parentElement;
    }
    return null;
  }

  // ---- Validadores individuales ---------------------------------------
  // Mensajes de error según BRIEFING / CONTEXT.es.md

  var validators = {
    company: {
      validate: function (value) {
        value = value.trim();
        if (value.length === 0) return { valid: false, message: 'El nombre de la empresa debe tener al menos 2 caracteres' };
        if (value.length < 2) return { valid: false, message: 'El nombre de la empresa debe tener al menos 2 caracteres' };
        return { valid: true };
      }
    },

    contactPerson: {
      validate: function (value) {
        value = value.trim();
        if (value.length === 0) return { valid: false, message: 'Ingresa nombre y apellido del contacto' };
        var words = value.split(/\s+/);
        if (words.length < 2) return { valid: false, message: 'Ingresa nombre y apellido del contacto' };
        return { valid: true };
      }
    },

    email: {
      validate: function (value) {
        value = value.trim();
        if (value.length === 0) return { valid: false, message: 'Ingresa un email corporativo válido (ejemplo: <nombre@empresa.com>)' };
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) return { valid: false, message: 'Ingresa un email corporativo válido (ejemplo: <nombre@empresa.com>)' };
        return { valid: true };
      }
    },

    phone: {
      validate: function (value) {
        value = value.trim();
        if (value.length === 0) return { valid: false, message: 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)' };
        // Debe comenzar con + seguido del código de país
        if (!/^\+/.test(value)) return { valid: false, message: 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)' };
        var digits = value.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) return { valid: false, message: 'El teléfono debe incluir código de país (ejemplo: +1 213 555 0147)' };
        return { valid: true };
      }
    },

    website: {
      validate: function (value) {
        value = value.trim();
        if (value.length === 0) return { valid: true }; // Opcional
        // Debe comenzar con http:// o https://
        if (!/^https?:\/\//i.test(value)) return { valid: false, message: 'Si incluyes sitio web, debe ser una URL válida' };
        try {
          var parsed = new URL(value);
          if (!parsed.host || !parsed.host.includes('.')) return { valid: false, message: 'Si incluyes sitio web, debe ser una URL válida' };
          return { valid: true };
        } catch (_) {
          return { valid: false, message: 'Si incluyes sitio web, debe ser una URL válida' };
        }
      }
    },

    country: {
      validate: function (value) {
        if (!value || value === '') return { valid: false, message: 'Selecciona el país de operación principal' };
        return { valid: true };
      }
    },

    productType: {
      validate: function (value) {
        if (!value || value === '') return { valid: false, message: 'Selecciona el tipo de producto que manejas' };
        return { valid: true };
      }
    },

    volume: {
      validate: function (value) {
        if (!value || value === '') return { valid: false, message: 'Selecciona el volumen mensual estimado' };
        return { valid: true };
      }
    },

    comments: {
      validate: function (value) {
        if (value.length > 500) {
          return { valid: false, message: 'Los comentarios no pueden exceder 500 caracteres (quedan 0)' };
        }
        return { valid: true };
      }
    },

    services: {
      validate: function () {
        var checkboxes = form.querySelectorAll('input[name="services"]:checked');
        if (checkboxes.length === 0) return { valid: false, message: 'Selecciona al menos un servicio de interés' };
        return { valid: true };
      }
    },

    existing3pl: {
      validate: function () {
        var selected = form.querySelector('input[name="existing3pl"]:checked');
        if (!selected) return { valid: false, message: 'Indica si actualmente trabajas con otro proveedor logístico' };
        return { valid: true };
      }
    },

    privacy: {
      validate: function () {
        var checkbox = document.getElementById('privacy');
        if (!checkbox || !checkbox.checked) return { valid: false, message: 'Debes aceptar la política de privacidad para continuar' };
        return { valid: true };
      }
    }
  };

  // ---- Funciones de validación por campo ------------------------------

  /**
   * Valida un campo individual y actualiza su estado visual.
   * @param {string} inputId - id del campo
   * @param {boolean} [force=false] - forzar validación aunque no tenga estado previo
   * @returns {boolean} true si es válido
   */
  function validateField(inputId, force) {
    // Casos especiales que no usan un solo input
    if (inputId === 'services') return validateServices();
    if (inputId === 'existing3pl') return validateExisting3pl();
    if (inputId === 'privacy') return validatePrivacy();

    var input = document.getElementById(inputId);
    if (!input) return true;

    var validator = validators[inputId];
    if (!validator) return true;

    // Si no tiene estado previo y no se fuerza, salir (validación perezosa)
    if (!force && !input.classList.contains('is-invalid') && !input.classList.contains('is-valid')) {
      return true;
    }

    var result = validator.validate(input.value);
    var errorSpan = getErrorSpan(input);
    applyFieldState(input, errorSpan, result);
    return result.valid;
  }

  /** Aplica estado visual de válido/inválido a un campo */
  function applyFieldState(input, errorSpan, result) {
    if (!result.valid) {
      if (errorSpan) {
        errorSpan.textContent = result.message;
        errorSpan.classList.remove('hidden');
      }
      input.classList.add('is-invalid');
      input.classList.remove('is-valid');
    } else {
      if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.add('hidden');
      }
      input.classList.remove('is-invalid');
      input.classList.add('is-valid');
    }
  }

  /** Aplica estado a un grupo (services, existing3pl) usando el .field-error */
  function applyGroupState(errorSpan, result) {
    if (!result.valid) {
      if (errorSpan) {
        errorSpan.textContent = result.message;
        errorSpan.classList.remove('hidden');
      }
      return false;
    } else {
      if (errorSpan) {
        errorSpan.textContent = '';
        errorSpan.classList.add('hidden');
      }
      return true;
    }
  }

  function validateServices() {
    var first = form.querySelector('input[name="services"]');
    var errorSpan = first ? getErrorSpan(first) : null;
    var result = validators.services.validate();
    return applyGroupState(errorSpan, result);
  }

  function validateExisting3pl() {
    var first = form.querySelector('input[name="existing3pl"]');
    var errorSpan = first ? getErrorSpan(first) : null;
    var result = validators.existing3pl.validate();
    return applyGroupState(errorSpan, result);
  }

  function validatePrivacy() {
    var checkbox = document.getElementById('privacy');
    if (!checkbox) return true;
    var errorSpan = getErrorSpan(checkbox);
    var result = validators.privacy.validate();
    applyFieldState(checkbox, errorSpan, result);
    return result.valid;
  }

  // ---- Validación completa del formulario -----------------------------

  function validateAll() {
    var fields = [
      'company', 'contactPerson', 'email', 'phone', 'website',
      'country', 'productType', 'volume', 'comments'
    ];
    var allValid = true;

    fields.forEach(function (id) {
      if (!validateField(id, true)) allValid = false;
    });

    if (!validateServices()) allValid = false;
    if (!validateExisting3pl()) allValid = false;
    if (!validatePrivacy()) allValid = false;

    return allValid;
  }

  // ---- Toast / notificación de éxito ----------------------------------

  function showToast(message) {
    var toast = document.getElementById('toast');
    var toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) {
      alert(message);
      return;
    }

    toastMsg.textContent = message;
    toast.classList.remove('hidden', 'hide');
    toast.classList.add('show');
    setTimeout(function () {
      hideToast();
    }, 7000);
  }

  function hideToast() {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.classList.remove('show');
    toast.classList.add('hide');
    setTimeout(function () {
      toast.classList.add('hidden');
      toast.classList.remove('hide');
    }, 300);
  }

  // ---- Event Listeners ------------------------------------------------

  // Campos de texto/select que se validan con input + blur + change
  var standardFields = [
    'company', 'contactPerson', 'email', 'phone', 'website',
    'country', 'productType', 'volume', 'comments'
  ];

  // Blur: validar siempre al perder el foco
  standardFields.forEach(function (id) {
    var el = document.getElementById(id);
    if (el) {
      el.addEventListener('blur', function () {
        validateField(id, true);
      });
      // Change: para selects (país, producto, volumen)
      el.addEventListener('change', function () {
        validateField(id, true);
      });
      // Input en tiempo real: solo si ya fue tocado
      el.addEventListener('input', function () {
        if (el.classList.contains('is-invalid') || el.classList.contains('is-valid')) {
          validateField(id);
        }
      });
    }
  });

  // Services: change en tiempo real
  var serviceCheckboxes = form.querySelectorAll('input[name="services"]');
  serviceCheckboxes.forEach(function (cb) {
    cb.addEventListener('change', function () {
      validateServices();
    });
  });

  // Existing 3PL: change en tiempo real
  var existing3plRadios = form.querySelectorAll('input[name="existing3pl"]');
  existing3plRadios.forEach(function (radio) {
    radio.addEventListener('change', function () {
      validateExisting3pl();
    });
  });

  // Privacidad: change en tiempo real
  var privacyCheckbox = document.getElementById('privacy');
  if (privacyCheckbox) {
    privacyCheckbox.addEventListener('change', function () {
      validatePrivacy();
    });
  }

  // Contador de caracteres en comments
  var commentsField = document.getElementById('comments');
  var commentsCounter = document.getElementById('commentsCounter');
  if (commentsField && commentsCounter) {
    commentsField.addEventListener('input', function () {
      var len = commentsField.value.length;
      var max = commentsField.getAttribute('maxlength') || '500';
      commentsCounter.textContent = len + ' / ' + max;
    });
  }

  // ---- Submit ---------------------------------------------------------

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    var isValid = validateAll();

    if (!isValid) {
      // Enfocar el primer campo con error
      var firstInvalid = form.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.focus();
      } else {
        // Si no hay input con is-invalid pero hay grupo con error,
        // enfocar el primer elemento del grupo
        var firstService = form.querySelector('input[name="services"]');
        if (firstService && getErrorSpan(firstService) &&
            !getErrorSpan(firstService).classList.contains('hidden')) {
          firstService.focus();
        } else {
          var first3pl = form.querySelector('input[name="existing3pl"]');
          if (first3pl && getErrorSpan(first3pl) &&
              !getErrorSpan(first3pl).classList.contains('hidden')) {
            first3pl.focus();
          }
        }
      }
      return;
    }

    var volumeField = document.getElementById('volume');
    var productTypeField = document.getElementById('productType');
    if (volumeField && volumeField.value === '0-100' && productTypeField && productTypeField.value) {
      var shouldContinue = window.confirm('Para volúmenes menores a 100 envíos mensuales, nuestros servicios podrían no ser la solución más eficiente. ¿Seguro que quieres continuar?');
      if (!shouldContinue) return;
    }

    // Éxito
    showToast('¡Gracias por tu interés en TrackFlow! Hemos recibido tu solicitud. Nuestro equipo comercial revisará tu información y te contactará en las próximas 24-48 horas para agendar una llamada y conocer tus necesidades logísticas en detalle. Si tienes alguna consulta urgente, escríbenos directamente a comercial@trackflow.com');

    // Reset visual de estados después de envío exitoso
    var allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(function (el) {
      el.classList.remove('is-valid', 'is-invalid');
    });
    var allErrors = form.querySelectorAll('.field-error');
    allErrors.forEach(function (el) {
      el.textContent = '';
      el.classList.add('hidden');
    });

    // Opcional: reset del formulario (opcional, se puede activar)
    // form.reset();
  });

  // ---- Reset ----------------------------------------------------------

  form.addEventListener('reset', function () {
    var allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(function (el) {
      el.classList.remove('is-invalid', 'is-valid');
    });
    var allErrors = form.querySelectorAll('.field-error');
    allErrors.forEach(function (el) {
      el.textContent = '';
      el.classList.add('hidden');
    });
    // Resetear contador de caracteres
    if (commentsCounter) {
      commentsCounter.textContent = '0 / 500';
    }
  });

  // ---- Cerrar toast manualmente ---------------------------------------

  var toastClose = document.getElementById('toastClose');
  if (toastClose) {
    toastClose.addEventListener('click', function () {
      hideToast();
    });
  }

})();