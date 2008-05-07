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
using System.Windows.Shapes;

namespace yoursunny.P2008.Library.ServiceDesk
{
    public partial class ServiceMain : Window
    {
        #region RibbonBar
        private System.ComponentModel.IContainer components = null;
        //private System.Windows.Forms.ImageList RibbonImageList;
        private Telerik.WinControls.UI.RadRibbonBar RibbonBar;
        private Telerik.WinControls.UI.TabItem tabItem1;
        private Telerik.WinControls.UI.TabItem tabItem2;
        private Telerik.WinControls.UI.TabItem tabItem3;
        private Telerik.WinControls.UI.TabItem tabItem4;
        private Telerik.WinControls.UI.RadMenuItem radMenuItem1;
        private Telerik.WinControls.UI.RadMenuItem radMenuItem2;
        private Telerik.WinControls.UI.RadMenuSeparatorItem radMenuSeparatorItem1;
        private Telerik.WinControls.UI.RadMenuItem radMenuItem3;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk1;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement1;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement2;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk2;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement3;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement4;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk3;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement5;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk4;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement6;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement7;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement8;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk5;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement9;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement10;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk6;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement11;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement12;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk7;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement13;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk8;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement14;
        private Telerik.WinControls.UI.RadRibbonBarChunk radRibbonBarChunk9;
        private Telerik.WinControls.UI.RadButtonElement radButtonElement15;
        private void InitializeRibbonBar()
        {
            EventHandler hButtonClick_ShowPage = new EventHandler(ButtonClick_ShowPage);
            this.components = new System.ComponentModel.Container();
            //System.ComponentModel.ComponentResourceManager resources = new System.ComponentModel.ComponentResourceManager(typeof(MDIParent));
            Telerik.WinControls.UI.RadRibbonBarCommandTab radRibbonBarCommandTab1 = new Telerik.WinControls.UI.RadRibbonBarCommandTab();
            Telerik.WinControls.UI.RadRibbonBarCommandTab radRibbonBarCommandTab2 = new Telerik.WinControls.UI.RadRibbonBarCommandTab();
            Telerik.WinControls.UI.RadRibbonBarCommandTab radRibbonBarCommandTab3 = new Telerik.WinControls.UI.RadRibbonBarCommandTab();
            Telerik.WinControls.UI.RadRibbonBarCommandTab radRibbonBarCommandTab4 = new Telerik.WinControls.UI.RadRibbonBarCommandTab();
            //this.RibbonImageList = new System.Windows.Forms.ImageList(this.components);
            this.tabItem1 = new Telerik.WinControls.UI.TabItem();
            this.tabItem2 = new Telerik.WinControls.UI.TabItem();
            this.tabItem3 = new Telerik.WinControls.UI.TabItem();
            this.tabItem4 = new Telerik.WinControls.UI.TabItem();
            this.RibbonBar = new Telerik.WinControls.UI.RadRibbonBar();
            this.radMenuItem1 = new Telerik.WinControls.UI.RadMenuItem();
            this.radMenuItem2 = new Telerik.WinControls.UI.RadMenuItem();
            this.radMenuSeparatorItem1 = new Telerik.WinControls.UI.RadMenuSeparatorItem();
            this.radMenuItem3 = new Telerik.WinControls.UI.RadMenuItem();
            this.radRibbonBarChunk1 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement1 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement2 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk2 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement3 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement4 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk3 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement5 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk4 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement6 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement7 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement8 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk5 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement9 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement10 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk6 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement11 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement12 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk7 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement13 = new Telerik.WinControls.UI.RadButtonElement();
            this.radRibbonBarChunk8 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radRibbonBarChunk9 = new Telerik.WinControls.UI.RadRibbonBarChunk();
            this.radButtonElement14 = new Telerik.WinControls.UI.RadButtonElement();
            this.radButtonElement15 = new Telerik.WinControls.UI.RadButtonElement();
            ((System.ComponentModel.ISupportInitialize)(this.RibbonBar)).BeginInit();
            //this.SuspendLayout();
            //// 
            //// RibbonImageList
            //// 
            //this.RibbonImageList.ImageStream = ((System.Windows.Forms.ImageListStreamer)(resources.GetObject("RibbonImageStream")));
            ////this.RibbonImageList.ImageStream = (System.Windows.Forms.ImageListStreamer)Application.Current.Resources["RibbonImageStream"];
            //this.RibbonImageList.TransparentColor = System.Drawing.Color.Transparent;
            //this.RibbonImageList.Images.SetKeyName(0, "ribbon_borrow.gif");
            //this.RibbonImageList.Images.SetKeyName(1, "ribbon_return.gif");
            //this.RibbonImageList.Images.SetKeyName(2, "ribbon_reserve_book.gif");
            //this.RibbonImageList.Images.SetKeyName(3, "ribbon_reserve_copy.gif");
            //this.RibbonImageList.Images.SetKeyName(4, "ribbon_fine.gif");
            //this.RibbonImageList.Images.SetKeyName(5, "ribbon_rcreate.gif");
            //this.RibbonImageList.Images.SetKeyName(6, "ribbon_rrenew.gif");
            //this.RibbonImageList.Images.SetKeyName(7, "ribbon_rquit.gif");
            //this.RibbonImageList.Images.SetKeyName(8, "ribbon_rlost.gif");
            //this.RibbonImageList.Images.SetKeyName(9, "ribbon_rgot.gif");
            //this.RibbonImageList.Images.SetKeyName(10, "ribbon_q1.gif");
            //this.RibbonImageList.Images.SetKeyName(11, "ribbon_q2.gif");
            //this.RibbonImageList.Images.SetKeyName(12, "ribbon_q3.gif");
            //this.RibbonImageList.Images.SetKeyName(13, "ribbon_urge.gif");
            //this.RibbonImageList.Images.SetKeyName(14, "ribbon_paper.gif");
            // 
            // tabItem1
            // 
            this.tabItem1.AccessibleDescription = "";
            this.tabItem1.CanFocus = true;
            this.tabItem1.Class = "TabItem";
            // 
            // 
            // 
            this.tabItem1.ContentPanel.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.tabItem1.ContentPanel.Location = new System.Drawing.Point(0, 0);
            this.tabItem1.ContentPanel.Name = "";
            this.tabItem1.ContentPanel.TabIndex = 0;
            this.tabItem1.IsSelected = true;
            this.tabItem1.KeyTip = "";
            this.tabItem1.Text = "流通业务";
            this.tabItem1.ToolTipText = null;
            // 
            // tabItem2
            // 
            this.tabItem2.AccessibleDescription = "";
            this.tabItem2.CanFocus = true;
            this.tabItem2.Class = "TabItem";
            // 
            // 
            // 
            this.tabItem2.ContentPanel.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.tabItem2.ContentPanel.Location = new System.Drawing.Point(0, 0);
            this.tabItem2.ContentPanel.Name = "";
            this.tabItem2.ContentPanel.TabIndex = 0;
            this.tabItem2.KeyTip = "";
            this.tabItem2.Text = "读者证业务";
            this.tabItem2.ToolTipText = null;
            // 
            // tabItem3
            // 
            this.tabItem3.AccessibleDescription = "";
            this.tabItem3.CanFocus = true;
            this.tabItem3.Class = "TabItem";
            // 
            // 
            // 
            this.tabItem3.ContentPanel.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.tabItem3.ContentPanel.Location = new System.Drawing.Point(0, 0);
            this.tabItem3.ContentPanel.Name = "";
            this.tabItem3.ContentPanel.TabIndex = 0;
            this.tabItem3.KeyTip = "";
            this.tabItem3.Text = "书目查询";
            this.tabItem3.ToolTipText = null;
            // 
            // tabItem4
            // 
            this.tabItem4.AccessibleDescription = "";
            this.tabItem4.CanFocus = true;
            this.tabItem4.Class = "TabItem";
            // 
            // 
            // 
            this.tabItem4.ContentPanel.BackColor = System.Drawing.SystemColors.ControlLightLight;
            this.tabItem4.ContentPanel.Location = new System.Drawing.Point(0, 0);
            this.tabItem4.ContentPanel.Name = "";
            this.tabItem4.ContentPanel.TabIndex = 0;
            this.tabItem4.KeyTip = "";
            this.tabItem4.Text = "其他功能";
            this.tabItem4.ToolTipText = null;
            // 
            // RibbonBar
            // 
            this.RibbonBar.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(191)))), ((int)(((byte)(219)))), ((int)(((byte)(254)))));
            radRibbonBarCommandTab1.ContextualTabGroup = null;
            radRibbonBarCommandTab1.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radRibbonBarChunk1,
            this.radRibbonBarChunk2,
            this.radRibbonBarChunk3});
            radRibbonBarCommandTab1.Tab = this.tabItem1;
            radRibbonBarCommandTab2.ContextualTabGroup = null;
            radRibbonBarCommandTab2.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radRibbonBarChunk4,
            this.radRibbonBarChunk5});
            radRibbonBarCommandTab2.Tab = this.tabItem2;
            radRibbonBarCommandTab3.ContextualTabGroup = null;
            radRibbonBarCommandTab3.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radRibbonBarChunk6,
            this.radRibbonBarChunk7});
            radRibbonBarCommandTab3.Tab = this.tabItem3;
            radRibbonBarCommandTab4.ContextualTabGroup = null;
            radRibbonBarCommandTab4.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radRibbonBarChunk8,
            this.radRibbonBarChunk9});
            radRibbonBarCommandTab4.Tab = this.tabItem4;
            this.RibbonBar.CommandTabs.AddRange(new Telerik.WinControls.UI.RadRibbonBarCommandTab[] {
            radRibbonBarCommandTab1,
            radRibbonBarCommandTab2,
            radRibbonBarCommandTab3,
            radRibbonBarCommandTab4});
            this.RibbonBar.DisableMouseEvents = false;
            this.RibbonBar.Dock = System.Windows.Forms.DockStyle.Top;
            //this.RibbonBar.ImageList = this.RibbonImageList;
            this.RibbonBar.Location = new System.Drawing.Point(0, 0);
            this.RibbonBar.Name = "RibbonBar";
            this.RibbonBar.QuickAccessToolbarBelowRibbon = false;
            this.RibbonBar.QuickAccessToolBarHeight = 20;
            // 
            // RibbonBar.RootElement
            // 
            this.RibbonBar.RootElement.AccessibleDescription = "";
            this.RibbonBar.RootElement.AutoSizeMode = Telerik.WinControls.RadAutoSizeMode.WrapAroundChildren;
            this.RibbonBar.RootElement.KeyTip = "";
            this.RibbonBar.RootElement.ToolTipText = null;
            this.RibbonBar.Size = new System.Drawing.Size(632, 143);
            this.RibbonBar.SmallImageList = null;
            //this.RibbonBar.StartButtonImage = ((System.Drawing.Image)(resources.GetObject("RibbonBar.StartButtonImage")));
            //this.RibbonBar.StartButtonImage = (System.Drawing.Image)Application.Current.Resources["RibbonBarStartButtonImage"];
            this.RibbonBar.StartButtonImage = RibbonBarImages.ribbon_start;
            this.RibbonBar.StartMenuItems.AddRange(new Telerik.WinControls.RadItem[] {
            this.radMenuItem1,
            this.radMenuItem2,
            this.radMenuSeparatorItem1,
            this.radMenuItem3});
            this.RibbonBar.TabIndex = 1;
            this.RibbonBar.Text = "图书管理信息系统 借还书、读者服务工作台";
            // 
            // radMenuItem1
            // 
            this.radMenuItem1.AccessibleDescription = "";
            this.radMenuItem1.Class = "RadMenuItem";
            this.radMenuItem1.HasTwoColumnDropDown = false;
            this.radMenuItem1.IsMainMenuItem = false;
            this.radMenuItem1.KeyTip = "";
            this.radMenuItem1.Text = "帮助";
            this.radMenuItem1.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.radMenuItem1.ToggleState = Telerik.WinControls.Enumerations.ToggleState.Off;
            this.radMenuItem1.ToolTipText = null;
            // 
            // radMenuItem2
            // 
            this.radMenuItem2.AccessibleDescription = "";
            this.radMenuItem2.Class = "RadMenuItem";
            this.radMenuItem2.HasTwoColumnDropDown = false;
            this.radMenuItem2.IsMainMenuItem = false;
            this.radMenuItem2.KeyTip = "";
            this.radMenuItem2.Text = "关于";
            this.radMenuItem2.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.radMenuItem2.ToggleState = Telerik.WinControls.Enumerations.ToggleState.Off;
            this.radMenuItem2.ToolTipText = null;
            // 
            // radMenuSeparatorItem1
            // 
            this.radMenuSeparatorItem1.AccessibleDescription = "";
            this.radMenuSeparatorItem1.AutoSize = false;
            this.radMenuSeparatorItem1.Bounds = new System.Drawing.Rectangle(0, 48, 60, 1);
            this.radMenuSeparatorItem1.Class = "RadMenuItem";
            this.radMenuSeparatorItem1.HasTwoColumnDropDown = false;
            this.radMenuSeparatorItem1.IsMainMenuItem = false;
            this.radMenuSeparatorItem1.KeyTip = "";
            this.radMenuSeparatorItem1.PositionOffset = new System.Drawing.SizeF(26F, 0F);
            this.radMenuSeparatorItem1.SweepAngle = 0;
            this.radMenuSeparatorItem1.Text = "New item";
            this.radMenuSeparatorItem1.ToolTipText = null;
            // 
            // radMenuItem3
            // 
            this.radMenuItem3.AccessibleDescription = "";
            this.radMenuItem3.Class = "RadMenuItem";
            this.radMenuItem3.HasTwoColumnDropDown = false;
            this.radMenuItem3.IsMainMenuItem = false;
            this.radMenuItem3.KeyTip = "";
            this.radMenuItem3.Text = "退出";
            this.radMenuItem3.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageBeforeText;
            this.radMenuItem3.ToggleState = Telerik.WinControls.Enumerations.ToggleState.Off;
            this.radMenuItem3.ToolTipText = null;
            this.radMenuItem3.Click += new EventHandler(ExitButton_Click);
            // 
            // radRibbonBarChunk1
            // 
            this.radRibbonBarChunk1.AccessibleDescription = "";
            this.radRibbonBarChunk1.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement1,
            this.radButtonElement2});
            this.radRibbonBarChunk1.KeyTip = "";
            this.radRibbonBarChunk1.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk1.Text = "借还书";
            this.radRibbonBarChunk1.ToolTipText = null;
            // 
            // radButtonElement1
            // 
            this.radButtonElement1.AccessibleDescription = "";
            this.radButtonElement1.CanFocus = true;
            this.radButtonElement1.Class = "RibbonBarButtonElement";
            //this.radButtonElement1.ImageIndex = 0;
            this.radButtonElement1.Image = RibbonBarImages.ribbon_borrow;
            this.radButtonElement1.KeyTip = "";
            this.radButtonElement1.ShowBorder = true;
            this.radButtonElement1.Text = "借阅";
            this.radButtonElement1.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement1.ToolTipText = null;
            this.radButtonElement1.Click += hButtonClick_ShowPage;
            this.radButtonElement1.Tag = "BorrowPage.xaml";
            // 
            // radButtonElement2
            // 
            this.radButtonElement2.AccessibleDescription = "";
            this.radButtonElement2.CanFocus = true;
            this.radButtonElement2.Class = "RibbonBarButtonElement";
            //this.radButtonElement2.ImageIndex = 1;
            this.radButtonElement2.Image = RibbonBarImages.ribbon_return;
            this.radButtonElement2.KeyTip = "";
            this.radButtonElement2.ShowBorder = true;
            this.radButtonElement2.Text = "归还";
            this.radButtonElement2.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement2.ToolTipText = null;
            this.radButtonElement2.Click += hButtonClick_ShowPage;
            this.radButtonElement2.Tag = "ReturnPage.xaml";
            // 
            // radRibbonBarChunk2
            // 
            this.radRibbonBarChunk2.AccessibleDescription = "";
            this.radRibbonBarChunk2.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement3,
            this.radButtonElement4});
            this.radRibbonBarChunk2.KeyTip = "";
            this.radRibbonBarChunk2.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk2.Text = "预约";
            this.radRibbonBarChunk2.ToolTipText = null;
            // 
            // radButtonElement3
            // 
            this.radButtonElement3.AccessibleDescription = "";
            this.radButtonElement3.CanFocus = true;
            this.radButtonElement3.Class = "RibbonBarButtonElement";
            //this.radButtonElement3.ImageIndex = 2;
            this.radButtonElement3.Image = RibbonBarImages.ribbon_reserve_book;
            this.radButtonElement3.KeyTip = "";
            this.radButtonElement3.ShowBorder = true;
            this.radButtonElement3.Text = "预约馆藏";
            this.radButtonElement3.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement3.ToolTipText = null;
            this.radButtonElement3.Click += hButtonClick_ShowPage;
            this.radButtonElement3.Tag = "ReserveBookPage.xaml";
            // 
            // radButtonElement4
            // 
            this.radButtonElement4.AccessibleDescription = "";
            this.radButtonElement4.CanFocus = true;
            this.radButtonElement4.Class = "RibbonBarButtonElement";
            //this.radButtonElement4.ImageIndex = 3;
            this.radButtonElement4.Image = RibbonBarImages.ribbon_reserve_copy;
            this.radButtonElement4.KeyTip = "";
            this.radButtonElement4.ShowBorder = true;
            this.radButtonElement4.Text = "预约复本";
            this.radButtonElement4.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement4.ToolTipText = null;
            this.radButtonElement4.Click += hButtonClick_ShowPage;
            this.radButtonElement4.Tag = "ReserveCopyPage.xaml";
            // 
            // radRibbonBarChunk3
            // 
            this.radRibbonBarChunk3.AccessibleDescription = "";
            this.radRibbonBarChunk3.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement5});
            this.radRibbonBarChunk3.KeyTip = "";
            this.radRibbonBarChunk3.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk3.Text = "罚款";
            this.radRibbonBarChunk3.ToolTipText = null;
            // 
            // radButtonElement5
            // 
            this.radButtonElement5.AccessibleDescription = "";
            this.radButtonElement5.CanFocus = true;
            this.radButtonElement5.Class = "RibbonBarButtonElement";
            //this.radButtonElement5.ImageIndex = 4;
            this.radButtonElement5.Image = RibbonBarImages.ribbon_fine;
            this.radButtonElement5.KeyTip = "";
            this.radButtonElement5.ShowBorder = true;
            this.radButtonElement5.Text = "缴纳罚款";
            this.radButtonElement5.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement5.ToolTipText = null;
            this.radButtonElement5.Click += hButtonClick_ShowPage;
            this.radButtonElement5.Tag = "FinePage.xaml";
            // 
            // radRibbonBarChunk4
            // 
            this.radRibbonBarChunk4.AccessibleDescription = "";
            this.radRibbonBarChunk4.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement6,
            this.radButtonElement7,
            this.radButtonElement8});
            this.radRibbonBarChunk4.KeyTip = "";
            this.radRibbonBarChunk4.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk4.Text = "办退卡";
            this.radRibbonBarChunk4.ToolTipText = null;
            // 
            // radButtonElement6
            // 
            this.radButtonElement6.AccessibleDescription = "";
            this.radButtonElement6.CanFocus = true;
            this.radButtonElement6.Class = "RibbonBarButtonElement";
            //this.radButtonElement6.ImageIndex = 5;
            this.radButtonElement6.Image = RibbonBarImages.ribbon_rcreate;
            this.radButtonElement6.KeyTip = "";
            this.radButtonElement6.ShowBorder = true;
            this.radButtonElement6.Text = "办卡";
            this.radButtonElement6.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement6.ToolTipText = null;
            this.radButtonElement6.Click += hButtonClick_ShowPage;
            this.radButtonElement6.Tag = "CardCreatePage.xaml";
            // 
            // radButtonElement7
            // 
            this.radButtonElement7.AccessibleDescription = "";
            this.radButtonElement7.CanFocus = true;
            this.radButtonElement7.Class = "RibbonBarButtonElement";
            //this.radButtonElement7.ImageIndex = 6;
            this.radButtonElement7.Image = RibbonBarImages.ribbon_rrenew;
            this.radButtonElement7.KeyTip = "";
            this.radButtonElement7.ShowBorder = true;
            this.radButtonElement7.Text = "续费";
            this.radButtonElement7.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement7.ToolTipText = null;
            this.radButtonElement7.Click += hButtonClick_ShowPage;
            this.radButtonElement7.Tag = "CardRenewPage.xaml";
            // 
            // radButtonElement8
            // 
            this.radButtonElement8.AccessibleDescription = "";
            this.radButtonElement8.CanFocus = true;
            this.radButtonElement8.Class = "RibbonBarButtonElement";
            //this.radButtonElement8.ImageIndex = 7;
            this.radButtonElement8.Image = RibbonBarImages.ribbon_rquit;
            this.radButtonElement8.KeyTip = "";
            this.radButtonElement8.ShowBorder = true;
            this.radButtonElement8.Text = "退卡";
            this.radButtonElement8.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement8.ToolTipText = null;
            this.radButtonElement8.Click += hButtonClick_ShowPage;
            this.radButtonElement8.Tag = "CardQuitPage.xaml";
            // 
            // radRibbonBarChunk5
            // 
            this.radRibbonBarChunk5.AccessibleDescription = "";
            this.radRibbonBarChunk5.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement9,
            this.radButtonElement10});
            this.radRibbonBarChunk5.KeyTip = "";
            this.radRibbonBarChunk5.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk5.Text = "挂失";
            this.radRibbonBarChunk5.ToolTipText = null;
            // 
            // radButtonElement9
            // 
            this.radButtonElement9.AccessibleDescription = "";
            this.radButtonElement9.CanFocus = true;
            this.radButtonElement9.Class = "RibbonBarButtonElement";
            //this.radButtonElement9.ImageIndex = 8;
            this.radButtonElement9.Image = RibbonBarImages.ribbon_rlost;
            this.radButtonElement9.KeyTip = "";
            this.radButtonElement9.ShowBorder = true;
            this.radButtonElement9.Text = "挂失";
            this.radButtonElement9.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement9.ToolTipText = null;
            this.radButtonElement9.Click += hButtonClick_ShowPage;
            this.radButtonElement9.Tag = "CardLostPage.xaml";
            // 
            // radButtonElement10
            // 
            this.radButtonElement10.AccessibleDescription = "";
            this.radButtonElement10.CanFocus = true;
            this.radButtonElement10.Class = "RibbonBarButtonElement";
            //this.radButtonElement10.ImageIndex = 9;
            this.radButtonElement10.Image = RibbonBarImages.ribbon_rgot;
            this.radButtonElement10.KeyTip = "";
            this.radButtonElement10.ShowBorder = true;
            this.radButtonElement10.Text = "解除挂失";
            this.radButtonElement10.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement10.ToolTipText = null;
            this.radButtonElement10.Click += hButtonClick_ShowPage;
            this.radButtonElement10.Tag = "CardGotPage.xaml";
            // 
            // radRibbonBarChunk6
            // 
            this.radRibbonBarChunk6.AccessibleDescription = "";
            this.radRibbonBarChunk6.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement11,
            this.radButtonElement12});
            this.radRibbonBarChunk6.KeyTip = "";
            this.radRibbonBarChunk6.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk6.Text = "简单查询";
            this.radRibbonBarChunk6.ToolTipText = null;
            // 
            // radButtonElement11
            // 
            this.radButtonElement11.AccessibleDescription = "";
            this.radButtonElement11.CanFocus = true;
            this.radButtonElement11.Class = "RibbonBarButtonElement";
            //this.radButtonElement11.ImageIndex = 10;
            this.radButtonElement11.Image = RibbonBarImages.ribbon_q1;
            this.radButtonElement11.KeyTip = "";
            this.radButtonElement11.ShowBorder = true;
            this.radButtonElement11.Text = "按索书号";
            this.radButtonElement11.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement11.ToolTipText = null;
            this.radButtonElement11.Click += hButtonClick_ShowPage;
            this.radButtonElement11.Tag = "QueryCallNumberPage.xaml";
            // 
            // radButtonElement12
            // 
            this.radButtonElement12.AccessibleDescription = "";
            this.radButtonElement12.CanFocus = true;
            this.radButtonElement12.Class = "RibbonBarButtonElement";
            //this.radButtonElement12.ImageIndex = 11;
            this.radButtonElement12.Image = RibbonBarImages.ribbon_q2;
            this.radButtonElement12.KeyTip = "";
            this.radButtonElement12.ShowBorder = true;
            this.radButtonElement12.Text = "按题名";
            this.radButtonElement12.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement12.ToolTipText = null;
            this.radButtonElement12.Click += hButtonClick_ShowPage;
            this.radButtonElement12.Tag = "QueryTitlePage.xaml";
            // 
            // radRibbonBarChunk7
            // 
            this.radRibbonBarChunk7.AccessibleDescription = "";
            this.radRibbonBarChunk7.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement13});
            this.radRibbonBarChunk7.KeyTip = "";
            this.radRibbonBarChunk7.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk7.Text = "高级查询";
            this.radRibbonBarChunk7.ToolTipText = null;
            // 
            // radButtonElement13
            // 
            this.radButtonElement13.AccessibleDescription = "";
            this.radButtonElement13.CanFocus = true;
            this.radButtonElement13.Class = "RibbonBarButtonElement";
            //this.radButtonElement13.ImageIndex = 12;
            this.radButtonElement13.Image = RibbonBarImages.ribbon_q3;
            this.radButtonElement13.KeyTip = "";
            this.radButtonElement13.ShowBorder = true;
            this.radButtonElement13.Text = "高级查询";
            this.radButtonElement13.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement13.ToolTipText = null;
            this.radButtonElement13.Click += hButtonClick_ShowPage;
            this.radButtonElement13.Tag = "QueryPage.xaml";
            // 
            // radRibbonBarChunk8
            // 
            this.radRibbonBarChunk8.AccessibleDescription = "";
            this.radRibbonBarChunk8.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement14});
            this.radRibbonBarChunk8.KeyTip = "";
            this.radRibbonBarChunk8.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk8.Text = "内部业务";
            this.radRibbonBarChunk8.ToolTipText = null;
            // 
            // radButtonElement14
            // 
            this.radButtonElement14.AccessibleDescription = "";
            this.radButtonElement14.CanFocus = true;
            this.radButtonElement14.Class = "RibbonBarButtonElement";
            //this.radButtonElement14.ImageIndex = 13;
            this.radButtonElement14.Image = RibbonBarImages.ribbon_urge;
            this.radButtonElement14.KeyTip = "";
            this.radButtonElement14.ShowBorder = true;
            this.radButtonElement14.Text = "催还";
            this.radButtonElement14.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement14.ToolTipText = null;
            this.radButtonElement14.Click += hButtonClick_ShowPage;
            this.radButtonElement14.Tag = "ReturnUrgePage.xaml";
            // 
            // radRibbonBarChunk9
            // 
            this.radRibbonBarChunk9.AccessibleDescription = "";
            this.radRibbonBarChunk9.Items.AddRange(new Telerik.WinControls.RadItem[] {
            this.radButtonElement15});
            this.radRibbonBarChunk9.KeyTip = "";
            this.radRibbonBarChunk9.Orientation = System.Windows.Forms.Orientation.Horizontal;
            this.radRibbonBarChunk9.Text = "统计分析";
            this.radRibbonBarChunk9.ToolTipText = null;
            // 
            // radButtonElement15
            // 
            this.radButtonElement15.AccessibleDescription = "";
            this.radButtonElement15.CanFocus = true;
            this.radButtonElement15.Class = "RibbonBarButtonElement";
            //this.radButtonElement15.ImageIndex = 14;
            this.radButtonElement15.Image = RibbonBarImages.ribbon_paper;
            this.radButtonElement15.KeyTip = "";
            this.radButtonElement15.ShowBorder = true;
            this.radButtonElement15.Text = "统计报表";
            this.radButtonElement15.TextImageRelation = System.Windows.Forms.TextImageRelation.ImageAboveText;
            this.radButtonElement15.ToolTipText = null;
            this.radButtonElement15.Click += hButtonClick_ShowPage;
            this.radButtonElement15.Tag = "AnalyticsPage.xaml";
            ((System.ComponentModel.ISupportInitialize)(this.RibbonBar)).EndInit();
            //this.ResumeLayout(false);
            this.RibbonBarHost.Child = this.RibbonBar;
        }
        #endregion
        public ServiceMain()
        {
            InitializeComponent();
            try
            {
                InitializeRibbonBar();
            }
            catch (Exception ex) { MessageBox.Show(ex.ToString()); }
        }
        public void ButtonClick_ShowPage(object sender, EventArgs e)
        {
            Telerik.WinControls.RadElement button = sender as Telerik.WinControls.RadElement;
            if (button == null || string.IsNullOrEmpty(button.Tag as string)) return;
            PageFrame.Navigate(new Uri(button.Tag as string, UriKind.Relative));
        }
        public void ExitButton_Click(object sender, EventArgs e)
        {
            App.Current.Shutdown();
        }
    }
}
