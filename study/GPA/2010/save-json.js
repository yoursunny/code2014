
GPA.save.json={
	start:function(){
		GPA.stat('save/json');
		GPA.popup.open('保存为JSON代码','<div id="save_json">'
			+'<p>请复制代码并妥善保存，代码不能修改：</p>'
			+'<textarea id="save_json_code"></textarea>'
			+'<p><input type="button" id="save_json_ok" value="关闭"></p>'
			+'</div>',{height:200}).show();
		$('#save_json_code').text(GPA.save.json.getCoursesJSON());
		$('#save_json_ok').click(GPA.save.finish);
	},
	getCoursesJSON:function(){
		var o={
			version:'95ed3d84-6d7d-4e49-b9db-db27d16ec322',
			courses:[]
		};
		GPA.courses.each(function(id,C){
			o.courses.push({
				selected:C.selected,
				name:C.name,
				credit:C.credit,
				grade:C.grade,
				groups:C.groups
			});
		});
		return $.toJSON(o);
	}
};