/**
* Cookie plugin
*
* Copyright (c) 2006 Klaus Hartl (stilbuero.de)
* Dual licensed under the MIT and GPL licenses:
* http://www.opensource.org/licenses/mit-license.php
* http://www.gnu.org/licenses/gpl.html
*
*/
jQuery.cookie=function(a,b,c){if(typeof b!="undefined"){c=c||{};if(b===null){b="";c.expires=-1}var d="";if(c.expires&&(typeof c.expires=="number"||c.expires.toUTCString)){if(typeof c.expires=="number"){d=new Date;d.setTime(d.getTime()+c.expires*24*60*60*1E3)}else d=c.expires;d="; expires="+d.toUTCString()}var e=c.path?"; path="+c.path:"",g=c.domain?"; domain="+c.domain:"";c=c.secure?"; secure":"";document.cookie=[a,"=",encodeURIComponent(b),d,e,g,c].join("")}else{b=null;if(document.cookie&&document.cookie!=
""){c=document.cookie.split(";");for(d=0;d<c.length;d++){e=jQuery.trim(c[d]);if(e.substring(0,a.length+1)==a+"="){b=decodeURIComponent(e.substring(a.length+1));break}}}return b}};

/*
 * jQuery JSON Plugin
 * version: 2.1 (2009-08-14)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org 
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is 
 * copyrighted 2005 by Bob Ippolito.
 */
(function(a){a.toJSON=function(d){if(typeof JSON=="object"&&JSON.stringify)return JSON.stringify(d);var e=typeof d;if(d===null)return"null";if(e!="undefined"){if(e=="number"||e=="boolean")return d+"";if(e=="string")return a.quoteString(d);if(e=="object"){if(typeof d.toJSON=="function")return a.toJSON(d.toJSON());if(d.constructor===Date){var g=d.getUTCMonth()+1;if(g<10)g="0"+g;var f=d.getUTCDate();if(f<10)f="0"+f;e=d.getUTCFullYear();var h=d.getUTCHours();if(h<10)h="0"+h;var i=d.getUTCMinutes();if(i<
10)i="0"+i;var j=d.getUTCSeconds();if(j<10)j="0"+j;d=d.getUTCMilliseconds();if(d<100)d="0"+d;if(d<10)d="0"+d;return'"'+e+"-"+g+"-"+f+"T"+h+":"+i+":"+j+"."+d+'Z"'}if(d.constructor===Array){g=[];for(f=0;f<d.length;f++)g.push(a.toJSON(d[f])||"null");return"["+g.join(",")+"]"}g=[];for(f in d){e=typeof f;if(e=="number")e='"'+f+'"';else if(e=="string")e=a.quoteString(f);else continue;if(typeof d[f]!="function"){h=a.toJSON(d[f]);g.push(e+":"+h)}}return"{"+g.join(", ")+"}"}}};a.evalJSON=function(d){if(typeof JSON==
"object"&&JSON.parse)return JSON.parse(d);return eval("("+d+")")};a.secureEvalJSON=function(d){if(typeof JSON=="object"&&JSON.parse)return JSON.parse(d);var e=d;e=e.replace(/\\["\\\/bfnrtu]/g,"@");e=e.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]");e=e.replace(/(?:^|:|,)(?:\s*\[)+/g,"");if(/^[\],:{}\s]*$/.test(e))return eval("("+d+")");else throw new SyntaxError("Error parsing JSON, source is not valid.");};a.quoteString=function(d){if(d.match(b))return'"'+d.replace(b,
function(e){var g=c[e];if(typeof g==="string")return g;g=e.charCodeAt();return"\\u00"+Math.floor(g/16).toString(16)+(g%16).toString(16)})+'"';return'"'+d+'"'};var b=/["\\\x00-\x1f\x7f-\x9f]/g,c={"\u0008":"\\b","\t":"\\t","\n":"\\n","\u000c":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"}})(jQuery);
