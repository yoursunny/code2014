using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    public class ReaderManager : Manager<Reader>
    {
        protected override string ServerUrl { get { return "reader/"; } }
        public Reader query_barcode(string reader_barcode)
        {
            Reader r = new Reader();
            r.dload(CallServer("query_barcode", reader_barcode));
            return r;
        }
    }
}
