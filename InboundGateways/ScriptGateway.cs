using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.Net;
using System.Management.Automation;
using System.Management.Automation.Runspaces;
using System.Collections.ObjectModel;
using System.IO;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// selecting gateway according to a PowerShell script
    /// </summary>
    public class ScriptGateway : IInboundGateway
    {
        Runspace runspace;
        public ScriptGateway(NameValueCollection param)
        {
            runspace = RunspaceFactory.CreateRunspace();
            runspace.Open();
            Pipeline pipeline = runspace.CreatePipeline(File.ReadAllText(param["file"]));
            pipeline.Invoke();
            try
            {
                pipeline = runspace.CreatePipeline("UseDirectRequestLine");
                Collection<PSObject> results = pipeline.Invoke();
                UseDirectRequestLine = (bool)results[0].BaseObject;
            }
            catch { }
            try
            {
                pipeline = runspace.CreatePipeline("Credentials");
                Collection<PSObject> results = pipeline.Invoke();
                Credentials = (ICredentials)results[0].BaseObject;
            }
            catch { }
        }
        public bool UseDirectRequestLine { get; private set; }
        public ICredentials Credentials { get; set; }
        public Uri GetProxy(Uri destination)
        {
            Collection<PSObject> results;
            lock (runspace)
            {
                Pipeline pipeline = runspace.CreatePipeline("GetProxy \"" + destination.ToString() + "\"");
                results = pipeline.Invoke();
            }
            if (results.Count < 1) return null;
            return new Uri("http://" + results[0].BaseObject);
        }
        public bool IsBypassed(Uri host)
        {
            Collection<PSObject> results;
            lock (runspace)
            {
                Pipeline pipeline = runspace.CreatePipeline("IsBypassed");
                results = pipeline.Invoke(new object[] { host });
            }
            if (results.Count < 1) return true;
            try { return (bool)results[0].BaseObject; }
            catch (InvalidCastException) { return true; }
        }
    }
}
