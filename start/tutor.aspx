<%@ Page Language="C#" Inherits="yoursunny.PageGenerator.BasePage" %>
<%@ Import Namespace="yoursunny.PageGenerator" %>
<script runat="server">
    protected void Page_Load(Object sender, EventArgs e)
    {
        site = new Site("tutor");
        CheckUser();
        if (Request.RequestType == "POST")
        {
            string action = GetForm("a");
            if (action != "create") path = GetForm("path");
            switch (action)
            {
                case "create": a_create(); break;
                case "editbasic":
                    list_remove().Save();
                    AppRedirect("/start/modify.aspx?site=tutor&path=" + Server.UrlEncode(GetForm("path")));
                    break;
                case "editcontent":
                    list_remove().Save();
                    AppRedirect("/edit/word.aspx?site=tutor&path=" + Server.UrlEncode(GetForm("path")) + "&part=w");
                    break;
                case "output":
                    AppRedirect("/start/output.aspx?site=tutor&path=" + Server.UrlEncode(GetForm("path")) + "&go=1");
                    break;
                case "addlist": a_addlist(); break;
                case "delete": a_delete(); break;
            }
        }
        else
        {
            WriteForm(Request.QueryString["path"]);
        }
    }
    private void WriteForm(string path)
    {
        StringBuilder b = LoadText("/start/tutor.htm");
        b.Replace("%path%", path);
        Response.Write(b.ToString());
    }
    private void a_create()
    {
        int column = Int32.Parse(GetForm("column"));
        string title = GetForm("title");
        string author = GetForm("author");
        path = "/" + column + "/" + DateTime.Now.ToString("yyyyMMdd") + "_" + (new Random().Next(0, 1000000).ToString());
        page = SitePage.Create(site, path, "tutor", GetCookie("uid"), title, author, DateTime.Now, "");
        page.CreatePart("w", "p", "word");
        page.SaveInfo();
        AppRedirect("/start/tutor.aspx?path=" + Server.UrlEncode(path));
    }
    private void a_addlist()
    {
        ListFile l = list_remove();
        ListEntry e = new ListEntry();
        path = GetForm("path");
        e.link = page.Path;
        e.title = page.Title;
        e.author = page.Author;
        l.date = e.date = DateTime.Now;
        e.summary = String.Empty;
        l.Entry.Add(e);
        l.Save();
        AppRedirect("/start/tutor.aspx?path=" + Server.UrlEncode(path));
    }
    private void a_delete()
    {
        path = GetForm("path");
        list_remove().Save();
        site.DelDir(path);
        AppRedirect("/start/tutor.aspx");
    }
    private ListFile list_remove()//获取列表对象且删除当前页面
    {
        ListFile l = new ListFile(site, "tutor");
        l.RemoveEntry(path);
        return l;
    }
</script>