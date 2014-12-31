//SecureSubmit is a JavaScript module along with server-side scripts to submit passwords or other data over HTTP securely. DES encryption is applied to the data when posting to the server, and the key for DES is generated with Diffie-Hellman algorithm. 
// http://www.65536.cn/work/2008/SecureSubmit/
// http://www.codeplex.com/SecureSubmit
/*
--------USAGE--------
var u=new SecureSubmit('handler.aspx');
u.prepare(function(){
	u.save('your password',function(){
		alert('done');
	})
});

--------FUNCTIONS--------
CONSTRUCTOR     new SecureSubmit(server_url)
Key Generation  .prepare(callback)
Data Submit     .save(data,callback)
                Unicode is not supported. If you need to submit Unicode string, please use ".save(BASE64.encode(data),callback)" and do BASE64 decode on server side

--------SERVER API--------
Key Generation  POST a=genkey,g,n,X          returns JSON: {Y}
Data Submit     POST a=save,v=encrypted_data
*/
var SecureSubmit=Class.create({
	initialize:function(server) {
		this.server=server;
	},
	HEXdigits:['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'],
	rand:function() {
		//generate a 64-bit random number
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
		setMaxDigits(8);
		var compare_result;
		//generate random 1<g<n
		do {
			do {//g>1
				this.g=this.rand();
			} while (biCompare(this.g,bigOne)<=0);
			do {//n>1
				this.n=this.rand();
			} while (biCompare(this.n,bigOne)<=0);
			compare_result=biCompare(this.g,this.n);
		} while (compare_result==0);//until g!=n
		if (compare_result > 0)//if g>n, swap them
			{ var tmp=this.n; this.n=this.g; this.g=tmp; }
		this.x=this.rand();//generated x, x is secret
		this.X=biPowMod(this.g,this.x,this.n);//X=g^x mod n
		new Ajax.Request(this.server,{parameters:{a:'genkey',g:biToHex(this.g),n:biToHex(this.n),X:biToHex(this.X)},onComplete:this.prepare1.bind(this,cb)});
	},
	prepare1:function(cb,resp) {
		var o=resp.responseJSON;
		if (!o) {
			var m=resp.responseText.match(/Y:\'([0-9a-f]+)\'/);
			if (!m) return;
			o={Y:m[1]};
		}
		//the server should generate y, y is secret; Y=g^y mod n
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