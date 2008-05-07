using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// “著者-图书”关系
    /// </summary>
    public struct Author_Book
    {
        public Author author;
        public Book book;
        public int author_id;
        public int author_order;
    }
}
