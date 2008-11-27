using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Threading;
using System.Windows.Threading;

namespace yoursunny.P2008.IS409
{
    public partial class ScoreBoard : Window
    {
        ServerListener listener;
        public ScoreBoard()
        {
            InitializeComponent();
            listener = new ServerListener();
            listener.GetValue += new EventHandler<ValueEventArgs>(GetValue);
            listener.SetValue += new EventHandler<ValueEventArgs>(SetValue);
            listener.GetColor += new EventHandler<ColorEventArgs>(GetColor);
            listener.SetColor += new EventHandler<ColorEventArgs>(SetColor);
            listener.Start();
        }
        void GetValue(object sender, ValueEventArgs e)
        {
            Dispatcher.Invoke(DispatcherPriority.Normal, (ThreadStart)delegate
            {
                e.L = int.Parse(L.Content.ToString());
                e.R = int.Parse(R.Content.ToString());
            });
        }
        void SetValue(object sender, ValueEventArgs e)
        {
            Dispatcher.Invoke(DispatcherPriority.Normal, (ThreadStart)delegate
            {
                L.Content = e.L.ToString();
                R.Content = e.R.ToString();
            });
        }
        void GetColor(object sender, ColorEventArgs e)
        {
            Dispatcher.Invoke(DispatcherPriority.Normal, (ThreadStart)delegate
            {
                e.Color = (this.Background as SolidColorBrush).Color;
            });
        }
        void SetColor(object sender, ColorEventArgs e)
        {
            Dispatcher.Invoke(DispatcherPriority.Normal, (ThreadStart)delegate
            {
                this.Background = new SolidColorBrush(e.Color);
            });
        }
    }
}
