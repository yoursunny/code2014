GPA.imp.json={
	start:function(){
		GPA.stat('import/json');
		GPA.popup.open('从JSON代码导入','<p>请按【CTRL+V】粘贴上次导出的JSON代码，代码不能修改。</p><textarea id="import_json_input"></textarea><p><input type="button" id="import_json_ok" value="确定"></p>',{height:200}).show();
		$('#import_json_ok').click(GPA.imp.json.okClick);
	},
	okClick:function(){
		GPA.imp.json.jsonData=$('#import_json_input').val();
		GPA.imp.json.processData();
	},
	jsonData:'',
	processData:function(){
		var a,r=null;
		if (GPA.imp.json.jsonData=='') { alert('JSON代码为空。'); return; }
		try { a=$.parseJSON(GPA.imp.json.jsonData); }
		catch(ex){ alert('JSON代码解析失败。'); return; }
		if (a==null) { alert('JSON解析结果为空。'); return; }
		var parsed=GPA.imp.json.parseJSON(a);
		r=parsed[1];
		if (r) {
			GPA.stat('import/json.'+parsed[0]);
			GPA.imp.finish(r);
		} else {
			alert(parsed[0]);
		}
	},
	parseJSON:function(a){//parse JSON object, returns [type,result] or [alert,false]
		if ($.isArray(a)) {
			if (a.length==0) { return ['JSON数组不包含课程信息。',false]; }
			if ($.isPlainObject(a[0])
				&& typeof a[0].id=='string'
				&& typeof a[0].name=='string'
				&& typeof a[0].credit=='number'
				&& typeof a[0].grade=='number'
				&& typeof a[0].code=='string'
				&& typeof a[0].selected=='boolean') {
				var r=GPA.imp.json.parseJSON2009(a);
				return ['2009',r];
			}
		} else if ($.isPlainObject(a)) {
			if (a.version=='95ed3d84-6d7d-4e49-b9db-db27d16ec322') {
				var r=GPA.imp.json.parseJSON95ed3d84(a);
				return ['95ed3d84',r];
			}
		}
		return ['不能识别JSON数据的格式。',false];
	},
	parseJSON2009:function(a){//parse JSON export from version 2009
		return $.map(a,function(item){
			return {
				selected:item.selected,
				name:item.name,
				credit:item.credit,
				grade:item.grade,
				groups:''
			};
		});
	},
	parseJSON95ed3d84:function(a){//parse JSON export from version 2010
		return a.courses;
	}
};
