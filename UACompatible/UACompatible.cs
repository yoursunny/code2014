using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Text.RegularExpressions;

namespace yoursunny.P2008.hProxyN
{
    [Plugin("UACompatible", "UACompatible", "yoursunny.P2008.hProxyN.EmptyPluginConfigurationSection")]
    [DependOnPlugin("yoursunny.P2008.hProxyN.HttpProxy")]
    public class UACompatible : HttpProxyExtension, IPlugin
    {
        string[] ModifyContentType;
        public UACompatible(PluginConfigurationSectionBase sec)
        {
            ModifyContentType = new string[] { "text/html" };
        }
        public void AddHooks(RequestListener listener)
        {
            listener.ListenerStart += new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public void RemoveHooks(RequestListener listener)
        {
            listener.ListenerStart -= new EventHandler<RequestListenerEventArgs>(RegisterExtension);
        }
        public override void BeforeResponse(HttpProxyContext context)
        {
            context.Response.Headers["X-UA-Compatible"] = "";
        }
        public override Stream FilterResponseOut(HttpProxyContext context, Stream s)
        {
            if (context.ResponseEntityCompressed || context.InboundRequestCanceled || !ModifyContentType.Contains(LogEntry.GetContentType(context.resp.ContentType))) return s;
            Encoding enc;
            try { enc = Encoding.GetEncoding(context.resp.CharacterSet); }
            catch (ArgumentException) { return s; }
            return new UACompatibleStream(s, enc);
        }
    }
    /// <summary>
    /// a stream to remove X-UA-Compatible meta tag in text/html entities
    /// </summary>
    public class UACompatibleStream : Stream
    {
        Regex meta_xuc;
        public UACompatibleStream(Stream s, Encoding enc)
        {
            if (s == null) throw new ArgumentNullException();
            if (!s.CanWrite) throw new ArgumentException();
            meta_xuc = new Regex("<meta[^<>]*X-UA-Compatible[^<>]*>", RegexOptions.ECMAScript | RegexOptions.IgnoreCase);
            this.s = s;
            this.enc = enc;
            b = new StringBuilder();
        }
        bool injected;
        Stream s;
        Encoding enc;
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
            b.Append(enc.GetString(buffer, offset, count));
        }
        public override void Close()
        {
            string h = b.ToString();
            string t = meta_xuc.Replace(h, "<!-- X-UA-Compatible removed by hProxyN -->");
            byte[] c = enc.GetBytes(t);
            s.Write(c, 0, c.Length);
            s.Close();
            base.Close();
        }
    }
}
