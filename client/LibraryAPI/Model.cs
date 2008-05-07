using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 本库内所有模型的基类
    /// </summary>
    public abstract class Model
    {
        /// <summary>
        /// 获取dict的指定类型参数值
        /// </summary>
        /// <typeparam name="T">指定的返回类型</typeparam>
        /// <returns>dict[key]转换成T类型，否则抛出异常</returns>
        protected T dget<T>(Dictionary<string, object> dict, string key)
        {
            return (T)Convert.ChangeType(dict[key], typeof(T));
        }
        /// <summary>
        /// 获取dict的指定类型参数值
        /// </summary>
        /// <typeparam name="T">指定的返回类型</typeparam>
        /// <returns>dict[key]转换成T类型，否则defvalue</returns>
        protected T dget<T>(Dictionary<string, object> dict, string key, T defvalue)
        {
            try { return dget<T>(dict, key); }
            catch { return defvalue; }
        }
        /// <summary>
        /// 用dict的内容初始化本模型
        /// </summary>
        public virtual void dload(Dictionary<string, object> dict) { }
        public void dload(object dict) { dload((Dictionary<string, object>)dict); }
        /// <summary>
        /// 本对象对应的服务端URL
        /// </summary>
        protected virtual string ServerUrl { get { return null; } }
        protected virtual object CallServer(string method, params object[] p)
        {
            return JSONRPC.CallL(this.ServerUrl, method, p);
        }
        /// <summary>
        /// 对list的所有对象创建T实例并进行dload操作
        /// </summary>
        protected List<T> lall<T>(object list) where T : Model, new()
        {
            System.Collections.IList l = list as System.Collections.IList;
            List<T> r = new List<T>();
            if (l == null) return r;
            for (int i = 0; i < l.Count; ++i)
            {
                T o = new T();
                o.dload((Dictionary<string, object>)l[i]);
                r.Add(o);
            }
            return r;
        }
    }
}
