using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;
using System.Configuration;

namespace yoursunny.P2008.hProxyN
{
    public partial class RequestListener
    {
        private Dictionary<string, IPlugin> Plugins;
        private struct PluginInfo
        {
            public PluginInfo(string type)
            {
                this.type = type;
                t = Type.GetType(type);
                object[] a = t.GetCustomAttributes(typeof(PluginAttribute), false);
                if (a.Length != 1) throw new PluginNotFoundException(type);
                attr = (PluginAttribute)a[0];
                depends = (from d in t.GetCustomAttributes(typeof(DependOnPluginAttribute), true) select (DependOnPluginAttribute)d).ToArray();
            }
            public string type;
            public Type t;
            public PluginAttribute attr;
            public DependOnPluginAttribute[] depends;
        }
        private void LoadPlugins(PluginsConfigurationSection sec, PluginConfigurationSectionGroup cg)
        {
            //gather all wanted plugin
            var PluginInfos = from PluginElement ele in sec.PluginCollection select new PluginInfo(ele.type);
            //check dependency and create instances
            Plugins = new Dictionary<string, IPlugin>();
            foreach (PluginInfo pi in PluginInfos)
            {
                foreach (DependOnPluginAttribute d in pi.depends)
                {
                    if ((from ppi in PluginInfos where ppi.t.FullName == d.type select ppi).Count() < 1)
                        throw new PluginDependencyFailureException(pi.type, d.type);
                }
                ConstructorInfo ctor = pi.t.GetConstructor(new Type[] { typeof(PluginConfigurationSectionBase) });
                if (ctor == null) throw new PluginNotFoundException(pi.type);
                PluginConfigurationSectionBase psec = cg.Sections[pi.attr.conf_section] as PluginConfigurationSectionBase;
                IPlugin plugin = (IPlugin)ctor.Invoke(new object[] { psec });
                Plugins.Add(pi.t.FullName, plugin);
                plugin.AddHooks(this);
            }
        }
        private void UnloadPlugins()
        {
            foreach (KeyValuePair<string, IPlugin> plugin in Plugins)
            {
                plugin.Value.RemoveHooks(this);
            }
            Plugins.Clear();
        }
    }
    /// <summary>
    /// a plugin is not found
    /// </summary>
    public class PluginNotFoundException : Exception
    {
        string type;
        public PluginNotFoundException(string type) { this.type = type; }
        public override string Message { get { return "plugin " + type + " is not found"; } }
    }
    /// <summary>
    /// a plugin depends on another plugin which is not loaded
    /// </summary>
    public class PluginDependencyFailureException : Exception
    {
        string type; string depends;
        public PluginDependencyFailureException(string type, string depends) { this.type = type; this.depends = depends; }
        public override string Message { get { return "plugin " + type + " depends on " + depends + ", but " + depends + " is not loaded"; } }
    }
}
