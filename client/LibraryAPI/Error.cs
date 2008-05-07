using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 来自应用服务器的异常
    /// </summary>
    public class Error : Exception
    {
        public string type;
        public Error(string type, string msg)
            : base(msg)
        {
            this.type = type;
        }
    }
}
