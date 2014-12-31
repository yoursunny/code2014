GPA.imp.file={
	start:function(){
		GPA.stat('import/file');
		GPA.popup.open('从文件导入','<form id="import_file_form" action="'+GPA.server_base+'import-file.php" method="post" target="hiddenframe" enctype="multipart/form-data"><div>'
				+'<p>上传包含课程信息的文件：<input id="import_file_upload" name="u" type="file"><span id="import_file_progress" style="display:none;">正在处理</span></p>'
				+'<p>支持的文件格式：</p>'
				+'<ul>'
				+'<li>阳光GPA计算器导出的HTML/XHTML报表（*.htm）</li>'
				+'<li>包含成绩、学分等的EXCEL表格，保存为“逗号分隔”格式（*.csv）</li>'
				+'<li>包含成绩、学分等的文本文件（*.txt）</li>'
				+'</ul>'
				+'</div></form>',
				{height:200});
		$('#import_file_upload').bind('change click',GPA.imp.file.upload_change);
	},
	upload_change:function(){
		if ($('#import_file_upload').val()!='') {
			$('#import_file_upload').hide();
			$('#import_file_progress').show();
			$('#import_file_form').submit();
		}
	},
	handleResult:function(action,data,msg){
		if (msg) alert(msg);
		switch (action) {
			case 1:
				{
					$('#import_file_form').get(0).reset();
					$('#import_file_progress').hide();
					$('#import_file_upload').show();
				}
				break;
			case 2:
				{
					//if (data.alg) {
					//	var algorithm;
					//	try{ algorithm=eval(data.alg); }
					//	catch(ex){}
					//	if (algorithm) {
					//		GPA.alg.selectAlg(algorithm);
					//	}
					//}
					GPA.stat('import/file.ok');
					GPA.imp.finish(data.courses);
				}
				break;
			case 3:
				{
					GPA.imp.csv.run(data);
				}
				break;
		}
		GPA.util.reset_hiddenframe();
	}
};
