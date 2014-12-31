/*
algorithm class
{
  name:'str'  algorithm name
  author:'str'  author
  link:'str' or ['str','str']  reference link
  note:'str'  note on usage (html)
  
  initialized:false  whether initialized, should set by caller
  initialize()  initialize data structure so members below can be called
  supportedLevels:['A','B','C']  array of supported levels
  calc(LevelOrGrade)  returns [point,level] or point
  getDetail()  get algorithm details, or explanation (html)
}

algorithm details=
[
  [
    [min_inclusive,max_exclusive] or level
    result or [callback,explanation] or callback(LevelOrGrade) returns result
  ]
]

result=[point,level] or point

triggering events
  GPA_changeAlg(evt)
  GPA_updateRecentAlg(evt)
*/
GPA.alg={
	init:function(){
		$('#alg_change').click(function(evt){
			$('#algs').slideDown();
		});
		$('#alg_view').click(function(){
			GPA.alg.viewDetail(GPA.thisAlg);
		});
		$('#alg_edit').click(function(){
			GPA.algedit.start(GPA.thisAlg);
		});
		GPA.alg.selectAlg(GPA.predefinedAlg.SJTU);
		GPA.menu.registerAction('alg',GPA.alg.recentList.prepareMenu);
		GPA.menu.registerAction('alg_all',function(){
			$('#algs').slideDown();
		});
		GPA.menu.registerAction('alg_predefined',function(LI){
			var key=LI.data('predefinedAlg_key');
			GPA.alg.selectAlg(GPA.predefinedAlg[key]);
		});
		$('a.alg','#algs').live('click',function(){
			var alg=$(this).attr('data-alg');
			GPA.stat('alg/'+alg);
			if (/^predefined:/.test(alg)) {
				var key=alg.substr(11);
				var A=GPA.predefinedAlg[key];
				if (A) GPA.alg.selectAlg(A,key);
			}
			$('#algs').slideUp();
		});
		GPA.myAlg.init();
	},
	selectAlg:function(A,predefinedKey){
		GPA.thisAlg=A;
		if (!A.initialized) A.initialize();
		$('#alg').trigger('GPA_changeAlg');
		$('#alg_name').text(A.name);
		$('#alg_note').html(A.note);
		$('#alg_detail').hide().html(A.detail);
		if (predefinedKey) GPA.alg.recentList.push(predefinedKey);
	},
	createAlg:function(name,detail,options){
		var processResult=function(result,LevelOrGrade){
			if ($.isFunction(result)) return processResult(result(LevelOrGrade),LevelOrGrade);
			else if ($.isArray(result) && $.isFunction(result[0])) return processResult(result[0](LevelOrGrade),LevelOrGrade);
			else return result;
		};

		var A={
			name:name,
			author:'',
			link:'',
			note:'',
			initialized:false
		};
		$.extend(A,options||{});
		A.initialize=function(){
			var sl=A.supportedLevels=[],
				fromGrade=[],
				fromLevel={};
			$.each(detail,function(i,entry){
				if ($.isArray(entry[0])) {
					fromGrade.push(entry);
				} else {
					var level=entry[0];
					if ($.inArray(sl,level)<0) sl.push(level);
					fromLevel[level]=processResult(entry[1],level);
				}
			});
			if (sl.length==0) sl=A.supportedLevels=null;
			A.calc=function(LevelOrGrade){
				if (sl!=null && GPA.util.isLevel(LevelOrGrade)) return fromLevel[LevelOrGrade];
				else {
					var result;
					$.each(fromGrade,function(i,entry){
						var range=entry[0];
						if (range[0]<=LevelOrGrade && LevelOrGrade<range[1]) {
							result=processResult(entry[1],LevelOrGrade);
							return false;
						}
					});
					return result;
				}
			};
			A.getDetail=function(){return detail;};
		}
		return A;
	},
	viewDetail:function(A){
		var getCondDetail=function(cond){
			if ($.isArray(cond)) {
				return ''+cond[0]+'≤分数＜'+cond[1];
			} else {
				return '等第'+cond;
			}
		};
		var getResultDetail=function(result){
			if ($.isFunction(result)) return '通过函数计算';//callback
			else if ($.isArray(result)) {
				if ($.isFunction(result[0])) return result[1];//[callback,detail]
				else return '绩点'+result[0]+'、等第'+result[1];//[point,level]
			} else return '绩点'+result;//point
		};
		var meta='<p>算法作者：'+A.author+'</p>';
		if (A.link) {
			var createLink=function(u){ return $('<div><a target="_blank"></a></div>').find('a').attr('href',u).text(u).end().html(); };
			if ($.isArray(A.link)) meta+='<p>参考资料：</p><ul><li>'+$.map(A.link,createLink).join('</li><li>')+'</li></ul>';
			else meta+='<p>参考资料：'+createLink(A.link)+'</p>';
		}
		var detail=A.getDetail();
		if ($.isArray(detail)) {
			var b='<ul>';
			$.each(detail,function(i,entry){
				b+='<li>'+getCondDetail(entry[0])+'：'+getResultDetail(entry[1])+'</li>';
			});
			b+='</ul>';
			detail=b;
		}
		GPA.popup.open('算法细节：'+A.name,'<div id="alg_detail">'+meta+'<hr>'+detail+'</div>');
	},
	recentList:{
		fromStorage:function(a){
			if (!$.isArray(a)) return;
			var l=[],A1;
			$.each(a,function(i,key){
				var A=GPA.predefinedAlg[key];
				if (A) {
					l.push(key);
					A1=A;
				}
			});
			GPA.alg.recentList.list=l;
			if (A1) {
				GPA.alg.selectAlg(A1);
				$('#algs').hide();
			}
		},
		push:function(key){
			var l=GPA.alg.recentList.list;
			if ($.inArray(key,l)>=0) return;
			l.push(key);
			if (l.length>6) l.shift();
			$('#algs').trigger('GPA_updateRecentAlg');
			GPA.alg.recentList.dirtyMenu();
		},
		list:[],
		prepareMenu:function(){
			var menu=$('#menu_alg');
			if (!menu.data('recentAlg')) {
				menu.data('recentAlg',true);
				var sep1=$('#menu_alg_sep1');
				$.each(GPA.alg.recentList.list,function(i,key){
					var A=GPA.predefinedAlg[key];
					$('<li>').addClass('enable').addClass('recentAlg').text(A.name).data('menuAction','alg_predefined').data('predefinedAlg_key',key).insertAfter(sep1);
				});
			}
		},
		dirtyMenu:function(){
			$('#menu_alg').data('recentAlg',false)
				.find('.recentAlg').remove();
		}
	}
};
GPA.thisAlg=null;
