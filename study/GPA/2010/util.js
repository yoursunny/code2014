GPA.util={
	normalizeFloat:function(s){
		var m=(''+s).match(/[0-9]*(?:\.[0-9]*)?/);
		if (m) return m[0].replace(/^\./,'0.').replace(/\.$/,'');//'.2'=>'0.2', '3.'=>'3'
		else return '';
	},
	fix1:function(n){
		if (isNaN(n)) return 'NaN';
		var s=''+Math.round(n*10);
		if (s.length==1) return '0.'+s;
		else return s.replace(/([0-9])$/,'.$1');
	},
	fix4:function(n){
		if (isNaN(n)) return 'NaN';
		var s=''+Math.round(n*10000);
		if (s.length<=4) {
			while (s.length<4) s='0'+s;
			return '0.'+s;
		} else return s.replace(/([0-9]{4})$/,'.$1');
	},
	reset_hiddenframe:function(){
		$('#hiddenframe').attr('src','about:blank');
	},
	getcsv:function(l,options){
		var a=[],//result array
			i=-1,//position
			w='',//word
			escape=false,//in escape
			enclosure=false;//in enclosure
		while (++i<l.length) {
			var ch=l.charAt(i);
			if (escape) {
				w+=ch;
				escape=false;
			} else {
				switch (ch) {
					case options.enclosure:
						enclosure=!enclosure;
						break;
					case options.delimeter:
						if (enclosure) {
							w+=ch;
						} else {
							a.push(w);
							w='';
						}
						break;
					case options.escape:
						escape=true;
						break;
					default:
						w+=ch;
						break;
				}
			}
		}
		a.push(w);
		return a;
	},
	replace_ok_cancel:function(s){
		var lang=navigator.language?navigator.language:navigator.userLanguage;
		if (!lang) return s;
		if (/^en/i.test(lang)) {
			return s.replace(/【确定】/g,'【OK】').replace(/【取消】/g,'【Cancel】');
		}
		return s;
	},
	allLevels:['A','A+','A','A-','B','B+','B','B-','C','C+','C','C-','D','D+','D','D-','E','E+','E','E-','P','F'],
	translateLevelPairs:{
		'A-':'B+',
		'B+':'A-',
		'B-':'C+',
		'C+':'B-',
		'C-':'D+',
		'D+':'C-'
	},
	isLevel:function(s){
		return $.inArray(s,GPA.util.allLevels)>=0;
	},
	parseLevelOrGrade:function(s){
		s=s.toUpperCase();
		if (GPA.util.isLevel(s)) return s;
		else return GPA.util.normalizeFloat(s);
	},
	translateLevel:function(level,supportedLevels){
		var translated=GPA.util.translateLevelPairs[level];
		if ($.inArray(translated,supportedLevels)>=0) return translated;
		var index=$.inArray(level,GPA.util.allLevels);
		while (index>=0 && $.inArray(GPA.util.allLevels[index],supportedLevels)<0) --index;
		if (index<0) return '';
		return GPA.util.allLevels[index];
	},
	parseGroups:function(s){//parse groups input, each character can appear only once
		var r='';
		for (var i=0;i<s.length;++i) {
			var ch=s.charAt(i);
			if (r.indexOf(ch)<0) r+=ch;
		}
		return r;
	}
};