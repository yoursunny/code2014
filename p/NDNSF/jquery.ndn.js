/*
jQuery NDN extension
Copyright 2013, yoursunny.com

var key = $.ndn('key');
var key = $.ndn('key', new ndn.Key(...));
var key = $.ndn('key', { pubkey:'...', pvtkey:'...' });

$.ndn('open', { host:'...', port:'...' }).done(...).fail(...);
$.ndn('close').done(...).fail(...);

var state = $.ndn('state'); // 0=CONNECTING, 1=OPEN, 3=CLOSED
var ndndid = $.ndn('ndndid');

$.ndn.on('open', ...);
$.ndn.on('close', ...);

$.ndn.interest(new ndn.Name(...), template).done(...).fail(...);
$.ndn.publish(new ndn.Name(...), function(interest, send_func){
  var co = new ndn.ContentObject(interest.name, '');
  send_func(co);
});

*/

(function($){

if (!window.ndn) {
  console.log('cannot initialze jquery.ndn.js: NDN.JS library is not loaded');
  return;
}

$.ndn = function $_ndn(act, options) {
  switch (act) {
    case 'key': {
      if (arguments.length == 1) {// get key
        return $.ndn.key;
      } else {// set key
        if (options instanceof ndn.Key) {
          $.ndn.key = options;
        } else {
          $.ndn.key.fromPemString(options.pubkey, options.pvtkey);
        }
        if ($.ndn.client) {
          $.ndn.client.default_key = $.ndn.key;
        }
        return $.ndn.key;
      }
    } break;

    case 'open': {
      var defer = $.Deferred();
      if (ndn_client_state() != 3) {
        console.log('$.ndn("open"): already connected');
        return defer.reject();
      }
      $.ndn.client = new ndn.NDN(options);
      $.ndn.client.default_key = $.ndn.key;
      $.ndn.client.onopen = function $_ndn_open_onopen() {
        clearInterval(fetch_ndndid_timer);
        defer.resolve();
        event_emitter.triggerHandler('open');
      };
      $.ndn.client.onclose = function $_ndn_open_onclose() {
        if (defer.state() != 'pending') defer.reject();
        event_emitter.triggerHandler('close');
      };
      $.ndn.client.connect();
      
      var fetch_ndndid_timer = setInterval(function(){
        if ($.ndn.client.transport.ws && $.ndn.client.transport.ws.readyState == WebSocket.OPEN) $.ndn.client.fetchCcndId();
      }, 1000);
      
      return defer;
    } break;

    case 'close': {
      var defer = $.Deferred();
      if (ndn_client_state() == 3) {
        console.log('$.ndn("open"): already closed');
        return defer.reject();
      }
      $.ndn.client.onclose = function $_ndn_close_onclose() {
        defer.resolve();
      };
      $.ndn.client.close();
      return defer;
    } break;

    case 'state': {
      return ndn_client_state();
    } break;

    case 'ndndid': {
      if (ndn_client_state() != 1) return undefined;
      return $.ndn.client.ccndid;
    } break;
  }
};
$.ndn.client = new ndn.NDN();
$.ndn.client.ready_status = ndn.NDN.CLOSED;
$.ndn.key = $.ndn.client.getDefaultKey();

var event_emitter = $($.ndn);
$.ndn.on = function(evt, fn) { event_emitter.on(evt, fn); }
$.ndn.off = function(evt, fn) { event_emitter.off(evt, fn); }

$.ndn.interest = function(name, template) {
  var defer = $.Deferred();
  $.ndn.client.expressInterest(name, template, function(interest,co){ defer.resolve(interest,co); }, function(interest){ defer.reject(interest); });
  return defer;
};

$.ndn.publish = function(name, fn) {
  $.ndn.client.registerPrefix(name, function(interest) {
    fn(interest, function(co){
      if (ndn_client_state() != 1) return;
      if (!co.signature) co.sign($.ndn.key);
      $.ndn.client.send(co);
    });
  });
};


function ndn_client_state() {
  switch ($.ndn.client.ready_status) {
    case ndn.NDN.UNOPEN: return 0;
    case ndn.NDN.OPENED: return 1;
    case ndn.NDN.CLOSED: return 3;
  }
  return 3;
}

})(jQuery);
