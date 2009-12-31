// yoursunny backuplet bootstrap

(function(){
if (window.backuplet) return;//backuplet已经载入，直接退出
var B=window.backuplet={
	base:'http://65536.sunny/work/2009/backuplet/',
	load:function(u,cb) {//载入脚本
		var s=document.createElement('script');
		s.type='text/javascript';
		s.src=u[0]=='?'?B.base+'s/'+u:u;
		s.charset='utf-8';
		var done=false;
		s.onload=s.onreadystatechange=function(){
			if (!done && (!this.readyState || this.readyState=='loaded' || this.readyState=='complete')) {
				done=true;
				if (cb) cb();
				s.onload=s.onreadystatechange=null;
				document.body.removeChild(s);
			}
		};
		document.body.appendChild(s);
	},
	error:function(msg){B.start=function(){B.error(msg);};}
};
var loading_jQuery=false;
var init=function(){
	var $=B.$=loading_jQuery?jQuery.noConflict(true):jQuery;
	$('script[src='+B.base+'s/]').remove();
	B.load('?h='+location.host);
	B.overlay=$('<div style="position:fixed;z-index:100;left:0;top:0;width:100%;height:100%;background:#000;"/>').css('opacity',0).appendTo('body').fadeTo('slow',0.6,function(){
		if (!B.start) { setTimeout(arguments.callee,500); return; }
		var ui=$('<div style="position:fixed;z-index:101;width:600px;height:250px;margin-left:-300px;margin-top:-125px;left:50%;top:50%;border:solid 5px #fc9;background:#fff url('+B.base+'backuplet.png) no-repeat right bottom;overflow:auto;color:#000;font-size:14px;line-height:20px;padding:20px;"><a style="display:block;position:absolute;right:0;top:0;width:20px;height:20px;font-size:18px;text-align:center;color:#f00;background:#ccc;cursor:default;" onclick="backuplet.quit()">×</a><p style="font-size:18px;line-height:30px;font-weight:bold;"><a href="http://www.65536.cn/work/2009/backuplet/">backuplet</a>书签式网站导出/备份工具</p><div/><p style="position:absolute;font-size:18px;line-height:30px;bottom:0;"/></div>').appendTo('body');
		$.extend(B,{
			//------------基本界面------------
			container:ui.find('div'),
			status_ui:ui.find('p').eq(1),
			quit:function() {//清理并退出
				B.container.parent().fadeOut('def',function(){
					$(this).remove();
					B.overlay.fadeOut('slow',function(){
						B.overlay.remove();
						delete window.backuplet;
					});
				});
			},
			ui:function(h) {//替换整个界面
				B.container.html(h);
			},
			error:function(msg) {//显示错误信息
				B.status('失败');
				B.ui('<p style="color:#f00;">'+msg+'</p><input type="button" value="退出" onclick="backuplet.quit()"/>');
			},
			html:function(s) {//HTMLEncode
				return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
			},
			status:function(s) {
				B.status_ui.text(s);
			},
			//------------数据存储------------
			putform:$('<iframe name="24ffefcd-207b-4f72-8b5a-adc67ce9de73" id="24ffefcd-207b-4f72-8b5a-adc67ce9de73" src="about:blank" width="0" height="0" style="visibility:hidden;"></iframe><form method="post" target="24ffefcd-207b-4f72-8b5a-adc67ce9de73"><input type="hidden" name="data"/></form>').appendTo(B.overlay).filter('form'),
			s_start:function(cb) {//开始会话
				$.getJSON(B.base+'s-start.php?cb=?',function(sid){
					B.sid=sid;
					B.putform.attr('action',B.base+'s-put.php?sid='+sid);
					if(cb) cb();
				});
			},
			s_put:function(data,cb) {//保存数据块
				B.putform.find('input').val(data).end().get(0).submit();
				if(cb) setTimeout(cb,1000);
			},
			getDIV:function(u,cb) {//下载HTML到DIV中
				if (!cb) return;
				$.ajax({
					cache:true,
					error:function(){
						cb(false);
					},
					success:function(data){
						cb($('<div/>').html(data.replace(/<script(.|\s)*?\/script>/g,'')));
					},
					url:u
				});
			}
		});
		B.start();//.start应在特定网站脚本中定义
	});
};
if (!window.jQuery || !window.jQuery.fn || window.jQuery.fn.jquery!='1.3.2') {
	loading_jQuery=true;
	B.load('http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js',init);
} else init();
})();