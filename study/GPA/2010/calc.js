/*
course object
{
  selected:
  name:
  credit:
  grade:
  level:
  point:
  cp:
  groups:
}

triggering events
  GPA_invalidateResult(evt)

*/

GPA.courses={
	a:[],//id,..
	h:{},//id=>course
	last_id:0,//last id
	generate_id:function(){
		return ++GPA.courses.last_id;
	},
	get:function(id){
		id=parseInt(id);
		return GPA.courses.h[id];
	},
	set:function(id,C){
		id=parseInt(id);
		if (!C.groups) C.groups='';
		GPA.courses.h[id]=C;
		if ($.inArray(id,GPA.courses.a)<0) GPA.courses.a.push(id);
	},
	remove:function(id){
		id=parseInt(id);
		var index=$.inArray(id,GPA.courses.a);
		if (index>=0) {
			GPA.courses.a.splice(index,1);
			delete GPA.courses.h[id];
		}
	},
	each:function(cb,filter){
		if (!filter) filter=function(id,C){return true;};//not specified, allow any courses
		else if (filter===true) filter=function(id,C){return C.selected;};//selected_only
		$.each(GPA.courses.a,function(i,id){
			var C=GPA.courses.h[id];
			if (filter(id,C)) {
				cb(id,C);
			}
		});
	},
	hasCourse:function(){
		return GPA.courses.a.length>0;
	}
};

GPA.collector=function(filter){
	this.filter=filter;
};
$.extend(GPA.collector.prototype,{
	fresh:false,//is result fresh
	course_count:0,//count(courses)
	credit_total:0,//∑(credit)
	cp_total:0,//∑(credit*point)
	collectAll:function(){
		var self=this;
		self.course_count=self.credit_total=self.cp_total=0;
		GPA.courses.each(function(id,C){
			++self.course_count;
			self.credit_total+=C.credit;
			self.cp_total+=C.cp;
		},self.filter);
		self.fresh=true;
	},
	invalidateResult:function(){
		this.fresh=false;
	},
	getResult:function(){
		var self=this;
		if (!self.fresh) self.collectAll();
		return {
			course_count:self.course_count,
			credit_total:self.credit_total,
			cp_total:self.cp_total,
			GPA:self.cp_total/self.credit_total
		};
	}
});

GPA.calc={
	init:function(){
		$('#app').bind('GPA_addCourse',GPA.calc.onAddCourse)
			.bind('GPA_changeCourse',GPA.calc.onChangeCourse)
			.bind('GPA_removeCourse',GPA.calc.onRemoveCourse)
			.bind('GPA_changeAlg',function(){
				GPA.calc.calcAllCourses();
				GPA.calc.invalidateResult();
			});
	},
	
	calcCourse:function(C){//calculate level,point,cp for a course
		var A=GPA.thisAlg;
		var defLevel='',grade=C.grade;
		if (GPA.util.isLevel(grade)) {
			if (A.supportedLevels==null || A.supportedLevels.length==0) {
				C.point=NaN;
				C.level='';
				C.cp=NaN;
				return;
			}
			if ($.inArray(grade,A.supportedLevels)<0) {
				grade=GPA.util.translateLevel(grade,A.supportedLevels);
			}
			defLevel=C.level;
		} else {
			if (typeof grade=='string') grade=parseFloat(grade);
		}
		var pl=A.calc(grade);
		if ($.isArray(pl)) {
			C.point=pl[0];
			C.level=pl[1];
		} else {
			C.point=pl;
			C.level=defLevel;
		}
		C.cp=C.point*C.credit;
	},
	calcAllCourses:function(){
		GPA.courses.each(function(id,C){
			GPA.calc.calcCourse(C);
			GPA.inputui.courseResultToRow(id,C);
		});
	},
	
	mainCollector:new GPA.collector(true),
	pause_invalidate_evt:false,//pause raising GPA.invalidateResult event
	invalidateResult:function(){
		GPA.calc.mainCollector.invalidateResult();
		if (!GPA.calc.pause_invalidate_evt) $('#courses').trigger('GPA_invalidateResult');
	},
	getResult:function(){
		return GPA.calc.mainCollector.getResult();
	},
	
	importCourses:function(courses,clear){
		GPA.calc.pause_AddCourse=GPA.calc.pause_invalidate_evt=true;
		if (clear) GPA.inputui.removeAllRows();
		else GPA.inputui.removeEmptyRows();
		$.each(courses,function(i,C){
			var id=GPA.courses.generate_id();
			GPA.courses.set(id,C);
			GPA.calc.calcCourse(C);
			GPA.inputui.addRow(id,C);
		});
		if (courses.length==0 && clear) GPA.inputui.addEmptyRows();
		GPA.calc.pause_AddCourse=GPA.calc.pause_invalidate_evt=false;
		GPA.calc.invalidateResult();
	},
	
	pause_AddCourse:false,//pause handling GPA.addCourse event
	onAddCourse:function(evt,id){
		if (GPA.calc.pause_AddCourse) return;
		var C=GPA.inputui.courseFromRow(id);
		if (C==null) return;
		GPA.courses.set(id,C);
		GPA.calc.calcCourse(C);
		GPA.inputui.courseResultToRow(id,C);
		if (C.selected) GPA.calc.invalidateResult();
	},
	onChangeCourse:function(evt,id){
		var oldC=GPA.courses.get(id);
		if (oldC!=null && oldC.selected) GPA.calc.invalidateResult();
		var C=GPA.inputui.courseFromRow(id);
		if (C==null) {
			if (oldC!=null) GPA.courses.remove(id);
			return;
		}
		GPA.courses.set(id,C);
		GPA.calc.calcCourse(C);
		GPA.inputui.courseResultToRow(id,C);
		GPA.calc.invalidateResult();
	},
	onRemoveCourse:function(evt,id){
		var oldC=GPA.courses.get(id);
		GPA.courses.remove(id);
		if (oldC!=null && oldC.selected) GPA.calc.invalidateResult();
	}
};