using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Configuration;
using System.Collections.Specialized;

namespace yoursunny.P2008.hProxyN
{
    public static class LinqExtensionMethods
    {
        /*
        public static List<XmlNode> ToList(this XmlNodeList nl)
        {
            List<XmlNode> l = new List<XmlNode>();
            foreach (XmlNode n in nl) l.Add(n);
            return l;
        }
         */
        /// <summary>
        /// gets a prefix to use with HttpListener
        /// </summary>
        /// <remarks>only IPv4 and IPv6 are supported</remarks>
        public static string httpPrefix(this IPEndPoint ep)
        {
            if (ep.Address == IPAddress.Any) return "http://+:" + ep.Port.ToString() + "/";
            switch (ep.AddressFamily)
            {
                case System.Net.Sockets.AddressFamily.InterNetwork:
                    return "http://" + ep.Address.ToString() + ":" + ep.Port.ToString() + "/";
                case System.Net.Sockets.AddressFamily.InterNetworkV6:
                    return "http://[" + ep.Address.ToString() + "]:" + ep.Port.ToString() + "/";
                default:
                    throw new ArgumentOutOfRangeException();
            }
        }
        /// <summary>
        /// copy all content from source to target
        /// </summary>
        public static StreamCopyResult CopyTo(this Stream source, Stream target)
        {
            const int bufsize = 65536;
            StreamCopyResult r = new StreamCopyResult();
            int len;
            byte[] buffer = new byte[bufsize];
            try
            {
                while ((len = source.Read(buffer, 0, bufsize)) > 0)
                {
                    target.Write(buffer, 0, len);
                    r.total_length += len;
                }
            }
            catch (Exception ex) { r.exception = ex; }
            return r;
        }
        /// <summary>
        /// copy 'length' bytes of content from source to target
        /// </summary>
        /// <param name="idle_limit">max allowed idle time</param>
        public static StreamCopyResult CopyTo(this Stream source, Stream target, long length, TimeSpan idle_timeout)
        {
            StreamCopyResult r = new StreamCopyResult();
            if (length <= 0) return r;
            const int bufsize = 65536;
            int len;
            byte[] buffer = new byte[bufsize];
            DateTime now = DateTime.Now;
            DateTime got_data = now;
            try
            {
                while (true)
                {
                    int this_len = length < bufsize ? Convert.ToInt32(length) : bufsize;
                    len = source.Read(buffer, 0, this_len);
                    now = DateTime.Now;
                    if (len < 1)
                    {
                        if (now - got_data > idle_timeout) throw new TimeoutException();
                        continue;
                    }
                    got_data = now;
                    target.Write(buffer, 0, len);
                    length -= len;
                    r.total_length += len;
                    if (length < 1) break;
                }
            }
            catch (Exception ex) { r.exception = ex; }
            return r;
        }
        /// <summary>
        /// copy 'length' bytes of content from source to target
        /// </summary>
        public static StreamCopyResult CopyTo(this Stream source, Stream target, long length)
        {
            return source.CopyTo(target, length, new TimeSpan(0, 0, 10));
        }
        /// <summary>
        /// write a string as utf-8 to a stream
        /// </summary>
        public static void Write(this Stream s, string m)
        {
            byte[] b = Encoding.UTF8.GetBytes(m);
            s.Write(b, 0, b.Length);
        }
        /// <summary>
        /// copy all pairs in KeyValueConfigurationCollection to a new NameValueCollection
        /// </summary>
        public static NameValueCollection ToNameValueCollection(this KeyValueConfigurationCollection c)
        {
            NameValueCollection o = new NameValueCollection(c.Count);
            foreach (KeyValueConfigurationElement e in c) o.Add(e.Key, e.Value);
            return o;
        }
        /// <summary>
        /// create this directory and all its parents
        /// </summary>
        public static void CreateAll(this DirectoryInfo di)
        {
            if (di.Exists) return;
            di.Parent.CreateAll();
            di.Create();
        }
    }
    /// <summary>
    /// indicates the result of a CopyTo operation
    /// </summary>
    public class StreamCopyResult
    {
        public bool success { get { return exception == null; } }
        public Exception exception;
        public long total_length;
    }
}
