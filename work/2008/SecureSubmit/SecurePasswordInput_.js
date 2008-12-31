var SecurePasswordInput_l=[];
function SecurePasswordInput_init(form_id) {
	var f=document.getElementById(form_id);
	var cid;
	while (cid=SecurePasswordInput_l.shift()) {
		var n=SecurePasswordInput_save.bind(null,cid);
		if (f.addEventListener) f.addEventListener('submit',n,false);
		else f.attachEvent('onsubmit',n);
	}
}
function SecurePasswordInput_reg(cid) {
	var o=document.getElementById(cid);
	o.u=new SecureSubmit('?SecurePasswordInput='+cid);
	o.u.prepare();
	SecurePasswordInput_l.push(cid);
}
function SecurePasswordInput_save(cid) {
	var o=document.getElementById(cid);
	o.value=DES.encrypt(o.u.key,o.value);
}
