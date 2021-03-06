let cookie = {
  create: function (name, value, minutes, domain, cookieOptions = { path: '/' }) {
    let expires;
    if (minutes) {
      let date = new Date();
      date.setTime(date.getTime() + (minutes * 60 * 1000));
      expires = '; expires=' + date.toUTCString();
    }
    else expires = '';
    domain = domain ? 'domain=' + domain + ';' : '';
    cookieOptions = Object.keys(cookieOptions).reduce((acc, key) => acc + ';' +
      key.replace(/([A-Z])/g, ($1) => '-' + $1.toLowerCase()) + '=' + cookieOptions[key], '');
    document.cookie = name + '=' + encodeURIComponent(value) + expires + ';' + domain + cookieOptions;
  },

  read: function (name) {
    let nameEQ = name + '=';
    let ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  remove: function (name) {
    this.create(name, '', -1);
  }
};

export default {
  name: 'cookie',

  lookup(options) {
    let found;

    if (options.lookupCookie && typeof document !== 'undefined') {
      var c = cookie.read(options.lookupCookie);
      if (c) found = c;
    }

    if (typeof options.cookieFallback && !found) return options.cookieFallback;
    else return found;
  },
  
  cacheUserLanguage(lng, options) {
    if (options.lookupCookie && typeof document !== 'undefined') {
      cookie.create(options.lookupCookie, lng, options.cookieMinutes, options.cookieDomain, options.cookieOptions);
    }
  }
};