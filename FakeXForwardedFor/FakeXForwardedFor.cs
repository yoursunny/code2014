using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    [Plugin("FakeXForwardedFor", "FakeXForwardedFor", "yoursunny.P2008.hProxyN.FakeXForwardedForConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public class FakeXForwardedFor : HttpProxyExtension, IPlugin
    {
        FakeXForwardedForConfigurationSection sec;
        public FakeXForwardedFor(PluginConfigurationSectionBase sec)
        {
            this.sec = (FakeXForwardedForConfigurationSection)sec;
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
            context.req.Headers.Add("X-Forwarded-For", sec.IP);
        }
    }
    public class FakeXForwardedForConfigurationSection : PluginConfigurationSectionBase
    {
        [ConfigurationProperty("IP")]
        public string IP
        {
            get { return (string)this["IP"]; }
        }
    }
}
