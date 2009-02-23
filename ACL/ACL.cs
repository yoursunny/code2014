using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Configuration;
using System.IO;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// rule-based access control
    /// </summary>
    [Plugin("ACL", "ACL", "yoursunny.P2008.hProxyN.ACLConfigurationSection")]
    public partial class ACL : IPlugin
    {
        ACLConfigurationSection sec;
        XDocument rule_file;
        public ACL(PluginConfigurationSectionBase sec)
        {
            this.sec = (ACLConfigurationSection)sec;
            rule_file = XDocument.Load(this.sec.rulefile);
            ConditionEvaluators = new Dictionary<string, ACLConditionEvaluator>();
            RegisterBuiltInConditionEvaluators();
        }
        public void AddHooks(RequestListener listener)
        {
            listener.AccessControl += new EventHandler<HttpWorkerEventArgs>(AccessControl);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.AccessControl -= new EventHandler<HttpWorkerEventArgs>(AccessControl);
        }
        public void AccessControl(object sender, HttpWorkerEventArgs e)
        {
            XDocument rulefile = new XDocument(rule_file);//instance methods of XDocument is not guarenteed to be thread-safe
            ACLArgs a = new ACLArgs(e);
            string chain = chain_MAIN;
            List<string> chains = new List<string>();
            do
            {
                if (chains.Contains(chain)) break;//jumping into a chain twice is not allowed
                chains.Add(chain);
                chain = RunChain(rulefile.Root.Elements("chain").First(ch => ch.Attribute("id").Value == chain), a);
            } while (chain != target_DENY && chain != target_ACCEPT);
            if (chain != target_ACCEPT)
            {
                e.Decline(403, "ACL does not allow you to access this");
            }
        }
    }
    /// <summary>
    /// provides information to run ACL
    /// </summary>
    public class ACLArgs
    {
        public ACLArgs(HttpWorkerEventArgs e) { this.e = e; }
        public HttpWorkerEventArgs e { get; private set; }
        public string method { get { return e.Request.HttpMethod; } }
        public IPEndPoint client { get { return e.Request.RemoteEndPoint; } }
        public string user { get { return e.AuthenticatedUser; } }
        public Uri url { get { return e.Url; } }
        public string referer
        {
            get
            {
                //UrlReferer may be null or malformed, so try-catch here
                try { return e.Request.UrlReferrer.ToString(); }
                catch { return string.Empty; }
            }
        }
        bool serverIP_resolved;
        IPAddress serverIP;
        /// <summary>
        /// get server IP, or null if can't resolve
        /// </summary>
        public IPAddress ServerIP
        {
            get
            {
                if (!serverIP_resolved)
                {
                    IPAddress[] IPs = Dns.GetHostAddresses(e.Url.Host);
                    if (IPs.Length > 0) serverIP = IPs[0];
                    serverIP_resolved = true;
                }
                return serverIP;
            }
        }
    }
    /// <summary>
    /// ACL element
    /// </summary>
    public class ACLConfigurationSection : PluginConfigurationSectionBase
    {
        /// <summary>
        /// path to a XML file of rules
        /// </summary>
        [ConfigurationProperty("rulefile")]
        public string rulefile
        {
            get { return (string)this["rulefile"]; }
        }
    }
}
