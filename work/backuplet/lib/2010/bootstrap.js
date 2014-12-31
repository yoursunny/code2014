//backuplet
//Copyright 2010 yoursunny.com
//http://yoursunny.com/work/backuplet/

(function(){
var jQuery2011=null;
if (window.backuplet) {
	if (backuplet.want2010) {//call from 2011
		jQuery2011=backuplet.$;
		jQuery2011('.backuplet_ui').remove();
	} else {
		return;//already running
	}
}

var B=window.backuplet={
	base:'http://yoursunny.com/work/backuplet/',
	saveTo:'http://yoursunny.com/work/backuplet/save2010/',
	load:function(u,cb){
		var s=document.createElement('script');
		s.type='text/javascript';
		s.src=u.charAt(0)=='?'?B.base+'s/2010.php'+u:u;
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
	}
};

var init=function($){
	B.$=$;
	$('script[src='+B.base+'s/]').remove();
	B.load('?h='+location.host);


//----------------basic ui----------------
	var overlay=$('<div style="position:fixed;z-index:100;left:0;top:0;width:100%;height:100%;background:#000;"/>').css('opacity',0),
	//logoUri='http://is.gd/5BQC5',
	logoUri=B.base+'backuplet.png',
	ui=$('<div style="position:fixed;z-index:101;width:600px;height:250px;margin-left:-300px;margin-top:-125px;left:50%;top:50%;border:solid 5px #fc9;background:#fff url('+logoUri+') no-repeat right bottom;overflow:auto;color:#000;font-size:14px;line-height:20px;padding:20px;text-align:left;"><a style="display:block;position:absolute;right:0;top:0;width:20px;height:20px;font-size:18px;text-align:center;color:#f00;background:#ccc;cursor:default;" onclick="backuplet.quit()">×</a><p style="font-size:18px;line-height:30px;font-weight:bold;"><a href="http://yoursunny.com/work/backuplet/" target="_blank">backuplet</a>书签式网站导出/备份工具</p><div/><p style="position:absolute;font-size:18px;line-height:30px;bottom:0;"/></div>'),
	container=ui.find('div'),
	status_ui=ui.find('p:last');
	if ($.browser.msie && $.browser.version<=6) {
		overlay.css('position','absolute').width(document.body.clientWidth).height(document.body.clientHeight);
		overlay.append('<iframe src="'+B.base+'lib/IE6overlay.htm" style="position:absolute;left:0;top:0;width:100%;height:100%;z-index:-1;"></iframe>');
		ui.css('position','absolute');
		window.onerror=function(){return false;};
	}
	$.extend(B,{
		quit:function(){//cleanup and quit application
			ui.fadeOut('def',function(){
				ui.remove();
				overlay.fadeOut('slow',function(){
					overlay.remove();
					try{ delete window['backuplet']; }
					catch(ex){ window['backuplet']=false; }
				});
			});
		},
		container:container,
		html:function(h){//set ui html
			container.html(h);
		},
		status:function(s){//set status text
			status_ui.text(s);
		},
		fault:function(msg){//report faulting error and let user quit
			if (!B.main) B.main=$.noop;
			B.status('失败');
			B.html('<p style="color:#f00;">'+msg+'</p><input type="button" value="退出" onclick="backuplet.quit()"/>');
		},
		finished:function(){//show finished ui
			B.s_send(function(){
				B.status('导出/备份完成');
				B.html('<p><a href="'+B.base+'?sid='+B.sid+'&v=2010" target="_blank">保存到你的计算机</a></p>');
			});
		}
	});

//----------------storage session----------------
	var sendform=$('<iframe name="24ffefcd-207b-4f72-8b5a-adc67ce9de73" id="24ffefcd-207b-4f72-8b5a-adc67ce9de73" src="about:blank" width="0" height="0" style="visibility:hidden;"></iframe><form method="post" target="24ffefcd-207b-4f72-8b5a-adc67ce9de73"><input type="hidden" name="data"/></form>').appendTo(overlay).filter('form'),
	s_startUri=B.saveTo+'s-start.php',
	s_sendUri=B.saveTo+'s-send.php',
	buffer=[];
	$.extend(B,{
		s_bufsize:20,
		s_start:function(feed,cb){//start session
			B.status('正在创建会话');
			$.getJSON(s_startUri+'?cb=?',function(sid){
				B.sid=sid;
				sendform.attr('action',s_sendUri+'?sid='+sid);
				B.s_put(feed,cb);
			});
		},
		s_put:function(entry,cb){//put entry to session
			B.s_puts([entry],cb);
		},
		s_puts:function(entries,cb){//put entries to session
			$.each(entries,function(i,entry){
				if (entry.updated && $.isFunction(entry.updated.getFullYear)) entry.updated=B.timestamp(entry.updated);
				buffer.push($.param(entry));
			});
			if (buffer.length>=B.s_bufsize) {
				B.s_send(cb);
			} else {
				(cb||$.noop)();
			}
		},
		s_send:function(cb){//send buffered entries to server
			if (buffer.length==0) return (cb||$.noop)();
			B.status('正在保存');
			var data=buffer.join('\n');
			buffer=[];
			sendform.find('input').val(data).end()
				.get(0).submit();
			setTimeout(cb||$.noop,3000);
		}
	});

//----------------ajax----------------
	var request=function(success,u,cb,method,params,beforeSend){
		$.ajax({
			beforeSend:beforeSend||$.noop,
			cache:true,
			data:params||'',
			dataType:'text',
			error:function(){
				cb(false);
			},
			success:success,
			type:method||'GET',
			url:u
		});
	};
	$.extend(B,{
		requestJSON:function(u,cb,method,params,beforeSend){
			request(function(data){
				var o;
				try{ o=eval('('+data+')'); }
				catch(ex){ cb(false); }
				cb(o);
			},u,cb,method,params,beforeSend);
		},
		requestDIV:function(u,cb,method,params,beforeSend){
			request(function(data){
				cb($('<div/>').html(data.replace(/<script(.|\s)*?\/script>/g,'')));
			},u,cb,method,params,beforeSend);
		}
	});

//----------------util----------------
	$.extend(B,{
		encode:function(s){
			return $('<div>').text(s).html();
		},
		timestamp:function(dt){
			var fix2=function(n){ return n<10?'0'+n:''+n; };
			return ''+dt.getUTCFullYear()+'-'+fix2(dt.getUTCMonth()+1)+'-'+fix2(dt.getUTCDate())+'T'+fix2(dt.getUTCHours())+':'+fix2(dt.getUTCMinutes())+':'+fix2(dt.getUTCSeconds())+'Z';
		}
	});


	var run_main=function(){
		if ($.isFunction(B.main)) {
			ui.appendTo('body');
			B.main();
		} else setTimeout(run_main,500);
	};
	overlay.appendTo('body').fadeTo('slow',0.6,run_main);
};

if (jQuery2011) init(jQuery2011);
else {
	if (!window.jQuery || !jQuery.fn || jQuery.fn.jquery!='1.4.2') {
		B.load('http://ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js',function(){
			init(jQuery.noConflict(true));
		});
	} else init(jQuery);
}

})();