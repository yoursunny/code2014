//load m.js before loading this file

/*
network,company,name,card //网络,公司,品牌和名称,卡代码
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
*/

mobiles=37;
P=new Array(mobiles);
mname=new Array(mobiles);

function calcall(signal,hidename,needwap,needgprs,needcdma1x) {
var i=1;

mm=new mobile('g','移动','全球通入网','gotone',   60,50,0,-1,    0,0,0,0,        0,0,0,0,0,
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','88套餐88元','gotone',   60,88,0,-1,    380,0,0,0,        0,0,0,0,0,
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','88套餐188元','gotone',    60,188,0,-1,    900,0,0,0,        0,0,0,0,0,
0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    
0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    0.35,0.35,0.35,0.35,    
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','88套餐288元','gotone',    60,288,0,-1,    1540,0,0,0,        0,0,0,0,0,
0.3,0.3,0.3,0.3,   0.3,0.3,0.3,0.3,   0.3,0.3,0.3,0.3,   0.3,0.3,0.3,0.3,   
0.3,0.3,0.3,0.3,   0.3,0.3,0.3,0.3,   0.3,0.3,0.3,0.3,   0.3,0.3,0.3,0.3,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','88套餐388元','gotone',    60,388,0,-1,    2400,0,0,0,        0,0,0,0,0,
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','88套餐488元','gotone',    60,488,0,-1,    3600,0,0,0,        0,0,0,0,0,
0.15,0.15,0.15,0.15,    0.15,0.15,0.15,0.15,    0.15,0.15,0.15,0.15,    0.15,0.15,0.15,0.15,    
0.15,0.15,0.15,0.15,    0.15,0.15,0.15,0.15,    0.15,0.15,0.15,0.15,    0.15,0.15,0.15,0.15,    
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','88套餐588元','gotone',    60,588,0,-1,    5000,0,0,0,        0,0,0,0,0,
0.1,0.1,0.1,0.1,   0.1,0.1,0.1,0.1,   0.1,0.1,0.1,0.1,   0.1,0.1,0.1,0.1,   
0.1,0.1,0.1,0.1,   0.1,0.1,0.1,0.1,   0.1,0.1,0.1,0.1,   0.1,0.1,0.1,0.1,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    10,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','易通卡', 'gotone',  60,0,0,200,    0,0,0,0,        0,0,0,0,0,
0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   
0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','神州行','szx',   60,0,0,200,    0,0,0,0,        0,0,0,0,0,
0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   
0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   
0,0,0,0,0,    0.15,0.2,0.2,   0,0,0,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','动感地带10元聊天','mzone',   60,10,0,200,    0,20,0,0,        0,40,0,0,0,
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
1,1,1,1,0.5,    0.1,0.15,0.1,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','动感地带20元聊天','mzone',   60,20,0,200,    0,20,0,0,        0,150,0,0,0,
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
1,1,1,1,0.5,    0.1,0.15,0.1,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','动感地带20元短信','mzone',   60,20,0,200,    0,0,0,0,        0,260,0,0,0,
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
1,1,1,1,0.5,    0.1,0.15,0.1,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','动感地带20元GPRS','mzone',   60,20,0,200,    0,0,0,0,        0,100,0,0,5000,
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
1,1,1,1,0.5,    0.1,0.15,0.1,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','动感地带30元短信','mzone',   60,30,0,200,    0,0,0,0,        0,420,0,0,0,
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
1,1,1,1,0.5,    0.1,0.15,0.1,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','动感地带40元短信','mzone',   60,20,0,200,    0,0,0,0,        0,620,0,0,0,
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
0.3,0.3,0.3,0.3,   0.6,0.6,0.6,0.6,   0.6,0.6,0.6,0.6,   0.2,0.2,0.2,0.2,   
1,1,1,1,0.5,    0.1,0.15,0.1,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','神州行加加卡爱说话','szxjj',   60,0,50,200,    0,0,0,0,        0,0,0,0,0,
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','神州行加加卡加加套餐28','szxjj',   60,28,0,200,    80,0,0,0,        0,0,0,0,0,
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','神州行加加卡加加套餐35','szxjj',   60,35,0,200,    100,0,0,0,        0,0,0,0,0,
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','神州行加加卡加加套餐50','szxjj',   60,50,0,200,    150,0,0,0,        0,0,0,0,0,
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0,0,0,0,0,    0.1,0.15,0.15,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','移动','神州行大众卡','szxdz',   60,10,0,200,    0,0,0,0,        0,0,0,0,0,
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   0.6,0.4,0.2,0.2,   
0,0,0,0,0,    0.15,0.2,0.2,   0.15,0.15,0.03,0,    0,
'咨询电话1860');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','如意通','ryt',   30,0,0,200,    0,0,0,0,        0,0,0,0,0,
0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    
0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    
5,0.52,0.52,0.52,0.52,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','如意通+便宜更多','ryt',   30,9,0,200,    0,0,0,0,        0,0,0,0,0,
0.54,0.3,0.3,0.3,    0.54,0.3,0.3,0.3,    0.54,0.3,0.3,0.3,    0.54,0.3,0.3,0.3,    
0.54,0.3,0.3,0.3,    0.54,0.3,0.3,0.3,    0.54,0.3,0.3,0.3,    0.54,0.3,0.3,0.3,    
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','如意通+畅听更多','ryt',   30,26,0,200,    0,0,0,0,        0,0,0,0,0,
0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    
0,0,0,0,       0,0,0,0,       0.54,0.54,0.54,0.54,       0,0,0,0,       
5,0.52,0.52,0.52,0.52,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','如意通大众卡','ryt',   30,12,0,200,    0,0,0,0,        0,0,0,0,0,
0.15,0.15,0.15,0.15,   0.15,0.15,0.15,0.15,   0.54,0.54,0.54,0.54,     0.15,0.15,0.15,0.15,   
0.15,0.15,0.15,0.15,   0.15,0.15,0.15,0.15,   0.54,0.54,0.54,0.54,     0.15,0.15,0.15,0.15,   
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','世纪通','sjt',   50,50,0,600,    0,0,0,0,        0,0,0,0,0,
0.36,0.36,0.36,0.36,    0.36,0.36,0.36,0.36,    0.36,0.36,0.36,0.36,    0.36,0.36,0.36,0.36,    
0.36,0.36,0.36,0.36,    0.36,0.36,0.36,0.36,    0.36,0.36,0.36,0.36,    0.36,0.36,0.36,0.36,    
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','新世纪通无月租','xsjt',   50,0,0,600,    0,0,0,0,        0,0,0,0,0,
0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    
0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    0.54,0.54,0.54,0.54,    
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','新世纪通超值专案','xsjt',   50,50,0,600,    200,0,0,0,        0,0,0,0,0,
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','新世纪通轻松专案','xsjt',   50,100,0,600,    500,0,0,0,        0,0,0,0,0,
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','新世纪通商务专案','xsjt',   50,200,0,600,    1000,0,0,0,        0,0,0,0,0,
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','新世纪通VIP专案','xsjt',   50,300,0,600,    2500,0,0,0,        0,0,0,0,0,
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','100卡','cu100200',   50,100,0,0,    500,0,0,0,        0,0,0,0,0,
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    10,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','200卡','cu100200',   50,200,0,0,    1000,0,0,0,        0,0,0,0,0,
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   0.28,0.28,0.28,0.28,   
5,0.89,0.89,0.89,0.89,    0.1,0.1,0.1,   0.1,0.05,0,0,    10,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','58系列58元','cu58',   50,58,0,0,    145,0,0,0,        0,0,0,0,0,
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    10,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','58系列158元','cu58',   50,158,0,0,    270,0,0,0,        0,0,0,0,0,
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    10,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('g','联通','58系列258元','cu58',   50,258,0,0,    520,0,0,0,        0,0,0,0,0,
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    10,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('c','联通','如意133畅听卡','ry133',   100,0,0,800,    0,0,0,0,        0,0,0,0,0,
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
5,0.78,0.83,0.80,0.78,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('c','联通','如意133短信卡','ry133',   100,0,0,800,    0,0,0,0,        250,0,0,0,0,
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
0,0,0,0,       0,0,0,0,       0,0,0,0,       0,0,0,0,       
5,0.78,0.83,0.80,0.78,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('c','联通','新世纪133入网套餐','xsj133',   100,0,0,300,    0,0,0,0,        0,0,0,0,0,
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('c','联通','新世纪133包月卡','xsj133',   100,30,0,300,    110,0,0,0,        0,0,0,0,0,
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
0.36,0.36,0.36,0.36,     0.18,0.18,0.18,0.18,    0.54,0.54,0.54,0.54,     0.36,0.36,0.36,0.36,   
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('c','联通','心意通','xyt',   100,39.6,0,300,    99,0,0,0,        0,0,0,0,0,
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   
0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   0.4,0.4,0.4,0.4,   
0,0,0,0,0,    0.1,0.1,0.1,   0.1,0.05,0,0,    0,
'咨询电话1001');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('p','电信','小灵通预付费','xlt',   0,9,0,100,    0,0,0,0,        0,0,0,0,0,
0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    0.2,0.2,0.2,0.2,    
0,0,0,0,   0,0,0,0,   0,0,0,0,   0,0,0,0,   
0,0,0,0,0,    0.08,0.08,0.08,   0,0,0,0,    0,
'咨询电话10000');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

mm=new mobile('p','电信','小灵通后付费','xlt',   0,30,0,0,    0,0,0,0,        0,0,0,0,0,
0.22,0,0,0.11,     0.22,0,0,0.11,     0.22,0,0,0.11,     0.22,0,0,0.11,     
0,0,0,0,   0,0,0,0,   0,0,0,0,   0,0,0,0,   
0,0,0,0,0,    0.08,0.08,0.08,   0,0,0,0,    0,
'咨询电话10000');
if ( (signal && (mm.network=='p')) || 
(hidename && (mm.rechargeyear==-1)) || 
(needwap && (mm.wap==0)) || 
(needgprs && (mm.gprs==0)) || 
(needcdma1x && (mm.cdma1x==0)) ) {
P[i]=Number.MAX_VALUE//一票否决
} else {
P[i]=price(mm);mname[i++]=(mm.company+'&nbsp;'+mm.name+'&nbsp;'+mm.miscinfo);
}

}//end function calcall