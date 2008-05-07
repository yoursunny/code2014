using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 书库类型集合
    /// </summary>
    public class StackTypeManager : Manager<StackType>
    {
        protected override string ServerUrl { get { return "stacktype/"; } }
    }
}
