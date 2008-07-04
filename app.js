var PhoneBook={
	//请求服务器
	req:function(a,p,cb) {
		new Ajax.Request('pb.php',{parameters:(Object.extend({a:a},p)),onSuccess:cb,onFailure:PhoneBook.respFailure});
	},
	//处理出错返回，如果未登录则提示登录
	respFailure:function(resp) {
		if (resp.getHeader('X-PhoneBook-Login')=='required') {
			PhoneBook.requireLogin();
		} else alert(resp.responseText);
	},
	//跳转到登录界面
	requireLogin:function() {
		PhoneBook.requireLogin=Prototype.emptyFunction;
		PhoneBook.UI.showModalDialog('dialog_login');
	},
	//初始化
	init:function() {
		PhoneBook.fetchBasicInfo.defer();
	},
	//检查是否已经登录，如果未登录则跳转到登录页面
	MustLogin:function() {
		PhoneBook.req('nop',null,null);
	},
	//开始登录
	login:function() {
		location='liveid.php';
	},
	//guest登录
	login_guest:function() {
		location='liveid.php?login=guest';
	},
	//注销登录
	logout:function() {
		location='liveid.php?logout=1';
	},
	//获取基本信息
	//Owner:{uid:...,WAPtinyurl:...,WAPpin:...},
	//Tags:[{n:name,c:count},...],
	//Phone_types:[{n:name,c:count},...],
	//Address_types:[{n:name,c:count},...],
	//IM_types:[{n:name,c:count},...],
	//Custom_types:[{n:name,c:count},...],
	fetchBasicInfo:function() {
		PhoneBook.req('basic',null,function(re){
			var j=re.responseJSON;
			PhoneBook.Owner=j.Owner;
			PhoneBook.Tags=new FrequencyList(j.Tags);
			PhoneBook.Phone_types=new FrequencyList(j.Phone_types);
			PhoneBook.Address_types=new FrequencyList(j.Address_types);
			PhoneBook.IM_types=new FrequencyList(j.IM_types);
			PhoneBook.Custom_types=new FrequencyList(j.Custom_types);
			PhoneBook.Person.fetchAll();//在基本信息载入后才下载联系人，未登录时不会浪费这次请求
		});
	}
};
document.observe('dom:loaded',PhoneBook.init);

//电话本中的一个人
PhoneBook.Person=Class.create({
	id:'_',
	Name:'',
	Tag:null,
	Email:'',
	Phone:null,
	Address:null,
	IM:null,
	Company:'',
	Birthday:null,
	Custom:null,
	Web:null,
	Meet:null,
	Notes:'',
	initialize:function() {
		this.Tag=[];
		this.Phone=[];
		this.Address=[];
		this.IM=[];
		this.Custom=[];
		this.Web=[];
		this.Meet=new PhoneBook.Person.Meet();
	},
	//从XML <Person/>标签读取
	loadXML:function(n) {
		if (n.nodeType!=1 || n.tagName!='Person') throw 'PhoneBook.Person.loadXML，参数不是<Person/>标签';
		this.id=n.getAttribute('id');
		var ch=n.childNodes;
		var len=ch.length;
		for (var i=0;i<len;++i) {
			var c=ch.item(i);
			if (c.nodeType!=1) continue;
			var text=c.hasChildNodes()?c.firstChild.nodeValue:'';
			switch (c.tagName) {
				case 'Name': this.Name=text; this.Meet.Name=text; break;
				case 'Tag': this.Tag.push(text); break;
				case 'Email': this.Email=text; break;
				case 'Phone': this.Phone.push({type:c.getAttribute('type'),n:text}); break;
				case 'Address': this.Address.push({type:c.getAttribute('type'),n:text}); break;
				case 'IM': this.IM.push({type:c.getAttribute('type'),n:text}); break;
				case 'Company': this.Company=text; break;
				case 'Birthday': this.Birthday=new Date(c.getAttribute('year'),parseInt(c.getAttribute('month'),10)-1,c.getAttribute('day')); break;
				case 'Custom': this.Custom.push({type:c.getAttribute('type'),n:text}); break;
				case 'Web': this.Web.push(text); break;
				case 'Meet': this.Meet.addXML(c); break;
				case 'Notes': this.Notes=text; break;
			}
		}
	},
	//判断是否符合搜索关键字
	match:function(q) {
		if (['Name','Tag','Email','Company','Notes'].any(function(k){return this[k].include(q);}.bind(this))) return true;
		if (['Phone','Address','IM','Custom'].any(function(k){return this[k].any(function(entry){return entry.n.include(q);});}.bind(this))) return true;
		if (['Web'].any(function(k){return this[k].any(function(entry){return entry.include(q);});}.bind(this))) return true;
		return false;
	}
});

//我怎样认识...？
PhoneBook.Person.Meet=Class.create({
	Name:'',//对方的姓名
	h:null,
	initialize:function(Name) {
		this.Name=Name;
		this.h=[];
	},
	//读取<Meet/>标签，增加到当前实例
	addXML:function(n) {
		this.addEvent(n.getAttribute('type'),n.getAttribute('event'),n.getAttribute('year'),n.getAttribute('year2'),n.getAttribute('see'));
	},
	//增加事件
	addEvent:function(type,ev,year,year2,see) {
		var EventType=PhoneBook.Person.Meet.EventTypes[type];
		if (!EventType) return;
		var e=EventType.create(type,ev,year,year2,see,this);
		if (!e) return;
		this.h.push(e);
	},
	//根据类型查找
	findType:function(type) {
		return this.h.findAll(function(k){return k.type==type;});
	},
	//全部事件的HTML
	toHTML:function() {
		return this.h.collect(function(ev){
			var EventType=PhoneBook.Person.Meet.EventTypes[ev.type];
			if (!EventType) return '';
			return EventType.toHTML(ev);
		}).join('');
	},
	//全部事件的JSON
	toJSON:function() {
		return Object.toJSON(this.h);
	}
});
//事件类型中可引用的公共处理函数
PhoneBook.Person.Meet.EventTypeCommon={
	//有一个年份的事件
	create1:function(type,ev,year,year2,see,meet) {
		if (year>0) return {type:type,ev:ev,year:year};
		else return {type:type,ev:ev};
	},
	//有两个年份的事件
	create2:function(type,ev,year,year2,see,meet) {
		if (year>0) {
			if (year2>year) return {type:type,ev:ev,year:year,year2:year2};
			else return {type:type,ev:ev,year:year};
		}
		else return {type:type,ev:ev};
	},
	//删除同类事件，并调用下一个处理函数this()
	MakeUnique:function(type,ev,year,year2,see,meet) {
		meet.h=meet.h.without.apply(meet.h,meet.findType(type));
		return (this||Prototype.emptyFunction)(type,ev,year,year2,see,meet);
	},
	//获取一个年份的文本表示
	getYears1:function(ev) {
		if (ev.year>0) return ''+ev.year+'年';
		return '';
	},
	//获取两个年份的文本表示
	getYears2:function(ev) {
		if (ev.year>0)
			if (ev.year2>ev.year) return ''+ev.year+'年～'+ev.year2+'年';
			else return ''+ev.year+'年';
		return '';
	},
	//创建第一个年份的输入框
	createYear1:function(value) {
		var se=$(document.createElement('select')).setStyle({width:'5em'});
		var add=function(v) { se.options[se.options.length]=new Option(v,v,v==value); }
		add('');
		$A($R(1970,new Date().getFullYear())).reverse().each(function(y){add(y);});
		return se;
	},
	//创建第二个年份的输入框
	createYear2:function(value,year1) {
		var se=$(document.createElement('select')).setStyle({width:'5em'});
		var add=function(v) { se.options[se.options.length]=new Option(v,v,v==value); }
		add('');
		$A($R(year1,new Date().getFullYear())).reverse().each(function(y){add(y);});
		return se;
	},
	//创建禁用的年份输入框
	createDisabledYear:function() {
		var se=$(document.createElement('select')).setStyle({width:'5em'});
		se.disable();
		return se;
	}
};
PhoneBook.Person.Meet.EventTypes={
	'同学':{
		events:['幼儿园','小学','初中','高中','大学','硕士','博士','博士后'],
		create:function(type,ev,year,year2,see,meet) {
			if (PhoneBook.Person.Meet.EventTypes['同学'].events.include(ev))
				return PhoneBook.Person.Meet.EventTypeCommon.create2(type,ev,year,year2,see,meet);
			else return null;
		},
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears2(ev)+'一起就读'+ev.ev; },
		createEditor:function(ev,container){
			/*
			var editor={};
			var ed=document.createElement('div'); editor.ed=ed.identify();
			var year1=PhoneBook.Person.Meet.EventTypeCommon.createYear1(ev.year1);
			ed.appendChild(year1); editor.year1=year1.identify();
			ed.appendChild(document.createTextNode('到'));
			var year2=PhoneBook.Person.Meet.EventTypeCommon.createYear2(ev.year2);
			ed.appendChild(year2); editor.year2=year2.identify();
			ed.appendChild(document.createElement('br'));
			ed.appendChild(document.createTextNode('一起就读'));
			var events=PhoneBook.Person.Meet.EventTypes['同学'].createEvents(ev.ev);
			ed.appendChild(events); editor.events=events.identify();
			$(container).insert(ed);
			return editor;*/
		},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){},
		createEvents:function(value) {
			var se=document.createElement('select');
			var add=function(v) { se.options[se.options.length]=new Option(v,v,v==value); }
			add('');
			PhoneBook.Person.Meet.EventTypes['同学'].events.each(function(y){add(y);});
			return se;
		}
	},
	'室友':{
		create:PhoneBook.Person.Meet.EventTypeCommon.create2,
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears2(ev)+'一起住在'+ev.ev; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'社团':{
		create:PhoneBook.Person.Meet.EventTypeCommon.create1,
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears1(ev)+'一起加入过'+ev.ev; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'聚会':{
		create:PhoneBook.Person.Meet.EventTypeCommon.MakeUnique.bind(PhoneBook.Person.Meet.EventTypeCommon.create1),
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears1(ev)+'一起参加'+ev.ev; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'朋友':{
		create:PhoneBook.Person.Meet.EventTypeCommon.MakeUnique.bind(PhoneBook.Person.Meet.EventTypeCommon.create1),
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears1(ev)+'通过'+ev.ev+'认识'; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'家人':{
		create:function(type,ev,year,year2,see,meet) { return {type:type}; },
		toHTML:function(ev) { return '家人是最亲密的朋友！'; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'同事':{
		create:PhoneBook.Person.Meet.EventTypeCommon.create2,
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears2(ev)+'一起工作于'+ev.ev; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'商务合作':{
		create:PhoneBook.Person.Meet.EventTypeCommon.MakeUnique.bind(PhoneBook.Person.Meet.EventTypeCommon.create1),
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears1(ev)+'合作过'+ev.ev; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'网站':{
		create:PhoneBook.Person.Meet.EventTypeCommon.MakeUnique.bind(function(type,ev,year,year2,see,meet){
			if (year>0) return {type:type,ev:ev,year:year,see:see};
			else return {type:type,ev:ev,see:see};
		}),
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears1(ev)+'通过'+ev.ev+'认识'; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	},
	'其他':{
		create:PhoneBook.Person.Meet.EventTypeCommon.MakeUnique.bind(PhoneBook.Person.Meet.EventTypeCommon.create1),
		toHTML:function(ev) { return PhoneBook.Person.Meet.EventTypeCommon.getYears1(ev)+' '+ev.ev; },
		createEditor:function(ev){},
		destoryEditor:function(ev,editor){},
		fromEditor:function(ev,editor){}
	}
};

Object.extend(PhoneBook.Person,{
	//全部联系人列表
	P:null,
	//获取全部联系人信息
	fetchAll:function() {
		PhoneBook.req('all',null,function(re){
			var x=re.responseXML;
			var xp=new XPath(x);
			xp.addNS('pb','http://www.65536.cn/work/2008/PhoneBook/ns/0001');
			var person_nodes=xp.select(x.documentElement,'pb:Person');
			PhoneBook.Person.P=person_nodes.collect(function(n){
				var p=new PhoneBook.Person();
				p.loadXML(n);
				return p;
			});
			PhoneBook.UI.init();//现在才能初始化UI
		});
	},
	selectTag:function(tag) {
		return PhoneBook.Person.P.select(function(p) {return p.Tag.include(tag);});
	},
	//根据关键字搜索
	query:function(q) {
		return PhoneBook.Person.P.select(function(p){return p.match(q);});
	}
});

//界面功能
PhoneBook.UI={
	init:function() {
		Event.observe('search_q','keyup',PhoneBook.UI.SearchKey.bindAsEventListener(null));
		PhoneBook.UI.updateTags(false);
	},
	//显示居中的对话框、并覆盖其他组件
	showModalDialog:function(div) {
		$('modal_back').setOpacity(0.7).show();
		$(div).addClassName('modal_dialog').show();
	},
	//隐藏用showModalDialog显示的对话框
	hideModalDialog:function(div) {
		$('modal_back').hide();
		$(div).hide().removeClassName('modal_dialog');
	},
	//搜索框按键监听
	SearchKey:function(event) {
		if (event.which==13 || event.keyCode==13) {//[ENTER]
			var q=$F('search_q');
			if (q.length>0) {
				var r=PhoneBook.Person.query(q);
				PhoneBook.UI.updateTags(r.length);
				PhoneBook.UI.updatePersons(r);
			}
		}
	},
	//更新tags div
	//search_result=false，不显示“搜索结果”
	//search_result=数字，显示“搜索结果”(数字表示结果数量)
	updateTags:function(search_result) {
		PhoneBook.UI.TagEditor.hide();
		var l=$('tags_l');
		l.childElements().invoke('remove');
		var addTag=function(tag,count,click) {
			var li=document.createElement('li');
			li.tag_name=tag;
			li.innerHTML='<span class="n">'+(tag.startsWith('-')?tag.substr(1):tag).escapeHTML()+'</span><span class="c">'+count+'</span>';
			l.appendChild(li);
			if (click) Event.observe(li,'click',click);
		};
		var addHR=function() {
			$(l).insert('<li class="hr"></li>');
		}
		addTag('-全部联系人',PhoneBook.Person.P.size(),PhoneBook.UI.clickTag.bind(null,1,'-全部联系人')); addHR();
		PhoneBook.Tags.all().each(function(tag){addTag(tag,PhoneBook.Tags.count(tag),PhoneBook.UI.clickTag.bind(null,0,tag));});
		PhoneBook.UI.updateTags.search_result=!!search_result;
		if (PhoneBook.UI.updateTags.search_result) {
			addHR(); addTag('-搜索结果',search_result,PhoneBook.UI.clickTag.bind(null,2,'-搜索结果'));
			PhoneBook.UI.selectTag('-搜索结果');
		}
	},
	//tag点击事件
	//type=0普通,1全部,2搜索结果
	clickTag:function(type,tag) {
		if (type!=2 && PhoneBook.UI.updateTags.search_result) {
			PhoneBook.UI.updateTags(false);
			$('search_q').value='';
		}
		PhoneBook.UI.selectTag(tag);
		if (type==1) PhoneBook.UI.updatePersons(PhoneBook.Person.P);
		if (type==0) PhoneBook.UI.updatePersons(PhoneBook.Person.selectTag(tag));
	},
	//高亮显示选中的tag
	selectTag:function(tag) {
		var li=$('tags_l').childElements().invoke('removeClassName','a').select(function(n){return n.tag_name==tag;});
		if (li.length<1) return; li=li[0];
		li.addClassName('a');
	},
	//更新persons div为P中的联系人
	updatePersons:function(P) {
		var d=$('persons_l').update();
		PhoneBook.UI.updatePersons.P=P;
		P.each(function(p,i) {
			d.insert('<li id="person_li_'+i+'"><input id="person_check_'+i+'" type="checkbox"/> <span id="person_name_'+i+'">'+p.Name.escapeHTML()+'</span></li>');
			Event.observe('person_check_'+i,'click',PhoneBook.UI.person_check.bind(null,i));
			Event.observe('person_name_'+i,'click',PhoneBook.UI.person_name.bind(null,i));
		});
		if (P.length==1) {
			$('person_check_0').checked=true;
			PhoneBook.UI.selectPerson.defer();
		}
		else PhoneBook.UI.updateDetailNone.defer();
	},
	//人名前复选框点击事件处理
	person_check:function(i) {
		PhoneBook.UI.selectPerson();
	},
	//人名点击事件处理
	person_name:function(i) {
		$('persons_l').getElementsBySelector('input').each(function(chk){chk.checked=false;});
		$('person_check_'+i).checked=true;
		PhoneBook.UI.selectPerson();
	},
	//高亮显示复选框已经选中的人名
	selectPerson:function() {
		if (!PhoneBook.UI.updatePersons.P) return PhoneBook.UI.updateDetailNone();
		var len=PhoneBook.UI.updatePersons.P.length;
		var last_selected=-1; var count_selected=0;
		var a=$R(0,len-1).collect(function(i){
			var selected=$('person_check_'+i).checked;
			if (selected) {
				last_selected=i;
				++count_selected;
				$('person_li_'+i).addClassName('a');
			}
			else $('person_li_'+i).removeClassName('a');
			return selected;
		});
		if (count_selected<1) PhoneBook.UI.updateDetailNone();
		else if (count_selected==1) PhoneBook.UI.updateDetailOne(last_selected);
		else PhoneBook.UI.updateDetailMulti(a);
	},
	//更新detail div，未选中联系人
	updateDetailNone:function() {
		$('detail_i').update();
		$('detail_person_edit').addClassName('disable');
		$('detail_person_tag_edit').addClassName('disable');
		$('detail_person_delete').addClassName('disable');
	},
	//更新detail div，一个联系人
	updateDetailOne:function(i) {
		var K_n_type=function(entry){return '<li><span class="n">'+entry.n.escapeHTML()+'</span><span class="type">'+entry.type.escapeHTML()+'</span></li>';};
		var K_web=function(u){return '<li><a href="'+u.escapeHTML()+'" target="_blank" title="访问网站">'+u.escapeHTML()+'</a></li>';};
		var K_address=function(entry){return '<li><span class="n"><a href="http://ditu.google.cn/maps?'+Object.toQueryString({q:entry.n})+'" target="_blank" title="查看地图">'+entry.n.escapeHTML()+'</a></span><span class="type">'+entry.type.escapeHTML()+'</span></li>';};
		var p=PhoneBook.UI.updatePersons.P[i];
		PhoneBook.UI.updateDetailOne.i=i;
		var b='<div class="one">';
		b+='<p class="basic"><span class="name">'+p.Name.escapeHTML()+'</span><br/>';
		b+='<span class="email"><a href="javascript:;" onclick="prompt(\'请复制邮件地址：\',\''+p.Email.escapeHTML()+'\')" title="复制邮件地址">'+p.Email.escapeHTML()+'</a></span><br/>';
		b+='<span class="company">'+p.Company.escapeHTML()+'</span></p>';
		b+='<ul class="phone">'+p.Phone.collect(K_n_type).join('')+'</ul>';
		b+='<ul class="im">'+p.IM.collect(K_n_type).join('')+'</ul>';
		b+='<ul class="web">'+p.Web.collect(K_web).join('')+'</ul>';
		b+='<ul class="address">'+p.Address.collect(K_address).join('')+'</ul>';
		b+='<ul class="custom">'+p.Custom.collect(K_n_type).join('')+'</ul>';
		b+='<p class="meet">'+p.Meet.toHTML()+'</p>';
		b+='<p class="notes">'+p.Notes+'</p>';
		b+='</div>';
		$('detail_i').update(b);
		$('detail_person_edit').removeClassName('disable');
		$('detail_person_tag_edit').removeClassName('disable');
		$('detail_person_delete').removeClassName('disable');
	},
	//更新detail div，多个联系人
	updateDetailMulti:function(a) {
		PhoneBook.UI.updateDetailMulti.a=a;
		var count=a.findAll(Prototype.K).length;
		var b='<div class="multi">';
		b+='<p class="c">已选中'+count+'位联系人，';
		b+='<a href="javascript:PhoneBook.UI.EmailMulti();">批量发送电子邮件</a></p>';
		b+='<table cellspacing="0">'+a.collect(function(selected,i){
			if (!selected) return '';
			var p=PhoneBook.UI.updatePersons.P[i];
			return '<tr><td class="name"><a href="javascript:PhoneBook.UI.person_name('+i+');">'+p.Name.escapeHTML()+'</a></td>'
				+'<td class="company">'+p.Company.escapeHTML()+'</td>'
				+'<td class="phone">'+(p.Phone.length<1?'&nbsp;':p.Phone[0].n.escapeHTML())+'</td></tr>';
		}).join('')+'</table>';
		$('detail_i').update(b);
		$('detail_person_edit').addClassName('disable');
		$('detail_person_tag_edit').removeClassName('disable');
		$('detail_person_delete').removeClassName('disable');
	},
	//编辑按钮
	PersonEdit:function() {
		if ($('detail_person_edit').hasClassName('disable')) return;
		PhoneBook.UI.showEdit(PhoneBook.UI.updateDetailOne.i);
	},
	//标签按钮
	PersonTagEdit:function() {
		if ($('detail_person_tag_edit').hasClassName('disable')) return;
		var single=($('detail_i').select('.one').length > 0);
		if (single) {
			var p=PhoneBook.UI.updatePersons.P[PhoneBook.UI.updateDetailOne.i];
			PhoneBook.UI.TagEditor.init([p]);
		} else {
			var a=PhoneBook.UI.updateDetailMulti.a.collect(function(selected,i) {
				if (!selected) return null;
				return PhoneBook.UI.updatePersons.P[i];
			}).compact();
			PhoneBook.UI.TagEditor.init(a);
		}
	},
	//删除联系人按钮
	PersonDelete:function() {
		if ($('detail_person_delete').hasClassName('disable')) return;
		var single=($('detail_i').select('.one').length > 0);
		if (single) {
			var p=PhoneBook.UI.updatePersons.P[PhoneBook.UI.updateDetailOne.i];
			if (!confirm('确实要删除 '+p.Name+' 吗？')) return;
			PhoneBook.req('person',{id:'-'+p.id},PhoneBook.UI.PersonDeleted);
			p.Tag.each(function(tag){PhoneBook.Tags.remove(tag);});
		} else {
			var a=PhoneBook.UI.updateDetailMulti.a.collect(function(selected,i) {
				if (!selected) return null;
				return PhoneBook.UI.updatePersons.P[i];
			}).compact();
			if (!confirm('确实要删除以下联系人吗？\n'+a.pluck('Name').join('\n'))) return;
			PhoneBook.req('multi_delete',{id:a.pluck('id').join(',')},PhoneBook.UI.PersonDeleted);
			a.each(function(p){p.Tag.each(function(tag){PhoneBook.Tags.remove(tag);});});
		}
	},
	//联系人已删除
	PersonDeleted:function(re) {
		var o=re.responseJSON;
		var id=o.id;
		if (Object.isArray(id)) {
			PhoneBook.Person.P=PhoneBook.Person.P.reject(function(p){return id.include(p.id);});
			PhoneBook.UI.updateTags(false);
			PhoneBook.UI.updatePersons([]);
		} else {
			PhoneBook.Person.P=PhoneBook.Person.P.reject(function(p){return p.id==id;});
			PhoneBook.UI.updateTags(false);
			PhoneBook.UI.updatePersons([]);
		}
	},
	//批量发送电子邮件
	EmailMulti:function() {
		$('email_multi_l').value=PhoneBook.UI.updateDetailMulti.a.collect(function(selected,i){
			if (!selected) return '';
			var p=PhoneBook.UI.updatePersons.P[i];
			if (p.Email.length<1) return '';
			return p.Name+' <'+p.Email+'>,\n';
		}).join('');
		PhoneBook.UI.showModalDialog('dialog_email_multi');
	},
	//批量发送电子邮件关闭
	EmailMulti_close:function() {
		PhoneBook.UI.hideModalDialog('dialog_email_multi');
	},
	//显示添加联系人界面
	showAdd:function() { PhoneBook.UI.showEdit(-1); },
	//显示编辑联系人界面，i=-1时新建联系人
	showEdit:function(i) {
		var p=(i<0)?new PhoneBook.Person():PhoneBook.UI.updatePersons.P[i];
		if (!p) return;
		if (PhoneBook.UI.updatePersons.P) {
			var len=PhoneBook.UI.updatePersons.P.length;
			for (var j=0;j<len;++j) {
				$('person_check_'+j).checked=(i==j);
				if (i==j) $('person_li_'+j).addClassName('a');
				else $('person_li_'+j).removeClassName('a');
			}
		}
		PhoneBook.UI.PersonEditor.init(p);
		PhoneBook.UI.showEdit.i=i;
	}
};

//从FrequencyList中选择项目或创建新项目
PhoneBook.UI.FreqSelect=Class.create({
	initialize:function(container,list,value,typename) {
		this.container=$(container);
		this.list=list;
		this.typename=typename;
		this.sechange=this.sechange_.bindAsEventListener(this);
		this.render();
		this.set(value);
	},
	//创建新对象的value属性
	new_value:'___###___FreqSelect___###___',
	//显示HTML标签
	render:function() {
		var se=$(document.createElement('select'));
		this.se=se;
		this.list.desc().each(function(v){ se.options[se.options.length]=new Option(v,v); });
		this.render_new();
		this.container.update(se);
		se.observe('change',this.sechange);
	},
	//显示“新建”选项
	render_new:function() {
		this.se.options[this.se.options.length]=new Option('新建...',this.new_value);
	},
	//下拉框改变事件
	sechange_:function(event) {
		var value=this.get();
		if (value==this.new_value) {
			var v=prompt('要创建的'+this.typename+'：');
			if (!v) {
				this.set(this.lastvalue);
				return;
			}
			this.set(v);
			this.lastvalue=v;
			return;
		}
		this.lastvalue=value;
	},
	//获取值
	get:function() {
		return this.se.getValue();
	},
	//设置值(内部使用)
	set_:function(value) {
		this.se.setValue(value);
		if (this.se.getValue()!=value) {
			this.se.options[this.se.options.length-1]=new Option(value,value);
			this.render_new();
			this.se.setValue(value);
		}
		this.lastvalue=value;
	},
	//设置值
	set:function(value) {
		this.set_(this.oldvalue=value);
	},
	//根据值的变化更新list
	savelist:function() {
		this.list.remove(this.oldvalue);
		this.list.add(this.get());
	}
});

//编辑一个人
PhoneBook.UI.PersonEditor={
	init:function(p) {
		PhoneBook.UI.PersonEditor.p=p;
		var b='<div class="edit">';
		b+='<p class="btn"><a href="javascript:PhoneBook.UI.PersonEditor.save()" class="ab"><img src="images/disk.png" width="16" height="16" alt="保存"/>保存</a> <a href="javascript:PhoneBook.UI.PersonEditor.cancel()" class="ab"><img src="images/cancel.png" width="16" height="16" alt="取消"/>取消</a></p>';
		b+='<p class="name"><input id="edit_name" type="text" value="'+p.Name.escapeHTML()+'"/></p>';
		b+='<p class="email"><b>Email</b><br/><input id="edit_email" type="text" value="'+p.Email.escapeHTML()+'"/></p>';
		b+='<p id="edit_phone" class="phone"><b>电话</b> <a href="javascript:PhoneBook.UI.PersonEditor.addPhone()" class="add">增加一个</a></p>';
		b+='<p id="edit_im" class="im"><b>即时消息</b> <a href="javascript:PhoneBook.UI.PersonEditor.addIM()" class="add">增加一个</a></p>';
		b+='<p id="edit_web" class="web"><b>网址</b> <a href="javascript:PhoneBook.UI.PersonEditor.addWeb()" class="add">增加一个</a></p>';
		b+='<p id="edit_address" class="address"><b>地址</b> <a href="javascript:PhoneBook.UI.PersonEditor.addAddress()" class="add">增加一个</a></p>';
		b+='<p class="company"><b>公司/单位</b><br/><input id="edit_company" type="text" value="'+p.Company.escapeHTML()+'"/></p>';
		b+='<p id="edit_custom" class="custom"><b>自定义信息</b> <a href="javascript:PhoneBook.UI.PersonEditor.addCustom()" class="add">增加一个</a></p>';
		b+='<p class="meet"><b>你是如何认识'+p.Name.escapeHTML()+'的？</b> <a href="javascript:PhoneBook.UI.PersonEditor.editMeet()">编辑</a><br/>'+p.Meet.toHTML()+'</p>';
		b+='<p class="notes"><b>备注</b><br/><textarea id="edit_notes">'+p.Notes+'</textarea></p>';
		b+='</div>';
		$('detail_i').update(b);
		p.Phone.each(function(entry){$('edit_phone').insert(new PhoneBook.UI.PersonEditor.PhoneEditor(entry));});
		p.IM.each(function(entry){$('edit_im').insert(new PhoneBook.UI.PersonEditor.IMEditor(entry));});
		p.Web.each(function(entry){$('edit_web').insert(new PhoneBook.UI.PersonEditor.WebEditor(entry));});
		p.Address.each(function(entry){$('edit_address').insert(new PhoneBook.UI.PersonEditor.AddressEditor(entry));});
		p.Custom.each(function(entry){$('edit_custom').insert(new PhoneBook.UI.PersonEditor.CustomEditor(entry));});
		$('detail_person_edit').removeClassName('disable');
		$('detail_person_tag_edit').removeClassName('disable');
		$('detail_person_delete').removeClassName('disable');
	},
	//添加指定类型的新编辑器对象
	addEntry:function(editor_class,container) { $(container).insert(new editor_class()); },
	//获取指定类型的所有编辑器值
	getEntries:function(container) {
		var editors=$(container).select('.entryEditor').pluck('entryEditor').compact();
		return editors.invoke('get').compact();
	},
	addPhone:function() { PhoneBook.UI.PersonEditor.addEntry(PhoneBook.UI.PersonEditor.PhoneEditor,'edit_phone'); },
	addIM:function() { PhoneBook.UI.PersonEditor.addEntry(PhoneBook.UI.PersonEditor.IMEditor,'edit_im'); },
	addAddress:function() { PhoneBook.UI.PersonEditor.addEntry(PhoneBook.UI.PersonEditor.AddressEditor,'edit_address'); },
	addCustom:function() { PhoneBook.UI.PersonEditor.addEntry(PhoneBook.UI.PersonEditor.CustomEditor,'edit_custom'); },
	addWeb:function() { PhoneBook.UI.PersonEditor.addEntry(PhoneBook.UI.PersonEditor.WebEditor,'edit_web'); },
	editMeet:function() { PhoneBook.UI.showModalDialog('meet_editor'); },
	//保存
	save:function() {
		var p=PhoneBook.UI.PersonEditor.p;
		p.Name=$F('edit_name');
		p.Email=$F('edit_email');
		p.Phone=PhoneBook.UI.PersonEditor.getEntries('edit_phone');
		p.Address=PhoneBook.UI.PersonEditor.getEntries('edit_address');
		p.IM=PhoneBook.UI.PersonEditor.getEntries('edit_im');
		p.Company=$F('edit_company');
		p.Custom=PhoneBook.UI.PersonEditor.getEntries('edit_custom');
		p.Web=PhoneBook.UI.PersonEditor.getEntries('edit_web');
		p.Notes=$F('edit_notes');
		PhoneBook.req('person',{id:p.id,p:Object.toJSON(p)},PhoneBook.UI.PersonEditor.saved);
	},
	saved:function(re) {
		var o=re.responseJSON;
		if (o.create) {
			PhoneBook.UI.PersonEditor.p.id=o.id;
			PhoneBook.Person.P.push(PhoneBook.UI.PersonEditor.p);
			PhoneBook.UI.updateTags(false);
			PhoneBook.UI.updatePersons([PhoneBook.UI.PersonEditor.p]);
			$('person_check_0').checked=true;
			PhoneBook.UI.selectPerson();
		} else {
			PhoneBook.UI.selectPerson();
		}
	},
	//取消
	cancel:function() { PhoneBook.UI.selectPerson(); }
};
//{n,type}编辑器
PhoneBook.UI.PersonEditor.ntypeEditor=Class.create({
	initialize:function(entry) {
		if (entry) {
			this.n=entry.n;
			this.type=entry.type;
		} else {
			this.n='';
			var types=this.typelist.desc();
			this.type=types.length>0?types[0]:null;
		}
	},
	toElement:function() {
		var div=$(document.createElement('div'));
		div.addClassName('entryEditor');
		div.entryEditor=this;
		this.div=div;
		var textbox=$(document.createElement('input'));
		textbox.type='text';
		textbox.value=this.n;
		this.textbox=textbox;
		div.appendChild(textbox);
		var span=$(document.createElement('span'));
		this.typebox=new PhoneBook.UI.FreqSelect(span,this.typelist,this.type,this.typename);
		div.appendChild(span);
		var a=$(document.createElement('a'));
		a.href='javascript:;';
		a.appendChild(document.createTextNode('删除'));
		a.observe('click',this.del.bind(this));
		div.appendChild(a);
		return div;
	},
	//删除
	del:function() {
		if (this.deleted) return;
		this.deleted=true;
		this.div.remove();
	},
	//获取值
	get:function() {
		if (this.deleted) return null;
		var n=this.textbox.getValue();
		if (!n) return null;
		return {n:n,type:this.typebox.get()};
	}
});
//电话号码编辑器
PhoneBook.UI.PersonEditor.PhoneEditor=Class.create(PhoneBook.UI.PersonEditor.ntypeEditor,{
	initialize:function($super,entry) {
		this.typelist=PhoneBook.Phone_types;
		return $super(entry);
	},
	typename:'电话类型'
});
//IM编辑器
PhoneBook.UI.PersonEditor.IMEditor=Class.create(PhoneBook.UI.PersonEditor.ntypeEditor,{
	initialize:function($super,entry) {
		this.typelist=PhoneBook.IM_types;
		return $super(entry);
	},
	typename:'即时消息工具'
});
//地址编辑器
PhoneBook.UI.PersonEditor.AddressEditor=Class.create(PhoneBook.UI.PersonEditor.ntypeEditor,{
	initialize:function($super,entry) {
		this.typelist=PhoneBook.Address_types;
		return $super(entry);
	},
	typename:'地址类型'
});
//自定义编辑器
PhoneBook.UI.PersonEditor.CustomEditor=Class.create(PhoneBook.UI.PersonEditor.ntypeEditor,{
	initialize:function($super,entry) {
		this.typelist=PhoneBook.Custom_types;
		return $super(entry);
	},
	typename:'自定义项目'
});
//网址编辑器
PhoneBook.UI.PersonEditor.WebEditor=Class.create({
	initialize:function(entry) {
		if (entry) {
			this.u=entry;
		} else {
			this.u='';
		}
	},
	toElement:function() {
		var div=$(document.createElement('div'));
		div.addClassName('entryEditor');
		div.entryEditor=this;
		this.div=div;
		var textbox=$(document.createElement('input'));
		textbox.type='text';
		textbox.value=this.u;
		this.textbox=textbox;
		div.appendChild(textbox);
		var a=$(document.createElement('a'));
		a.href='javascript:;';
		a.appendChild(document.createTextNode('删除'));
		a.observe('click',this.del.bind(this));
		div.appendChild(a);
		return div;
	},
	//删除
	del:function() {
		if (this.deleted) return;
		this.deleted=true;
		this.div.remove();
	},
	//获取值
	get:function() {
		if (this.deleted) return null;
		var u=this.textbox.getValue();
		if (!u) return null;
		return u;
	}
});

//标签编辑器
PhoneBook.UI.TagEditor={
	init:function(P) {
		PhoneBook.UI.TagEditor.P=P;//被编辑的联系人数组
		var single=P.length<2;
		var ul=$('tag_editor').clonePosition('detail_person_tag_edit',{setWidth:false,setHeight:false,offsetTop:30});
		ul.childElements().invoke('remove');
		PhoneBook.Tags.desc().each(function(tag){
			var li=$(document.createElement('li'));
			var span=$(document.createElement('span'));
			span.appendChild(document.createTextNode(tag));
			li.appendChild(span.addClassName('n'));
			if (!single || !P[0].Tag.include(tag)) {
				var a1=$(document.createElement('a'));
				a1.href='javascript:;';
				a1.observe('click',PhoneBook.UI.TagEditor.applyTag.bind(null,tag));
				li.appendChild(a1.addClassName('apply'));
			}
			if (!single || P[0].Tag.include(tag)) {
				var a2=$(document.createElement('a'));
				a2.href='javascript:;';
				a2.observe('click',PhoneBook.UI.TagEditor.removeTag.bind(null,tag));
				li.appendChild(a2.addClassName('remove'));
			}
			ul.appendChild(li);
		});
		var li=$(document.createElement('li'))
		var span=$(document.createElement('span'));
		var textbox=$(document.createElement('input'));
		textbox.type='text';
		textbox.id='tag_editor_new';
		span.appendChild(textbox);
		li.appendChild(span.addClassName('n'));
		var a1=$(document.createElement('a'));
		a1.href='javascript:;';
		a1.observe('click',PhoneBook.UI.TagEditor.applyNewTag);
		li.appendChild(a1.addClassName('apply'));
		ul.appendChild(li);
		ul.show();
		$('tag_editor_back').show();
	},
	hide:function() {
		$('tag_editor').hide();
		$('tag_editor_back').hide();
	},
	applyTag:function(tag) {
		if (tag=='') return;
		PhoneBook.UI.TagEditor.P.each(function(p){
			if (!p.Tag.include(tag)) {
				p.Tag.push(tag);
				PhoneBook.Tags.add(tag);
			}
		});
		PhoneBook.UI.TagEditor.save();
	},
	applyNewTag:function() {
		PhoneBook.UI.TagEditor.applyTag($F('tag_editor_new'));
	},
	removeTag:function(tag) {
		PhoneBook.UI.TagEditor.P.each(function(p){
			if (p.Tag.include(tag)) {
				p.Tag=p.Tag.without(tag);
				PhoneBook.Tags.remove(tag);
			}
		});
		PhoneBook.UI.TagEditor.save();
	},
	save:function() {
		var P={};
		PhoneBook.UI.TagEditor.P.each(function(p){
			P[p.id]=p.Tag.join(',');
		});
		PhoneBook.req('multi_tag',{P:Object.toJSON(P)},PhoneBook.UI.TagEditor.saved);
	},
	saved:function() {
		PhoneBook.UI.updateTags(false);
	}
};

//手机访问相关设置
PhoneBook.Mobile={
	//显示手机设置界面
	dialog:function() {
		$('wap_tinyurl').update(PhoneBook.Owner.WAPtinyurl.length<1?'<a href="javascript:PhoneBook.Mobile.get_tinyurl()">马上开通</a>':PhoneBook.Owner.WAPtinyurl);
		$('wap_longurl').update(location.href+'wap_login.php?u='+PhoneBook.Owner.uid);
		$('wap_pin').value=PhoneBook.Owner.WAPpin;
		PhoneBook.UI.showModalDialog('dialog_mobile');
	},
	dialog_close:function() {
		PhoneBook.UI.hideModalDialog('dialog_mobile');
	},
	get_tinyurl:function() {
		$('wap_tinyurl').update('正在申请，请稍候...');
		PhoneBook.req('WAPtinyurl',null,function(re){
			var u=re.responseJSON.WAPtinyurl;
			$('wap_tinyurl').update(u);
			PhoneBook.Owner.WAPtinyurl=u;
		});
	},
	SavePIN:function() {
		var pin=$F('wap_pin');
		PhoneBook.req('WAPpin',{pin:pin},function(){alert('手机登录密码已经更新');});
		PhoneBook.Owner.WAPpin=pin;
	}
};

//数据备份
PhoneBook.DataBackup={
	//显示数据备份界面
	dialog:function() {
		PhoneBook.UI.showModalDialog('dialog_backup');
	},
	dialog_close:function() {
		PhoneBook.UI.hideModalDialog('dialog_backup');
	}
};
