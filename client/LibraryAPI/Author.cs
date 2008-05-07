using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    public class Author : Model
    {
        protected override string ServerUrl { get { return "author/" + author_id.ToString() + "/"; } }
        public int author_id;
        public string person_name;
        public override void dload(Dictionary<string, object> dict)
        {
            author_id = dget<int>(dict, "author_id");
            person_name = dget<string>(dict, "person_name");
        }
        public override bool Equals(object obj)
        {
            if (obj is Author) return (obj as Author).author_id == this.author_id;
            return false;
        }
        public override int GetHashCode()
        {
            return author_id.GetHashCode();
        }
    }
}
