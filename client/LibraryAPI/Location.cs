using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 分馆
    /// </summary>
    public class Location : Model
    {
        public int location_id;
        public string location_name;
        public string address;
        public string phone;
        public override void dload(Dictionary<string, object> dict)
        {
            this.location_id = dget<int>(dict, "location_id");
            this.location_name = dget<string>(dict, "location_name");
            this.address = dget<string>(dict, "address", "");
            this.phone = dget<string>(dict, "phone", "");
        }
        public Location(int location_id) {
            this.location_id = location_id;
            dload(CallServer("get"));
        }
        public Location() { }
        protected override string ServerUrl { get { return "loc/" + location_id.ToString() + "/"; } }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("location_id", this.location_id);
            dict.Add("location_name", this.location_name);
            dict.Add("address", this.address);
            dict.Add("phone", this.phone);
            CallServer("put", dict);
        }
        public void del()
        {
            CallServer("del");
        }
        public List<User> user_all()
        {
            return lall<User>(CallServer("user_all"));
        }
        public override bool Equals(object obj)
        {
            if (obj is Location)
                return this.location_id == (obj as Location).location_id;
            return false;
        }
        public override int GetHashCode()
        {
            return this.location_id.GetHashCode();
        }
    }
}
