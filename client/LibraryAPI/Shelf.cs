using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 书架
    /// </summary>
    public class Shelf : Model
    {
        protected override string ServerUrl { get { return "shelf/" + shelf_id.ToString() + "/"; } }
        public int shelf_id;
        private int stack_id;
        public Stack stack { get { return new Stack(stack_id); } set { stack_id = value.stack_id; } }
        public string shelf_memo;
        public string start_number;
        public string end_number;
        public Shelf(int shelf_id)
        {
            this.shelf_id = shelf_id;
            dload(CallServer("get"));
        }
        public Shelf() { }
        public override void dload(Dictionary<string, object> dict)
        {
            shelf_id = dget<int>(dict, "shelf_id");
            stack_id = dget<int>(dict, "stack_id");
            shelf_memo = dget<string>(dict, "shelf_memo");
            start_number = dget<string>(dict, "start_number");
            end_number = dget<string>(dict, "end_number");
        }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("shelf_id", shelf_id);
            dict.Add("stack_id", stack_id);
            dict.Add("shelf_memo", shelf_memo);
            dict.Add("start_number", start_number);
            dict.Add("end_number", end_number);
            CallServer("put", dict);
        }
        public void del()
        {
            CallServer("del");
        }
        public List<Copy> copy_all()
        {
            return lall<Copy>(CallServer("copy_all"));
        }
    }
}
