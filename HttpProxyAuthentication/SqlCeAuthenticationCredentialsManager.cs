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
    public class SqlCeAuthenticationCredentialsManager : IAuthenticationCredentialsManager
    {
        string connstr;
        /// <param name="p">datasource => path to the sdf database</param>
        public void SetParams(System.Collections.Specialized.NameValueCollection p)
        {
            connstr = "datasource=" + p["datasource"] + ";mode=Read Write;";
        }
        SqlCeConnection CreateConnection()
        {
            SqlCeConnection conn = new SqlCeConnection(connstr);
            conn.Open();
            return conn;
        }
        public bool AddUser(string userid, string password)
        {
            SqlCeConnection conn = CreateConnection();
            int r = -1;
            try
            {
                SqlCeCommand cmd = conn.CreateCommand();
                cmd.CommandText = "INSERT UserCredentials (userid,password,expires) VALUES (@userid,@password,@expires)";
                cmd.Parameters.Add("@userid", userid);
                cmd.Parameters.Add("@password", password);
                cmd.Parameters.Add("@expires", DateTime.UtcNow.AddYears(1));
                r = cmd.ExecuteNonQuery();
            }
            catch (SqlCeException) { }
            finally { conn.Close(); }
            return r > 0;
        }
        public bool RemoveUser(string userid)
        {
            SqlCeConnection conn = CreateConnection();
            int r = -1;
            try
            {
                SqlCeCommand cmd = conn.CreateCommand();
                cmd.CommandText = "DELETE UserCredentials WHERE userid=@userid";
                cmd.Parameters.Add("@userid", userid);
                r = cmd.ExecuteNonQuery();
            }
            catch (SqlCeException) { }
            finally { conn.Close(); }
            return r > 0;
        }
        public bool ResetPassword(string userid, string password)
        {
            SqlCeConnection conn = CreateConnection();
            int r = -1;
            try
            {
                SqlCeCommand cmd = conn.CreateCommand();
                cmd.CommandText = "UPDATE UserCredentials SET password=@password WHERE userid=@userid";
                cmd.Parameters.Add("@userid", userid);
                cmd.Parameters.Add("@password", password);
                r = cmd.ExecuteNonQuery();
            }
            catch (SqlCeException) { }
            finally { conn.Close(); }
            return r > 0;
        }
        public string[] EnumUsers()
        {
            SqlCeConnection conn = CreateConnection();
            SqlCeCommand cmd = conn.CreateCommand();
            cmd.CommandText = "SELECT userid FROM UserCredentials";
            SqlCeDataReader dr = cmd.ExecuteReader();
            List<string> u = new List<string>();
            while (dr.Read())
            {
                u.Add(dr.GetString(0));
            }
            conn.Close();
            return u.ToArray();
        }
    }
}
