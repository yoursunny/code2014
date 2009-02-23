using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Reflection;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents a log format
    /// </summary>
    public abstract class LogFormatBase
    {
        /// <summary>
        /// determines whether a field is valid with this log format
        /// </summary>
        public abstract bool ValidField(string field);
        /// <summary>
        /// determines whether all fields are valid with this log format
        /// </summary>
        public virtual bool ValidField(string[] fields)
        {
            return fields.All(ValidField);
        }
        /// <summary>
        /// field selected in conf file
        /// </summary>
        protected string[] fields;
        /// <summary>
        /// creates a new instance of a specified log format
        /// </summary>
        public static LogFormatBase Create(string type, string[] fields)
        {
            Type t = Type.GetType(type, true);
            ConstructorInfo ctor = t.GetConstructor(Type.EmptyTypes);
            LogFormatBase lf = (LogFormatBase)ctor.Invoke(null);
            if (!lf.ValidField(fields)) throw new ArgumentException();
            lf.fields = fields;
            return lf;
        }
        /// <summary>
        /// gets header lines of a new log file
        /// </summary>
        public abstract string[] GetHeader();
        /// <summary>
        /// formats an entry to a line
        /// </summary>
        public abstract string FormatEntry(LogEntry entry);
    }
}
