//NAT信息收集
//本脚本只收集NAT网络地址转换信息，不收集任何隐私信息
function NAT_collect() {
	if (Cookie.get('NAT_collected')=='ok') return;
	Cookie.set('NAT_collected','ok');
	WebSite.scriptInclude('NAT_ip1','http://yoursunny-app.appspot.com/lib/IP.js','clientIP',function(){
		WebSite.scriptInclude('NAT_ip2','http://volit.65536.cn/IP.asp','clientIP_CT',function(){
			WebSite.scriptInclude('NAT_collect','http://yoursunny.com/z/2008/NAT/collect.php?ip1='+clientIP+'&ip2='+clientIP_CT,'NAT_collect_done',Prototype.emptyFunction);
		});
	});
}