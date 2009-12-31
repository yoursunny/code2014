<?php
header('Content-Type: text/plain');

class Fetion {
	function __construct($user) {
		if (strlen($user)!=11 || !ctype_digit($user)) return $this->onError('$user is not 11-digit');
		$this->user=$user;
		$this->enable_cache=TRUE;
	}
	public function login($password) {
		$this->getSystemConfig();
		$this->password=$password;
		$this->SignIn();
		$this->register();
	}
	public function sendSMS($to,$message) {
		if ($to==NULL) {
			$to=$this->sip_uri;
		} else {
			if (strlen($to)==11) {
				$to='tel:'.$to;
			} else {
				$this->onError('SendSMS $to is not a mobile number');
			}
		}
		$resp=$this->sipRequest('M',$message,array('T'=>$to,'N'=>'SendCatSMS'));
	}
	protected $user;
	protected $password;
	protected function onError($msg) {
		die('[fetion] '.$msg);
	}
	protected function httpRequest($url,$body=NULL,$headers=array()) {
		if (substr($url,0,6)=='https:') $url='http:'.substr($url,6);
		$method='POST'; $h=array();
		if ($body===NULL) $method='GET';
		else $h[]='Content-Length: '.strlen($body);
		foreach ($headers as $k=>$v) $h[]=$k.': '.$v;
		$context=array(
			'http'=>array(
				'method'=>$method,
				'header'=>implode("\r\n",$h),
				'content'=>$body
			)
		);
		$resp=new Fetion_Response;
		$sock=@fopen($url,'r',false,stream_context_create($context));
		if (!$sock) {
			$resp->success=FALSE;
			return $resp;
		}
		$h=array();
		foreach ($http_response_header as $hl) {
			$ha=explode(':',$hl,2);
			if (count($ha)==2) $h[$ha[0]]=trim($ha[1]);
		}
		$result='';
		while (!feof($sock)) $result.=fgets($sock, 4096);
		fclose($sock);
		$resp->success=TRUE;
		$resp->headers=$h;
		$resp->body=$result;
		return $resp;
	}
	protected $sip_seq=0;
	protected $sip_domain;
	protected $sip_exheaders=NULL;
	protected function sipSend($content) {
		$url=$this->http_tunnel.'?t='.($this->sip_seq?'s':'i').'&i='.(++$this->sip_seq);
		if (!$this->sip_exheaders) {
			$guid_s=sha1(uniqid());
			$guid=substr($guid_s,0,8).'-'.substr($guid_s,8,4).'-'.substr($guid_s,12,4).'-'.substr($guid_s,16,4).'-'.substr($guid_s,20,10);
			$this->sip_exheaders=array('Cookie'=>'ssic='.$this->ssic,'Content-Type'=>'application/oct-stream','Pragma'=>'xz4BBcV'.$guid,'User-Agent'=>'IIC2.0/PC 3.2.0540');
		}
		return $this->httpRequest($url,$content,$this->sip_exheaders);
	}
	protected function sipRequest($method,$body='',$headers=array()) {
		$req_line=$method.' '.$this->sip_domain.' SIP-C/2.0';
		$h=array('F: '.$this->sip_sid,'I: 1','Q: 1 '.$method);
		foreach ($headers as $k=>$v) $h[]=$k.': '.$v;
		$h[]='L: '.strlen($body);
		$content=$req_line."\r\n".implode("\r\n",$h)."\r\n\r\n".$body."SIPP";
		$r=$this->sipSend($content);
		$resp=new Fetion_Response;
		$resp->success=FALSE;
		if (!$r->success || $r->body!='SIPP') return $resp;
		$r=$this->sipSend('SIPP');
		if (!$r->success) return $resp;
		$l=explode("\r\n",$r->body);
		$lc=count($l);
		if ($lc<4) return $resp;
		$la=explode(' ',$l[0]);
		if (count($la)<3) return $resp;
		$resp->status=intval($la[1]);
		$resp->headers=array(); $body=array(); $i=1;
		for (;$i<$lc;++$i) {
			if ($l[$i]=='') break;
			$ha=explode(':',$l[$i],2);
			if (count($ha)==2) $resp->headers[$ha[0]]=trim($ha[1]);
		}
		for (++$i,--$lc;$i<$lc;++$i) {
			$body[]=$l[$i];
		}
		$resp->body=implode("\r\n",$body);
		$resp->success=TRUE;
		return $resp;
	}
	protected $enable_cache;
	protected function readCachedFile($cache_file,$maxage,$request_func) {
		if (!$this->enable_cache) return $this->$request_func();
		// if $cache_file is fresh, return its contents; otherwise request using $request_func and cache it
		if (file_exists($cache_file) && filemtime($cache_file)+$maxage>=time()) return file_get_contents($cache_file);
		else {
			$t=$this->$request_func();
			file_put_contents($cache_file,$t);
			return $t;
		}
	}
	protected $signin_url;
	protected $http_tunnel;
	protected function getSystemConfig() {
		$t=$this->readCachedFile('fetion.systemconfig.'.$this->user.'.xml',86400,'requestSystemConfig');
		$x=simplexml_load_string($t);
		$this->signin_url=strval($x->servers->{'ssi-app-sign-in'});
		$this->http_tunnel=strval($x->servers->{'http-tunnel'});
	}
	private function requestSystemConfig() {
		$r=$this->httpRequest('http://nav.fetion.com.cn/nav/getsystemconfig.aspx','<config><user mobile-no="'.$this->user.'" /><client type="PC" version="3.2.0540" platform="W5.1" /><servers version="0" /><service-no version="0" /><parameters version="0" /><hints version="0" /><http-applications version="0" /><client-config version="0" /></config>');
		if (!$r->success) return $this->onError('SystemConfig request failed');
		return $r->body;
	}
	protected $ssic;
	protected $sip_sid;
	protected $sip_uri;
	protected function SignIn() {
		$r=$this->httpRequest($this->signin_url.'?mobileno='.$this->user.'&pwd='.$this->password);
		if (!$r->success) return $this->onError('signin request failed');
		$x=simplexml_load_string($r->body);
		if ($x['status-code']!=200) return $this->onError('signin failed');
		$m=array(); preg_match('/ssic=(.*);/',$r->headers['Set-Cookie'],$m);
		$this->ssic=$m[1];
		$this->sip_uri=$x->user['uri'];
		$m=array(); preg_match('/sip:(.*)@/',$this->sip_uri,$m);
		$this->sip_sid=$m[1];
		$this->sip_domain='fetion.com.cn';
	}
	protected function register() {
		//step 1
		$login_xml='<args><device type="PC" version="0" client-version="3.2.0540" /><caps value="simple-im;im-session;temp-group;personal-group" /><events value="contact;permission;system-message;personal-group" /><user-info attributes="all" /><presence><basic value="0" desc="" /></presence></args>';
		$resp=$this->sipRequest('R',$login_xml);
		$m=array(); preg_match('/nonce="(.*)"/',$resp->headers['W'],$m);
		$nonce=$m[1];
		//step 2
		$cnonce=strtoupper(md5(mt_rand()));
		$hash_passwd=sha1("wzm\x03".sha1($this->password,TRUE),TRUE);
		$key=sha1($this->sip_sid.':'.$this->sip_domain.':'.$hash_passwd,TRUE);
		$h1=strtoupper(md5($key.':'.$nonce.':'.$cnonce));
		$h2=strtoupper(md5('REGISTER:'.$this->sip_sid));
		$response=strtoupper(md5($h1.':'.$nonce.':'.$h2));
		$salt='777A6D03';
		$resp=$this->sipRequest('R',$login_xml,array('A'=>'Digest algorithm="SHA1-sess",response="'.$response.'",cnonce="'.$cnonce.'",salt="'.$salt.'"'));
	}
}
class Fetion_Response {
	public $success;
	public $status;
	public $headers;
	public $body;
}
?>