using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 书库
    /// </summary>
    public class Stack : Model
    {
        protected override string ServerUrl { get { return "stack/" + stack_id.ToString() + "/"; } }
        public int stack_id;
        private int stacktype_id;
        public StackType stacktype { get { return new StackType(stacktype_id); } set { stacktype_id = value.stacktype_id; } }
        private int location_id;
        public Location location { get { return new Location(location_id); } set { location_id = value.location_id; } }
        public string stack_name;
        public Stack(int stack_id)
        {
            this.stack_id = stack_id;
            dload(CallServer("get"));
        }
        public Stack() { }
        public override void dload(Dictionary<string, object> dict)
        {
            this.stack_id = dget<int>(dict, "stack_id");
            this.stacktype_id = dget<int>(dict, "stacktype_id");
            this.location_id = dget<int>(dict, "location_id");
            this.stack_name = dget<string>(dict, "stack_name");
        }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("stack_id", stack_id);
            dict.Add("stacktype_id", stacktype_id);
            dict.Add("location_id", location_id);
            dict.Add("stack_name", stack_name);
            CallServer("put", dict);
        }
        public void del()
        {
            CallServer("del");
        }
        public List<Shelf> shelf_all()
        {
            return lall<Shelf>(CallServer("shelf_all"));
        }
        public List<Shelf> clc_query(string call_number)
        {
            return lall<Shelf>(CallServer("clc_query", call_number));
        }
    }
}
