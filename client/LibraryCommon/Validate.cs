using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;

namespace yoursunny.P2008.Library.Common
{
    public class Validate
    {
        /// <summary>
        /// 是否是有效的身份证号
        /// </summary>
        public static bool IsCitizenId(string s)
        {
            if (s.Length == 15)
            {
                if (!Regex.IsMatch(s, @"^\d{15}$")) return false;
                try { new DateTime(int.Parse("19" + s.Substring(6, 2)), int.Parse(s.Substring(8, 2)), int.Parse(s.Substring(10, 2))); }
                catch { return false; }
                return true;
            }
            else if (s.Length == 18)
            {
                if (!Regex.IsMatch(s, @"^\d{17}[X\d]$")) return false;
                try { new DateTime(int.Parse("19" + s.Substring(6, 4)), int.Parse(s.Substring(10, 2)), int.Parse(s.Substring(12, 2))); }
                catch { return false; }
                int[] weight = new int[] { 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2, 1 };
                string checksum = "10X98765432";
                int count = 0;
                for (int i = 0; i < 17; ++i)
                {
                    count += int.Parse(s[i].ToString()) * weight[i];
                }
                return s[17] == checksum[count % 11];
            }
            return false;
        }
        /// <summary>
        /// 是否是有效的ISBN号
        /// </summary>
        public static bool IsISBN(string s)
        {
            if (!Regex.IsMatch(s, @"^\d{9}[X\d]$")) return false;
            int count = 0;
            for (int i = 0; i < 10; ++i)
            {
                int digit = s[i] == 'X' ? 10 : s[i] - '0';
                count += digit * (10 - i);
            }
            return count % 11 == 0;
        }
    }
}
