/**
 * VCX Calendar Static Hosting Shim
 * Intercepts /api/calendar/* fetch calls and uses localStorage when no backend.
 * Must load BEFORE vcx-deadline-calendar.js
 */
(function() {
  'use strict';
  var isStatic = !window.VCX_API_BASE && (location.protocol === 'https:' || (location.hostname.indexOf('github.io') !== -1 || location.hostname.indexOf('vitacorexllc.com') !== -1));
  if (!isStatic) return;

  var LK = 'dcal_data';
  var origFetch = window.fetch;

  function getDB() {
    try { return JSON.parse(localStorage.getItem(LK) || '{}'); } catch(e) { return {}; }
  }
  function saveDB(db) { localStorage.setItem(LK, JSON.stringify(db)); }
  function ensureDB(db) { if (!db.events) db.events = []; if (!db.notes) db.notes = []; return db; }
  function ok(data) {
    return Promise.resolve({
      ok: true, status: 200,
      json: function() { return Promise.resolve(Object.assign({ ok: true }, data)); }
    });
  }

  window.fetch = function(url, opts) {
    if (typeof url !== 'string' || url.indexOf('/api/calendar') === -1) {
      return origFetch.apply(this, arguments);
    }

    var db = ensureDB(getDB());
    var method = (opts && opts.method || 'GET').toUpperCase();
    var body = {};
    try { body = opts && opts.body ? JSON.parse(opts.body) : {}; } catch(e) {}

    // POST /register
    if (url.indexOf('/register') !== -1) {
      return ok({ owner_id: Math.random().toString(36).slice(2, 14), name: body.name || 'User' });
    }

    // GET /home
    if (url.indexOf('/home') !== -1) {
      var today = new Date().toISOString().slice(0, 10);
      return ok({
        today_count: db.events.filter(function(e) { return e.date === today; }).length,
        week_count: db.events.length,
        total_events: db.events.length
      });
    }

    // GET /month/YYYY-MM
    if (url.indexOf('/month/') !== -1) {
      var mo = url.split('/month/')[1].split('?')[0];
      return ok({
        events: db.events.filter(function(e) { return e.date && e.date.startsWith(mo); }),
        notes: db.notes.filter(function(n) { return n.date && n.date.startsWith(mo); })
      });
    }

    // GET /day/YYYY-MM-DD
    if (url.indexOf('/day/') !== -1) {
      var dy = url.split('/day/')[1].split('?')[0];
      return ok({
        events: db.events.filter(function(e) { return e.date === dy; }),
        notes: db.notes.filter(function(n) { return n.date === dy; })
      });
    }

    // POST /events
    if (url.indexOf('/events') !== -1 && method === 'POST') {
      body.id = Math.random().toString(36).slice(2, 10);
      db.events.push(body);
      saveDB(db);
      return ok({ event: body });
    }

    // DELETE /events/:id
    if (url.indexOf('/events/') !== -1 && method === 'DELETE') {
      var eid = url.split('/events/')[1].split('?')[0];
      db.events = db.events.filter(function(e) { return e.id !== eid; });
      saveDB(db);
      return ok({});
    }

    // POST /notes
    if (url.indexOf('/notes') !== -1 && method === 'POST') {
      body.id = Math.random().toString(36).slice(2, 10);
      db.notes.push(body);
      saveDB(db);
      return ok({ note: body });
    }

    return origFetch.apply(this, arguments);
  };

  console.info('[VCX Calendar] Static hosting — localStorage mode');
})();
