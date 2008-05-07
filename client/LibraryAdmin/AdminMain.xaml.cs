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
    public partial class AdminMain : Window
    {
        public AdminMain()
        {
            InitializeComponent();
        }
        private void Exit_Click(object sender, RoutedEventArgs e)
        {
            if (MessageBox.Show("确实要退出吗？", "退出", MessageBoxButton.OKCancel, MessageBoxImage.Warning) == MessageBoxResult.OK)
            {
                Application.Current.Shutdown();
            }
        }
        /// <summary>
        /// 重新载入分馆列表
        /// </summary>
        private void ReloadLocList()
        {
            List<Location> locations = new LocationManager().all();
            LocList.BeginInit();
            LocList.Blocks.Clear();
            LocEditor ed;
            EventHandler ed_BasicSave = new EventHandler(LocEditor_BasicSave);
            EventHandler ed_Delete = new EventHandler(LocEditor_Delete);
            foreach (Location loc in locations)
            {
                ed = new LocEditor();
                ed.loc = loc;
                ed.BasicSave += ed_BasicSave;
                ed.Delete += ed_Delete;
                Expander exp = new Expander();
                exp.Header = loc.location_id.ToString() + " - " + loc.location_name;
                exp.Content = ed;
                LocList.Blocks.Add(new BlockUIContainer(exp));
            }
            LocList.EndInit();
            ed = new LocEditor();
            ed.BasicSave += ed_BasicSave;
            ed.Delete += ed_Delete;
            LocNew.Content = ed;
        }
        private void LocList_Load(object sender, RoutedEventArgs e)
        {
            ReloadLocList();
        }
        private void LocEditor_BasicSave(object sender, EventArgs e)
        {
            LocEditor ed = sender as LocEditor;
            if (ed == null) return;
            try { ed.loc.put(); }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
            ReloadLocList();
        }
        private void LocEditor_Delete(object sender, EventArgs e)
        {
            LocEditor ed = sender as LocEditor;
            if (ed == null) return;
            try { ed.loc.del(); }
            catch (Exception ex) { FormsUtil.AlertError(ex); }
            ReloadLocList();
        }
    }
}
