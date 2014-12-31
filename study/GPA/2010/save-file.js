
GPA.save.file={
	start:function(){
		GPA.stat('save/file');
		GPA.save.file.is_email=false;
		GPA.save.file.start1();
	},
	start_email:function(){
		GPA.stat('save/email');
		GPA.save.file.is_email=true;
		GPA.save.file.start1();
	},
	is_email:false,
	start1:function(){
		var eml=GPA.save.file.is_email;
		GPA.popup.open(eml?'保存到信箱':'保存为文件','<form id="save_file_form" action="'+GPA.server_base+'save-file.php" method="POST" target="hiddenframe"><div>'
			+'<input type="hidden" id="save_file_data" name="data">'
			+'<table><thead><tr><th>文件格式</th><td>下次可导入</td><td>课程信息</td><td>计算结果</td><td>算法</td><td>分组</td></tr></thead><tbody>'
			+'<tr><th><label><input type="radio" name="format" value="htm" checked>HTML报表(*.htm)</label></th><td>√</td><td>√</td><td>√</td><td>×</td><td>√</td></tr>'
			+'<tr><th><label><input type="radio" name="format" value="csv">逗号分隔表格(*.csv)</label></th><td>√</td><td>√</td><td>×</td><td>×</td><td>×</td></tr>'
			+(eml
				?''
				:'<tr><th><label><input type="radio" name="format" value="xlsx">Excel文档(*.xlsx)</label></th><td>×</td><td>√</td><td>√</td><td>×</td><td>×</td></tr>'
			)
			+'</tbody></table>'
			+(eml
				?'<p>发送到你的信箱：<input type="text" id="save_file_email" name="email"></p>'
				+'<p><input type="submit" value="发送电子邮件"><input type="hidden" name="mode" value="email">'
				:'<p><input type="submit" value="导出文件">'
			)
			+'</p>'
			+'</div></form>',{height:250}).show();
			$('#save_file_data').val(GPA.save.file.serializeData());
			$('#save_file_form').submit(GPA.save.file.onSubmitForm);
	},
	serializeData:function(){
		var courses=[],alg,result;
		GPA.courses.each(function(id,C){
			courses.push($.param(C));
		});
		alg='';
		result=GPA.calc.getResult();
		return $.param({
			courses:courses.join('|'),
			alg:alg,
			result:$.param(result)
		});
	},
	onSubmitForm:function(){
		var FORM=$('#save_file_form');
		var format=FORM.find('[name=format]:checked').val();
		if (GPA.save.file.is_email) {
			GPA.stat('save/email.'+format);
		} else {
			GPA.stat('save/file.'+format);
			if (format=='xlsx') FORM.attr('action','http://n.65536.cn/yoursunny/GPA_save-xlsx.ashx');
			setTimeout(GPA.popup.close,2000);
		}
	},
	handleEmailResult:function(u){
		var a=(''+u).split('/');
		switch (a[0]) {
			case 'invalid':
				switch (a[1]) {
					case 'hash':
						alert('邮件参数错误，请重试或联系开发者');
						break;
					case 'to':
						alert('信箱地址不正确');
						break;
				}
				break;
			case 'ex':
				alert('发送邮件异常\n'+a[1]);
				break;
			case 'OK':
				alert('邮件发送成功，请查收来自下列地址的邮件：\n'+a[1]);
				GPA.save.finish();
				break;
		}
	}
};