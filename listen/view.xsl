<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
	<xsl:output method="html" indent="yes" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN"/>
	<xsl:variable name="title" select="/rss/channel/title"/>
	<xsl:variable name="feedUrl" select="/rss/channel/atom:link[@ref='self']/@href" xmlns:atom="http://www.w3.org/2005/Atom"/>
	<xsl:variable name="srclink" select="/rss/channel/link"/>
	<xsl:template match="/">
		<xsl:element name="html">
			<head>
				<title>

					<xsl:value-of select="$title"/> - powered by FeedSky
				</title>
				<link rel="stylesheet" href="http://feed.feedsky.com/css/podcast.css" type="text/css"/>
				<link rel="alternate" type="application/rss+xml" title="RSS" href="{$feedUrl}"/>
				<xsl:element name="script">
					<xsl:attribute name="type">text/javascript</xsl:attribute>
					<xsl:attribute name="src">http://feed.feedsky.com/js/xsl.js</xsl:attribute>
				</xsl:element>

				<xsl:element name="script">
					<xsl:attribute name="type">text/javascript</xsl:attribute>
					<xsl:attribute name="src">http://feed.feedsky.com/js/tip.js</xsl:attribute>
				</xsl:element>
				<xsl:element name="script">
					<xsl:attribute name="type">text/javascript</xsl:attribute>
					<xsl:attribute name="src">http://feed.feedsky.com/js/common.js</xsl:attribute>

				</xsl:element>
				<xsl:element name="base">
					<xsl:attribute name="href"><xsl:value-of select="$srclink"/></xsl:attribute>
				</xsl:element>
			</head>
			<xsl:apply-templates select="rss/channel"/>
		</xsl:element>
	</xsl:template>
	<xsl:template match="channel">

		<body onload="go_decoding();" id="podcast">
			<DIV id="TipLayer" style="visibility:hidden;position:absolute;z-index:1000;top:-100;text-align:left;font-size:12px;"/>
			<div id="cometestme" style="display:none;">
				<xsl:text disable-output-escaping="yes">&amp;amp;</xsl:text>
			</div>
			<div id="bodycontainer">
				<xsl:apply-templates select="image"/>
				<div id="bannerblock">

					<img src="http://feed.feedsky.com/images/podcast.gif" id="feedimage"/>
					<h1>
						<a href="{link}">
							<xsl:value-of select="$title"/>
						</a>
					</h1>
					<h2>这是一个由Feedsky提供支持的播客（podcast）Feed</h2>
					<p style="clear:both"/>

				</div>
				<div id="subscribe">
					<div id="subscribe_in">
						<div id="subscribe-options">
							<div id="subscribe-options_in">
								<h3>马上订阅!</h3>
								<h4>通过在线阅读器直接订阅：</h4>
								<div>

									<a href="http://www.zhuaxia.com/add_channel.php?url={$feedUrl}">
										<img src="http://www.zhuaxia.com/images/subscribe_12.gif" border="0" alt="订阅到抓虾"/>
									</a>
									<a href="http://www.bloglines.com/sub/{$feedUrl}">
										<img src="http://feeds.feedsky.com/images/sub_modern5.gif" alt="bloglines" border="0"/>
									</a>
									<a href="http://fusion.google.com/add?feedurl={$feedUrl}">
										<img src="http://feeds.feedsky.com/images/add.gif" alt="google reader" border="0"/>
									</a>

									<a href="http://rss.gougou.com/find_rss.jsp?url={$feedUrl}">
										<img src="http://feed.feedsky.com/images/add_gougou.gif" alt="gougou" border="0"/>
									</a>
									<a href="http://add.my.yahoo.com/rss?url={$feedUrl}">
										<img src="http://feeds.feedsky.com/images/addtomyyahoo4.gif" alt="my yahoo" border="0"/>
									</a>
									<a href="http://www.rojo.com/add-subscription?resource={$feedUrl}">
										<img src="http://feeds.feedsky.com/images/add-to-rojo.gif" alt="Rojo" border="0"/>
									</a>

								</div>
								<p>
									<a href="{$feedUrl}/~pcast">添加到iTunes/Yahoo! Music Engine</a>
								</p>
								<h4>复制下列地址到你所使用的Podcast阅读器中直接订阅</h4>
								<p class="item">
									<form>
										<input type="text" value="{$feedUrl}" onFocus="select();" style="width:300px;border:1px solid #999;padding:2px;"/>

									</form>
									<br/>
								</p>
							</div>
						</div>
						<p class="about">播客（podcast）是通过RSS方式发布多媒体文件，如音频或视频的一种方式，订阅用户可以使用支持播客订阅的RSS阅读工具来订阅，只要内容源有了更新，订阅者可以自动获取这些更新，Feedsky使这个过程变得更加方便、迅速。</p>
						<p style="clear:both"/>
					</div>

				</div>
				<div id="bodyblock">
					<xsl:apply-templates select="item"/>
				</div>
				<script language="javascript" type="text/javascript">autoSetImgSize("bodyblock","98%");</script>
			</div>
		</body>
	</xsl:template>

	<xsl:template match="item">
		<xsl:if test="position() = 1">
			<h3 xmlns="http://www.w3.org/1999/xhtml" id="currentFeedContent">当前Feed内容</h3>
		</xsl:if>
		<ul xmlns="http://www.w3.org/1999/xhtml">
			<li class="regularitem">
				<h4 class="itemtitle">
					<a href="{link}">

						<xsl:value-of select="title"/>
					</a>
				</h4>
				<h5 class="itemposttime">
					<span>发布时间：</span>
					<xsl:value-of select="pubDate"/>
				</h5>
				<xsl:if test="count(child::enclosure)=1">

					<xsl:choose>
						<xsl:when test="translate(substring(child::enclosure/@url,string-length(enclosure/@url)-3),'ABCDEFGHIJKLMNOPQRSTUVWXYZ','abcdefghijklmnopqrstuvwxyz')='.mp3'">
							<object type="application/x-shockwave-flash" data="http://feed.feedsky.com/js/fs_player0.2.swf?src={enclosure/@url}" height="25" width="250">
   <param name="movie" value="http://feed.feedsky.com/js/fs_player0.2.swf?src={enclosure/@url}" />
   <param name="quality" value="high" />
   It seems that you do not have a Flash Plugin. Please install the latest <a href="http://www.macromedia.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash">Flash Player</a>.
  </object><a href="{child::enclosure/@url}">下载</a>
						</xsl:when>

						<xsl:otherwise>
							<p class="podcastmediaenclosure">
								<a href="{child::enclosure/@url}">下载</a>
							</p>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:if>
				<div class="itemcontent" name="decodeable">

					<xsl:call-template name="outputContent"/>
				</div>
			</li>
		</ul>
	</xsl:template>
	<xsl:template match="image">
		<xsl:element name="img" namespace="http://www.w3.org/1999/xhtml">
			<xsl:attribute name="src"><xsl:value-of select="url"/></xsl:attribute>
			<xsl:attribute name="alt">

				Link to <xsl:value-of select="title"/></xsl:attribute>
			<xsl:attribute name="id">feedimage</xsl:attribute>
		</xsl:element>
		<xsl:text> </xsl:text>
	</xsl:template>
	<xsl:template match="feedsky:browserFriendly" xmlns:feedsky="http://namespace.org/feedsky/ext/1.0">
		<p id="ownerblurb" xmlns="http://www.w3.org/1999/xhtml">

			<em>A message from the feed publisher:</em>
			<xsl:text> </xsl:text>
			<xsl:apply-templates/>
		</p>
	</xsl:template>
	<xsl:template name="outputContent">
		<xsl:choose>
			<xsl:when test="xhtml:body" xmlns:xhtml="http://www.w3.org/1999/xhtml">

				<xsl:copy-of select="xhtml:body/*"/>
			</xsl:when>
			<xsl:when test="xhtml:div" xmlns:xhtml="http://www.w3.org/1999/xhtml">
				<xsl:copy-of select="xhtml:div"/>
			</xsl:when>
			<xsl:when test="content:encoded" xmlns:content="http://purl.org/rss/1.0/modules/content/">
				<xsl:value-of select="content:encoded" disable-output-escaping="yes"/>
			</xsl:when>
			<xsl:when test="description">

				<xsl:value-of select="description" disable-output-escaping="yes"/>
			</xsl:when>
		</xsl:choose>
	</xsl:template>
</xsl:stylesheet>
