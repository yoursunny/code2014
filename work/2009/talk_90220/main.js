(function($){

function callsignin() {//调用signin窗口的函数
	var p=$.makeArray(arguments),func=p.shift();
	var w=$('#signin_frame').get(0).contentWindow;
	return w.talk[func].apply(w.talk,p);
}
function callconversation() {//调用conversation窗口的函数
	var p=$.makeArray(arguments),id=p.shift(),func=p.shift();
	var w=ConversationUI[id].frame().contentWindow;
	return w.talk[func].apply(w.talk,p);
}

var SignedIn=false;
var Statuses={online:'联机',busy:'忙碌',idle:'空闲',beRightBack:'马上回来',away:'离开',inACall:'通话中',outToLunch:'外出就餐',appearOffline:'隐身',offline:'注销'};
var AppMe=null;//本地程序用户
var Me=null;//Live Messenger本用户
var Contacts=null;//联系人 LiveID=>LI
var ContactsNick=null;//联系人昵称 LiveID=>DisplayName
var ConversationUI=null;//会话窗口 id=>引用
var ConversationUIready=null;//会话窗口准备状态 id=>true已准备好 或 [msg1,msg2]保存尚未显示的消息

function ChangeName() {
	if (!SignedIn) return;
	callsignin('SetMe','DisplayName',$('#my_name').val());
}
function ChangePersonalMessage() {
	if (!SignedIn) return;
	callsignin('SetMe','PersonalMessage',$('#my_personalMessage').val());
}
function ChangeStatus() {
	if (!SignedIn) return;
	var status=$('#my_status').val();
	if (status=='offline') callsignin('SignOut');
	else callsignin('SetMe','Status',status);
}
function AnswerPending(n,c) {
	if (!SignedIn) return;
	var r=confirm(n+' '+talk_config.contact_name+'希望与你聊天。\n'+c.InviteMessage+'\n点击确定接受请求，点击取消拒绝请求');
	callsignin('ProcessPendingContact',n,r?'accept':'decline');
}
function ClickContact() {
	var c=$(this).data('c');
	if (c.IsPending) AnswerPending(c.IMAddress,c);
	else OpenConversation(c.IMAddress,c);
}
function OpenConversation(n,c) {
	if (!SignedIn) return;
	var id=callsignin('StartConversation',n);
	CreateConversationUI(id,callsignin('GetConversation',id));
}
function CreateConversationUI(id,t) {
	var cu=ConversationUI[id]=new parent.talk.ConversationUI(id,'conversation');
	cu.onCloseClick=function(){talk.ConversationClose(id);};
	ConversationUIready[id]=[];
}
function ReceiveMessage(id,sender,message,timestamp) {
	if (!SignedIn) return;
	var r=ConversationUIready[id];
	if (typeof r=='undefined') return;
	var nick=(sender==null)?Me.DisplayName:(!ContactsNick[sender]?sender:ContactsNick[sender]);
	if (r===true) callconversation(id,'MessageShow',nick,message,timestamp);
	else r.push([nick,message,timestamp]);
}
function RegisterInit() {
	var api=talk_config.api_url;
	var reg=$('#register').show();
	$.getJSON(api,{a:'me'},function(o1){
		AppMe=o1;
		if (AppMe.u==null) {
			reg.html('你可以在上面登录已有的Windows Live ID作为你的'+talk_config.messenger_name+'帐号，或者');
			$('<input type="button" value="快速注册新帐号"/>').appendTo(reg).click(function(){
				reg.html('正在注册帐号，请稍候...');
				$.getJSON(api,{a:'create'},function(o2){
					var password='';
					for (var i=0;i<8;++i) password+='ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(Math.floor(Math.random()*26));
					var address=o2.u;
					$.getJSON(o2.register+'?cb=?',{u:address,p:password,v:o2.v},function(r){
						if (r=='OK') {
							reg.html('注册完成，请在上面登录<br/>帐号：<br/>'+address+'<br/>初始密码：<br/>'+password);
							AppMe.u=address;
							$.getJSON(api,{a:'bind',u:address});
						} else reg.html('快速注册失败，请<a href="https://reg.msn.cn">手工注册</a>');
					})
				});
			});
		} else {
			reg.html('请登录聊天帐号：<br/>'+AppMe.u+'<br/>如已登录其他帐号，请“退出”后点击“帮助-更改帐户”并重新登录');
		}
	});
}

talk.extend({//供signin的调用接口
	onSignInReady:function(){//signin窗口准备好
		callsignin('CreateSignInControl');
	},
	onSignIn:function(){//登录完毕
		$('#register').hide().empty();
		Contacts={};
		ContactsNick={};
		ConversationUI={};
		ConversationUIready={};
		SignedIn=true;
		Me=callsignin('GetMe');
		setTimeout(function(){
			if (AppMe.u==null) {
				if (confirm('需要把当前的Windows Live ID：\n'+Me.IMAddress+'\n绑定到你的'+talk_config.site_name+'帐号：\n'+AppMe.uid+'\n，是否继续？\n（如果不绑定，则将自动注销）')) {
					AppMe.u=Me.IMAddress;
					$.getJSON(talk_config.api_url,{a:'bind',u:AppMe.u});
				} else {
					callsignin('SignOut');
				}
			} else if (AppMe.u!=Me.IMAddress) {
				alert('你登录了错误的'+talk_config.messenger_name+'帐号，请退出后重新登录：\n'+AppMe.u);
				callsignin('SignOut');
			}
		},1000);
	},
	onSignOut:function(){//注销完毕
		$('#my_name').val('');
		$('#my_personalMessage').val('');
		$('#my_status').val('offline');
		$('#contacts').empty();
		$.each(ConversationUI,function(){this.destroy();});
		SignedIn=false;
		RegisterInit();
	},
	MyInfoChange:function(me){//我的状态更新
		Me=me;
		$('#my_name').val(me.DisplayName);
		$('#my_personalMessage').val(me.PersonalMessage);
		$('#my_status').val(me.Status);
	},
	UpdateContact:function(n,c,isNew){//更新联系人信息
		var E=isNew?Contacts[n]=$('<li class="contact"/>'):Contacts[n];
		E.data('c',c).toggleClass('contact-pending',c.IsPending);
		if (c.IsPending) {
			E.text(c.IMAddress).attr('title',n);
		} else {
			E.text(c.DisplayName).attr('title',n+' '+c.PersonalMessage);
			$.each(Statuses,function(status){E.toggleClass('contact-status-'+status,c.Status==status);});
		}
		if (isNew) E.appendTo('#contacts').dblclick(ClickContact);
		ContactsNick[n]=c.DisplayName;
	},
	ConversationReceived:function(id,t){//收到别人创建的会话
		CreateConversationUI(id,t);
	},
	ConversationJoin:function(id,t,a){//有人加入会话
	},
	ConversationLeave:function(id,t,a){//有人离开会话
	},
	ConversationClose:function(id){//关闭会话
		callsignin('CloseConversation',id);
	},
	ConversationClosed:function(id,c){
		ConversationUI[id].destroy();
	},
	MessageReceived:function(id,c,sender,message,timestamp){//收到消息
		ReceiveMessage(id,sender,message,timestamp);
	}
});
talk.extend({//供conversation的调用接口
	ConversationReady:function(id){
		var r=ConversationUIready[id];
		ConversationUIready[id]=true;
		if (!!r.push) {
			$.each(r,function(a){
				callconversation(id,'MessageShow',a[0],a[1],a[2]);
			});
		}
	},
	MessageSend:function(id,message){
		callsignin('SendMessage',id,message);
		ReceiveMessage(id,null,message,new Date());
	}
});

$(document).ready(function(){
	talk.loadStyle(talk_config.style_url);
	$('body').addClass('main').append('<div id="my_info"><input id="my_name"/><br/><input id="my_personalMessage"/><br/><select id="my_status"/></div>');
	$('#my_name').change(ChangeName);
	$('#my_personalMessage').change(ChangePersonalMessage);
	$('#my_status').change(ChangeStatus);
	$.each(Statuses,function(status,name){
		var op=$('<option/>').text(name).attr('value',status).appendTo('#my_status');
		if (status=='offline') op.attr('selected','selected');
	});
	$('<iframe id="signin_frame" height="100" frameborder="0" scrolling="no"/>').attr('width',talk_config.main_width).attr('src',talk_config.page_url+'?signin').appendTo('body');
	$('<div id="register"/>').appendTo('body');
	RegisterInit();
	$('<div id="contacts"/>').appendTo('body');
});

})(jQuery);