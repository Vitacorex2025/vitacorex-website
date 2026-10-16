/* Website chat (owner 2026-10-16: «Чат Vapi давай сделаем на сайте»).
   Our own launcher button; the Vapi web widget (chat mode, ~650 KB) is loaded only when a visitor opens the chat, then opened
   for them. The public key is a client key by design and is restricted in the Vapi dashboard to https://vitacorexllc.com and to
   the "VitaCoreX Website Chat" assistant only (no transient assistants), so it cannot run anything else on our account. */
(function () {
  'use strict';
  var KEY = '7206ee91-0958-4b62-a525-24d6faaa43b6';
  var AID = '54d364e8-2f13-4b20-99fb-f7812cde23f5';
  var SRC = 'https://unpkg.com/@vapi-ai/client-sdk-react@0.1.1/dist/embed/widget.umd.js';
  var T = {
    en: { btn: 'Chat', aria: 'Open chat with the VitaCoreX assistant', label: 'VitaCoreX assistant', empty: 'Ask about a service, a price or your situation.',
          input: 'Type your message…', fail: 'The chat is unavailable right now. Call (888) 794-8292 or write to info@vitacorexllc.com.' },
    ru: { btn: 'Чат', aria: 'Открыть чат с ассистентом VitaCoreX', label: 'Ассистент VitaCoreX', empty: 'Спросите об услуге, цене или вашей ситуации.',
          input: 'Напишите сообщение…', fail: 'Чат сейчас недоступен. Позвоните (888) 794-8292 или напишите на info@vitacorexllc.com.' },
    es: { btn: 'Chat', aria: 'Abrir el chat con el asistente de VitaCoreX', label: 'Asistente de VitaCoreX', empty: 'Pregunte por un servicio, un precio o su situación.',
          input: 'Escriba su mensaje…', fail: 'El chat no está disponible ahora. Llame al (888) 794-8292 o escriba a info@vitacorexllc.com.' }
  };
  var d = document, btn, widget, loading = false;
  function lang() { var l = (d.documentElement.lang || 'en').slice(0, 2); return T[l] ? l : 'en'; }
  function t(k) { return T[lang()][k]; }

  function isOpen() { return !!(widget && widget.querySelector('input, textarea')); }
  function sync() {   /* our button shows while the panel is closed; the widget's own launcher is never shown */
    var open = isOpen();
    if (widget) widget.classList.toggle('vx-chat--closed', !open);
    if (btn) btn.hidden = open;
    var input = widget && widget.querySelector('input, textarea');
    if (input && input.placeholder !== t('input')) input.placeholder = t('input');
  }
  function makeWidget() {
    widget = d.createElement('vapi-widget');
    var a = { 'public-key': KEY, 'assistant-id': AID, mode: 'chat', theme: 'light', position: 'bottom-right', size: 'compact', radius: 'small',
      'base-color': '#ffffff', 'accent-color': '#0B6E78', 'button-base-color': '#0A2530', 'button-accent-color': '#ffffff',
      'main-label': t('label'), 'empty-chat-message': t('empty') };   /* no assistant-overrides: the chat endpoint answers 400 to them */
    Object.keys(a).forEach(function (k) { widget.setAttribute(k, a[k]); });
    widget.className = 'vx-chat-widget vx-chat--closed';
    d.body.appendChild(widget);
    new MutationObserver(sync).observe(widget, { childList: true, subtree: true });
  }
  function launcher() { return widget && widget.querySelector('.vapi-widget-wrapper [style*="cursor: pointer"]'); }
  function openWidget(tries) {
    var l = launcher();
    if (l) { widget.classList.remove('vx-chat--closed'); l.click(); setTimeout(function () { sync(); var i = widget.querySelector('input, textarea'); if (i) i.focus(); }, 300); return; }
    if (tries > 0) setTimeout(function () { openWidget(tries - 1); }, 150);
    else fail();
  }
  function fail() { loading = false; btn.hidden = false; btn.removeAttribute('aria-busy'); alert(t('fail')); }
  function open() {
    if (widget) { openWidget(20); return; }
    if (loading) return;
    loading = true; btn.setAttribute('aria-busy', 'true');
    /* the widget script mounts into the <vapi-widget> elements that exist when it runs: the element comes first.
       It stays in the language it was opened in; the assistant itself answers in the visitor's language. */
    makeWidget();
    var s = d.createElement('script'); s.src = SRC; s.async = true; s.crossOrigin = 'anonymous';
    s.onload = function () { loading = false; btn.removeAttribute('aria-busy'); openWidget(60); };
    s.onerror = fail;
    d.head.appendChild(s);
  }
  function init() {
    if (btn) return;
    btn = d.createElement('button'); btn.type = 'button'; btn.className = 'vx-chat-btn';
    btn.innerHTML = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true" focusable="false"><path d="M3.5 4.5h13v8.5h-7.5l-3.5 3v-3h-2z" stroke-linejoin="round"/></svg><span></span>';
    var label = function () { btn.querySelector('span').textContent = t('btn'); btn.setAttribute('aria-label', t('aria')); };
    label(); d.addEventListener('vx:lang', label);
    btn.addEventListener('click', open);
    d.body.appendChild(btn);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
