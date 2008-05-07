using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 用户(馆员)
    /// </summary>
    public class User : Model
    {
        public string employee_number = "";
        private int location_id=0;
        public Location location
        {
            get { return new Location(location_id); }
            set { location_id = value.location_id; }
        }
        public string person_name = "";
        public override void dload(Dictionary<string, object> dict)
        {
            this.employee_number = dget<string>(dict, "employee_number");
            this.location_id = dget<int>(dict, "location_id");
            this.person_name = dget<string>(dict, "person_name", "");
        }
        protected override string ServerUrl { get { return "user/" + this.employee_number + "/"; } }
        public User(string employee_number)
        {
            this.employee_number = employee_number;
            dload(CallServer("get"));
        }
        public User() { }
        public static User Me
        {
            get
            {
                User r = new User();
                r.dload(JSONRPC.Call("user/me/", "get"));
                return r;
            }
        }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("employee_number", this.employee_number);
            dict.Add("location_id", this.location_id);
            dict.Add("person_name", this.person_name);
            CallServer("put", dict);
        }
        public void del()
        {
            CallServer("del");
        }
        public void kick()
        {
            CallServer("kick");
        }
        public void set_password(string password)
        {
            CallServer("set_password", password);
        }
        public void grant(string grant_type, string grant_action)
        {
            CallServer("grant", grant_type, grant_action);
        }
        public void revoke(string grant_type, string grant_action)
        {
            CallServer("revoke", grant_type, grant_action);
        }
        public struct GrantEntry
        {
            public string grant_type;
            public string grant_action;
        }
        public List<GrantEntry> grant_all()
        {
            List<GrantEntry> r = new List<GrantEntry>();
            List<object> s = (List<object>)CallServer("grant_all");
            for (int i = 0; i < s.Count; ++i)
            {
                List<object> p = (List<object>)s[i];
                GrantEntry g = new GrantEntry();
                g.grant_type = p[0] as string;
                g.grant_action = p[1] as string;
                r.Add(g);
            }
            return r;
        }
        public override bool Equals(object obj)
        {
            if (obj is User) 
                return this.employee_number == (obj as User).employee_number;
            return false;
        }
        public override int GetHashCode()
        {
            return this.employee_number.GetHashCode();
        }
    }
}
