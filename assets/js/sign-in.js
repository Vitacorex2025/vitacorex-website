(function(){
  var api = window.DocketMintApi;
  var i18n = window.VCXI18n;
  if(!api){ return; }

  function q(selector){ return document.querySelector(selector); }
  function t(key, fallback){
    return i18n ? i18n.t(key, fallback) : fallback;
  }
  function params(){
    try { return new URLSearchParams(window.location.search || ''); }
    catch (error){ return new URLSearchParams(''); }
  }
  function sanitizeNextUrl(value){
    var raw = String(value || '').trim();
    var fallback = '/app/home/';
    if(!raw){ return fallback; }
    try {
      var url = new URL(raw, window.location.origin);
      var path = url.pathname || '';
      if(url.origin !== window.location.origin){ return fallback; }
      if(!/^\/app(?:\/|$)/.test(path)){ return fallback; }
      if(/^\/app\/(?:sign-in|sign-up)(?:\/|$)/.test(path)){ return fallback; }
      return path + (url.search || '') + (url.hash || '');
    } catch (error){
      return fallback;
    }
  }
  function nextUrl(){
    return sanitizeNextUrl(params().get('next'));
  }
  function postAuthRoute(session){
    var explicitNext = nextUrl();
    if(explicitNext && explicitNext !== '/app/home/'){
      return explicitNext;
    }
    var environments = session && session.environments;
    if(environments && environments.switcher_required === false){
      if(environments.default_environment === 'legal'){
        return '/app/legal/';
      }
      if(environments.default_environment === 'recovery'){
        return '/app/recovery/';
      }
    }
    return '/app/home/';
  }
  function buildSignUpUrl(){
    var query = new URLSearchParams();
    var next = sanitizeNextUrl(params().get('next'));
    if(next && next !== '/app/home/'){ query.set('next', next); }
    var suffix = query.toString();
    return '/app/sign-up/' + (suffix ? ('?' + suffix) : '');
  }
  function show(node, message){
    if(!node){ return; }
    node.hidden = !message;
    node.textContent = message || '';
  }
  function setInvalid(field, invalid){
    if(!field){ return; }
    if(invalid){
      field.setAttribute('aria-invalid', 'true');
      return;
    }
    field.removeAttribute('aria-invalid');
  }
  function focusField(field){
    if(!field || typeof field.focus !== 'function'){ return; }
    try { field.focus(); } catch (error){}
  }
  function authCode(error){
    if(error && error.detail && error.detail.code){
      return error.detail.code;
    }
    if(error && error.raw && error.raw.error && error.raw.error.detail && error.raw.error.detail.code){
      return error.raw.error.detail.code;
    }
    return '';
  }
  function validate(email, password){
    var normalizedEmail = String(email || '').trim();
    var normalizedPassword = String(password || '');
    if(!normalizedEmail){
      return { field: 'email', message: t('auth.validation.email_required', 'Enter your email address.') };
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)){
      return { field: 'email', message: t('auth.validation.email_invalid', 'Enter a valid email address.') };
    }
    if(!normalizedPassword){
      return { field: 'password', message: t('auth.validation.password_required', 'Enter your password.') };
    }
    return { email: normalizedEmail, password: normalizedPassword };
  }
  function errorMessage(error){
    var code = authCode(error);
    if(code === 'invalid_credentials'){
      return t('auth.sign_in.invalid_credentials', 'That email and password did not match this account. Check them and try again.');
    }
    if(code === 'auth_required'){
      return t('auth.sign_in.session_required', 'Your session ended. Sign in again to continue.');
    }
    return (error && error.message) || t('auth.sign_in.error', 'Could not sign in.');
  }
  function messageForContext(){
    var query = params();
    if(query.get('reason') === 'email_exists'){
      return t('auth.sign_in.email_exists', 'This email already has an account. Sign in instead of creating a new one.');
    }
    if(query.get('signed_out') === '1'){
      return t('auth.sign_in.signed_out', 'You signed out. Your account is still available. Sign in with your email and password.');
    }
    return '';
  }

  async function boot(){
    try {
      var existing = await api.getSession();
      if(existing && existing.authenticated){
        window.location.href = postAuthRoute(existing);
        return;
      }
    } catch (error){}

    var form = q('[data-login-form]');
    var emailField = form ? form.elements.namedItem('email') : null;
    var passwordField = form ? form.elements.namedItem('password') : null;
    var errorNode = q('[data-auth-error]');
    var infoNode = q('[data-auth-info]');
    var signUpLink = q('[data-auth-signup-link]');
    var submit = form ? form.querySelector('button[type="submit"]') : null;
    if(!form){ return; }
    if(signUpLink){
      signUpLink.href = buildSignUpUrl();
    }
    if(emailField){
      var emailParam = params().get('email') || '';
      if(emailParam){ emailField.value = emailParam; }
    }
    show(infoNode, messageForContext());
    form.addEventListener('submit', async function(event){
      event.preventDefault();
      show(errorNode, '');
      setInvalid(emailField, false);
      setInvalid(passwordField, false);
      if(submit){ submit.disabled = true; }
      try {
        var formData = new FormData(form);
        var result = validate(formData.get('email'), formData.get('password'));
        if(result.field){
          setInvalid(result.field === 'email' ? emailField : passwordField, true);
          show(errorNode, result.message);
          focusField(result.field === 'email' ? emailField : passwordField);
          return;
        }
        await api.login({ email: result.email, password: result.password });
        var session = await api.getSession();
        if(!session || !session.authenticated){
          throw new Error(t('auth.sign_in.error', 'Could not sign in.'));
        }
        window.location.href = postAuthRoute(session);
      } catch (error){
        show(errorNode, errorMessage(error));
        if(authCode(error) === 'invalid_credentials' && passwordField){
          setInvalid(passwordField, true);
          focusField(passwordField);
        }
      } finally {
        if(submit){ submit.disabled = false; }
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
