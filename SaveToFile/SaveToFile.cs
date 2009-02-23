using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.IO.Compression;
using System.Configuration;
using System.Net;
using Covidimus.IO;
using System.Collections.Specialized;
using System.Web;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// save every successful response to disk
    /// </summary>
    [Plugin("SaveToFile", "SaveToFile", "yoursunny.P2008.hProxyN.SaveToFileConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public class SaveToFile : HttpProxyExtension, IPlugin
    {
        SaveToFileConfigurationSection sec;
        public SaveToFile(PluginConfigurationSectionBase sec)
        {
            this.sec = (SaveToFileConfigurationSection)sec;
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerStart += new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerStart -= new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public override Stream FilterResponseIn(HttpProxyContext context, Stream s)
        {
            if (context.InboundRequestCanceled) return s;
            HttpWebResponse resp = context.resp;
            if (resp.Method != "GET" || resp.StatusCode != HttpStatusCode.OK) return s;
            string fname = sec.GetPath(context.e.Url, resp.ContentType);
            FileInfo fi;
            try { fi = new FileInfo(fname); }
            catch (PathTooLongException) { return s; }
            if (fi.Exists && !sec.Overwrite) return s;
            fi.Directory.CreateAll();
            Stream fs;
            try { fs = fi.OpenWrite(); }
            catch (IOException) { return s; }
            /* if another IHttpProxyExtension is also decompressing the stream, errors may occur; moving this feature to HttpProxy
            if (sec.Decompress)
            {
                switch (resp.ContentEncoding)
                {
                    case "gzip":
                        e.Response.Headers[HttpResponseHeader.ContentEncoding] = "";
                        s = new GZipStream(s, CompressionMode.Decompress);
                        break;
                    case "deflate":
                        e.Response.Headers[HttpResponseHeader.ContentEncoding] = "";
                        s = new DeflateStream(s, CompressionMode.Decompress);
                        break;
                }
            }
             */
            return new EchoStream(s, fs, EchoStream.StreamOwnership.OwnBoth);
        }
    }
    /// <summary>
    /// SaveToFile element
    /// </summary>
    public class SaveToFileConfigurationSection : PluginConfigurationSectionBase
    {
        public SaveToFileConfigurationSection()
        {
            InvalidFileNameChars = (from ch in Path.GetInvalidFileNameChars() select ch.ToString()).ToArray();
        }
        /// <summary>
        /// root path for saving responses
        /// </summary>
        [ConfigurationProperty("path")]
        public string path
        {
            get { return (string)this["path"]; }
        }
        /*
        /// <summary>
        /// whether to decompress gzip and deflate entity
        /// </summary>
        /// <remarks>if set to true, decompressed entity would also be sent to user-agent</remarks>
        [ConfigurationProperty("Decompress")]
        public bool Decompress
        {
            get { return (bool)this["Decompress"]; }
        }*/
        /// <summary>
        /// whether to include query-string in saved filename
        /// </summary>
        [ConfigurationProperty("KeepQueryString")]
        public bool KeepQueryString
        {
            get { return (bool)this["KeepQueryString"]; }
        }
        /// <summary>
        /// whether to overwrite if a response is already saved
        /// </summary>
        /// <remarks>if set to false, new response for the same url won't be saved</remarks>
        [ConfigurationProperty("Overwrite")]
        public bool Overwrite
        {
            get { return (bool)this["Overwrite"]; }
        }
        string[] InvalidFileNameChars;
        string GetValidFileName(string s)
        {
            foreach (string ch in InvalidFileNameChars) s = s.Replace(ch, "");
            return s;
        }
        /// <summary>
        /// get full pathname for the saved file of a url
        /// </summary>
        public string GetPath(Uri u, string ContentType)
        {
            string fname = Path.Combine(path, u.Host + "_" + u.Port.ToString() + "/" + u.GetComponents(UriComponents.Path, UriFormat.SafeUnescaped));
            if (KeepQueryString)
            {
                NameValueCollection query = HttpUtility.ParseQueryString(u.Query);
                var q = from string key in query.Keys select key + "-" + query[key];
                if (q.Count() > 0)
                {
                    string s = string.Join("-", q.ToArray());
                    string fpath = Path.GetDirectoryName(fname);
                    string fext = Path.GetExtension(fname);
                    fname = Path.GetFileNameWithoutExtension(fname);
                    fname = Path.ChangeExtension(fname + "-" + GetValidFileName(s), fext);
                    fname = Path.Combine(fpath, fname);
                }
            }
            if (Path.GetFileName(fname) == "")
            {
                string index_name = "htm";
                switch (ContentType.ToLower())
                {
                    case "text/plain": index_name = "txt"; break;
                    case "image/jpeg": index_name = "jpg"; break;
                    case "image/gif": index_name = "gif"; break;
                    case "image/png": index_name = "png"; break;
                }
                fname = Path.Combine(fname, "index." + index_name);
            }
            return fname;
        }
    }
}
