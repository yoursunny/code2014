//电话号码解析器
//2007-09-01建立，2008-02-10更新
//yoursunny.com
//require prototype.js
//适合于上海

//new PhoneParser('021-54740000');
//查看对象属性获得号码信息

var PhoneParser=Class.create();
Object.extend(PhoneParser,{
	version:'2008-02-10',//版本
	QueryServer:null,//查询服务器URI
	//号码类型常量
	Unknown:0,//未知
	Fixed:1,//固定电话
	Mobile:2,//移动电话(包括上海小灵通)
	Urgent:3,//紧急电话
	Service:4,//服务电话
	//号码所属通讯公司常量
	//Unknown:0,//未知
	Telecom:1,//电信
	CNC:2,//网通
	CRC:3,//铁通
	CMCC:4,//移动
	Unicom:5,//联通
	Satcom:6,//卫通
	//移动电话网络类型常量
	//Unknown:0,//未知
	GSM:1,
	CDMA:2,
	PHS:3,
	Satellite:4,//卫星网络
	//是否本地常量
	NeedQuery:-1,//需要服务端查询
	//Unknown:0,//未知
	Local:1,//本地
	NotLocal:2//外地
});
PhoneParser.prototype={
	initialize:function(n) {
		this.number=n;
		//含字母的号码转成数字
		{
			var nn='';
			var letter2digit=['','','abc','def','ghi','jkl','mno','pqrs','tuv','wxyz'];
			for (var i=0;i<n.length;++i)
			{
				var c=n.substr(i,1).toLowerCase();
				for (var j=0;j<10;++j)
				{
					if (letter2digit[j].indexOf(c)>=0) c=j;
				}
				nn+=c;
			}
			n=nn;
		}
		//解析号码形式
		var m;
		if ((m=/^(\d+)-(\d+)-(\d+)-(\d+)$/.exec(n))!=null)//86-21-5474-0000形式
		{
			this.country=m[1];
			this.area=m[2];
			this.num=''+m[3]+m[4];
		}
		else if ((m=/^(\d+)-(\d+)-(\d+)$/.exec(n))!=null)//021-5474-0000形式
		{
			this.area=m[1];
			this.num=''+m[2]+m[3];
		}
		else if ((m=/^(\d+)-(\d{5,})$/.exec(n))!=null)//021-54740000形式
		{
			this.area=m[1];
			this.num=m[2];
		}
		else if ((m=/^\+(\d+)\((\d+)\)(\d+)$/.exec(n))!=null)//+86(021)54740000形式
		{
			this.country=m[1];
			this.area=m[2];
			this.num=m[3];
		}
		else if ((m=/^\((\d+)\)(\d+)$/.exec(n))!=null)//(021)54740000形式
		{
			this.area=m[1];
			this.num=m[2];
		}
		else if ((m=/^\((\d+)\)(\d+)-(\d+)$/.exec(n))!=null)//(021)5474-0000形式
		{
			this.area=m[1];
			this.num=''+m[2]+m[3];
		}
		else if ((m=/^(\d+)-(\d+)$/.exec(n))!=null)//5474-0000形式
		{
			this.num=''+m[1]+m[2];
		}
		else if (/^((021|008621)?[19]\d+)|(\d{8,})$/.test(n))//00862154740000,02154740000,54740000形式
		{
			if (n.startsWith('00'))
			{
				//国外电话，不再识别
				this.domestic=false;
				return;
			}
			else if (n.startsWith('0'))
			{
				switch (n.substr(1,1))
				{
					case '1': case '2':
						this.area=n.substr(0,3);
						this.num=n.substr(3);
						break;
					default:
						this.area=n.substr(0,4);
						this.num=n.substr(4);
						break;
				}
			}
			else
			{
				this.num=n;
			}
		}
		else
		{
			this.valid=false;
			return;
		}
		if (this.num==null)
		{
			this.valid=false;
			return;
		}
		if (this.country.startsWith('00')) this.country=this.country.substr(2);
		if (this.country!='86')
		{
			this.domestic=false;
			return;
		}
		if (this.area.startsWith('0')) this.area=this.area.substr(1);
		if (this.area.startsWith('1')&&!this.area.startsWith('10'))
		{
			this.num=''+this.area+this.num;
			this.area='';
		}
		if (this.area!='')
		{
			this.area='0'+this.area;
			if (this.area=='021')
			{
				this.local=PhoneParser.Local;
				this.location='上海';
			}
			else
			{
				this.local=PhoneParser.NotLocal;
			}
		}
		if (/^(13\d|15[078936])\d{8}$/.test(this.num))//手机
		{
			this.area='';
			this.type=PhoneParser.Mobile;
			this.local=PhoneParser.NeedQuery;
			if (/^(13[56789]\d|15[0789]\d|134[^9]\d)\d{7}$/.test(this.num))
			{
				this.company=PhoneParser.CMCC;
				this.network=PhoneParser.GSM;
			}
			else if (/^(13[0123]|15[36])\d{8}$/.test(this.num))
			{
				this.company=PhoneParser.Unicom;
				this.network=this.num.substr(2,1)=='3'?PhoneParser.CDMA:PhoneParser.GSM;
			}
			else if (/^1349\d{7}$/.test(this.num))
			{
				this.company=PhoneParser.Satcom;
				this.network=PhoneParser.Satellite;
			}
			return;
		}
		if (this.local==PhoneParser.Local && /^2\d{7}$/.test(this.num))//上海小灵通
		{
			this.type=PhoneParser.Mobile;
			this.company=PhoneParser.Telecom;
			this.network=PhoneParser.PHS;
			return;
		}
		if (['110','112','119','120','122'].include(this.num))//紧急电话
		{
			this.type=PhoneParser.Urgent;
			return;
		}
		if (/^(1\d+)|(9\d{4})$/.test(this.num))//1开头，及9开头5位服务电话
		{
			this.type=PhoneParser.Service;
			return;
		}
		if (/^\d{8}$/.test(this.num))//8位号码
		{
			this.type=PhoneParser.Fixed;
			if (this.num.startsWith('61'))
			{
				this.company=PhoneParser.CNC;
			}
			else if (this.num.startsWith('51'))
			{
				this.company=PhoneParser.CRC;
			}
			else
			{
				this.company=PhoneParser.Telecom;
			}
			return;
		}
	},
	number:null,//原始号码
	valid:true,//号码有效
	type:PhoneParser.Unknown,//号码类型
	company:PhoneParser.Unknown,//号码所属通讯公司
	network:PhoneParser.Unknown,//移动电话网络类型
	local:PhoneParser.Unknown,//是否本地
	location:null,//号码归属地，null表示需要服务端查询
	domestic:true,//是否本国
	country:'86',//国家代码
	area:'021',//地区代码
	num:null,//本地号码
	query:function(cb) {//服务端查询
		if (PhoneParser.QueryServer==null) return;
		new Ajax.Request(PhoneParser.QueryServer,{method:'get',parameters:{n:this.number},onComplete:this.queryResult.bind(this,cb)});
	},
	queryResult:function(cb,transport) {
		var r=transport.responseText.evalJSON();
		Object.extend(this,r);
		if (typeof cb=='function') cb();
	}
};