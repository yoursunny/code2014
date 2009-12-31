var yoursunnyFlashCopy=function(t,container,image,width,height,callback){
	if (!yoursunnyFlashCopy.ready) {
		yoursunnyFlashCopy.swf='http://65536.sunny/work/2009/FlashCopy/yoursunnyFlashCopy.swf';
		yoursunnyFlashCopy.ready=function(id) {
			yoursunnyFlashCopy[id].set();
		};
		yoursunnyFlashCopy.done=function(id,t) {
			yoursunnyFlashCopy[id].done();
		};
		yoursunnyFlashCopy.prefix='yoursunnyFlashCopy_';
		yoursunnyFlashCopy.nid=0;
	}
	var id=yoursunnyFlashCopy.prefix+(++yoursunnyFlashCopy.nid);
	yoursunnyFlashCopy[id]={};
	var object=document.createElement('object');
	object.setAttribute('type','application/x-shockwave-flash');
	object.setAttribute('data',yoursunnyFlashCopy.swf);
	object.setAttribute('width',width);
	object.setAttribute('height',height);
	object.setAttribute('id',id);
	object.style.background='url('+image+')';
	var param=document.createElement('param');
	param.setAttribute('name','movie');
	param.setAttribute('value',yoursunnyFlashCopy.swf);
	object.appendChild(param);
	param=document.createElement('param');
	param.setAttribute('name','allowScriptAcess');
	param.setAttribute('value','always');
	object.appendChild(param);
	param=document.createElement('param');
	param.setAttribute('name','wmode');
	param.setAttribute('value','transparent');
	object.appendChild(param);
	param=document.createElement('param');
	param.setAttribute('name','FlashVars');
	param.setAttribute('value','id='+id);
	object.appendChild(param);
	container.appendChild(object);
	yoursunnyFlashCopy[id].set=function(){
		object.setText(t);
	};
	yoursunnyFlashCopy[id].done=function(){
		container.removeChild(object);
		if (callback) callback(t);
		delete yoursunnyFlashCopy[id];
	};
};