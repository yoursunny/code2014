var query=location.href.toQueryParams();
var w=query.w;
var container=$(document.body);
var dimensions=document.viewport.getDimensions();
container.setStyle({background:'#102439',position:'relative',fontSize:'9px',width:''+dimensions.width+'px',height:''+dimensions.height+'px'});
function pickColor() {
	var colors=['#d6d7d6','#7b3c4a','#efdf29','#dec37b'];
	return colors[(Math.random()*colors.length).floor()];
}
var pos=[];
function isInside(rect,x,y) {
	return (rect.left<=x) && (rect.right>=x) && (rect.top<=y) && (rect.bottom>=y);
}
function countOverlaps(r) {
	var overlap=0;
	pos.each(function(rect){
		if (isInside(rect,r.left,r.top) || isInside(rect,r.right,r.top) || isInside(rect,r.left,r.bottom) || isInside(rect,r.right,r.bottom)) ++overlap;
	});
	return overlap;
}
function pickPosition(width,height) {
	var s=$R(0,20).collect(function() {
		var p={left:(Math.random()*(dimensions.width-width)).floor(),top:(Math.random()*(dimensions.height-height)).floor()};
		var rect={top:p.top,right:p.left+width,bottom:p.top+height,left:p.left};
		var overlap=countOverlaps(rect);
		return [p,rect,overlap];
	}).sortBy(function(e){return e[2]}).first();
	pos.push(s[1]);
	return s[0];
}
function showPhrase(lang,t) {
	var d=$(document.createElement('div'));
	d.update(t).setStyle({color:pickColor(),position:'absolute'}).writeAttribute('title',lang);
	container.appendChild(d);
	(function(){
		var size=d.getDimensions();
		var p=pickPosition(size.width,size.height);
		d.setStyle({left:''+p.left+'px',top:''+p.top+'px'});
	}).defer();
}
var LANG=$H({ALBANIAN:'sq',ARABIC:'ar',BULGARIAN:'bg',CATALAN:'ca',CHINESE:'zh',CHINESE_SIMPLIFIED:'zh-CN',CHINESE_TRADITIONAL:'zh-TW',CROATIAN:'hr',CZECH:'cs',DANISH:'da',DUTCH:'nl',ENGLISH:'en',ESTONIAN:'et',FILIPINO:'tl',FINNISH:'fi',FRENCH:'fr',GALICIAN:'gl',GERMAN:'de',GREEK:'el',HEBREW:'iw',HINDI:'hi',HUNGARIAN:'hu',INDONESIAN:'id',ITALIAN:'it',JAPANESE:'ja',KOREAN:'ko',LATVIAN:'lv',LITHUANIAN:'lt',MALTESE:'mt',NORWEGIAN:'no',POLISH:'pl',PORTUGUESE:'pt-PT',ROMANIAN:'ro',RUSSIAN:'ru',SERBIAN:'sr',SLOVAK:'sk',SLOVENIAN:'sl',SPANISH:'es',SWEDISH:'sv',TAGALOG:'tl',THAI:'th',TURKISH:'tr',UKRAINIAN:'uk',VIETNAMESE:'vi'});var i=0;
function cb(lang,r) {
	var langCode=LANG.get(lang),t=r.translatedText;
	showPhrase(lang.split('_').invoke('capitalize').join(' '),t);
	if (langCode=='zh-CN') {
		new Ajax.Request('pinyin.php',{method:'get',parameters:{q:t},onComplete:function(resp){
			showPhrase('汉语拼音',resp.responseText);
		}});
	}
}
if (w) {
	LANG.each(function(L){
		var lang=L.key,langCode=L.value;
		var src='http://ajax.googleapis.com/ajax/services/language/translate?v=1.0&q='+encodeURIComponent(w)+'&langpair=%7C'+langCode+'&callback=cb&context='+lang;
		WebSite.loadJS(null,src);
	});
}