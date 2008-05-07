using System;
using System.IO;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Media;
using System.Windows.Media.Animation;
using System.Windows.Navigation;
using yoursunny.P2008.Library.API;
using yoursunny.P2008.Library.Common;

namespace yoursunny.P2008.Library.Login
{
	public partial class LoginForm
	{
		public LoginForm()
		{
			this.InitializeComponent();
		}

        private void LoginButton_Click(object sender, RoutedEventArgs e)
        {
            LoginService login = new LoginService();
            try {
                login.login(this.textUid.Text, this.textPassword.Password);
                new WelcomeForm().Show();
                this.Close();
            }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }

	}
}