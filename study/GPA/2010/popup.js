
GPA.popup={
	open:function(title,html,options){
		options=$.extend({
			width:500,
			height:350
		},options);
		var width=0+options.width,height=0+options.height;
		$('#app_popup_title').width(width+40).text(title)
			.append('<a id="app_popup_close" href="javascript:;">×</a>');
		$('#app_popup_close').css('left',width+20).click(GPA.popup.close);
		$('#app_popup_wrap').width(width+40).height(height+60).css('margin','-'+(height/2+30)+'px 0 0 -'+(width/2+20)+'px');
		var c=$('#app_popup').width(width).height(height).html(html);
		$('#app_popup_root').show();
		$('#app_popup_overlay').css('opacity',0);
		$(window).bind('scroll resize',GPA.popup.autoMove);
		GPA.popup.autoMove();
		return c;
	},
	get:function(){
		return $('#app_popup');
	},
	close:function(){
		$('#app_popup').attr('class','');
		$('#app_popup_root').hide();
		$(window).unbind('scroll',GPA.popup.window_scroll_handler);
	},
	autoMove:function(evt){
		var win=$(window);
		$('#app_popup_root').css('top',win.scrollTop()).height(win.height());
	}
};