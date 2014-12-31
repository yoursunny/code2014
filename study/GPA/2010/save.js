
GPA.save={
	init:function(){
		GPA.menu.registerAction('save',GPA.save.prepareMenu);
		GPA.menu.registerAction('save_file',GPA.save.file.start);
		GPA.menu.registerAction('save_json',GPA.save.json.start);
		GPA.menu.registerAction('save_email',GPA.save.file.start_email);
	},
	prepareMenu:function(){
		var hasCourse=GPA.courses.hasCourse();
		GPA.menu.toggleEnabled('save_file',hasCourse);
		GPA.menu.toggleEnabled('save_json',hasCourse);
		GPA.menu.toggleEnabled('save_email',hasCourse);
	},
	finish:function(){
		GPA.popup.close();
	}
};
