using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
using System.Collections.Specialized;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// support WWW-Authenticate from origin server, through web form
    /// </summary>
    [Plugin("HttpProxyWWWAuthenticate", "HttpProxyWWWAuthenticate", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public class HttpProxyWWWAuthenticate : HttpProxyExtension, IPlugin
    {
        //const string form_action = "/_hProxyN_/1EA5F0C8-674F-45c8-B00C-C2B2E9AF4819/HttpProxyWWWAuthenticate.cgi";
        const string cookie_userid = "_hProxyN_88FC80D9-09FF-4ab7-922E-E7E85FA6A0DC_HttpProxyWWWAuthenticate";
        const string cookie_password = "_hProxyN_5ADE96E6-02A1-400c-800E-C105A3D3F19E_HttpProxyWWWAuthenticate";
        Encoding enc;
        System.Reflection.Assembly thisDLL;
        const string embed_form = "yoursunny.P2008.hProxyN.WWWAuthenticateForm.htm";
        public HttpProxyWWWAuthenticate(PluginConfigurationSectionBase sec)
        {
            enc = Encoding.UTF8;
            thisDLL = System.Reflection.Assembly.GetExecutingAssembly();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerStart += new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerStart -= new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public override void BeforeRequest(HttpProxyContext context)
        {
            /* Response.SetCookie does not work correctly, so setting cookies is moved to client-side
            if (context.Url.PathAndQuery == form_action && context.Request.HttpMethod == "POST")
            {
                string post_data = new StreamReader(context.Request.InputStream).ReadToEnd();
                NameValueCollection post = HttpUtility.ParseQueryString(post_data);
                string page = post["page"];
                //string b_userid = Convert.ToBase64String(enc.GetBytes(post["userid"]));
                //string b_password = Convert.ToBase64String(enc.GetBytes(post["password"]));
                string b_userid = post["userid"];
                string b_password = post["password"];
                if (!Uri.IsWellFormedUriString(post["page"], UriKind.RelativeOrAbsolute)) return;
                //context.Response.Redirect(post["page"]);
                context.Response.SetCookie(new Cookie(cookie_userid, b_userid));
                context.Response.SetCookie(new Cookie(cookie_password, b_password));
                context.Response.Headers[HttpResponseHeader.CacheControl] = "no-cache";
                page = HttpUtility.HtmlEncode(page);
                context.Response.OutputStream.Write("<SCRIPT type=\"text/javascript\">location.replace('" + page + "');</SCRIPT><META http-equiv=\"refresh\" content=\"0;" + page + "\">");
                context.e.Finish();
            }
             */
            Cookie c_userid = context.Request.Cookies[cookie_userid];
            Cookie c_password = context.Request.Cookies[cookie_password];
            if (c_userid != null && c_password != null)
            {
                try
                {
                    //string s_userid = enc.GetString(Convert.FromBase64String(c_userid.Value));
                    //string s_password = enc.GetString(Convert.FromBase64String(c_password.Value));
                    string s_userid = c_userid.Value;
                    string s_password = c_password.Value;
                    context.req.Credentials = new NetworkCredential(s_userid, s_password);
                }
                catch { }
            }
        }
        public override Stream FilterResponseIn(HttpProxyContext context, Stream s)
        {
            if (context.InboundRequestCanceled) return s;
            if (context.resp.StatusCode == HttpStatusCode.Unauthorized)
            {
                string wa = context.resp.Headers[HttpResponseHeader.WwwAuthenticate];
                if (string.IsNullOrEmpty(wa)) return s;
                return thisDLL.GetManifestResourceStream(embed_form);
            }
            return s;
        }
    }
}
