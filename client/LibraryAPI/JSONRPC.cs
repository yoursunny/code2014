using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using Newtonsoft.Json;
using System.IO;

namespace yoursunny.P2008.Library.API
{
    public static class JSONRPC
    {
        /// <summary>
        /// 应用服务器api的基础URL
        /// </summary>
        public static Uri baseUrl;
        /// <summary>
        /// 登录票据
        /// </summary>
        public static string ticket;
        /// <summary>
        /// 调用应用服务器api函数
        /// </summary>
        /// <param name="url">调用位置的相对URL</param>
        /// <param name="method">api方法</param>
        /// <param name="p">参数列表</param>
        /// <returns>执行结果</returns>
        public static object CallL(string url, string method, System.Collections.IList p)
        {
            if (baseUrl == null) baseUrl = new Uri(System.Configuration.ConfigurationManager.AppSettings["ServerUrl"]); 
            //计算URL
            Uri uri = new Uri(baseUrl, url);
            //准备请求对象
            Dictionary<string, object> request_o = new Dictionary<string, object>();
            request_o.Add("method", method);
            request_o.Add("params", p);
            request_o.Add("id", new Random().Next().ToString());
            string request_j = JavaScriptConvert.SerializeObject(request_o);
            //准备请求参数
            HttpWebRequest request_w = (HttpWebRequest)WebRequest.Create(uri);
            request_w.Method = WebRequestMethods.Http.Post;
            request_w.ContentType = "application/json";
            string assembly_version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version.ToString(4);
            request_w.UserAgent = "LibraryAPI/" + assembly_version + "(yoursunny.com 2008 library-api)";
            if (ticket != null)
            {
                request_w.CookieContainer = new CookieContainer(1);
                request_w.CookieContainer.Add(uri, new Cookie("library_api_ticket", ticket));
            }
            //发送请求
            byte[] request_b = Encoding.UTF8.GetBytes(request_j);
            request_w.ContentLength = request_b.LongLength;
            Stream request_s = request_w.GetRequestStream();
            request_s.Write(request_b, 0, request_b.Length);
            WebResponse response_w = request_w.GetResponse();
            //WebResponse response_w;
            //try { response_w = request_w.GetResponse(); }
            //catch (WebException ex)
            //{
            //    StreamReader r = new StreamReader(ex.Response.GetResponseStream());
            //    File.WriteAllText(@"E:\web\test\x.htm", r.ReadToEnd());
            //    throw ex;//for server debug
            //}
            //检查响应
            if (response_w.ContentType != "application/json")
                throw new ArgumentException("JSON-RPC响应格式不正确");
            StreamReader response_s = new StreamReader(response_w.GetResponseStream(), Encoding.UTF8);
            string response_j = response_s.ReadToEnd();
            //File.AppendAllText(@"E:\web\test\x.htm", response_j);//for server debug
            response_s.Close();
            //获取响应对象
            Dictionary<string, object> response_o = JavaScriptConvert.DeserializeObject(response_j) as Dictionary<string, object>;
            if (response_o == null || !response_o.ContainsKey("result") || !response_o.ContainsKey("error"))
                throw new ArgumentException("JSON-RPC响应格式不完整");
            object result = response_o["result"];
            Dictionary<string, object> error = response_o["error"] as Dictionary<string, object>;
            //对来自服务器的错误抛出异常
            if (error != null)
                if (!error.ContainsKey("type") || !error.ContainsKey("msg"))
                    throw new ArgumentException("JSON-RPC响应格式不完整");
                else throw new Error(error["type"].ToString(), error["msg"].ToString());
            return result;
        }
        /// <summary>
        /// 调用应用服务器API函数
        /// </summary>
        public static object Call(string url, string method, params object[] p)
        {
            return CallL(url, method, p);
        }
    }
}
