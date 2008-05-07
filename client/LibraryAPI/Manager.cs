using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 模型集合的基类
    /// </summary>
    public abstract class Manager<T> : Model where T : Model, new()
    {
        public virtual List<T> all()
        {
            return lall<T>(CallServer("all"));
        }
    }
}
