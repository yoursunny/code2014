//代码高亮 Dan Webb's CodeHighlighter, modified by yoursunny
/* <code class="javascript">document.getElementById('abcd').hide();</code>
 * <div class="code css">p { font-weight:bold; }</div>
 */
var CodeHighlighter={
	styleSets:[],
	addStyle:function(name, rules) {
		this.styleSets.push({
			name : name, 
			rules : rules,
			ignoreCase : arguments[2] || false
		});
		if (this.styleSets.length==1) Event.onReady(CodeHighlighter.init.bind(CodeHighlighter));
	},
	init:function() {
		if (!document.getElementsByTagName) return; 
		if ("a".replace(/a/,function(){return "b"})!="b") return;
		var rules = [];
		rules.toString = function() {
			// joins regexes into one big parallel regex
			var exps = [];
			for (var i = 0; i < this.length; i++) exps.push(this[i].exp);
			return exps.join("|");
		}
		function addRule(className, rule) {
			var exp = (typeof rule.exp != "string")?String(rule.exp).substr(1, String(rule.exp).length-2):rule.exp;
			rules.push({
				className : className,
				exp : "(" + exp + ")",
				length : (exp.match(/(^|[^\\])\([^?]/g) || "").length + 1, // number of subexps in rule
				replacement : rule.replacement || null 
			});
		}
		function parse(text, ignoreCase) {
			return text.replace(new RegExp(rules, ignoreCase?"gi":"g"), function() {
				var i = 0, j = 1, rule;
				while (rule = rules[i++]) {
					if (arguments[j]) {
						if (!rule.replacement) return "<span class=\"" + rule.className + "\">" + arguments[0] + "</span>";
						else {
							var str = rule.replacement.replace("$0", rule.className);
							for (var k = 1; k <= rule.length - 1; k++) str = str.replace("$" + k, arguments[j + k]);
							return str;
						}
					} else j+= rule.length;
				}
			});
		}
		function highlightCode(styleSet) {
			rules.clear();
			for (var className in styleSet.rules) addRule(className, styleSet.rules[className]);
			$$('code.'+styleSet.name+':not(.CodeHighlighter)','.code.'+styleSet.name+':not(.CodeHighlighter)').each(function(stylableEl){
				stylableEl.update(parse(stylableEl.innerHTML, styleSet.ignoreCase)).addClassName('CodeHighlighter');
			}.bind(this));
		}
		this.styleSets.each(highlightCode.bind(this));
	}
};
//代码高亮样式规则
CodeHighlighter.addStyle("javascript",{
	comment : {
		exp  : /(\/\/[^\n]*(\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/
	},
	brackets : {
		exp  : /\(|\)/
	},
	string : {
		exp  : /'[^']*'|"[^"]*"/
	},
	keywords : {
		exp  : /\b(arguments|break|case|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|typeof|var|void|while|with)\b/
	},
	global : {
		exp  : /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/
	}
});
CodeHighlighter.addStyle("css", {
	comment : {
		exp  : /\/\*[^*]*\*+([^\/][^*]*\*+)*\//
	},
	keywords : {
		exp  : /@\w[\w\s]*/
	},
	selectors : {
		exp  : "([\\w-:\\[.#][^{};>]*)(?={)"
	},
	properties : {
		exp  : "([\\w-]+)(?=\\s*:)"
	},
	units : {
		exp  : /([0-9])(em|ex|px|%|pt)\b/,
		replacement : "$1<span class=\"$0\">$2</span>"
	},
	urls : {
		exp  : /url\([^\)]*\)/
	}
 });
CodeHighlighter.addStyle("html", {
	comment : {
		exp: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
	},
	tag : {
		exp: /(&lt;\/?)([a-zA-Z]+\s?)/, 
		replacement: "$1<span class=\"$0\">$2</span>"
	},
	string : {
		exp  : /'[^']*'|"[^"]*"/
	},
	attribute : {
		exp: /\b([a-zA-Z-:]+)(=)/, 
		replacement: "<span class=\"$0\">$1</span>$2"
	},
	doctype : {
		exp: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
	}
});
CodeHighlighter.addStyle('php',{
	inlinetags:{exp:/(&lt;\?(php|=)?)|(\?&gt;)/},
	string:{exp:/'[^']*'|"[^"]*/},
	comment:{exp:/(\/\/[^\n]*(\n|$))|(\/\*[^*]*\*+([^\/][^*]*\*+)*\/)/},
	'var':{exp:/\$[a-z_]\w*/},
	reserved:{exp:'(echo|foreach|else|if|elseif|for|as|while|foreach|break|continue|class|const|declare|switch|case|endfor|endswitch|endforeach|endswitch|endif|array|default|do|enddeclare|eval|exit|die|extends|function|global|include_once|include|require_once|require|isset|empty|list|new|static|unset|var|return|try|catch|final|throw|public|private|protected|abstract|interface|implements|const|define|__FILE__|__LINE__|__CLASS__|__METHOD__|__FUNCTION__|NULL|true|false|and|or|xor)'}
});
//代码高亮样式表
document.write('<link rel="stylesheet" href="'+WebSite.domain+'/lib/9/CodeHighlighter.css"/>');
