//相册播放器
var AlbumPlayer=Class.create();
AlbumPlayer.version='yoursunny AlbumPlayer class, 2007-12-02';//版本信息
AlbumPlayer.effects=['appear','fade','slideup','slidedown','blindup','blinddown','dropout','puff','shrink','squish'];//可用的转场效果
AlbumPlayer.prototype={
	container:'',//容器名称
	div:null,//容器对象
	width:0,//宽度
	height:0,//高度
	background:'',//背景颜色或图像
	photos:null,//照片
	current:-1,//当前照片
	positionNode:null,//定位节点
	initialize:function(container,width,height,background) {//创建div内的相册播放器
		this.container=container;
		this.div=$(container).setStyle({width:''+width+'px',height:''+height+'px'});
		this.width=width;
		this.height=height;
		this.background=background;
		this.photos=[];
		this.tick=this.tick_.bind(this);
	},
	add:function(src,width,height,time,effect) {//添加图片
		if (width>this.width)
		{
			height*=this.width/width;
			width=this.width;
		}
		if (height>this.height)
		{
			width*=this.height/height;
			height=this.height;
		}
		var node_c=$(Builder.node('img',{id:this.container+'_c'+this.photos.length,width:width,height:height,src:src})).setStyle({width:''+width+'px',height:''+height+'px'});
		var node_b=$(Builder.node('div',{id:this.container+'_b'+this.photos.length},[node_c]));
		var node_a=$(Builder.node('div',{id:this.container+'_a'+this.photos.length},[node_b]));
		this.div.appendChild(node_a);
		if (this.photos.length==0)
		{
			this.positionNode=node_a;
		}
		else
		{
			Position.clone(this.positionNode,node_a,{setWidth:false,setHeight:false});
		}
		node_a.setStyle({display:'none',width:''+this.width+'px',height:''+this.height+'px',background:this.background});
		this.photos.push({src:src,width:width,height:height,time:time,effect:effect,n:node_a});
	},
	start:function() {//开始播放
		this.current=this.photos.length-1;
		if (this.current<0) return;
		this.tick();
	},
	tick:null,
	tick_:function() {//切换图片
		var pr=this.photos[this.current];
		++this.current;
		if (this.current>=this.photos.length) this.current=0;
		var p=this.photos[this.current];
		switch (pr.effect)
		{
			case 'appear':
			case 'slidedown':
			case 'blinddown':
				Position.absolutize(p.n.setStyle({zIndex:102,display:''}));
				Position.absolutize(pr.n.setStyle({zIndex:101,display:''}));
				break;
			default:
				Position.absolutize(p.n.setStyle({zIndex:100,display:''}));
				Position.absolutize(pr.n.setStyle({zIndex:101,display:''}));
				break;
		}
		switch (pr.effect)
		{
			case 'appear':
				Effect.Appear($(p.n).hide(),{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'fade':
				Effect.Fade(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'slideup'://
				Effect.SlideUp(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'slidedown'://
				Effect.SlideDown(p.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'blindup'://
				Effect.BlindUp(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'blinddown'://
				Effect.BlindDown(p.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'dropout':
				Effect.DropOut(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'puff':
				Effect.Puff(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'shrink'://
				Effect.Shrink(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			case 'squish'://
				Effect.Squish(pr.n,{afterFinish:this.hideEle.bind(pr.n)});
				break;
			default:
				this.hideEle.bind(pr.n)();
		}
		setTimeout(this.tick,this.photos[this.current].time);
	},
	hideEle:function()
	{
		this.setStyle({display:'none'});
	}
};
