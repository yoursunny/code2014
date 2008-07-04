<?php
require_once 'common.php';
header('Content-Type: text/vnd.wap.wml');
echo '<'.'?xml version="1.0"?>'; ?>

<!DOCTYPE wml PUBLIC "-//WAPFORUM//DTD WML 1.1//EN" "http://www.wapforum.org/DTD/wml_1.1.xml">
<wml>
<?php if (!WapCheckLogin()) {
?>

<card title="个人电话本 - 请登录" ontimer="wap_login.php?<?php echo WapLoginString(); ?>">
<timer value="30"/>
<p>
<b>个人电话本</b><br/>
你的登录信息不正确，请<a href="wap_login.php?<?php echo WapLoginString(); ?>">重新登录</a>
(3秒后自动返回)
</p>
</card>
<?php } else { ?>

<card title="个人电话本">
<do type="accept" label="查询"><go href="wap_main.php?<?php echo WapLoginString(); ?>&amp;q=$(q)"/></do>
<p><b>个人电话本</b></p>
<?php
$q=@$_GET['q'];
if ($q) {
	@SelectPerson('pb:Person/*[contains(text(),\''.$q.'\')]/parent::pb:Person');
	if (class_exists('XSLTProcessor')) {
		$xslt=new XSLTProcessor();
		$xslt_stylesheet=new DOMDocument();
		$xslt_stylesheet->load('wap_query.xsl');
		$xslt->importStyleSheet($xslt_stylesheet);
		echo $xslt->transformToXML($x);
	} else {
		//用于不支持XSL扩展的服务器
		$r=$x->documentElement;
		if ($r->hasChildNodes()) {
			$p=$r->firstChild;
			do {
				$q=$xp->query('pb:Name',$p);
				echo '<p><b>'.htmlspecialchars(tn($q->item(0))).'</b><br/>';
				$q=$xp->query('pb:Phone',$p);
				for ($i=0;$i<$q->length;++$i)
					echo htmlspecialchars(tn($q->item($i))).'('.htmlspecialchars($q->item($i)->getAttribute('type')).')<br/>';
				$q=$xp->query('pb:Address',$p);
				for ($i=0;$i<$q->length;++$i)
					echo htmlspecialchars(tn($q->item($i))).'('.htmlspecialchars($q->item($i)->getAttribute('type')).')<br/>';
				echo '</p>';
			} while (NULL!==($p=$p->nextSibling));
		}
	}
}
?>
<p>
查询<input name="q" size="16"/>
</p>
</card>
<?php } ?>

</wml>