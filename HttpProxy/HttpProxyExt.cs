using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    //another half, for extension
    public partial class HttpProxy : IPlugin
    {
        List<IHttpProxyExtension> extensions;
        /// <summary>
        /// register an extension to HttpProxy
        /// </summary>
        /// <param name="ext"></param>
        [CallablePluginMethod]
        public void RegisterExtension(IHttpProxyExtension ext)
        {
            if (!extensions.Contains(ext)) extensions.Add(ext);
        }
        /// <summary>
        /// cancel inbound request
        /// </summary>
        /// <remarks>
        /// if inbound request is canceled,
        /// request stream is passed through all extensions and discarded,
        /// one extension should provide a stream in FilterResponseIn
        /// </remarks>
        [CallablePluginMethod]
        public void CancelInboundRequest(HttpProxyContext context)
        {
            if (context.InboundRequestCanceled) return;
            context.InboundRequestCanceled = true;
            if (context.InboundRequestStarted)
            {
                try { context.req.Abort(); }
                catch { }
            }
        }
        void CallBeforeRequest(HttpProxyContext context)
        {
            foreach (IHttpProxyExtension ext in extensions) ext.BeforeRequest(context);
        }
        Stream CallFilterRequestIn(HttpProxyContext context, Stream s)
        {
            foreach (IHttpProxyExtension ext in extensions) s = ext.FilterRequestIn(context, s);
            return s;
        }
        /*
        Stream CallFilterRequestOut(HttpProxyContext context, Stream s)
        {
            foreach (IHttpProxyExtension ext in extensions) s = ext.FilterRequestOut(context, s);
            return s;
        }
         */
        void CallAfterRequest(HttpProxyContext context)
        {
            foreach (IHttpProxyExtension ext in extensions) ext.AfterRequest(context);
        }
        void CallBeforeResponse(HttpProxyContext context)
        {
            foreach (IHttpProxyExtension ext in extensions) ext.BeforeResponse(context);
        }
        Stream CallFilterResponseIn(HttpProxyContext context, Stream s)
        {
            foreach (IHttpProxyExtension ext in extensions) s = ext.FilterResponseIn(context, s);
            return s;
        }
        Stream CallFilterResponseOut(HttpProxyContext context, Stream s)
        {
            foreach (IHttpProxyExtension ext in extensions) s = ext.FilterResponseOut(context, s);
            return s;
        }
        void CallAfterResponse(HttpProxyContext context)
        {
            foreach (IHttpProxyExtension ext in extensions) ext.AfterResponse(context);
        }
    }
    /// <summary>
    /// interface of a HttpProxy extension
    /// </summary>
    public interface IHttpProxyExtension
    {
        /// <param name="context">note: resp is not usable</param>
        void BeforeRequest(HttpProxyContext context);
        /// <summary>
        /// gets a request stream to read from
        /// </summary>
        /// <param name="s">original request stream</param>
        Stream FilterRequestIn(HttpProxyContext context, Stream s);
        //we can't have FilterRequestOut because we won't be able to set Content-Length after calling GetRequestStream
        //Stream FilterRequestOut(HttpProxyContext context, Stream s) { return s; }
        /// <param name="context">note: resp is not usable</param>
        void AfterRequest(HttpProxyContext context);
        void BeforeResponse(HttpProxyContext context);
        /// <summary>
        /// gets a response stream to read from
        /// </summary>
        /// <param name="s">original response stream</param>
        Stream FilterResponseIn(HttpProxyContext context, Stream s);
        /// <summary>
        /// gets a response stream to write to
        /// </summary>
        /// <param name="s">original response stream</param>
        Stream FilterResponseOut(HttpProxyContext context, Stream s);
        void AfterResponse(HttpProxyContext context);
    }
    /// <summary>
    /// base class for a HttpProxy extension
    /// </summary>
    /// <remarks>this is provided, so implementors of IHttpProxyExtension won't have to implement every method</remarks>
    public abstract class HttpProxyExtension : IHttpProxyExtension
    {
        public virtual void BeforeRequest(HttpProxyContext context) { }
        public virtual Stream FilterRequestIn(HttpProxyContext context, Stream s) { return s; }
        //public virtual Stream FilterRequestOut(HttpProxyContext context, Stream s) { return s; }
        public virtual void AfterRequest(HttpProxyContext context) { }
        public virtual void BeforeResponse(HttpProxyContext context) { }
        public virtual Stream FilterResponseIn(HttpProxyContext context, Stream s) { return s; }
        public virtual Stream FilterResponseOut(HttpProxyContext context, Stream s) { return s; }
        public virtual void AfterResponse(HttpProxyContext context) { }
        protected void RegisterExtension(object sender, RequestListenerEventArgs e)
        {
            RequestListener listener = (RequestListener)sender;
            listener.CallPluginMethod("yoursunny.P2008.hProxyN.HttpProxy", "RegisterExtension", new object[] { this });
        }
    }
}
