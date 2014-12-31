GPA.tools={
	init:function(){
		GPA.menu.registerAction('tools',GPA.tools.prepareMenu);
		GPA.menu.registerAction('tools_translate',GPA.translate.start);
		GPA.menu.registerAction('tools_chart',GPA.chart.start);
		GPA.menu.registerAction('tools_bygroup',function(){GPA.bygroup.start('menu-tools');});
		$('#result_bygroup').click(function(){GPA.bygroup.start('inputui-bottom');});
	},
	prepareMenu:function(){
		var hasCourse=GPA.courses.hasCourse();
		GPA.menu.toggleEnabled('tools_translate',hasCourse);
		GPA.menu.toggleEnabled('tools_chart',hasCourse);
	}
};

GPA.translate={
	start:function(){
		GPA.stat('tools/translate');
		GPA.popup.open('翻译课程名称','<form id="translate_form" action=""><div>'
			+'<p>目标语言：<br>'
			+'<label><input type="radio" name="lang" value="English" checked>英语</label><br>'
			+'<label><input type="radio" name="lang" value="French">法语</label><br>'
			+'<label><input type="radio" name="lang" value="German">德语</label><br>'
			+'<label><input type="radio" name="lang" value="Italian">意大利语</label><br>'
			+'<label><input type="radio" name="lang" value="Japanese">日语</label><br>'
			+'</p>'
			+'<p>翻译结果：<br>'
			+'<label><input type="radio" name="result" value="below" checked>显示在下方</label> 报表仍显示原始课程名<br>'
			+'<label><input type="radio" name="result" value="replace">替换原课程名</label> 报表将显示翻译后的外文课程名<br>'
			+'</p>'
			+'<p><input type="button" id="translate_ok" value="翻译课程名称"></p>'
			+'<p>翻译服务：上海交通大学教务处课程英文名称查询，Bing Translator</p>'
			+'<div id="translate_progress" style="display:none;"><div id="translate_progress1"></div></div>'
			+'</div></form>');
		$('#translate_ok').click(GPA.translate.run);
	},
	run:function(){
		GPA.translate.collectCourseNames();
		var lang=$('#translate_form [name=lang]:checked').val();
		GPA.stat('tools/translate.'+lang);
		if (GPA.translate.currentLang!=lang) GPA.translate.translation={};//lang changed, clear pairs
		GPA.translate.currentLang=lang;
		GPA.translate.resultLocation=$('#translate_form [name=result]:checked').val();
		$('#translate_ok').attr('disabled',true);
		GPA.translate.SJTUTranslator(function(){
			GPA.translate.renderResult();
			GPA.translate.BingTranslator(function(){
				GPA.translate.renderResult();
				GPA.popup.close();
			});
		});
	},
	courseNames:[],//current used course names
	collectCourseNames:function(){
		var cn=GPA.translate.courseNames=[];
		GPA.courses.each(function(id,C){
			if (C.name && $.inArray(C.name,cn)<0) cn.push(C.name);
		});
	},
	currentLang:'English',
	translation:{},//received translation pairs, ChineseName=>ForeignName
	getUnknownNames:function(){//returns course names without a known translation
		return $.grep(GPA.translate.courseNames,function(n){
			return !(GPA.translate.translation[n]);
		});
	},
	SJTUTranslator:function(cb){
		if (GPA.translate.currentLang!='English') { cb(); return; }
		var payload=GPA.translate.getUnknownNames().join('\n');
		if (payload=='') { cb(); return; }
		$.post(GPA.server_base+'translate-sjtu.php',payload,function(data){
			$.extend(GPA.translate.translation,data);
			cb();
		},'json');
	},
	BingPending:0,
	BingCount:0,
	BingCompleted:$.noop,
	BingTranslator:function(cb){
		var TargetLanguage;
		switch (GPA.translate.currentLang) {
			case 'English': TargetLanguage='En'; break;
			case 'French': TargetLanguage='Fr'; break;
			case 'German': TargetLanguage='De'; break;
			case 'Italian': TargetLanguage='It'; break;
			case 'Japanese': TargetLanguage='Ja'; break;
			default: cb(); return;
		}
		GPA.translate.BingCompleted=cb;
		var words=GPA.translate.getUnknownNames();
		if (words.length==0) { cb(); return; }
		GPA.translate.BingCount=words.length;
		$('#translate_progress').show();
		GPA.translate.renderProgress(0);
		$.each(words,function(i,word){
			++GPA.translate.BingPending;
			W.loadjs('http://api.bing.net/json.aspx?AppId=87365BC18175A2555BFB0BF078223D5B18549986&Query='+encodeURIComponent(word)+'&Sources=Translation&Version=2.2&Market=zh-cn&Translation.SourceLanguage=zh-CHS&Translation.TargetLanguage='+TargetLanguage+'&JsonType=callback&JsonCallback=GPA.translate.BingCallback');
		});
	},
	BingCallback:function(response){
		try{ GPA.translate.translation[response.SearchResponse.Query.SearchTerms]=response.SearchResponse.Translation.Results[0].TranslatedTerm; }
		catch(ex){}
		var pending=(--GPA.translate.BingPending),count=GPA.translate.BingCount;
		GPA.translate.renderProgress((count-pending)/count);
		if (pending == 0) {
			$('#translate_progress').hide();
			GPA.translate.BingCompleted();
		}
	},
	renderProgress:function(percent){
		$('#translate_progress1').width(percent*400);
	},
	resultLocation:'below',
	renderResult:function(){
		GPA.courses.each(function(id,C){
			var E=GPA.translate.translation[C.name];
			if (E) {
				GPA.translate.renderTranslation(id,E);
			}
		});
	},
	renderTranslation:function(id,translation){
		switch (GPA.translate.resultLocation) {
			case 'below':
				if ($('#C_'+id+'_translation').text(translation).length==0) {
					$('<span id="C_'+id+'_translation" class="C_translation"></span>')
						.text(translation).before('<br>').insertAfter('#C_'+id+'_name');
				}
				break;
			case 'replace':
				$('#C_'+id+'_name').val(GPA.courses.get(id).name=translation);
				break;
		}
	}
};

GPA.chart={
	start:function(){
		GPA.stat('tools/chart');
		GPA.popup.open('绩点分布图','<p><img src="'+GPA.chart.buildChartURI(GPA.chart.collectByPoint())+'" alt="绩点分布图"></p>');
	},
	collectByPoint:function(){
		var r={};
		GPA.courses.each(function(id,C){
			var point=GPA.util.fix1(C.point);
			if (r[point]) ++r[point];
			else r[point]=1;
		},true);
		var a=[];
		$.each(r,function(point,count){
			point=parseFloat(point);
			var p=[point,count];
			var i=0;
			while (i<a.length && a[i][0]<point) ++i;
			a.splice(i,0,p);
		});
		return a;
	},
	buildChartURI:function(a){
		var chd=[],chxl=[],count_max=0;
		$.each(a,function(i,p){
			chd.push(p[1]);
			chxl.push(p[0]);
			count_max=Math.max(count_max,p[1]);
		});
		++count_max;
		return 'http://chart.apis.google.com/chart?chs=480x200&cht=bvs&chd=t:'+chd.join(',')+'&chds=0,'+count_max+'&chxt=x,y&chxl=0:|'+chxl.join('|')+'&chxr=1,0,'+count_max+','+Math.floor(count_max/4)+'&chm=N,000000,0,-1,11';
	}
};

GPA.bygroup={
	start:function(medium){
		GPA.stat('tools/bygroup?medium='+medium);
		var allGroups=GPA.bygroup.collectAllGroups();
		var TABLE=$('<table id="report_bygroup"><thead><tr><td>组代码</td><td>课程数</td><td>总学分</td><td>GPA</td></thead><tbody></tbody></tr>');
		var TBODY=TABLE.find('tbody');
		for (var i=0;i<allGroups.length;++i) {
			var g=allGroups.charAt(i);
			var R=GPA.bygroup.calcGroup(g);
			var TR=$('<tr>');
			$('<td>').text(g).appendTo(TR);
			$('<td>').text(R.course_count).appendTo(TR);
			$('<td>').text(R.credit_total).appendTo(TR);
			var v_GPA;
			if (R.course_count==0 || R.credit_total==0) v_GPA='—';
			else if (isNaN(R.GPA)) v_GPA='×';
			else v_GPA=GPA.util.fix4(R.GPA);
			$('<td>').text(v_GPA).appendTo(TR);
			TBODY.append(TR);
		}
		GPA.popup.open('分组统计结果',TABLE);
	},
	collectAllGroups:function(){
		var r='';
		GPA.courses.each(function(id,C){
			for (var i=0;i<C.groups.length;++i) {
				var g=C.groups.charAt(i);
				if (r.indexOf(g)<0) r+=g;
			}
		});
		return r;
	},
	buildFilter:function(g){
		return function(id,C){ return C.selected && C.groups.indexOf(g)>=0; };
	},
	calcGroup:function(g){
		var collector=new GPA.collector(GPA.bygroup.buildFilter(g));
		return collector.getResult();
	},
	resultToString:function(R){
		if (R.course_count==0 || R.credit_total==0) {
			return '没有选中的课程';
		} else {
			if (isNaN(R.GPA)) {
				return '部分成绩无法识别，未能算出结果';
			} else {
				return ''+R.course_count+'门课程，总学分='+R.credit_total+'，GPA='+GPA.util.fix4(R.GPA);
			}
		}
	}
};
