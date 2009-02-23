using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Xml.Linq;
using System.Net;
using System.Text.RegularExpressions;

namespace yoursunny.P2008.hProxyN
{
    public partial class ACL : IPlugin
    {
        public class SimpleConditions
        {
            public void Register(ACL acl)
            {
                acl.RegisterConditionEvaluator("client", new ACLConditionEvaluator(TestClientCondition));
                acl.RegisterConditionEvaluator("server", new ACLConditionEvaluator(TestServerCondition));
                acl.RegisterConditionEvaluator("method", new ACLConditionEvaluator(TestMethodCondition));
                acl.RegisterConditionEvaluator("url", new ACLConditionEvaluator(TestUrlCondition));
                acl.RegisterConditionEvaluator("referer", new ACLConditionEvaluator(TestRefererCondition));
                acl.RegisterConditionEvaluator("user", new ACLConditionEvaluator(TestUserCondition));
            }
            /// <summary>
            /// determines whether IP is in the subnet of {subnet,mask}
            /// </summary>
            bool CompareSubnet(IPAddress ip, IPAddress subnet, IPAddress mask)
            {
                if (ip == null) return false;
                byte[] nip = ip.GetAddressBytes();
                byte[] nsubnet = subnet.GetAddressBytes();
                byte[] nmask = mask.GetAddressBytes();
                int len = nsubnet.Length;
                if (nip.Length != len || len != nmask.Length) return false;
                for (int i = 0; i < len; ++i)
                {
                    if ((nip[i] & nmask[i]) != (nsubnet[i] & nmask[i])) return false;
                }
                return true;
            }
            /// <summary>
            /// test a client subnet condition
            /// </summary>
            bool TestClientCondition(XElement condition, ACLArgs a)
            {
                // <client subnet=".." mask=".."/> currently IPv4-only
                return CompareSubnet(a.client.Address, IPAddress.Parse(condition.Attribute("subnet").Value), IPAddress.Parse(condition.Attribute("mask").Value));
            }
            /// <summary>
            /// test a hostname or host subnet condition
            /// </summary>
            bool TestServerCondition(XElement condition, ACLArgs a)
            {
                // <server domain=".."/>
                // <server host=".."/>
                // <server port=".."/>
                // <server subnet=".." mask=".."/> currently IPv4-only
                if (condition.Attribute("domain") != null)
                {
                    string domain = condition.Attribute("domain").Value;
                    string h = a.url.Host;
                    if (h == domain || h.EndsWith("." + domain)) return true;
                }
                else if (condition.Attribute("host") != null)
                {
                    if (a.url.Host == condition.Attribute("host").Value) return true;
                }
                else if (condition.Attribute("port") != null)
                {
                    if (a.url.Port == int.Parse(condition.Attribute("port").Value)) return true;
                }
                else if (condition.Attribute("subnet") != null)
                {
                    if (CompareSubnet(a.ServerIP, IPAddress.Parse(condition.Attribute("subnet").Value), IPAddress.Parse(condition.Attribute("mask").Value))) return true;
                }
                return false;
            }
            /// <summary>
            /// test an HTTP method condition
            /// </summary>
            bool TestMethodCondition(XElement condition, ACLArgs a)
            {
                // <method name="http-method"/>
                if (a.method == condition.Attribute("name").Value) return true;
                return false;
            }
            /// <summary>
            /// test a url path and query condition
            /// </summary>
            bool TestUrlCondition(XElement condition, ACLArgs a)
            {
                // <url pattern="regex"/>
                string u = a.url.GetComponents(UriComponents.PathAndQuery, UriFormat.SafeUnescaped);
                Regex regex = new Regex("^" + condition.Attribute("pattern").Value + "$", RegexOptions.ECMAScript);
                if (regex.IsMatch(u)) return true;
                return false;
            }
            /// <summary>
            /// test a full referer url condition
            /// </summary>
            bool TestRefererCondition(XElement condition, ACLArgs a)
            {
                // <referer pattern="regex"/>
                string u = a.referer;
                Regex regex = new Regex("^" + condition.Attribute("pattern").Value + "$", RegexOptions.ECMAScript);
                if (regex.IsMatch(u)) return true;
                return false;
            }
            /// <summary>
            /// test a username condition
            /// </summary>
            bool TestUserCondition(XElement condition, ACLArgs a)
            {
                // <user list="user1, ... ,userN"/>
                string[] l = condition.Attribute("list").Value.Split(',');
                if (l.Contains(a.user)) return true;
                return false;
            }
        }
    }
}
