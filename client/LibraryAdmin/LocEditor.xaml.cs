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
    /// 分馆编辑控件
    /// </summary>
    public partial class LocEditor : UserControl
    {
        public LocEditor()
        {
            InitializeComponent();
        }
        public Location loc
        {
            get { return _loc; }
            set
            {
                _loc = value;
                if (_loc == null) return;
                btnDelete.Visibility = Visibility.Visible;
                name.Text = _loc.location_name;
                address.Text = _loc.address;
                phone.Text = _loc.phone;
                UserEditor ed;
                EventHandler ed_BasicSave = new EventHandler(User_BasicSave);
                UserEditor.SetPasswordEventHandler ed_SetPassword = new UserEditor.SetPasswordEventHandler(User_SetPassword);
                EventHandler ed_Kick = new EventHandler(User_Kick);
                EventHandler ed_Delete = new EventHandler(User_Delete);
                LibrarianList.BeginInit();
                LibrarianList.Children.Clear();
                foreach (User u in _loc.user_all())
                {
                    ed = new UserEditor();
                    ed.user = u;
                    ed.BasicSave += ed_BasicSave;
                    ed.SetPassword += ed_SetPassword;
                    ed.Kick += ed_Kick;
                    ed.Delete += ed_Delete;
                    Expander exp = new Expander();
                    exp.Header = u.employee_number + " " + u.person_name;
                    exp.Content = ed;
                    LibrarianList.Children.Add(exp);
                }
                LibrarianList.EndInit();
                ed = new UserEditor();
                ed.BasicSave += ed_BasicSave;
                ed.SetPassword += ed_SetPassword;
                ed.Kick += ed_Kick;
                ed.Delete += ed_Delete;
                Expander expN = new Expander();
                expN.Header = "添加新馆员";
                expN.Content = ed;
                LibrarianList.Children.Add(expN);
            }
        }
        void User_BasicSave(object sender, EventArgs e)
        {
            User u = (sender as UserEditor).user;
            try { u.put(); }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }
        void User_SetPassword(object sender, UserEditor.SetPasswordEventArgs e)
        {
            User u = (sender as UserEditor).user;
            try { u.set_password(e.new_password); MessageBox.Show("密码已经重设", "重设密码", MessageBoxButton.OK, MessageBoxImage.Information); }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }
        void User_Kick(object sender, EventArgs e)
        {
            User u = (sender as UserEditor).user;
            try { u.kick(); }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }
        void User_Delete(object sender, EventArgs e)
        {
            User u = (sender as UserEditor).user;
            try { u.del(); }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
        }
        private Location _loc;
        public event EventHandler BasicSave;
        private void BasicSave_Click(object sender, RoutedEventArgs e)
        {
            if (_loc == null) _loc = new Location();
            loc.location_name = name.Text;
            loc.address = address.Text;
            loc.phone = phone.Text;
            if (BasicSave != null) BasicSave(this, e);
        }
        public event EventHandler Delete;
        private void Delete_Click(object sender, RoutedEventArgs e)
        {
            if (_loc == null) return;
            if (MessageBox.Show("真的要删除这个分馆么？", "删除分馆", MessageBoxButton.OKCancel, MessageBoxImage.Question) == MessageBoxResult.OK)
            {
                if (Delete != null) Delete(this, e);
            }
        }
    }
}
