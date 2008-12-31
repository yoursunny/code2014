WebSite.SetLicense(WebSite.LICENSE_RESERVE);
function feedsky_get(u)
{
	new Insertion.After('footer','<iframe src="/lib/feedsky'+u+'.htm" width="0" height="0" scrolling="no" frameborder="0" marginheight="0" marginwidth="0" border="0"></iframe>');
}
function feedsky_to_list(feed,list_id,n,delicious)
{
	var list_dl=$(list_id);
	if (!list_dl) return;
	if (!feed) return;
	var b='';
	for (var i=0;i<n;++i)
	{
		if (feed.items.length>i)
		{
			var it=feed.items[i];
			var date=new Date(it.pubDate);
			if (delicious) b+='<dt><a href="'+it.link+'" title="'+date.getFullYear().toPaddedString(4)+'-'+(date.getMonth()+1).toPaddedString(2)+'-'+date.getDate().toPaddedString(2)+' '+date.getHours().toPaddedString(2)+':'+date.getMinutes().toPaddedString(2)+'">'+it.title+'</a></dt><dd>'+(it.description?it.description:'&nbsp;')+'</dd>\n';
			else b+='<li><a href="'+it.link+'" title="'+date.getFullYear().toPaddedString(4)+'-'+(date.getMonth()+1).toPaddedString(2)+'-'+date.getDate().toPaddedString(2)+' '+date.getHours().toPaddedString(2)+':'+date.getMinutes().toPaddedString(2)+'">'+it.title+'</a></li>\n';
		}
	}
	list_dl.update(b);
}