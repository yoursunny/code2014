using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.IO;

namespace yoursunny.P2008.hProxyN
{
    /*
    /// <summary>
    /// represents a stream that can rotate between several underlying streams
    /// </summary>
    public interface IRotatingStream
    {
        /// <summary>
        /// fires before rotating to another stream
        /// </summary>
        event EventHandler<RotateStreamEventArgs> BeforeRotate;
        /// <summary>
        /// fires after rotating to another stream
        /// </summary>
        event EventHandler<RotateStreamEventArgs> AfterRotate;
        /// <summary>
        /// runs a callback who can write without triggering rotate
        /// </summary>
        void PauseRotate(Action callback);
    }
    /// <summary>
    /// provides information for events in IRotatingStream
    /// </summary>
    public class RotateStreamEventArgs : EventArgs
    {
        public RotateStreamEventArgs(bool IsNew)
        {
            this.IsNew = IsNew;
        }
        /// <summary>
        /// is this a new file?
        /// </summary>
        public bool IsNew { get; private set; }
    }
     */
}
