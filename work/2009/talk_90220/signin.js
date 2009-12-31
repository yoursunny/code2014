(function(){

function makeArray(a) {//转换成数组
	var r=[];
	if (!!a.get_count) {//Microsoft.Live.Messenger.Collection
		for (var i=0,len=a.get_count();i<len;++i) r[i]=a.get_item(i);
	} else {
		for (var i=0;i<a.length;++i) r[i]=a[i];
	}
	return r;
}
function $each(a,f) {//对数组每个元素执行函数f(item,i)
	var r=[];
	if (!!a.get_count) {//Microsoft.Live.Messenger.Collection
		for (var i=0,len=a.get_count();i<len;++i) r[i]=f(a.get_item(i),i);
	} else {
		for (var i=0;i<a.length;++i) r[i]=f(a[i],i);
	}
	return r;
}
function $clone(o) {
	var r={};
	for (var p in o) r[p]=o[p];
	return r;
}
function defer() {//稍后调用函数
	var p=makeArray(arguments),func=p.shift();
	var t=this;
	setTimeout(function(){func.apply(t,p);},50);
}
function diff(NEW,OLD) {//比较属性并调用相应函数
	var k={NEW:NEW,OLD:OLD};
	k.c=function(p,f) {//如果p属性不同，则调用f(NEW[p],OLD[p],p)
		if (k.NEW[p]!=k.OLD[p]) f(k.NEW[p],k.OLD[p],p);
		return k;
	};
	return k;
}
function callmain() {//调用main窗口的函数
	var p=makeArray(arguments),func=p.shift();
	return parent.talk[func].apply(parent.talk,p);
}
/*function defer_callmain() {//稍后调用main窗口的函数
	var p=makeArray(arguments); p.unshift(callmain);
	var t=this;
	defer.apply(t,p);
}*/
var defer_callmain=callmain;
function enum_string(v,en) {//枚举值转换成字符串
	for (var p in en) {
		if (en[p]==v) return p;
	}
	return '';
}

window.User=null;//已登录用户Microsoft.Live.Messenger.User
window.Me=null;
window.Contacts=null;//用户的联系人，IMAddress=>{IMAddress,IsPending:false,IsBlocked,DisplayName,DisplayPictureUrl,PersonalMessage,Status}或{IMAddress,IsPending:true,InviteMessage}
window.Conversations=null;//会话信息，id=>{IMAddress:[address1,address2]}
window.ConversationL=null;//会话对象，id=>Microsoft.Live.Messenger.Conversation

function MyInfo(u) {//从Microsoft.Live.Messenger.User创建用户信息对象
	this.IMAddress=u.get_address().get_address();
	var p=u.get_presence();
	this.DisplayName=p.get_displayName();
	//this.DisplayPictureUrl=p.get_displayPictureUrl().toString();
	this.PersonalMessage=p.get_personalMessage();
	this.Status=enum_string(p.get_status(),Microsoft.Live.Messenger.PresenceStatus);
}
function ContactInfo(c) {//从Microsoft.Live.Messenger.Contact或Microsoft.Live.Messenger.PendingContact创建联系人信息对象
	if (!!c.accept) {
		this.IMAddress=c.get_imAddress().get_address();
		this.IsPending=true;
		this.InviteMessage=c.get_inviteMessage();
	} else {
		this.IMAddress=c.get_currentAddress().get_address();
		this.IsPending=false;
		this.IsBlocked=c.get_isBlocked();
		this.DisplayName=c.get_displayName();
		var p=c.get_presence();
		//this.DisplayPictureUrl=p.get_displayPictureUrl().toString();
		this.PersonalMessage=p.get_personalMessage();
		this.Status=enum_string(p.get_status(),Microsoft.Live.Messenger.PresenceStatus);
	}
}
function ConversationInfo(t) {//从Microsoft.Live.Messenger.Conversation创建会话信息对象
	this.Closed=false;
	this.IMAddress=$each(t.get_roster(),function(n){return n.get_address();});
}

function update_contacts(a) {//更新一些联系人
	$each(a,function(t){
		var c=new ContactInfo(t);
		var n=c.IMAddress;
		if (!t.accept && (!Contacts[n] || Contacts[n].IsPending)) {//新联系人或pending变成正常
			t.add_propertyChanged(function(sender,e){update_contacts([t]);});
			t.get_presence().add_propertyChanged(function(sender,e){update_contacts([t]);});
		}
		defer_callmain('UpdateContact',n,c,!Contacts[n]);
		Contacts[n]=c;
	});
}
function update_conversations(a) {//更新一些会话
	$each(a,function(t){
		var id=-1;
		$each(ConversationL,function(T,i){if(T==t)id=i;});
		if (id>=0) return;
		id=ConversationL.length;
		var c=Conversations[id]=new ConversationInfo(t);
		ConversationL[id]=t;
		listen_conversation(t,id);
		defer_callmain('ConversationReceived',id,c);
	});
}
function listen_conversation(t,id) {//设置监听会话的某些事件
	t.add_propertyChanged(function(sender,e){
		var c=Conversations[id]; if (c.Closed) return;
		if (e.get_propertyName()=='Closed' && t.get_closed()) {
			c.Closed=true;
			defer_callmain('ConversationClosed',id,c);
			ConversationL[id]=null;
		}
	});
	t.add_messageReceived(function(sender,e){
		var c=Conversations[id]; if (c.Closed) return;
		var m=e.get_message();
		if (m.get_type()==Microsoft.Live.Messenger.MessageType.textMessage) {
			defer_callmain('MessageReceived',id,c,m.get_sender().get_address(),m.get_text(),m.get_timestamp());
		}
	});
	t.get_roster().add_collectionChanged(function(sender,e){
		var c=Conversations[id]; if (c.Closed) return;
		c=Conversations[id]=new ConversationInfo(t);
		if (e.get_action()==Microsoft.Live.Core.NotifyCollectionChangedAction.add) {
			defer_callmain('ConversationJoin',id,c,$each(e.get_newItems(),function(n){return n.get_address();}));
		} else if (e.get_action()==Microsoft.Live.Core.NotifyCollectionChangedAction.remove) {
			defer_callmain('ConversationLeave',id,c,$each(e.get_newItems(),function(n){return n.get_address();}));
		}
	});
}

talk.extend({
	CreateSignInControl:function() {//创建登录控件
		var div=document.createElement('div');
		div.id='signin_container';
		div.style.height='100px';
		document.body.appendChild(div);
		var ctrl=new Microsoft.Live.Messenger.UI.SignInControl('signin_container',talk_config.privacy_url,talk_config.channel_url,'zh-CN');
		ctrl.add_authenticationCompleted(function(sender,e){
			User=new Microsoft.Live.Messenger.User(e.get_identity());
			User.add_signInCompleted(function(sender,e){
				if (e.get_resultCode()===Microsoft.Live.Messenger.SignInResultCode.success) {
					Contacts={};
					Conversations=[];
					ConversationL=[];
					callmain('onSignIn');
				}
			});
			var onSignOut=function(sender,e){User=null;callmain('onSignOut');};
			User.add_signOutCompleted(onSignOut);
			User.add_signedOutRemotely(onSignOut);
			var onMyInfoChange=function(sender,e){
				Me=new MyInfo(User);
				defer_callmain('MyInfoChange',Me);
			};
			User.add_propertyChanged(onMyInfoChange);
			User.get_presence().add_propertyChanged(onMyInfoChange);
			var onContactCollectionChanged=function(sender,e){
				if (e.get_action()==Microsoft.Live.Core.NotifyCollectionChangedAction.add) defer(update_contacts,e.get_newItems());
				if (e.get_action()==Microsoft.Live.Core.NotifyCollectionChangedAction.reset) defer(update_contacts,sender);
			};
			User.get_contacts().add_collectionChanged(onContactCollectionChanged);
			User.get_pendingContacts().add_collectionChanged(onContactCollectionChanged);
			User.get_conversations().add_collectionChanged(function(sender,e){
				if (e.get_action()!=Microsoft.Live.Core.NotifyCollectionChangedAction.add) return;
				defer(update_conversations,e.get_newItems());
			});
			User.signIn();
		});
	},
	SignOut:function() {//注销
		User.signOut(Microsoft.Live.Messenger.SignOutLocations.local);
	},
	GetMe:function() {//获取我的信息
		return $clone(Me);
	},
	SetMe:function(m,val) {//设置我的信息
		if (arguments.length==2) {
			var me=talk.GetMe();
			me[m]=val;
			talk.SetMe(me);
			return;
		}
		var p=User.get_presence();
		diff(m,Me)
			.c('DisplayName',function(v){p.set_displayName(v);})
			.c('PersonalMessage',function(v){p.set_personalMessage(v);})
			.c('Status',function(v){p.set_status(Microsoft.Live.Messenger.PresenceStatus[v]);});
	},
	GetContact:function(n) {//获取联系人信息
		return Contacts[n];
	},
	BlockContact:function(n,blocked) {//阻止/解除阻止联系人
		var c=Contacts[n];
		if (!c || c.IsPending) return;
		if (c.IsBlocked!=blocked) {
			var contact=User.get_contacts().find(n,Microsoft.Live.Messenger.IMAddressType.windowsLive);
			if (!contact) return;
			if (blocked) c.block();
			else c.allow();
		}
	},
	ProcessPendingContact:function(n,action) {//接受/拒绝邀请
		var c=Contacts[n];
		if (!c || !c.IsPending) return;
		var pc=User.get_pendingContacts();
		$each(pc,function(p){
			if (p.get_imAddress().get_address()==n) {
				if (action=='accept') p.accept();
				if (action=='decline') p.decline();
			}
		});
	},
	StartConversation:function(n) {//开始会话
		var a=null;//寻找地址对应的Microsoft.Live.Messenger.IMAddress
		$each(User.get_contacts(),function(c){if(c.get_currentAddress().get_address()==n)a=c.get_currentAddress();});
		if (a==null) return false;
		var t=User.get_conversations().create(a);
		var id=Conversations.length;
		Conversations[id]=new ConversationInfo(t);
		ConversationL[id]=t;
		listen_conversation(t,id);
		return id;
	},
	GetConversation:function(id) {//获取会话信息
		return Conversations[id];
	},
	CloseConversation:function(id) {//关闭会话
		var t=ConversationL[id]; if (!t) return;
		t.close();
	},
	SendMessage:function(id,message) {
		var t=ConversationL[id]; if (!t) return;
		var m=new Microsoft.Live.Messenger.TextMessage(message,null);
		t.sendMessage(m,null);
	}
});

talk.onWindowLoad(function(){
	callmain('onSignInReady');
});

})();