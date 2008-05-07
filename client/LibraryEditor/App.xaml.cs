using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Windows;
using yoursunny.P2008.Library.API;

namespace yoursunny.P2008.Library.EditorDesk
{
    public partial class App : Application
    {
        private void Application_Startup(object sender, StartupEventArgs e)
        {
            string[] args = Environment.GetCommandLineArgs();
            if (args.Length < 2) { this.Shutdown(); return; }
            JSONRPC.ticket = args[1];
        }
    }
}
