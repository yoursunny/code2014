using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents an entry to write to log
    /// </summary>
    public class LogEntry
    {
        /// <summary>
        /// The date and time on which the request was received (UTC)
        /// </summary>
        public DateTime time_start;
        /// <summary>
        /// The date and time on which the request was served (UTC)
        /// </summary>
        public DateTime time_stop;
        /// <summary>
        /// The time elapsed since the moment the server received the request to the moment the server sent the last response chunk to the client
        /// </summary>
        public TimeSpan time_taken { get { return time_stop - time_start; } }
        /// <summary>
        /// The IPEndPoint of the client that made the request
        /// </summary>
        public IPEndPoint client_ep;
        /// <summary>
        /// The IP address of the client that made the request
        /// </summary>
        public IPAddress client_ip { get { return client_ep.Address; } }
        /// <summary>
        /// The client port number that made the request
        /// </summary>
        public int client_port { get { return client_ep.Port; } }
        /// <summary>
        /// The IPEndPoint of the server that served the request
        /// </summary>
        public IPEndPoint server_ep;
        /// <summary>
        /// The IP address of the server that served the request
        /// </summary>
        public IPAddress server_ip { get { return server_ep.Address; } }
        /// <summary>
        /// The server port number that received the request
        /// </summary>
        public int server_port { get { return server_ep.Port; } }
        /// <summary>
        /// The number of bytes in the request sent by the client
        /// </summary>
        public long? received_bytes;
        /// <summary>
        /// The Content-Type header of request
        /// </summary>
        public string request_content_type;
        /// <summary>
        /// The number of bytes in the response sent by the server
        /// </summary>
        public long? sent_bytes;
        /// <summary>
        /// The Content-Type header of response
        /// </summary>
        public string response_content_type;
        /// <summary>
        /// The name of the authenticated user that made the request
        /// </summary>
        public string username;
        /// <summary>
        /// The HTTP request verb
        /// </summary>
        public string method;
        /// <summary>
        /// The HTTP version of the client request
        /// </summary>
        public Version version;
        /// <summary>
        /// The HTTP version of the client request, as a string
        /// </summary>
        public string http_version { get { try { return "HTTP/" + version.ToString(2); } catch { return null; } } }
        /// <summary>
        /// The HTTP request uri
        /// </summary>
        public Uri url;
        /// <summary>
        /// The client request Host header
        /// </summary>
        public string url_host { get { return url.GetComponents(url.IsDefaultPort ? UriComponents.Host : UriComponents.HostAndPort, UriFormat.SafeUnescaped); } }
        /// <summary>
        /// The HTTP request uri-stem
        /// </summary>
        public string url_path
        {
            get
            {
                string path = url.GetComponents(UriComponents.Path, UriFormat.SafeUnescaped);
                return path.StartsWith("/") ? path : "/" + path;
            }
        }
        /// <summary>
        /// The HTTP request uri-query
        /// </summary>
        public string url_query { get { return url.GetComponents(UriComponents.Query, UriFormat.SafeUnescaped); } }
        /// <summary>
        /// The response HTTP
        /// </summary>
        public int status;
        /// <summary>
        /// The client request User-Agent header
        /// </summary>
        public string user_agent;
        /// <summary>
        /// The client request Cookie header
        /// </summary>
        public string cookie;
        /// <summary>
        /// The client request Referer header
        /// </summary>
        public string referer;
        /// <summary>
        /// Get content_type from Content-Type header
        /// </summary>
        public static string GetContentType(string header)
        {
            // accepts: "text/html", "text/html; charset=utf-8", "application/rss+xml", strips charset
            if (string.IsNullOrEmpty(header)) return string.Empty;
            int pos = header.IndexOf(';');
            if (pos < 0) return header;
            else return header.Remove(pos);
        }
    }
}
