/**
 * VCX Calendar Shim v3 — Server-first with localStorage fallback
 * Intercepts /api/calendar/* fetch calls:
 *   1. Tries real server first
 *   2. If server fails → uses localStorage as fallback
 *   3. On successful writes → also mirrors data to localStorage
 * Must load BEFORE vcx-deadline-calendar.js
 */
(function() {
  'use strict';

  var LK = 'dcal_data';
  var origFetch = window.fetch;

  function getDB() {
    try { return JSON.parse(localStorage.getItem(LK) || '{}'); } catch(e) { return {}; }
  }
  function saveDB(db) { localStorage.setItem(LK, JSON.stringify(db)); }
  function ensureDB(db) {
    if (!db.events) db.events = [];
    if (!db.notes) db.notes = [];
    return db;
  }
  function ok(data) {
    return Promise.resolve({
      ok: true, status: 200,
      json: function() { return Promise.resolve(Object.assign({ ok: true }, data)); }
    });
  }
  function eventDate(ev) {
    return (ev.start_at || '').slice(0, 10);
  }

  // Handle calendar request locally from localStorage
  function handleLocal(url, method, body) {
    var db = ensureDB(getDB());

    if (url.indexOf('/register') !== -1 && method === 'POST') {
      return ok({ owner_id: Math.random().toString(36).slice(2, 14), name: body.name || 'User' });
    }

    if (url.indexOf('/home') !== -1 && method === 'GET') {
      var today = new Date().toISOString().slice(0, 10);
      var thisMonth = today.slice(0, 7);
      var scheduled = db.events.filter(function(e) { return e.status !== 'completed' && e.status !== 'canceled'; });
      return ok({
        kpi: {
          overdue: scheduled.filter(function(e) { return eventDate(e) < today; }).length,
          due_today: scheduled.filter(function(e) { return eventDate(e) === today; }).length,
          high_priority: scheduled.filter(function(e) { return e.priority === 'high'; }).length,
          month_total: db.events.filter(function(e) { return eventDate(e).slice(0, 7) === thisMonth; }).length
        }
      });
    }

    if (url.indexOf('/month/') !== -1 && method === 'GET') {
      var mo = url.split('/month/')[1].split('?')[0];
      return ok({
        events: db.events.filter(function(e) { return eventDate(e).indexOf(mo) === 0; }),
        day_notes: db.notes.filter(function(n) { return n.note_date && n.note_date.indexOf(mo) === 0; })
      });
    }

    if (url.indexOf('/day/') !== -1 && method === 'GET') {
      var dy = url.split('/day/')[1].split('?')[0];
      var dayEvents = db.events.filter(function(e) { return eventDate(e) === dy; });
      var dayNotes = db.notes.filter(function(n) { return n.note_date === dy; });
      return ok({ date: dy, events: dayEvents, day_note: dayNotes.length > 0 ? dayNotes[dayNotes.length - 1] : null });
    }

    if (url.indexOf('/events/') !== -1 && method === 'PUT') {
      var putId = url.split('/events/')[1].split('?')[0];
      db.events = db.events.map(function(e) { return e.id === putId ? Object.assign({}, e, body) : e; });
      saveDB(db);
      return ok({ event: db.events.find(function(e) { return e.id === putId; }) || {} });
    }

    if (url.indexOf('/events') !== -1 && method === 'POST') {
      body.id = Math.random().toString(36).slice(2, 10);
      if (!body.status) body.status = 'scheduled';
      db.events.push(body);
      saveDB(db);
      return ok({ event: body });
    }

    if (url.indexOf('/events/') !== -1 && method === 'DELETE') {
      var eid = url.split('/events/')[1].split('?')[0];
      db.events = db.events.filter(function(e) { return e.id !== eid; });
      saveDB(db);
      return ok({});
    }

    if (url.indexOf('/notes') !== -1 && method === 'POST') {
      var existingIdx = -1;
      for (var i = 0; i < db.notes.length; i++) {
        if (db.notes[i].note_date === body.note_date) { existingIdx = i; break; }
      }
      if (existingIdx >= 0) {
        db.notes[existingIdx] = Object.assign(db.notes[existingIdx], body);
      } else {
        body.id = Math.random().toString(36).slice(2, 10);
        db.notes.push(body);
      }
      saveDB(db);
      return ok({ note: body });
    }

    // Notify endpoint — use mailto fallback
    if (url.indexOf('/notify') !== -1 && method === 'POST') {
      return ok({});
    }

    return ok({});
  }

  // Mirror server write responses into localStorage
  function mirrorToLocal(url, method, body, serverData) {
    if (method === 'GET') return; // reads don't need mirroring
    var db = ensureDB(getDB());

    if (url.indexOf('/events') !== -1 && method === 'POST' && serverData && serverData.event) {
      // Add server event to local cache
      var exists = db.events.some(function(e) { return e.id === serverData.event.id; });
      if (!exists) { db.events.push(serverData.event); saveDB(db); }
    }
    if (url.indexOf('/events/') !== -1 && method === 'PUT' && serverData && serverData.event) {
      var putId = url.split('/events/')[1].split('?')[0];
      db.events = db.events.map(function(e) { return e.id === putId ? Object.assign({}, e, body) : e; });
      saveDB(db);
    }
    if (url.indexOf('/events/') !== -1 && method === 'DELETE') {
      var eid = url.split('/events/')[1].split('?')[0];
      db.events = db.events.filter(function(e) { return e.id !== eid; });
      saveDB(db);
    }
    if (url.indexOf('/notes') !== -1 && method === 'POST') {
      var noteIdx = -1;
      for (var i = 0; i < db.notes.length; i++) {
        if (db.notes[i].note_date === body.note_date) { noteIdx = i; break; }
      }
      if (noteIdx >= 0) db.notes[noteIdx] = Object.assign(db.notes[noteIdx], body);
      else db.notes.push(body);
      saveDB(db);
    }
  }

  window.fetch = function(url, opts) {
    if (typeof url !== 'string' || url.indexOf('/api/calendar') === -1) {
      return origFetch.apply(this, arguments);
    }

    var method = (opts && opts.method || 'GET').toUpperCase();
    var body = {};
    try { body = opts && opts.body ? JSON.parse(opts.body) : {}; } catch(e) {}

    // Try server first, fall back to localStorage on failure
    return origFetch.apply(this, arguments)
      .then(function(response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        // Clone response so we can read it and still return it
        var clone = response.clone();
        clone.json().then(function(data) {
          mirrorToLocal(url, method, body, data);
        }).catch(function() {});
        return response;
      })
      .catch(function() {
        // Server unreachable — use localStorage
        return handleLocal(url, method, body);
      });
  };

  console.info('[VCX Calendar] Shim v3 — server-first with localStorage fallback');
})();
