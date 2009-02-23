using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows.Forms;

namespace yoursunny.P2008.hProxyN
{
    class BrowserForm : Form
    {
        WebBrowser browser;
        string url;
        int timeout;
        public BrowserForm(string url, int timeout)
        {
            this.url = url;
            this.timeout = timeout;
            browser = new WebBrowser();
            this.Controls.Add(browser);
            this.Size = new System.Drawing.Size(1, 1);
            this.Location = new System.Drawing.Point(-1, -1);
            this.FormBorderStyle = FormBorderStyle.None;
            this.ShowInTaskbar = false;
            this.Load += new EventHandler(Navigate);
        }
        void Navigate(object sender, EventArgs e)
        {
            browser.Navigate(url);
            browser.DocumentCompleted += new WebBrowserDocumentCompletedEventHandler(DocumentCompleted);
            System.Timers.Timer timer = new System.Timers.Timer(timeout);
            timer.AutoReset = false;
            timer.Elapsed += new System.Timers.ElapsedEventHandler(Timeout);
            timer.Start();
        }
        void DocumentCompleted(object sender, WebBrowserDocumentCompletedEventArgs e)
        {
            System.Timers.Timer timer = new System.Timers.Timer(2000);
            timer.AutoReset = false;
            timer.Elapsed += new System.Timers.ElapsedEventHandler(Finish);
            timer.Start();
        }
        void Finish(object sender, System.Timers.ElapsedEventArgs e)
        {
            Environment.ExitCode = 0;
            this.Close();
        }
        void Timeout(object sender, System.Timers.ElapsedEventArgs e)
        {
            Environment.ExitCode = 1;
            if (this.InvokeRequired)
            {
                this.Invoke(new MethodInvoker(Close));
                return;
            }
            this.Close();
        }
    }
}
