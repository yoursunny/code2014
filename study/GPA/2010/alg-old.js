
GPA.oldAlg={
	parse:function(s){
		if (/new GPA\.Algorithm\.RangeMap/.test(s)) {
			try{
				return eval(s.replace('new GPA.Algorithm.RangeMap','GPA.oldAlg.RangeMap'));
			}catch(ex){}
		} else if (/new GPA\.Algorithm\.ArithmeticMap/.test(s)) {
			try{
				return eval(s.replace('new GPA.Algorithm.ArithmeticMap','GPA.oldAlg.ArithmeticMap'));
			}catch(ex){}
		} else if (/GPA.Algorithm.ZJU/.test(s)) {
			return GPA.predefinedAlg.ZJU;
		} else if (/GPA.Algorithm.PKU7/.test(s)) {
			return GPA.predefinedAlg.PKU7;
		}
	},
	import2009CookieSave:function(){
		if (GPA.storage.get('myAlg_import2009CookieSave')) return;
		GPA.storage.set('myAlg_import2009CookieSave',true);
		if (!/GPA_Algorithm_Saved/.test(document.cookie)) return;
		var Cookie={get:function(A){var B=document.cookie.match(new RegExp("(^|;)\\s*"+escape(A)+"=([^;\\s]*)"));return(B?unescape(B[2]):null)}};//Prototype cookie extension is using escape and unescape, while jQuery cookie extension is using decodeURIComponent. They have different representation of Asian characters.
		var s=Cookie.get('GPA_Algorithm_Saved');
		if (!s || s.substr(0,1)!='[') return;
		s=s.substr(1,s.length-2)+',';
		while (s.length>0) {
			var m=s.match(/\(new GPA\.Algorithm\.RangeMap\('[^\']*'(?:\,[0-9\.]+)*\)\)\,/);
			if (m) {
				var A=GPA.oldAlg.parse(m[0].substr(0,m[0].length-1));
				if (A) GPA.myAlg.add(A);
				s=s.substr(m.index+m[0].length)
			} else {
				break;
			}
		}
	},

	RangeMap:function(){//range=>point algorithm, compatible with v2009
	//GPA.oldAlg.RangeMap('name',4.3,95,4.0,90, ...); in descending order
		var a=$.makeArray(arguments);
		var name=a.shift(),detail=[];
		a.unshift(Infinity);
		if (a.length%2!=1) a.push(0);
		for (var i=1;i<a.length;i+=2) {
			detail.push([[a[i+1],a[i-1]],a[i]]);
		}
		return GPA.alg.createAlg(name,detail);
	},
	ArithmeticMap:function(name,p,js,info) {//arithmetic algorithm, ctor compatible with v2009
		var detail=[
			[[0,Infinity],p]
		];
		return GPA.alg.createAlg(name,detail);
	}
};
