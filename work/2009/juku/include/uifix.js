//UI修正
(function(J){
var $=window.jQuery;

//修复“表情”下拉框左边多余圆点
$('#char_img').click();
J.addStyleRule('#emoticons_tabs li.emoticon_selecter','list-style-type:none');
$('#char_img').click();

//禁止闪烁标题
flashIndex=1;flashTitle();//恢复正常标题
Users.update_title=false;
//Poll.markAllRead();//全部标记已读
J.addStyleRule('#updater','display:none;');
$('#updater').hide();

//时间线滚动加速
//J.addStyleRule('#bottom_line','background-image:none;background-color:#2196bb;');

//修复消息回复窗口超宽
J.addStyleRule('.wall_cnt .text_holder.truncated','max-width:250px;');

//回复消息输入框替换为单行文本框
$('#input_small').parent().html('<input id="input_small" class="content" name="content" style="font-size:12px;border:solid 1px #0a77af;min-width:190px;padding-left:3px;position:relative;"').find('input').keypress(function(evt){if(evt.keyCode==13){WallAdder.wallResponse(this,$('#form_holder span.m_qualifier').get(0),null);return false;}});

//修复悬停消息框覆盖已展开消息框
//J.addStyleRule('div.wall_box','z-index:4001;');
//J.addStyleRule('div.qual_menu','z-index:4002;');

//修复位置靠下的已展开消息框中间断开现象
J.addStyleRule('#timeline_holder #timeline_cnt','overflow:visible;');

//修复小尺寸显示器中浮层窗口超出屏幕上缘
var GB_setFrameSize_old=GB_Window.prototype.setFrameSize;
GB_Window.prototype.setFrameSize=function(){
	GB_setFrameSize_old.call(this);
	var height=$(window).height()-26;
	if (this.height>height) {
		this.height=height;
		MClub.setHeight(this.iframe,this.height);
	}
};

})(yoursunnyJukuHelper);