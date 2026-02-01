var PageGenerator_grading_timer=null;
var PageGenerator_grading_score=0;
function PageGenerator_grading_in(score)
{
	document.getElementById('grading_3').style.backgroundColor='';
	document.getElementById('grading_2').style.backgroundColor='';
	document.getElementById('grading_1').style.backgroundColor='';
	document.getElementById('grading_'+score).style.backgroundColor='#ccc';
	document.getElementById('grading_row1').style.display='';
	document.getElementById('grading_row2').style.display='';
	document.getElementById('grading_row3').style.display='none';
	document.getElementById('grading_tip').innerHTML=(score==1?'几乎没有用处，需要很大的改进':(score==2?'有用，但是需要一些改进':'很有用，我喜欢'));
}
function PageGenerator_grading_out()
{
	if (PageGenerator_grading_timer!=null) clearTimeout(PageGenerator_grading_timer);
	PageGenerator_grading_timer=null;
	PageGenerator_grading_timer=setTimeout('PageGenerator_grading_hidetip()',2000);
}
function PageGenerator_grading_hidetip()
{
	document.getElementById('grading_3').style.backgroundColor='';
	document.getElementById('grading_2').style.backgroundColor='';
	document.getElementById('grading_1').style.backgroundColor='';
	document.getElementById('grading_row1').style.display='none';
	document.getElementById('grading_row2').style.display='none';
	document.getElementById('grading_row3').style.display='';
}
function PageGenerator_grading_grade(score)
{
	var theForm=document.forms['grading_form'];
	if (theForm==null) theForm=document.forms.grading_form;
	theForm.a.value='grade'+score;
	theForm.path.value=PageGenerator_grading_path;
	theForm.submit();
	theForm.style.display='block';
	document.getElementById('grading_table').style.display='none';
	document.getElementById('grading_msg').innerHTML=(score==1?'很遗憾你不太喜欢这些信息，可以告诉我们为什么不喜欢吗？':(score==2?'可以告诉我们以上信息需要什么方面的改进吗？':'很高兴你能喜欢，可以告诉我们，你还想看到什么吗？'));
	PageGenerator_grading_score=score;
}
function PageGenerator_grading_cmt(f)
{
	if (f.t.value.length<1)
	{
		f.t.focus();
		alert('没有填写反馈内容，无法提交');
		return;
	}
	f.a.value='cmt';
	f.t.value='(评分： '+' ×▲★'.substr(PageGenerator_grading_score,1)+' )\n'+f.t.value;
	f.path.value=PageGenerator_grading_path;
	f.submit();
	f.style.display='none';
	document.getElementById('grading_thank').style.display='';
}
document.getElementById('grading_outer').innerHTML='<table id=\"grading_table\" width=\"500\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n<tr id=\"grading_row1\" height=\"25\" style=\"display:none;\">\n<td><iframe id=\"grading_iframe\" name=\"grading_iframe\" src=\"about:blank\" width=\"0\" height=\"0\" style=\"display:none;\"><\/iframe><\/td>\n<td colspan=\"3\" align=\"center\" valign=\"bottom\" bgcolor=\"#FFFF99\" id=\"grading_tip\" style=\"border-style:solid;border-width:1px 1px 0px 1px;border-color:#030;\">&nbsp;<\/td>\n<\/tr>\n<tr id=\"grading_row2\" height=\"5\" style=\"font-size:1px;line-height:1px;display:none;\">\n<td>&nbsp;<\/td>\n<td bgcolor=\"#FFFF99\" style=\"border-style:solid;border-width:0px 0px 1px 1px;border-color:#030;\">&nbsp;<\/td>\n<td width=\"80\" bgcolor=\"#FFFF99\" style=\"border-style:solid;border-width:0px 0px 0px 0px;border-color:#030;\">&nbsp;<\/td>\n<td width=\"40\" bgcolor=\"#FFFF99\" style=\"border-style:solid;border-width:0px 1px 1px 0px;border-color:#030;\">&nbsp;<\/td>\n<\/tr>\n<tr id=\"grading_row3\" height=\"30\">\n<td colspan=\"4\">&nbsp;<\/td>\n<\/tr>\n<tr>\n<td width=\"250\">你觉得以上信息有用吗？<\/td>\n<td width=\"130\">&nbsp;<\/td>\n<td width=\"120\" colspan=\"2\" style=\"font-size:150%;padding-left:3pt;\">\n<span id=\"grading_3\" style=\"cursor:pointer;color:#693;\" onclick=\"PageGenerator_grading_grade(3);\" onmouseover=\"PageGenerator_grading_in(3);\" onmouseout=\"PageGenerator_grading_out();\">★<\/span>\n<span id=\"grading_2\" style=\"cursor:pointer;color:#960;\" onclick=\"PageGenerator_grading_grade(2);\" onmouseover=\"PageGenerator_grading_in(2);\" onmouseout=\"PageGenerator_grading_out();\">▲<\/span>\n<span id=\"grading_1\" style=\"cursor:pointer;color:#f00;\" onclick=\"PageGenerator_grading_grade(1);\" onmouseover=\"PageGenerator_grading_in(1);\" onmouseout=\"PageGenerator_grading_out();\">×<\/span><\/td>\n<\/tr>\n<\/table>\n<form id=\"grading_form\" name=\"grading_form\" action=\"'+PageGenerator_grading_formaction+'\" method=\"post\" target=\"grading_iframe\" style=\"display:none;\">\n<input name=\"a\" type=\"hidden\" id=\"a\" \/>\n<input name=\"path\" type=\"hidden\" id=\"path\" \/>\n<table width=\"500\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\">\n<tr>\n<td id=\"grading_msg\" colspan=\"2\">&nbsp;<\/td>\n<\/tr>\n<tr>\n<td width=\"400\" height=\"110\" align=\"center\"><textarea name=\"t\" id=\"t\" style=\"width:380px;height:100px;\"><\/textarea><\/td>\n<td width=\"100\" align=\"center\"><input type=\"button\" value=\" 提 交 \" onclick=\"PageGenerator_grading_cmt(this.form);\" \/><\/td>\n<\/tr>\n<\/table>\n<\/form>\n<table id=\"grading_thank\" width=\"500\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"display:none;\">\n<tr>\n<td>反馈已经提交，谢谢您的反馈！<\/td>\n<\/tr>\n<\/table>\n';
