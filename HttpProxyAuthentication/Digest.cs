using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.hProxyN
{
    public partial class HttpProxyAuthentication : IPlugin
    {
        private void Digest(HttpWorkerEventArgs e)
        {
            string credentials = e.Request.Headers["Proxy-Authorization"];
            bool stale; string username;
            string message = DigestAuthorization(credentials, e, out username, out stale);
            e.AuthenticatedUser = username;
            if (message != null) DigestChallenge(e, message, stale);
        }
        public static string MD5(string s)
        {
            return System.Web.Security.FormsAuthentication.HashPasswordForStoringInConfigFile(s, "MD5").ToLower();
        }
        private string DigestAuthorization(string credentials, HttpWorkerEventArgs e, out string username, out bool stale)
        {
            username = null; stale = false;
            if (string.IsNullOrEmpty(credentials)) return "credentials is not supplied";
            string[] a_digest_response = credentials.Split(new char[] { ' ' }, 2);
            if (a_digest_response.Length < 2) return "malformed credentials";
            if (a_digest_response[0] != "Digest") return "non-Digest scheme";
            string digest_response = a_digest_response[1];
            DigestAuthorizationHeader dah;
            try { dah = new DigestAuthorizationHeader(digest_response); }
            catch { return "malformed digest-response"; }
            username = dah.username;
            if (string.IsNullOrEmpty(dah.username) || string.IsNullOrEmpty(dah.nonce)
                || string.IsNullOrEmpty(dah.digest_uri) || string.IsNullOrEmpty(dah.response))
                return "incomplete digest-response";
            if (dah.realm != realm) return "wrong realm";
            //this will break hainei, hainei is using ?r[0]=xxx&r[1]=yyy, and '[' ']' may got encoded in Uri.PathAndQuery
            //if (dah.digest_uri != e.Url.PathAndQuery) return "wrong digest-uri";
            if (dah.message_qop == "auth" && (string.IsNullOrEmpty(dah.nonce_count) || string.IsNullOrEmpty(dah.cnonce)))
                return "incomplete digest-response, nonce-count and cnonce should be supplied when qop is present";
            string nonce = dah.nonce;
            string check_result = dah.message_qop == "auth"
                ? DigestCheck(dah.response, username, realm, dah.digest_uri, nonce, dah.nonce_count, dah.cnonce, dah.message_qop, e.Request.HttpMethod)
                : DigestCheck(dah.response, username, realm, dah.digest_uri, nonce, e.Request.HttpMethod);
            if (check_result != null) return check_result;
            stale = true;
            try
            {
                string[] a_nonce = nonce.Split(new char[] { ' ' }, 2);
                if (a_nonce.Length == 2)
                {
                    DateTime timestamp = DateTime.FromBinary(long.Parse(a_nonce[0]));
                    if ((DateTime.Now - timestamp).TotalSeconds < 120)
                    {
                        string nonce_h = MD5(a_nonce[0] + ":" + e.Request.RemoteEndPoint.Address.ToString() + ":" + privatekey);
                        if (nonce_h == a_nonce[1]) stale = false;
                    }
                }
            }
            catch { }
            if (stale) return "nonce is stale";
            return null;
        }
        private void DigestChallenge(HttpWorkerEventArgs e, string message, bool stale)
        {
            string timestamp = DateTime.Now.ToBinary().ToString();
            string nonce = timestamp + " " + MD5(timestamp + ":" + e.Request.RemoteEndPoint.Address.ToString() + ":" + privatekey);
            e.Response.StatusCode = 407;
            e.Response.AddHeader("Proxy-Authenticate", "Digest realm=\"" + realm + "\", nonce=\"" + nonce + "\", "
                + (stale ? "stale=true, " : "") + "algorithm=MD5, qop=\"auth\"");
            e.Response.OutputStream.Write(message);
            e.Finish();//will throw an exception and leave the plugin
        }
        /// <summary>
        /// check a digest response with qop
        /// </summary>
        private string DigestCheck(string request_digest, string username, string realm, string digest_uri, string nonce, string nonce_count, string cnonce, string qop, string method)
        {
            string password; DateTime? expires;
            bool exist = GetCredentialInfo(username).GetInfo(out password, out expires);
            if (!exist) return "username not found";
            if (expires.HasValue && expires.Value < DateTime.UtcNow) return "user expired";
            string A1 = username + ":" + realm + ":" + password;
            string A2 = method + ":" + digest_uri;
            string d = MD5(MD5(A1) + ":" + nonce + ":" + nonce_count + ":" + cnonce + ":" + qop + ":" + MD5(A2));
            if (d != request_digest) return "wrong request-digest";
            return null;
        }
        /// <summary>
        /// check a digest response without qop
        /// </summary>
        private string DigestCheck(string request_digest, string username, string realm, string digest_uri, string nonce, string method)
        {
            string password; DateTime? expires;
            bool exist = GetCredentialInfo(username).GetInfo(out password, out expires);
            if (!exist) return "username not found";
            if (expires.HasValue && expires.Value < DateTime.UtcNow) return "user expired";
            string A1 = username + ":" + realm + ":" + password;
            string A2 = method + ":" + digest_uri;
            string d = MD5(MD5(A1) + ":" + nonce + ":" + MD5(A2));
            if (d != request_digest) return "wrong request-digest";
            return null;
        }
        class DigestAuthorizationHeader
        {
            public DigestAuthorizationHeader(string digest_response)
            {
                int len = digest_response.Length;
                StringBuilder name = new StringBuilder();
                StringBuilder value = new StringBuilder();
                const int state_name = 1;
                const int state_value = 2;
                const int state_quotedvalue = 3;
                const int state_finish = 4;
                int state = state_name;
                for (int i = 0; i < len; ++i)
                {
                    char ch = digest_response[i];
                    switch (state)
                    {
                        case state_name:
                            if (ch == '=') state = state_value;
                            else name.Append(ch);
                            break;
                        case state_value:
                            if (ch == ',') state = state_finish;
                            else if (ch == '"') state = state_quotedvalue;
                            else value.Append(ch);
                            break;
                        case state_quotedvalue:
                            if (ch == '"') state = state_value;
                            else value.Append(ch);
                            break;
                    }
                    if (state == state_finish || i + 1 == len)
                    {
                        OneValue(name.ToString().Trim(), value.ToString().Trim());
                        name = new StringBuilder(); value = new StringBuilder();
                        state = state_name;
                    }
                }
            }
            private void OneValue(string name, string value)
            {
                switch (name)
                {
                    case "username": username = value; break;
                    case "realm": realm = value; break;
                    case "nonce": nonce = value; break;
                    case "uri": digest_uri = value; break;
                    case "response": response = value; break;
                    case "algorithm": algorithm = value; break;
                    case "cnonce": cnonce = value; break;
                    case "opaque": opaque = value; break;
                    case "qop": message_qop = value; break;
                    case "nc": nonce_count = value; break;
                }
            }
            public string username { get; private set; }
            public string realm { get; private set; }
            public string nonce { get; private set; }
            public string digest_uri { get; private set; }
            public string response { get; private set; }
            public string algorithm { get; private set; }
            public string cnonce { get; private set; }
            public string opaque { get; private set; }
            public string message_qop { get; private set; }
            public string nonce_count { get; private set; }
        }
    }
}
