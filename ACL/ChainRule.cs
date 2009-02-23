using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;

namespace yoursunny.P2008.hProxyN
{
    public partial class ACL : IPlugin
    {
        /// <summary>
        /// entry chain name; this chain is entered first
        /// </summary>
        const string chain_MAIN = "MAIN";
        /// <summary>
        /// target name for accepting a request
        /// </summary>
        const string target_ACCEPT = "ACCEPT";
        /// <summary>
        /// target name for denying a request
        /// </summary>
        const string target_DENY = "DENY";
        /// <summary>
        /// run a rule chain
        /// </summary>
        /// <param name="chain">a chain element</param>
        /// <returns>target</returns>
        string RunChain(XElement chain, ACLArgs a)
        {
            if (chain == null) return target_DENY;
            var rules = chain.Elements("rule");
            foreach (XElement rule in rules)
            {
                string t = RunRule(rule, a);
                if (t != null) return t;
            }
            return target_DENY;
        }
        /// <summary>
        /// run a rule
        /// </summary>
        /// <param name="rule">a rule element</param>
        /// <returns>target, or null if condition not met</returns>
        string RunRule(XElement rule, ACLArgs a)
        {
            if (rule == null) return target_DENY;
            XElement condition = rule.Element("condition");
            XElement action = rule.Element("action");
            if (condition != null)
            {
                if (!TestAndGroup(condition.Elements(), a)) return null;
            }
            if (action == null) return target_DENY;
            return action.Attribute("target").Value;
        }
    }
}
