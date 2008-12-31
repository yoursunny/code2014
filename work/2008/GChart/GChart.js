//GChart库，使用Google Chart API创建和显示图表
//你的阳光技术频道制作，yoursunny.com、www.65536.cn
//需要使用Prototype.js，在1.6.0.1版本下开发

//namespace GChart
var GChart={
	version:'2008-02-26',
	APIbase:'http://chart.apis.google.com/chart?',//base URL of Google Chart API
	APIurl:function(parameters) { return GChart.APIbase+parameters.toQueryString(); },//convert a Hash to URL
	MISSING:'_',//represents a missing value in data
	ALL:-1,//means drawing a marker on each data point
	//internal
	encodingChars:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.'//chars for simple and extended encoding
};

//----------------common formats----------------
//color RRGGBB
//size in pixels

//abstract class Chart
GChart.Chart=Class.create({
	initialize:function() { throw('GChart.Chart is abstract, create one of the subclasses instead'); },
	cht:'',//chart type parameter
	width:0,height:0,//size of chart
	min:0,max:100,//min and max values of data
	title:{t:'',color:'',size:''},
	url:function() {//get URL of the chart
		var o=$H(this.params());
		o.each(function(it){
			if (Object.isUndefined(it.value)) return o.unset(it.key);
			if (it.value==null) return o.unset(it.key);
			it.value=''+it.value;
			if (it.value.blank()) return o.unset(it.key);
		});
		return GChart.APIurl(o);
	},
	params:function() { },//get params of the chart, abstract
	//----------------data----------------
	addDataSet:function(dataArray,color,legend) {
		if (this.data==null) {
			this.data=new Array();
			this.style=new Array();
			this.marker=new Array();
		}
		this.data.push(dataArray);
		if (color!=false) this.style.push({color:color,legend:legend});//subclasses can set color==false so skip style push
	},
	clearData:function() {
		this.data=null;
		this.style=null;
		this.marker=null;
	},
	//----------------color----------------
	fill:{bg:null,c:null},//chart area and background fill
	SolidFill:function(w,color) {//w is bg or c
		this.fill[w]=w+',s,'+color;
	},
	LinearGradientFill:function(w,angle,color1,color2) {//w is bg or c
		this.fill[w]=w+',lg,'+angle+','+color1+',0,'+color2+',1';
	},
	//in Google Chart API, LinearGradientFill supports offset, and there's Linear Stripes, but not supported here
	//================internal================
	params1:function() {//get chs,cht,chd,chtt,chts,chf,chdl,chco parameters
		var o={
			chs:''+this.width+'x'+this.height,
			cht:this.cht,
			chd:this.encodeData()
		};
		Object.extend(o,this.get_title());
		o.chf=this.get_chf();
		o.chdl=this.style.pluck('legend').join('|');
		if (o.chdl.replace('|','').blank()) o.chdl='';
		o.chco=this.style.pluck('color').join(',');
		return o;
	},
	get_title:function() {//get chtt,chts parameters
		if (this.title.t.blank()) return {};
		var o={chtt:this.title.t};
		if (!this.title.color.blank()||!(''+this.title.size).blank()) o.chts=(this.title.color||'000000')+','+(this.title.size||12);
		return o;
	},
	//----------------data----------------
	data:null,style:null,marker:null,
	encodeData:function(encoding) {
		if (this.data==null) return '';
		if (encoding==null) {//try to determine encoding
			encoding='e';
			if (this.width+this.height<600) encoding='s';//small chart, enough
			if (this.data.pluck('length').max()*this.data.length>1000) encoding='s';//too many data
		}
		return this.encodeDataSets(this.data,encoding);
	},
	getDataValue:function(value,encoding,min,max) {
		if (value==GChart.MISSING) return value;
		var v=value/(max-min);
		if (v<0 || v>1) return GChart.MISSING;//overflow
		switch (encoding) {
			case 's': return (v*61).round();
			case 't': return (v*1000).round();
			case 'e': return (v*4095).round();
		}
	},
	encodeDataV:function(v,encoding) {
		if (v==GChart.MISSING) {
			switch (encoding) {
				case 's': return '_';
				case 't': return '-1';
				case 'e': return '__';
			}
		} else {
			switch (encoding) {
				case 's': return GChart.encodingChars[v];
				case 't': return ''+(v/10);
				case 'e': return GChart.encodingChars[(v/64).floor()]+GChart.encodingChars[v%64];
			}
		}
	},
	encodeDataValue:function(value,encoding) {
		return this.encodeDataV(this.getDataValue(value,encoding,this.min,this.max),encoding);
	},
	encodeDataSet:function(DataSetArray,encoding) {
		return DataSetArray.collect(function(value){return this.encodeDataValue(value,encoding);}.bind(this)).join(encoding=='t'?',':'');
	},
	encodeDataSets:function(DataSets,encoding) {
		return encoding+':'+DataSets.collect(function(DataSet){return this.encodeDataSet(DataSet,encoding);}.bind(this)).join(encoding=='t'?'|':',');
	},
	//----------------color----------------
	get_chf:function() {//chart area and background fill parameter
		return Object.values(this.fill).compact().join('|');
	},
	//----------------noop----------------
	noop:null
});

//class LineChart 折线图
GChart.LineChart=Class.create(GChart.Chart,{
	initialize:function() { this.cht='lc'; },
	params:function() {
		var o=this.params1();
		return o;
	}
});

//class XYChart XY折线图
GChart.XYChart=Class.create(GChart.LineChart,{
	initialize:function() { this.cht='lxy'; },
	addDataSet:function($super,X,Y,lineColor,legend,markers) {
		//markers:[{type,color,point,size}]
		//type is one of a,c,d,o,s,v,V,h,x
		//point is the index of point in the dataset, 0 for the first, fraction allowed
		//size is the size of the marker
		//or markers:{type,color,size} --a marker at each data point
		$super(X,false);
		$super(Y,false);
		this.style.push({color:lineColor||'ff9900',legend:legend||''});
		if (markers) {
			[markers].flatten().each(function(m) {
				var M=Object.extend({type:'x',color:'000000',point:GChart.ALL,size:'5'},m);
				M.dataset=this.data.length/2-1;
				if (M.point==GChart.ALL)
					$R(0,X.length-1).each(function(j) {
						var mm=Object.clone(M);
						mm.point=j;
						this.marker.push(mm);
					}.bind(this));
				else this.marker.push(M);
			}.bind(this));
		}
	},
	newDataSet:function(lineColor,legend) {//create a DataSet without adding points
		this.addDataSet([],[],lineColor,legend);
	},
	addPoint:function(X,Y,marker) {//add a point to the last DataSet
		if (this.data==null||this.data.length<1) this.newDataSet();
		this.data[this.data.length-2].push(X);
		this.data[this.data.length-1].push(Y);
		if (marker) this.marker.push(Object.extend({type:'x',color:'000000',size:'5',dataset:this.data.length/2-1,point:this.data[this.data.length-2].length-1},marker));
	},
	params:function() {
		var o=this.params1();
		o.chm=this.marker.collect(function(m){
			return m.type+','+m.color+','+m.dataset+','+((m.point*100).round()/100)+','+m.size;
		}).join('|');
		return o;
	}
});

//class ScatterPlot XY散点图
GChart.ScatterPlot=Class.create(GChart.XYChart,{//ScatterPlot is very simliar to XYChart
	initialize:function() { this.cht='s'; }
});