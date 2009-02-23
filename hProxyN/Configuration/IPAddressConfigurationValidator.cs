using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Configuration;
using System.Net;

namespace yoursunny.P2008.hProxyN
{
    /*
    public class IPAddressConfigurationValidator : ConfigurationValidatorBase
    {
        /// <returns>true if type is string</returns>
        public override bool CanValidate(Type type)
        {
            return type.Equals(typeof(string));
        }
        /// <summary>
        /// validate this value, throw ArgumentException if it's not a valid IP
        /// </summary>
        public override void Validate(object value)
        {
            if (!(value is string)) throw new ArgumentException();
            IPAddress temp;
            if (!IPAddress.TryParse((string)value, out temp)) throw new ArgumentException();
        }
    }
    [AttributeUsage(AttributeTargets.Property)]
    public class IPAddressConfigurationValidatorAttribute : ConfigurationValidatorAttribute
    {
        public override ConfigurationValidatorBase ValidatorInstance
        {
            get
            {
                return new IPAddressConfigurationValidator();
            }
        }
    }
     */
}
