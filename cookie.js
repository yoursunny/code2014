var Cookie   = new Object();
Cookie.day   = 86400000;
Cookie.week  = Cookie.day * 7;
Cookie.month = Cookie.day * 31;
Cookie.year  = Cookie.day * 365;

function getCookie(name) {
  var cookies = document.cookie;
  var start = cookies.indexOf(name + '=');
  if (start == -1) return null;
  var len = start + name.length + 1;
  var end = cookies.indexOf(';',len);
  if (end == -1) end = cookies.length;
  return unescape(cookies.substring(len,end));
}

function setCookie(name, value, expires, path, domain, secure) {
  value = escape(value);
  expires = (expires) ? ';expires=' + expires.toGMTString() :'';
  path    = (path)    ? ';path='    + path                  :'';
  domain  = (domain)  ? ';domain='  + domain                :'';
  secure  = (secure)  ? ';secure'                           :'';

  document.cookie =
    name + '=' + value + expires + path + domain + secure;
}

function deleteCookie(name, path, domain) {
  var expires = ';expires=Thu, 01-Jan-70 00:00:01 GMT';
  (path)    ? ';path='    + path                  : '';
  (domain)  ? ';domain='  + domain                : '';

  if (getCookie(name))
    document.cookie = name + '=' + expires + path + domain;
}