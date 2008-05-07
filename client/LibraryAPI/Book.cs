using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    public class Book : Model
    {
        protected override string ServerUrl { get { return "book/" + call_number + "/"; } }
        public Book() { }
        public Book(string call_number) { this.call_number = call_number; dload(CallServer("get")); }
        public override void dload(Dictionary<string, object> dict)
        {
            call_number = dget<string>(dict, "call_number");
            series_id = dget<int>(dict, "series_id");
            publisher_id = dget<int>(dict, "publisher_id");
            topic_id = dget<int>(dict, "topic_id");
            book_title = dget<string>(dict, "book_title");
            _book_type = dget<byte>(dict, "book_type");
            isbn = dget<string>(dict, "isbn");
            publish_date = dget<DateTime>(dict, "publish_date");
            media = dget<string>(dict, "media");
            book_price = dget<decimal>(dict, "book_price");
            authors = new List<Author_Book>();
            foreach (List<object> author in dget<List<object>>(dict, "authors"))
            {
                Author_Book a = new Author_Book();
                a.book = this;
                a.author_order = (int)author[0];
                a.author = new Author();
                a.author.dload(author[1]);
                a.author_id = a.author.author_id;
            }
        }
        public string call_number;
        private int series_id;
        public Series series { get { return new Series(series_id); } set { series_id = value.series_id; } }
        private int publisher_id;
        public Publisher publisher { get { return new Publisher(publisher_id); } set { publisher_id = value.publisher_id; } }
        private int topic_id;
        public Topic topic { get { return new Topic(topic_id); } set { topic_id = value.topic_id; } }
        public string book_title;
        public byte[] book_type_choices { get { return new byte[] { 0, 10, 11, 12, 13, 30, 50, 51, 110, 111, 130, 131, 132, 133, 150, 151 }; } }
        public string book_type_name(byte book_type)
        {
            switch (book_type)
            {
                case 0: return "其他";
                case 10: return "普通图书";
                case 11: return "外文图书";
                case 12: return "少数民族文字图书";
                case 13: return "盲文图书";
                case 30: return "地图";
                case 50: return "报纸";
                case 51: return "杂志期刊";
                case 110: return "录音磁带";
                case 111: return "音频CD";
                case 130: return "视频磁带";
                case 131: return "视频VCD";
                case 132: return "视频DVD";
                case 133: return "视频蓝光";
                case 150: return "数据CD";
                case 151: return "数据DVD";
            }
            return null;
        }
        private byte _book_type;
        public byte book_type
        {
            get { return _book_type; }
            set
            {
                if (!book_type_choices.Contains(value)) throw new ArgumentOutOfRangeException();
                _book_type = value;
            }
        }
        public string isbn;
        public DateTime publish_date;
        public string media;
        public decimal book_price;
        public List<Author_Book> authors;
        private List<List<int>> authors_id
        {
            get
            {
                List<List<int>> r = new List<List<int>>();
                foreach (Author_Book author in authors)
                {
                    List<int> a = new List<int>();
                    a.Add(author.author_order);
                    a.Add(author.author_id);
                    r.Add(a);
                }
                return r;
            }
        }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("call_number", call_number);
            dict.Add("series_id", series_id);
            dict.Add("publisher_id", publisher_id);
            dict.Add("topic_id", topic_id);
            dict.Add("book_title", book_title);
            dict.Add("book_type", _book_type);
            dict.Add("isbn", isbn);
            dict.Add("publish_date", publish_date);
            dict.Add("media", media);
            dict.Add("book_price", book_price);
            dict.Add("authors_id", authors_id);
            CallServer("put", dict);
        }
        public void del()
        {
            CallServer("del");
        }
        public void reserve(Reader reader, Location location)
        {
            CallServer("reserve", reader.reader_id, location.location_id);
        }
        public override bool Equals(object obj)
        {
            if (obj is Book) return (obj as Book).call_number == this.call_number;
            return false;
        }
        public override int GetHashCode()
        {
            return call_number.GetHashCode();
        }
    }
}
