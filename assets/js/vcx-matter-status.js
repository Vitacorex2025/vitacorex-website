/**
 * VCX Matter Status Page — Client-facing status viewer.
 * Reads ?matter=X&token=Y from the URL, fetches matter detail, renders status.
 *
 * Phase 4A: Added sessionStorage persistence, improved expired-link message.
 */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';
  var STORAGE_KEY_PREFIX = 'vcx_matter_';
  var params = new URLSearchParams(window.location.search);
  var matterId = params.get('matter');
  var token = params.get('token');

  var root = document.getElementById('vcxMatterRoot');
  if (!root) return;

  // Phase 4A: Try sessionStorage if URL params missing
  if (matterId && !token) {
    try {
      token = sessionStorage.getItem(STORAGE_KEY_PREFIX + matterId);
    } catch (e) {}
  }

  if (!matterId || !token) {
    root.innerHTML = '<div class="vcx-result-notice vcx-notice-warning">' +
      '<p style="font-weight:600;margin-bottom:8px;">No matter ID or token provided.</p>' +
      '<p>Please check your link, or <a href="/app/sign-in/" style="color:var(--vcx-brand-primary,#173A63);font-weight:600;">sign in to your client portal</a> to access your matters.</p>' +
      '</div>';
    return;
  }

  // Phase 4A: Save token to sessionStorage for page refresh
  try {
    sessionStorage.setItem(STORAGE_KEY_PREFIX + matterId, token);
  } catch (e) {}

  // Status badge colors
  var STATUS_COLORS = {
    intake_received: { bg: '#355E8A', label: 'Intake Received' },
    triage: { bg: '#9A6A20', label: 'In Triage' },
    under_review: { bg: '#173A63', label: 'Under Review' },
    action_needed: { bg: '#8B4348', label: 'Action Needed' },
    deliverable_ready: { bg: '#2F6B57', label: 'Deliverable Ready' },
    closed: { bg: '#5E6C7B', label: 'Closed' },
  };

  async function loadMatter() {
    root.innerHTML = '<p style="color:var(--vcx-ink-muted,#5E6C7B);">Loading matter\u2026</p>';

    try {
      var res = await fetch(API_BASE + '/api/matters/' + matterId, {
        headers: { Authorization: 'Bearer ' + token },
      });

      if (res.status === 403 || res.status === 401) {
        // Phase 4A: More helpful expired-link message
        try { sessionStorage.removeItem(STORAGE_KEY_PREFIX + matterId); } catch (e) {}
        root.innerHTML = '<div class="vcx-result-notice vcx-notice-warning">' +
          '<p style="font-weight:600;margin-bottom:8px;">This link has expired or is invalid.</p>' +
          '<p>For security, access links expire after a period of time.</p>' +
          '<p style="margin-top:12px;"><a href="/app/sign-in/" style="display:inline-block;padding:10px 24px;background:var(--vcx-brand-primary,#173A63);color:#fff;border-radius:8px;text-decoration:none;font-weight:600;">Request a new access link</a></p>' +
          '<p style="margin-top:12px;font-size:.85rem;color:var(--vcx-ink-muted,#5E6C7B);">Or contact VitaCoreX at (888) 794-8292 for assistance.</p>' +
          '</div>';
        return;
      }
      if (res.status === 429) {
        root.innerHTML = '<div class="vcx-result-notice vcx-notice-warning">Too many requests. Please wait a moment and refresh the page.</div>';
        return;
      }
      if (!res.ok) throw new Error('Server error ' + res.status);
      var data = await res.json();
      renderMatter(data);
    } catch (err) {
      if (err.name === 'TypeError') {
        root.innerHTML = '<div class="vcx-result-notice vcx-notice-warning">Cannot reach server. Please check your connection and try again.</div>';
      } else {
        root.innerHTML = '<div class="vcx-result-notice vcx-notice-warning">Could not load matter. ' + esc(err.message) + '</div>';
      }
    }
  }

  function renderMatter(m) {
    var st = STATUS_COLORS[m.status] || { bg: '#5E6C7B', label: m.status };
    var html = '';

    // Header
    html += '<div style="margin-bottom:24px;">';
    html += '<span class="eyebrow">Matter Status</span>';
    html += '<h1 style="font-size:clamp(1.5rem,3.5vw,2.2rem);margin:.3em 0 .4em;">' + esc(m.matter_id) + '</h1>';
    html += '<span style="display:inline-block;padding:6px 14px;border-radius:20px;font-size:.8rem;font-weight:600;color:#fff;background:' + st.bg + ';">' + esc(st.label) + '</span>';
    html += '<p style="margin-top:12px;font-size:.9rem;color:var(--vcx-ink-muted,#5E6C7B);">' + esc(m.service_type) + ' &mdash; ' + esc(m.urgency) + '</p>';
    html += '</div>';

    // Triage score bar
    if (m.triage_score != null) {
      html += '<div style="margin-bottom:24px;">';
      html += '<p style="font-size:.8rem;font-weight:600;margin-bottom:6px;">Priority Score: ' + m.triage_score + '/100</p>';
      html += '<div style="background:rgba(15,27,45,.06);border-radius:6px;height:8px;overflow:hidden;">';
      html += '<div style="width:' + m.triage_score + '%;height:100%;background:linear-gradient(90deg,#173A63,#2F6B57);border-radius:6px;"></div>';
      html += '</div></div>';
    }

    // Checklist
    if (m.checklist && m.checklist.length) {
      html += '<div class="card" style="margin-bottom:20px;padding:20px 24px;">';
      html += '<h3 style="font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;">Checklist</h3>';
      m.checklist.forEach(function (c) {
        var checked = c.is_complete ? ' checked' : '';
        html += '<label style="display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;font-size:.9rem;">';
        html += '<input type="checkbox"' + checked + ' data-checklist-id="' + c.id + '" onchange="window.VCX_Matter.toggleChecklist(this)" style="width:18px;height:18px;">';
        html += '<span' + (c.is_complete ? ' style="text-decoration:line-through;opacity:.6;"' : '') + '>' + esc(c.label) + '</span>';
        html += '</label>';
      });
      html += '</div>';
    }

    // Timeline
    if (m.status_events && m.status_events.length) {
      html += '<div class="card" style="margin-bottom:20px;padding:20px 24px;">';
      html += '<h3 style="font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;">Timeline</h3>';
      m.status_events.forEach(function (e) {
        var est = STATUS_COLORS[e.new_status] || { bg: '#5E6C7B', label: e.new_status };
        html += '<div style="display:flex;gap:12px;padding:8px 0;border-bottom:1px solid rgba(15,27,45,.06);">';
        html += '<div style="width:8px;height:8px;border-radius:50%;background:' + est.bg + ';margin-top:6px;flex-shrink:0;"></div>';
        html += '<div>';
        html += '<p style="font-size:.85rem;font-weight:600;margin:0;">' + esc(est.label) + '</p>';
        if (e.note) html += '<p style="font-size:.8rem;color:var(--vcx-ink-muted,#5E6C7B);margin:2px 0 0;">' + esc(e.note) + '</p>';
        html += '<p style="font-size:.75rem;color:var(--vcx-ink-muted,#5E6C7B);margin:2px 0 0;">' + esc(e.created_at) + '</p>';
        html += '</div></div>';
      });
      html += '</div>';
    }

    // Documents
    if (m.documents && m.documents.length) {
      html += '<div class="card" style="margin-bottom:20px;padding:20px 24px;">';
      html += '<h3 style="font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;">Documents (' + m.documents.length + ')</h3>';
      m.documents.forEach(function (d) {
        html += '<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid rgba(15,27,45,.06);font-size:.85rem;">';
        html += '<span>' + esc(d.original_name) + '</span>';
        html += '<span style="color:var(--vcx-ink-muted,#5E6C7B);">' + formatBytes(d.size_bytes) + '</span>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Upload more files
    html += '<div class="card" style="margin-bottom:20px;padding:20px 24px;">';
    html += '<h3 style="font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;">Upload Additional Documents</h3>';
    html += '<input type="file" id="vcxStatusUpload" multiple style="margin-bottom:10px;">';
    html += '<button onclick="window.VCX_Matter.uploadFiles()" style="padding:10px 20px;background:var(--vcx-brand-primary,#173A63);color:#fff;border:none;border-radius:6px;cursor:pointer;font-size:.9rem;">Upload</button>';
    html += '<div id="vcxUploadStatus" style="margin-top:8px;font-size:.85rem;"></div>';
    html += '</div>';

    // Deliverables
    if (m.deliverables && m.deliverables.length) {
      html += '<div class="card" style="margin-bottom:20px;padding:20px 24px;">';
      html += '<h3 style="font-size:.85rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;margin-bottom:14px;">Deliverables</h3>';
      m.deliverables.forEach(function (d) {
        var dst = d.status === 'ready' || d.status === 'delivered' ? '#2F6B57' : '#9A6A20';
        html += '<div style="padding:10px 0;border-bottom:1px solid rgba(15,27,45,.06);">';
        html += '<span style="font-weight:600;font-size:.9rem;">' + esc(d.title) + '</span>';
        html += ' <span style="font-size:.75rem;padding:3px 8px;border-radius:10px;background:' + dst + ';color:#fff;">' + esc(d.status) + '</span>';
        if (d.description) html += '<p style="font-size:.8rem;color:var(--vcx-ink-muted,#5E6C7B);margin:4px 0 0;">' + esc(d.description) + '</p>';
        html += '</div>';
      });
      html += '</div>';
    }

    // Created date
    html += '<p style="font-size:.8rem;color:var(--vcx-ink-muted,#5E6C7B);margin-top:16px;">Created: ' + esc(m.created_at) + '</p>';

    // Portal link
    html += '<p style="margin-top:20px;"><a href="/app/vcx-packet-room/" style="color:var(--vcx-brand-primary,#173A63);font-size:.88rem;font-weight:600;">Open full client portal &rarr;</a></p>';

    root.innerHTML = html;
  }

  function esc(s) {
    var d = document.createElement('div');
    d.textContent = s || '';
    return d.innerHTML;
  }

  function formatBytes(b) {
    if (!b) return '\u2014';
    if (b < 1024) return b + ' B';
    if (b < 1048576) return (b / 1024).toFixed(0) + ' KB';
    return (b / 1048576).toFixed(1) + ' MB';
  }

  // Exposed API
  window.VCX_Matter = {
    toggleChecklist: async function (checkbox) {
      var cid = checkbox.getAttribute('data-checklist-id');
      try {
        await fetch(API_BASE + '/api/matters/' + matterId + '/checklist/' + cid, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
          },
          body: JSON.stringify({ is_complete: checkbox.checked }),
        });
      } catch (err) {
        console.error('Checklist update failed', err);
      }
    },
    uploadFiles: async function () {
      var input = document.getElementById('vcxStatusUpload');
      var statusEl = document.getElementById('vcxUploadStatus');
      if (!input.files || !input.files.length) {
        if (statusEl) statusEl.textContent = 'Select files first.';
        return;
      }
      var fd = new FormData();
      for (var i = 0; i < input.files.length; i++) {
        fd.append('files', input.files[i]);
      }
      if (statusEl) statusEl.textContent = 'Uploading\u2026';
      try {
        var res = await fetch(API_BASE + '/api/uploads/' + matterId, {
          method: 'POST',
          headers: { Authorization: 'Bearer ' + token },
          body: fd,
        });
        if (res.status === 400 || res.status === 413) {
          var errBody = await res.json().catch(function () { return {}; });
          if (statusEl) statusEl.textContent = errBody.detail || 'File rejected. Check file type and size.';
          return;
        }
        if (res.status === 429) {
          if (statusEl) statusEl.textContent = 'Too many uploads. Please wait and try again.';
          return;
        }
        if (!res.ok) throw new Error('Upload failed');
        var data = await res.json();
        if (statusEl) statusEl.textContent = data.documents.length + ' file(s) uploaded.';
        input.value = '';
        // Reload to show updated document list
        setTimeout(loadMatter, 500);
      } catch (err) {
        if (err.name === 'TypeError') {
          if (statusEl) statusEl.textContent = 'Cannot reach server. Check your connection.';
        } else {
          if (statusEl) statusEl.textContent = 'Upload failed: ' + err.message;
        }
      }
    },
  };

  // Load on page ready
  loadMatter();
})();
