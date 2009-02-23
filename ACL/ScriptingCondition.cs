using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Net;
using System.Management.Automation.Runspaces;
using MSScriptControl;
using System.Runtime.InteropServices;

namespace yoursunny.P2008.hProxyN
{
    public partial class ACL : IPlugin
    {
        public class ScriptingCondition
        {
            public ScriptingCondition()
            {
                PowerShellRunspace_lock = new object();
            }
            public void Register(ACL acl)
            {
                acl.RegisterConditionEvaluator("scripting", new ACLConditionEvaluator(TestScriptingCondition));
            }
            /// <summary>
            /// test a condition whose result is determined by a script
            /// </summary>
            bool TestScriptingCondition(XElement condition, ACLArgs a)
            {
                // <scripting language=".."> content </scripting>
                ScriptingInterface o = new ScriptingInterface(a);
                switch (condition.Attribute("language").Value)
                {
                    case "PowerShell":
                        return TestScriptingConditionPowerShell(condition.Value, o);
                    case "VBScript":
                        return TestScriptingConditionWindowsScript(condition.Value, o, "VBScript");
                    case "JavaScript":
                        return TestScriptingConditionWindowsScript(condition.Value, o, "JScript");
                }
                return false;
            }
            Runspace PowerShellRunspace;
            object PowerShellRunspace_lock;
            /// <summary>
            /// test a condition whose result is determined by a PowerShell script
            /// </summary>
            bool TestScriptingConditionPowerShell(string code, ScriptingInterface o)
            {
                //creating a new runspace may take too much time
                lock (PowerShellRunspace_lock)
                {
                    if (PowerShellRunspace == null)
                    {
                        PowerShellRunspace = RunspaceFactory.CreateRunspace();
                        PowerShellRunspace.Open();
                    }
                    PowerShellRunspace.SessionStateProxy.SetVariable("ACL", o);
                    Pipeline pipeline = PowerShellRunspace.CreatePipeline();
                    pipeline.Commands.AddScript(code);
                    pipeline.Invoke();
                }
                return o.Result();
            }
            /// <summary>
            /// test a condition whose result is determined by a VBScript or JScript script
            /// </summary>
            /// <param name="language">either VBScript or JScript</param>
            bool TestScriptingConditionWindowsScript(string code, ScriptingInterface o, string language)
            {
                ScriptControlClass sc = new ScriptControlClass();
                sc.Language = language;
                sc.AllowUI = false;
                sc.UseSafeSubset = true;
                sc.AddObject("ACL", o, true);
                sc.ExecuteStatement(code);
                return o.Result();
            }
            /// <summary>
            /// ACL object in scripts
            /// </summary>
            [ComVisible(true)]
            public class ScriptingInterface
            {
                public ScriptingInterface(ACLArgs a) { this.a = a; }
                ACLArgs a;
                public string method { get { return a.method; } }
                public IPEndPoint client { get { return a.client; } }
                public string user { get { return a.user; } }
                public Uri url { get { return a.url; } }
                public string referer { get { return a.referer; } }
                public IPAddress ServerIP { get { return a.ServerIP; } }
                bool yes;
                bool no;
                public void Yes()
                {
                    if (yes || no) return;
                    yes = true;
                }
                public void No()
                {
                    if (yes || no) return;
                    no = true;
                }
                public bool Result()
                {
                    if (yes) return true;
                    return false;
                }
                //the following is provided for COM interop
                public string client_s { get { return client.ToString(); } }
                public string url_s { get { return url.ToString(); } }
                public string ServerIP_s { get { return ServerIP.ToString(); } }
            }
        }
    }
}
