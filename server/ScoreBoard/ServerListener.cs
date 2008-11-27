using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.Net.Sockets;
using System.Windows.Media;

/* ScoreBoard protocol
 * listening on port 1127
 * 
 * REQUEST
 *   identifier   e2 cb b5 80 cb 09 4e ba a3 6b f6 07 ce 95 3f 2b
 *   operator     00=get-value 01=set-value 10=get-color 11=set-color
 *   data         no data for get-*
 *                set-value    L-value R-value (4 bytes each, big endian)
 *                set-color    Red Green Blue (1 byte each)
 * 
 * RESPONSE
 *   identifier   e2 cb b5 80 cb 09 4e ba a3 6b f6 07 ce 95 3f 2b
 *   operator     80=resp-value 90=resp-color
 *   data         resp-value   L-value R-value (4 bytes each, big endian)
 *                resp-color   Red Green Blue (1 byte each)
 */

namespace yoursunny.P2008.IS409
{
    public class ServerListener
    {
        UdpClient udp;
        public void Start()
        {
            udp = new UdpClient(1127);
            RequestReceivedCallback = new AsyncCallback(RequestReceived);
            udp.BeginReceive(RequestReceived, null);
        }
        AsyncCallback RequestReceivedCallback;
        void RequestReceived(IAsyncResult async)
        {
            IPEndPoint ep = new IPEndPoint(IPAddress.Any, 0);
            byte[] diagram = udp.EndReceive(async, ref ep);
            udp.BeginReceive(RequestReceived, null);
            if (diagram.Length < 17) return;
            if (!CheckIdentifier(diagram)) return;
            byte op = diagram[16];
            switch (op)
            {
                case 0x00:
                case 0x01:
                    {
                        ValueEventArgs e = new ValueEventArgs();
                        if (op == 0x01)
                        {
                            if (diagram.Length < 25) return;
                            e.L = BigEndianToInt(diagram, 17);
                            e.R = BigEndianToInt(diagram, 21);
                            if (SetValue != null) SetValue(this, e);
                        }
                        else
                        {
                            if (GetValue != null) GetValue(this, e);
                            diagram = new byte[] { 0xe2, 0xcb, 0xb5, 0x80, 0xcb, 0x09, 0x4e, 0xba, 0xa3, 0x6b, 0xf6, 0x07, 0xce, 0x95, 0x3f, 0x2b, 0, 0, 0, 0, 0, 0, 0, 0, 0 };
                        }
                        diagram[16] = 0x80;
                        IntToBigEndian(diagram, 17, e.L);
                        IntToBigEndian(diagram, 21, e.R);
                    }
                    break;
                case 0x10:
                case 0x11:
                    {
                        ColorEventArgs e = new ColorEventArgs();
                        if (op == 0x11)
                        {
                            if (diagram.Length < 20) return;
                            e.Red = diagram[17];
                            e.Green = diagram[18];
                            e.Blue = diagram[19];
                            if (SetColor != null) SetColor(this, e);
                        }
                        else
                        {
                            if (GetColor != null) GetColor(this, e);
                            diagram = new byte[20] { 0xe2, 0xcb, 0xb5, 0x80, 0xcb, 0x09, 0x4e, 0xba, 0xa3, 0x6b, 0xf6, 0x07, 0xce, 0x95, 0x3f, 0x2b, 0, 0, 0, 0 };
                        }
                        diagram[16] = 0x90;
                        diagram[17] = e.Red;
                        diagram[18] = e.Green;
                        diagram[19] = e.Blue;
                    }
                    break;
                default:
                    return;
            }
            udp.Send(diagram, diagram.Length, ep);
        }
        bool CheckIdentifier(byte[] diagram)
        {
            return (diagram[0] == 0xe2 && diagram[1] == 0xcb && diagram[2] == 0xb5 && diagram[3] == 0x80
                && diagram[4] == 0xcb && diagram[5] == 0x09 && diagram[6] == 0x4e && diagram[7] == 0xba
                && diagram[8] == 0xa3 && diagram[9] == 0x6b && diagram[10] == 0xf6 && diagram[11] == 0x07
                && diagram[12] == 0xce && diagram[13] == 0x95 && diagram[14] == 0x3f && diagram[15] == 0x2b);
        }
        int BigEndianToInt(byte[] d, int start)
        {
            int end = start + 4;
            int n = 0;
            for (int i = start; i < end; ++i)
            {
                n = n * 0x100 + d[i];
            }
            return n;
        }
        void IntToBigEndian(byte[] d, int start, int n)
        {
            int end = start + 3;
            for (int i = end; i >= start; --i)
            {
                d[i] = Convert.ToByte(n % 0x100);
                n = n >> 8;
            }
        }
        public event EventHandler<ValueEventArgs> GetValue;
        public event EventHandler<ValueEventArgs> SetValue;
        public event EventHandler<ColorEventArgs> GetColor;
        public event EventHandler<ColorEventArgs> SetColor;
    }
    public class ValueEventArgs : EventArgs
    {
        public int L;
        public int R;
    }
    public class ColorEventArgs : EventArgs
    {
        public byte Red;
        public byte Green;
        public byte Blue;
        public Color Color
        {
            get { return Color.FromRgb(Red, Green, Blue); }
            set
            {
                Red = value.R;
                Green = value.G;
                Blue = value.B;
            }
        }
    }
}
