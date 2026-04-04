/**
 * VCX Review Queue — Admin dashboard for matter triage and review.
 * Authenticates via X-Admin-Token, fetches from /api/review/queue.
 *
 * Phase 4A: Added fetch timeout, improved error messages.
 */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';
  var FETCH_TIMEOUT = 15000; // 15 seconds
  var adminToken = '';
  var currentPage = 1;

  var STATUS_COLORS = {
    intake_received: { bg: '#4A6B62', label: 'Intake Received' },
    triage: { bg: '#9A6A20', label: 'In Triage' },
    under_review: { bg: '#2E4F46', label: 'Under Review' },
    action_needed: { bg: '#8B4348', label: 'Action Needed' },
    deliverable_ready: { bg: '#2F6B57', label: 'Deliverable Ready' },
    closed: { bg: '#7BAE9E', label: 'Closed' },
  };

  // DOM
  var authGate = document.getElementById('rqAuthGate');
  var authForm = document.getElementById('rqAuthForm');
  var tokenInput = document.getElementById('rqTokenInput');
  var authError = document.getElementById('rqAuthError');
  var dashboard = document.getElementById('rqDashboard');
  var queueList = document.getElementById('rqQueueList');
  var pagination = document.getElementById('rqPagination');
  var statusFilter = document.getElementById('rqStatusFilter');
  var refreshBtn = document.getElementById('rqRefresh');
  var detailPanel = document.getElementById('rqMatterDetail');

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  /**
   * Phase 4A: Fetch with timeout wrapper.
   */
  function fetchWithTimeout(url, options) {
    var controller = new AbortController();
    var timeoutId = setTimeout(function () { controller.abort(); }, FETCH_TIMEOUT);

    options = options || {};
    options.signal = controller.signal;

    return fetch(url, options).finally(function () {
      clearTimeout(timeoutId);
    });
  }

  // Auth
  if (authForm) {
    authForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      adminToken = tokenInput.value.trim();
      if (!adminToken) { authError.textContent = 'Token required.'; return; }
      try {
        var res = await fetchWithTimeout(API_BASE + '/api/review/queue?per_page=1', {
          headers: { 'X-Admin-Token': adminToken },
        });
        if (res.status === 403) { authError.textContent = 'Invalid admin token.'; return; }
        if (res.status === 429) { authError.textContent = 'Too many attempts. Please wait and try again.'; return; }
        if (!res.ok) throw new Error('Server error ' + res.status);
        authGate.style.display = 'none';
        dashboard.style.display = 'block';
        loadQueue();
      } catch (err) {
        if (err.name === 'AbortError') {
          authError.textContent = 'Request timed out. Please check your connection and try again.';
        } else if (err.name === 'TypeError') {
          authError.textContent = 'Cannot reach server. Please check your connection.';
        } else {
          authError.textContent = 'Cannot reach API: ' + err.message;
        }
      }
    });
  }

  // Queue loader
  async function loadQueue(page) {
    page = page || 1;
    currentPage = page;
    var status = statusFilter ? statusFilter.value : '';
    var url = API_BASE + '/api/review/queue?page=' + page + '&per_page=20';
    if (status) url += '&status=' + encodeURIComponent(status);

    queueList.innerHTML = '<p style="color:var(--vcx-ink-muted,#7BAE9E);">Loading...</p>';

    try {
      var res = await fetchWithTimeout(url, { headers: { 'X-Admin-Token': adminToken } });
      if (res.status === 403) {
        authGate.style.display = '';
        dashboard.style.display = 'none';
        authError.textContent = 'Session expired. Please enter your admin token again.';
        return;
      }
      if (res.status === 429) {
        queueList.innerHTML = '<p style="color:#9A6A20;">Rate limited. Please wait a moment and refresh.</p>';
        return;
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var data = await res.json();
      renderQueue(data);
    } catch (err) {
      if (err.name === 'AbortError') {
        queueList.innerHTML = '<p style="color:#8B4348;">Request timed out. <button onclick="loadQueue(' + page + ')" style="color:#2E4F46;text-decoration:underline;background:none;border:none;cursor:pointer;">Retry</button></p>';
      } else if (err.name === 'TypeError') {
        queueList.innerHTML = '<p style="color:#8B4348;">Cannot reach server. Check your connection. <button onclick="loadQueue(' + page + ')" style="color:#2E4F46;text-decoration:underline;background:none;border:none;cursor:pointer;">Retry</button></p>';
      } else {
        queueList.innerHTML = '<p style="color:#8B4348;">Failed to load queue: ' + esc(err.message) + '</p>';
      }
    }
  }

  function renderQueue(data) {
    if (!data.matters || !data.matters.length) {
      queueList.innerHTML = '<div class="card" style="padding:24px;text-align:center;color:var(--vcx-ink-muted,#7BAE9E);">No matters in queue.</div>';
      pagination.innerHTML = '';
      return;
    }

    var html = '<div class="rq-table-wrap"><table class="rq-table"><thead><tr>';
    html += '<th>Matter ID</th><th>Status</th><th>Priority</th><th>Service</th><th>Urgency</th><th>Contact</th><th>Created</th><th></th>';
    html += '</tr></thead><tbody>';

    data.matters.forEach(function (m) {
      var st = STATUS_COLORS[m.status] || { bg: '#7BAE9E', label: m.status };
      html += '<tr>';
      html += '<td style="font-weight:600;">' + esc(m.matter_id) + '</td>';
      html += '<td><span class="rq-badge" style="background:' + st.bg + ';">' + esc(st.label) + '</span></td>';
      html += '<td style="font-weight:600;">' + (m.triage_score || '\u2014') + '</td>';
      html += '<td>' + esc(m.service_type || '\u2014') + '</td>';
      html += '<td>' + esc(m.urgency || '\u2014') + '</td>';
      html += '<td>' + esc(m.contact_name || '\u2014') + '</td>';
      html += '<td style="font-size:.8rem;color:var(--vcx-ink-muted,#7BAE9E);">' + esc(m.created_at || '\u2014') + '</td>';
      html += '<td><button class="rq-action-btn" data-matter="' + esc(m.matter_id) + '" data-token="' + esc(m.magic_token || '') + '">View</button></td>';
      html += '</tr>';
    });

    html += '</tbody></table></div>';
    queueList.innerHTML = html;

    // Pagination
    var totalPages = Math.ceil(data.total / data.per_page);
    var phtml = '';
    if (totalPages > 1) {
      for (var p = 1; p <= totalPages; p++) {
        phtml += '<button class="rq-page-btn' + (p === data.page ? ' is-active' : '') + '" data-page="' + p + '">' + p + '</button> ';
      }
    }
    phtml += '<span style="font-size:.8rem;color:var(--vcx-ink-muted,#7BAE9E);margin-left:12px;">' + data.total + ' total</span>';
    pagination.innerHTML = phtml;

    // Bind view buttons
    queueList.querySelectorAll('.rq-action-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        loadMatterDetail(btn.getAttribute('data-matter'), btn.getAttribute('data-token'));
      });
    });

    // Bind pagination
    pagination.querySelectorAll('.rq-page-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        loadQueue(parseInt(btn.getAttribute('data-page'), 10));
      });
    });
  }

  // Matter detail (admin view)
  async function loadMatterDetail(matterId, matterToken) {
    detailPanel.style.display = 'block';
    detailPanel.innerHTML = '<p style="color:var(--vcx-ink-muted,#7BAE9E);">Loading matter ' + esc(matterId) + '...</p>';
    detailPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    try {
      var res = await fetchWithTimeout(API_BASE + '/api/matters/' + encodeURIComponent(matterId), {
        headers: { Authorization: 'Bearer ' + matterToken },
      });
      if (res.status === 429) {
        detailPanel.innerHTML = '<p style="color:#9A6A20;">Rate limited. Please wait a moment and try again.</p>';
        return;
      }
      if (!res.ok) throw new Error('HTTP ' + res.status);
      var m = await res.json();
      renderMatterDetail(m);
    } catch (err) {
      if (err.name === 'AbortError') {
        detailPanel.innerHTML = '<p style="color:#8B4348;">Request timed out. Please try again.</p>';
      } else if (err.name === 'TypeError') {
        detailPanel.innerHTML = '<p style="color:#8B4348;">Cannot reach server. Check your connection.</p>';
      } else {
        detailPanel.innerHTML = '<p style="color:#8B4348;">Failed to load matter: ' + esc(err.message) + '</p>';
      }
    }
  }

  function renderMatterDetail(m) {
    var st = STATUS_COLORS[m.status] || { bg: '#7BAE9E', label: m.status };
    var html = '';

    html += '<div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:12px;margin-bottom:20px;">';
    html += '<div>';
    html += '<span class="eyebrow">Matter Detail</span>';
    html += '<h2 style="font-size:1.3rem;margin:.2em 0 .3em;">' + esc(m.matter_id) + '</h2>';
    html += '<span class="rq-badge" style="background:' + st.bg + ';">' + esc(st.label) + '</span>';
    html += ' <span style="font-size:.85rem;color:var(--vcx-ink-muted,#7BAE9E);">' + esc(m.service_type) + ' &mdash; ' + esc(m.urgency) + '</span>';
    html += '</div>';
    html += '<button id="rqCloseDetail" style="padding:8px 16px;border:1px solid rgba(26,47,42,.12);border-radius:8px;background:var(--vcx-bg-surface,#FBF8F3);cursor:pointer;font-size:.85rem;">Close</button>';
    html += '</div>';

    // Triage score
    if (m.triage_score != null) {
      html += '<div style="margin-bottom:20px;">';
      html += '<p style="font-size:.8rem;font-weight:600;margin-bottom:6px;">Priority: ' + m.triage_score + '/100</p>';
      html += '<div style="background:rgba(26,47,42,.06);border-radius:6px;height:8px;overflow:hidden;">';
      html += '<div style="width:' + m.triage_score + '%;height:100%;background:linear-gradient(90deg,#2E4F46,#2F6B57);border-radius:6px;"></div>';
      html += '</div></div>';
    }

    // Status update form
    html += '<div style="background:var(--vcx-bg-surface,#FBF8F3);border:1px solid rgba(26,47,42,.06);border-radius:10px;padding:16px 20px;margin-bottom:20px;">';
    html += '<h3 style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:12px;">Update Status</h3>';
    html += '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;">';
    html += '<select id="rqNewStatus" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(26,47,42,.12);font-size:.85rem;">';
    Object.keys(STATUS_COLORS).forEach(function (key) {
      var sel = key === m.status ? ' selected' : '';
      html += '<option value="' + key + '"' + sel + '>' + STATUS_COLORS[key].label + '</option>';
    });
    html += '</select>';
    html += '<input id="rqNote" type="text" placeholder="Note (optional)" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(26,47,42,.12);font-size:.85rem;flex:1;min-width:200px;">';
    html += '<input id="rqAssign" type="text" placeholder="Assign to" style="padding:8px 14px;border-radius:8px;border:1px solid rgba(26,47,42,.12);font-size:.85rem;width:160px;" value="' + esc(m.assigned_to || '') + '">';
    html += '<button id="rqUpdateBtn" style="padding:8px 20px;background:var(--vcx-brand-primary,#2E4F46);color:#fff;border:none;border-radius:8px;cursor:pointer;font-size:.85rem;">Update</button>';
    html += '</div>';
    html += '<p id="rqUpdateStatus" style="margin-top:6px;font-size:.8rem;"></p>';
    html += '</div>';

    // Checklist
    if (m.checklist && m.checklist.length) {
      html += '<div style="margin-bottom:20px;">';
      html += '<h3 style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Checklist</h3>';
      m.checklist.forEach(function (c) {
        var icon = c.is_complete ? '&#10004;' : '&#9744;';
        html += '<p style="font-size:.85rem;padding:4px 0;">' + icon + ' ' + esc(c.label) + '</p>';
      });
      html += '</div>';
    }

    // Timeline
    if (m.status_events && m.status_events.length) {
      html += '<div style="margin-bottom:20px;">';
      html += '<h3 style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Timeline</h3>';
      m.status_events.forEach(function (e) {
        var est = STATUS_COLORS[e.new_status] || { bg: '#7BAE9E', label: e.new_status };
        html += '<div style="display:flex;gap:10px;padding:6px 0;border-bottom:1px solid rgba(26,47,42,.04);font-size:.85rem;">';
        html += '<div style="width:6px;height:6px;border-radius:50%;background:' + est.bg + ';margin-top:6px;flex-shrink:0;"></div>';
        html += '<div><strong>' + esc(est.label) + '</strong>';
        if (e.note) html += ' &mdash; ' + esc(e.note);
        html += '<br><span style="font-size:.75rem;color:var(--vcx-ink-muted,#7BAE9E);">' + esc(e.created_at) + '</span>';
        html += '</div></div>';
      });
      html += '</div>';
    }

    // Documents
    if (m.documents && m.documents.length) {
      html += '<div style="margin-bottom:20px;">';
      html += '<h3 style="font-size:.8rem;font-weight:700;text-transform:uppercase;letter-spacing:.06em;margin-bottom:10px;">Documents (' + m.documents.length + ')</h3>';
      m.documents.forEach(function (d) {
        html += '<p style="font-size:.85rem;padding:4px 0;border-bottom:1px solid rgba(26,47,42,.04);">' + esc(d.original_name) + ' <span style="color:var(--vcx-ink-muted,#7BAE9E);">' + formatBytes(d.size_bytes) + '</span></p>';
      });
      html += '</div>';
    }

    html += '<p style="font-size:.8rem;color:var(--vcx-ink-muted,#7BAE9E);">Created: ' + esc(m.created_at) + '</p>';

    detailPanel.innerHTML = html;

    // Bind close
    document.getElementById('rqCloseDetail').addEventListener('click', function () {
      detailPanel.style.display = 'none';
    });

    // Bind update
    document.getElementById('rqUpdateBtn').addEventListener('click', async function () {
      var statusEl = document.getElementById('rqUpdateStatus');
      var newStatus = document.getElementById('rqNewStatus').value;
      var note = document.getElementById('rqNote').value.trim();
      var assignTo = document.getElementById('rqAssign').value.trim();
      statusEl.textContent = 'Updating...';

      try {
        var body = { status: newStatus };
        if (assignTo) body.assigned_to = assignTo;
        if (note) body.triage_notes = note;

        var res = await fetchWithTimeout(API_BASE + '/api/review/matters/' + encodeURIComponent(m.matter_id), {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'X-Admin-Token': adminToken },
          body: JSON.stringify(body),
        });
        if (res.status === 429) {
          statusEl.textContent = 'Rate limited. Please wait and try again.';
          statusEl.style.color = '#9A6A20';
          return;
        }
        if (!res.ok) throw new Error('HTTP ' + res.status);
        statusEl.textContent = 'Updated successfully.';
        statusEl.style.color = 'var(--vcx-success,#2F6B57)';
        setTimeout(function () { loadQueue(currentPage); }, 500);
      } catch (err) {
        if (err.name === 'AbortError') {
          statusEl.textContent = 'Update timed out. Please try again.';
        } else {
          statusEl.textContent = 'Update failed: ' + err.message;
        }
        statusEl.style.color = '#8B4348';
      }
    });
  }

  function formatBytes(b) {
    if (!b) return '';
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  // Bind filter & refresh
  if (statusFilter) statusFilter.addEventListener('change', function () { loadQueue(1); });
  if (refreshBtn) refreshBtn.addEventListener('click', function () { loadQueue(currentPage); });

  // Expose loadQueue for retry buttons
  window.loadQueue = loadQueue;
})();
