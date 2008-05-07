using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 书架集合
    /// </summary>
    public class ShelfManager : Manager<Shelf>
    {
        protected override string ServerUrl { get { return "shelf/"; } }
    }
}
