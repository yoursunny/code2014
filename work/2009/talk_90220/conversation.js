(function($){

function callmain() {//调用signin窗口的函数
	var p=$.makeArray(arguments),func=p.shift();
	var w=parent.frames['CB5DA278-8404-4adf-BC17-187B45F306E2'];
	return w.talk[func].apply(w.talk,p);
}

var ID=talk_config.conversation_id;

function send() {
	var m=$('#input').val();
	if (m.length<1) return;
	callmain('MessageSend',ID,m);
	$('#input').val('');
}

talk.extend({
	MessageShow:function(sender,message,timestamp){
		var dl=$('<dl class="msg"/>');
		$('<dt class="sender"/>').text(sender).appendTo(dl);
		$('<dd class="text"/>').text(message).appendTo(dl);
		dl.appendTo('#messages');
	}
});

$(document).ready(function(){
	callmain('ConversationReady',ID);
	talk.loadStyle(talk_config.style_url);
	$('body').addClass('conversation').append('<div id="messages"/><div id="write"/>');
	$('<textarea id="input"/>').appendTo('#write');
	$('<input id="send" type="button" value="发送"/>').appendTo('#write').click(send);
});

})(jQuery);