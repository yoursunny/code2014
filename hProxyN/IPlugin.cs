using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Reflection;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents a plugin
    /// </summary>
    public interface IPlugin
    {
        void AddHooks(RequestListener listener);
        void RemoveHooks(RequestListener listener);
    }
    /// <summary>
    /// declares a plugin
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = false)]
    public class PluginAttribute : Attribute
    {
        public string name { get; private set; }
        public string conf_section { get; private set; }
        public string conf_type { get; private set; }
        /// <param name="name">plugin name</param>
        /// <param name="conf_section">configuration section name</param>
        /// <param name="conf_type">configuration section type</param>
        public PluginAttribute(string name, string conf_section, string conf_type)
        {
            this.name = name;
            this.conf_section = conf_section;
            this.conf_type = conf_type;
        }
    }
    /// <summary>
    /// declares a plugin's dependency
    /// </summary>
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public class DependOnPluginAttribute : Attribute
    {
        public string type { get; private set; }
        public DependOnPluginAttribute(string type) { this.type = type; }
    }
}
