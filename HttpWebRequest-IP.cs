// http://www.65536.cn/t/2009/HttpWebRequest-IP.htm
using System;
using System.Net;
using System.Reflection;
using System.IO;

public class Program {
	static void Main(string[] args) {
		HttpWebRequest req = (HttpWebRequest)WebRequest.Create("http://blogs.msdn.com");//specify url and Host header here
		FieldInfo field_ServicePoint_ProxyServicePoint = (typeof(ServicePoint)).GetField("m_ProxyServicePoint", BindingFlags.NonPublic | BindingFlags.Instance);
		req.Proxy = new WebProxy("www.google.com:80");//specify real IP and port here
		field_ServicePoint_ProxyServicePoint.SetValue(req.ServicePoint, false);
		HttpWebResponse resp = (HttpWebResponse)req.GetResponse();
		string t = new StreamReader(resp.GetResponseStream()).ReadToEnd();
		Console.Write(t.Length > 200 ? t.Substring(0, 200) : t);
	}
}
