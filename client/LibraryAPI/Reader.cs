using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    public class Reader : Model
    {
        protected override string ServerUrl { get { return "reader/" + reader_id.ToString() + "/"; } }
        public int reader_id;
        public string person_name;
        public string reader_barcode;
        public Reader() { }
        public Reader(int reader_id) { this.reader_id = reader_id; }
        public override void dload(Dictionary<string, object> dict)
        {
            reader_id = dget<int>(dict, "reader_id");
            person_name = dget<string>(dict, "person_name");
            reader_barcode = dget<string>(dict, "reader_barcode");
        }
    }
}
