/**
 * VitaCoreX Deadline Calendar — Frontend Logic
 * Mobile-first, simple, premium
 */
(function() {
  'use strict';

  var API = (window.VCX_API_BASE || '') + '/api/calendar';
  var ADMIN_EMAIL = 'vitacorex2025@gmail.com';
  var state = {
    ownerId: localStorage.getItem('dcal_owner_id') || '',
    ownerName: localStorage.getItem('dcal_owner_name') || '',
    ownerEmail: localStorage.getItem('dcal_owner_email') || '',
    isAdmin: localStorage.getItem('dcal_owner_email') === ADMIN_EMAIL,
    currentView: 'home',
    currentMonth: new Date().toISOString().slice(0, 7),
    selectedDate: null,
    monthEvents: [],
    monthNotes: [],
    fortnightStart: null,
    fortnightEvents: [],
    fortnightNotes: []
  };

  var MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var TYPE_ICONS = { hearing: '\u2696', payment: '\uD83D\uDCB0', call: '\uD83D\uDCDE', followup: '\u21BB', doc: '\uD83D\uDCC4' };
  var TYPE_LABELS = { hearing: 'Hearing', payment: 'Payment', call: 'Call', followup: 'Follow-up', doc: 'Document' };

  // ── Init ──────────────────────────────────────────────────────────
  window.addEventListener('DOMContentLoaded', function() {
    if (state.ownerId && state.ownerName) {
      showApp();
    }
  });

  window.dcalRegister = function() {
    var name = document.getElementById('dcalNameInput').value.trim();
    var email = document.getElementById('dcalEmailInput').value.trim();
    if (!name || !email) return;
    var btn = document.getElementById('dcalStartBtn');
    btn.textContent = 'Starting...';
    btn.disabled = true;
    fetch(API + '/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.ok) {
        state.ownerId = d.owner_id;
        state.ownerName = d.name;
        state.ownerEmail = email;
        state.isAdmin = email === ADMIN_EMAIL;
        localStorage.setItem('dcal_owner_id', d.owner_id);
        localStorage.setItem('dcal_owner_name', d.name);
        localStorage.setItem('dcal_owner_email', email);
        showApp();
      }
    })
    .catch(function() {
      state.ownerId = Math.random().toString(36).slice(2, 14);
      state.ownerName = name;
      state.ownerEmail = email;
      state.isAdmin = email === ADMIN_EMAIL;
      localStorage.setItem('dcal_owner_id', state.ownerId);
      localStorage.setItem('dcal_owner_name', name);
      localStorage.setItem('dcal_owner_email', email);
      showApp();
    });
  };

  function showApp() {
    document.getElementById('dcalWelcome').classList.add('dcal-hidden');
    document.getElementById('dcalMain').classList.remove('dcal-hidden');
    var avatar = document.getElementById('dcalAvatar');
    avatar.textContent = state.ownerName.charAt(0).toUpperCase();
    document.getElementById('dcalUserName').textContent = state.ownerName;
    // Admin badge
    var badge = document.querySelector('.dcal-ai-badge');
    if (badge && state.isAdmin) {
      badge.innerHTML = 'Admin &bull; Free Forever';
      badge.style.background = 'linear-gradient(135deg, #1A4F4A, #2D8A82)';
      badge.style.color = '#FFF';
    }
    loadHome();
  }

  // ── View switching ────────────────────────────────────────────────
  window.dcalSwitchView = function(view) {
    state.currentView = view;
    document.querySelectorAll('.dcal-tab').forEach(function(t) {
      t.classList.toggle('active', t.dataset.view === view);
    });
    document.getElementById('dcalHomeView').classList.toggle('dcal-hidden', view !== 'home');
    document.getElementById('dcalMonthView').classList.toggle('dcal-hidden', view !== 'month');
    document.getElementById('dcalDayPanel').classList.add('dcal-hidden');
    if (view === 'home') loadHome();
    if (view === 'month') loadMonth();
  };

  // ── HOME ──────────────────────────────────────────────────────────
  function loadHome() {
    // Initialize fortnight start to Sunday of current week
    if (!state.fortnightStart) {
      var d = new Date();
      d.setHours(12, 0, 0, 0);
      d.setDate(d.getDate() - d.getDay());
      state.fortnightStart = d;
    }
    // Fetch KPI from home endpoint
    fetch(API + '/home?owner_id=' + state.ownerId)
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.ok) renderKpi(d.kpi); })
      .catch(function() {});
    // Fetch 2-week events
    loadFortnightData();
  }

  function renderKpi(kpi) {
    kpi = kpi || {};
    var el = document.getElementById('dcalKpi');
    el.innerHTML =
      kpiCard(kpi.overdue || 0, 'Overdue', 'danger') +
      kpiCard(kpi.due_today || 0, 'Due Today', 'warning') +
      kpiCard(kpi.high_priority || 0, 'High Priority', '') +
      kpiCard(kpi.month_total || 0, 'This Month', '');
  }

  function kpiCard(val, label, cls) {
    return '<div class="dcal-kpi"><div class="dcal-kpi-value ' + cls + '">' + val + '</div><div class="dcal-kpi-label">' + label + '</div></div>';
  }

  // ── 2-WEEK APPLE CALENDAR GRID ──────────────────────────────────
  function loadFortnightData() {
    var start = new Date(state.fortnightStart);
    var end = new Date(start);
    end.setDate(end.getDate() + 13);
    updateFortnightLabel(start, end);

    // Determine which months to fetch
    var startMonth = toDateStr(start).slice(0, 7);
    var endMonth = toDateStr(end).slice(0, 7);
    var months = [startMonth];
    if (endMonth !== startMonth) months.push(endMonth);

    Promise.all(months.map(function(m) {
      return fetch(API + '/month/' + m + '?owner_id=' + state.ownerId)
        .then(function(r) { return r.json(); });
    })).then(function(results) {
      var events = [], notes = [];
      results.forEach(function(d) {
        if (d.ok) {
          events = events.concat(d.events || []);
          notes = notes.concat(d.day_notes || []);
        }
      });
      state.fortnightEvents = events;
      state.fortnightNotes = notes;
      renderFortnight();
    }).catch(function() {
      state.fortnightEvents = [];
      state.fortnightNotes = [];
      renderFortnight();
    });
  }

  function renderFortnight() {
    var start = new Date(state.fortnightStart);
    var today = new Date().toISOString().slice(0, 10);

    // Build event lookup by date
    var eventsByDate = {};
    (state.fortnightEvents || []).forEach(function(ev) {
      var d = ev.start_at.slice(0, 10);
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push(ev);
    });

    // Build note lookup by date
    var notesByDate = {};
    (state.fortnightNotes || []).forEach(function(n) {
      notesByDate[n.note_date] = n;
    });

    var cells = '';
    for (var i = 0; i < 14; i++) {
      var d = new Date(start);
      d.setDate(d.getDate() + i);
      var dateKey = toDateStr(d);
      var dayEvents = (eventsByDate[dateKey] || []).filter(function(e) { return e.status !== 'canceled'; });
      var dayNote = notesByDate[dateKey];
      var isToday = dateKey === today;
      var isPast = dateKey < today && !isToday;
      var hasOverdue = dayEvents.some(function(e) { return e.status === 'scheduled' && e.start_at.slice(0, 10) < today; });

      var cls = 'dcal-fn-cell';
      if (isToday) cls += ' is-today';
      if (isPast) cls += ' is-past';
      if (dayEvents.length) cls += ' has-events';
      if (hasOverdue) cls += ' has-overdue';
      if (dateKey === state.selectedDate) cls += ' selected';
      if (d.getDay() === 0 || d.getDay() === 6) cls += ' is-weekend';

      cells += '<div class="' + cls + '" onclick="dcalOpenDay(\'' + dateKey + '\')">';
      cells += '<div class="dcal-fn-num' + (isToday ? ' today-circle' : '') + '">' + d.getDate() + '</div>';

      // Show up to 3 events with VISIBLE TEXT (not dots)
      var maxShow = 3;
      for (var j = 0; j < Math.min(dayEvents.length, maxShow); j++) {
        var ev = dayEvents[j];
        var done = ev.status === 'completed';
        cells += '<div class="dcal-cell-chip ' + ev.event_type + (done ? ' done' : '') + '">';
        cells += '<span class="dcal-chip-bar"></span>';
        cells += '<span class="dcal-chip-text">' + esc(ev.title) + '</span>';
        cells += '</div>';
      }
      if (dayEvents.length > maxShow) {
        cells += '<div class="dcal-cell-more">+' + (dayEvents.length - maxShow) + ' more</div>';
      }

      // Note indicator
      if (dayNote && dayNote.short_text) {
        cells += '<div class="dcal-cell-note">\u270E ' + esc(dayNote.short_text) + '</div>';
      }

      cells += '</div>';
    }
    document.getElementById('dcalFortnightGrid').innerHTML = cells;
  }

  function updateFortnightLabel(start, end) {
    var sMonth = MONTHS[start.getMonth()];
    var eMonth = MONTHS[end.getMonth()];
    var label;
    if (start.getFullYear() === end.getFullYear()) {
      if (start.getMonth() === end.getMonth()) {
        label = sMonth + ' ' + start.getDate() + ' \u2013 ' + end.getDate() + ', ' + start.getFullYear();
      } else {
        label = sMonth.slice(0, 3) + ' ' + start.getDate() + ' \u2013 ' + eMonth.slice(0, 3) + ' ' + end.getDate() + ', ' + end.getFullYear();
      }
    } else {
      label = sMonth.slice(0, 3) + ' ' + start.getDate() + ', ' + start.getFullYear() + ' \u2013 ' + eMonth.slice(0, 3) + ' ' + end.getDate() + ', ' + end.getFullYear();
    }
    var el = document.getElementById('dcalFortnightLabel');
    if (el) el.textContent = label;
  }

  function toDateStr(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  window.dcalPrevFortnight = function() {
    var d = new Date(state.fortnightStart);
    d.setDate(d.getDate() - 14);
    state.fortnightStart = d;
    loadFortnightData();
  };

  window.dcalNextFortnight = function() {
    var d = new Date(state.fortnightStart);
    d.setDate(d.getDate() + 14);
    state.fortnightStart = d;
    loadFortnightData();
  };

  window.dcalGoToday = function() {
    var d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    state.fortnightStart = d;
    loadHome();
  };

  // ── MONTH ─────────────────────────────────────────────────────────
  function loadMonth() {
    document.getElementById('dcalMonthLabel').textContent = formatMonthLabel(state.currentMonth);
    fetch(API + '/month/' + state.currentMonth + '?owner_id=' + state.ownerId)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (d.ok) {
          state.monthEvents = d.events || [];
          state.monthNotes = d.day_notes || [];
          renderGrid();
        }
      })
      .catch(function() { renderGrid(); });
  }

  window.dcalPrevMonth = function() {
    var parts = state.currentMonth.split('-');
    var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1;
    m--; if (m < 0) { m = 11; y--; }
    state.currentMonth = y + '-' + pad(m + 1);
    loadMonth();
  };

  window.dcalNextMonth = function() {
    var parts = state.currentMonth.split('-');
    var y = parseInt(parts[0]), m = parseInt(parts[1]) - 1;
    m++; if (m > 11) { m = 0; y++; }
    state.currentMonth = y + '-' + pad(m + 1);
    loadMonth();
  };

  function renderGrid() {
    var parts = state.currentMonth.split('-');
    var year = parseInt(parts[0]), month = parseInt(parts[1]) - 1;
    var firstDay = new Date(year, month, 1).getDay();
    var daysInMonth = new Date(year, month + 1, 0).getDate();
    var today = new Date().toISOString().slice(0, 10);

    var eventsByDate = {};
    state.monthEvents.forEach(function(ev) {
      var d = ev.start_at.slice(0, 10);
      if (!eventsByDate[d]) eventsByDate[d] = [];
      eventsByDate[d].push(ev);
    });

    var cells = '';
    // Previous month padding
    var prevDays = new Date(year, month, 0).getDate();
    for (var p = firstDay - 1; p >= 0; p--) {
      cells += '<div class="dcal-day-cell other-month"><span class="dcal-day-num">' + (prevDays - p) + '</span></div>';
    }
    // Current month
    for (var d = 1; d <= daysInMonth; d++) {
      var dateKey = year + '-' + pad(month + 1) + '-' + pad(d);
      var hasEv = eventsByDate[dateKey] && eventsByDate[dateKey].length > 0;
      var isToday = dateKey === today;
      var isSel = dateKey === state.selectedDate;
      var hasOverdue = hasEv && eventsByDate[dateKey].some(function(e) { return e.status === 'scheduled' && e.start_at < today; });
      var cls = 'dcal-day-cell';
      if (isToday) cls += ' is-today';
      if (isSel) cls += ' selected';
      if (hasEv) cls += ' has-events';
      if (hasOverdue) cls += ' has-overdue';
      cells += '<div class="' + cls + '" onclick="dcalOpenDay(\'' + dateKey + '\')">' +
        '<span class="dcal-day-num">' + d + '</span></div>';
    }
    // Next month padding
    var totalCells = firstDay + daysInMonth;
    var remaining = 7 - (totalCells % 7);
    if (remaining < 7) {
      for (var n = 1; n <= remaining; n++) {
        cells += '<div class="dcal-day-cell other-month"><span class="dcal-day-num">' + n + '</span></div>';
      }
    }
    document.getElementById('dcalGrid').innerHTML = cells;
  }

  // ── DAY PANEL ─────────────────────────────────────────────────────
  window.dcalOpenDay = function(date) {
    state.selectedDate = date;
    if (state.currentView === 'month') renderGrid();
    if (state.currentView === 'home') renderFortnight();
    document.getElementById('dcalDayPanel').classList.remove('dcal-hidden');

    fetch(API + '/day/' + date + '?owner_id=' + state.ownerId)
      .then(function(r) { return r.json(); })
      .then(function(d) { if (d.ok) renderDayPanel(d); })
      .catch(function() { renderDayPanel({ date: date, events: [], day_note: null }); });
  };

  function renderDayPanel(data) {
    var el = document.getElementById('dcalDayPanel');
    var html = '<div class="dcal-day-panel">';
    html += '<div class="dcal-day-header"><div class="dcal-day-title">' + formatDayLabel(data.date) + '</div>';
    html += '<button class="dcal-day-close" onclick="dcalCloseDay()">&times;</button></div>';

    // Events
    if (data.events.length > 0) {
      html += '<div class="dcal-event-list">';
      data.events.forEach(function(ev) {
        var prCls = ev.priority === 'high' ? ' priority-high' : (ev.priority === 'medium' ? ' priority-medium' : '');
        html += '<div class="dcal-event-item' + prCls + '">';
        html += '<div class="dcal-event-type-icon ' + ev.event_type + '">' + (TYPE_ICONS[ev.event_type] || '\u2022') + '</div>';
        html += '<div class="dcal-event-info"><div class="dcal-event-title-text">' + esc(ev.title) + '</div>';
        html += '<div class="dcal-event-meta">' + (TYPE_LABELS[ev.event_type] || ev.event_type) + ' &bull; ' + ev.priority + ' priority';
        if (ev.start_at.length > 10) html += ' &bull; ' + ev.start_at.slice(11, 16);
        html += '</div></div>';
        html += '<div class="dcal-event-actions">';
        html += '<button class="dcal-event-action dcal-ics-btn" onclick="dcalExportICS(\'' + ev.id + '\')" title="Add to iPhone Calendar">&#128197;</button>';
        if (ev.status === 'scheduled') {
          html += '<button class="dcal-event-action" onclick="dcalCompleteEvent(\'' + ev.id + '\')" title="Complete">&#10003;</button>';
        }
        html += '<button class="dcal-event-action" onclick="dcalDeleteEvent(\'' + ev.id + '\')" title="Delete">&#10005;</button>';
        html += '</div></div>';
      });
      html += '</div>';
    } else {
      html += '<div class="dcal-empty-state">No events for this day</div>';
    }

    // Day note
    var noteVal = data.day_note ? data.day_note.short_text : '';
    html += '<div class="dcal-note-section"><div class="dcal-note-label">Day Note</div>';
    html += '<textarea class="dcal-note-input" id="dcalNoteInput" placeholder="Add a note for this day..." onblur="dcalSaveNote(\'' + data.date + '\')">' + esc(noteVal) + '</textarea></div>';

    // Quick add
    html += '<div class="dcal-section-title" style="margin-top:16px;">Add Event</div>';
    html += '<div class="dcal-quick-add"><input class="dcal-quick-input" id="dcalQuickInput" type="text" placeholder="e.g. Court hearing Smith case at 2pm urgent" oninput="dcalSmartPreview(this)" />';
    html += '<span class="dcal-ai-tag" title="Smart parsing enabled">AI</span>';
    html += '<button class="dcal-add-btn" onclick="dcalQuickAdd(\'' + data.date + '\')">Add</button></div>';
    html += '<div class="dcal-smart-preview" id="dcalSmartPreview"></div>';

    // Type pills
    html += '<div class="dcal-type-pills" id="dcalTypePills">';
    ['followup','hearing','payment','call','doc'].forEach(function(t, i) {
      html += '<button class="dcal-type-pill' + (i === 0 ? ' active' : '') + '" data-type="' + t + '" onclick="dcalSelectType(this)">' + (TYPE_LABELS[t] || t) + '</button>';
    });
    html += '</div>';

    // Priority pills
    html += '<div class="dcal-priority-pills" id="dcalPriorityPills">';
    ['low','medium','high'].forEach(function(p) {
      html += '<button class="dcal-priority-pill ' + p + (p === 'medium' ? ' active' : '') + '" data-priority="' + p + '" onclick="dcalSelectPriority(this)">' + p.charAt(0).toUpperCase() + p.slice(1) + '</button>';
    });
    html += '</div>';

    html += '</div>';
    el.innerHTML = html;
    el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  window.dcalCloseDay = function() {
    state.selectedDate = null;
    document.getElementById('dcalDayPanel').classList.add('dcal-hidden');
    if (state.currentView === 'month') renderGrid();
    if (state.currentView === 'home') renderFortnight();
  };

  window.dcalSelectType = function(btn) {
    document.querySelectorAll('.dcal-type-pill').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
  };

  window.dcalSelectPriority = function(btn) {
    document.querySelectorAll('.dcal-priority-pill').forEach(function(p) { p.classList.remove('active'); });
    btn.classList.add('active');
  };

  // ── Smart Event Parsing ───────────────────────────────────────────
  function dcalSmartParse(text) {
    var raw = text || '';
    var lower = raw.toLowerCase();
    var result = { type: 'followup', time: '09:00', priority: 'medium', title: raw };

    // Detect event type
    if (/\b(hearing|court|trial|deposition)\b/.test(lower)) {
      result.type = 'hearing';
    } else if (/\b(payment|pay|invoice|bill)\b/.test(lower)) {
      result.type = 'payment';
    } else if (/\b(call|phone|dial)\b/.test(lower)) {
      result.type = 'call';
    } else if (/\b(doc|document|file|paperwork|sign)\b/.test(lower)) {
      result.type = 'doc';
    }

    // Detect time — "at 2pm", "at 10am", "at 3:30pm"
    var timeMatch = lower.match(/\bat\s+(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b/);
    if (timeMatch) {
      var h = parseInt(timeMatch[1]);
      var min = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
      if (timeMatch[3] === 'pm' && h < 12) h += 12;
      if (timeMatch[3] === 'am' && h === 12) h = 0;
      result.time = pad(h) + ':' + pad(min);
    } else if (/\bmorning\b/.test(lower)) {
      result.time = '09:00';
    } else if (/\bafternoon\b/.test(lower)) {
      result.time = '14:00';
    } else if (/\bevening\b/.test(lower)) {
      result.time = '18:00';
    }

    // Detect priority
    if (/\b(urgent|critical|asap|important|high\s+priority)\b/.test(lower)) {
      result.priority = 'high';
    } else if (/\b(low\s+priority|whenever|optional)\b/.test(lower)) {
      result.priority = 'low';
    }

    // Clean title: remove time phrases, priority keywords
    var clean = raw;
    clean = clean.replace(/\bat\s+\d{1,2}(?::\d{2})?\s*(?:am|pm)\b/gi, '');
    clean = clean.replace(/\b(morning|afternoon|evening)\b/gi, '');
    clean = clean.replace(/\b(urgent|critical|asap|important|high\s+priority|low\s+priority|whenever|optional)\b/gi, '');
    clean = clean.replace(/\s{2,}/g, ' ').trim();
    result.title = clean || raw;

    return result;
  }

  var _smartParseTimer = null;
  window.dcalSmartPreview = function(inputEl) {
    clearTimeout(_smartParseTimer);
    _smartParseTimer = setTimeout(function() {
      var previewEl = document.getElementById('dcalSmartPreview');
      if (!previewEl) return;
      var val = inputEl.value.trim();
      if (!val) { previewEl.textContent = ''; return; }
      var p = dcalSmartParse(val);
      var typeName = TYPE_LABELS[p.type] || p.type;
      var prioLabel = p.priority.charAt(0).toUpperCase() + p.priority.slice(1) + ' priority';
      previewEl.textContent = '\uD83E\uDD16 ' + typeName + ' \u2022 ' + p.time + ' \u2022 ' + prioLabel;

      // Auto-select type pill
      document.querySelectorAll('.dcal-type-pill').forEach(function(pill) {
        pill.classList.toggle('active', pill.dataset.type === p.type);
      });
      // Auto-select priority pill
      document.querySelectorAll('.dcal-priority-pill').forEach(function(pill) {
        pill.classList.toggle('active', pill.dataset.priority === p.priority);
      });
    }, 200);
  };

  // ── CRUD ──────────────────────────────────────────────────────────
  window.dcalQuickAdd = function(date) {
    var input = document.getElementById('dcalQuickInput');
    var rawTitle = input.value.trim();
    if (!rawTitle) return;

    // Smart parse the natural language input
    var parsed = dcalSmartParse(rawTitle);

    // Use parsed values (pills will already reflect these from live preview)
    var eventType = parsed.type;
    var priority = parsed.priority;
    var title = parsed.title;
    var time = parsed.time;

    fetch(API + '/events?owner_id=' + state.ownerId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title, event_type: eventType, start_at: date + 'T' + time + ':00', priority: priority })
    })
    .then(function(r) { return r.json(); })
    .then(function(d) {
      if (d.ok) {
        input.value = '';
        dcalOpenDay(date);
        if (state.currentView === 'home') loadHome();
      }
    })
    .catch(function() {});
  };

  window.dcalCompleteEvent = function(id) {
    fetch(API + '/events/' + id + '?owner_id=' + state.ownerId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'completed' })
    })
    .then(function(r) { return r.json(); })
    .then(function() {
      dcalOpenDay(state.selectedDate);
      if (state.currentView === 'home') loadHome();
    });
  };

  window.dcalDeleteEvent = function(id) {
    fetch(API + '/events/' + id + '?owner_id=' + state.ownerId, { method: 'DELETE' })
    .then(function(r) { return r.json(); })
    .then(function() {
      dcalOpenDay(state.selectedDate);
      if (state.currentView === 'home') loadHome();
    });
  };

  window.dcalSaveNote = function(date) {
    var input = document.getElementById('dcalNoteInput');
    if (!input) return;
    fetch(API + '/notes?owner_id=' + state.ownerId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note_date: date, short_text: input.value })
    }).catch(function() {});
  };

  // ── PWA Install ────────────────────────────────────────────────────
  var _deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', function(e) {
    e.preventDefault();
    _deferredPrompt = e;
    var banner = document.getElementById('dcalInstallBanner');
    if (banner) banner.classList.remove('dcal-hidden');
  });

  window.dcalInstallPWA = function() {
    if (_deferredPrompt) {
      _deferredPrompt.prompt();
      _deferredPrompt.userChoice.then(function() {
        _deferredPrompt = null;
        var banner = document.getElementById('dcalInstallBanner');
        if (banner) banner.classList.add('dcal-hidden');
      });
    } else {
      // iOS Safari — show manual instructions
      var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert('To add to your home screen:\n\n1. Tap the Share button (square with arrow)\n2. Scroll down and tap "Add to Home Screen"\n3. Tap "Add"');
      } else {
        alert('To install: open browser menu and select "Add to Home Screen" or "Install App"');
      }
    }
  };

  // Show install banner on iOS if not already installed
  if (window.navigator.standalone !== true && /iPad|iPhone|iPod/.test(navigator.userAgent)) {
    var banner = document.getElementById('dcalInstallBanner');
    if (banner) banner.classList.remove('dcal-hidden');
  }

  // ── Notifications (auto-request + event reminders) ────────────────
  function dcalRequestNotifications() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      dcalStartReminders();
      return;
    }
    if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(function(perm) {
        if (perm === 'granted') dcalStartReminders();
      });
    }
  }

  function dcalStartReminders() {
    // Check every 5 minutes for upcoming events
    setInterval(dcalCheckUpcoming, 5 * 60 * 1000);
    dcalCheckUpcoming();
  }

  function dcalCheckUpcoming() {
    if (Notification.permission !== 'granted') return;
    var today = new Date().toISOString().slice(0, 10);
    var nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
    fetch(API + '/day/' + today + '?owner_id=' + state.ownerId)
      .then(function(r) { return r.json(); })
      .then(function(d) {
        if (!d.ok) return;
        (d.events || []).forEach(function(ev) {
          if (ev.status !== 'scheduled') return;
          if (ev.start_at.length < 16) return;
          var parts = ev.start_at.slice(11, 16).split(':');
          var evMin = parseInt(parts[0]) * 60 + parseInt(parts[1]);
          var diff = evMin - nowMinutes;
          // Notify 30 min before and at event time
          var notifKey = 'dcal_notif_' + ev.id + '_' + today;
          if (diff >= 0 && diff <= 30 && !localStorage.getItem(notifKey)) {
            localStorage.setItem(notifKey, '1');
            var typeName = TYPE_LABELS[ev.event_type] || ev.event_type;
            var body = typeName + ' at ' + ev.start_at.slice(11, 16);
            if (diff === 0) body = 'Starting NOW: ' + typeName;
            else body = 'In ' + diff + ' min: ' + typeName;
            new Notification('VCX: ' + ev.title, {
              body: body, icon: '/assets/img/logo.png',
              badge: '/assets/img/logo.png', tag: ev.id
            });
          }
        });
      }).catch(function() {});
  }

  // ── Apple Calendar (.ics) Export ──────────────────────────────────
  window.dcalExportICS = function(eventId) {
    // Find event in current data
    var ev = null;
    var allEvents = (state.fortnightEvents || []).concat(state.monthEvents || []);
    for (var i = 0; i < allEvents.length; i++) {
      if (allEvents[i].id === eventId) { ev = allEvents[i]; break; }
    }
    if (!ev) {
      // Fetch from API
      fetch(API + '/day/' + (state.selectedDate || new Date().toISOString().slice(0,10)) + '?owner_id=' + state.ownerId)
        .then(function(r) { return r.json(); })
        .then(function(d) {
          if (!d.ok) return;
          (d.events || []).forEach(function(e) {
            if (e.id === eventId) dcalDownloadICS(e);
          });
        });
      return;
    }
    dcalDownloadICS(ev);
  };

  function dcalDownloadICS(ev) {
    var startDT = ev.start_at.replace(/[-:]/g, '').replace('T', 'T');
    if (startDT.length === 8) startDT += 'T090000';
    if (startDT.length < 15) startDT = startDT.slice(0, 9) + '090000';
    // End time = start + 1 hour
    var startDate = new Date(ev.start_at.length >= 16 ? ev.start_at : ev.start_at + 'T09:00');
    var endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
    var endDT = endDate.toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '').replace('Z', '');

    var typeName = TYPE_LABELS[ev.event_type] || ev.event_type;
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//VitaCoreX//Deadline Command Center//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + ev.id + '@vitacorex.com',
      'DTSTART:' + startDT,
      'DTEND:' + endDT,
      'SUMMARY:' + ev.title,
      'DESCRIPTION:' + typeName + ' - ' + (ev.priority || 'medium') + ' priority' + (ev.description ? '\\n' + ev.description : ''),
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT30M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder: ' + ev.title,
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = ev.title.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 30) + '.ics';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Auto-request notifications after showing app
  var _origShowApp = showApp;
  showApp = function() {
    _origShowApp();
    // Small delay so UI renders first
    setTimeout(dcalRequestNotifications, 2000);
  };

  // ── Helpers ───────────────────────────────────────────────────────
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function esc(s) { if (!s) return ''; var d = document.createElement('div'); d.textContent = s; return d.innerHTML; }
  function formatMonthLabel(m) {
    var parts = m.split('-');
    return MONTHS[parseInt(parts[1]) - 1] + ' ' + parts[0];
  }
  function formatDayLabel(d) {
    var dt = new Date(d + 'T12:00:00');
    var days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
    return days[dt.getDay()] + ', ' + MONTHS[dt.getMonth()] + ' ' + dt.getDate() + ', ' + dt.getFullYear();
  }

})();
