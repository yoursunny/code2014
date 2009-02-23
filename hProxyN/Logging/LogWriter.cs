using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// writes to httpd log file
    /// </summary>
    public class LogWriter
    {
        object syncobj;
        //Encoding enc;
        TextWriter w;
        LogFormatBase lf;
        public LogWriter(LoggingConfigurationSection sec)
        {
            if (sec.enabled)
            {
                lf = LogFormatBase.Create(sec.Format.type, (from LoggingFieldElement field in sec.Fields select field.name).ToArray());
                if (sec.Output.path == "STDOUT")
                {
                    w = Console.Out;
                    foreach (string hl in lf.GetHeader()) w.WriteLine(hl);
                }
                else if (string.IsNullOrEmpty(sec.Output.pattern))
                {
                    w = new StreamWriter(Path.Combine(sec.Output.path, sec.Output.prefix + sec.Output.postfix));
                    foreach (string hl in lf.GetHeader()) w.WriteLine(hl);
                }
                else
                {
                    w = new LogRotator(sec.Output.path, sec.Output.prefix, sec.Output.pattern, sec.Output.postfix, sec.Output.utc, lf.GetHeader(), Encoding.GetEncoding(sec.Format.encoding));
                }
            }
            else
            {
                lf = new NoLogging();
                w = TextWriter.Null;
            }
            syncobj = new object();
        }
        public LogWriter(string path, string prefix, string pattern, string postfix, bool utc, string format, Encoding enc, string[] fields)
        {
            lf = LogFormatBase.Create(format, fields);
            w = new LogRotator(path, prefix, pattern, postfix, utc, lf.GetHeader(), enc);
            syncobj = new object();
        }
        public LogWriter(Stream s, string format, Encoding enc, string[] fields)
        {
            lf = LogFormatBase.Create(format, fields);
            w = new StreamWriter(s, enc);
            syncobj = new object();
        }
        /*
        public LogWriter(LoggingConfigurationSection sec)
        {
            if (sec.enabled) Init(new LogRotator(sec.Output.path, sec.Output.prefix, sec.Output.pattern, sec.Output.postfix, sec.Output.utc), sec.Format.type, Encoding.GetEncoding(sec.Format.encoding), (from LoggingFieldElement field in sec.Fields select field.name).ToArray());
            else Init(Stream.Null, typeof(NoLogging).ToString(), Encoding.UTF8, new string[] { });
        }
        public LogWriter(string path, string prefix, string pattern, string postfix, bool utc, string format, Encoding enc, string[] fields)
        {
            Init(new LogRotator(path, prefix, pattern, postfix, utc), format, enc, fields);
        }
        public LogWriter(Stream s, string format, Encoding enc, string[] fields)
        {
            Init(s, format, enc, fields);
            Init(new StreamWriter(s), format, enc, fields);
        }
        private void Init(StreamWriter s, string format, Encoding enc, string[] fields)
        {
            syncobj = new object();
            this.enc = enc;
            w = new StreamWriter(s, enc);
            IRotatingStream rotating = s as IRotatingStream;
            if (rotating != null)
            {
                rotating.BeforeRotate += new EventHandler<RotateStreamEventArgs>(OnBeforeRotate);
                rotating.AfterRotate += new EventHandler<RotateStreamEventArgs>(OnAfterRotate);
            }
            lf = LogFormatBase.Create(format, fields);
        }
        protected void OnBeforeRotate(object sender, RotateStreamEventArgs e)
        {
            IRotatingStream rotating = (IRotatingStream)sender;
            //flush before rotate to another file, otherwise a line may appear in two files
            rotating.PauseRotate(new Action(w.Flush));
        }
        protected void OnAfterRotate(object sender, RotateStreamEventArgs e)
        {
            IRotatingStream rotating = (IRotatingStream)sender;
            //write headers to a newly opened file
            if (w == null) return;//closed
            rotating.PauseRotate(new Action(WriteHeader));
        }
        protected void WriteHeader()
        {
            foreach (string l in lf.GetHeader()) w.WriteLine(l);
        }
         */
        /// <summary>
        /// writes an entry to log file
        /// </summary>
        /// <param name="entry"></param>
        public void Write(LogEntry entry)
        {
            string line = lf.FormatEntry(entry);
            if (line != null)
                lock (syncobj)
                {
                    if (w == null) return;//closed
                    w.WriteLine(line);
                }
        }
        /// <summary>
        /// close and dispose this instance
        /// </summary>
        public void Close()
        {
            lock (syncobj) { w.Close(); w = null; }
        }
    }
}
