//sunnyGPA http://yoursunny.com/study/GPA/
//Copyright 2010 sunny boy, All rights reserved
var GPA={
	init:function(){
		GPA.storage.init();
		GPA.menu.init();
		GPA.inputui.init();
		GPA.alg.init();//dependency:menu,storage
		GPA.calc.init();
		GPA.resultui.init();
		GPA.autosave.init();//dependency:storage,inputui,alg,calc,resultui
		GPA.imp.init();//dependency:menu
		GPA.save.init();//dependency:menu
		GPA.tools.init();//dependency:menu
		GPA.help.init();//dependency:menu
	},
	server_base:'/study/GPA/2010/',
	stat:function(k){
		if ($.inArray(k,GPA.stat_history)>=0) return;
		GPA.stat_history.push(k);
		c(GPA.stat_base+k);
	},
	stat_base:'/study/GPA/2010/',
	stat_history:[]
};
