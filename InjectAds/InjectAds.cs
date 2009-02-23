using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Collections.Specialized;
using System.IO;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// an example plugin which injects ads code into pages
    /// </summary>
    [Plugin("InjectAds", "InjectAds", "yoursunny.P2008.hProxyN.InjectAdsConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public class InjectAds : HttpProxyExtension, IPlugin
    {
        string[] AcceptedContentType;
        InjectAdsConfigurationSection sec;
        public InjectAds(PluginConfigurationSectionBase sec)
        {
            AcceptedContentType = new string[] { "text/html" };
            this.sec = (InjectAdsConfigurationSection)sec;
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerStart += new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerStart -= new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public override Stream FilterResponseOut(HttpProxyContext context, Stream s)
        {
            if (context.ResponseEntityCompressed || context.InboundRequestCanceled || !AcceptedContentType.Contains(LogEntry.GetContentType(context.resp.ContentType))) return s;
            string url = context.Url.AbsoluteUri;
            var q = from InjectAdsConfigurationElement ele in sec.Injects where url.StartsWith(ele.prefix) select ele;
            if (q.Count() < 1) return s;
            InjectAdsConfigurationElement ce = q.First();
            if (ce.location == InjectAdsLocation.None) return s;
            Encoding enc;
            try { enc = Encoding.GetEncoding(context.resp.CharacterSet); }
            catch (ArgumentException) { return s; }
            return new InjectAdsStream(s, ce.location, ce.code, enc);
        }
    }
    /// <summary>
    /// a stream to inject ads in text/html entities
    /// </summary>
    public class InjectAdsStream : Stream
    {
        public InjectAdsStream(Stream s, InjectAdsLocation location, string code, Encoding enc)
        {
            if (s == null) throw new ArgumentNullException();
            if (!s.CanWrite) throw new ArgumentException();
            this.s = s;
            this.location = location;
            this.code = code;
            this.enc = enc;
            switch (location)
            {
                case InjectAdsLocation.Top:
                    break;
                case InjectAdsLocation.HEADbottom:
                case InjectAdsLocation.BODYtop:
                case InjectAdsLocation.BODYbottom:
                    ms = new MemoryStream();
                    b = new StringBuilder();
                    break;
                case InjectAdsLocation.Bottom:
                    injected = true;//actually not injected, just to make Write faster
                    break;
            }
        }
        bool injected;
        Stream s;
        InjectAdsLocation location;
        string code;
        Encoding enc;
        MemoryStream ms;
        StringBuilder b;
        public override bool CanRead { get { return false; } }
        public override bool CanSeek { get { return false; } }
        public override bool CanWrite { get { return true; } }
        public override void Flush() { s.Flush(); }
        public override long Length { get { throw new NotSupportedException(); } }
        public override long Position
        {
            get { throw new NotSupportedException(); }
            set { throw new NotSupportedException(); }
        }
        public override int Read(byte[] buffer, int offset, int count) { throw new NotSupportedException(); }
        public override long Seek(long offset, SeekOrigin origin) { throw new NotSupportedException(); }
        public override void SetLength(long value) { throw new NotSupportedException(); }
        public override void Write(byte[] buffer, int offset, int count)
        {
            if (injected) { s.Write(buffer, offset, count); return; }
            if (location == InjectAdsLocation.Top)
            {
                WriteCode();
                s.Write(buffer, offset, count);
                return;
            }
            if (ms.Length > 4096)
            {
                ms.Seek(0, SeekOrigin.Begin);
                ms.CopyTo(s, ms.Length - 256);
                MemoryStream mm = new MemoryStream();
                ms.CopyTo(mm);
                ms.Dispose();
                ms = mm;
            }
            if (b.Length > 4096)
            {
                b.Remove(0, b.Length - 256);
            }
            ms.Write(buffer, offset, count);
            b.Append(enc.GetString(buffer, offset, count));
            string bb = b.ToString();
            int pos, pos2;
            switch (location)
            {
                case InjectAdsLocation.HEADbottom:
                    if ((pos = bb.IndexOf("</head", StringComparison.OrdinalIgnoreCase)) >= 0)
                    {
                        WriteString(bb.Remove(pos));
                        WriteCode();
                        WriteString(bb.Substring(pos));
                    }
                    break;
                case InjectAdsLocation.BODYtop:
                    if ((pos = bb.IndexOf("<body", StringComparison.OrdinalIgnoreCase)) >= 0)
                    {
                        if ((pos2 = bb.IndexOf(">", pos)) >= 0)
                        {
                            WriteString(bb.Remove(pos2 + 1));
                            WriteCode();
                            WriteString(bb.Substring(pos2 + 1));
                        }
                    }
                    break;
                case InjectAdsLocation.BODYbottom:
                    if ((pos = bb.IndexOf("</body", StringComparison.OrdinalIgnoreCase)) >= 0)
                    {
                        WriteString(bb.Remove(pos));
                        WriteCode();
                        WriteString(bb.Substring(pos));
                    }
                    break;
            }
            if (injected)
            {
                ms.Dispose(); ms = null;
                b = null;
            }
        }
        public override void Close()
        {
            if (ms != null)
            {
                ms.Seek(0, SeekOrigin.Begin);
                ms.CopyTo(s);
            }
            if (location == InjectAdsLocation.Bottom)
            {
                WriteCode();
            }
            s.Close();
            base.Close();
        }
        void WriteString(string t)
        {
            byte[] c = enc.GetBytes(t);
            s.Write(c, 0, c.Length);
        }
        void WriteCode()
        {
            WriteString(code);
            injected = true;
        }
    }
    /// <summary>
    /// InjectAds element
    /// </summary>
    public class InjectAdsConfigurationSection : PluginConfigurationSectionBase
    {
        [ConfigurationProperty("Injects")]
        public InjectAdsConfigurationCollection Injects
        {
            get { return (InjectAdsConfigurationCollection)this["Injects"]; }
        }
    }
    /// <summary>
    /// selects where to inject ad code
    /// </summary>
    public enum InjectAdsLocation
    {
        /// <summary>
        /// don't inject this ad
        /// </summary>
        None,
        /// <summary>
        /// before the first line
        /// </summary>
        Top,
        /// <summary>
        /// just before /HEAD
        /// </summary>
        HEADbottom,
        /// <summary>
        /// just after BODY
        /// </summary>
        BODYtop,
        /// <summary>
        /// just before /BODY
        /// </summary>
        BODYbottom,
        /// <summary>
        /// after the last line
        /// </summary>
        Bottom
    }
    /// <summary>
    /// inject element
    /// </summary>
    public class InjectAdsConfigurationElement : ConfigurationElement
    {
        /// <summary>
        /// url prefix
        /// </summary>
        [ConfigurationProperty("prefix")]
        public string prefix
        {
            get { return (string)this["prefix"]; }
        }
        /// <summary>
        /// location to inject code
        /// </summary>
        [ConfigurationProperty("location")]
        public InjectAdsLocation location
        {
            get { return (InjectAdsLocation)this["location"]; }
        }
        /// <summary>
        /// ad code
        /// </summary>
        [ConfigurationProperty("code")]
        public string code
        {
            get { return (string)this["code"]; }
        }
    }
    /// <summary>
    /// Injects element
    /// </summary>
    public class InjectAdsConfigurationCollection : ConfigurationElementCollection
    {
        public override ConfigurationElementCollectionType CollectionType
        {
            get { return ConfigurationElementCollectionType.BasicMap; }
        }
        protected override string ElementName
        {
            get { return "inject"; }
        }
        protected override ConfigurationElement CreateNewElement()
        {
            return new InjectAdsConfigurationElement();
        }
        protected override object GetElementKey(ConfigurationElement element)
        {
            return ((InjectAdsConfigurationElement)element).prefix;
        }
        public InjectAdsConfigurationElement this[int index]
        {
            get { return (InjectAdsConfigurationElement)BaseGet(index); }
        }
    }
}
