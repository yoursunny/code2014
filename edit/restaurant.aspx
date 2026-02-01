<%@ Page Language="C#" Inherits="yoursunny.PageGenerator.EditPage" %>
<%@ Import Namespace="yoursunny.PageGenerator" %>
<%@ Import Namespace="System.IO" %>
<%@ Import Namespace="System.Collections.Generic" %>
<%@ Import Namespace="System.Drawing" %>
<script runat="server">
    //餐馆编辑器，数据格式为CSV
    struct Restaurant : IComparable<Restaurant>
    {
        public string road;
        public string name;
        public string tel;
        public bool telbook;
        public bool telsend;
        public string memo;
        public string photo;
        public int CompareTo(Restaurant other)
        {
            int c = this.road.CompareTo(other.road);
            if (c != 0) return c;
            c = this.name.CompareTo(other.name);
            return c;
        }
        public static Restaurant Parse(string s)
        {
            string[] n = s.Split(',');
            if (n.Length != 7) throw new PageGeneratorException("/edit/restaurant.aspx Restaurant", "Parse", "错误的CSV数据行参数个数");
            Restaurant r = new Restaurant();
            r.road = n[0];
            r.name = n[1];
            r.tel = n[2];
            r.telbook = n[3] == "1";
            r.telsend = n[4] == "1";
            r.memo = n[5];
            r.photo = n[6];
            return r;
        }
        public override string ToString()
        {
            return road.Replace(",", "") + "," + name.Replace(",", "") + "," + tel.Replace(",", "") + "," + (telbook ? "1" : "0") + "," + (telsend ? "1" : "0") + "," + memo.Replace(",", "") + "," + photo;
        }
        public string ToJsString()
        {
            return "{road:'" + road + "',name:'" + name + "',tel:'" + tel + "',telbook:" + (telbook ? "true" : "false") + ",telsend:" + (telsend ? "true" : "false") + ",memo:'" + memo + "',photo:'" + photo + "'},";
        }
    }
    List<Restaurant> D;
    StringBuilder errors;
    protected void Page_Load(Object sender, EventArgs e)
    {
        D = new List<Restaurant>();
        if (Request.RequestType == "POST")
        {
            errors = new StringBuilder();
            int count = Int32.Parse(GetForm("count"));
            for (int i = 0; i < count; ++i) Receive(i.ToString());
            for (int i = 0; i < 5; ++i) Receive("_" + i.ToString());
            D.Sort();
            WritePart(SaveData(), Output());
            part.SaveInfo();
            string error = errors.ToString();
            if (String.IsNullOrEmpty(error)) DoneRedirect();
            else Response.Write("<html><head><title>保存结果</title></head><body>保存过程中发现以下餐馆的图片有错误：<br/>" + error + "这些图片将不被保存<br/><a href='javascript:location=document.referrer'>返回上一页</a></body></html>");
        }
        else
        {
            LoadData();
            StringBuilder d = new StringBuilder();
            for (int i = 0; i < D.Count; ++i)
                d.AppendLine(D[i].ToJsString());
            StringBuilder b = LoadText("/edit/restaurant.htm");
            b.Replace("%title%", GoodTitle);
            b.Replace("%D%", d.ToString());
            b.Replace("%baseUrl%", site.GetUrl(path) + "/");
            Response.Write(b.ToString());
        }
    }
    private void LoadData()
    {
        StringReader r = new StringReader(ReadPart());
        r.ReadLine();//跳过CSV标题行
        string l;
        while ((l = r.ReadLine()) != null)
        {
            D.Add(Restaurant.Parse(l));
        }
    }
    private void Receive(string i)
    {
        if (String.IsNullOrEmpty(Request.Form["name" + i])) return;
        Restaurant r = new Restaurant();
        r.road = Request.Form["road" + i];
        r.name = GetForm("name" + i);
        r.tel = GetForm("tel" + i);
        r.telbook = Request.Form["telbook" + i] == "1";
        r.telsend = Request.Form["telsend" + i] == "1";
        r.memo = Request.Form["memo" + i];
        string oldPhoto = Request.Form["photo" + i];
        r.photo = oldPhoto;
        string newPhoto = null;
        HttpPostedFile u = Request.Files["u" + i];
        if (u != null && u.ContentLength > 0 && !String.IsNullOrEmpty(u.FileName))
        {
            if (u.ContentLength < 150 * 1024)
            {
                if (u.ContentType == "image/jpeg" || u.ContentType == "image/pjpeg")
                {
                    MemoryStream buffer = new MemoryStream();
                    yoursunny.PageGenerator.Site.CopyStream(u.InputStream, buffer, false);
                    buffer.Seek(0, SeekOrigin.Begin);
                    Bitmap bmp = new Bitmap(buffer);
                    if ((bmp.Width == 600 && bmp.Height <= 450) || (bmp.Height == 450 && bmp.Width <= 600))
                    {
                        newPhoto = "restaurant." + partName + "." + DateTime.Now.ToString("yyyyMMddHHmmss") + new Random().Next().ToString() + ".jpg";
                        yoursunny.PageGenerator.Site.CopyStream(u.InputStream, page.WriteFile("/" + newPhoto), true);
                        part.Attaches.Add(newPhoto);
                    }
                    else
                    {
                        buffer.Close(); buffer.Dispose();
                        errors.Append(r.name + " 照片必须宽600像素或高450像素，请使用转换！<br/>");
                    }
                    bmp.Dispose();
                }
                else
                {
                    errors.Append(r.name + " 照片必须为JPG格式<br/>");
                }
            }
            else
            {
                errors.Append(r.name + " 照片不得大于150KB，请使用65的图像质量");
            }
        }
        if (Request.Form["photoremove" + i] == "1" || !String.IsNullOrEmpty(newPhoto))
        {
            if (!String.IsNullOrEmpty(oldPhoto))
            {
                page.DelFile("/" + oldPhoto);
                part.Attaches.Remove(oldPhoto);
            }
            r.photo = String.IsNullOrEmpty(newPhoto) ? "" : newPhoto;
        }
        D.Add(r);
    }
    private string SaveData()
    {
        StringBuilder b = new StringBuilder();
        b.AppendLine("路段,名称,电话,订座,外卖,备注,照片");
        for (int i = 0; i < D.Count; ++i)
            b.AppendLine(D[i].ToString());
        return b.ToString();
    }
    private string Output()
    {
        StringBuilder b = new StringBuilder();
        b.AppendLine("<head><link rel='stylesheet' href='_root_/_PageGenerator_/edit.restaurant.css' type='text/css' /><script type='text/javascript' src='_root_/_PageGenerator_/edit.restaurant.js'></" + "script></head>");
        string lastRoad = null;
        b.AppendLine("<div class='restaurantIndex'>");
        for (int i = 0; i < D.Count; ++i)
        {
            if (lastRoad != D[i].road)
            {
                lastRoad = D[i].road;
                b.AppendLine("<a href='#" + partName + lastRoad.GetHashCode().ToString() + "'>" + Server.HtmlEncode(lastRoad) + "</a>");
            }
        }
        b.AppendLine("</div><div class='restaurant'>");
        lastRoad = null;
        for (int i = 0; i < D.Count; ++i)
        {
            if (lastRoad != D[i].road)
            {
                if (lastRoad != null) b.AppendLine("</tbody></table>");
                lastRoad = D[i].road;
                b.AppendLine("<h2 id='" + partName + lastRoad.GetHashCode().ToString() + "'>" + Server.HtmlEncode(lastRoad) + "</h2>");
                b.AppendLine("<table id='" + partName + lastRoad.GetHashCode().ToString() + "table' border='1'><thead><tr><th>名称</th><th>电话</th><th>备注</th></tr></thead><tbody>");
            }
            bool hasPhoto = !String.IsNullOrEmpty(D[i].photo);
            b.AppendLine("<tr id='" + partName + i.ToString() + "'>");
            b.Append("<td class='restaurantName'" + (hasPhoto ? " onmouseover=\"javascript:_PageGenerator_restaurant_ShowPhoto('" + partName + "'," + i.ToString() + ",'" + Server.HtmlEncode(D[i].name) + "','" + D[i].photo + "')\"" : "") + ">");
            b.Append(hasPhoto ? "<img src='_root_/_PageGenerator_/edit.restaurant.gif' width='20' height='20' style='float:right;' />" : "");
            b.Append(Server.HtmlEncode(D[i].name));
            b.AppendLine("</td>");
            b.AppendLine("<td class='restaurantTel'>" + Server.HtmlEncode(D[i].tel) + (D[i].telbook || D[i].telsend ? "(" : "") + (D[i].telbook ? "订座" : "") + (D[i].telbook && D[i].telsend ? "," : "") + (D[i].telsend ? "外卖" : "") + (D[i].telbook || D[i].telsend ? ")" : "") + "</td>");
            b.AppendLine("<td class='restaurantMemo'>" + (String.IsNullOrEmpty(D[i].memo) ? "&nbsp;" : Server.HtmlEncode(D[i].memo)) + "</td>");
            b.AppendLine("</tr>");
            if (hasPhoto)
                b.AppendLine("<tr id='" + partName + i.ToString() + "row' class='restaurantPhoto' style='display:none;'><td colspan='3'><div id='" + partName + i.ToString() + "photo'></div></td></tr>");
        }
        if (lastRoad != null) b.AppendLine("</tbody></table>");
        b.AppendLine("</div>");
        return b.ToString();
    }
</script>