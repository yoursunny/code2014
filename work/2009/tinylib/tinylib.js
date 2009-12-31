Object.extend=function(destination, source) {
	for (var property in source)
		destination[property] = source[property];
	return destination;
};

Object.toQueryString=function(o) {
	var a=[];
	for (var property in o) {
		a.push(property+'='+encodeURIComponent(o[property]));
	}
	return a.join('&');
};

Object.toJSON=function(o) {
	switch (typeof o) {
		case 'undefined': case 'function': case 'unknown': return;
		case 'boolean': return o.toString();
		case 'number': return isFinite(o)?o.toString():'null';
		case 'string': return '"'+o.replace(/[\x00-\x1f\\]/g,function(c){
			switch (c) {
				case '\b': return '\\b';
				case '\t': return '\\t';
				case '\n': return '\\n';
				case '\f': return '\\f';
				case '\r': return '\\r';
				case '\\': return '\\\\';
				default: return '\\u00'+toPaddedString(c.charCodeAt(),2,16);
			}
		}).replace(/"/g,'\\"')+'"';
	}
	if (o===null) return 'null';
	if (o.getFullYear) return '"'+o.getUTCFullYear()+'-'+toPaddedString(o.getUTCMonth()+1,2)+'-'+toPaddedString(o.getUTCDate(),2)+'T'+toPaddedString(o.getUTCHours(),2)+':'+toPaddedString(o.getUTCMinutes(),2)+':'+toPaddedString(o.getUTCSeconds(),2)+'Z"';
	var a=[];
	if (o.push && o.unshift) {
		for (var i=0,ilen=o.length;i<ilen;++i) {
			a[i]=toJSON(o[i]);
		}
		return '['+a.join(',')+']';
	}
	for (var p in o) {
		var v=toJSON(o[p]);
		if (typeof v!='undefined') a.push(toJSON(p)+':'+v);
	}
	return '{'+a.join(',')+'}';
};

var Class={
	create:function(members) {
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

var $A=function(a) {
	if (!a) return [];
	if (a.toArray) return a.toArray();
	return Array.prototype.slice.call(a);
};

Object.extend(String.prototype,{
	include:function(p) {
		return this.indexOf(p)>=0;
	},
	strip:function() {
		return this.replace(/^\s+/, '').replace(/\s+$/, '');
	},
	startsWith:function(p) {
		return this.indexOf(p)===0;
	},
	endsWith:function(p) {
		var d=this.length-p.length;
		return d>=0 && this.lastIndexOf(p)===d;
	}
});

Object.extend(Function.prototype,{
	bind:function() {
		var __method = this, args = $A(arguments), object = args.shift();
		return function() {
			return __method.apply(object, args.concat($A(arguments)));
		};
	}
};

Object.extend(Number.prototype,{
	toPaddedString: function(length, radix) {
		var s=this.toString(radix||10);
		while (s.length<length) s='0'+s;
		return s;
	}
});