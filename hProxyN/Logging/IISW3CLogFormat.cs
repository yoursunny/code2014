using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// log format provider for IISW3C
    /// </summary>
    public class IISW3CLogFormat : LogFormatBase
    {
        private static string[] ValidFields;
        static IISW3CLogFormat()
        {
            ValidFields = new string[] { "date", "time", "c-ip", "cs-username", "s-sitename", "s-computername", "s-ip", "s-port", "cs-method", "cs-uri-stem", "cs-uri-query", "sc-status", "sc-substatus", "sc-win32-status", "sc-bytes", "cs-bytes", "time-taken", "cs-version", "cs-host", "cs(User-Agent)", "cs(Cookie)", "cs(Referer)" };
        }
        public override bool ValidField(string field)
        {
            return ValidFields.Contains(field);
        }
        public override string[] GetHeader()
        {
            return new string[] { "#Software: hProxyN", "#Fields: " + string.Join(" ", fields) };
        }
        public override string FormatEntry(LogEntry entry)
        {
            List<string> l = new List<string>();
            foreach (string key in fields) l.Add(GetValue(entry, key));
            return string.Join(" ", l.ToArray());
        }
        public string GetValue(LogEntry entry, string key)
        {
            object v = null;
            switch (key)
            {
                case "date": v = entry.time_start.ToString("yyyy-MM-dd"); break;
                case "time": v = entry.time_start.ToString("HH:mm:ss"); break;
                case "c-ip": v = entry.client_ip; break;
                case "cs-username": v = entry.username; break;
                case "s-sitename": break;
                case "s-computername": v = Environment.MachineName; break;
                case "s-ip": v = entry.server_ip; break;
                case "s-port": v = entry.server_port; break;
                case "cs-method": v = entry.method; break;
                case "cs-uri-stem": v = entry.url_path; break;
                case "cs-uri-query": v = entry.url_query; break;
                case "sc-status": v = entry.status; break;
                case "sc-substatus": break;
                case "sc-win32-status": break;
                case "sc-bytes": v = entry.sent_bytes.HasValue ? (object)entry.sent_bytes.Value : null; break;
                case "cs-bytes": v = entry.received_bytes.HasValue ? (object)entry.received_bytes.Value : null; break;
                case "time-taken": v = Convert.ToInt32(entry.time_taken.TotalMilliseconds); break;
                case "cs-version": v = entry.http_version; break;
                case "cs-host": v = entry.url_host; break;
                case "cs(User-Agent)": v = entry.user_agent; break;
                case "cs(Cookie)": v = entry.cookie; break;
                case "cs(Referer)": v = entry.referer; break;
            }
            if (v == null) return "-";
            else
            {
                string s = v.ToString();
                return (string.IsNullOrEmpty(s)) ? "-" : s.Replace(" ", "+");
            }
        }
    }
}
