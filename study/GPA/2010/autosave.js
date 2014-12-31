
GPA.autosave={
	init:function(){
		if (GPA.storage.supportLS) {
			var disabled=GPA.autosave.disabled=!!GPA.storage.get('autosave_disabled');
			$('#autosave').html('<label><input type="checkbox" id="autosave_enable"'+(disabled?'':'checked')+'>退出时自动保存课程信息到浏览器本地存储</label> <a href="javascript:;" id="autosave_clear">清除已存储信息</a>');
			$('#autosave_clear').toggle(disabled).click(function(){
				GPA.storage.set('coursedata',null);
				alert('已经清除本地存储中的课程信息');
			});
			$('#autosave_enable').click(function(){
				disabled=GPA.autosave.disabled=!$('#autosave_enable').is(':checked');
				$('#autosave_clear').toggle(disabled);
				GPA.storage.set('autosave_disabled',disabled);
			});
		} else {
			$('#autosave').html('你的浏览器不支持本地存储，退出前请手动导出课程信息');
			if (GPA.storage.serverCookie) {
				$('#algs').bind('GPA_updateRecentAlg',function(){
					GPA.storage.set('recentAlg',GPA.alg.recentList.list,true);
				});
			}
		}
		GPA.autosave.onLoad();
		$(window).unload(GPA.autosave.onUnload);
	},
	disabled:false,
	onLoad:function(){
		GPA.alg.recentList.fromStorage(GPA.storage.get('recentAlg'));
		var a=GPA.storage.get('coursedata');
		if (a) {
			var parsed=GPA.imp.json.parseJSON(a);
			var r=parsed[1];
			if (r) GPA.calc.importCourses(r,true);
		}
	},
	onUnload:function(){
		GPA.storage.set('recentAlg',GPA.alg.recentList.list,true);
		if (GPA.autosave.disabled) return;
		GPA.storage.setJSON('coursedata',GPA.save.json.getCoursesJSON());
	}
};
