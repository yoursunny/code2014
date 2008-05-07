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
using yoursunny.P2008.Library.API;
using yoursunny.P2008.Library.Common;

namespace yoursunny.P2008.Library.EditorDesk
{
    public partial class EditorMain : Window
    {
        public EditorMain()
        {
            InitializeComponent();
        }
        private void book_call_number_suggest_Click(object sender, RoutedEventArgs e)
        {

        }
        private void book_isbn_LostFocus(object sender, RoutedEventArgs e)
        {
            if (Validate.IsISBN(book_isbn.Text))
                book_isbn_validate.Source = (BitmapImage)this.Resources["silkicon_tick"];
            else book_isbn_validate.Source = (BitmapImage)this.Resources["silkicon_cross"];
        }
        private void book_save_Click(object sender, RoutedEventArgs e)
        {

        }
    }
}
