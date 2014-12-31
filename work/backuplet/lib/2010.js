
B.prompt2010=function(){
	B.container.html('<p>backuplet当前站点的备份功能尚未升级到2011版，正在载入2010版以便继续备份。</p>');
	B.ui_show();
	B.ui_status('载入2010版');
	B.proceed();
};
B.load2010=function(){
	B.want2010=true;
	B.loadjs(B.base+'s/2010.php');
	B.proceed();
};

B.Q.push(['prompt2010'],['delay',1000],['load2010']);
