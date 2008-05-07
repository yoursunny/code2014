using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace yoursunny.P2008.Library.API
{
    /// <summary>
    /// 复本
    /// </summary>
    public class Copy : Model
    {
        protected override string ServerUrl { get { return "copy/" + copy_barcode + "/"; } }
        public string copy_barcode;
        private int shelf_id;
        public Shelf shelf { get { return new Shelf(shelf_id); } set { shelf_id = value.shelf_id; } }
        private string call_number;
        public Book book { get { return new Book(call_number); } set { call_number = value.call_number; } }
        public enum CopyStatus
        {
            Unknown = 0,
            Returned = 1,
            OnShelf = 2,
            Borrowed = 3,
            ReadOnly = 4,
            NewBook = 5,
            DiscardDamaged = 6,
            Discard = 7,
            Reserved = 8
        }
        public CopyStatus copy_status;
        public DateTime entry_date;
        public enum EntrySource
        {
            Other = 0,
            Buy = 1,
            Donate = 2,
            Compensate = 3
        }
        public EntrySource entry_source;
        public DateTime return_pdate;
        public DateTime discard_date;
        public string copy_memo;
        public Copy() { }
        public Copy(string copy_barcode) { this.copy_barcode = copy_barcode; dload(CallServer("get")); }
        public override void dload(Dictionary<string, object> dict)
        {
            copy_barcode = dget<string>(dict, "copy_barcode");
            shelf_id = dget<int>(dict, "shelf_id");
            call_number = dget<string>(dict, "call_number");
            copy_status = (CopyStatus)dget<int>(dict, "copy_status");
            entry_date = dget<DateTime>(dict, "entry_date");
            entry_source = (EntrySource)dget<int>(dict, "entry_source");
            return_pdate = dget<DateTime>(dict, "return_pdate");
            discard_date = dget<DateTime>(dict, "discard_date");
            copy_memo = dget<string>(dict, "copy_memo");
        }
        public void put()
        {
            Dictionary<string, object> dict = new Dictionary<string, object>();
            dict.Add("copy_barcode", copy_barcode);
            dict.Add("shelf_id", shelf_id);
            dict.Add("call_number", call_number);
            dict.Add("copy_status", (int)copy_status);
            dict.Add("entry_date", entry_date);
            dict.Add("entry_source", (int)entry_source);
            dict.Add("return_pdate", return_pdate);
            dict.Add("discard_date", discard_date);
            dict.Add("copy_memo", copy_memo);
            CallServer("put", dict);
        }
        public void reserve(Reader reader)
        {
            CallServer("reserve", reader.reader_id);
        }
        public void borrow(Reader reader)
        {
            CallServer("borrow", reader.reader_id);
        }
        public void onshelf()
        {
            CallServer("onshelf");
        }
        public void set_status(CopyStatus status)
        {
            CallServer("set_status", (int)status);
            this.copy_status = status;
        }
    }
}
