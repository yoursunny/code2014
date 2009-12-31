Event.onReady(prettyPrint);
document.write('<style type="text/css">.prettyprint .str{color:#080;}.prettyprint .kwd{color:#008;}.prettyprint .com{color:#800;}.prettyprint .typ{color:#606;}.prettyprint .lit{color:#066;}.prettyprint .pun{color:#660;}.prettyprint .pln{color:#000;}.prettyprint .tag{color:#008;}.prettyprint .atn{color:#606;}.prettyprint .atv{color:#080;}.prettyprint .dec{color:#606;}pre.prettyprint{padding:2px;border:1px solid#888;}@media print{.prettyprint .str{color:#060;}.prettyprint .kwd{color:#006;font-weight:bold;}.prettyprint .com{color:#600;font-style:italic;}.prettyprint .typ{color:#404;font-weight:bold;}.prettyprint .lit{color:#044;}.prettyprint .pun{color:#440;}.prettyprint .pln{color:#000;}.prettyprint .tag{color:#006;font-weight:bold;}.prettyprint .atn{color:#404;}.prettyprint .atv{color:#060;}}</style>');

//lang-sql by Google
PR.registerLangHandler(PR.createSimpleLexer([[PR.PR_PLAIN,/^[\t\n\r \xA0]+/,null,'\t\n\r \xA0'],[PR.PR_STRING,/^(?:"(?:[^\"\\]|\\.)*"|'(?:[^\'\\]|\\.)*')/,null,'"\'']],[[PR.PR_COMMENT,/^(?:--[^\r\n]*|\/\*[\s\S]*?(?:\*\/|$))/],[PR.PR_KEYWORD,/^(?:ADD|ALL|ALTER|AND|ANY|AS|ASC|AUTHORIZATION|BACKUP|BEGIN|BETWEEN|BREAK|BROWSE|BULK|BY|CASCADE|CASE|CHECK|CHECKPOINT|CLOSE|CLUSTERED|COALESCE|COLLATE|COLUMN|COMMIT|COMPUTE|CONSTRAINT|CONTAINS|CONTAINSTABLE|CONTINUE|CONVERT|CREATE|CROSS|CURRENT|CURRENT_DATE|CURRENT_TIME|CURRENT_TIMESTAMP|CURRENT_USER|CURSOR|DATABASE|DBCC|DEALLOCATE|DECLARE|DEFAULT|DELETE|DENY|DESC|DISK|DISTINCT|DISTRIBUTED|DOUBLE|DROP|DUMMY|DUMP|ELSE|END|ERRLVL|ESCAPE|EXCEPT|EXEC|EXECUTE|EXISTS|EXIT|FETCH|FILE|FILLFACTOR|FOR|FOREIGN|FREETEXT|FREETEXTTABLE|FROM|FULL|FUNCTION|GOTO|GRANT|GROUP|HAVING|HOLDLOCK|IDENTITY|IDENTITYCOL|IDENTITY_INSERT|IF|IN|INDEX|INNER|INSERT|INTERSECT|INTO|IS|JOIN|KEY|KILL|LEFT|LIKE|LINENO|LOAD|NATIONAL|NOCHECK|NONCLUSTERED|NOT|NULL|NULLIF|OF|OFF|OFFSETS|ON|OPEN|OPENDATASOURCE|OPENQUERY|OPENROWSET|OPENXML|OPTION|OR|ORDER|OUTER|OVER|PERCENT|PLAN|PRECISION|PRIMARY|PRINT|PROC|PROCEDURE|PUBLIC|RAISERROR|READ|READTEXT|RECONFIGURE|REFERENCES|REPLICATION|RESTORE|RESTRICT|RETURN|REVOKE|RIGHT|ROLLBACK|ROWCOUNT|ROWGUIDCOL|RULE|SAVE|SCHEMA|SELECT|SESSION_USER|SET|SETUSER|SHUTDOWN|SOME|STATISTICS|SYSTEM_USER|TABLE|TEXTSIZE|THEN|TO|TOP|TRAN|TRANSACTION|TRIGGER|TRUNCATE|TSEQUAL|UNION|UNIQUE|UPDATE|UPDATETEXT|USE|USER|VALUES|VARYING|VIEW|WAITFOR|WHEN|WHERE|WHILE|WITH|WRITETEXT)(?=[^\w-]|$)/i,null],[PR.PR_LITERAL,/^[+-]?(?:0x[\da-f]+|(?:(?:\.\d+|\d+(?:\.\d*)?)(?:e[+\-]?\d+)?))/i],[PR.PR_PLAIN,/^[a-z_][\w-]*/i],[PR.PR_PUNCTUATION,/^[^\w\t\n\r \xA0]+/]]),['sql']);

//lang-vb,lang-vbs, yoursunny.com 2008-12-14
//  ref: http://stackoverflow.com/questions/31097/is-there-a-lang-vb-or-lang-basic-option-for-prettifyjs-from-google
PR.registerLangHandler(
	PR.createSimpleLexer(
		[
			[PR.PR_PLAIN,/^[\t\n\r \xA0]+/, null,'\t\n\r \xA0'],
			[PR.PR_COMMENT,/^'[^\r\n]*/,null,'\''],
			[PR.PR_STRING,/^\"(?:[^\"]|\"\")*\"/,null,'"'],
			[PR.PR_LITERAL,/^[\d\.]+|\d{4}[HO]/i,null,'0123456789']
		],
		[
			[PR.PR_ATTRIB_NAME,/^\w+/,/\.$/],
			[PR.PR_KEYWORD,/^(?:addhandler|addressof|alias|and|andalso|as|boolean|byref|byte|byval|call|case|catch|cbool|cbyte|cchar|cdate|cdec|cdbl|char|cint|class|clng|cobj|const|continue|csbyte|cshort|csng|cstr|ctype|cuint|culng|cushort|date|decimal|declare|default|delegate|dim|directcast|do|double|each|else|elseif|end|endif|enum|erase|error|event|exit|false|finally|for|friend|function|get|gettype|getxmlnamespace|global|gosub|goto|handles|if|if|implements|imports|in|inherits|integer|interface|is|isnot|let|lib|like|long|loop|me|mod|module|mustinherit|mustoverride|mybase|myclass|namespace|narrowing|new|next|not|nothing|notinheritable|notoverridable|object|of|on|operator|option|optional|or|orelse|overloads|overridable|overrides|paramarray|partial|private|property|protected|public|raiseevent|readonly|redim|rem|removehandler|resume|return|sbyte|select|set|shadows|shared|short|single|static|step|stop|string|structure|sub|synclock|then|throw|to|true|try|trycast|typeof|variant|wend|uinteger|ulong|ushort|using|when|while|widening|with|withevents|writeonly|xor|#const|#else|#elseif|#end|#if)(?=\s|$)/i,/(?:^|\w)$/]
		]
	),
	['vb','vbs']
);
