<?php
$pn=sprintf('%02d',intval($_GET['nb']));
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<HTML>
<HEAD>
<META http-equiv="content-type" content="text/html;charset=utf-8">
<TITLE>第<?php echo $pn; ?>页 - 阳光男孩的高中化学笔记本</TITLE>
</HEAD>
<BODY>
<FORM action="" method="get" onsubmit="pn=Number(this.nb.value);if(pn<1||pn>73){alert('页码范围1-73');return false;}">
<P>
《<A href="./">化学</A>》
笔记本<INPUT name="nb" value="<?php echo $pn; ?>" size="2"><INPUT type="submit" value="转到页码">
<?php if ($pn>1) { ?><A href="?nb=<?php printf('%02d',$pn-1); ?>">上一页</A> <?php } ?>
<?php if ($pn<73) { ?><A href="?nb=<?php printf('%02d',$pn+1); ?>">下一页</A> <?php } ?>
</P>
</FORM>
<P>快速跳转：
<A href="?nb=01">高一第一章</A>
<A href="?nb=09">高一第五章</A>
<A href="?nb=20">高二第八章</A>
<A href="?nb=35">高二第十章</A>
<A href="?nb=51">高三第一章</A>
<A href="?nb=60">高三第六章</A>
</P>
<DIV><IMG src="notebook/<?php echo $pn; ?>.gif" alt="第<?php echo $pn; ?>页"></DIV>
<SCRIPT type="text/javascript" src="/lib/10/track.js"></SCRIPT>
</BODY>
</HTML>