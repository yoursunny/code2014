using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// entry point
    /// </summary>
    class Program
    {
        static void Main(string[] args)
        {
            if (args.Length != 1) return;
            ExeConfigurationFileMap conf_map = new ExeConfigurationFileMap();
            conf_map.ExeConfigFilename = args[0];
            Configuration conf = ConfigurationManager.OpenMappedExeConfiguration(conf_map, ConfigurationUserLevel.None);
            try { Environment.CurrentDirectory = System.IO.Path.GetDirectoryName(args[0]); }
            catch (ArgumentException) { }
            hProxyNConfigurationSectionGroup group = (hProxyNConfigurationSectionGroup)conf.GetSectionGroup("hProxyN");
            switch (((ListenerConfigurationSection)group.Sections["Listener"]).mode)
            {
                case "console":
                    RunConsole(group);
                    break;
                case "service":
                    RunService(group);
                    break;
            }
        }
        static void RunConsole(hProxyNConfigurationSectionGroup group)
        {
            RequestListener lis = new RequestListener(group);
            lis.Start();
            Console.ReadLine();
            lis.Close();
        }
        static void RunService(hProxyNConfigurationSectionGroup group)
        {
            if (Environment.UserName == "SYSTEM") return;
            // it is dangerous to run the service under SYSTEM, so create a new account
            // by default, non-Administrators account can't bind UrlPrefix, but we can set urlacl
            // install Windows Server 2003 SP2 Support Tools (KB926027), 
            // httpcfg.exe set urlacl /u Url /a ACL
            // Url should be the exact value in <listen/>, like http://[::1]:3128/ , must end with '/'
            // ACL is D:(A;;GX;;;S-1-5-xxx-yyy-zzz), where S-1-5-xxx-yyy-zzz is the SID of the service account
            // http://www.leastprivilege.com/HttpCfgACLHelper.aspx
            Service.Run(new Service(group));
        }
    }
}
