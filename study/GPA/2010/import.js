
GPA.imp={
	init:function(){
		GPA.menu.registerAction('input_file',GPA.imp.file.start);
		GPA.menu.registerAction('input_json',GPA.imp.json.start);
		GPA.menu.registerAction('input_sjtujwb',GPA.imp.sjtujwb.start);
	},
	finish:function(courses){
		var clear=false;
		if (GPA.courses.hasCourse()) {
			clear=confirm(GPA.util.replace_ok_cancel('是否清除已经输入的课程信息？\n点击【确定】清除全部已有课程，点击【取消】将现在导入的课程与已有课程合并。'));
		}
		GPA.calc.importCourses(courses,clear);
		GPA.popup.close()
	}
};
