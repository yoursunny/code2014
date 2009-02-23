using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Collections.Specialized;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents a validator to validate against authentication credentials
    /// </summary>
    public interface IAuthenticationCredentialsValidator
    {
        /// <summary>
        /// set parameters needed by this validator
        /// </summary>
        /// <remarks>throw ArgumentException if parameters are incorrect or incomplete</remarks>
        void SetParams(NameValueCollection p);
        /// <summary>
        /// get a new instance of IAuthenticationCredentialInfo
        /// </summary>
        IAuthenticationCredentialInfo Get(string userid);
    }
    /// <summary>
    /// validator element
    /// </summary>
    public class AuthenticationCredentialsValidatorConfigurationElement : ConfigurationElement
    {
        /// <summary>
        /// fully-qualified type name of a class implementing IAuthenticationCredentialsValidator
        /// </summary>
        [ConfigurationProperty("type")]
        public string type
        {
            get { return (string)this["type"]; }
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
    /// <summary>
    /// represents credential information about a user
    /// </summary>
    public interface IAuthenticationCredentialInfo
    {
        /// <summary>
        /// check against password
        /// </summary>
        /// <remarks>for Basic scheme</remarks>
        string Check(string password);
        /// <summary>
        /// get password and expiration date
        /// </summary>
        /// <returns>true if user exists, false if user does not exist</returns>
        /// <remarks>for Digest scheme; throws NotSupportedException if can't get those info</remarks>
        bool GetInfo(out string password, out DateTime? expires);
    }
}
