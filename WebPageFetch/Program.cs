using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace yoursunny.P2008.hProxyN
{
    class Program
    {
        [STAThread()]
        static void Main(string[] args)
        {
            if (args.Length != 3)
            {
                Console.WriteLine("WebPageFetch.exe <url> <timeout> <proxy>");
                Environment.ExitCode = 3;
                return;
            }
            RegistryProxySetting oldproxy = RegistryProxySetting.Get();
            RegistryProxySetting proxy = new RegistryProxySetting();
            proxy.ProxyEnable = true;
            proxy.ProxyServer = args[2];
            proxy.Set();
            Application.Run(new BrowserForm(args[0], int.Parse(args[1])));
            oldproxy.Set();
        }
    }
}
