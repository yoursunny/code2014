using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Globalization;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// log format provider for NCSA
    /// </summary>
    /// <remarks>fields is ignored, because NCSA is a fixed-field format</remarks>
    public abstract class NCSALogFormat : LogFormatBase
    {
        //NCSA HTTPd http://hoohoo.ncsa.uiuc.edu/
        protected static string[] Fields_Common;
        protected static string[] Fields_Combined;
        private static CultureInfo culture_en;
        static NCSALogFormat()
        {
            Fields_Common = new string[] { "RemoteHostName", "RemoteLogName", "UserName", "DateTime", "Request", "StatusCode", "BytesSent" };
            Fields_Combined = new string[] { "RemoteHostName", "RemoteLogName", "UserName", "DateTime", "Request", "StatusCode", "BytesSent", "Referer", "User-Agent", "Cookie" };
            culture_en = CultureInfo.GetCultureInfo("en-us");
        }
        public override string[] GetHeader()
        {
            return new string[] { };
        }
        public string GetValue(LogEntry entry, string key)
        {
            object v = null;
            switch (key)
            {
                case "RemoteHostName": v = entry.client_ip; break;
                case "RemoteLogName": break;
                case "UserName": v = entry.username; break;
                case "DateTime": v = entry.time_start.ToString("[dd/MMM/yyyy:HH:mm:ss +0000]", culture_en); break;
                case "Request": v = "\"" + entry.method + " " + entry.url.PathAndQuery + " " + entry.http_version + "\""; break;
                case "StatusCode": v = entry.status; break;
                case "BytesSent": v = entry.sent_bytes.HasValue ? (object)entry.sent_bytes.Value : null; break;
                case "Referer": v = "\"" + entry.referer + "\""; break;
                case "User-Agent": v = "\"" + entry.user_agent + "\""; break;
                case "Cookie": v = "\"" + entry.cookie + "\""; break;
            }
            if (v == null) return "-";
            else
            {
                string s = v.ToString();
                return (string.IsNullOrEmpty(s)) ? "-" : s;
            }
        }
    }
    /// <summary>
    /// log format provider for NCSA Common
    /// </summary>
    public class NCSACommonLogFormat : NCSALogFormat
    {
        public override bool ValidField(string field)
        {
            return Fields_Common.Contains(field);
        }
        public override string FormatEntry(LogEntry entry)
        {
            List<string> l = new List<string>();
            foreach (string key in Fields_Common) l.Add(GetValue(entry, key));
            return string.Join(" ", l.ToArray());
        }
    }
    /// <summary>
    /// log format provider for NCSA Combined
    /// </summary>
    public class NCSACombinedLogFormat : NCSALogFormat
    {
        public override bool ValidField(string field)
        {
            return Fields_Combined.Contains(field);
        }
        public override string FormatEntry(LogEntry entry)
        {
            List<string> l = new List<string>();
            foreach (string key in Fields_Combined) l.Add(GetValue(entry, key));
            return string.Join(" ", l.ToArray());
        }
    }
}
