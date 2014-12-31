if (window.backuplet) return;//already running

B=window.backuplet={
	base:'http://yoursunny.com/work/backuplet/',
	saveTo:'http://yoursunny.com/work/backuplet/save/',
	logoUri:'http://is.gd/5BQC5',
	//logoUri:'http://yoursunny.com/work/backuplet/backuplet.png',
	Q:[],//task queue
	proceed:function(){//execute next task in queue
		if (B.Q.length<1) return B.log({proceed:'*nothing*'});
		var task=B.Q.shift();
		var method=task.shift();
		B.log({proceed:method,args:task});
		setTimeout(function(){ B[method].apply(null,task); },0);
	},
	loadjs:function(u,cb){
		var s=document.createElement('script');
		s.type='text/javascript';
		s.src=u.charAt(0)=='?'?B.base+'s/'+u:u;
		s.charset='utf-8';
		var done=false;
		s.onload=s.onreadystatechange=function(){
			if (!done && (!this.readyState || this.readyState=='loaded' || this.readyState=='complete')) {
				done=true;
				s.onload=s.onreadystatechange=null;
				document.body.removeChild(s);
			}
		};
		document.body.appendChild(s);
	},
	log:function(obj){
		if (window.console && console.log) console.log(obj);
	}
};

B.load_jQuery=function(){
	var available=function(){ return window.jQuery && jQuery.fn && jQuery.fn.jquery=='1.4.4'; };
	var provide=function(jQuery){
		$=B.$=jQuery;
		$('script[src='+B.base+'s/]').remove();
		B.proceed();
	};
	if (available()) {
		provide(window.jQuery);
	} else {
		B.loadjs('https://ajax.googleapis.com/ajax/libs/jquery/1.4.4/jquery.min.js');
		var interval=setInterval(function(){
			if (available()) {
				clearInterval(interval);
				provide(window.jQuery.noConflict(true));
			}
		},1000);
	}
};

B.init_basicUI=function(){
	var overlay=$('<div style="position:fixed;z-index:100;left:0;top:0;width:100%;height:100%;background:#000;" class="backuplet_ui"/>').css('opacity',0),
	ui=$('<div style="position:fixed;z-index:101;width:600px;height:250px;margin-left:-300px;margin-top:-125px;left:50%;top:50%;border:solid 5px #fc9;background:#fff url('+B.logoUri+') no-repeat right bottom;overflow:auto;color:#000;font-size:14px;line-height:20px;padding:20px;text-align:left;" class="backuplet_ui"><a style="display:block;position:absolute;right:0;top:0;width:20px;height:20px;font-size:18px;text-align:center;color:#f00;background:#ccc;cursor:default;" onclick="backuplet.quit()">×</a><p style="font-size:18px;line-height:30px;font-weight:bold;"><a href="http://yoursunny.com/work/backuplet/" target="_blank">backuplet</a>书签式网站导出/备份工具</p><div/><p style="position:absolute;font-size:18px;line-height:30px;bottom:0;"/></div>'),
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
				overlay.fadeOut('slow',function(){
					$('.backuplet_ui').remove();
					try{ delete window['backuplet']; }
					catch(ex){ window['backuplet']=false; }
				});
			});
		},
		ui_overlay:overlay,
		container:container,
		ui_show:function(){
			ui.appendTo('body');
			B.ui_show=$.noop;
		},
		ui_status:function(s){//set status text
			status_ui.text(s);
		},
		fault:function(msg){//report faulting error and let user quit
			B.ui_show();
			B.ui_status('失败');
			B.container.html('<p style="color:#f00;">'+msg+'</p><input type="button" value="退出" onclick="backuplet.quit()"/>');
		},
		ui_finished:function(){
			B.ui_status('导出/备份完成');
			B.container.html('<p><a href="'+B.base+'?sid='+B.sid+'" target="_blank">保存到你的计算机</a></p>');
		},
		ui_renderOverlay:function(){
			overlay.appendTo('body').fadeTo('slow',0.6,B.proceed);
		}
	});
	B.proceed();
};


B.init_storage=function(){
	$.extend(B,{
		encode:function(s){
			return $('<div>').text(''+s).html();
		},
		timestamp:function(dt){
			var fix2=function(n){ return n<10?'0'+n:''+n; };
			return ''+dt.getUTCFullYear()+'-'+fix2(dt.getUTCMonth()+1)+'-'+fix2(dt.getUTCDate())+'T'+fix2(dt.getUTCHours())+':'+fix2(dt.getUTCMinutes())+':'+fix2(dt.getUTCSeconds())+'Z';
		}
	});
	var sendform=$('<iframe name="backuplet_store" id="backuplet_store" src="about:blank" width="0" height="0" style="visibility:hidden;"></iframe><form method="post" target="backuplet_store"><input type="hidden" name="data"/></form>').appendTo(B.ui_overlay).filter('form'),
	s_startUri=B.saveTo+'s-start.php',
	s_sendUri=B.saveTo+'s-send.php';
	var intervalSaved;
	$.extend(B,{
		s_bufsize:20,
		s_buffer:[],
		s_start:function(feed){//start session
			B.ui_status('正在创建会话');
			$.getJSON(s_startUri+'?cb=?',function(sid){
				B.sid=sid;
				sendform.attr('action',s_sendUri+'?sid='+sid+'&parent='+encodeURIComponent(location.href));
				B.s_put(feed);
			});
		},
		s_put:function(entry){//put entry to session
			B.s_puts([entry]);
		},
		s_puts:function(entries){//put entries to session
			B.log({s_puts:entries});
			$.each(entries,function(i,entry){
				if (entry.updated && $.isFunction(entry.updated.getFullYear)) entry.updated=B.timestamp(entry.updated);
				B.s_buffer.push($.param(entry));
			});
			if (B.s_buffer.length>=B.s_bufsize) {
				B.s_send();
			} else {
				B.proceed()
			}
		},
		s_send:function(){//send buffered entries to server
			if (B.s_buffer.length==0) return B.proceed();
			B.ui_status('正在保存');
			var data=B.s_buffer.join('\n');
			B.s_buffer=[];
			sendform.find('input').val(data).end()
				.get(0).submit();
			intervalSaved=setInterval(B.s_poll_saved,500);
		},
		s_poll_saved:function(){
			if (location.hash.indexOf('backuplet-saved')>=0) {
				clearInterval(intervalSaved);
				location.hash='';
				B.proceed();
			}
		}
	});
	B.proceed();
};

B.init_request=function(){
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
	B.proceed();
};

B.init_login=function(){
	var yoursunnyLogin={
		container:null,
		onLogin:function(){},
		
		render:function(){
			yoursunnyLogin.container.innerHTML='<iframe src="http://yoursunny.com/lib/login/#'+encodeURIComponent(location.href)+'" style="width:240px;height:240px;border:solid 5px #090;" scrolling="no"></iframe>';
			if (location.host!='yoursunny.com') {
				var poll=setInterval(function(){
					if (location.hash.indexOf('yoursunny-login-done')>=0) {
						clearInterval(poll);
						location.hash='';
						yoursunnyLogin._onLogin();
					}
				},500);
			}
		},
		_onLogin:function(){
			yoursunnyLogin.container.innerHTML='';
			yoursunnyLogin.onLogin();
		}
	};

	$.extend(B,{
		login_name:false,
		check_login:function(){
			$.getJSON(B.saveTo+'checklogin.php?cb=?',function(login_name){
				B.login_name=login_name;
				if (!login_name) {
					B.Q.unshift(['prompt_login']);
				}
				B.proceed();
			});
		},
		prompt_login:function(){
			B.ui_show();
			B.ui_status('请登录');
			B.container.html('<p>为了保护隐私，建议你<a href="javascript:;" onclick="backuplet.start_login()">登录后使用</a>。</p><p>你也可以选择<a href="javascript:;" onclick="backuplet.skip_login()">不登录、匿名使用</a>。</p>');
		},
		start_login:function(){
			yoursunnyLogin.container=$('<div style="position:absolute;z-index:102;left:30%;top:25%;" class="backuplet_ui">').appendTo('body').get(0);
			yoursunnyLogin.onLogin=function(){
				B.Q.unshift(['check_login']);
				$(yoursunnyLogin.container).remove();
				B.proceed();
			};
			yoursunnyLogin.render();
		},
		skip_login:function(){
			B.proceed();
		}
	});
	B.proceed();
};

B.load_host=function(){
	B.loadjs('?h='+location.host);
};

B.delay=function(t){
	setTimeout(B.proceed,t);
};

if (/Gecko|WebKit/i.test(navigator.userAgent)) {
	B.Q.push(['load_jQuery'],['init_basicUI'],['init_storage'],['init_request'],['init_login'],['ui_renderOverlay'],['check_login']);
	B.Q.push(['load_host']);
} else {
	B.loadjs('?i=2010');
}

