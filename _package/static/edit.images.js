//yoursunny PageGenerator images编辑器 访问者脚本
var _PageGenerator_images_slide=new Array();
function _PageGenerator_images_slide_init(part,timer)
{
	var r=new Object();
	r.part=part;
	r.timer=timer;
	r.m=new Array();
	r.current=0;
	_PageGenerator_images_slide.push(r);
}
function _PageGenerator_images_slide_find(part)
{
	for (var i=0;i<_PageGenerator_images_slide.length;++i)
	{
		if (_PageGenerator_images_slide[i].part==part)
			return _PageGenerator_images_slide[i];
	}
	return null;
}
function _PageGenerator_images_slide_add(part,file,width,height,memo)
{
	var r=_PageGenerator_images_slide_find(part);
	if (r==null) return;
	var o=new Object();
	o.file=file;
	o.width=width;
	o.height=height;
	o.memo=memo;
	o.preload=new Image();
	o.preload.src=file;
	r.m.push(o);
}
function _PageGenerator_images_slide_tick(part)
{
	var r=_PageGenerator_images_slide_find(part);
	if (r==null) return;
	++r.current;
	if (r.current==r.m.length) r.current=0;
	var o=r.m[r.current];
	var img=document.getElementById('PageGeneratorImages_'+part+'_img');
	if (img!=null)
	{
		img.src=o.file;
		img.width=o.width;
		img.height=o.height;
		img.alt=o.memo;
	}
	var span=document.getElementById('PageGeneratorImages_'+part+'_memo');
	if (span!=null)
		span.innerHTML=o.memo;
	setTimeout('_PageGenerator_images_slide_tick(\''+part+'\')',r.timer*1000);
}
