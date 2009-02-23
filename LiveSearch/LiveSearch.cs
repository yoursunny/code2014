using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Web;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// an example plugin which redirects search engine queries to Live Search
    /// </summary>
    [Plugin("LiveSearch", "LiveSearch", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    public class LiveSearch : IPlugin
    {
        public LiveSearch(PluginConfigurationSectionBase sec)
        {
        }
        public void AddHooks(RequestListener listener)
        {
            listener.TranslateUrl += new EventHandler<HttpWorkerEventArgs>(TranslateUrl);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.TranslateUrl -= new EventHandler<HttpWorkerEventArgs>(TranslateUrl);
        }
        void TranslateUrl(object sender, HttpWorkerEventArgs e)
        {
            string h = e.Url.Host.ToLower();
            string qs = e.Url.Query;
            if (string.IsNullOrEmpty(qs)) return;
            NameValueCollection query = HttpUtility.ParseQueryString(qs);
            string q = null;
            if (h.Contains(".google."))
            {
                q = query["q"];
            }
            else if (h.Contains(".baidu."))
            {
                q = query["wd"];
            }
            else if (h.Contains(".soso."))
            {
                q = query["w"];
            }
            else if (h.Contains(".sogou."))
            {
                q = query["query"];
            }
            if (string.IsNullOrEmpty(q)) return;
            e.Response.Redirect("http://cnweb.search.live.com/results.aspx?q=" + HttpUtility.UrlEncode(q));
            e.Response.OutputStream.Write("hProxyN LiveSearch: redirect to Live Search");
            e.Finish();
        }
    }
}
