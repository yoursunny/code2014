var Oprice=new Array(dbcount);
var SAVE=top.frames.H.S;


function CalcM(Oid) {
var STR='<TR id=row'+Oid+'>';

var Mcard=Ocard[Oid];var Ncard=cards[Mcard];var NO=Oname[Oid];
var Mcompany=cardcompany[Mcard];var Ncompany=companies[Mcompany];
STR+='<TD>'+Ncompany+'<TD>'+Ncard+'<TD>'+NO;

var Mmonthly=Omonthly[Oid];
var Mrome1=Orome[Oid];var Midshow1=Oidshow[Oid];
var Mrome=(SAVE.rome.checked)?Mrome1:0;var Midshow=(SAVE.idshow.checked)?Midshow1:0;
var Mmonthlyfunc=Mrome+Midshow;
STR+='<TD>'+Mmonthly+'<TD>'+Mmonthlyfunc;

var Ecall1=parseInt(SAVE.callMOBILE.value);var Ecall3=parseInt(SAVE.callF.value);
var Eans1=parseInt(SAVE.ansMOBILE.value);var Eans3=parseInt(SAVE.ansF.value);
if (Mcompany==0) {//移动卡
var Esms1=parseInt(SAVE.smsCMCC.value);var Esms2=parseInt(SAVE.smsCU.value);
} else {//联通卡
var Esms2=parseInt(SAVE.smsCMCC.value);var Esms1=parseInt(SAVE.smsCU.value);
}

//处理包含通话分钟
var Mtel0i=Otel0i[Oid];var Mtel1i=Otel1i[Oid];
var Atel1=Ecall1+Eans1;
if (Atel1<=Mtel1i) {Ecall1=0;Eans1=0} else {
var Pcall1=Ecall1/Atel1;var Pans1=Eans1/Atel1;
Ecall1=parseInt(Ecall1-Pcall1*Mtel1i);Eans1=parseInt(Eans1-Pans1*Mtel1i)}
var Acall=Ecall1+Ecall3;var Aans=Eans1+Eans3;var Atel=Acall+Aans;
if (Atel<=Mtel0i) {Ecall1=0;Ecall3=0;Eans1=0;Eans3=0;} else {
Pcall1=Ecall1/Atel;var Pcall3=Ecall3/Atel;Pans1=Eans1/Atel;var Pans3=Eans3/Atel;
Ecall1=parseInt(Ecall1-Pcall1*Mtel0i);Ecall3=parseInt(Ecall3-Pcall3*Mtel0i);Eans1=parseInt(Eans1-Pans1*Mtel0i);Eans3=parseInt(Eans3-Pans3*Mtel0i)}

//处理包含短信
var Msms0i=Osms0i[Oid];var Msms1i=Osms1i[Oid];
if (Esms1<=Msms1i) {Esms1=0} else {Esms1-=Msms1i}
var Asms=Esms1+Esms2;var Psms1=Esms1/Asms;var Psms2=Esms2/Asms;
if (Asms<=Msms0i) {Esms1=0;Esms2=0;} else {
Esms1=parseInt(Esms1-Psms1*Msms0i);Esms2=parseInt(Esms2-Psms2*Msms0i)}

var Mtel=parseInt((Ecall1*Ocall1[Oid]+Ecall3*Ocall3[Oid]+Eans1*Oans1[Oid]+Eans3*Oans3[Oid])*100)/100;
var Msms=parseInt((Esms1*Osms1[Oid]+Esms2*Osms2[Oid])*100)/100;
STR+='<TD>'+Mtel+'<TD>'+Msms;

var Mprice=parseInt((Mmonthly+Mmonthlyfunc+Mtel+Msms)*100)/100;Oprice[Oid]=Mprice;
STR+='<TD>'+Mprice+'<TD><A href=# onclick=\'MoreInfo('+Oid+')\'><FONT color=#339933 style=text-decoration:none>更多信息</FONT></A><TD><SPAN id=inf'+Oid+'>&nbsp;</SPAN>';
return(STR);
}

function MoreInfo(Oid) {
var newwin=window.open('about:blank');
newwin.document.write('<HTML><HEAD><SCRIPT type=text/javascript>setTimeout(\'window.close()\',3000)</SCRIPT><TITLE>更多信息——'+Oname[Oid]+'</TITLE></HEAD><BODY>购买新卡：请到公司营业厅或代理商店。<BR>老卡切换：'+Ochg[Oid]+'。<BR>其他优惠：'+Oadd[Oid]+'。</BODY></HTML>');
}
