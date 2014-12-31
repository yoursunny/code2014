GPA.resultui={
	init:function(){
		$('#app').bind('GPA_invalidateResult',function(){
			GPA.resultui.render(GPA.calc.getResult());
		});
		if ($.browser.msie && $.browser.version==6) {
			$('#calc_result_float').css('position','absolute');
			$(window).bind('resize scroll',GPA.resultui.calc_result_float_move);
			GPA.resultui.calc_result_float_move();
		}
	},
	render:function(R){
		if (R.course_count==0 || R.credit_total==0) {
			$('#result_credit_total,#result_gpa,#result_cp_total').html('&nbsp;');
			$('#calc_result_float').removeClass('NaN').text('欢迎使用阳光GPA计算器！');
		} else {
			$('#result_credit_total').text('∑='+R.credit_total);
			$('#result_gpa').html('<span style="text-decoration:overline;">x</span>='+(isNaN(R.GPA)?'无结果':GPA.util.fix4(R.GPA)));
			$('#result_cp_total').text('∑='+(isNaN(R.cp_total)?'无结果':GPA.util.fix1(R.cp_total)));
			if (isNaN(R.GPA)) {
				$('#calc_result_float').addClass('NaN').text('部分成绩无法识别，未能算出结果；请更正错误的成绩');
			} else {
				$('#calc_result_float').removeClass('NaN').text(''+R.course_count+'门课程，总学分='+R.credit_total+'，GPA='+GPA.util.fix4(R.GPA));
			}
		}
	},
	calc_result_float_move:function(){
		//IE6 doesn't support position:fixed
		var win=$(window);
		var d=$('#calc_result_float');
		d.css('top',win.scrollTop()+win.height()-d.outerHeight());
	}
};