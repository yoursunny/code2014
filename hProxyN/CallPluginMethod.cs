using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace yoursunny.P2008.hProxyN
{
    public partial class RequestListener
    {
        /// <summary>
        /// call a method on another plugin
        /// </summary>
        /// <param name="type">plugin type</param>
        /// <param name="method">method to call</param>
        /// <param name="args">args passed to method</param>
        /// <returns>method result</returns>
        public object CallPluginMethod(string type, string method, object[] args)
        {
            var q = from pt in Plugins where pt.Key == type select pt;
            if (q.Count() < 1) throw new PluginNotAvailableException(type, method);
            IPlugin p = q.First().Value;
            MethodInfo m = p.GetType().GetMethod(method, Type.GetTypeArray(args));
            if (m == null) throw new PluginNotAvailableException(type, method);
            return m.Invoke(p, args);
        }
    }
    /// <summary>
    /// declares a method that can be called by other plugins
    /// </summary>
    [AttributeUsage(AttributeTargets.Method)]
    public class CallablePluginMethodAttribute : Attribute { }
    /// <summary>
    /// CallPluginMethod failed because the plugin is not loaded or method not found
    /// </summary>
    public class PluginNotAvailableException : Exception
    {
        string type; string method;
        public PluginNotAvailableException(string type, string method) { this.type = type; this.method = method; }
        public override string Message { get { return "plugin " + type + " is not loaded, or method " + method + " is not callable."; } }
    }
}
