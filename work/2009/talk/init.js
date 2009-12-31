Microsoft.Live.Core.Loader.addScript('jQuery','http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js');
Microsoft.Live.Core.Loader.addScript('messenger.cn',talk_base+'WindowsLiveMessengerWebToolkit_zh-cn.js',['messenger.ui']);
Microsoft.Live.Core.Loader.load(['jQuery']);

var talk_config={};
function talk_init(container,api) {
	talk_config.container=container;
	talk_config.api=api;
	Microsoft.Live.Core.Loader.onReady(function(){//jQuery ready
		$.ajaxSetup({cache:false});
		talk_config.c=$('#'+talk_config.container);
		$.getJSON(talk_config.api+'?a=GetConfigAndToken',function(app_config){
			var appTag=$(document.createElement('msgr:app')).attr(app_config).attr('onsignedin','talk_SignInCompletedCallback').appendTo(talk_config.c);
			Microsoft.Live.Core.Loader.load(['messenger.ui', 'messenger.ui.styles.core','messenger.cn']);
			Microsoft.Live.Core.Loader.onReady(function(){//Messenger ready
				var barTag=Microsoft.Live.Messenger.UI.Tags.TagsFactory.createTag('bar',{onconsentcompleted:'talk_ConsentCompletedCallback'});
				talk_config.c.append(barTag).append('<p>cid=<span id="talk_cid"></span></p><p><a href="javascript:talk_CreateAccount()">快速注册Live ID</a><br/><span id="talk_reg">如果当前用户尚未绑定Live ID，可以利用Admin Center SDK快速注册</span></p><p id="talk_nf"></p>');
			});
		});
	});
}

function talk_CreateAccount() {
	var s=$('#talk_reg').text('正在取得注册信息');
	$.getJSON(talk_config.api+'?a=CreateAccount',function(o){
		if (o==null) { s.text('当前用户已经绑定Live ID，不能再注册新帐号'); return; }
		s.text('Live ID帐号：'+o.u+'，验证码：'+o.v);
		var password='';
		for (var i=0;i<8;++i) password+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random()*26));
		$.getJSON(o.register+'?cb=?',{u:o.u,p:password,v:o.v},function(r){
			if (r=='OK') {
				s.text('注册成功，Live ID帐号：'+o.u+'，密码：'+password);
			} else {
				s.text('注册失败');
			}
		});
	});
}

function talk_SignInCompletedCallback(e) {
	var u=Microsoft.Live.Messenger.UI.Tags.TagsFactory.get_user();
	if (!u) return;
	$('#talk_cid').text(u.get_identity().get_cid());
	var req=$.post(talk_config.api+'?a=GetApplicationContacts',{cid:u.get_identity().get_cid()},function(o){
		if (o.xml!=null && o.hash!=null) u.get_applicationContacts().setContacts(o.xml,o.hash);
		var nf=$('#talk_nf').html('以下好友尚未绑定Live ID：<br/>'+o.nolive.join('<br/>'));
		u.set_applicationDisplayName(o.nickname);
	},'json');
}

function talk_ConsentCompletedCallback(e) {
	var token=e.get_consentToken();
	$.post(talk_config.api+'?a=PutToken',{token:token});
}
