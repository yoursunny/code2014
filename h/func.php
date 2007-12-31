<?php
date_default_timezone_set('Asia/Shanghai');

function parseAtom($atomUri,$count,$hit)//parse ATOM or RSS feed into <dt><dd>
//$hit is currently not supported
{
	$b='';
	$r=new XMLReader();
	$r->open($atomUri);
	$n=array();//node stack
	$title=''; $date=0; $link='';
	while ($r->read() && $count>0)
	{
		switch ($r->nodeType)
		{
			case 1://XMLREADER_ELEMENT
				if (!$r->isEmptyElement) array_unshift($n,strtolower($r->name));
				if (strtolower($r->name)=='link' && $r->getAttribute('rel')=='alternate')
				{
					$link=$r->getAttribute('href');
				}
				break;
			case 15://XMLREADER_END_ELEMENT
				array_shift($n);
				if ((strtolower($r->name)=='entry' || strtolower($r->name)=='item') && $title!='' && $date!=0 && $link!='')
				{
					$b.='<dt><a href="'.$link.'">'.htmlspecialchars($title).'</a></dt>'."\r\n";
					$b.='<dd>'.date('Y-m-d H:i',$date).'</dd>'."\r\n";
					$title=''; $date=0; $link='';
					--$count;
				}
				break;
			case 3://XMLREADER_TEXT
			case 4://XMLREADER_CDATA
				if ($n[0]=='title')
				{
					$title=$r->value;
				}
				if ($n[0]=='updated' || $n[0]=='pubdate')
				{
					$date=strtotime($r->value);
				}
				if ($n[0]=='link')
				{
					$link=$r->value;
				}
				break;
		}
	}
	$r->close();
	while ($count>0)
	{
		$b.="<dt>&nbsp;</dt><dd>&nbsp;</dd>\r\n";
		--$count;
	}
	return $b;
}

function parseFeedSkyJSON($burl,$count,$hit)//parse FeedSky JSON data into <dt><dd>
//$hit is currently not supported
{
	$b='';
	$json_string=file_get_contents('http://feed.feedsky.com/'.$burl.'/json&d=off&n='.$count.'&e=utf8');
	$json_string=substr($json_string,9,strlen($json_string)-10);//remove 'var feed=' and ';'
	$json_string=str_replace(array('fs_srclink:','selflink:','title:','description:','link:','items:','categorys:','author:','pubDate:','encoding:',"'"),array('"fs_srclink":','"selflink":','"title":','"description":','"link":','"items":','"categorys":','"author":','"pubDate":','"encoding":','"'),$json_string);
	$json_data=json_decode($json_string);
	$a=$json_data->items;
	for ($i=0;$i<count($a) && $count>0;++$i,--$count)
	{
		$m=$a[$i];
		$b.='<dt><a href="'.$m->link.'">'.htmlspecialchars($m->title).'</a></dt>'."\r\n";
		$b.='<dd>'.date('Y-m-d H:i',strtotime($m->pubDate)).'</dd>'."\r\n";
	}
	while ($count>0)
	{
		$b.="<dt>&nbsp;</dt><dd>&nbsp;</dd>\r\n";
		--$count;
	}
	return $b;
}

function parseText($textUri,$count,$hit)//parse text file into <dt><dd>
/*
====text file format====
1st line: omitted
one entry each line
title<tab>MMdd<tab>description<tab>hit-counter<tab>link
*/
{
	$b='';
	$r=fopen($textUri,'r');
	fgets($r);
	while (FALSE!==($l=fgets($r)) && $count>0)
	{
		$e=explode("\t",trim($l),5);
		if (count($e)==5)
		{
			$b.='<dt><a href="'.$e[4].'"'.($e[3]=='-'||$hit===NULL?'':' onclick="h(\''.$hit.'-'.$e[3].'\')"').'>'.htmlspecialchars($e[0]).'</a>'.(strlen($e[1])==8?' '.substr($e[1],0,4).'-'.substr($e[1],4,2).'-'.substr($e[1],6,2):'').'</dt>'."\r\n";
			$b.='<dd>'.htmlspecialchars($e[2]).'</dd>'."\r\n";
			--$count;
		}
	}
	fclose($r);
	while ($count>0)
	{
		$b.="<dt>&nbsp;</dt><dd>&nbsp;</dd>\r\n";
		--$count;
	}
	return $b;
}

function randomSong()//randomly choose a song from h/music.*.txt
/*
====h/song/*.txt====
1st line: omitted
2nd line: title
3rd line: artist
5th line ~ end: lyrics, max 13 Chinese chars * 4 lines
This file must named in Alpha-Numeric and utf-8 encoding
*/
{
	$m=array();
	$dir=opendir('h/song/');
	while (FALSE!==($f=readdir($dir)))
	{
		$f=strtolower($f);
		$dot=strrpos($f,'.');
		if ($dot!==FALSE)
		{
			if (substr($f,$dot)=='.txt')
			{
				$m[]=substr($f,0,$dot);
			}
		}
	}
	closedir($dir);
	sort($m);
	if (count($m)==0) return FALSE;
	$p=$m[mt_rand(0,count($m)-1)];
	$c=fopen('h/song/'.$p.'.txt','r');
	fgets($c);
	$title=fgets($c);
	$artist=fgets($c);
	$lyric='';
	while (FALSE!==($l=fgets($c))) $lyric.=$l;
	fclose($c);
	return array('title'=>$title,'artist'=>$artist,'uri'=>'http://yoursunny.com/h/song/'.$p.'.mp3','lyric'=>$lyric);
}

function getSchedule()//get schedule and show it as <li>
/*
====h/schedule.txt====
one entry each line, first line is omitted
content can contain HTML
utf-8 encoding
*/
{
	$b='';
	$c=fopen('h/schedule.txt','r');
	fgets($c);
	while (FALSE!==($l=fgets($c)))
	{
		$l=trim($l);
		if (strlen($l)>0)
		{
			$b.='<li>'.$l.'</li>'."\r\n";
		}
	}
	fclose($c);
	return $b;
}

function getNotice()//get notice
/*
====h/notice.txt====
1st line: omitted
2nd line: date yyyy-MM-dd
3rd line ~ end: content can contain HTML
utf-8 encoding
*/
{
	$c=fopen('h/notice.txt','r');
	fgets($c);
	$date=fgets($c);
	$b='';
	while (FALSE!==($l=fgets($c)))
	{
		$b.=$l;
	}
	fclose($c);
	return array('date'=>$date,'content'=>$b);
}
?>