<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:pb="http://www.65536.cn/work/2008/PhoneBook/ns/0001">
<xsl:output method="xml" omit-xml-declaration="yes"/>

<xsl:template match="/">
<xsl:apply-templates select="pb:PhoneBook"/>
</xsl:template>

<xsl:template match="pb:PhoneBook">
<p>查询到<xsl:value-of select="count(pb:Person)"/>位联系人</p>
<xsl:apply-templates select="pb:Person"/>
</xsl:template>

<xsl:template match="pb:Person">
<p>
<b><xsl:value-of select="pb:Name"/></b>,<xsl:value-of select="pb:Company"/><br/>
<xsl:apply-templates select="pb:Phone"/>
<xsl:apply-templates select="pb:Address"/>
<i><xsl:value-of select="pb:Notes"/></i>
</p>
</xsl:template>

<xsl:template match="pb:Phone|pb:Address">
<xsl:value-of select="."/>
(<xsl:value-of select="@type"/>)
<br/>
</xsl:template>

</xsl:stylesheet>