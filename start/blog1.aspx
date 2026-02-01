<%@ Page Language="C#" Inherits="yoursunny.PageGenerator.BasePage" %>
<%@ Import Namespace="yoursunny.PageGenerator" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Drawing" %>
<script runat="server">
    protected void Page_Load(Object sender, EventArgs e)
    {
        if (!String.IsNullOrEmpty(Request.QueryString["site"])) ParseConf();
        if (String.IsNullOrEmpty(Request.PathInfo))
        {
            UImode();
        }
        else
        {
            ATOMmode();
        }
    }
    private void CheckBlogUser(SitePage page)
    {
        string uid = GetCookie(UserAuth.UidCookieKey);
        if (page == null && (conf_admin.Contains(uid) || conf_user.Contains(uid))) return;
        if (conf_admin.Contains(uid)) return;
        if (conf_user.Contains(uid) && page.UserCreate == uid) return;
        Config.ShowError("你没有权限进行该操作");
    }
    private string conf_tpl;//配置：模板
    private StringCollection conf_user;//配置：普通用户
    private StringCollection conf_admin;//配置：管理用户
    private int conf_priv;//配置：外部授权
    private StringCollection conf_list;//配置：自动加入列表
    private Dictionary<string, StringCollection> conf_listc;//配置：勾选加入列表
    private int conf_namepattern;//配置：命名方式
    private int conf_imgwidth;//配置：最大图片宽度
    private int conf_imgheight;//配置：最大图片高度
    private void ParseConf()//解析配置文件
    {
        if (conf_user != null) return;//已经执行过
        conf_user = new StringCollection();
        conf_admin = new StringCollection();
        conf_list = new StringCollection();
        conf_listc = new Dictionary<string, StringCollection>();
        conf_namepattern = 1;
        conf_imgwidth = 640;
        conf_imgheight = 480;
        string[] l = LoadTextArray("/conf/blog.site." + site.ConfigFile + ".axd");
        for (int i = 0; i < l.Length; ++i)
        {
            if (!String.IsNullOrEmpty(l[i]) && l[i].Contains("=") && !l[i].StartsWith("#"))
            {
                int pos = l[i].IndexOf("=");
                string k = l[i].Substring(0, pos);
                string v = l[i].Substring(pos + 1);
                switch (k)
                {
                    case "tpl":
                        conf_tpl = v;
                        break;
                    case "user":
                        conf_user.Add(v);
                        break;
                    case "admin":
                        conf_admin.Add(v);
                        break;
                    case "priv":
                        conf_priv = int.Parse(v);
                        break;
                    case "list":
                        conf_list.Add(v);
                        break;
                    case "list?":
                        {
                            string[] s = v.Split('|');
                            if (s.Length < 2) break;
                            StringCollection lists = new StringCollection();
                            for (int j = 1; j < s.Length; ++j)
                                lists.Add(s[j]);
                            conf_listc.Add(s[0], lists);
                        }
                        break;
                    case "namepattern":
                        conf_namepattern = int.Parse(v);
                        break;
                    case "imgwidth":
                        conf_imgwidth = int.Parse(v);
                        break;
                    case "imgheigth":
                        conf_imgheight = int.Parse(v);
                        break;
                }
            }
        }
    }
    private void UImode()//交互式模式
    {
        CheckUser(true);
        if (Request.RequestType == "POST")
        {
            if (site == null) Config.ShowError("未指定站点");
            switch (GetForm("a"))
            {
                case "del":
                    DoDel();
                    break;
                case "post":
                    DoPost(false);
                    break;
                case "edit":
                    DoPost(true);
                    break;
                case "tag":
                    DoTag();
                    break;
            }
        }
        else
        {
            StringBuilder b = LoadText("/start/blog.htm");
            b.Replace("%sites%", GetSites());
            if (String.IsNullOrEmpty(Request.QueryString["site"]))
            {
                b.Replace("%site%", "");
                b.Replace("%siteRoot%", "");
                b.Replace("%editUrl%", "");
                b.Replace("%tagUrl%", "");
                b.Replace("%listc%", "");
                Response.Write(b.ToString());
                return;
            }
            b.Replace("%site%", Config.JSencode(site.ConfigFile));
            b.Replace("%siteRoot%", Config.JSencode(site.GetConfig().Url));
            switch (Request.QueryString["a"])
            {
                case "modify":
                    ShowModify(b);
                    break;
                case "tag":
                    ShowTag(b);
                    break;
                default:
                    ShowPost(b);
                    break;
            }
            Response.Write(b.ToString());
        }
    }
    private NameValueCollection authorDef;//默认作者姓名
    private void LoadAuthorDef()//读入默认作者姓名
    {
        if (authorDef != null) return;
        authorDef = new NameValueCollection();
        string[] l = LoadTextArray("/conf/blog.authordef.axd");
        for (int i = 0; i < l.Length; ++i)
        {
            if (!String.IsNullOrEmpty(l[i]) && l[i].Contains("=") && !l[i].StartsWith("#"))
            {
                int pos = l[i].IndexOf("=");
                string k = l[i].Substring(0, pos);
                string v = l[i].Substring(pos + 1);
                authorDef.Add(k, v);
            }
        }
    }
    private void SaveAuthorDef()//保存默认作者姓名
    {
        StreamWriter w = new StreamWriter(Config.MapPath("/conf/blog.authordef.axd"));
        foreach (string k in authorDef)
        {
            w.WriteLine(k + "=" + authorDef[k]);
        }
        w.Flush(); w.Close(); w.Dispose();
    }
    private string GetSites()//获得站点列表
    {
        string[] f = Directory.GetFiles(Config.MapPath("/conf"), "blog.site.*.axd");
        StringBuilder b = new StringBuilder();
        for (int i = 0; i < f.Length; ++i)
        {
            string n = Path.GetFileName(f[i]).Remove(0, 10);
            n = n.Remove(n.Length - 4);
            b.AppendLine("'" + Config.JSencode(n) + "',");
        }
        return b.ToString();
    }
    private bool IsBlogPath(string u)//检查是否符合路径命名规则
    {
        switch (conf_namepattern)
        {
            case 1:
                if (Regex.IsMatch(u, @"^/\d{3}/\d{2}\D+")) return true;
                break;
            case 2:
                if (Regex.IsMatch(u, @"^/\d{6}/\d{2}\D+")) return true;
                break;
            case 3:
                if (Regex.IsMatch(u, @"^/\d{4}/d{4}/\D+")) return true;
                break;
        }
        return false;
    }
    private void DoDel()//执行删除
    {
        path = GetForm("u");
        if (IsBlogPath(path))
        {
            page = new SitePage(site, path);
            CheckBlogUser(page);
            page.RemoveFromLists();
            site.DelDir(path);
        }
        else
        {
            Config.ShowError("该页面路径不符合命名规则，不能在博客界面删除");
        }
        AppRedirect("/start/blog.aspx?site=" + Server.UrlEncode(site.ConfigFile));
    }
    private void ShowPost(StringBuilder b)//显示发表界面
    {
        CheckBlogUser(null);
        LoadAuthorDef();
        string author = authorDef[GetCookie(UserAuth.UidCookieKey)];
        if (author == null) author = "";
        b.Replace("%editUrl%", "");
        b.Replace("%tagUrl%", "");
        b.Replace("%listc%", "");
        b.Replace("%title%", "");
        b.Replace("%author%", author);
        b.Replace("%h%", "");
    }
    private void ShowModify(StringBuilder b)//显示修改界面
    {
        if (page == null) Config.ShowError("该页面不存在");
        if (IsBlogPath(path))
        {
            CheckBlogUser(page);
            b.Replace("%editUrl%", Config.JSencode(path));
            b.Replace("%tagUrl%", "");
            b.Replace("%listc%", "");
            b.Replace("%title%", Server.HtmlEncode(page.Title));
            b.Replace("%author%", Server.HtmlEncode(page.Author));
            b.Replace("%h%", Server.HtmlEncode(page.ReadAllText("/o.blogh.txt")));
        }
        else
        {
            Config.ShowError("该页面路径不符合命名规则，不能在博客界面删除");
        }
    }
    private void DoPost(bool isEdit)//执行发布
    {
        CheckBlogUser(null);
        //保存默认作者姓名
        if (Request.Form["authordef"] == "1")
        {
            LoadAuthorDef();
            authorDef[GetCookie(UserAuth.UidCookieKey)] = GetForm("author");
            SaveAuthorDef();
        }
        //获得页面路径，新文章时创建页面
        if (!isEdit)
        {
            switch (conf_namepattern)
            {
                case 1:
                    path = "/" + DateTime.Now.ToString("yyyyMMdd").Remove(0, 3).Insert(3, "/");
                    break;
                case 2:
                    path = "/" + DateTime.Now.ToString("yyyyMMdd").Insert(6, "/");
                    break;
                case 3:
                    path = "/" + DateTime.Now.ToString("yyyyMMdd").Insert(4, "/") + "/";
                    break;
                default:
                    return;
            }
            path = DoPost_NewPath(path);
            page = SitePage.Create(site, path, conf_tpl, GetCookie(UserAuth.UidCookieKey), GetForm("title"), GetForm("author"), DateTime.Now, "");
            if (conf_priv == 0) page.Users.RemoveAt(0);
        }
        //正文部分
        page.DeletePart("blogh");
        PagePart part_h = page.CreatePart("blogh", "blog", "html");
        page.WriteAllText("/o.blogh.txt", Request.Form["h"]);
        page.WriteAllText("/s.blogh.txt", Request.Form["h"]);
        //上传部分、图片部分、下载部分
        PagePart part_u; StringBuilder u_s;
        const string ext_img = " jpg gif bmp png ";
        PagePart part_p; StringBuilder p_o; string p_o_;
        const string ext_down = " doc docx wps xls xlsx et ppt pps pptx eps pdf pub p65 txt mp3 wma wav mid asf rm ra rmvb ogg wmv smi swf flv mpg avi zip rar cab 7z ";
        PagePart part_d; StringBuilder d_o; string d_o_;
        if (isEdit && GetForm("uorig") == "1")
        {
            part_u = page.GetPart("blogu");
            u_s = new StringBuilder(page.ReadAllText("/s.blogu.txt"));
            part_p = page.GetPart("blogp");
            p_o = new StringBuilder(page.ReadAllText("/o.blogp.txt"));
            p_o.Remove(p_o.Length - 9, 9);//</ script>
            part_d = page.GetPart("blogd");
            d_o = new StringBuilder(page.ReadAllText("/o.blogd.txt"));
            d_o.Remove(d_o.Length - 9, 9);//</ script>
        }
        else
        {
            page.DeletePart("blogu");
            part_u = page.CreatePart("blogu", "blog", "anyfile");
            u_s = new StringBuilder();
            page.DeletePart("blogp");
            part_p = page.CreatePart("blogp", "blogp", "html");
            p_o = new StringBuilder("<script type='text/javascript'>\r\n");
            page.DeletePart("blogd");
            part_d = page.CreatePart("blogd", "blogd", "html");
            d_o = new StringBuilder("<script type='text/javascript'>\r\n");
        }
        for (int i = 1; i <= 8; ++i)
        {
            HttpPostedFile u = Request.Files["u" + i.ToString()];
            if (u != null && !String.IsNullOrEmpty(u.FileName) && u.ContentLength > 0)
            {
                string ext = Path.GetExtension(u.FileName).Substring(1).ToLower();
                if (ext_img.Contains(" " + ext + " "))
                {
                    DoPost_Picture(u, i, ext, part_u, u_s, part_p, p_o);
                }
                if (ext_down.Contains(" " + ext + " "))
                {
                    string filename = "blogu." + DateTime.Now.ToString("yyyyMMddHHmmss") + i.ToString() + "." + ext;
                    part_u.Attaches.Add(filename);
                    u_s.AppendLine(filename + "=" + u.FileName);
                    d_o.AppendLine("_PageGenerator_blogD('" + filename + "','" + ext + "','" + u.ContentType + "'," + u.ContentLength.ToString() + ",'" + Config.JSencode(u.FileName) + "');");
                    yoursunny.PageGenerator.Site.CopyStream(u.InputStream, page.WriteFile("/" + filename), true);
                }
            }
        }
        part_u.SaveInfo();
        page.WriteAllText("/s.blogu.txt", u_s.ToString());
        p_o.Append("</" + "script>");
        p_o_ = p_o.ToString();
        page.WriteAllText("/s.blogp.txt", p_o_);
        page.WriteAllText("/o.blogp.txt", p_o_);
        d_o.Append("</" + "script>");
        d_o_ = d_o.ToString();
        page.WriteAllText("/s.blogd.txt", d_o_);
        page.WriteAllText("/o.blogd.txt", d_o_);
        //最终输出
        page.SaveInfo();
        page.OutputHTML();
        if (isEdit) page.RemoveFromLists();
        AppRedirect("/start/blog.aspx?site=" + Server.UrlEncode(site.ConfigFile) + "&a=tag&path=" + Server.UrlEncode(path));
    }
    private string DoPost_NewPath(string path)//获得空闲目录名
    {
        string parent = path.Remove(path.LastIndexOf('/'));
        site.CreateDirs(parent + "/_PageGenerator_.txt");
        StringCollection d = site.ListDir(parent);
        const string x = "abcdefghijklmnopqrstuvwxyz";
        string prefix = "";
        string trypath = null;
        for (int j = 1000; j >= 0; --j)//最大尝试1000次
        {
            for (int i = 0; i < x.Length; ++i)
            {
                trypath = path + prefix + x[i].ToString();
                if (!d.Contains(trypath.Substring(parent.Length + 1) + "/")) return trypath;
            }
            //字符位数不够，随机产生前一位，采用更长的名字
            prefix += x[new Random().Next(0, x.Length)].ToString();
        }
        throw new PageGeneratorException("Page_Blog", "DoPost_NewPath", "无法取得空闲目录名");
    }
    private void DoPost_Picture(HttpPostedFile u, int i, string ext, PagePart part_u, StringBuilder u_s, PagePart part_p, StringBuilder p_o)
    {
        try
        {
            string filename = "blogu." + DateTime.Now.ToString("yyyyMMddHHmmss") + i.ToString() + (ext == "gif" ? ".gif" : ".jpg");
            Bitmap bmp = new Bitmap(u.InputStream);
            int width = bmp.Width;
            int height = bmp.Height;
            if (width > conf_imgwidth || height > conf_imgheight)
            {
                if (width > conf_imgwidth)
                {
                    height = Convert.ToInt32((float)height * conf_imgwidth / width);
                    width = conf_imgwidth;
                }
                if (height > conf_imgheight)
                {
                    width = Convert.ToInt32((float)width * conf_imgheight / height);
                    height = conf_imgheight;
                }
                Bitmap thumb = new Bitmap(width, height, System.Drawing.Imaging.PixelFormat.Format24bppRgb);
                Graphics g = Graphics.FromImage(thumb);
                g.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = System.Drawing.Drawing2D.PixelOffsetMode.HighQuality;
                g.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
                g.Clear(Color.White);
                g.DrawImage(bmp, new Rectangle(0, 0, width, height), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
                MemoryStream buf = new MemoryStream();
                thumb.Save(buf, ext == "gif" ? System.Drawing.Imaging.ImageFormat.Gif : System.Drawing.Imaging.ImageFormat.Jpeg);
                buf.Seek(0, SeekOrigin.Begin);
                yoursunny.PageGenerator.Site.CopyStream(buf, page.WriteFile("/" + filename), true);
                g.Dispose();
                thumb.Dispose();
            }
            else
            {
                u.InputStream.Seek(0, SeekOrigin.Begin);
                yoursunny.PageGenerator.Site.CopyStream(u.InputStream, page.WriteFile("/" + filename), true);
            }
            bmp.Dispose();
            part_u.Attaches.Add(filename);
            u_s.AppendLine(filename + "=" + u.FileName);
            p_o.AppendLine("_PageGenerator_blogP('" + filename + "'," + width.ToString() + "," + height.ToString() + ",'" + Config.JSencode(u.FileName) + "');");
        }
        catch { }
    }
    private void ShowTag(StringBuilder b)//显示Tag界面
    {
        CheckBlogUser(page);
        StringBuilder listc = new StringBuilder();
        Dictionary<string, StringCollection>.KeyCollection listc_k = conf_listc.Keys;
        foreach (string msg in listc_k)
        {
            int hash = msg.GetHashCode();
            hash = hash >= 0 ? hash : -hash;
            listc.AppendLine("{hash:'" + hash.ToString() + "',msg:'" + Config.JSencode(msg) + "'},");
        }
        b.Replace("%editUrl%", "");
        b.Replace("%tagUrl%", Config.JSencode(path));
        b.Replace("%listc%", listc.ToString());
    }
    private void DoTag()//执行Tag设置
    {
        CheckBlogUser(page);
        for (int i = 0; i < conf_list.Count; ++i)
        {
            page.AddToList(conf_list[i]);
        }
        foreach (KeyValuePair<string, StringCollection> p in conf_listc)
        {
            int hash = p.Key.GetHashCode();
            hash = hash >= 0 ? hash : -hash;
            if (Request.Form["listc" + hash.ToString()] == "1")
            {
                for (int i = 0; i < p.Value.Count; ++i)
                {
                    page.AddToList(p.Value[i]);
                }
            }
        }
        page.SaveInfo();
        AppRedirect("/start/blog.aspx?site=" + Server.UrlEncode(site.ConfigFile));
    }
    private void ATOMmode()//BloggerATOM接口自动发布模式
    {
        Config.ShowError("BloggerATOM接口自动发布功能尚未实现");
    }
</script>