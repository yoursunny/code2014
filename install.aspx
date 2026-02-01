<%@ Page Language="C#" %>
<%@ Import Namespace="ICSharpCode.SharpZipLib.Zip" %>
<%@ Import Namespace="System.IO" %>
<script runat="server">
    protected void Page_Load(Object sender, EventArgs e)
    {
        FastZip fastZip = new FastZip();
        fastZip.Password = "yoursunny.com";
        fastZip.RestoreDateTimeOnExtract = true;
        fastZip.CreateEmptyDirectories = true;
        fastZip.ExtractZip(Server.MapPath("install.zip"), Server.MapPath("./"), ".*");
        File.Delete(Server.MapPath("install.aspx"));
        File.Delete(Server.MapPath("install.zip"));
        Response.ContentType = "text/plain";
        Response.Write("PageGenerator安装成功，请阅读帮助文件");
    }
</script>