<?php
/* /lib/9/ == 9.js
 * /lib/9/?load=lib1,lib2,...
 * libs:
 *   web = Prototype 1.6.0.3 without Deprecated + lib9 + web9
 *   web-ext = lib9 + web9
 *   jquery = jQuery 1.3 noConflict=$j
 *   tinymce = WebSite.TinyMCE
 *   prettify = Google Code Prettify
 *   userfly = userfly.com
 *   blogger = blogger.js
 *   analytics = analytics.js
 */
header('Content-Type: text/javascript');
require_once $_SERVER["DOCUMENT_ROOT"].'/lib/9.php';
page_cache();
page_gzip();

$want=explode(',',@$_SERVER['QUERY_STRING']);
foreach ($want as $s) {
	switch ($s) {
		case 'web':
			readfile('prototype-1.6.0.3.js');
		case 'web-ext':
			readfile('lib9.js');
			readfile('web9.js');
			break;
		case 'jquery':
			readfile('jquery-1.3.1.min.js');
			break;
		case 'tinymce':
			readfile('tinymce.js');
			break;
		case 'prettify':
			readfile('prettify.js');
			readfile('prettify-ext.js');
			break;
		case 'userfly':
			readfile('userfly.js');
			break;
		case 'blogger':
			readfile('blogger.js');
			break;
		case 'analytics':
			readfile('analytics.js');
			break;
	}
	flush();
}
?>