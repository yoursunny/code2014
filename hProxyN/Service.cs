using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.ServiceProcess;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// run as Windows Service
    /// </summary>
    class Service : ServiceBase
    {
        public Service(hProxyNConfigurationSectionGroup group)
        {
            this.conf = group;
            this.CanPauseAndContinue = true;
        }
        hProxyNConfigurationSectionGroup conf;
        RequestListener lis;
        protected override void OnStart(string[] args)
        {
            this.RequestAdditionalTime(30000);
            //System.Threading.Thread.Sleep(15000);//attaching debug
            if (lis == null) lis = new RequestListener(conf);
            lis.Start();
        }
        protected override void OnStop()
        {
            lis.Close();
        }
        protected override void OnPause()
        {
            lis.Stop();
        }
        protected override void OnContinue()
        {
            lis.Start();
        }
    }
}
