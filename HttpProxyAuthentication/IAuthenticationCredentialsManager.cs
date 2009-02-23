using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Collections.Specialized;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents a manager of credentials
    /// </summary>
    public interface IAuthenticationCredentialsManager
    {
        /// <summary>
        /// set parameters needed by this validator
        /// </summary>
        /// <remarks>throw ArgumentException if parameters are incorrect or incomplete</remarks>
        void SetParams(NameValueCollection p);
        /// <summary>
        /// add a user
        /// </summary>
        /// <returns>true if successful</returns>
        bool AddUser(string userid, string password);
        /// <summary>
        /// remove a user
        /// </summary>
        /// <returns>true if successful</returns>
        bool RemoveUser(string userid);
        /// <summary>
        /// reset an existing user's password
        /// </summary>
        /// <returns>true if successful</returns>
        bool ResetPassword(string userid, string password);
        /// <summary>
        /// get a list of all users
        /// </summary>
        /// <remarks>throw NotSupportedException if Enum is not allowed</remarks>
        string[] EnumUsers();
    }
    /// <summary>
    /// manager element
    /// </summary>
    public class AuthenticationCredentialsManagerConfigurationElement : ConfigurationElement
    {
        /// <summary>
        /// whether manager is enabled
        /// </summary>
        [ConfigurationProperty("enabled")]
        public bool enabled
        {
            get { return (bool)this["enabled"]; }
        }
        /// <summary>
        /// fully-qualified type name of a class implementing IAuthenticationCredentialsValidator
        /// </summary>
        [ConfigurationProperty("type")]
        public string type
        {
            get { return (string)this["type"]; }
        }
        /// <summary>
        /// userid of the admin
        /// </summary>
        [ConfigurationProperty("admin")]
        public string admin
        {
            get { return (string)this["admin"]; }
        }
        /// <summary>
        /// params to pass to 'type' class
        /// </summary>
        [ConfigurationProperty("param")]
        public NameValueConfigurationCollection param
        {
            get { return (NameValueConfigurationCollection)this["param"]; }
        }
    }
}
