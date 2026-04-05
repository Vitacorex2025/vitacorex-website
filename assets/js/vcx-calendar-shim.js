/**
 * VCX Calendar Static Hosting Shim v2
 * Intercepts /api/calendar/* fetch calls and uses localStorage when no backend.
 * Data contract matches vcx-deadline-calendar.js expectations exactly.
 * Must load BEFORE vcx-deadline-calendar.js
 */
(function() {
  'use strict';
  var isStatic = !window.VCX_API_BASE && (location.protocol === 'https:' || location.protocol === 'file:' ||
    location.hostname.indexOf('github.io') !== -1 ||
    location.hostname.indexOf('vitacorexllc.com') !== -1 ||
    location.hostname === 'localhost' || location.hostname === '127.0.0.1');
  if (!isStatic) return;

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

  /** Extract date (YYYY-MM-DD) from event's start_at field */
  function eventDate(ev) {
    return (ev.start_at || '').slice(0, 10);
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
    if (url.indexOf('/register') !== -1 && method === 'POST') {
      return ok({ owner_id: Math.random().toString(36).slice(2, 14), name: body.name || 'User' });
    }

    // GET /home — return kpi object matching deadline-calendar expectations
    if (url.indexOf('/home') !== -1 && method === 'GET') {
      var today = new Date().toISOString().slice(0, 10);
      var thisMonth = today.slice(0, 7);
      var scheduled = db.events.filter(function(e) { return e.status !== 'completed' && e.status !== 'canceled'; });
      var overdue = scheduled.filter(function(e) { return eventDate(e) < today; }).length;
      var dueToday = scheduled.filter(function(e) { return eventDate(e) === today; }).length;
      var highPriority = scheduled.filter(function(e) { return e.priority === 'high'; }).length;
      var monthTotal = db.events.filter(function(e) { return eventDate(e).slice(0, 7) === thisMonth; }).length;

      return ok({
        kpi: {
          overdue: overdue,
          due_today: dueToday,
          high_priority: highPriority,
          month_total: monthTotal
        }
      });
    }

    // GET /month/YYYY-MM — filter events by start_at, notes by note_date, return day_notes
    if (url.indexOf('/month/') !== -1 && method === 'GET') {
      var mo = url.split('/month/')[1].split('?')[0];
      return ok({
        events: db.events.filter(function(e) { return eventDate(e).indexOf(mo) === 0; }),
        day_notes: db.notes.filter(function(n) { return n.note_date && n.note_date.indexOf(mo) === 0; })
      });
    }

    // GET /day/YYYY-MM-DD — filter events by start_at date, return day_note (singular)
    if (url.indexOf('/day/') !== -1 && method === 'GET') {
      var dy = url.split('/day/')[1].split('?')[0];
      var dayEvents = db.events.filter(function(e) { return eventDate(e) === dy; });
      var dayNotes = db.notes.filter(function(n) { return n.note_date === dy; });
      // Calendar expects day_note (singular) — return last note for the day
      var dayNote = dayNotes.length > 0 ? dayNotes[dayNotes.length - 1] : null;
      return ok({
        date: dy,
        events: dayEvents,
        day_note: dayNote
      });
    }

    // PUT /events/:id — mark event as completed
    if (url.indexOf('/events/') !== -1 && method === 'PUT') {
      var putId = url.split('/events/')[1].split('?')[0];
      db.events = db.events.map(function(e) {
        if (e.id === putId) {
          return Object.assign({}, e, body);
        }
        return e;
      });
      saveDB(db);
      var updated = db.events.find(function(e) { return e.id === putId; });
      return ok({ event: updated || {} });
    }

    // POST /events — create event with defaults
    if (url.indexOf('/events') !== -1 && method === 'POST') {
      body.id = Math.random().toString(36).slice(2, 10);
      if (!body.status) body.status = 'scheduled';
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

    // POST /notes — save note with note_date field
    if (url.indexOf('/notes') !== -1 && method === 'POST') {
      // If note for this date already exists, update it
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

    return origFetch.apply(this, arguments);
  };

  console.info('[VCX Calendar] Static hosting — localStorage mode (v2)');
})();
