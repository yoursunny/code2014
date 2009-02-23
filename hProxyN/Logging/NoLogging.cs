using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// provides a log format that actually logs nothing
    /// </summary>
    public class NoLogging : LogFormatBase
    {
        public override bool ValidField(string field)
        {
            return true;
        }
        public override string[] GetHeader()
        {
            return new string[] { };
        }
        public override string FormatEntry(LogEntry entry)
        {
            return null;
        }
    }
}
