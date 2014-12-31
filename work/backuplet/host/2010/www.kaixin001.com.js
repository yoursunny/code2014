(function(B){
var $=B.$;//jQuery
$('#kxchat_base,#index_dropdown li,#head div.h3,#headsearchcon').css('z-index','50')

B.getMyName=function(cb){//开心网：获得“我”的姓名
	B.requestDIV('/home/',function(homepage){
		var name=homepage.find('strong.f14:first').text();
		cb(name);
	});
};

var u=location.href;
if (/home\/status\.php/.test(u)) B.load('?h=www.kaixin001.com_status');
else if (/[~!]record\//.test(u)) B.load('?h=www.kaixin001.com_record');
else if (/diary\//.test(u)) B.load('?h=www.kaixin001.com_diary');
else B.fault('backuplet支持开心网的状态、记录、日记备份，请从正确的入口进入');

})(backuplet);