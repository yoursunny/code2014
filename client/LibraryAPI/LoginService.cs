using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 登录服务
    /// </summary>
    public class LoginService
    {
        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="employee_number">工号</param>
        /// <param name="password">密码</param>
        /// <returns>票据</returns>
        public string login(string employee_number, string password)
        {
            string ticket = (string)JSONRPC.Call("login/", "login", employee_number, password);
            JSONRPC.ticket = ticket;
            return ticket;
        }
        /// <summary>
        /// 注销
        /// </summary>
        public void logout()
        {
            JSONRPC.Call("login/", "logout");
        }
    }
}
