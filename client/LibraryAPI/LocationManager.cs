using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 分馆集合
    /// </summary>
    public class LocationManager : Manager<Location>
    {
        protected override string ServerUrl { get { return "loc/"; } }
    }
}
