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

namespace yoursunny.P2008.Library.ServiceDesk
{
    /// <summary>
    /// Interaction logic for BorrowPage.xaml
    /// </summary>
    public partial class BorrowPage : Page
    {
        public BorrowPage()
        {
            InitializeComponent();
        }

        private void borrow_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                msg.Text = "";
                Copy copy = new Copy(copy_barcode.Text);
                Reader reader = new ReaderManager().query_barcode(reader_barcode.Text);
                copy.borrow(reader);
                msg.Text = reader.person_name + "借阅操作成功";
            }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }
    }
}
