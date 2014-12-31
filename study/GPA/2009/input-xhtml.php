<?php
$h=file_get_contents($_FILES['u']['tmp_name']);
$pos_head_end=stripos($h,'</head>');
$pos_body_end=stripos($h,'</body>');

echo substr($h,0,$pos_head_end);
?>
<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/prototype/1.6.1.0/prototype.js"></script>
<?php
echo substr($h,$pos_head_end,$pos_body_end-$pos_head_end);
?>
<script type="text/javascript">//<![CDATA[
var w=window,$$_=$$.bind(w);
var GPA=parent.GPA;
GPA.Input.XHTML.addMethods({
	get:function() {
		var L=new GPA.CourseCollection();
		$$_('tr').each(function(TR){
			if (!TR.id && !TR.id.startsWith('course_')) return;
			var c=new GPA.Course();
			var TDs=TR.select('td');
			var v=function(i){return TDs[i].firstChild.nodeValue.strip();};
			c.id=TR.id.split('_')[1];
			c.selected=(v(0)=='1');
			c.name=v(1);
			c.grade=parseInt(v(3),10);
			c.credit=parseFloat(v(4),10);
			L.Add(c);
		});
		return L;
	}
});
GPA.Input.done.defer();
//]]></script>
<?php
echo substr($h,$pos_body_end);
?>