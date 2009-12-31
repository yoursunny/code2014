var Share={
	load:function() {
		//WebSite.loadJS('huotu','http://n.65536.cn/lib/home-share.ashx?a=huotu');
		WebSite.loadJS('digu','http://api.minicloud.com.cn/statuses/user_timeline.json?userIdOrName=sunnyboy&isBack=false&callback=Share.digu');
		WebSite.loadJS('greader','http://www.google.com/reader/public/javascript/user/07716516319656411879/state/com.google/broadcast?n=8&callback=Share.greader');
		WebSite.loadJS('delicious','http://feeds.delicious.com/v2/json/yoursunny?count=8&callback=Share.delicious');
		WebSite.loadJS('twitter','http://n.65536.cn/lib/home-share.ashx?a=twitter');
	},
	parse_date1:function(d) {//解析形如Sun Jun 07 03:45:13 +0000 2009的日期
		var m=/^\w+\s(\w+)\s(\d+)\s(\d+):(\d+):(\d+)\s[+\-]\d+\s(\d+)$/.exec(d);
		return new Date(m[6],['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'].indexOf(m[1].capitalize()),m[2],m[3],m[4],m[5]);
	},
	parse_date2:function(d) {//解析形如2009-06-03T02:10:03Z的日期
		var m=/^(\d+)\-(\d+)\-(\d+)T(\d+):(\d+):(\d+)Z$/.exec(d);
		return new Date(parseInt(m[1],10),parseInt(m[2],10)-1,parseInt(m[3],10),parseInt(m[4],10),parseInt(m[5],10),parseInt(m[6]));
	},
	/*huotu:function(o) {
		Share.add('huotu',o,function(i){
			if (i.n.startsWith('@')) return null;
			return {dt:Share.parse_date2(i.dt),n:i.n};
		});
		Share.show(1);
	},*/
	digu:function(o) {
		Share.add('digu',o,function(i){
			if (i.text.startsWith('@')) return null;
			return {dt:Share.parse_date1(i.created_at),n:i.text,via:i.source.stripTags()};
		});
		Share.show(1);
	},
	greader:function(o) {
		Share.add('greader',o.items,function(i){
			return {dt:new Date(i.published*1000),u:i.alternate.href,t:i.title,n:(i.annotations.length>=1?i.annotations[0].content:'')};
		});
		Share.show(2);
	},
	delicious:function(o) {
		Share.add('delicious',o,function(i){
			return {dt:new Date(Share.parse_date2(i.dt).getTime()+28800000),u:i.u,t:i.d,n:i.n,cat:i.t.join(' ')};
		});
		Share.show(4);
	},
	twitter:function(o) {
		Share.add('twitter',o,function(i){
			if (i.text.startsWith('@')) return null;
			return {dt:new Date(Share.parse_date1(i.created_at).getTime()+28800000),n:i.text,via:i.source.stripTags()};
		});
		Share.show(8);
	},
	L:[],
	add:function(cls,a,iter) {
		a.each(function(i){
			var t=iter(i);
			if(t) {
				t.cls=cls;
				Share.L.push(t);
			}
		});
	},
	got:0,
	show:function(flag) {
		Share.got|=flag;
		if (Share.got!=15) return;
		$('share').update('<ul>'+Share.L.sortBy(function(i){return i.dt;}).reverse().slice(0,16).collect(function(i){
			return '<li class="%1">%2 <span class="desc">%3</span> %4 <abbr title="%5" class="dt">%6</abbr></li>'.format(
				i.cls,
				(i.u&&i.t)?'<a href="%1" rel="external">%2</a>'.format(i.u,i.t.encodeHTML()):'',
				i.n.encodeHTML(),
				i.cat?'<span class="cat">%1</span>'.format(i.cat.encodeHTML()):(i.via?'<span class="via">via %1</span>'.format(i.via.encodeHTML()):''),
				i.dt.format('Y-m-d H:i:s'), i.dt.format('m-d H:i')
			);
		}).join('')+'</ul>');
		WebSite.NewWinLink();
	}
};
