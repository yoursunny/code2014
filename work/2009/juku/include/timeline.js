//时间线
(function(J){
var $=window.jQuery;

//顶
$('#timeline_cnt div.wall:first').mouseover().mouseout();
var dp_go=$($dp.go);
if (dp_go.text().indexOf('顶')<0) {
	dp_go.append(Walls.createLink(_('顶'),'go',function(){
		var wall_id=$('#timeline_cnt div.wall.wall_box').attr('id').substr(1);
		WallAdder.wallResponse({disabled:false,value:'顶'},{className:'q_likes'},'顶');
		$('#wall_cnt_'+wall_id).click()
		return false;
	}));
}

//去除“时间线为空”
J.addStyleRule('#empty_timeline_bg,#empty_timeline_fg','display:none;');

})(yoursunnyJukuHelper);