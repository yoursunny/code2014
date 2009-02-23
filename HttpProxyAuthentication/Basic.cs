using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.hProxyN
{
    public partial class HttpProxyAuthentication : IPlugin
    {
        private void Basic(HttpWorkerEventArgs e)
        {
            string credentials = e.Request.Headers["Proxy-Authorization"];
            string username;
            string message = BasicAuthorization(credentials, out username);
            e.AuthenticatedUser = username;
            if (message != null) BasicChallenge(e, message);
        }
        /// <summary>
        /// perform authorization check
        /// </summary>
        /// <param name="credentials">Proxy-Authorization header</param>
        /// <returns>null if check passed, otherwise the error message</returns>
        private string BasicAuthorization(string credentials, out string userid)
        {
            userid = null;
            if (string.IsNullOrEmpty(credentials)) return "credentials is not supplied";
            string[] a_base64_user_pass = credentials.Split(new char[] { ' ' }, 2);
            if (a_base64_user_pass.Length < 2) return "malformed credentials";
            if (a_base64_user_pass[0] != "Basic") return "non-Basic scheme";
            string base64_user_pass = a_base64_user_pass[1];
            byte[] user_pass = null;
            try { user_pass = Convert.FromBase64String(base64_user_pass); }
            catch (FormatException) { return "malformed credentials"; }
            int len_user_pass = user_pass.Length; int len_user;
            for (len_user = 0; len_user < len_user_pass; ++len_user) if (user_pass[len_user] == (byte)':') break;
            if (len_user >= len_user_pass) return "malformed credentials";
            Encoding enc = Encoding.ASCII;
            userid = enc.GetString(user_pass, 0, len_user);
            string password = enc.GetString(user_pass, len_user + 1, len_user_pass - len_user - 1);
            return GetCredentialInfo(userid).Check(password);
        }
        private void BasicChallenge(HttpWorkerEventArgs e, string message)
        {
            e.Response.StatusCode = 407;
            e.Response.AddHeader("Proxy-Authenticate", "Basic realm=\"" + realm + "\"");
            e.Response.OutputStream.Write(message);
            e.Finish();//will throw an exception and leave the plugin
        }
    }
}
