//load cookie.js and const.js and math.js before loading this file

function mobile(
network,company,name,card, //网络,公司,品牌和名称,卡代码
cardfee,monthly,monthlow,rechargeyear, //卡费,月租,月最低消费(不设最低消费的置0),每年需要充值(后付费卡置-1)
inctelany,inctelcmcc,inctelunicom,inctelfixed, //月租含通话分钟数(可打任何电话),(移动手机),(联通手机),(固定电话)
incsmsany,incsmscmcc,incsmsunicom,incsmsweb,incgprskb, //月租短信数(发到任何地方),(移动手机),(联通手机),(网站)
dialcmcc1,dialcmcc2,dialcmcc3,dialcmcc4, //呼出到移动手机的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
dialunicom1,dialunicom2,dialunicom3,dialunicom4, //呼出到联通手机的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
dialfixed1,dialfixed2,dialfixed3,dialfixed4, //呼出到固定电话的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
dialmzone1,dialmzone2,dialmzone3,dialmzone4, //呼出到动感地带的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
recvcmcc1,recvcmcc2,recvcmcc3,recvcmcc4, //接听移动手机来电的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
recvunicom1,recvunicom2,recvunicom3,recvunicom4, //接听联通手机来电的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
recvfixed1,recvfixed2,recvfixed3,recvfixed4, //接听固定电话来电的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
recvmzone1,recvmzone2,recvmzone3,recvmzone4, //接听动感地带来电的话费(第1分钟),(第2分钟),(第3分钟),(第3分钟以后)
relativecount,relativecmcc,relativeunicom,relativefixed,relativemzone, //可以设置亲友号码数,移动手机亲友折扣,联通手机亲友折扣,固定电话亲友折扣,动感地带亲友折扣
smscmcc,smsunicom,smsweb, //到移动手机短信价,到联通手机短信价,到网站短信价
wap,wapdiscount,gprs,cdma1x, //WAP价(每分钟),夜间WAP价,GPRS价(每KB),CDMA1X价(每KB) (如不支持某方式上网,置0)
calleridshow, //要来电显示需加月租(如赠送,置0)
miscinfo //备注文本
) {
this.network=network;this.company=company;this.name=name;this.card=card;
this.cardfee=cardfee;this.monthly=monthly;this.monthlow=monthlow;this.rechargeyear=rechargeyear;
this.inctelany=inctelany;this.inctelcmcc=inctelcmcc;this.inctelunicom=inctelunicom;this.inctelfixed=inctelfixed;
this.incsmsany=incsmsany;this.incsmscmcc=incsmscmcc;this.incsmsunicom=incsmsunicom;this.incsmsweb=incsmsweb;this.incgprskb=incgprskb;
this.dialcmcc1=dialcmcc1;this.dialcmcc2=dialcmcc2;this.dialcmcc3=dialcmcc3;this.dialcmcc4=dialcmcc4;
this.dialunicom1=dialunicom1;this.dialunicom2=dialunicom2;this.dialunicom3=dialunicom3;this.dialunicom4=dialunicom4;
this.dialfixed1=dialfixed1;this.dialfixed2=dialfixed2;this.dialfixed3=dialfixed3;this.dialfixed4=dialfixed4;
this.dialmzone1=dialmzone1;this.dialmzone2=dialmzone2;this.dialmzone3=dialmzone3;this.dialmzone4=dialmzone4;
this.recvcmcc1=recvcmcc1;this.recvcmcc2=recvcmcc2;this.recvcmcc3=recvcmcc3;this.recvcmcc4=recvcmcc4;
this.recvunicom1=recvunicom1;this.recvunicom2=recvunicom2;this.recvunicom3=recvunicom3;this.recvunicom4=recvunicom4;
this.recvfixed1=recvfixed1;this.recvfixed2=recvfixed2;this.recvfixed3=recvfixed3;this.recvfixed4=recvfixed4;
this.recvmzone1=recvmzone1;this.recvmzone2=recvmzone2;this.recvmzone3=recvmzone3;this.recvmzone4=recvmzone4;
this.relativecount=relativecount;this.relativecmcc=relativecmcc;this.relativeunicom=relativeunicom;this.relativefixed=relativefixed;this.relativemzone=relativemzone;
this.smscmcc=smscmcc;this.smsunicom=smsunicom;this.smsweb=smsweb;
this.wap=wap;this.wapdiscount=wapdiscount;
this.gprs=gprs;this.cdma1x=cdma1x;
this.calleridshow=calleridshow;
this.miscinfo=miscinfo;
}


function price(mm) {

//分摊手机价格
gotphone=(getCookie('havephone').indexOf(mm.network)!=-1);
if (gotphone) { //如果已经拥有符合要求的手机，那就不计算手机价格。
phone=0;
} else {
switch (mm.network) { //如果还没有符合要求的手机，就将手机价格分摊到每个月。
case 'g':phone=dpA(phonegsm,phonelife,minterest);break;
case 'c':phone=dpA(phonecdma,phonelife,minterest);break;
case 'p':phone=dpA(phonephs,phonelife,minterest);break;
}
}

//分摊SIM卡/UIM卡费用和换号损失
gotcard=(getCookie('havecard')==mm.card);
chgloss=Number(getCookie('chgloss'));
if (gotcard) { //如果原来拥有的卡号可以直接转换成新的套餐，就不需要购买新卡。
card=0;
} else { //如果换卡，分摊到每个月。
card=dpA(mm.cardfee+chgloss,cardlife,minterest);
}

//月租费
monthly=mm.monthly;

//电话费
//通话第1,2,3,3以上分钟的时间百分比
minute=getCookie('minute').split(',');
minute1=Number(minute[1])/100;
minute2=Number(minute[2])/100;
minute3=Number(minute[3])/100;
minute4=1-minute1-minute2-minute3;

//和各公司用户通话量的百分比
contacts=getCookie('contacts').split(',');
contactcmcc=Number(contacts[1])/100;
contactunicom=Number(contacts[2])/100;
contactfixed=Number(contacts[3])/100;
contactmzone=Number(getCookie('contactmzone'))/100*contactcmcc;
contactcmcc1=contactcmcc-contactmzone;//表示除动感地带外的移动客户
totaldial=Number(getCookie('totaldial'));
totalrecv=Number(getCookie('totalrecv'));

//超出包月分钟数的通话时间
exceeddial=totaldial-mm.inctelany*totaldial/(totaldial+totalrecv);if (exceeddial<0) {exceeddial=0};//超出的总呼出时间=最大值(总呼出时间-包月不分网别通话时间*呼出时间占通话时间比值,0)
exceedrecv=totalrecv-mm.inctelany*totalrecv/(totaldial+totalrecv);if (exceedrecv<0) {exceedrecv=0};//超出的总接听时间=最大值(总呼出时间-包月不分网别通话时间*接听时间占通话时间比值,0)
exceeddialcmcc=exceeddial*contactcmcc-mm.inctelcmcc*totaldial/(totaldial+totalrecv);if (exceeddialcmcc<0) {exceeddialcmcc=0};//超出的移动呼出时间=最大值(超出的总呼出时间*联系移动百分比-包月移动网通话时间*呼出时间占通话时间比值,0)
exceedrecvcmcc=exceedrecv*contactcmcc-mm.inctelcmcc*totalrecv/(totaldial+totalrecv);if (exceeddialcmcc<0) {exceeddialcmcc=0};//移动接听
exceeddialunicom=exceeddial*contactunicom-mm.inctelunicom*totaldial/(totaldial+totalrecv);if (exceeddialunicom<0) {exceeddialunicom=0};//联通
exceedrecvunicom=exceedrecv*contactunicom-mm.inctelunicom*totalrecv/(totaldial+totalrecv);if (exceeddialunicom<0) {exceeddialunicom=0};
exceeddialfixed=exceeddial*contactfixed-mm.inctelfixed*totaldial/(totaldial+totalrecv);if (exceeddialfixed<0) {exceeddialfixed=0};//固定和小灵通
exceedrecvfixed=exceedrecv*contactfixed-mm.inctelfixed*totalrecv/(totaldial+totalrecv);if (exceeddialfixed<0) {exceeddialfixed=0};
exceeddialmzone=exceeddialcmcc*contactmzone/contactcmcc;//超出的动感地带呼出时间=超出的移动呼出时间*动感地带占移动比值
exceedrecvmzone=exceedrecvcmcc*contactmzone/contactcmcc;
exceeddialcmcc1=exceeddialcmcc*contactcmcc1/contactcmcc;//超出的非动感地带的移动客户呼出时间=超出的移动呼出时间*非动感地带占移动比值
exceedrecvcmcc1=exceedrecvcmcc*contactcmcc1/contactcmcc;

//计算对个通信公司用户的呼出、接听费用，暂不考虑通信优惠
cmccdial=mm.dialcmcc1*exceeddialcmcc1*minute1
+mm.dialcmcc2*exceeddialcmcc1*minute2
+mm.dialcmcc3*exceeddialcmcc1*minute3
+mm.dialcmcc4*exceeddialcmcc1*minute4;
//非动感地带的移动客户呼出费用=非动感地带的移动客户呼出第1分钟资费*超出的非动感地带的移动客户呼出时间*第1分钟占通话分钟数的比值+非动感地带的移动客户呼出第2分钟资费*超出的非动感地带的移动客户呼出时间*第2分钟占通话分钟数的比值+非动感地带的移动客户呼出第3分钟资费*超出的非动感地带的移动客户呼出时间*第3分钟占通话分钟数的比值+非动感地带的移动客户呼出第3分钟以上资费*超出的非动感地带的移动客户呼出时间*第3分钟以上占通话分钟数的比值
unicomdial=mm.dialunicom1*exceeddialunicom*minute1
+mm.dialunicom2*exceeddialunicom*minute2
+mm.dialunicom3*exceeddialunicom*minute3
+mm.dialunicom4*exceeddialunicom*minute4;
fixeddial=mm.dialfixed1*exceeddialfixed*minute1
+mm.dialfixed2*exceeddialfixed*minute2
+mm.dialfixed3*exceeddialfixed*minute3
+mm.dialfixed4*exceeddialfixed*minute4;
mzonedial=mm.dialmzone1*exceeddialmzone*minute1
+mm.dialmzone2*exceeddialmzone*minute2
+mm.dialmzone3*exceeddialmzone*minute3
+mm.dialmzone4*exceeddialmzone*minute4;
cmccrecv=mm.recvcmcc1*exceedrecvcmcc1*minute1
+mm.recvcmcc2*exceedrecvcmcc1*minute2
+mm.recvcmcc3*exceedrecvcmcc1*minute3
+mm.recvcmcc4*exceedrecvcmcc1*minute4;
unicomrecv=mm.recvunicom1*exceedrecvunicom*minute1
+mm.recvunicom2*exceedrecvunicom*minute2
+mm.recvunicom3*exceedrecvunicom*minute3
+mm.recvunicom4*exceedrecvunicom*minute4;
fixedrecv=mm.recvfixed1*exceedrecvfixed*minute1
+mm.recvfixed2*exceedrecvfixed*minute2
+mm.recvfixed3*exceedrecvfixed*minute3
+mm.recvfixed4*exceedrecvfixed*minute4;
mzonerecv=mm.recvmzone1*exceedrecvmzone*minute1
+mm.recvmzone2*exceedrecvmzone*minute2
+mm.recvmzone3*exceedrecvmzone*minute3
+mm.recvmzone4*exceedrecvmzone*minute4;

//亲友通讯优惠，在原已计算的价格基础上下浮
relative1=Number(getCookie('relative1'))/100;
relative5=Number(getCookie('relative5'))/100;
relative=0;
if (mm.relativecount>=1) {relative=relative1};
if (mm.relativecount>=5) {relative=relative5};
//若原价格是p，亲友通话量占r%，折扣率为a%，则新价格是P=p(1-r%)+p*r%*a%，各通讯公司需分开计算
telephone=(cmccdial+cmccrecv)*((1-relative)+relative*mm.relativecmcc)
+(unicomdial+unicomrecv)*((1-relative)+relative*mm.relativeunicom)
+(fixeddial+fixedrecv)*((1-relative)+relative*mm.relativefixed)
+(mzonedial+mzonerecv)*((1-relative)+relative*mm.relativemzone);//最终总电话费用

//短信量
smsa=getCookie('sms').split(',');
smscmcc=Number(smsa[1]);
smsunicom=Number(smsa[2]);
smsweb=Number(smsa[3]);
//超出包月短信量的短信条数
exceedsmscmcc=smscmcc-mm.incsmscmcc-mm.incsmsany*contactcmcc/(contactcmcc+contactunicom);if (exceedsmscmcc<0) {exceedsmscmcc=0};//到移动手机的包月以外短信量=最大值(到移动短信总量-包月移动短信量-包月不分网别短信量*移动客户（含动感地带）联系量百分比,0)
exceedsmsunicom=smsunicom-mm.incsmsunicom-mm.incsmsany*contactunicom/(contactcmcc+contactunicom);if (exceedsmsunicom<0) {exceedsmsunicom=0};//联通，同上
exceedsmsweb=smsweb-mm.incsmsweb;if (exceedsmsweb<0) {exceedsmsweb=0};//到网站的包月以外短信量=最大值(到网站短信总量-包月网站短信量,0)
//最终短信费用
sms=mm.smscmcc*exceedsmscmcc+mm.smsunicom*exceedsmsunicom+mm.smsweb*exceedsmsweb;

//上网费
nettype=getCookie('nettype');
if (nettype!='n') {
nettimeday=Number(getCookie('nettimeday'));
nettimenight=Number(getCookie('nettimenight'));
netkbs=Number(getCookie('netkbs'));
}
switch (nettype) {
case 'n':internet=0;break; //不上网，当然不要钱
case 'w':internet=mm.wap*nettimeday+mm.wapdiscount*nettimenight;break; //晚上有优惠，须分开计算
case 'g':internet=mm.gprs*netkbs;break;
case 'c':internet=mm.cdma1x*netkbs;break;
}

if (getCookie('callerid')=='1') {calleridshow=mm.calleridshow} else {calleridshow=0}; //需要来电显示，而没有免费提供的，需增加价格

altogether=Math.max(mm.monthlow,mm.rechargeyear/12,phone+card+monthly+telephone+sms+internet+calleridshow);//monthlylow最低消费
return altogether;
}
