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
  function buildSignInUrl(email){
    var query = new URLSearchParams();
    query.set('reason', 'email_exists');
    if(email){ query.set('email', String(email)); }
    var next = sanitizeNextUrl(params().get('next'));
    if(next && next !== '/app/home/'){ query.set('next', next); }
    return '/app/sign-in/?' + query.toString();
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
  function errorCode(error){
    if(error && error.detail && error.detail.code){
      return error.detail.code;
    }
    if(error && error.raw && error.raw.error && error.raw.error.detail && error.raw.error.detail.code){
      return error.raw.error.detail.code;
    }
    return '';
  }
  function normalizedText(value){
    return String(value || '').trim();
  }
  function validate(values){
    if(!values.first_name){
      return { field: 'first_name', message: t('auth.validation.first_name_required', 'Add your first name before creating the account.') };
    }
    if(!values.last_name){
      return { field: 'last_name', message: t('auth.validation.last_name_required', 'Add your last name before creating the account.') };
    }
    if(!values.email){
      return { field: 'email', message: t('auth.validation.email_required', 'Enter your email address.') };
    }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)){
      return { field: 'email', message: t('auth.validation.email_invalid', 'Enter a valid email address.') };
    }
    if(!values.password){
      return { field: 'password', message: t('auth.validation.password_required', 'Create a password before continuing.') };
    }
    if(values.password.length < 8){
      return { field: 'password', message: t('auth.validation.password_length', 'Use a password with at least 8 characters.') };
    }
    if(!values.confirm_password){
      return { field: 'confirm_password', message: t('auth.validation.confirm_password_required', 'Confirm the same password before creating the account.') };
    }
    if(values.password !== values.confirm_password){
      return { field: 'confirm_password', message: t('auth.validation.password_mismatch', 'The two password fields must match exactly.') };
    }
    if(!values.terms_accepted){
      return { field: 'terms_accepted', message: t('auth.validation.terms_required', 'Accept the service terms before creating the account.') };
    }
    return values;
  }
  function errorMessage(error){
    var code = errorCode(error);
    if(code === 'password_mismatch'){
      return t('auth.validation.password_mismatch', 'The two password fields must match exactly.');
    }
    if(code === 'weak_password'){
      return t('auth.validation.password_length', 'Use a password with at least 8 characters.');
    }
    if(code === 'terms_required'){
      return t('auth.validation.terms_required', 'Accept the service terms before creating the account.');
    }
    if(code === 'invalid_email'){
      return t('auth.validation.email_invalid', 'Enter a valid email address.');
    }
    return (error && error.message) || t('auth.sign_up.error', 'Could not create the account.');
  }

  async function boot(){
    try {
      var existing = await api.getSession();
      if(existing && existing.authenticated){
        window.location.href = postAuthRoute(existing);
        return;
      }
    } catch (error){}

    var form = q('[data-signup-form]');
    var errorNode = q('[data-auth-error]');
    var submit = form ? form.querySelector('button[type="submit"]') : null;
    if(!form){ return; }
    form.addEventListener('submit', async function(event){
      event.preventDefault();
      show(errorNode, '');
      Array.prototype.forEach.call(form.elements || [], function(field){ setInvalid(field, false); });
      if(submit){ submit.disabled = true; }
      try {
        var formData = new FormData(form);
        var values = {
          first_name: normalizedText(formData.get('first_name')),
          last_name: normalizedText(formData.get('last_name')),
          email: normalizedText(formData.get('email')).toLowerCase(),
          password: String(formData.get('password') || ''),
          confirm_password: String(formData.get('confirm_password') || ''),
          workspace_name: normalizedText(formData.get('workspace_name')),
          title: normalizedText(formData.get('title')),
          preferred_language: normalizedText(formData.get('preferred_language')) || 'en',
          terms_accepted: !!formData.get('terms_accepted')
        };
        var result = validate(values);
        if(result.field){
          var invalidField = form.elements && form.elements.namedItem(result.field);
          setInvalid(invalidField, true);
          show(errorNode, result.message);
          focusField(invalidField);
          return;
        }
        await api.signup(result);
        var session = await api.getSession();
        if(!session || !session.authenticated){
          throw new Error(t('auth.sign_up.error', 'Could not create the account.'));
        }
        window.location.href = postAuthRoute(session);
      } catch (error){
        if(errorCode(error) === 'email_exists'){
          window.location.href = buildSignInUrl(form.elements && form.elements.namedItem('email') ? form.elements.namedItem('email').value : '');
          return;
        }
        show(errorNode, errorMessage(error));
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
