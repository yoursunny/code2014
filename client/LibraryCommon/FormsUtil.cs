using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using yoursunny.P2008.Library.API;

namespace yoursunny.P2008.Library.Common
{
    public static class FormsUtil
    {
        /// <summary>
        /// 弹出错误信息
        /// </summary>
        public static void AlertError(Exception ex)
        {
            if (ex is Error)
            {
                MessageBox.Show("应用服务器返回错误" + (ex as Error).type + "\n" + ex.Message, "错误信息", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            else
            {
                MessageBox.Show("遇到错误" + ex.GetType().FullName + "\n" + ex.Message, "错误信息", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        /// <summary>
        /// 用默认浏览器打开网页
        /// </summary>
        public static void OpenWebBrowser(string uri)
        {
            try { System.Diagnostics.Process.Start(uri); }
            catch { }
        }
    }
}
