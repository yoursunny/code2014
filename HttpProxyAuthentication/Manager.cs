using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Configuration;
using System.Reflection;
using System.IO;
using System.Web;

namespace yoursunny.P2008.hProxyN
{
    public partial class HttpProxyAuthentication : IPlugin
    {
        void InitManager()
        {
            if (sec.manager.enabled)
            {
                Type t = Type.GetType(sec.manager.type);
                manager = (IAuthenticationCredentialsManager)Activator.CreateInstance(t);
                NameValueCollection p = new NameValueCollection();
                foreach (NameValueConfigurationElement e in sec.manager.param) p.Add(e.Name, e.Value);
                manager.SetParams(p);
                manager_admin = sec.manager.admin;
                StreamReader form_r = new StreamReader(System.Reflection.Assembly.GetExecutingAssembly().GetManifestResourceStream(manager_embedForm));
                manager_form = form_r.ReadToEnd();
                form_r.Close();
            }
        }
        IAuthenticationCredentialsManager manager;
        string manager_admin;
        string manager_form;
        const string manager_embedForm = "yoursunny.P2008.hProxyN.ManagerForm.htm";
        void AddManagerHooks(RequestListener listener)
        {
            if (sec.manager.enabled)
            {
                listener.Prepare += new EventHandler<HttpWorkerEventArgs>(ManagerPrepare);
                listener.Handler += new EventHandler<HttpWorkerEventArgs>(ManagerHandler);
            }
        }
        void RemoveManagerHooks(RequestListener listener)
        {
            if (sec.manager.enabled)
            {
                listener.Prepare -= new EventHandler<HttpWorkerEventArgs>(ManagerPrepare);
                listener.Handler -= new EventHandler<HttpWorkerEventArgs>(ManagerHandler);
            }
        }
        void ManagerPrepare(object sender, HttpWorkerEventArgs e)
        {
            const string manager_path = "/_hProxyN_/B36EB0E1-3A9F-438c-8E82-B69F8F11786B/";
            string u_path = "/" + e.Url.GetComponents(UriComponents.Path, UriFormat.SafeUnescaped);
            if (!u_path.StartsWith(manager_path)) return;
            RequestListener listener = (RequestListener)sender;
            listener.CallPluginMethod("yoursunny.P2008.hProxyN.HttpProxy", "IgnoreRequest", new object[] { e });
        }
        void ManagerHandler(object sender, HttpWorkerEventArgs e)
        {
            const string manager_path = "/_hProxyN_/B36EB0E1-3A9F-438c-8E82-B69F8F11786B/";
            string u_path = "/" + e.Url.GetComponents(UriComponents.Path, UriFormat.SafeUnescaped);
            if (!u_path.StartsWith(manager_path)) return;
            if (e.AuthenticatedUser != manager_admin) e.Decline(403, "HttpProxyAuthentication manager requires admin login");
            u_path = u_path.Substring(manager_path.Length);
            if (u_path == "")
            {
                e.Response.ContentType = "text/html";
                string page = manager_form;
                const string userlist_placeholder = "${A9BC8F6D-8CFA-4930-AE62-ACF322E756F6}$";
                string[] users = null;
                try { users = (from string userid in manager.EnumUsers() select "'" + userid + "'").ToArray(); }
                catch (NotSupportedException) { }
                e.Response.OutputStream.Write(page.Replace(userlist_placeholder,
                    users == null ? "var userlist=null;" :
                    "var userlist=[" + string.Join(",", users) + "];"));
                e.Finish();
            }
            if (e.Request.HttpMethod != "POST") e.Decline(403, "HttpProxyAuthentication manager requires POST");
            NameValueCollection post = HttpUtility.ParseQueryString(new StreamReader(e.Request.InputStream).ReadToEnd());
            switch (u_path)
            {
                case "adduser.cgi":
                    manager.AddUser(post["userid"], post["password"]);
                    break;
                case "removeuser.cgi":
                    manager.RemoveUser(post["userid"]);
                    break;
                case "resetpassword.cgi":
                    manager.ResetPassword(post["userid"], post["password"]);
                    break;
                default:
                    e.Decline(404, "HttpProxyAuthentication manager url not found");
                    break;
            }
            this.RemoveCachedCredentials(new string[] { post["userid"] });
            e.Response.Redirect("./");
            e.Finish();
        }
    }
}
