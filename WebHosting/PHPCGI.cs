using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Diagnostics;
using System.IO;
using System.Configuration;
//using System.Reflection;
//using System.Collections;
using System.Collections.Specialized;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// provides PHP scripting support using CGI interface
    /// </summary>
    [Plugin("PHPCGI", "PHPCGI", "yoursunny.P2008.hProxyN.PHPCGIPluginConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.WebHosting")]
    public class PHPCGI : IPlugin, IWebHostingScriptHandler
    //CGI Specification http://hoohoo.ncsa.uiuc.edu/cgi/interface.html
    {
        PHPCGIConfigurationSection sec;
        public PHPCGI(PluginConfigurationSectionBase sec)
        {
            this.sec = (PHPCGIConfigurationSection)sec;
            CMD_path = Path.Combine(Path.GetDirectoryName(System.Reflection.Assembly.GetExecutingAssembly().Location), "PHPCGI.cmd");
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerOpen += new EventHandler<RequestListenerEventArgs>(ListenerOpen);
            listener.ListenerClose += new EventHandler<RequestListenerEventArgs>(ListenerClose);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerOpen -= new EventHandler<RequestListenerEventArgs>(ListenerOpen);
            listener.ListenerClose -= new EventHandler<RequestListenerEventArgs>(ListenerClose);
        }
        public void ListenerOpen(object sender, RequestListenerEventArgs e)
        {
            RequestListener listener = (RequestListener)sender;
            listener.CallPluginMethod("yoursunny.P2008.hProxyN.WebHosting", "AddScriptHandler", new object[] { this });
        }
        public void ListenerClose(object sender, RequestListenerEventArgs e)
        {
            RequestListener listener = (RequestListener)sender;
            listener.CallPluginMethod("yoursunny.P2008.hProxyN.WebHosting", "RemoveScriptHandler", new object[] { this });
        }
        public string Name { get { return "PHPCGI"; } }
        /// <param name="param">
        /// DocumentRoot => physical root path of the website, only .php files inside it can be executed
        /// </param>
        public void HandleWebHostingRequest(WebHosting sender, HttpWorkerEventArgs e, string file, NameValueCollection param)
        {
            Process p = InitProcess();
            long ContentLength = e.Request.ContentLength64;
            Stream request_input_stream = e.Request.InputStream;
            if (e.Request.HasEntityBody && ContentLength < 0)
            {
                request_input_stream = new MemoryStream();
                e.Request.InputStream.CopyTo(request_input_stream);
                ContentLength = request_input_stream.Length;
                request_input_stream.Seek(0, SeekOrigin.Begin);
            }
            SetEnvironment(p, e, file, param, ContentLength);
            p.Start();
            Stream stdin = p.StandardInput.BaseStream;
            if (e.Request.HasEntityBody) request_input_stream.CopyTo(stdin, ContentLength);
            Stream stdout = p.StandardOutput.BaseStream;
            FetchResponseHeaders(stdout, e.Response);
            stdout.CopyTo(e.Response.OutputStream);
            e.Response.OutputStream.Write(Process.GetCurrentProcess().StartInfo.FileName);
            //p.StandardError.BaseStream.CopyTo(Console.OpenStandardError());
            //try { process.Kill(); }
            //catch (System.ComponentModel.Win32Exception) { }
            //catch (InvalidOperationException) { }
            e.Finish();
        }
        /// <summary>
        /// initialize the external php process
        /// </summary>
        /// <remarks>warning: PHP will run as the same user; by default, service run as SYSTEM, and it's dangerous to run PHP as SYSTEM</remarks>
        private Process InitProcess()
        {
            Process p = new Process();
            p.StartInfo.FileName = sec.EXE;
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.RedirectStandardInput = true;
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;
            return p;
        }
        /// <summary>
        /// full path to PHPCGI.cmd
        /// </summary>
        string CMD_path;
        /// <summary>
        /// set environment vars for php-cgi.exe
        /// </summary>
        private void SetEnvironment(Process p, HttpWorkerEventArgs e, string file, NameValueCollection param, long ContentLength)
        {
            Dictionary<string, string> env = new Dictionary<string, string>();
            env["SCRIPT_FILENAME"] = file;
            env["SERVER_SOFTWARE"] = "yoursunny-hProxyN";
            env["SERVER_NAME"] = e.Request.Url.GetComponents(UriComponents.HostAndPort, UriFormat.SafeUnescaped);
            env["GATEWAY_INTERFACE"] = "CGI/1.1";
            env["SERVER_PROTOCOL"] = "HTTP/" + e.Request.ProtocolVersion.ToString(2);
            env["SERVER_PORT"] = e.Request.LocalEndPoint.Port.ToString();
            env["REQUEST_METHOD"] = e.Request.HttpMethod;
            env["PATH_INFO"] = "";
            env["PATH_TRANSLATED"] = "";
            env["SCRIPT_NAME"] = "/" + e.Request.Url.GetComponents(UriComponents.Path, UriFormat.SafeUnescaped);
            env["QUERY_STRING"] = e.Request.Url.GetComponents(UriComponents.Query, UriFormat.SafeUnescaped);
            env["REMOTE_HOST"] = e.Request.RemoteEndPoint.Address.ToString();
            env["REMOTE_ADDR"] = e.Request.RemoteEndPoint.Address.ToString();
            env["AUTH_TYPE"] = "";
            env["REMOTE_USER"] = "";
            env["REMOTE_IDENT"] = "";
            env["CONTENT_TYPE"] = e.Request.ContentType;
            env["CONTENT_LENGTH"] = ContentLength.ToString();
            env["PHPRC"] = sec.PHPRC;
            env["REDIRECT_STATUS"] = "CGI";
            foreach (string key in e.Request.Headers) env["HTTP_" + key.ToUpper().Replace("-", "_")] = e.Request.Headers[key];
            if (!string.IsNullOrEmpty(param["DocumentRoot"])) env["PHP_DOCUMENT_ROOT"] = param["DocumentRoot"];
            //a bug in .Net Framework is converting names of environment variables to lower case, thus php don't work correctly
            // http://connect.microsoft.com/VisualStudio/feedback/ViewFeedback.aspx?FeedbackID=326163
            //Reflection does not work
            //Type t = typeof(NameValueCollection);
            //FieldInfo fi = t.GetField("contents", BindingFlags.NonPublic);
            //Hashtable h = (Hashtable)fi.GetValue(p.StartInfo.EnvironmentVariables);
            //foreach (string key in env.Keys) h[key] = env[key];
            //a workaround is using a cmd script, but this is quite slow
            p.StartInfo.FileName = CMD_path;
            List<string> args = new List<string>();
            args.Add("\"" + sec.EXE + "\"");
            foreach (string key in env.Keys)
            {
                args.Add("\"" + key + "=" + env[key] + "\"");
            }
            p.StartInfo.Arguments = string.Join(" ", args.ToArray());
        }
        /// <summary>
        /// fetch response headers from top lines of stdout, leave entity-body there
        /// </summary>
        private void FetchResponseHeaders(Stream stdout, HttpListenerResponse Response)
        {
            //we can only read stdout from php-cgi.exe byte-by-byte
            //StreamReader has a buffer, it will read too much
            StringBuilder b = new StringBuilder();
            while (true)
            {
                int chi = stdout.ReadByte();
                if (chi < 0) break;
                char ch = Convert.ToChar(chi);
                b.Append(ch);
                if (ch == '\n')
                {
                    string l = b.ToString().TrimEnd('\r', '\n');
                    if (l.Length <= 2) break;
                    b = new StringBuilder();
                    string[] la = l.Split(new char[] { ':' }, 2);
                    if (la.Length < 2) continue;
                    string key = la[0];
                    string value = la[1].TrimStart(' ');
                    switch (key.ToLower())
                    {
                        case "content-length":
                        case "keep-alive":
                        case "transfer-encoding":
                        case "www-authenticate":
                        case "content-encoding":
                        case "last-modified":
                        case "server":
                            break;
                        case "status":
                            {
                                string[] sa = value.Split(new char[] { ' ' }, 2);
                                Response.StatusCode = int.Parse(sa[0]);
                                if (sa.Length > 1) Response.StatusDescription = sa[1];
                            }
                            break;
                        case "content-type":
                            Response.ContentType = value;
                            break;
                        default:
                            Response.AppendHeader(key, value);
                            break;
                    }
                }
            }
        }
    }
    /// <summary>
    /// PHPCGI element
    /// </summary>
    public class PHPCGIConfigurationSection : PluginConfigurationSectionBase
    {
        /// <summary>
        /// full path to php-cgi.exe
        /// </summary>
        [ConfigurationProperty("EXE")]
        public string EXE
        {
            get { return (string)this["EXE"]; }
        }
        /// <summary>
        /// the location of php.ini
        /// </summary>
        [ConfigurationProperty("PHPRC")]
        public string PHPRC
        {
            get { return (string)this["PHPRC"]; }
        }
    }
}
