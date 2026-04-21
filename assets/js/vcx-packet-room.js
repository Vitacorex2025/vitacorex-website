/* ==========================================================
   VCX Packet Room  --  vcx-packet-room.js
   Auth-gated client portal: matters, timeline, docs, comments.
   Phase 3: Wired to /api/portal endpoints with session auth.
   Phase 4A: Added sessionStorage persistence, better error handling.
   ========================================================== */
(function () {
  'use strict';

  var API_BASE = window.VCX_API_BASE || '';
  var STORAGE_KEY = 'vcx_portal_token';
  var STORAGE_CONTACT_KEY = 'vcx_portal_contact';

  // --- Internal state --------------------------------------
  var authToken = null;
  var contactInfo = null;
  var activeMatterId = null;

  // --- DOM refs (match HTML element IDs) -------------------
  var authGate     = document.getElementById('vcxPortalAuth');
  var tokenInput   = document.getElementById('vcxPortalToken');
  var accessBtn    = document.getElementById('vcxPortalAccessBtn');
  var dashboard    = document.getElementById('vcxPortalDashboard');
  var matterList   = document.getElementById('vcxMatterList');
  var matterDetail = document.getElementById('vcxMatterDetail');
  var timeline     = document.getElementById('vcxMatterTimeline');
  var documents    = document.getElementById('vcxMatterDocuments');
  var comments     = document.getElementById('vcxMatterComments');
  var deliverables = document.getElementById('vcxMatterDeliverables');

  // --- Session persistence ---------------------------------
  function saveSession() {
    try {
      if (authToken) sessionStorage.setItem(STORAGE_KEY, authToken);
      if (contactInfo) sessionStorage.setItem(STORAGE_CONTACT_KEY, JSON.stringify(contactInfo));
    } catch (e) { /* sessionStorage unavailable */ }
  }

  function restoreSession() {
    try {
      var saved = sessionStorage.getItem(STORAGE_KEY);
      var savedContact = sessionStorage.getItem(STORAGE_CONTACT_KEY);
      if (saved) {
        authToken = saved;
        if (savedContact) {
          try { contactInfo = JSON.parse(savedContact); } catch (e) {}
        }
        return true;
      }
    } catch (e) { /* sessionStorage unavailable */ }
    return false;
  }

  function clearSession() {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_CONTACT_KEY);
    } catch (e) {}
    authToken = null;
    contactInfo = null;
  }

  // --- Auth flow -------------------------------------------
  if (accessBtn) {
    accessBtn.addEventListener('click', function () {
      var token = tokenInput ? tokenInput.value.trim() : '';
      if (!token) {
        showAuthError('Please enter your access token or email.');
        return;
      }

      // Determine if token or email
      if (token.indexOf('@') > -1) {
        lookupByEmail(token);
      } else {
        verifyToken(token);
      }
    });
  }

  // Handle Enter key in token input
  if (tokenInput) {
    tokenInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (accessBtn) accessBtn.click();
      }
    });
  }

  // Check URL for token param (magic link landing)
  function checkUrlToken() {
    var params = new URLSearchParams(window.location.search);
    var token = params.get('token');
    if (token) {
      if (tokenInput) tokenInput.value = token;
      verifyToken(token);
      return true;
    }
    return false;
  }

  function verifyToken(token) {
    setLoading(true);
    hideAuthMessages();

    fetch(API_BASE + '/api/portal/magic-link/' + encodeURIComponent(token))
      .then(function (res) {
        if (res.status === 404) throw makeAuthError('Token not found. Please check your access link.');
        if (res.status === 429) throw makeAuthError('Too many attempts. Please wait a moment and try again.');
        if (!res.ok) throw makeAuthError('Invalid or expired access link.');
        return res.json();
      })
      .then(function (data) {
        authToken = data.token || token;
        contactInfo = data.contact || null;
        saveSession();
        onAuthenticated(data.matters || []);
      })
      .catch(function (err) {
        if (err.name === 'TypeError') {
          // Network error (fetch failed entirely)
          showAuthError('Cannot reach server. Please check your connection and try again.');
        } else {
          showAuthError(err.userMessage || err.message);
        }
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function lookupByEmail(email) {
    setLoading(true);
    hideAuthMessages();

    fetch(API_BASE + '/api/portal/lookup-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email })
    })
      .then(function (res) {
        if (res.status === 429) throw makeAuthError('Too many attempts. Please wait a moment and try again.');
        if (!res.ok) throw makeAuthError('Lookup failed. Please try again.');
        return res.json();
      })
      .then(function (data) {
        if (data.matters_found > 0) {
          showAuthMessage('Access link has been sent to your email. Please check your inbox.');
        } else {
          showAuthMessage(data.message || 'No active matters found for this email.');
        }
      })
      .catch(function (err) {
        if (err.name === 'TypeError') {
          showAuthError('Cannot reach server. Please check your connection and try again.');
        } else {
          showAuthError(err.userMessage || err.message);
        }
      })
      .finally(function () {
        setLoading(false);
      });
  }

  function makeAuthError(msg) {
    var err = new Error(msg);
    err.userMessage = msg;
    return err;
  }

  function onAuthenticated(matters) {
    if (authGate)  authGate.style.display = 'none';
    if (dashboard) dashboard.style.display = 'block';

    // Show welcome
    if (contactInfo && contactInfo.name) {
      var welcome = document.createElement('div');
      welcome.style.cssText = 'background:var(--vcx-brand-primary,#2E4F46);color:#fff;border-radius:8px;padding:14px 20px;margin-bottom:20px;font-size:.9rem;';
      welcome.innerHTML = 'Welcome, <strong>' + escapeHtml(contactInfo.name) + '</strong>';
      dashboard.insertBefore(welcome, dashboard.firstChild);
    }

    renderMatterList(matters);
  }

  function showAuthError(msg) {
    var el = authGate && authGate.querySelector('.vcx-auth-error');
    if (!el) {
      el = document.createElement('p');
      el.className = 'vcx-auth-error';
      el.style.cssText = 'color:var(--vcx-status-danger,#E63757);font-size:.88rem;margin-top:12px;';
      if (authGate) {
        var inner = authGate.querySelector('div') || authGate;
        inner.appendChild(el);
      }
    }
    el.textContent = msg;
    el.style.display = 'block';
  }

  function showAuthMessage(msg) {
    var el = authGate && authGate.querySelector('.vcx-auth-message');
    if (!el) {
      el = document.createElement('p');
      el.className = 'vcx-auth-message';
      el.style.cssText = 'color:var(--vcx-brand-primary,#2E4F46);font-size:.88rem;margin-top:12px;';
      if (authGate) {
        var inner = authGate.querySelector('div') || authGate;
        inner.appendChild(el);
      }
    }
    el.textContent = msg;
    el.style.display = 'block';
  }

  function hideAuthMessages() {
    var err = authGate && authGate.querySelector('.vcx-auth-error');
    var msg = authGate && authGate.querySelector('.vcx-auth-message');
    if (err) err.style.display = 'none';
    if (msg) msg.style.display = 'none';
  }

  function setLoading(loading) {
    if (accessBtn) {
      accessBtn.disabled = loading;
      accessBtn.textContent = loading ? 'Verifying...' : 'Access Portal';
    }
  }

  // --- Load matters ----------------------------------------
  function loadMatters() {
    fetch(API_BASE + '/api/portal/matters', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    })
      .then(function (res) {
        if (res.status === 401) {
          clearSession();
          if (authGate) authGate.style.display = '';
          if (dashboard) dashboard.style.display = 'none';
          showAuthError('Your session has expired. Please enter your token or email to continue.');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load matters');
        return res.json();
      })
      .then(function (data) {
        if (data) renderMatterList(data.matters || []);
      })
      .catch(function (err) {
        if (matterList) {
          matterList.innerHTML =
            '<p style="color:var(--vcx-status-danger,#E63757);font-size:.9rem;">' +
            escapeHtml(err.message) + '</p>';
        }
      });
  }

  function renderMatterList(matters) {
    if (!matterList) return;

    if (matters.length === 0) {
      matterList.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">No matters found for this account.</p>';
      return;
    }

    var html = '';
    matters.forEach(function (m) {
      var statusColor = m.status === 'intake_received' ? '#0E7490'
                      : m.status === 'in_review' ? '#2E4F46'
                      : m.status === 'complete' ? '#38B249'
                      : '#7BAE9E';

      html +=
        '<div class="vcx-matter-card" data-matter-id="' + escapeAttr(m.id) + '" style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border:1px solid rgba(26,47,42,.08);border-radius:8px;margin-bottom:8px;cursor:pointer;transition:background .15s;"' +
        ' onmouseover="this.style.background=\'rgba(26,47,42,.03)\'" onmouseout="this.style.background=\'#fff\'">';
      html += '<div>';
      html += '<span style="font-size:.88rem;font-weight:600;color:var(--vcx-brand-primary,#2E4F46);">' + escapeHtml(m.id.substring(0, 8)) + '...</span>';
      html += '<span style="font-size:.82rem;color:var(--vcx-ink-muted,#7BAE9E);margin-left:10px;">' + escapeHtml((m.service_type || '').replace(/_/g, ' ')) + '</span>';
      html += '</div>';
      html += '<div>';
      html += '<span style="font-size:.72rem;font-weight:600;color:' + statusColor + ';text-transform:uppercase;letter-spacing:.08em;">' + escapeHtml((m.status || '').replace(/_/g, ' ')) + '</span>';
      html += '</div>';
      html += '</div>';
    });

    matterList.innerHTML = html;

    // Bind click handlers
    var cards = matterList.querySelectorAll('.vcx-matter-card');
    for (var i = 0; i < cards.length; i++) {
      cards[i].addEventListener('click', function () {
        var id = this.getAttribute('data-matter-id');
        if (id) loadMatterPacket(id);
      });
    }
  }

  // --- Load matter packet ----------------------------------
  function loadMatterPacket(matterId) {
    activeMatterId = matterId;

    // Show loading in all sections
    if (matterDetail) matterDetail.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">Loading matter details...</p>';
    if (timeline) timeline.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">Loading timeline...</p>';
    if (documents) documents.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">Loading documents...</p>';
    if (comments) comments.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">Loading comments...</p>';
    if (deliverables) deliverables.innerHTML = '<p style="font-size:.9rem;color:var(--vcx-ink-muted,#7BAE9E);">Loading deliverables...</p>';

    // Highlight active card
    var cards = matterList ? matterList.querySelectorAll('.vcx-matter-card') : [];
    for (var i = 0; i < cards.length; i++) {
      cards[i].style.borderColor = cards[i].getAttribute('data-matter-id') === matterId
        ? 'var(--vcx-brand-primary,#2E4F46)' : 'rgba(26,47,42,.08)';
    }

    fetch(API_BASE + '/api/portal/matters/' + encodeURIComponent(matterId) + '/packet', {
      headers: { 'Authorization': 'Bearer ' + authToken }
    })
      .then(function (res) {
        if (res.status === 401) {
          clearSession();
          if (authGate) authGate.style.display = '';
          if (dashboard) dashboard.style.display = 'none';
          showAuthError('Your session has expired. Please request a new access link.');
          return null;
        }
        if (!res.ok) throw new Error('Failed to load matter packet');
        return res.json();
      })
      .then(function (data) {
        if (!data) return;
        renderMatterOverview(data);
        renderTimeline(data.timeline || []);
        renderDocuments(data.documents || []);
        renderChecklist(data.checklist || []);
        renderComments(data.comments || []);
        renderDeliverables(data.deliverables || []);
      })
      .catch(function (err) {
        if (matterDetail) {
          matterDetail.innerHTML = '<p style="color:var(--vcx-status-danger,#E63757);font-size:.9rem;">' + escapeHtml(err.message) + '</p>';
        }
      });
  }

  // --- Render sections -------------------------------------
  function renderMatterOverview(data) {
    if (!matterDetail) return;
    var html = '';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:10px;">';
    html += detailCard('Matter ID', (data.matter_id || '').substring(0, 12) + '...');
    html += detailCard('Service', (data.service_type || '').replace(/_/g, ' '));
    html += detailCard('Status', (data.status || '').replace(/_/g, ' '));
    html += '</div>';
    matterDetail.innerHTML = html;
  }

  function renderTimeline(items) {
    if (!timeline) return;
    if (items.length === 0) {
      timeline.innerHTML = '<p style="font-size:.88rem;color:var(--vcx-ink-muted,#7BAE9E);">No timeline events yet.</p>';
      return;
    }
    var html = '';
    items.forEach(function (item) {
      html += '<div style="display:flex;gap:12px;margin-bottom:14px;">';
      html += '<div style="width:8px;min-height:8px;border-radius:50%;background:var(--vcx-brand-primary,#2E4F46);margin-top:6px;flex-shrink:0;"></div>';
      html += '<div>';
      html += '<strong style="font-size:.85rem;">' + escapeHtml(item.title || '') + '</strong>';
      if (item.description) html += '<p style="font-size:.82rem;margin:2px 0 0;color:var(--vcx-ink-body,#243D36);">' + escapeHtml(item.description) + '</p>';
      html += '<small style="font-size:.75rem;color:var(--vcx-ink-muted,#7BAE9E);">' + escapeHtml(item.date || '') + '</small>';
      html += '</div></div>';
    });
    timeline.innerHTML = html;
  }

  function renderDocuments(docs) {
    if (!documents) return;
    if (docs.length === 0) {
      documents.innerHTML = '<p style="font-size:.88rem;color:var(--vcx-ink-muted,#7BAE9E);">No documents uploaded yet.</p>';
      return;
    }
    var html = '';
    docs.forEach(function (doc) {
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(26,47,42,.06);">';
      html += '<span style="font-size:.85rem;color:var(--vcx-ink-body,#243D36);">' + escapeHtml(doc.name || '') + '</span>';
      html += '<div style="display:flex;gap:12px;font-size:.78rem;color:var(--vcx-ink-muted,#7BAE9E);">';
      html += '<span>' + escapeHtml(doc.size || '') + '</span>';
      html += '<span>' + escapeHtml(doc.date || '') + '</span>';
      html += '</div></div>';
    });
    documents.innerHTML = html;
  }

  function renderChecklist(items) {
    // Render inside matterDetail below overview
    if (!items || items.length === 0) return;
    if (!matterDetail) return;

    var html = '<h3 style="font-size:.95rem;margin:20px 0 10px;color:var(--vcx-brand-primary,#2E4F46);">Checklist</h3>';
    items.forEach(function (item) {
      var icon = item.is_complete ? '&#9745;' : '&#9744;';
      var style = item.is_complete ? 'color:var(--vcx-ink-muted,#7BAE9E);text-decoration:line-through;' : '';
      html += '<div style="font-size:.85rem;padding:4px 0;' + style + '">';
      html += '<span>' + icon + '</span> ' + escapeHtml(item.label || '');
      html += '</div>';
    });
    matterDetail.innerHTML += html;
  }

  function renderComments(cmts) {
    if (!comments) return;

    var html = '';
    if (cmts.length > 0) {
      cmts.forEach(function (c) {
        html += '<div style="padding:12px 0;border-bottom:1px solid rgba(26,47,42,.06);">';
        html += '<div style="display:flex;justify-content:space-between;margin-bottom:4px;">';
        html += '<span style="font-size:.82rem;font-weight:600;color:var(--vcx-brand-primary,#2E4F46);">' + escapeHtml(c.author || 'Client') + '</span>';
        html += '<span style="font-size:.75rem;color:var(--vcx-ink-muted,#7BAE9E);">' + escapeHtml(c.timestamp || '') + '</span>';
        html += '</div>';
        html += '<p style="font-size:.85rem;margin:0;color:var(--vcx-ink-body,#243D36);">' + escapeHtml(c.content || '') + '</p>';
        html += '</div>';
      });
    } else {
      html += '<p style="font-size:.88rem;color:var(--vcx-ink-muted,#7BAE9E);margin-bottom:12px;">No comments yet.</p>';
    }

    // Comment form
    html += '<div style="margin-top:16px;padding-top:12px;border-top:1px solid rgba(26,47,42,.08);">';
    html += '<textarea id="vcxNewComment" placeholder="Add a comment..." style="width:100%;padding:10px 12px;border:1px solid rgba(26,47,42,.15);border-radius:6px;font-size:.88rem;min-height:60px;resize:vertical;box-sizing:border-box;margin-bottom:8px;font-family:inherit;"></textarea>';
    html += '<button type="button" id="vcxPostComment" style="background:var(--vcx-brand-primary,#2E4F46);color:#fff;border:none;border-radius:6px;padding:8px 20px;font-size:.85rem;cursor:pointer;">Post Comment</button>';
    html += '</div>';

    comments.innerHTML = html;

    // Bind comment button
    var postBtn = document.getElementById('vcxPostComment');
    if (postBtn) {
      postBtn.addEventListener('click', function () {
        var textarea = document.getElementById('vcxNewComment');
        var content = textarea ? textarea.value.trim() : '';
        if (!content || !activeMatterId) return;
        postComment(activeMatterId, content);
      });
    }
  }

  function renderDeliverables(items) {
    if (!deliverables) return;
    if (items.length === 0) {
      deliverables.innerHTML = '<p style="font-size:.88rem;color:var(--vcx-ink-muted,#7BAE9E);">No deliverables yet.</p>';
      return;
    }
    var html = '';
    items.forEach(function (d) {
      var statusColor = d.status === 'delivered' ? '#38B249'
                      : d.status === 'in_progress' ? '#0E7490'
                      : '#7BAE9E';
      html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid rgba(26,47,42,.06);">';
      html += '<div>';
      html += '<span style="font-size:.85rem;font-weight:600;color:var(--vcx-ink-body,#243D36);">' + escapeHtml(d.name || '') + '</span>';
      if (d.description) html += '<p style="font-size:.78rem;margin:2px 0 0;color:var(--vcx-ink-muted,#7BAE9E);">' + escapeHtml(d.description) + '</p>';
      html += '</div>';
      html += '<span style="font-size:.72rem;font-weight:600;color:' + statusColor + ';text-transform:uppercase;">' + escapeHtml((d.status || '').replace(/_/g, ' ')) + '</span>';
      html += '</div>';
    });
    deliverables.innerHTML = html;
  }

  // --- Post comment ----------------------------------------
  function postComment(matterId, content) {
    var postBtn = document.getElementById('vcxPostComment');
    if (postBtn) {
      postBtn.disabled = true;
      postBtn.textContent = 'Posting...';
    }

    fetch(
      API_BASE + '/api/portal/matters/' + encodeURIComponent(matterId) + '/comments',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + authToken
        },
        body: JSON.stringify({ content: content })
      }
    )
      .then(function (res) {
        if (res.status === 401) {
          clearSession();
          if (authGate) authGate.style.display = '';
          if (dashboard) dashboard.style.display = 'none';
          showAuthError('Your session has expired. Please request a new access link.');
          return null;
        }
        if (!res.ok) throw new Error('Failed to post comment');
        return res.json();
      })
      .then(function (data) {
        if (data && data.comments) renderComments(data.comments);
      })
      .catch(function (err) {
        if (comments) {
          var errDiv = document.createElement('p');
          errDiv.style.cssText = 'color:var(--vcx-status-danger,#E63757);font-size:.85rem;margin-top:8px;';
          errDiv.textContent = 'Failed to post: ' + err.message;
          comments.appendChild(errDiv);
        }
      })
      .finally(function () {
        if (postBtn) {
          postBtn.disabled = false;
          postBtn.textContent = 'Post Comment';
        }
      });
  }

  // --- Helpers ---------------------------------------------
  function detailCard(label, value) {
    return '<div style="background:rgba(26,47,42,.03);border-radius:6px;padding:12px 14px;text-align:center;">' +
      '<div style="font-size:.95rem;font-weight:700;color:var(--vcx-brand-primary,#2E4F46);margin-bottom:2px;text-transform:capitalize;">' + escapeHtml(String(value)) + '</div>' +
      '<div style="font-size:.75rem;color:var(--vcx-ink-muted,#7BAE9E);">' + escapeHtml(label) + '</div>' +
    '</div>';
  }

  function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  function escapeAttr(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  // --- Boot ------------------------------------------------
  function init() {
    // Phase 4A: Try URL token first, then sessionStorage restore
    if (!checkUrlToken()) {
      if (restoreSession()) {
        // Have a saved session — try loading matters directly
        onAuthenticated([]);
        loadMatters();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // --- Public namespace ------------------------------------
  window.VCX_PacketRoom = {
    loadMatters: loadMatters,
    loadMatterPacket: loadMatterPacket,
    postComment: postComment
  };
})();
