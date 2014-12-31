//互动答题
/*
<div class="q yesno">
<p class="y">判断题，答案为对</p>
</div>
<div class="q yesno">
<p class="n">判断题，答案为错</p>
</div>
<div class="q choice">
<p>选择题</p>
<ul>
<li>选项</li>
<li class="y">正确选项</li>
<li>选项</li>
</ul>
</div>
<div class="q multi">
<p>多选题</p>
<ul>
<li class="y">正确选项</li>
<li class="y">正确选项</li>
<li class="n">错误选项</li>
</ul>
</div>
<div class="q fill">
填空题，<span class="a">答案</span>
</div>
<div class="q multi">
<p>问答题</p>
<any-tag class="a">答案</any-tag>
</div>
*/
document.write('<link rel="stylesheet" type="text/css" href="/images/10/study9_question/question'+(navigator.userAgent.match(/MSIE [567]/)?'_ie':'')+'.css"/>');
function q_init() {
	$$('.q.yesno').each(function(q){
		q.select('p').first().insert('<input type="button" value="正确" onclick="q_yesno_mark(this,true)"/> <input type="button" value="错误" onclick="q_yesno_mark(this,false)"/>');
	});
	$$('.q.choice').each(function(q){
		q.select('li').each(function(li){li.update('<span>'+li.innerHTML+'</span>');});
		(function(){q.select('li span').invoke('observe','click',q_choice_mark);}).defer();
	});
	$$('.q.multi').each(function(q){
		q.select('p').first().insert('<input type="button" value="阅卷" onclick="q_multi_mark(this)"/>');
		q.select('li').each(function(li){li.update('<span>'+li.innerHTML+'</span>');});
		(function(){q.select('li span').invoke('observe','click',function(e){
			var li=$(Event.findElement(e,'li'));
			if (li.up('.q').hasClassName('m')) return;
			li.toggleClassName('s');
		});}).defer();
	});
	$$('.q.fill').each(function(q){
		q.select('.a').invoke('wrap','span',{'class':'a-ud'});
		q.insert('<input type="button" value="显示答案" onclick="q_fill_mark(this)"/>');
	});
	$$('.q.answer').each(function(q){
		q.select('p').first().insert('<input type="button" value="显示答案" onclick="q_answer_mark(this)"/>');
	});
	$$('.footer').invoke('insert','<a href="http://www.famfamfam.com/lab/icons/silk/" rel="external">Silk Icons</a>');
	//WebSite.NewWinLink();
}
function q_reset() {
	$$('.q').each(function(q){
		q.removeClassName('m').removeClassName('correct').removeClassName('wrong')
			.select('.m','.s').invoke('removeClassName','m').invoke('removeClassName','s');
	});
}
function q_yesno_mark(b,answer) {
	var q=$(b).up('.q');
	if (q.hasClassName('m')) return;
	var key=q.down('p').hasClassName('y');
	q.addClassName('m').addClassName(key==answer?'correct':'wrong');
}
function q_choice_mark(e) {
	var li=$(Event.findElement(e,'li'));
	var q=$(li).up('.q');
	if (q.hasClassName('m')) return;
	q.addClassName('m').addClassName(li.addClassName('s').hasClassName('y')?'correct':'wrong');
}
function q_multi_mark(b) {
	var q=$(b).up('.q');
	if (q.hasClassName('m')) return;
	var correct=true;
	q.select('li').each(function(li){
		if ((li.hasClassName('y')&&!li.hasClassName('s'))||(li.hasClassName('n')&&li.hasClassName('s'))) correct=false;
	});
	q.addClassName('m').addClassName(correct?'correct':'wrong');
}
function q_fill_mark(b) {
	var q=$(b).up('.q');
	if (q.hasClassName('m')) return;
	q.addClassName('m');
}
function q_answer_mark(b) {
	var q=$(b).up('.q');
	if (q.hasClassName('m')) return;
	q.addClassName('m');
}
W.ready(q_init);