using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlServerCe;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// validates credentials against a SQL Server Compact Edition database
    /// </summary>
    public class SqlCeAuthenticationCredentialsValidator : IAuthenticationCredentialsValidator
    {
        string connstr;
        /// <param name="p">datasource => path to the sdf database</param>
        public void SetParams(System.Collections.Specialized.NameValueCollection p)
        {
            connstr = "datasource=" + p["datasource"] + ";mode=Read Only;temp path=" + Environment.GetEnvironmentVariable("TEMP") + ";";
        }
        public IAuthenticationCredentialInfo Get(string userid)
        {
            if (string.IsNullOrEmpty(connstr)) throw new InvalidOperationException();
            return new SqlCeAuthenticationCredentialInfo(userid, new SqlCeConnection(connstr));
        }
        public class SqlCeAuthenticationCredentialInfo : IAuthenticationCredentialInfo
        {
            public SqlCeAuthenticationCredentialInfo(string userid, SqlCeConnection conn)
            {
                conn.Open();
                SqlCeCommand cmd = conn.CreateCommand();
                cmd.CommandText = "SELECT password,expires FROM UserCredentials WHERE userid=@userid";
                cmd.Parameters.Add("@userid", userid);
                SqlCeDataReader dr = cmd.ExecuteReader();
                if (dr.Read())
                {
                    exist = true;
                    password = dr.GetString(0);
                    expires = dr.GetSqlDateTime(1);
                }
                conn.Close();
            }
            bool exist;
            string password;
            System.Data.SqlTypes.SqlDateTime expires;
            public string Check(string password)
            {
                if (!exist) return "userid not found";
                if (this.password != password) return "wrong password";
                else if (!expires.IsNull && expires.Value < DateTime.UtcNow) return "user expired";
                return null;
            }
            public bool GetInfo(out string password, out DateTime? expires)
            {
                password = this.password;
                if (this.expires.IsNull) expires = null; else expires = this.expires.Value;
                return exist;
            }
        }
    }
}
