using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Configuration;
using System.Data.SqlServerCe;
using System.Collections;
using System.Collections.Specialized;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// provides username/password authentication for HttpProxy
    /// </summary>
    [Plugin("HttpProxyAuthentication", "HttpProxyAuthentication", "")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public partial class HttpProxyAuthentication : IPlugin
    {
        HttpProxyAuthenticationConfigurationSection sec;
        AuthenticationSchemes scheme;
        string realm;
        string privatekey;
        IAuthenticationCredentialsValidator validator;
        Hashtable CredentialCache;
        public HttpProxyAuthentication(PluginConfigurationSectionBase sec)
        {
            this.sec = (HttpProxyAuthenticationConfigurationSection)sec;
            scheme = this.sec.scheme;
            realm = this.sec.realm;
            privatekey = this.sec.privatekey;
            validator = GetValidator(this.sec.validator);
            CredentialCache = new Hashtable();
            InitManager();
        }
        public void AddHooks(RequestListener listener)
        {
            if (scheme != AuthenticationSchemes.Anonymous)
                listener.Authentication += new EventHandler<HttpWorkerEventArgs>(Authentication);
            AddManagerHooks(listener);
        }
        public void RemoveHooks(RequestListener listener)
        {
            if (scheme != AuthenticationSchemes.Anonymous)
                listener.Authentication -= new EventHandler<HttpWorkerEventArgs>(Authentication);
            RemoveManagerHooks(listener);
        }
        public void Authentication(object sender, HttpWorkerEventArgs e)
        {
            RequestListener rl = (RequestListener)sender;
            bool listening = (bool)rl.CallPluginMethod("yoursunny.P2008.hProxyN.HttpProxy", 
                "IsListeningTo", new object[] { e.Request });
            if (!listening) return;
            switch (scheme)
            {
                case AuthenticationSchemes.None:
                    e.Decline(403, "HttpProxyAuthentication: no one can access this");
                    break;
                case AuthenticationSchemes.Anonymous:
                    break;
                case AuthenticationSchemes.Basic:
                    Basic(e);
                    break;
                case AuthenticationSchemes.Digest:
                    Digest(e);
                    break;
                default:
                    e.Decline(500, "HttpProxyAuthentication does not support " + scheme.ToString() + " scheme");
                    break;
            }
        }
        private IAuthenticationCredentialsValidator GetValidator(AuthenticationCredentialsValidatorConfigurationElement ele)
        {
            Type t = Type.GetType(ele.type);
            IAuthenticationCredentialsValidator o = (IAuthenticationCredentialsValidator)Activator.CreateInstance(t);
            NameValueCollection p = new NameValueCollection();
            foreach (NameValueConfigurationElement e in ele.param) p.Add(e.Name, e.Value);
            o.SetParams(p);
            return o;
        }
        private IAuthenticationCredentialInfo GetCredentialInfo(string userid)
        {
            //hitting the database is very slow (may take about 1500ms), so a cache is required
            IAuthenticationCredentialInfo ci = CredentialCache[userid] as IAuthenticationCredentialInfo;
            if (ci == null)
            {
                ci = validator.Get(userid);
                CredentialCache[userid] = ci;
            }
            return ci;
        }
        /// <summary>
        /// remove cached credentials (call this when some credentials are changed in the database by another plugin)
        /// </summary>
        public void RemoveCachedCredentials(string[] userids)
        {
            foreach (string userid in userids) CredentialCache.Remove(userid);
        }
    }
    /// <summary>
    /// HttpProxyAuthentication element
    /// </summary>
    public class HttpProxyAuthenticationConfigurationSection : PluginConfigurationSectionBase
    {
        /// <summary>
        /// authentication scheme, either Basic or Digest
        /// </summary>
        [ConfigurationProperty("scheme")]
        public AuthenticationSchemes scheme
        {
            get { return (AuthenticationSchemes)this["scheme"]; }
        }
        /// <summary>
        /// authentication realm, usually displayed in user-agent's popup
        /// </summary>
        [ConfigurationProperty("realm")]
        public string realm
        {
            get { return (string)this["realm"]; }
        }
        /// <summary>
        /// privatekey for hashing Digest challenge
        /// </summary>
        [ConfigurationProperty("privatekey")]
        public string privatekey
        {
            get { return (string)this["privatekey"]; }
        }
        /// <summary>
        /// validator to determine whether the crendentials are correct
        /// </summary>
        [ConfigurationProperty("validator")]
        public AuthenticationCredentialsValidatorConfigurationElement validator
        {
            get { return (AuthenticationCredentialsValidatorConfigurationElement)this["validator"]; }
        }
        /// <summary>
        /// manager to add/remove users, reset passwords
        /// </summary>
        [ConfigurationProperty("manager")]
        public AuthenticationCredentialsManagerConfigurationElement manager
        {
            get { return (AuthenticationCredentialsManagerConfigurationElement)this["manager"]; }
        }
    }
}
