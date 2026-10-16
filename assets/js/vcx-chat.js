/* Website chat (owner 2026-10-16: «Чат Vapi давай сделаем на сайте»; then «найди форму и дизайн, чтобы как будто с ней беседуешь»).
   Our own chat window with the assistant's photo, talking to Vapi's chat endpoint (the same one the Vapi widget uses).
   The public key is a client key by design and is restricted in the Vapi dashboard to https://vitacorexllc.com and to the
   "VitaCoreX Website Chat" assistant only (no transient assistants), so it cannot run anything else on our account. */
(function () {
  'use strict';
  var KEY = '7206ee91-0958-4b62-a525-24d6faaa43b6';
  var AID = '54d364e8-2f13-4b20-99fb-f7812cde23f5';
  var API = 'https://api.vapi.ai/chat/web';
  var AVATAR = '/assets/img/chat/assistant-160.webp', AVATAR_JPG = '/assets/img/chat/assistant-160.jpg';
  var STORE = 'vx-chat-v1';
  var T = {
    en: { btn: 'Chat', open: 'Open chat with the VitaCoreX assistant', title: 'VitaCoreX assistant', sub: 'Virtual assistant · online',
          hello: "Hi! I'm the VitaCoreX virtual assistant. Tell me what you need, and I'll point you to the right service and its price.",
          note: 'Please do not send documents, Social Security or card numbers in the chat.', ph: 'Type a message…', send: 'Send', close: 'Close chat',
          typing: 'typing…', fail: 'Sorry, I can’t answer right now. Please call (888) 794-8292 or write to info@vitacorexllc.com.', restart: 'New chat' },
    ru: { btn: 'Чат', open: 'Открыть чат с ассистентом VitaCoreX', title: 'Ассистент VitaCoreX', sub: 'Виртуальный ассистент · онлайн',
          hello: 'Здравствуйте! Я виртуальный ассистент VitaCoreX. Расскажите, что нужно, — подскажу подходящую услугу и цену.',
          note: 'Пожалуйста, не присылайте в чат документы, номера SSN и карт.', ph: 'Напишите сообщение…', send: 'Отправить', close: 'Закрыть чат',
          typing: 'печатает…', fail: 'Извините, сейчас не могу ответить. Позвоните (888) 794-8292 или напишите на info@vitacorexllc.com.', restart: 'Новый чат' },
    es: { btn: 'Chat', open: 'Abrir el chat con la asistente de VitaCoreX', title: 'Asistente de VitaCoreX', sub: 'Asistente virtual · en línea',
          hello: '¡Hola! Soy la asistente virtual de VitaCoreX. Cuénteme qué necesita y le indico el servicio adecuado y su precio.',
          note: 'Por favor, no envíe documentos ni números de Seguro Social o de tarjeta por el chat.', ph: 'Escriba un mensaje…', send: 'Enviar', close: 'Cerrar el chat',
          typing: 'escribiendo…', fail: 'Lo siento, ahora no puedo responder. Llame al (888) 794-8292 o escriba a info@vitacorexllc.com.', restart: 'Nuevo chat' }
  };
  var d = document, ui = null, busy = false, btn = null;
  var state = load();
  function lang() { var l = (d.documentElement.lang || 'en').slice(0, 2); return T[l] ? l : 'en'; }
  function t(k) { return T[lang()][k]; }
  function load() { try { return JSON.parse(sessionStorage.getItem(STORE)) || { sessionId: null, msgs: [] }; } catch (e) { return { sessionId: null, msgs: [] }; } }
  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(state)); } catch (e) { /* private mode: the chat still works on this page */ } }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  /* assistant text -> safe HTML: escaped first, then only our own links and phone become clickable */
  function rich(s) {
    return esc(s).replace(/https:\/\/vitacorexllc\.com[^\s<)]*/g, function (u) { var c = u.replace(/[.,;:!?]+$/, ''); return '<a href="' + c + '">' + c.replace('https://', '') + '</a>' + u.slice(c.length); })
      .replace(/\(888\) 794-8292/g, '<a href="tel:+18887948292">(888) 794-8292</a>').replace(/\n/g, '<br>');
  }
  function avatar(cls) { return '<picture class="' + cls + '"><source srcset="' + AVATAR + '" type="image/webp"><img src="' + AVATAR_JPG + '" alt="" width="80" height="80" decoding="async"></picture>'; }
  function bubble(role, text) {
    var row = d.createElement('div'); row.className = 'vx-chat__row vx-chat__row--' + role;
    row.innerHTML = (role === 'bot' ? avatar('vx-chat__ava') : '') + '<div class="vx-chat__msg"></div>';
    var m = row.querySelector('.vx-chat__msg');
    if (role === 'bot') m.innerHTML = rich(text); else m.textContent = text;
    ui.list.appendChild(row); ui.list.scrollTop = ui.list.scrollHeight;
    return m;
  }
  function render() {
    ui.list.innerHTML = '';
    bubble('bot', t('hello'));
    var n = d.createElement('p'); n.className = 'vx-chat__note'; n.textContent = t('note'); ui.list.appendChild(n);
    state.msgs.forEach(function (m) { bubble(m.r, m.t); });
  }
  function texts() {
    if (!ui) return;
    ui.panel.setAttribute('aria-label', t('title'));
    ui.panel.querySelector('.vx-chat__name').textContent = t('title');
    ui.panel.querySelector('.vx-chat__sub').textContent = t('sub');
    ui.panel.querySelector('.vx-chat__new').textContent = t('restart');
    ui.panel.querySelector('.vx-chat__x').setAttribute('aria-label', t('close'));
    ui.panel.querySelector('label').textContent = t('ph');
    ui.input.placeholder = t('ph'); ui.send.setAttribute('aria-label', t('send'));
  }
  function grow() { ui.input.style.height = 'auto'; ui.input.style.height = Math.min(ui.input.scrollHeight, 120) + 'px'; }
  function build() {
    ui = {};
    var p = d.createElement('section'); p.className = 'vx-chat'; p.hidden = true; p.setAttribute('role', 'dialog');
    p.innerHTML = '<header class="vx-chat__head">' + avatar('vx-chat__face') +
      '<div class="vx-chat__who"><p class="vx-chat__name"></p><p class="vx-chat__sub"></p></div>' +
      '<button type="button" class="vx-chat__new"></button>' +
      '<button type="button" class="vx-chat__x"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg></button></header>' +
      '<div class="vx-chat__list" aria-live="polite"></div>' +
      '<form class="vx-chat__form"><label class="vx-sr" for="vx-chat-in"></label><textarea id="vx-chat-in" class="vx-chat__in" rows="1" maxlength="1200" autocomplete="off"></textarea>' +
      '<button type="submit" class="vx-chat__send"><svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 10l14-6-5 13-2.5-5.5z" fill="currentColor"/></svg></button></form>';
    d.body.appendChild(p);
    ui.panel = p; ui.list = p.querySelector('.vx-chat__list'); ui.form = p.querySelector('form'); ui.input = p.querySelector('textarea'); ui.send = p.querySelector('.vx-chat__send');
    texts();
    p.querySelector('.vx-chat__x').addEventListener('click', close);
    p.querySelector('.vx-chat__new').addEventListener('click', function () { state = { sessionId: null, msgs: [] }; save(); render(); ui.input.focus(); });
    p.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    ui.input.addEventListener('keydown', function (e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); submit(); } });
    ui.input.addEventListener('input', grow);
    ui.form.addEventListener('submit', function (e) { e.preventDefault(); submit(); });
    render();
  }
  function open() {
    if (!ui) build();
    ui.panel.hidden = false; btn.hidden = true; d.body.classList.add('vx-chat-open');
    ui.list.scrollTop = ui.list.scrollHeight; ui.input.focus();
  }
  function close() { if (!ui) return; ui.panel.hidden = true; btn.hidden = false; d.body.classList.remove('vx-chat-open'); btn.focus(); }
  function submit() {
    var text = ui.input.value.trim();
    if (!text || busy) return;
    ui.input.value = ''; grow();
    state.msgs.push({ r: 'me', t: text }); save(); bubble('me', text);
    ask(text);
  }
  function ask(text) {
    busy = true; ui.send.disabled = true;
    var row = d.createElement('div'); row.className = 'vx-chat__row vx-chat__row--bot';
    row.innerHTML = avatar('vx-chat__ava') + '<div class="vx-chat__msg vx-chat__msg--typing"><span></span><span></span><span></span><em class="vx-sr"></em></div>';
    row.querySelector('em').textContent = t('typing');
    ui.list.appendChild(row); ui.list.scrollTop = ui.list.scrollHeight;
    var msg = row.querySelector('.vx-chat__msg'), out = '';
    var body = { input: text, assistantId: AID, stream: true, sessionEnd: false };
    if (state.sessionId) body.sessionId = state.sessionId;
    var finish = function (ok) {
      busy = false; ui.send.disabled = false;
      if (!ok || !out.trim()) { msg.className = 'vx-chat__msg'; msg.innerHTML = rich(t('fail')); return; }
      state.msgs.push({ r: 'bot', t: out }); save();
    };
    fetch(API, { method: 'POST', headers: { 'Authorization': 'Bearer ' + KEY, 'Content-Type': 'application/json', 'Accept': 'text/event-stream' }, body: JSON.stringify(body) })
      .then(function (res) {
        if (!res.ok || !res.body) throw new Error('chat ' + res.status);
        var reader = res.body.getReader(), dec = new TextDecoder(), buf = '';
        var pump = function () {
          return reader.read().then(function (r) {
            if (r.done) return finish(true);
            buf += dec.decode(r.value, { stream: true });
            var lines = buf.split('\n'); buf = lines.pop();
            lines.forEach(function (line) {
              if (line.indexOf('data:') !== 0) return;
              var j; try { j = JSON.parse(line.slice(5).trim()); } catch (x) { return; }
              if (j.sessionId && !state.sessionId) { state.sessionId = j.sessionId; save(); }
              if (typeof j.delta === 'string' && (!j.path || j.path.indexOf('output') !== -1)) {
                out += j.delta; msg.className = 'vx-chat__msg'; msg.innerHTML = rich(out); ui.list.scrollTop = ui.list.scrollHeight;
              }
            });
            return pump();
          });
        };
        return pump();
      })
      .catch(function () { finish(false); });
  }
  function init() {
    if (btn) return;
    btn = d.createElement('button'); btn.type = 'button'; btn.className = 'vx-chat-btn';
    btn.innerHTML = avatar('vx-chat-btn__ava') + '<span class="vx-chat-btn__label"></span>';
    var label = function () { btn.querySelector('.vx-chat-btn__label').textContent = t('btn'); btn.setAttribute('aria-label', t('open')); texts(); };
    label(); d.addEventListener('vx:lang', label);
    btn.addEventListener('click', open);
    d.body.appendChild(btn);
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
