var Comment=new Object();
Comment.PATH='/comment/';//服务端程序路径
Comment.load_cb=function(resp)//读入已有评论内容
{
	if (resp.responseJSON)
	{
		$('comments').update(resp.responseJSON.collect(function(k){
			return '<div class="comment"><div class="commentinfo">'+(k.link.length>0?'<a href="'+k.link+'">':'<b>')+k.person.escapeHTML()+(k.link.length>0?'</a> ':'</b> ')+k.time+'</div><p>'+k.msg.escapeHTML().replace(/\n/g,'<br/>')+'</p></div>';
		}).join(''));
	}
}
Comment.textinput_mouseover=function(){this.addClassName('em');};
Comment.textinput_mouseout=function(){this.removeClassName('em');};
Comment.save=function()//提交评论
{
	var form=$('commentform');
	new Ajax.Request(Comment.PATH+'post.php',{parameters:form.serialize(),onComplete:Comment.saveok});
	form.reset();
};
Comment.saveok=function() { alert('评论已经保存，经管理员审核后才会显示'); }
Comment.create=function(page)
{
	document.write('<div id="comments">正在载入...</div><form id="commentform" onsubmit="return false;"><div id="commentad">'+WebSite.getAd('300x250')+'</div><input id="comment_page" type="hidden" name="page"><h4>发表评论</h4><p><label for="comment_person">你的名字</label><input id="comment_person" class="textinput" type="text" name="person" /></p><p><label for="comment_link">你的网址</label><input id="comment_link" class="textinput" type="text" name="link" /></p><p><label for="comment_msg">评论内容</label><textarea id="comment_msg" name="msg"></textarea></p><p class="commentsubmit"><input type="button" value="发表评论" onclick="Comment.save()" /> [待管理员审核后才能显示]</p></form>');
	$('comment_page').value=page;
	$('comment_person','comment_link','comment_msg').each(function(k){
		Event.observe(k,'mouseover',Comment.textinput_mouseover.bind(k));
		Event.observe(k,'mouseout',Comment.textinput_mouseout.bind(k));
	});
	Event.observe('commentform','submit',Comment.save)
	new Ajax.Request(Comment.PATH+'get.php',{parameters:{page:page},onComplete:Comment.load_cb});
};
