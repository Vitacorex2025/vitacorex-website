(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  function q(selector){ return document.querySelector(selector); }
  function escapeHtml(value){
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function initials(user){
    var first = ((user && user.first_name) || '').trim().charAt(0);
    var last = ((user && user.last_name) || '').trim().charAt(0);
    var value = (first + last).toUpperCase();
    if(value){ return value; }
    return String((user && user.email) || 'DM').slice(0, 2).toUpperCase();
  }

  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : (fallback || key);
  }

  function sessionAuthorization(session){
    var authorization = (session && session.authorization) || {};
    var permissions = authorization.permissions || {};
    return {
      role: authorization.role || (session && session.membership && session.membership.role) || 'viewer',
      isAdmin: Boolean(authorization.is_admin),
      canCreateCases: permissions.create_cases !== false,
      canGeneratePackets: permissions.generate_packets !== false,
      createMessage: (authorization.messages && authorization.messages.create_cases) || 'Only admin users can create recovery matters in this environment.',
      generateMessage: (authorization.messages && authorization.messages.generate_packets) || 'Only admin users can generate packet outputs in this environment.'
    };
  }

  function buildSignInUrl(options){
    var query = new URLSearchParams();
    if(options && options.signedOut){
      query.set('signed_out', '1');
    }
    if(options && options.reason){
      query.set('reason', String(options.reason));
    }
    if(options && options.email){
      query.set('email', String(options.email));
    }
    var suffix = query.toString();
    return '/app/sign-in/' + (suffix ? ('?' + suffix) : '');
  }

  function topbarHost(){
    return q('[data-home-account]') || q('.app-topbar .topbar-actions') || q('.app-topbar .topbar-right') || q('.app-topbar .topbar-meta') || q('.app-topbar');
  }

  function accountName(session){
    return (((session.user.first_name || '') + ' ' + (session.user.last_name || '')).trim() || session.user.email || t('nav.account', 'Account'));
  }

  function closeMenu(wrapper){
    if(!wrapper){ return; }
    var toggle = wrapper.querySelector('[data-account-toggle]');
    var dropdown = wrapper.querySelector('[data-account-dropdown]');
    wrapper.classList.remove('is-open');
    if(toggle){ toggle.setAttribute('aria-expanded', 'false'); }
    if(dropdown){ dropdown.hidden = true; }
  }

  function openMenu(wrapper){
    if(!wrapper){ return; }
    qa('[data-auth-shell]').forEach(function(other){
      if(other !== wrapper){ closeMenu(other); }
    });
    var toggle = wrapper.querySelector('[data-account-toggle]');
    var dropdown = wrapper.querySelector('[data-account-dropdown]');
    wrapper.classList.add('is-open');
    if(toggle){ toggle.setAttribute('aria-expanded', 'true'); }
    if(dropdown){ dropdown.hidden = false; }
  }

  function qa(selector){
    return Array.prototype.slice.call(document.querySelectorAll(selector) || []);
  }

  function bindMenuEvents(wrapper, session){
    if(!wrapper){ return; }
    var toggle = wrapper.querySelector('[data-account-toggle]');
    var dropdown = wrapper.querySelector('[data-account-dropdown]');
    var logout = wrapper.querySelector('[data-auth-logout]');
    var languageButtons = qa('[data-language-choice]').filter(function(button){
      return wrapper.contains(button);
    });

    function handleDocumentClick(event){
      if(!wrapper.contains(event.target)){ closeMenu(wrapper); }
    }

    function handleEscape(event){
      if(event.key === 'Escape'){ closeMenu(wrapper); }
    }

    function handleRouteClose(){
      closeMenu(wrapper);
    }

    if(toggle && dropdown){
      toggle.addEventListener('click', function(event){
        event.preventDefault();
        event.stopPropagation();
        if(dropdown.hidden){
          openMenu(wrapper);
          return;
        }
        closeMenu(wrapper);
      });
    }

    languageButtons.forEach(function(button){
      button.addEventListener('click', async function(){
        var locale = button.getAttribute('data-language-choice') || 'en';
        if(i18n){ i18n.setLocale(locale); }
        try { await api.updateProfile({ preferred_language: locale }); } catch (error){}
        wrapper.outerHTML = buildAccountShell(session, locale);
        bindExistingShell(session);
      });
    });

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

    document.addEventListener('click', handleDocumentClick, true);
    document.addEventListener('keydown', handleEscape, true);
    document.addEventListener('keyup', handleEscape, true);
    window.addEventListener('hashchange', handleRouteClose);
    window.addEventListener('popstate', handleRouteClose);
    window.addEventListener('resize', handleRouteClose);

    wrapper._cleanup = function(){
      document.removeEventListener('click', handleDocumentClick, true);
      document.removeEventListener('keydown', handleEscape, true);
      document.removeEventListener('keyup', handleEscape, true);
      window.removeEventListener('hashchange', handleRouteClose);
      window.removeEventListener('popstate', handleRouteClose);
      window.removeEventListener('resize', handleRouteClose);
    };
  }

  function buildAccountShell(session, locale){
    var activeLocale = (locale || (session.user && session.user.preferred_language) || 'en').toLowerCase();
    return '' +
      '<div class="topbar-account-shell" data-auth-shell>' +
        '<div class="account-menu" data-account-menu>' +
          '<button class="account-button" data-account-toggle type="button" aria-expanded="false" aria-controls="topbarAccountMenu">' +
            '<span class="account-avatar">' + escapeHtml(initials(session.user)) + '</span>' +
            '<span class="account-copy"><strong>' + escapeHtml(accountName(session)) + '</strong><small>' + escapeHtml((session.workspace && session.workspace.name) || t('nav.account', 'Account')) + '</small></span>' +
          '</button>' +
          '<div class="account-dropdown" id="topbarAccountMenu" data-account-dropdown hidden>' +
            '<div class="account-dropdown-head">' +
              '<strong>' + escapeHtml(accountName(session)) + '</strong>' +
              '<span>' + escapeHtml(session.user.email || '') + '</span>' +
            '</div>' +
            '<div class="account-menu-group">' +
              '<div class="account-menu-label">' + escapeHtml(t('common.language', 'Language')) + '</div>' +
              '<div class="account-language-options">' +
                '<button class="account-language-choice' + (activeLocale === 'en' ? ' is-active' : '') + '" data-language-choice="en" type="button">' + escapeHtml(t('common.english', 'English')) + '</button>' +
                '<button class="account-language-choice' + (activeLocale === 'ru' ? ' is-active' : '') + '" data-language-choice="ru" type="button">' + escapeHtml(t('common.russian', 'Russian')) + '</button>' +
                '<button class="account-language-choice' + (activeLocale === 'es' ? ' is-active' : '') + '" data-language-choice="es" type="button">' + escapeHtml(t('common.spanish', 'Spanish')) + '</button>' +
              '</div>' +
            '</div>' +
            '<div class="account-menu-group">' +
              '<a href="/app/settings/">' + escapeHtml(t('common.settings', 'Settings')) + '</a>' +
              '<button type="button" data-auth-logout>' + escapeHtml(t('common.signout', 'Sign out')) + '</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>';
  }

  function bindExistingShell(session){
    var wrapper = q('[data-auth-shell]');
    if(!wrapper){ return; }
    if(typeof wrapper._cleanup === 'function'){ wrapper._cleanup(); }
    bindMenuEvents(wrapper, session);
  }

  function injectAccountControls(session){
    if(!session || !session.authenticated){ return; }
    var screen = document.body.getAttribute('data-app-screen') || '';
    if(screen === 'sign-in' || screen === 'sign-up'){ return; }
    var host = topbarHost();
    if(!host){ return; }
    var existing = q('[data-auth-shell]');
    var locale = i18n ? i18n.getLocale() : ((session.user && session.user.preferred_language) || 'en');
    if(existing){
      if(typeof existing._cleanup === 'function'){ existing._cleanup(); }
      existing.outerHTML = buildAccountShell(session, locale);
      bindExistingShell(session);
      return;
    }
    host.insertAdjacentHTML('beforeend', buildAccountShell(session, locale));
    bindExistingShell(session);
  }

  function applySession(session){
    if(!session || !session.authenticated){ return; }
    var authorization = sessionAuthorization(session);
    window.DocketMintAuth = {
      session: session,
      authorization: authorization,
      role: authorization.role,
      canCreateCases: function(){ return authorization.canCreateCases; },
      canGeneratePackets: function(){ return authorization.canGeneratePackets; },
      createLockMessage: function(){ return authorization.createMessage; },
      generateLockMessage: function(){ return authorization.generateMessage; }
    };
    document.body.setAttribute('data-user-email', session.user && session.user.email || '');
    document.body.setAttribute('data-workspace-id', session.workspace && session.workspace.id || '');
    document.body.setAttribute('data-user-role', authorization.role || '');
    document.body.setAttribute('data-can-create-cases', authorization.canCreateCases ? 'true' : 'false');
    document.body.setAttribute('data-can-generate-packets', authorization.canGeneratePackets ? 'true' : 'false');
    if(i18n && session.user && session.user.preferred_language){
      i18n.setLocale(session.user.preferred_language);
    }
    injectAccountControls(session);
    applyRoleLocks(authorization);
    window.dispatchEvent(new CustomEvent('docketmint:session', { detail: session }));
  }

  function lockButton(node){
    if(!node){ return; }
    node.hidden = true;
    node.classList.add('is-disabled');
    if(typeof node.disabled !== 'undefined'){ node.disabled = true; }
    node.setAttribute('aria-disabled', 'true');
  }

  function disableCard(node){
    if(!node){ return; }
    if(typeof node.disabled !== 'undefined'){ node.disabled = true; }
    node.classList.add('is-disabled');
    node.setAttribute('aria-disabled', 'true');
    node.setAttribute('title', 'Admin access required.');
  }

  function renderLockMessage(selector, message){
    qa(selector).forEach(function(node){
      node.hidden = false;
      node.innerHTML = '<strong>Admin access required.</strong><span>' + escapeHtml(message) + '</span>';
    });
  }

  function applyRoleLocks(authorization){
    if(!authorization.canCreateCases){
      qa('[data-create-case-form] button[type=\"submit\"], [data-admin-create-only], [data-promote-intake]').forEach(lockButton);
      renderLockMessage('[data-rbac-create-lock]', authorization.createMessage);
    }
    if(!authorization.canGeneratePackets){
      qa('[data-generate-selected], [data-generate-all], [data-build-recovery-packet], [data-mobile-build-recovery-packet], [data-irs-build-packet], [data-irs-mobile-build-packet], [data-module-generate-all], [data-module-generate-demand]').forEach(lockButton);
      renderLockMessage('[data-rbac-generate-lock]', authorization.generateMessage);
    }
  }

  async function boot(){
    try {
      var session = await api.getSession();
      applySession(session);
    } catch (error){}
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
