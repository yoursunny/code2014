//--------------------------------基本服务--------------------------------
function usermenu(o,user_type)//打开用户面板
{
	$R(1,6).each(function(k){$('usermenu'+k).hide();});
	$('usermenu'+user_type).show();
}

function run(action)//运行功能
{
	document.getElementsByClassName('action').invoke('hide');
	var d=$(action);
	if (!d) return;
	Effect.Appear(d);
	eval(action+"('init');");
}
function gohome()//返回初始
{
	run('_init_');
}
function not_impl()//未实现
{
	alert('本演示版本中，该功能未实现');
}
Event.observe(window,'load',gohome);
//--------------------------------数据调用--------------------------------
function data_cat(cb_or_select,set_value,transport)//分类，参数1=回调函数或要填充的SELECT对象，参数2=SELECT选中ID
{
	if (typeof data_cat.d=='undefined')
	{
		if (transport)
		{
			var r=transport.responseText.evalJSON();
			var S=function(parentID) {//查询指定类别的子类树
				var childrenObjects=r.findAll(function(k){return k.parentID==parentID;});
				var Sa=[];
				childrenObjects.each(function(k){
					Sa.push({ID:k.ID,title:k.title,c:S(k.ID)});
				});
				return Sa;
			};
			data_cat.d=S(null);
		}
		else return new Ajax.Request('data_cat.php',{onComplete:data_cat.bind(null,cb_or_select,set_value)});
	}
	if (!cb_or_select) return;
	if (typeof cb_or_select=='function') return cb_or_select(data_cat.d);
	if (cb_or_select.options)//SELECT
	{
		Form.clearSelect(cb_or_select);
		var I=function(k,depth) {//显示在SELECT中
			cb_or_select.options[cb_or_select.length]=new Option('　'.times(depth)+k.title,k.ID,k.ID==set_value,k.ID==set_value);
			k.c.each(function(kk){I(kk,depth+1);});
		};
		data_cat.d.each(function(k){
			I(k,0);
		});
	}
}
function data_shop(cb_or_select,set_value,transport)//门店，参数1=回调函数或要填充的SELECT对象，参数2=SELECT选中ID
{
	if (typeof data_shop.d=='undefined')
	{
		if (transport)
		{
			data_shop.d=transport.responseText.evalJSON();
		}
		else return new Ajax.Request('data_shop.php',{onComplete:data_shop.bind(null,cb_or_select,set_value)});
	}
	if (!cb_or_select) return;
	if (typeof cb_or_select=='function') return cb_or_select(data_shop.d);
	if (cb_or_select.options)//SELECT
	{
		Form.clearSelect(cb_or_select);
		data_shop.d.each(function(k){
			cb_or_select.options[cb_or_select.length]=new Option(k.sName,k.ID,k.ID==set_value,k.ID==set_value);
		});
	}
}
function data_warehouse(cb_or_select,set_value,transport)//仓库，参数1=回调函数或要填充的SELECT对象，参数2=SELECT选中ID
{
	if (typeof data_warehouse.d=='undefined')
	{
		if (transport)
		{
			data_warehouse.d=transport.responseText.evalJSON();
		}
		else return new Ajax.Request('data_warehouse.php',{onComplete:data_warehouse.bind(null,cb_or_select,set_value)});
	}
	if (!cb_or_select) return;
	if (typeof cb_or_select=='function') return cb_or_select(data_warehouse.d);
	if (cb_or_select.options)//SELECT
	{
		Form.clearSelect(cb_or_select);
		data_warehouse.d.each(function(k){
			cb_or_select.options[cb_or_select.length]=new Option(k.wName,k.ID,k.ID==set_value,k.ID==set_value);
		});
	}
}
//--------------------------------功能模块--------------------------------

function query(a,transport)//查询商品
{
	switch (a)
	{
	case 'init':
		data_cat($('query_cat'),null);
		data_shop($('query_shop'),null);
		break;
	case 'by_cat':
		new Ajax.Request('query.php?a=by_cat/product',{parameters:{cat:$F('query_cat'),shop:$F('query_shop')},onComplete:query.bind(null,'cb_product')});
		break;
	case 'by_name':
		new Ajax.Request('query.php?a=by_name',{parameters:{name:$F('query_pName'),shop:$F('query_shop')},onComplete:query.bind(null,'cb_product')});
		break;
	case 'cb_product':
		var d=transport.responseText.evalJSON();
		$('query_r').update('<table border="1"><tr><th>'+['条码号','名称','品牌','型号','价格','本店库存','操作'].join('</th><th>')+'</th></tr>'+new Template('<tr><td>#{pID}</td><td>#{pName}</td><td>#{brandName}</td><td>#{model}</td><td>#{price}</td><td>#{n}</td><td><input type="button" value="选择" onclick="query_select(\'#{pID}\')" /></td></tr>').evalAll(d)+'</table>');
		break;
	}
}
function query_call(catID,shopID,ele,cb)//调用查询商品子过程
{
	query_select.cb=cb;
	data_cat($('query_cat'),catID);
	data_shop($('query_shop'),shopID);
	Position.clone(ele,$('query').show().setStyle({position:'absolute'}),{setWidth:false,setHeight:false,offsetLeft:-30,offsetTop:20});
}
function query_select(pID)//点击商品查询结果事件
{
	var cb=query_select.cb;
	query_select.cb=null;
	if (cb!=null) cb(pID);
	$('query').setStyle({position:''}).hide();
}

function bill(a,transport)//开具购物单
{
	switch (a)
	{
	case 'init':
		data_shop($('bill_shop'),null);
		$('bill_submit').disable();
		$('bill_pID').value='';
		$('bill_available').update();
		if (!bill.events)
		{
			bill.events=true;
			bill.pID_available=bill.bind(null,'available');
			Event.observe('bill_shop','change',bill.pID_available);
			Event.observe('bill_pID','change',bill.pID_available);
			bill.query_hide=bill.bind(null,'query_hide');
			Event.observe('bill_shop','focus',bill.query_hide);
			Event.observe('bill_pID','focus',bill.query_hide);
			bill.pID_autocompleter=new Ajax.Autocompleter('bill_pID','bill_pID_autocompleter','bill.php?a=autocompleter',{paramName:'pID',afterUpdateElement:bill.pID_available});
		}
		break;
	case 'query':
		query_call(null,$F('bill_shop'),'bill_pID',bill.bind(null,'query_cb'));
		break;
	case 'query_cb':
		//现在transport是商品编号
		$('bill_pID').value=transport;
		bill.pID_available();
		break;
	case 'query_hide':
		$('query').hide();
		break;
	case 'available':
		if ($F('bill_pID').length!=13) return;
		new Ajax.Request('bill.php?a=available',{parameters:{shop:$F('bill_shop'),pID:$F('bill_pID')},onComplete:bill.bind(null,'available_cb')});
		break;
	case 'available_cb':
		var resp=transport.responseText.evalJSON();
		if ($F('bill_pID')!=resp.pID) return;
		$('bill_available').update(resp.msg);
		if (resp.available) $('bill_submit').enable(); else $('bill_submit').disable();
		break;
	case 'submit':
		new Ajax.Request('bill.php?a=submit',{parameters:{shop:$F('bill_shop'),pID:$F('bill_pID')}});
		break;
	}
}

function dispatch(a,transport)//发货
{
	switch (a)
	{
	case 'init':
		data_shop($('dispatch_shop'),null);
		$('dispatch_r').update();
		break;
		break;
	case 'list':
		new Ajax.Request('dispatch.php?a=list',{parameters:{shop:$F('dispatch_shop')},onComplete:dispatch.bind(null,'list_cb')});
		break;
	case 'list_cb':
		dispatch.list=transport.responseText.evalJSON();
		var tpl=new Template('<tr id="dispatch_r_#{ID}"><td>#{ID}</td><td>#{pID}</td><td>#{pName}</td><td><input id="dispatch_r_#{ID}_d" type="button" value="发货" onclick="dispatch(\'dispatch\',#{ID})" /></td></tr>');
		$('dispatch_r').update('<table border="1"><caption>本店待发的货物</caption><tr><th>购物单编号</th><th>条码号</th><th>商品名</th><th>操作</th></tr>'+tpl.evalAll(dispatch.list)+'</table>');
		break;
	case 'dispatch':
		//现在transport是购物单编号
		var r=dispatch.list.find(function(k){return k.ID==transport;});
		if (!r) return;
		if (r.receiptPrinted==0) if (!confirm('请提醒顾客，尚未开具发票，发货后将无法开发票\n如果顾客需要开发票，请点击取消')) return;
		new Ajax.Request('dispatch.php?a=dispatch',{parameters:r});
		break;
	case 'dispatch_done':
		alert('发货处理成功，请将商品交给顾客');
		Effect.DropOut('dispatch_r_'+transport);
		break;
	}
}

function cashier(a,transport)//收款台
{
	switch (a)
	{
	case 'init':
		data_shop($('cashier_shop'),null);
		$('cashier_r').update();
		break;
	case 'list':
		new Ajax.Request('cashier.php?a=list',{parameters:{shop:$F('cashier_shop')},onComplete:cashier.bind(null,'list_cb')});
		break;
	case 'list_cb':
		cashier.list=transport.responseText.evalJSON();
		var tpl=new Template('<tr id="cashier_r_#{ID}"><td>#{ID}</td><td>#{pID}</td><td>#{pName}</td><td><input id="cashier_r_#{ID}_memberID" type="text" /><input type="button" value="报价" onclick="cashier_m(\'member\',#{ID})" /></td><td id="cashier_r_#{ID}_creditMember">&nbsp;</td><td id="cashier_r_#{ID}_price">&nbsp;</td><td id="cashier_r_#{ID}_creditGet">&nbsp;</td><td><input id="cashier_r_#{ID}_pay" type="button" disabled="disabled" value="收款" onclick="cashier_m(\'pay\',#{ID})" /></td></tr>');
		$('cashier_r').update('<table border="1"><caption>本店待收款的购物单</caption><tr><th>购物单编号</th><th>条码号</th><th>商品名</th><th>会员号</th><th>会员当前积分</th><th>享受价格</th><th>获取积分</th><th>操作</th></tr>'+tpl.evalAll(cashier.list)+'</table>');
		break;
	}
}
function cashier_m(a,ID,transport)//收款台记录操作
{
	var r=cashier.list.find(function(k){return k.ID==ID;});
	if (!r) return;
	switch (a)
	{
	case 'member':
		new Ajax.Request('cashier.php?a=price',{parameters:{shop:$F('cashier_shop'),member:$F('cashier_r_'+ID+'_memberID'),pID:r.pID},onComplete:cashier_m.bind(null,'member_cb',ID)});
		$('cashier_r_'+ID+'_pay').disable();
		r.member=$F('cashier_r_'+ID+'_memberID');
		r.shop=$F('cashier_shop');
		break;
	case 'member_cb':
		var p=transport.responseText.evalJSON();
		if (p.errmsg) return alert(p.errmsg);
		$('cashier_r_'+ID+'_creditMember').update(p.creditMember);
		$('cashier_r_'+ID+'_price').update(p.price);
		$('cashier_r_'+ID+'_creditGet').update(p.creditGet);
		$('cashier_r_'+ID+'_pay').enable();
		Object.extend(r,p);
		break;
	case 'pay':
		new Ajax.Request('cashier.php?a=pay',{parameters:r});
		break;
	case 'pay_done':
		alert('收款成功');
		Effect.DropOut('cashier_r_'+ID);
		break;
	}
}

function stock(a,transport)//进货
{
	switch (a)
	{
	case 'init':
		$('stock_pID').value='';
		$('stock_quantity').value='1';
		if (!stock.events)
		{
			stock.events=true;
			new Ajax.Autocompleter('stock_supplier','stock_supplier_autocompleter','stock.php?a=autocompleter',{paramName:'supplier'});
			new Ajax.Autocompleter('stock_pID','stock_pID_autocompleter','bill.php?a=autocompleter',{paramName:'pID'});
		}
		data_warehouse($('stock_warehouse'),null);
		break;
	case 'submit':
		stock.req={sNew:0,sName:$F('stock_supplier'),pID:$F('stock_pID'),wInto:$F('stock_warehouse'),price:$F('stock_price'),quantity:$F('stock_quantity')};
		stock('request');
		break;
	case 'request':
		new Ajax.Request('stock.php?a=submit',{parameters:stock.req});
		break;
	case 'new_supplier':
		stock.req.sNew=1;
		stock.req.sAddress=prompt('你正在新建一家供应商\n请输入供应商地址：');
		stock.req.sManager=prompt('请输入供应商经理姓名：');
		stock.req.sPhone=prompt('请输入供应商电话：');
		stock('request');
		break;
	}
}

function product(a,transport)//商品管理
{
	switch (a)
	{
	case 'init':
		product('list');
		break;
	case 'list':
		$('product_r').update();
		new Ajax.Request('product.php?a=list',{onComplete:product.bind(null,'list_cb')});
		break;
	case 'list_cb':
		product.list=transport.responseText.evalJSON();
		var tpl=new Template('<tr id="product_r_#{ID}"><td>#{ID}</td><td><span id="product_name_#{ID}">#{pName}</span></td><td><select id="product_cat_#{ID}"></select></td><td><span id="product_brand_#{ID}">#{brandName}</span></td><td><span id="product_model_#{ID}">#{model}</span></td><td><input type="button" value="报价管理" onclick="product_price(\'list\',\'#{ID}\')" /></td></tr>');
		$('product_r').update('<table border="1"><tr><th>商品编号</th><th>名称</th><th>分类</th><th>品牌</th><th>型号</th><th>操作</th></tr>'+tpl.evalAll(product.list)+'<tr><td><input id="product_ID_new" type="text" /></td><td><input id="product_name_new" type="text" /></td><td><select id="product_cat_new"></select></td><td><input id="product_brand_new" type="text" /></td><td><input id="product_model_new" type="text" /></td><td><input type="button" value="添加" onclick="product(\'insert\')" /></td></tr></table>');
		var InPlaceEditorOptions={okButton:false,cancelLink:false,savingText:'正在保存...',clickToEditText:'点击修改'};
		product.list.each(function(k){
			var ID=k.ID;
			new Ajax.InPlaceEditor('product_name_'+ID,'product.php?a=edit&col=pName&ID='+ID,InPlaceEditorOptions);
			new Ajax.InPlaceEditor('product_brand_'+ID,'product.php?a=edit&col=brandName&ID='+ID,InPlaceEditorOptions);
			new Ajax.InPlaceEditor('product_model_'+ID,'product.php?a=edit&col=model&ID='+ID,InPlaceEditorOptions);
		});
		data_cat(product.bind(null,'init_cat'));
		break;
	case 'init_cat':
		product.list.each(function(k){
			var ID=k.ID;
			data_cat($('product_cat_'+ID),k.cat);
			Event.observe($('product_cat_'+ID),'change',product.bind(null,'cat_update',ID));
		});
		data_cat($('product_cat_new'),null);
		break;
	case 'cat_update':
		//现在transport是商品编号
		new Ajax.Request('product.php?a=edit&col=cat&ID='+transport,{parameters:{value:$F('product_cat_'+transport)}});
		break;
	case 'insert':
		new Ajax.Request('product.php?a=insert',{parameters:{ID:$F('product_ID_new'),pName:$F('product_name_new'),cat:$F('product_cat_new'),brandName:$F('product_brand_new'),model:$F('product_model_new')},onComplete:product.bind(null,'insert_cb')});
		break;
	case 'insert_cb':
		if (transport.responseText!='OK') return alert('服务器返回错误信息：\n'+transport.responseText);
		product('list');
		break;
	}
}
function product_price(a,ID,transport)//报价管理
{
	var r=product.list.find(function(k){return k.ID==ID;});
	if (!r) return;
	switch (a)
	{
	case 'list':
		new Ajax.Request('product.php?a=price',{parameters:{ID:ID},onComplete:product_price.bind(null,'list_cb',ID)});
		break;
	case 'list_cb':
		r.price=transport.responseText.evalJSON();
		var tpl=new Template('<tr id="product_#{pID}_price_#{ID}"><td><select id="product_#{pID}_shop_#{ID}"></select></td><td>#{creditReq}</td><td>#{price}</td><td>#{creditGet}</td><td>#{startDate}</td><td>#{endDate}</td><td><input type="button" value="删除" onclick="product_price(\'delete\',\'#{pID}\',#{ID})" /></td></tr>');
		var b='<tr id="product_price_'+ID+'"><td colspan="6"><table border="1"><tr><th>门店</th><th>所需积分</th><th>价格</th><th>获取积分</th><th>开始日期</th><th>结束日期</th><th>操作</th></tr>'+tpl.evalAll(r.price)+'<tr><td><select id="product_'+ID+'_shop_new"></select></td><td><input id="product_'+ID+'_creditReq_new" type="text" value="0" /></td><td><input id="product_'+ID+'_price_new" type="text" /></td><td><input id="product_'+ID+'_creditGet_new" type="text" value="0" /></td><td><input id="product_'+ID+'_startDate_new" type="text" value="1000-01-01" /></td><td><input id="product_'+ID+'_endDate_new" type="text" value="9999-12-31" /></td><td><input type="button" value="添加" onclick="product_price(\'insert\',\''+ID+'\')" /></td></tr></table></td></tr>';
		var priceRow=$('product_price_'+ID); if (priceRow) priceRow.remove();
		new Insertion.After('product_r_'+ID,b);
		data_shop(product_price.bind(null,'init_shop',ID));
		break;
	case 'init_shop':
		r.price.each(function(k){data_shop($('product_'+k.pID+'_shop_'+k.ID).disable(),k.shopID);});
		data_shop($('product_'+ID+'_shop_new'),null);
		break;
	case 'insert':
		new Ajax.Request('product.php?a=price_insert',{parameters:{pID:ID,shopID:$F('product_'+ID+'_shop_new'),creditReq:$F('product_'+ID+'_creditReq_new'),price:$F('product_'+ID+'_price_new'),creditGet:$F('product_'+ID+'_creditGet_new'),startDate:$F('product_'+ID+'_startDate_new'),endDate:$F('product_'+ID+'_endDate_new')},onComplete:product_price.bind(null,'insert_cb',ID)});
		break;
	case 'insert_cb':
		if (transport.responseText!='OK') return alert('服务器返回错误信息：\n'+transport.responseText);
		product_price('list',ID);
		break;
	case 'delete':
		//现在transport是报价条目编号
		new Ajax.Request('product.php?a=price_delete',{parameters:{ID:transport}});
		Effect.DropOut('product_'+ID+'_price_'+transport);
		r.price=r.price.reject(function(k){return k.ID==transport;});
		break;
	}
}

function recv(a,transport)//收货
{
	switch (a)
	{
	case 'init':
		data_warehouse($('recv_warehouse'),null);
		break;
	case 'list':
		new Ajax.Request('recv.php?a=list',{parameters:{wInto:$F('recv_warehouse')},onComplete:recv.bind(null,'list_cb')});
		break;
	case 'list_cb':
		var lists=transport.responseText.evalJSON();
		recv.listStock=lists[0];
		recv.listFlitting=lists[1];//由于调拨功能并未实现，后面不再处理调拨待收货列表
		var tplStock=new Template('<tr id="recv_r_s#{ID}"><td>#{sName}</td><td>#{pID}</td><td>#{pName}</td><td>#{price}</td><td>#{quantity}</td><td><input type="button" value="收货" onclick="recv(\'recv_stock\',#{ID})" /></td></tr>');
		$('recv_r').update('<table border="1"><caption>进货待收</caption><tr><th>供应商名称</th><th>商品编号</th><th>商品名称</th><th>进价</th><th>数量</th><th>操作</th></tr>'+tplStock.evalAll(recv.listStock)+'</table>');
		break;
	case 'recv_stock':
		//现在transport是进货条目编号
		new Ajax.Request('recv.php?a=recv_stock',{parameters:{ID:transport},onComplete:recv.bind(transport,'recv_stock_cb')});
		break;
	case 'recv_stock_cb':
		//现在this是进货条目编号
		if (transport.responseText!='OK') return alert('服务器返回错误信息：\n'+transport.responseText);
		alert('收货处理成功');
		Effect.DropOut('recv_r_s'+this)
		break;
	}
}