GPA.help={
	init:function(){
		GPA.menu.registerAction('help_welcome',GPA.help.showWelcome);
		GPA.menu.registerAction('help_about',function(){
			alert('阳光GPA计算器\n©2010 yoursunny.com');
		});
		GPA.menu.registerAction('help_2009',function(){
			window.open('/study/GPA/2009/');
		});
		$('#loading').html('<input type="button" value="我知道了">')
			.find(':button').click(GPA.help.dismissWelcome);
		if (GPA.storage.get('welcome')) {
			$('#welcome').hide();
		}
	},
	showWelcome:function(){
		$('#welcome').slideDown();
	},
	dismissWelcome:function(){
		GPA.storage.set('welcome',new Date().getTime(),true)
		$('#welcome').slideUp();
	}
};
