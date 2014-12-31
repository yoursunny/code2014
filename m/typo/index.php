<?php
require_once $_SERVER["DOCUMENT_ROOT"].'/include/2011.php';
$PR->domain='yoursunny.cn';
$PR->starthtml();
$PR->head('不写错别字是一种态度','/m/typo/');
?>
<meta name="description" content="在文字交流中，请使用规范语言，避免错别字、病句。">
<?php
$PR->startbody();
$PR->header();
$PR->startcontent(PageRenderHelper::fullwidth);
?>
<h1>不写错别字是一种态度</h1>

<p>阳光男孩倡议：<br/>
在文字交流中（包括文章、作业、帖子、邮件、短信），<b>请使用规范语言，避免错别字、病句</b>。<br/>
发送含有错别字的文字内容，是不负责任的做法，是对收件人的不尊重。</p>

<?php
$PR->endcontent();
$PR->footer();
$PR->endhtml();
?>
