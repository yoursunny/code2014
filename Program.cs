using System;
using System.Collections.Generic;
using System.Text;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Drawing2D;
using System.IO;

namespace yoursunny.Fun2007.ImageResizer
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("批量图片缩小工具 ImageResizer  by yoursunny.com 2007-09-26");
            Console.Write("要处理的文件/文件夹：");
            string file_input = Console.ReadLine();
            if (string.IsNullOrEmpty(file_input)) return;
            Console.Write("处理成宽度px：");
            int width = int.Parse(Console.ReadLine());
            Console.Write("处理成高度px：");
            int height = int.Parse(Console.ReadLine());
            Console.WriteLine("开始处理...");
            if (file_input.ToLower().Contains(".jpg"))
            {
                ProcessFile(file_input, width, height);
            }
            else
            {
                string[] files = Directory.GetFiles(file_input, "*.jpg");
                foreach (string file in files)
                {
                    ProcessFile(file, width, height);
                }
            }
        }
        static void ProcessFile(string file, int width, int height)
        {
            try
            {
                Console.Write("正在处理" + Path.GetFileNameWithoutExtension(file) + " ");
                string folder = Path.GetDirectoryName(file) + @"\ImageResizer";
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);
                Bitmap bmp = new Bitmap(file);
                int w = bmp.Width;
                int h = bmp.Height;
                Console.Write("原尺寸(" + w.ToString() + "," + h.ToString() + ") ");
                if (w > width)
                {
                    h = Convert.ToInt32((float)h * width / w);
                    w = width;
                }
                if (h > height)
                {
                    w = Convert.ToInt32((float)w * height / h);
                    h = height;
                }
                Console.Write("新尺寸(" + w.ToString() + "," + h.ToString() + ") ");
                Bitmap thumb = new Bitmap(w, h, PixelFormat.Format24bppRgb);
                Graphics g = Graphics.FromImage(thumb);
                g.InterpolationMode = InterpolationMode.HighQualityBicubic;
                g.PixelOffsetMode = PixelOffsetMode.HighQuality;
                g.SmoothingMode = SmoothingMode.HighQuality;
                g.Clear(Color.White);
                g.DrawImage(bmp, new Rectangle(0, 0, w, h), new Rectangle(0, 0, bmp.Width, bmp.Height), GraphicsUnit.Pixel);
                thumb.Save(folder + @"\" + Path.GetFileName(file), System.Drawing.Imaging.ImageFormat.Jpeg);
                g.Dispose();
                thumb.Dispose();
                Console.WriteLine("已保存");
            }
            catch (Exception e)
            {
                Console.WriteLine("发生错误：" + e.ToString());
            }
        }
    }
}
