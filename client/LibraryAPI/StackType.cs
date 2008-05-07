using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 书库类型
    /// </summary>
    public class StackType : Model
    {
        protected override string ServerUrl { get { return "stacktype/" + stacktype_id.ToString() + "/"; } }
        public int stacktype_id;
        public string stacktype_name;
        public StackType(int stacktype_id)
        {
            this.stacktype_id = stacktype_id;
            dload(CallServer("get"));
        }
        public StackType() { }
        public override void dload(Dictionary<string, object> dict)
        {
            stacktype_id = dget<int>(dict, "stacktype_id");
            stacktype_name = dget<string>(dict, "stacktype_name");
        }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("stacktype_id", stacktype_id);
            dict.Add("stacktype_name", stacktype_name);
            CallServer("put", dict);
        }
        public void del()
        {
            CallServer("del");
        }
    }
}
