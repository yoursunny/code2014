function talk_init(container,page,width,height) {
	window.talk={
		ConversationUIs:{},
		VisibleZindex:10,
		ConversationUI:function(id,title){
			var t=this;
			var d=document.createElement('div');
			d.className='talk-conversation-container';
			d.style.position='absolute';
			d.style.left='0px';
			d.style.top='0px';
			var h=document.createElement('div');
			h.className='talk-conversation-header';
			h.innerHTML=title;
			d.appendChild(h);
			var close=document.createElement('div');
			close.className='talk-conversation-closebutton';
			close.innerHTML='X';
			close.onclick=function(){t.onCloseClick();}
			d.appendChild(close);
			var f=document.createElement('iframe');
			f.id=d.name='70E56C70-29DF-43a2-AAAD-F4B30AB1BC61_'+id;
			f.className='talk-conversation-frame';
			f.src=page+'?conversation-'+id;
			f.frameBorder=0;
			f.scrolling='no';
			d.appendChild(f);
			document.body.appendChild(d);
			var moving=false,movepos=null;
			var mouse_pos=function(ev) {
				if(ev.pageX || ev.pageY){
					return {x:ev.pageX, y:ev.pageY};
				}
				return {
					x:ev.clientX+document.body.scrollLeft-document.body.clientLeft+document.documentElement.scrollLeft-document.documentElement.clientLeft,
					y:ev.clientY+document.body.scrollTop-document.body.clientTop+document.documentElement.scrollTop-document.documentElement.clientTop
				};
			};
			function drag(ev) {
				if (!ev) ev=window.event;
				d.style.zIndex=++talk.VisibleZindex;
				moving=true;
				movepos=mouse_pos(ev);
			};
			h.onmousedown=drag;
			function drop() {
				moving=false;
				movepos=null;
			};
			h.onmouseup=h.onmouseout=drop;
			function move(ev) {
				if (!moving) return;
				if (!ev) ev=window.event;
				var mouse=mouse_pos(ev);
				var x=d.style.left.substr(0,d.style.left.length-2);
				var y=d.style.top.substr(0,d.style.top.length-2);
				x=Number(x)+mouse.x-movepos.x;
				y=Number(y)+mouse.y-movepos.y;
				d.style.left=''+x+'px';
				d.style.top=''+y+'px';
				movepos=mouse;
			};
			h.onmousemove=move;
			talk.ConversationUIs[id]={d:d,h:h,f:f};
			this.id=id;
			this.onCloseClick=function(){};
		}
	};
	talk.ConversationUI.prototype={
		frame_name:function() {
			return '70E56C70-29DF-43a2-AAAD-F4B30AB1BC61_'+this.id;
		},
		frame:function() {
			return talk.ConversationUIs[this.id].f;
		},
		title:function(h) {
			talk.ConversationUIs[this.id].innerHTML=h;
			return this;
		},
		hide:function() {
			talk.ConversationUIs[this.id].d.style.display='none';
			return this;
		},
		show:function() {
			talk.ConversationUIs[this.id].d.style.display='none';
			return this;
		},
		destroy:function(){
			var ui=talk.ConversationUIs[this.id];
			if (!ui) return;
			document.body.removeChild(ui.d);
			delete talk.ConversationUIs[this.id];
		}
	};

	var d=document.createElement('iframe');
	d.id=d.name='CB5DA278-8404-4adf-BC17-187B45F306E2';
	d.src=page+'?main';
	d.width=width;
	d.height=height;
	d.frameBorder=0;
	d.scrolling='no';
	document.getElementById(container).appendChild(d);
}