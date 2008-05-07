using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 书库集合
    /// </summary>
    public class StackManager : Manager<Stack>
    {
        protected override string ServerUrl { get { return "stack/"; } }
    }
}
