//DH密钥协商 + DES加密，安全提交类
// http://www.65536.cn/work/2008/SecureSubmit/
// http://www.codeplex.com/SecureSubmit
/*
--------使用方法--------
var u=new SecureSubmit('handler.aspx');
u.prepare(function(){
	u.save('your password',function(){
		alert('提交完毕');
	})
});

--------主要函数--------
构造函数 new SecureSubmit(服务端调用地址)
密钥协商 .prepare(回调函数)
数据提交 .save(提交内容,回调函数)
        提交内容不支持Unicode，如需提交Unicode需写成.save(BASE64.encode(提交内容),回调函数)并在服务端解码

--------服务端功能--------
密钥协商 POST a=genkey,g,n,X，返回Y
数据提交 POST a=save,v=加密后的数据
*/
var SecureSubmit=Class.create({
	//初始化，指定服务端调用地址
	initialize:function(server) {
		this.server=server;
	},
	HEXdigits:['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],
	rand:function() {
		//产生64-bit随机数
		var h='';
		for (var i=0;i<16;++i) {
			h+=this.HEXdigits[Math.floor(Math.random()*16)];
		}
		return biFromHex(h);
	},
	hex2str:function(h) {
		while (h.length<16) h='0'+h;
		var b='';
		for (var i=0;i<16;i+=2) {
			b+='%'+h.substr(i,2);
		}
		return unescape(b);
	},
	prepare:function(cb) {
		//64-bit key
		setMaxDigits(8);
		var compare_result;
		//随机产生1<g<n，不保密
		do {
			do {//g>1
				this.g=this.rand();
			} while (biCompare(this.g,bigOne)<=0);
			do {//n>1
				this.n=this.rand();
			} while (biCompare(this.n,bigOne)<=0);
			compare_result=biCompare(this.g,this.n);
		} while (compare_result==0);//直到g!=n
		if (compare_result > 0)//若g>n，交换
			{ var tmp=this.n; this.n=this.g; this.g=tmp; }
		this.x=this.rand();//随机产生x，保密
		this.X=biPowMod(this.g,this.x,this.n);//X=g^x mod n
		new Ajax.Request(this.server,{parameters:{a:'genkey',g:biToHex(this.g),n:biToHex(this.n),X:biToHex(this.X)},onComplete:this.prepare1.bind(this,cb)});
	},
	prepare1:function(cb,resp) {
		var o=resp.responseJSON;
		//服务端随机产生y，保密；Y=g^y mod n
		this.Y=biFromHex(o.Y);
		this.K=biPowMod(this.Y,this.x,this.n);//K=Y^x mod n=X^y mod n
		this.key=this.hex2str(biToHex(this.K));
		(cb||Prototype.emptyFunction)();
	},
	save:function(value,cb) {
		var v=DES.encrypt(this.key,value);
		new Ajax.Request(this.server,{parameters:{a:'save',v:v},onComplete:cb});
	}
});