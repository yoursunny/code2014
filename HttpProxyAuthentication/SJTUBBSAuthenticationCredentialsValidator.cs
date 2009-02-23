using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// validates credentials against SJTUBBS logins
    /// </summary>
    public class SJTUBBSAuthenticationCredentialsValidator : IAuthenticationCredentialsValidator
    {
        bool IPv6;
        /// <param name="p">IPv6 => true | false, whether to use bbs6.sjtu.edu.cn instead of bbs.sjtu.edu.cn</param>
        public void SetParams(System.Collections.Specialized.NameValueCollection p)
        {
            if (p["IPv6"] == "true") IPv6 = true;
        }
        public IAuthenticationCredentialInfo Get(string userid)
        {
            return new SJTUBBSAuthenticationCredentialInfo(userid, IPv6);
        }
        public class SJTUBBSAuthenticationCredentialInfo : IAuthenticationCredentialInfo
        {
            bool IPv6;
            string id;
            bool has_checked;
            string pw;
            public SJTUBBSAuthenticationCredentialInfo(string id, bool IPv6)
            {
                this.id = id;
                this.IPv6 = IPv6;
            }
            public string Check(string password)
            {
                if (has_checked) return (pw == password) ? null : "wrong id or password";
                try
                {
                    HttpWebRequest req = (HttpWebRequest)WebRequest.Create(IPv6 ? "http://bbs6.sjtu.edu.cn/bbslogin" : "http://bbs.sjtu.edu.cn/bbslogin");
                    req.Method = WebRequestMethods.Http.Post;
                    req.AllowAutoRedirect = false;
                    req.UserAgent = "yoursunny-hProxyN";
                    string body = "id=" + id + "&pw=" + password + "&submit=";
                    byte[] postbody = Encoding.ASCII.GetBytes(body);
                    req.ContentType = "application/x-www-form-urlencoded";
                    req.ContentLength = postbody.Length;
                    req.GetRequestStream().Write(postbody, 0, postbody.Length);
                    HttpWebResponse resp = (HttpWebResponse)req.GetResponse();
                    has_checked = true;
                    switch ((int)resp.StatusCode)
                    {
                        case 302: pw = password; return null;
                        default: return "wrong id or password";
                    }
                }
                catch (WebException) { return "account validation failed"; }
            }
            public bool GetInfo(out string password, out DateTime? expires)
            {
                throw new NotSupportedException();
            }
        }
    }
}
