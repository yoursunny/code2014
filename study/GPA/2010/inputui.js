/*
triggering events
  GPA_addCourse(evt,id)
  GPA_changeCourse(evt,id)
  GPA_removeCourse(evt,id)
*/
GPA.inputui={
	init:function(){
		GPA.inputui.addEmptyRows();
		$('#C_all_delete').click(function(){
			if (!confirm('是否删除所有课程信息？\n（无法恢复）')) return;
			GPA.inputui.removeAllRows();
			GPA.stat('input/removeAll');
		});
		$('#course_add').click(function(){
			for (var i=0;i<5;++i) GPA.inputui.addRow();
		});
		$('#courses')
			.bind('GPA_changeCourse',GPA.inputui.onChangeCourse)
			.bind('GPA_removeCourse',GPA.inputui.onRemoveCourse)
			.keyup(GPA.inputui.onKeyUp);
		$('#courses_table').attr('cellspacing',0);
	},
	addEmptyRows:function(){
		for (var i=0;i<10;++i) GPA.inputui.addRow();
	},
	last_change_evt_target:null,
	addRow:function(id,C){
		if (!id) id=GPA.courses.generate_id();
		var row=$('#course_template').clone().attr('id','C_'+id);
		row.find('[id^=C_i_]').each(function(){
			this.id=this.id.replace('_i_','_'+id+'_');
		});
		var row_change_handler=function(evt){
			GPA.inputui.last_change_evt_target=evt.target;
			row.trigger('GPA_changeCourse',[id]);
		};
		row.find(':text').blur(row_change_handler);
		row.find(':checkbox').click(row_change_handler);
		row.find('#C_'+id+'_delete').click(function(){
			row.trigger('GPA_removeCourse',[id]);
		});
		$('#courses').append(row)
		if (C) GPA.inputui.courseToRow(id,C);
		row.show().trigger('GPA_addCourse',[id]);
	},
	courseFromRow:function(id){
		var C={
			selected:$('#C_'+id+'_selected').is(':checked'),
			name:$('#C_'+id+'_name').val(),
			credit:parseFloat($('#C_'+id+'_credit').val()),
			grade:$('#C_'+id+'_grade').val(),
			groups:GPA.util.parseGroups($('#C_'+id+'_groups').val())
		};
		if (C.credit&&C.grade) return C;
		else return null;
	},
	courseToRow:function(id,C){
		var q=function(selector){
			if (selector=='#%') return $('#C_'+id);
			selector=selector.replace(/%/g,'C_'+id+'_');
			return $(selector);
		};
		q('#%selected').prop('checked',C.selected);
		q('#%name').val(C.name);
		q('#%credit').val(C.credit);
		q('#%grade').val(C.grade);
		q('#%groups').val(C.groups);
		GPA.inputui.courseResultToRow(id,C);
	},
	courseResultToRow:function(id,C,q){//q is internal
		q=q||function(selector){
			if (selector=='#%') return $('#C_'+id);
			selector=selector.replace(/%/g,'C_'+id+'_');
			return $(selector);
		};
		q('#%').toggleClass('NaN',isNaN(C.point));
		q('#%level').html(C.level==''?'&nbsp;':C.level);
		q('#%point').text(isNaN(C.point)?'不支持':GPA.util.fix1(C.point));
		q('#%cp').text(isNaN(C.cp)?'不支持':GPA.util.fix1(C.cp));
	},
	removeAllRows:function(){
		$('#courses tr').each(function(){
			var row=$(this);
			var id=row.attr('id').substr(2);
			row.trigger('GPA_removeCourse',[id]);
		});
	},
	removeEmptyRows:function(){
		$('#courses tr').each(function(){
			var hasText=false;
			$(':text',this).each(function(){ if(this.value!='') hasText=true; });;
			if (!hasText) {
				var row=$(this);
				var id=row.attr('id').substr(2);
				row.trigger('GPA_removeCourse',[id]);
			}
		});
	},
	
	popupCourseInvalidTop:function(id){
		var pos=$('#C_'+id+'_selected').position();
		pos.top-=33;
		var tip=$('#course_invalid_tip').css(pos).show();
		setTimeout(function(){
			tip.fadeOut(1000);
		},1000);
	},
	
	onKeyUp:function(evt){
		switch (evt.which) {
			case 13://[ENTER]
			{
				var TD=$(evt.target).closest('td');
				if (TD.length==0) return;
				var nextTD=TD.nextAll('td:has(:text)').first();
				if (nextTD.length>0) {
					nextTD.find(':text').focus();
				} else {
					var TR=TD.closest('tr');
					var nextTR=TR.next('tr');
					if (nextTR.length==0) { GPA.inputui.addRow(); nextTR=TR.next('tr'); }
					nextTD=nextTR.find('td :text:first').focus();
				}
				TD.find('input').triggerHandler('blur');
			} break;
			//case 18://[ALT]
			//{
			//	var TR=$(evt.target).closest('tr');
			//	if (TR.length==0) return;
			//	var checkbox=TR.find('#'+TR.attr('id')+'_selected').get(0);
			//	checkbox.checked=!checkbox.checked;
			//} break;
			//case 38://[↑]
			//{
			//	var TD=$(evt.target).closest('td');
			//	if (TD.length==0) return;
			//	var TR=TD.closest('tr');
			//	var index=TR.find('td').index(TD.get(0));
			//	TR.prev('tr').find('td').eq(index).find('input').focus();
			//} break;
			//case 40://[↓]
			//{
			//	var TD=$(evt.target).closest('td');
			//	if (TD.length==0) return;
			//	var TR=TD.closest('tr');
			//	var index=TR.find('td').index(TD.get(0));
			//	TR.next('tr').find('td').eq(index).find('input').focus();
			//} break;
		}
	},
	onChangeCourse:function(evt,id){
		var t_name=$('#C_'+id+'_name');
		t_name.val($.trim(t_name.val()));
		var t_credit=$('#C_'+id+'_credit');
		var v_credit=GPA.util.normalizeFloat(t_credit.val())
		t_credit.val(v_credit);
		var t_grade=$('#C_'+id+'_grade');
		var v_grade=GPA.util.parseLevelOrGrade(t_grade.val());
		t_grade.val(v_grade);
		var t_groups=$('#C_'+id+'_groups');
		var v_groups=GPA.util.parseGroups(t_groups.val());
		t_groups.val(v_groups);
		var t_selected=$('#C_'+id+'_selected');
		var changing_selected=t_selected.index(GPA.inputui.last_change_evt_target)>=0;
		if (v_credit&&v_grade) {
			if (!changing_selected) t_selected.prop('checked',true);
		} else {
			if (changing_selected) {
				t_selected.prop('checked',false);
				GPA.inputui.popupCourseInvalidTop(id);
			}
		}
	},
	onRemoveCourse:function(evt,id){
		$('#C_'+id).remove();
	}
};
