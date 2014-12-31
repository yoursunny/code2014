
GPA.myAlg={
	h:{},//collection
	list:function(){
		var a=[];
		$.each(GPA.myAlg.h,function(name,detail){a.push(name);});
		return a;
	},
	get:function(name){
		var algdata=GPA.myAlg.h[name];
		if (algdata) {
			var detail=algdata.detail,
				author=algdata.author||'',
				link=algdata.link||null,
				note=algdata.note||'自定义算法';
			return GPA.alg.createAlg(name,detail,{author:author,link:link,note:note});
		} else return null;
	},
	add:function(A){
		if (!A.initialized) A.initialize();
		GPA.myAlg.h[A.name]={
			detail:A.getDetail(),
			author:A.author,
			link:A.link,
			note:A.note
		};
		GPA.myAlg.dirtyMenu();
		GPA.myAlg.save();
	},
	remove:function(name){
		delete GPA.myAlg.h[name];
		GPA.myAlg.dirtyMenu();
		GPA.myAlg.save();
	},
	init:function(){
		GPA.menu.registerAction('alg_my',function(LI){
			var name=LI.data('myAlg_name');
			GPA.alg.selectAlg(GPA.myAlg.get(name));
		});
		var h=GPA.storage.get('myAlg');
		if ($.isPlainObject(h)) GPA.myAlg.h=h;
		GPA.oldAlg.import2009CookieSave();
		GPA.menu.registerAction('myalg',GPA.myAlg.prepareMenu);
		GPA.menu.registerAction('myalg_install',GPA.myAlg.install.start);
		GPA.menu.registerAction('myalg_create',GPA.algedit.startNew);
		GPA.menu.registerAction('myalg_manage',GPA.myAlg.manager.start);
	},
	save:function(){
		GPA.storage.set('myAlg',GPA.myAlg.h);
	},
	prepareMenu:function(){
		var menu=$('#menu_myalg');
		if (!menu.data('myAlg')) {
			menu.data('myAlg',true);
			var sep1=$('#menu_myalg_sep1');
			$.each(GPA.myAlg.list(),function(key,name){
				$('<li>').addClass('enable').addClass('myAlg').text(name).data('menuAction','alg_my').data('myAlg_name',name).insertAfter(sep1);
			});
		}
	},
	dirtyMenu:function(){
		$('#menu_myalg').data('myAlg',false)
			.find('.myAlg').remove();
	}
};

GPA.myAlg.manager={
	start:function(){
		GPA.stat('myAlg/manager');
		GPA.popup.open('管理我的算法','<div id="myalg_manager"></div>');
		var UL=$('<ul>');
		$.each(GPA.myAlg.list(),function(i,name){
			var A=$('<a>').text('删除').attr('href','javascript:;').click(function(){
				GPA.myAlg.remove(name);
				$(this).closest('li').remove();
				GPA.stat('myAlg/delete');
			});
			UL.append($('<li>').text(name+' ').append(A));
		});
		$('#myalg_manager').append(UL);
	}
};

GPA.myAlg.install={
	start:function(){
		GPA.popup.open('安装新算法','<p></p>');
	}
};

GPA.algedit={
	startNew:function(){
		GPA.algedit.start(null);
	},
	start:function(A){
		GPA.stat('myAlg/'+(A==null?'new':'edit'));
		if (GPA.algedit.entryTemplate==null) {
			GPA.algedit.entryTemplate=$('<tr>'
				+'<td><label><input type="radio" name="algedit_entry_t_type" value="grade" checked>百分制</label><br><label><input type="radio" name="algedit_entry_t_type" value="level">等第制</label></td>'
				+'<td><span id="algedit_entry_t_vgrade"><input type="text" id="algedit_entry_t_min" class="algedit_t">≤分数＜<input type="text" id="algedit_entry_t_max" class="algedit_t"></span><span id="algedit_entry_t_vlevel" style="display:none;">等第<input type="text" id="algedit_entry_t_level" class="algedit_t"></span></td>'
				+'<td><input type="text" id="algedit_entry_t_point" class="algedit_t"></td>'
				+'<td><input type="text" id="algedit_entry_t_rlevel" class="algedit_t"></td>'
				+'<td><a href="javascript:;" id="algedit_entry_t_delete">删除</a></td>'
				+'</tr>');
		}
		GPA.popup.open('编辑算法','<form action="" id="algedit_form"><div>'
			+'<p><label>算法名称：<input type="text" id="algedit_name"></label><br><label>算法备注：<input type="text" id="algedit_note"></label>(支持HTML语法)</p>'
			+'<table id="algedit_detail_table">'
			+'<thead><tr><td colspan="2">成绩</td><td colspan="2">结果</td><td>&nbsp;</td></tr><tr><td>类型</td><td>范围</td><td>绩点</td><td>等第</td><td>&nbsp;</td></tr></thead>'
			+'<tbody id="algedit_detail"></tbody>'
			+'<tfoot><tr><td colspan="5"><a href="javascript:;" id="algedit_add">增加更多条目</a></td></tr></tfoot>'
			+'</table>'
			+'<p><input type="button" id="algedit_save" value="保存"></p>'
			+(GPA.storage.supportLS?'':'<p>你的浏览器不支持本地存储，自定义算法仅在本次使用有效；请更换Firefox3.6、IE8等支持HTML5本地存储的浏览器。</p>')
			+'</div></form>');
		if (A!=null) {
			var r=GPA.algedit.algToForm(A);
			if (r===false) alert('该算法不支持编辑');
			else if (r===true) {}
			else alert('试图打开算法编辑器，但有'+r+'个条目包含函数、无法导入。\n因此，正在编辑的算法与原算法将有所不同。');
		}
		$('#algedit_form').submit(function(){return false;});
		$('#algedit_add').click(function(){GPA.algedit.addEntry();});
		$('[id$=_delete]','#algedit_detail').live('click',function(){
			$(this).closest('tr').remove();
		});
		$('[name$=_type]','#algedit_detail').live('click',function(){
			var TR=$(this).closest('tr');
			var n=TR.attr('id').replace('algedit_entry_','');
			var type=TR.find('[name=algedit_entry_'+n+'_type]:checked').val();
			$('#algedit_entry_'+n+'_vgrade').toggle(type=='grade');
			$('#algedit_entry_'+n+'_vlevel').toggle(type=='level');
		});
		$('#algedit_save').click(GPA.algedit.save);
	},
	algToForm:function(A){
		$('#algedit_name').val(A.name);
		$('#algedit_note').val(A.note);
		var detail=A.getDetail(),skip=0;
		if (!$.isArray(detail)) return false;
		$.each(detail,function(i,entry){
			if (!GPA.algedit.addEntry(entry)) ++skip;
		});
		return skip==0?true:skip;
	},
	entryTemplate:null,
	entry_n:0,
	addEntry:function(entry){
		var oldIE=$.browser.msie && $.browser.version<=7,
			TR,
			n=++GPA.algedit.entry_n,
			nid='_'+n+'_',
			replace_nid=function(i,id){return id.replace(/_t_/g,nid);};
		if (oldIE) {
			TR=$('<tr>').html(replace_nid(-1,GPA.algedit.entryTemplate.html()));
		} else {
			TR=GPA.algedit.entryTemplate.clone()
				.find('[id]').attr('id',replace_nid).end()
				.find('[name]').attr('name',replace_nid).end();
		}
		TR.attr('id','algedit_entry_'+n);
		if (oldIE) $('#algedit_detail').append(TR);
		if (entry!=null) {
			if (!GPA.algedit.entryToRow(n,entry,TR)) {
				if (oldIE) TR.remove();
				return false;
			}
		}
		if (!oldIE) $('#algedit_detail').append(TR);
		return true;
	},
	entryToRow:function(n,entry,row){
		var q=function(selector){
			selector=selector.replace(/%/g,'algedit_entry_'+n+'_');
			if (row) return row.find(selector);
			else return $(selector);
		};
		if ($.isArray(entry[0])) {
			q('[name=%type]').val(['grade']);
			q('#%vgrade').show();
			q('#%vlevel').hide();
			q('#%min').val(entry[0][0]);
			q('#%max').val(entry[0][1]);
		} else {
			q('[name=%type]').val(['level']);
			q('#%vgrade').hide();
			q('#%vlevel').show();
			q('#%level').val([entry[0]]);
		}
		if ($.isFunction(entry[1])) return false;
		else if ($.isArray(entry[1])) {
			if ($.isFunction(entry[1][0])) {
				return false;
			} else {
				q('#%point').val(entry[1][0]);
				q('#%rlevel').val(entry[1][1]);
			}
		} else {
			q('#%point').val(entry[1]);
			q('#%rlevel').val('');
		}
		return true;
	},
	save:function(){
		GPA.stat('myAlg/save');
		var A=GPA.algedit.algFromForm();
		GPA.myAlg.add(A);
		GPA.popup.close();
		GPA.alg.selectAlg(A);
	},
	algFromForm:function(){
		var name=$('#algedit_name').val();
		if (name.length<1) name='自定义 '+new Date().getTime();
		var note=$('#algedit_note').val();
		var skip=0;
		var detail=[];
		$('#algedit_detail tr').each(function(){
			var TR=$(this);
			var entry=GPA.algedit.entryFromRow(false,TR);
			if (GPA.algedit.validateEntry(entry)) detail.push(entry);
			else ++skip;
		});
		if (skip>0) alert('已经创建自定义算法，但是有'+skip+'个条目无效、已被忽略。');
		return GPA.alg.createAlg(name,detail,{note:note});
	},
	entryFromRow:function(n,row){
		if (n===false) n=row.attr('id').replace('algedit_entry_','');
		var q=function(selector){
			selector=selector.replace(/%/g,'algedit_entry_'+n+'_');
			return $(selector);
		};
		var entry=[null,null];
		switch (q('[name=%type]:checked').val()) {
			case 'grade':
				entry[0]=[parseFloat(q('#%min').val()),parseFloat(q('#%max').val())]
				break;
			case 'level':
				entry[0]=q('#%level').val();
				break;
		}
		var point=parseFloat(q('#%point').val()),rlevel=q('#%rlevel').val();
		if (rlevel!='') entry[1]=[point,rlevel];
		else entry[1]=point;
		return entry;
	},
	validateEntry:function(entry){
		if ($.isArray(entry[0])) {
			if (isNaN(entry[0][0]) || isNaN(entry[0][1]) || entry[0][0]>=entry[0][1]) return false;
		} else {
			if (!GPA.util.isLevel(entry[0])) return false;
		}
		if ($.isArray(entry[1])) {
			if (isNaN(entry[1][0])) return false;
		} else {
			if (isNaN(entry[1])) return false;
		}
		return true;
	}
};
