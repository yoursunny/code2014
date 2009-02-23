using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.Win32;

namespace yoursunny.P2008.hProxyN
{
    class RegistryProxySetting
    {
        public string AutoConfigURL;
        public bool ProxyEnable;
        public string ProxyServer;
        public string ProxyOverride;
        public bool WPAD;
        const string InternetSettings = @"Software\Microsoft\Windows\CurrentVersion\Internet Settings";
        const string vAutoConfigURL = "AutoConfigURL";
        const string vProxyEnable = "ProxyEnable";
        const string vProxyServer = "ProxyServer";
        const string vProxyOverride = "ProxyOverride";
        public static RegistryProxySetting Get()
        {
            RegistryProxySetting p = new RegistryProxySetting();
            RegistryKey key = Registry.CurrentUser.OpenSubKey(InternetSettings);
            string ac = (string)key.GetValue(vAutoConfigURL, "");
            p.AutoConfigURL = ac;
            int pe = (int)key.GetValue(vProxyEnable, 0);
            p.ProxyEnable = (pe == 1);
            string ps = (string)key.GetValue(vProxyServer, "");
            p.ProxyServer = ps;
            string po = (string)key.GetValue(vProxyOverride, "");
            p.ProxyOverride = po;
            p.WPAD = GetSetWPAD(null);
            key.Close();
            return p;
        }
        public void Set()
        {
            RegistryKey key = Registry.CurrentUser.OpenSubKey(InternetSettings, true);
            if (string.IsNullOrEmpty(AutoConfigURL))
            {
                try { key.DeleteValue(vAutoConfigURL); }
                catch (ArgumentException) { }//DeleteValue would throw ArgumentException when the value doesn't exist
            }
            else key.SetValue(vAutoConfigURL, AutoConfigURL, RegistryValueKind.String);
            key.SetValue(vProxyEnable, ProxyEnable ? 1 : 0, RegistryValueKind.DWord);
            if (ProxyServer == null) ProxyServer = string.Empty;
            key.SetValue(vProxyServer, ProxyServer, RegistryValueKind.String);
            if (ProxyOverride == null) ProxyOverride = string.Empty;
            key.SetValue(vProxyOverride, ProxyOverride, RegistryValueKind.String);
            GetSetWPAD(WPAD);
            key.Close();
        }
        static bool GetSetWPAD(bool? value)
        {
            RegistryKey key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Internet Settings\Connections", value.HasValue);
            byte[] v = (byte[])key.GetValue("DefaultConnectionSettings", null);
            if (v == null || v.Length < 9) throw new ArgumentException();
            bool old = (v[8] & 0x08) != 0;
            if (value.HasValue)
            {
                if (value.Value)
                {
                    v[8] = Convert.ToByte(v[8] | (byte)0x08);
                }
                else
                {
                    v[8] = Convert.ToByte(v[8] & (byte)0xf7);
                }
                key.SetValue("DefaultConnectionSettings", v, RegistryValueKind.Binary);
            }
            key.Close();
            return old;
        }
    }
}
