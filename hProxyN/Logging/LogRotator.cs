using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;
using System.Threading;

namespace yoursunny.P2008.hProxyN
{
    /// <summary>
    /// represents a TextWriter which will rotate between files by time
    /// </summary>
    public class LogRotator : TextWriter
    {
        object syncobj;
        string path;
        string prefix;
        string pattern;
        string postfix;
        bool utc;
        string[] header;
        Encoding enc;
        StreamWriter w;
        string fname;
        public LogRotator(string path, string prefix, string pattern, string postfix, bool utc, string[] header, Encoding enc)
        {
            this.path = path;
            this.prefix = prefix;
            this.pattern = pattern;
            this.postfix = postfix;
            this.utc = utc;
            this.header = header;
            this.syncobj = new object();
            this.enc = enc;
            this.w = StreamWriter.Null;
            this.fname = null;
        }
        /// <summary>
        /// rotate to another file if necessary
        /// </summary>
        protected void RotateFile()
        {
            string fname = (utc ? DateTime.UtcNow : DateTime.Now).ToString(pattern);
            if (this.fname != fname)
            {
                lock (syncobj)
                {
                    if (this.fname == fname) return;//in case another thread has already rotated the file
                    this.fname = fname;
                    w.Close();
                    FileInfo fi = new FileInfo(Path.Combine(path, prefix + fname + postfix));
                    bool exist = fi.Exists;
                    if (exist && fi.Length > 0)
                    {
                        FileStream fs = fi.Open(FileMode.Open);
                        fs.Seek(-1, SeekOrigin.End);
                        if (fs.ReadByte() != (byte)'\n')
                        {
                            //file was not properly closed last time, add a CrLf
                            fs.Write(new byte[] { (byte)'\r', (byte)'\n' }, 0, 2);
                        }
                        fs.Close();
                        w = fi.AppendText();
                    }
                    else w = fi.CreateText();
                    foreach (string hl in header) w.WriteLine(hl);
                }
            }
        }
        public override void Flush()
        {
            w.Flush();
        }
        public override void WriteLine(string value)
        {
            RotateFile();
            w.WriteLine(value);
        }
        public override Encoding Encoding { get { return enc; } }
        public override void Close()
        {
            w.Close();
        }
    }
    /*
    /// <summary>
    /// represents a write-only Stream which will rotate between files by time
    /// </summary>
    //a serious bug here: a line may be splitted across two files
    //so I decide to let LogRotator derive from StreamWriter rather than Stream
    public class LogRotator : Stream, IRotatingStream
    {
        object syncobj;
        FileStream fs;
        string path;
        string prefix;
        string pattern;
        string postfix;
        bool utc;
        string fname;
        List<int> rotate_paused_threads;
        public LogRotator(string path, string prefix, string pattern, string postfix, bool utc)
        {
            this.path = path;
            this.prefix = prefix;
            this.pattern = pattern;
            this.postfix = postfix;
            this.utc = utc;
            this.fs = null;
            this.syncobj = new object();
            this.fname = null;
            this.rotate_paused_threads = new List<int>();
        }
        /// <summary>
        /// rotate to another file if necessary
        /// </summary>
        protected void RotateFile()
        {
            string fname = (utc ? DateTime.UtcNow : DateTime.Now).ToString(pattern);
            if (this.fname != fname)
            {
                Console.WriteLine("RotateFile outside lock");
                lock (syncobj)
                {
                    Console.WriteLine("RotateFile inside lock");
                    if (this.fname == fname) return;//in case another thread has already rotated the file
                    this.fname = fname;
                    Console.WriteLine("RotateFile start");
                    if (fs != null)
                    {
                        Console.WriteLine("RotateFile before BeforeRotate");
                        if (this.BeforeRotate != null) this.BeforeRotate(this, new RotateStreamEventArgs(false));
                        fs.Close();
                        Console.WriteLine("RotateFile after BeforeRotate");
                    }
                    FileInfo fi = new FileInfo(Path.Combine(path, prefix + fname + postfix));
                    bool exist = fi.Exists;
                    Console.WriteLine("RotateFile new file");
                    if (exist)
                    {
                        fs = fi.Open(FileMode.Open);
                        fs.Seek(-1, SeekOrigin.End);
                        if (fs.ReadByte() != (byte)'\n')
                        {
                            //file was not properly closed last time, add a CrLf
                            fs.Write(new byte[] { (byte)'\r', (byte)'\n' }, 0, 2);
                        }
                    }
                    else fs = new FileStream(fi.FullName, FileMode.Append);
                    Console.WriteLine("RotateFile before AfterRotate");
                    if (this.AfterRotate != null) this.AfterRotate(this, new RotateStreamEventArgs(!exist));
                    Console.WriteLine("RotateFile after AfterRotate");
                }
                Console.WriteLine("RotateFile finish lock");
            }
        }
        public event EventHandler<RotateStreamEventArgs> BeforeRotate;
        public event EventHandler<RotateStreamEventArgs> AfterRotate;
        public override bool CanRead
        {
            get { return false; }
        }
        public override bool CanSeek
        {
            get { return false; }
        }
        public override bool CanWrite
        {
            get { return true; }
        }
        public override void Flush()
        {
            if (fs == null) return;
            fs.Flush();
        }
        public override long Length
        {
            get { throw new NotSupportedException(); }
        }
        public override long Position
        {
            get { throw new NotSupportedException(); }
            set { throw new NotSupportedException(); }
        }
        public override int Read(byte[] buffer, int offset, int count)
        {
            throw new NotSupportedException();
        }
        public override long Seek(long offset, SeekOrigin origin)
        {
            throw new NotSupportedException();
        }
        public override void SetLength(long value)
        {
            throw new NotSupportedException();
        }
        public override void Write(byte[] buffer, int offset, int count)
        {
            lock (rotate_paused_threads)
            {
                if (!rotate_paused_threads.Contains(Thread.CurrentThread.ManagedThreadId))
                {
                    Console.WriteLine("Write with Rotate");
                    RotateFile();
                }
                else Console.WriteLine("Write without Rotate");
            }
            //RotateFile();
            fs.Write(buffer, offset, count);

        }
        public override void Close()
        {
            if (fs == null) return;
            fs.Close();
            fs = null;
        }
        public void PauseRotate(Action callback)
        {
            lock (rotate_paused_threads) { rotate_paused_threads.Add(Thread.CurrentThread.ManagedThreadId); }
            Console.WriteLine("PauseRotate start");
            callback();
            Console.WriteLine("PauseRotate end");
            lock (rotate_paused_threads) { rotate_paused_threads.Remove(Thread.CurrentThread.ManagedThreadId); }
        }
    }
     */
}
