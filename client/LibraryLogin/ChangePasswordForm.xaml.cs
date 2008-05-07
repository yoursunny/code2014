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
using System.Windows.Shapes;
using yoursunny.P2008.Library.API;
using yoursunny.P2008.Library.Common;

namespace yoursunny.P2008.Library.Login
{
    public partial class ChangePasswordForm : Window
    {
        public ChangePasswordForm()
        {
            InitializeComponent();
        }
        User me;
        private void Form_Load(object sender, RoutedEventArgs e)
        {
            me = User.Me;
            tUsername.Text = me.employee_number;
        }
        private void Commit_Click(object sender, RoutedEventArgs e)
        {
            if (newPassword.Password.Length < 4)
            {
                MessageBox.Show("密码至少4位", "修改密码", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            if (newPassword.Password != newPassword2.Password)
            {
                MessageBox.Show("两次密码不一致", "修改密码", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }
            try {
                me.set_password(newPassword.Password);
                MessageBox.Show("密码已修改", "修改密码", MessageBoxButton.OK, MessageBoxImage.Information);
                this.Close();
            }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }
        private void Cancel_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
        private void newPassword_LostFocus(object sender, RoutedEventArgs e)
        {
            if (newPassword.Password.Length < 4)
            {
                icon1.Source = (ImageSource)this.Resources["silkicon_cross"];
            }
            else
            {
                icon1.Source = (ImageSource)this.Resources["silkicon_tick"];
            }
        }
        private void newPassword2_LostFocus(object sender, RoutedEventArgs e)
        {
            if (newPassword.Password == newPassword2.Password)
            {
                icon2.Source = (ImageSource)this.Resources["silkicon_tick"];
            }
            else
            {
                icon2.Source = (ImageSource)this.Resources["silkicon_cross"];
            }
        }
    }
}
