
GPA.imp.sjtujwb={
	start:function(){
		GPA.stat('import/sjtujwb');
		GPA.popup.open('通过上海交通大学修业查询导入','<p>访问上海交通大学教务办<a href="http://jwb.jwc.sjtu.edu.cn/xsbyshj/" target="_blank">本科修业情况查询</a>，用你的jAccount登录(用户名密码与交大邮箱、portal个人存储FTP相同)。出现结果后，按下CTRL+A键全选，按下CTRL+C键复制，然后点击下面的文本框、按下CTRL+V键粘贴。</p><textarea id="import_sjtujwb_input"></textarea><p><input type="button" id="import_sjtujwb_ok" value="确定"></p><p>分组代号：1~8=学期次序，R=必修，L=限选，G=通选，F=任选</p>',{height:300});
		$('#import_sjtujwb_ok').click(GPA.imp.sjtujwb.okClick);
		if ($.fn.xheditor) {
			GPA.imp.sjtujwb.onXHEready();
		} else {
			W.loadjs('/lib/10/xheditor-en.js',GPA.imp.sjtujwb.onXHEready);
		}
		if ($.browser.opera) {
			$('#import_sjtujwb_ok').after('此功能在Opera中可能不能正常工作。');
		}
	},
	onXHEready:function(){
		$('#import_sjtujwb_input').xheditor(true,{tools:'About'});
	},
	okClick:function(){
		GPA.stat('import/sjtujwb.ok');
		var html=$('#import_sjtujwb_input').get(0).objxhe.getSource();
		var r=GPA.imp.sjtujwb.parseReport($('<div>').html(html));
		GPA.imp.finish(r);
	},
	parseReport:function(root){
		var a=[];
		var min_schoolyear=9999;
		var TABLE_groups=['R','L','G','F'];//必修Required，限选Limited Elective，通选General Elective，任选Free
		root.find('table').each(function(){
			var TABLE=$(this);
			var TRs=TABLE.find('tr');
			if (TRs.length<2) return;
			var row0=TRs.first().find('th,td');
			var col_name=-1,col_credit=-1,col_grade=-1,col_schoolyear=-1,col_term=-1;
			row0.each(function(i){
				var TD=$(this);
				if (/课程名称/.test(TD.text())) col_name=i;
				if (/学分/.test(TD.text())) col_credit=i;
				if (/成绩/.test(TD.text())) col_grade=i;
				if (/学年/.test(TD.text())) col_schoolyear=i;
				if (/学期/.test(TD.text())) col_term=i;
			});
			if (col_name<0 || col_credit<0 || col_grade<0 || col_schoolyear<0 || col_term<0) return;
			var TABLE_group=TABLE_groups.length>0?TABLE_groups.shift():'';
			TRs.slice(1).each(function(){
				var row=$(this).find('th,td');
				var C={
					selected:true,
					name:$.trim(row.eq(col_name).text()),
					credit:parseFloat(row.eq(col_credit).text()),
					grade:parseFloat(row.eq(col_grade).text()),
					sjtu_schoolyear:parseInt(row.eq(col_schoolyear).text().split('-')[0]),
					sjtu_term:parseInt(row.eq(col_term).text()),
					groups:TABLE_group
				};
				min_schoolyear=Math.min(min_schoolyear,C.sjtu_schoolyear);
				if (!isNaN(C.credit) && !isNaN(C.grade)) a.push(C);
			});
		});
		$.each(a,function(i,C){
			var total_term=(C.sjtu_schoolyear-min_schoolyear)*2+C.sjtu_term;
			C.groups+=total_term;
		});
		return a;
	}
};
