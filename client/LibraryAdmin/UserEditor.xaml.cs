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

namespace yoursunny.P2008.Library.Admin
{
    /// <summary>
    /// 馆员编辑控件
    /// </summary>
    public partial class UserEditor : UserControl
    {
        public UserEditor()
        {
            InitializeComponent();
            if (locations == null) locations = new LocationManager().all();
            user = null;
        }
        public static List<Location> locations;
        private User _user;
        public User user
        {
            get { return _user; }
            set
            {
                _user = value;
                employee_number_l.Inlines.Clear();
                if (_user == null)
                {
                    employee_number.Visibility = Visibility.Visible;
                    person_name.Text = "";
                    location_id.Items.Clear();
                    foreach (Location loc in locations)
                    {
                        ComboBoxItem item = new ComboBoxItem();
                        item.Content = loc.location_name;
                        item.Tag = loc.location_id;
                        location_id.Items.Add(item);
                    }
                    location_id.SelectedIndex = -1;
                    must_exist.Visibility = grants.Visibility = Visibility.Hidden;
                }
                else
                {
                    employee_number.Visibility = Visibility.Hidden;
                    employee_number_l.Inlines.Add(_user.employee_number);
                    person_name.Text = _user.person_name;
                    location_id.Items.Clear();
                    foreach (Location loc in locations)
                    {
                        ComboBoxItem item = new ComboBoxItem();
                        item.Content = loc.location_name;
                        item.Tag = loc.location_id;
                        location_id.Items.Add(item);
                        if (loc == _user.location) location_id.SelectedIndex = location_id.Items.Count - 1;
                    }
                    must_exist.Visibility = grants.Visibility = Visibility.Visible;
                }
            }
        }
        public event EventHandler BasicSave;
        private void BasicSave_Click(object sender, RoutedEventArgs e)
        {
            if (location_id.SelectedItem == null) { MessageBox.Show("未选择工作地点", "馆员基本信息", MessageBoxButton.OK, MessageBoxImage.Exclamation); return; }
            if (_user == null) { _user = new User(); _user.employee_number = employee_number.Text; }
            _user.person_name = person_name.Text;
            _user.location = new Location((int)(location_id.SelectedItem as ComboBoxItem).Tag);
            if (BasicSave != null) BasicSave(this, e);
        }
        public event SetPasswordEventHandler SetPassword;
        public class SetPasswordEventArgs : EventArgs
        {
            public string new_password;
        }
        public delegate void SetPasswordEventHandler(object sender, SetPasswordEventArgs e);
        private void SetPassword_Click(object sender, RoutedEventArgs e)
        {
            if (new_password.Password.Length < 4 || new_password.Password != new_password2.Password)
            {
                MessageBox.Show("密码应有至少4位，且两次输入要一致", "重设密码", MessageBoxButton.OK, MessageBoxImage.Exclamation);
                return;
            }
            SetPasswordEventArgs args = new SetPasswordEventArgs();
            args.new_password = new_password.Password;
            if (SetPassword != null) SetPassword(this, args);
        }
        public event EventHandler Kick;
        private void Kick_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("强制注销用户后，该用户正在进行的工作将会中断，你要继续吗？\n用户仍然可以使用密码重新登录，如果帐号被盗用，请重设密码。", "强制注销", MessageBoxButton.OKCancel, MessageBoxImage.Information) == MessageBoxResult.Cancel) return;
            if (Kick != null) Kick(this, e);
        }
        public event EventHandler Delete;
        private void Delete_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("确实要删除该用户吗？\n如果该用户曾留下工作记录，无法删除；\n你可以对已离职的馆员设定随机密码，以阻止其登录", "删除用户", MessageBoxButton.OKCancel, MessageBoxImage.Question) == MessageBoxResult.Cancel) return;
            if (Delete != null) Delete(this, e);
        }

    }
}
