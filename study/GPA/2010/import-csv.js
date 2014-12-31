GPA.imp.csv={
	run:function(data){//data=[line,line,...]
		GPA.stat('import/csv');
		var M=GPA.imp.csv;
		$.extend(M,{
			data:data,
			hasHeader:false,
			delimeter:',',
			enclosure:'"',
			escape:'\\',
			col_name:-1,
			col_credit:-1,
			col_grade:-1
		});
		var isKnownHeader=M.detectHeader();
		if (isKnownHeader) {
			M.processCourses();
		} else {
			M.detectDelimeter();
			M.detectColumns();
			M.renderForm();
		}
	},
	re_name_header:/课程|名称|course|name|科目|课目|学科/i,
	re_credit_header:/学分|credit/i,
	re_grade_header:/成绩|分数|得分|评分|grade|score/i,
	detectKnownHeader:function(l0){
		var M=GPA.imp.csv;
		switch (l0) {
			case '课程,学分,成绩'://saved by v2010
				M.col_name=0;
				M.col_credit=1;
				M.col_grade=2;
				return true;
		}
		return false;
	},
	detectHeader:function(){
		var M=GPA.imp.csv,a=M.data;
		if (a.length<=1) return false;
		var l0=a[0];
		if (M.detectKnownHeader(l0)) {
			M.hasHeader=true;
			return true;
		}
		if (M.re_name_header.test(l0) || M.re_credit_header.test(l0) || M.re_grade_header.test(l0)) {
			M.hasHeader=true;
		}
		return false;
	},
	detectDelimeter:function(){
		var M=GPA.imp.csv,a=M.data;
		if (a.length==0) return;
		var lm=a[Math.floor(a.length/2)];
		if (GPA.util.getcsv(lm,M).length>=2) return;
		M.delimeter='\t';
		if (GPA.util.getcsv(lm,M).length>=2) return;
		M.delimeter=' ';
		if (GPA.util.getcsv(lm,M).length>=2) return;
		M.delimeter=';';
		if (GPA.util.getcsv(lm,M).length>=2) return;
		M.delimeter=',';
	},
	detectColumns:function(){
		var M=GPA.imp.csv,a=M.data;
		if (!M.hasHeader) return;
		var h=GPA.util.getcsv(a[0],M);
		if (h.length<2) return;
		for (var i=h.length-1;i>=0;--i) {
			if (M.re_name_header.test(h[i])) M.col_name=i;
			if (M.re_credit_header.test(h[i])) M.col_credit=i;
			if (M.re_grade_header.test(h[i])) M.col_grade=i;
		}
	},
	form_delimeters:{',':'comma','\t':'tab',' ':'space',';':'semicolon'},
	renderForm:function(){
		var M=GPA.imp.csv;
		GPA.popup.open('CSV导入选项','<form id="import_csv_form" action=""><div>'
			+'<p><input type="button" id="import_csv_ok" value="确定并继续"> <input type="button" id="import_csv_cancel" value="重新上传"></p>'
			+'<p id="import_csv_set1">分隔符号 <label><input type="radio" name="delimeter" id="import_csv_delimeter_comma">逗号(,)</label> <label><input type="radio" name="delimeter" id="import_csv_delimeter_tab">TAB</label> <label><input type="radio" name="delimeter" id="import_csv_delimeter_space">空格</label> <label><input type="radio" name="delimeter" id="import_csv_delimeter_semicolon">分号(;)</label> <label><input type="radio" name="delimeter" id="import_csv_delimeter_other">其他</label><input type="text" id="import_csv_delimeter_char" maxlength="1" size="3"> <label><input type="checkbox" id="import_csv_hasheader">第一行作为标题行</label></p>'
			+'<div id="import_csv_preview"></div>'
			+'</div></form>');
		var delimeter_id=M.form_delimeters[M.delimeter];
		if (delimeter_id) $('#import_csv_delimeter_'+delimeter_id).prop('checked',true);
		else {
			$('#import_csv_delimeter_other').prop('checked',true);
			$('#import_csv_delimeter_char').val(M.delimeter);
		}
		$('#import_csv_hasheader').prop('checked',M.hasHeader);
		$('#import_csv_delimeter_other').click(function(){
			if (this.checked) $('#import_csv_delimeter_char').focus();
		});
		$('#import_csv_set1').change(function(){
			M.collectSettings();
			M.renderPreview();
		});
		$('#import_csv_form').submit(function(){ return false; });
		$('#import_csv_ok').click(GPA.imp.csv.okClick);
		$('#import_csv_cancel').click(GPA.imp.file.start);
		M.renderPreview();
	},
	renderPreview:function(){
		var M=GPA.imp.csv,a=M.data;
		var TABLE=$('<table><thead></thead><tbody></tbody></table>'),
			THEAD=TABLE.find('thead'),
			HEADER=null,
			TBODY=TABLE.find('tbody');
		var aTR=[],max_cols=-1;
		$.each(a,function(i,l){
			var la=GPA.util.getcsv(l,M),TR=$('<tr><th>&nbsp;</th></tr>');
			$.each(la,function(j,w){
				max_cols=Math.max(max_cols,j);
				var TD=$('<td>');
				if (w=='') TD.html('&nbsp;');
				else TD.text(w);
				TR.append(TD);
			});
			if (M.hasHeader && i==0) {
				HEADER=TR;
			} else {
				TBODY.append(TR);
			}
			if (i>=20) return false;
		});
		$.each({'name':'课程名称','credit':'学分','grade':'成绩'},function(key,title){
			var TR=$('<tr><th></th></tr>').find('th').text('作为：'+title).end();
			for (var i=0;i<=max_cols;++i) {
				var TD=$('<td><input type="radio" name="colsel_'+key+'"'+(M['col_'+key]==i?'checked':'')+' value="'+i+'"></td>');
				TR.append(TD);
			}
			THEAD.append(TR);
		});
		if (HEADER) THEAD.prepend(HEADER);
		var HEADERC=$('<tr><th>&nbsp;</th></tr>');
		for (var i=0;i<=max_cols;++i) {
			HEADERC.append('<td>第'+(i+1)+'列</td>');
		}
		THEAD.prepend(HEADERC);
		$('#import_csv_preview').html(TABLE);
	},
	collectSettings:function(){
		var M=GPA.imp.csv,PREVIEW=$('#import_csv_preview');
		if ($('#import_csv_delimeter_other').is(':checked')) {
			M.delimeter=$('#import_csv_delimeter_char').val();
			if (M.delimeter.length!=1) {
				M.delimeter=',';
				$('#import_csv_delimeter_char').val(',');
			}
		} else {
			$.each(M.form_delimeters,function(ch,id){
				if ($('#import_csv_delimeter_'+id).is(':checked')) M.delimeter=ch;
			});
		}
		M.hasHeader=$('#import_csv_hasheader').is(':checked');
		$.each(['name','credit','grade'],function(i,key){
			var box=PREVIEW.find(':radio[name=colsel_'+key+']:checked');
			M['col_'+key]=(box.length>0)?parseInt(box.val()):-1;
		});
	},
	okClick:function(){
		var M=GPA.imp.csv;
		M.collectSettings();
		if (M.checkSettings()) M.processCourses();
		GPA.stat('import/csv.ok');
	},
	checkSettings:function(){
		var M=GPA.imp.csv;
		if (M.col_credit<0) {
			alert('请指定学分列');
			return false;
		}
		if (M.col_grade<0) {
			alert('请指定成绩列');
			return false;
		}
		return true;
	},
	processCourses:function(){
		var M=GPA.imp.csv,a=[],fails=[];
		$.each(M.data,function(i,l){
			if (i==0 && M.hasHeader) return;
			var la=GPA.util.getcsv(l,M);
			var C={
				selected:true,
				name:M.col_name>=0?la[M.col_name]:'',
				credit:parseFloat(la[M.col_credit]),
				grade:GPA.util.parseLevelOrGrade(la[M.col_grade])
			};
			if (isNaN(C.credit) || isNaN(C.grade)) fails.push(l);
			else a.push(C);
		});
		if (fails.length>0) {
			if (!confirm(GPA.util.replace_ok_cancel('有'+fails.length+'门课程的学分和/或成绩无法识别，可能是列指定错误。\n点击【确定】忽略错误并继续，点击【取消】返回修改。\n\n错误行举例：\n'+fails[0]))) return;
		}
		GPA.imp.finish(a);
	}
};
