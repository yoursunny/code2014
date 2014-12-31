W.ready(function(){

var bookmarklet="<a class='bookmarklet' href=\"javascript:(function(){var s=document.createElement('script');s.type='text/javascript';s.src='http://yoursunny.com/work/backuplet/s/';s.charset='utf-8';document.body.appendChild(s);})();\" onclick='return false;' style='display:block; width:300px; height:40px; line-height:40px; background:#ff6; color:#00f; text-decoration:none; text-align:center;'>backuplet</a>";
var UA=navigator.userAgent;

var step1h='添加backuplet书签：<br>'+bookmarklet;
if (/Gecko/i.test(UA)) step1h+='右击上面的链接，选择Bookmark This Link，点击Save按钮。'
else if (/MSIE/i.test(UA)) step1h+='右击上面的链接，选择Add to Favorites，若弹出Security Alert则点击Yes允许，点击OK按钮。';
else step1h+='将上面的链接添加为浏览器书签。';
step1h+='（若你已经添加过backuplet书签，无需重新添加）';

var step1s=W.getTagClass('li','step1');
for (var i=0;i<step1s.length;++i) {
	step1s[i].innerHTML=step1h;
}

var step3h='点击backuplet书签：<br>';
if (/Gecko/i.test(UA)) step3h+='在Bookmarks菜单，选择backuplet菜单项。'
else if (/MSIE/i.test(UA)) step3h+='在Favorites菜单，选择backuplet菜单项。';
else step3h+='在浏览器书签菜单或书签工具栏，找到并点击backuplet项目。';

var step3s=W.getTagClass('li','step3');
for (var i=0;i<step3s.length;++i) {
	step3s[i].innerHTML=step3h;
}


});