<%@ Page Language="C#" Inherits="yoursunny.PageGenerator.BasePage" %>
<%@ Import Namespace="yoursunny.PageGenerator" %>
<script runat="server">
    protected void Page_Load(Object sender, EventArgs e)
    {
        UserAuth.LoginExternal(Request.QueryString["uid"], Request.QueryString["auth"], Context);
        Response.Redirect("../start/");
    }
</script>