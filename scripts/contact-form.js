(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.CarosseriaContact = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function ajaxEndpoint(action) {
    return String(action).replace(/^https:\/\/formsubmit\.co\//, 'https://formsubmit.co/ajax/');
  }

  function createController({ form, status, button, fetchImpl, getMessage, createFormData }) {
    let pending = false;
    let currentStatusKey = '';

    function renderStatus(key, kind) {
      currentStatusKey = key;
      status.textContent = key ? getMessage(key) : '';
      status.className = `form-status${kind ? ` is-${kind}` : ''}`;
    }

    function refreshMessage() {
      if (currentStatusKey) status.textContent = getMessage(currentStatusKey);
    }

    async function submit(event) {
      event.preventDefault();
      if (pending) return;
      if (typeof form.checkValidity === 'function' && !form.checkValidity()) {
        if (typeof form.reportValidity === 'function') form.reportValidity();
        return;
      }

      pending = true;
      button.disabled = true;
      renderStatus('status.sending', 'sending');
      try {
        const response = await fetchImpl(ajaxEndpoint(form.action), {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body: createFormData(form)
        });
        if (!response.ok) throw new Error(`HTTP ${response.status || 'error'}`);
        const result = await response.json();
        if (!result || (result.success !== true && result.success !== 'true')) throw new Error('Submission not confirmed');
        form.reset();
        renderStatus('status.success', 'success');
      } catch (_) {
        renderStatus('status.error', 'error');
      } finally {
        pending = false;
        button.disabled = false;
      }
    }

    return { submit, refreshMessage };
  }

  function initContactForm(window) {
    const document = window.document;
    const form = document.getElementById('contactForm');
    const status = document.getElementById('formStatus');
    const button = document.getElementById('submitButton');
    if (!form || !status || !button || !window.CarosseriaI18n) return;
    const controller = createController({
      form,
      status,
      button,
      fetchImpl: window.fetch.bind(window),
      getMessage: key => window.CarosseriaI18n.translate(document.documentElement.lang, key),
      createFormData: target => new window.FormData(target)
    });
    form.addEventListener('submit', controller.submit);
    document.addEventListener('carosseria:languagechange', controller.refreshMessage);
  }

  if (typeof window !== 'undefined' && window.document) {
    if (window.document.readyState === 'loading') window.document.addEventListener('DOMContentLoaded', () => initContactForm(window));
    else initContactForm(window);
  }

  return { ajaxEndpoint, createController, initContactForm };
});
