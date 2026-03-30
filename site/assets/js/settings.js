(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  function q(selector){ return document.querySelector(selector); }
  function setText(selector, value){
    var node = q(selector);
    if(!node){ return; }
    var resolved = value == null ? '' : String(value);
    if('value' in node){
      node.value = resolved;
      return;
    }
    node.textContent = resolved;
  }
  function field(form, name){
    return form && form.elements ? form.elements.namedItem(name) : null;
  }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
  function buildSignInUrl(options){
    var query = new URLSearchParams();
    if(options && options.signedOut){
      query.set('signed_out', '1');
    }
    if(options && options.email){
      query.set('email', String(options.email));
    }
    if(options && options.next){
      query.set('next', String(options.next));
    }
    var suffix = query.toString();
    return '/app/sign-in/' + (suffix ? ('?' + suffix) : '');
  }
  function renderCommercial(commercial){
    var card = q('[data-settings-commercial]');
    if(!card){ return; }
    if(!commercial || !commercial.plan_code){
      card.hidden = true;
      return;
    }
    card.hidden = false;
    var plan = q('[data-settings-plan-summary]');
    var usage = q('[data-settings-usage-summary]');
    var locks = q('[data-settings-lock-summary]');
    var entitlements = commercial.entitlements || {};
    var usageData = commercial.usage || {};
    if(plan){
      plan.innerHTML =
        '<article class="dashboard-card dashboard-card-featured">' +
          '<div class="dashboard-card-copy">' +
            '<div class="eyebrow">Current plan</div>' +
            '<h3>' + escapeHtml(commercial.plan_label || commercial.plan_code) + '</h3>' +
            '<p>' + escapeHtml(commercial.value_message || 'Plan details are available for this workspace.') + '</p>' +
          '</div>' +
        '</article>';
    }
    if(usage){
      if(commercial.can_view_usage_details){
        usage.innerHTML =
          '<article class="dashboard-list-item"><div><strong>Usage</strong><p>' +
          escapeHtml(
            'Active matters: ' + (usageData.active_matters || 0) +
            ' | Imported matters: ' + (usageData.imported_matters || 0) +
            ' | Generated packets: ' + (usageData.generated_packets || 0) +
            ' | Seats in use: ' + ((Number(usageData.portal_collaborators || 0) + 1) + ' / ' + (entitlements.seat_limit || 1))
          ) +
          '</p></div></article>';
      } else {
        usage.innerHTML = '<article class="dashboard-list-item"><div><strong>Usage visibility</strong><p>Workspace owners and admins can review live usage and upgrade prompts here.</p></div></article>';
      }
    }
    if(locks){
      var prompts = commercial.upgrade_prompts || [];
      var locked = commercial.locked_features || [];
      locks.innerHTML =
        (locked.length ? '<article class="dashboard-list-item"><div><strong>Locked features</strong><p>' + escapeHtml(locked.join(' | ')) + '</p></div></article>' : '') +
        (prompts.length ? prompts.map(function(item){
          return '<article class="dashboard-list-item"><div><strong>' + escapeHtml(item.title) + '</strong><p>' + escapeHtml(item.message || '') + '</p></div></article>';
        }).join('') : '');
    }
  }

  async function boot(){
    var session;
    try {
      session = await api.getSession();
      if(!session || !session.authenticated){
        window.location.href = '/app/sign-in/?next=/app/settings/';
        return;
      }
    } catch (error){
      window.location.href = '/app/sign-in/?next=/app/settings/';
      return;
    }

    setText('[data-settings-email]', session.user.email || '');
    setText('[data-settings-workspace]', session.workspace.name || '');
    setText('[data-settings-account-name]', ((session.user.first_name || '') + ' ' + (session.user.last_name || '')).trim() || session.user.email || '');
    try {
      renderCommercial(await api.getPlatformCommercial());
    } catch (error){
      renderCommercial(session.commercial || null);
    }

    var form = q('[data-settings-form]');
    var status = q('[data-settings-status]');
    if(form){
      if(field(form, 'first_name')){ field(form, 'first_name').value = session.user.first_name || ''; }
      if(field(form, 'last_name')){ field(form, 'last_name').value = session.user.last_name || ''; }
      if(field(form, 'title')){ field(form, 'title').value = session.user.title || ''; }
      if(field(form, 'preferred_language')){ field(form, 'preferred_language').value = (session.user.preferred_language || 'en').toLowerCase(); }
      form.addEventListener('submit', async function(event){
        event.preventDefault();
        if(status){ status.textContent = ''; }
        try {
          var payload = {
            first_name: (field(form, 'first_name') && field(form, 'first_name').value) || '',
            last_name: (field(form, 'last_name') && field(form, 'last_name').value) || '',
            title: (field(form, 'title') && field(form, 'title').value) || '',
            preferred_language: (field(form, 'preferred_language') && field(form, 'preferred_language').value) || 'en'
          };
          var updated = await api.updateProfile(payload);
          if(i18n && updated && updated.user && updated.user.preferred_language){
            i18n.setLocale(updated.user.preferred_language);
          }
          if(status){ status.textContent = i18n ? i18n.t('common.profile_saved', 'Profile updated.') : 'Profile updated.'; }
        } catch (error){
          if(status){ status.textContent = (error && error.message) || (i18n ? i18n.t('common.save_failed', 'Could not save changes.') : 'Could not save changes.'); }
        }
      });
    }

    var logout = q('[data-settings-logout]');
    if(logout){
      logout.addEventListener('click', async function(){
        try { api.clearActiveCaseId(); } catch (error){}
        try { await api.logout(); } catch (error){}
        window.location.href = buildSignInUrl({
          signedOut: true,
          email: session && session.user ? session.user.email : ''
        });
      });
    }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
