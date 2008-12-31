<%@ Page Language="C#" Debug="true" %>
<%@ Register TagPrefix="yoursunny" TagName="SecurePasswordInput" Src="SecurePasswordInput.ascx" %>
<script runat="server">
    protected override void OnLoad(EventArgs e)
    {
        base.OnLoad(e);
    }
    void show_Click(object sender, EventArgs e)
    {
        //in production environment, never echo back the password!
        p1.Text = a1.Password;
        p2.Text = a2.Password;
    }
</script>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <title>SecurePasswordInput demo page</title>
</head>
<body>
    <form id="f" runat="server">
    <div>
        input password1=<yoursunny:SecurePasswordInput ID="a1" CssClass="nn" runat="server" /><br />
        input password2=<yoursunny:SecurePasswordInput ID="a2" runat="server" /><br />
        <asp:Button ID="show" runat="server" Text="submit password" OnClick="show_Click" /><br />
        show password1=<asp:TextBox ID="p1" runat="server" /><br />
        show password2=<asp:TextBox ID="p2" runat="server" /><br />
    </div>
    </form>
</body>
</html>
