using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    public class BookManager : Manager<Book>
    {
        protected override string ServerUrl { get { return "book/"; } }
        public enum QueryField
        {
            /// <summary>
            /// 索书号
            /// </summary>
            call_number,
            /// <summary>
            /// 丛书名
            /// </summary>
            series,
            /// <summary>
            /// 出版社名称
            /// </summary>
            publisher,
            /// <summary>
            /// 主题标目
            /// </summary>
            topic,
            /// <summary>
            /// 题名
            /// </summary>
            title,
            /// <summary>
            /// 文献类型
            /// </summary>
            type,
            /// <summary>
            /// 图书ISBN或杂志ISSN编号
            /// </summary>
            isbn,
            /// <summary>
            /// 出版日期
            /// </summary>
            publish_date,
            /// <summary>
            /// 价格
            /// </summary>
            price,
            /// <summary>
            /// 著者姓名
            /// </summary>
            author
        }
        public enum QueryOperator
        {
            /// <summary>
            /// =
            /// </summary>
            exact,
            /// <summary>
            /// !=
            /// </summary>
            not,
            /// <summary>
            /// like
            /// </summary>
            like,
            /// <summary>
            /// ＞
            /// </summary>
            gt,
            /// <summary>
            /// ＜
            /// </summary>
            lt,
            /// <summary>
            /// ＞＝
            /// </summary>
            gte,
            /// <summary>
            /// ＜＝
            /// </summary>
            lte
        }
        public struct QueryFilter
        {
            public QueryField field;
            public QueryOperator op;
            public string value;
            public List<object> ToList()
            {
                List<object> r = new List<object>();
                r.Add(field.ToString());
                switch (op)
                {
                    case QueryOperator.exact: r.Add("="); break;
                    case QueryOperator.not: r.Add("!="); break;
                    case QueryOperator.like: r.Add("like"); break;
                    case QueryOperator.gt: r.Add(">"); break;
                    case QueryOperator.lt: r.Add("<"); break;
                    case QueryOperator.gte: r.Add(">="); break;
                    case QueryOperator.lte: r.Add("<="); break;
                }
                r.Add(value);
                return r;
            }
        }
        public enum QuerySortOrder
        {
            /// <summary>
            /// 升序
            /// </summary>
            asc,
            /// <summary>
            /// 降序
            /// </summary>
            desc
        }
        public struct QuerySort
        {
            public QueryField field;
            public QuerySortOrder order;
            public List<object> ToList()
            {
                List<object> r = new List<object>();
                r.Add(field.ToString());
                switch (order)
                {
                    case QuerySortOrder.asc: r.Add(false); break;
                    case QuerySortOrder.desc: r.Add(true); break;
                }
                return r;
            }
        }
        public List<Book> query(List<QueryFilter> filter, List<QuerySort> sort)
        {
            List<List<object>> filters = new List<List<object>>();
            foreach (QueryFilter qf in filter) filters.Add(qf.ToList());
            List<List<object>> sorts = new List<List<object>>();
            foreach (QuerySort qs in sort) sorts.Add(qs.ToList());
            return lall<Book>(CallServer("query", filters, sorts));
        }
    }
}
