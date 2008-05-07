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
    public partial class WelcomeForm : Window
    {
        public WelcomeForm()
        {
            InitializeComponent();
        }
        User me;
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            this.me = User.Me;
            this.Title = "图书管理信息系统 欢迎 " + this.me.person_name;
            this.docUserName.Inlines.Add(this.me.employee_number + " " + this.me.person_name);
        }
        private void ChangePassword_Click(object sender, RoutedEventArgs e)
        {
            new ChangePasswordForm().ShowDialog();
        }
        private void GoToEditorDesk_Click(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start("LibraryEditor.exe", JSONRPC.ticket);
        }
        private void GoToServiceDesk_Click(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start("LibraryService.exe", JSONRPC.ticket);
        }
        private void RunAdmin_Click(object sender, RoutedEventArgs e)
        {
            System.Diagnostics.Process.Start("LibraryAdmin.exe", JSONRPC.ticket);
        }
        private void Logout_Click(object sender, RoutedEventArgs e)
        {
            new LoginService().logout();
            new LoginForm().Show();
            this.Close();
        }
        private void yoursunny_Click(object sender, RoutedEventArgs e)
        {
            FormsUtil.OpenWebBrowser("http://yoursunny.com/");
        }
        private void SilkIcons_Click(object sender, RoutedEventArgs e)
        {
            FormsUtil.OpenWebBrowser("http://www.famfamfam.com/lab/icons/silk/");
        }
    }
}
