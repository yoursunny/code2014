
GPA.storage={
	init:function(){
		if (window.localStorage && localStorage.getItem) {
			GPA.storage.supportLS=true;
		} else {
			$.cookie('testCookie','7f89d7c4-eab4-493a-8daf-536cfd00e96c');
			GPA.storage.serverCookie=($.cookie('testCookie')!='7f89d7c4-eab4-493a-8daf-536cfd00e96c');
		}
	},
	supportLS:false,//whether localStorage is supported
	serverCookie:null,//whether cookie must be set by server (P3P)
	get:function(key){
		var s;
		if (GPA.storage.supportLS) {
			s=localStorage.getItem('sunnyGPA_'+key);
		} else {
			s=$.cookie(key);
		}
		if (s) {
			try{ return $.parseJSON(s); }
			catch(ex){}
		}
		return null;
	},
	setJSON:function(key,value,allowCookie){
		if (GPA.storage.supportLS) {
			localStorage.setItem('sunnyGPA_'+key,value);
			return true;
		} else if (allowCookie) {
			if (GPA.storage.serverCookie) {
				$('#hiddenframe').attr('src',GPA.server_base+'setcookie.php?'+$.param({name:key,value:value}));
			} else {
				$.cookie(key,value,{expires:999});
			}
			return true;
		}
		return false;
	},
	set:function(key,value,allowCookie){
		var s;
		try{ s=$.toJSON(value); }
		catch(ex){ return false; }
		return GPA.storage.setJSON(key,s,allowCookie);
	}
};
