//首页左下角的友情链接
var FRIENDcount=1;
var FRIEND=new Array(
'http:\/\/sunnyland.1a.cn\/'
);

function showFRIEND(FRIENDid) {
document.write('<A href=\''+FRIEND[FRIENDid]+'\'><IMG src=\'images\/friend'+(FRIENDid+1)+'.gif\' border=0 width=60 height=60></A>');
}

showFRIEND(Math.floor(Math.random()*FRIENDcount));