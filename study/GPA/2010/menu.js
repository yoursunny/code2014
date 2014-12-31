GPA.menu={
	init:function(){
		$('#menubar li').each(function(){
			var LI=$(this);var k=LI.attr('id').substr(8);
			var open=function(){
				GPA.menu.invokeAction(k,LI);
				GPA.menu.show(k);
			};
			$('#menubar_'+k).click(open)
				.mouseover(function(){ if (GPA.menu.isOpen) open(); });
		});
		var menus=$('#menus');
		$('li',menus).live('click',function(){
			var LI=$(this);
			if (LI.hasClass('enable')) {
				var k=LI.attr('id').substr(5);
				GPA.menu.invokeAction(k,LI);
			}
		});
		if ($.browser.msie) {//IE doesn't support li:hover
			$('li.enable',menus).live('mouseenter',function(evt){
				$(this).addClass('hover');
			});
			$('li.enable',menus).live('mouseleave',function(evt){
				$(this).removeClass('hover');
			});
		}
		$('#app').click(function(){
			if (GPA.menu.opening) GPA.menu.opening=false;
			else GPA.menu.hideAll();
		});
	},
	opening:false,
	isOpen:false,
	invokeAction:function(k,LI){
		var dataAction=LI.data('menuAction');
		if (typeof dataAction=='function') dataAction(LI);
		else if (typeof dataAction=='string') (GPA.menu.actions[dataAction]||$.noop)(LI);
		else (GPA.menu.actions[k]||$.noop)(LI);
	},
	toggleEnabled:function(k,enabled){
		$('#menu_'+k).toggleClass('enable',enabled).toggleClass('disable',!enabled);
	},
	show:function(k){
		var button=$('#menubar_'+k);
		var pos=button.position();
		pos.top+=button.height()+2;
		GPA.menu.showAt(k,pos);
	},
	showAt:function(k,pos){
		GPA.menu.hideAll();
		var menu=$('#menu_'+k);
		if (pos.pageX && pos.pageY) {//event object
			pos={left:pos.pageX,top:pos.pageY};
		}
		menu.css(pos).slideDown(300,function(){ GPA.menu.opening=false; });
		GPA.menu.opening=GPA.menu.isOpen=true;
	},
	hideAll:function(){
		$('#menus .menu').stop(false,true).hide();
		GPA.menu.isOpen=false;
	},
	actions:{},
	registerAction:function(k,f){
		GPA.menu.actions[k]=f;
	}
};
