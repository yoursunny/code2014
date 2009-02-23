using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Collections.Specialized;
using System.IO;
using System.Net;
using System.Web;
using System.Web.Hosting;
using System.Threading;

namespace yoursunny.P2008.hProxyN
{
    public class AspNetHost : MarshalByRefObject
    {
        string vpath;
        string path;
        public void Init(string vpath, string path)
        {
            this.vpath = vpath;
            this.path = path;
        }
        public void Handler(string method, Uri u, NameValueCollection reqHeaders, IPEndPoint remoteEP, Stream reqBody, out int status, out NameValueCollection respHeaders, out Stream respBody)
        {
            WorkerRequest wr = new WorkerRequest();
            wr.vpath = vpath;
            wr.path = path;
            wr.method = method;
            wr.u = u;
            wr.reqHeaders = reqHeaders;
            wr.remoteEP = remoteEP;
            wr.reqBody = reqBody;
            wr.status = 200;
            wr.respHeaders = new NameValueCollection();
            wr.respBody = new MemoryStream();
            DateTime now = DateTime.Now;
            HttpRuntime.ProcessRequest(wr);
            while (!wr.Finished)
            {
                Thread.Sleep(100);
                if ((DateTime.Now - now).TotalSeconds > 60) break;
            }
            status = wr.status;
            respHeaders = wr.respHeaders;
            respBody = wr.respBody;
        }
        public class WorkerRequest : HttpWorkerRequest
        {
            public string vpath;
            public string path;
            public string method;
            public Uri u;
            public NameValueCollection reqHeaders;
            public IPEndPoint remoteEP;
            public Stream reqBody;
            public int status;
            public NameValueCollection respHeaders;
            public Stream respBody;
            bool finished;
            object _sync;
            public WorkerRequest()
            {
                _sync = new object();
            }
            public bool Finished { get { lock (_sync) { return finished; } } }
            //required
            public override void EndOfRequest()
            {
                lock (_sync) { finished = true; }
            }
            public override void FlushResponse(bool finalFlush)
            {
            }
            public override string GetHttpVerbName()
            {
                return method;
            }
            public override string GetHttpVersion()
            {
                return "HTTP/1.1";
            }
            public override string GetLocalAddress()
            {
                return "127.0.0.1";
            }
            public override int GetLocalPort()
            {
                return 80;
            }
            public override string GetQueryString()
            {
                return u.Query;
            }
            public override string GetRawUrl()
            {
                return u.ToString();
            }
            public override string GetRemoteAddress()
            {
                return remoteEP.Address.ToString();
            }
            public override int GetRemotePort()
            {
                return remoteEP.Port;
            }
            public override string GetUriPath()
            {
                return u.AbsolutePath;
            }
            public override void SendKnownResponseHeader(int index, string value)
            {
                respHeaders[HttpWorkerRequest.GetKnownResponseHeaderName(index)] = value;
            }
            public override void SendResponseFromFile(IntPtr handle, long offset, long length)
            {
                Microsoft.Win32.SafeHandles.SafeFileHandle sfh = new Microsoft.Win32.SafeHandles.SafeFileHandle(handle, true);
                Stream fs = new FileStream(sfh, FileAccess.Read);
                fs.Position = offset;
                fs.CopyTo(respBody, length);
                fs.Close();
            }
            public override void SendResponseFromFile(string filename, long offset, long length)
            {
                Stream fs = File.OpenRead(filename);
                fs.Position = offset;
                fs.CopyTo(respBody, length);
                fs.Close();
            }
            public override void SendResponseFromMemory(byte[] data, int length)
            {
                respBody.Write(data, 0, length);
            }
            public override void SendStatus(int statusCode, string statusDescription)
            {
                status = statusCode;
            }
            public override void SendUnknownResponseHeader(string name, string value)
            {
                respHeaders[name] = value;
            }
            //additional
            public override string GetAppPath()
            {
                return vpath;
            }
            public override string GetAppPathTranslated()
            {
                return path;
            }
            public override int ReadEntityBody(byte[] buffer, int size)
            {
                return reqBody.Read(buffer, 0, size);
            }
            public override string GetKnownRequestHeader(int index)
            {
                return reqHeaders[HttpWorkerRequest.GetKnownRequestHeaderName(index)];
            }
            public override string GetUnknownRequestHeader(string name)
            {
                return reqHeaders[name];
            }
            public override string[][] GetUnknownRequestHeaders()
            {
                string[][] unknownRequestHeaders;
                int count = reqHeaders.Count;
                List<string[]> headerPairs = new List<string[]>(count);
                for (int i = 0; i < count; i++)
                {
                    string headerName = reqHeaders.GetKey(i);
                    if (GetKnownRequestHeaderIndex(headerName) == -1)
                    {
                        string headerValue = reqHeaders.Get(i);
                        headerPairs.Add(new string[] { headerName, headerValue });
                    }
                }
                unknownRequestHeaders = headerPairs.ToArray();
                return unknownRequestHeaders;
            }
            public override int GetTotalEntityBodyLength()
            {
                return Convert.ToInt32(reqBody.Length);
            }
        }
    }
}
