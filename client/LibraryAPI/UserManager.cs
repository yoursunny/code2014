using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 用户集合
    /// </summary>
    public class UserManager : Manager<User>
    {
        protected override string ServerUrl { get { return "user/"; } }
    }
}
