// prototype.js 1.6.0.2 functions just enough for SecureSubmit
// in case Prototype is already include, these code would have no effect

var Prototype = Prototype || {
	Version: '1.6.0.2',
	emptyFunction: function() { },
	K: function(x) { return x }
};

Object.extend = Object.extend || function(destination, source) {
	for (var property in source)
		destination[property] = source[property];
	return destination;
};

Object.toQueryString = Object.toQueryString || function(o) {
	var a=[];
	for (var property in o) {
		a.push(property+'='+encodeURIComponent(o[property]));
	}
	return a.join('&');
};

var Class = Class || {
	create: function(members) {
		function klass() {
			this.initialize.apply(this, arguments);
		}
		for (var property in members)
			klass.prototype[property] = members[property];
		if (!klass.prototype.initialize)
			klass.prototype.initialize = Prototype.emptyFunction;
		klass.prototype.constructor = klass;
		klass.__members = members;
		return klass;
	}
};

String.prototype.include = String.prototype.include || function(pattern) {
	return this.indexOf(pattern) > -1;
};

var $A = $A || function(iterable) {
	if (!iterable) return [];
	if (iterable.toArray) return iterable.toArray();
	var length = iterable.length || 0, results = new Array(length);
	while (length--) results[length] = iterable[length];
	return results;
};

Function.prototype.bind = Function.prototype.bind || function() {
	var __method = this, args = $A(arguments), object = args.shift();
	return function() {
		return __method.apply(object, args.concat($A(arguments)));
	};
};

var Ajax = Ajax || {
	getTransport: function() {
		try { return new XMLHttpRequest(); } catch(e) {}
		try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
		try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	}
};

Ajax.Request = Ajax.Request || Class.create({
	_complete: false,
	initialize: function(url, options) {
		this.transport = Ajax.getTransport();
		this.url = url;
		this.options = {method:'post',contentType:'application/x-www-form-urlencoded',parameters:{}};
		Object.extend(this.options, options || {});
		this.method = this.options.method.toLowerCase();
		var params;
		if (params = Object.toQueryString(this.options.parameters)) {
			if (this.method == 'get')
				this.url += (this.url.include('?') ? '&' : '?') + params;
			else if (/Konqueror|Safari|KHTML/.test(navigator.userAgent))
				params += '&_=';
		}
		this.transport.open(this.method.toUpperCase(), this.url, true);
		this.transport.onreadystatechange = this.onStateChange.bind(this);
		this.setRequestHeaders();
		this.body = this.method == 'post' ? (this.options.postBody || params) : null;
		this.transport.send(this.body);
	},
	getHeader: function(name) {
		try {
			return this.transport.getResponseHeader(name) || null;
		} catch (e) { return null }
	},
	onStateChange: function() {
		var readyState = this.transport.readyState;
		if (readyState == 4 && !this._complete) {
			this._complete = true;
			var t = this.transport;
			var response = {
				transport: t,
				status: t.status,
				responseText: t.responseText,
				responseJSON: ((this.getHeader('Content-type') || '').include('application/json') && t.responseText.length > 0) ? eval('(' + t.responseText + ')') : null
			};
			(this.options.onComplete || Prototype.emptyFunction)(response);
		}
	},
	setRequestHeaders: function() {
		var headers = {
			'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
		};
		if (this.method == 'post') {
			headers['Content-type'] = this.options.contentType;
		}
		for (var name in headers)
			this.transport.setRequestHeader(name, headers[name]);
	}
});
