<?php
# https://yoursunny.com/p/qqwry/

class QQWRY_record {
	private $querier;
	private $pos;
	public function __construct($querier,$pos) {
		$this->querier=$querier;
		$this->pos=$pos;
		$this->loaded=FALSE;
	}

	private $loaded;	
	private $val_c;
	private $val_a;
	private function read() {
		if ($this->loaded) return;
		list($this->val_c,$this->val_a)=$this->querier->read_record($this->pos);
		$this->loaded=TRUE;
	}

	public function get_c() {//gets country string
		$this->read();
		return $this->val_c;
	}
	public function get_a() {//gets area string
		$this->read();
		return $this->val_a;
	}
}

function QQWRY_cmp_ip($a,$b) {
	if ($a==$b) return 0;
	if ($a<0 && $b>=0) return 1;
	if ($b<0 && $a>=0) return -1;
	return $a-$b;
}

class QQWRY {
	private $file;
	private $index_offset;
	private $index_count;
	public function __construct($filename='qqwry.dat') {
		$this->file=fopen($filename,'rb');
		fseek($this->file,0);
		$header_bytes=fread($this->file,8);
		$header_a=unpack('V1off/V1end',$header_bytes);
		$this->index_offset=$header_a['off'];
		$this->index_count=($header_a['end']-$this->index_offset)/7+1;
	}
	public function __destruct() {
		fclose($this->file);
	}

	public function query($ip_arr) {//query locations for multiple IP addresses(long), returns associative array of QQWRY_record indexed by IP address(long)
		$results=array();
		array_unique($ip_arr,SORT_NUMERIC);
		usort($ip_arr,'QQWRY_cmp_ip');
		$this->find_recursive($ip_arr,$results,0,count($ip_arr)-1,0,$this->index_count-1);
		return $results;
	}
	private function find_recursive($ip_arr,&$results,$ip_l,$ip_r,$id_l,$id_r) {
		if ($ip_l>$ip_r) return;
		$id_mid=ceil(($id_l+$id_r)/2);
		list($ip,$pos)=$this->read_index($id_mid);
		if ($id_l==$id_r) {
			$record=new QQWRY_record($this,$pos);
			for ($i=$ip_l;$i<=$ip_r;++$i) {
				$results[$ip_arr[$i]]=$record;
			}
			return;
		}
		$ip_mid=$ip_r+1;
		for ($i=$ip_l;$i<=$ip_r;++$i) {
			if (QQWRY_cmp_ip($ip_arr[$i],$ip)>=0) {
				$ip_mid=$i;
				break;
			}
		}
		$this->find_recursive($ip_arr,$results,$ip_l,$ip_mid-1,$id_l,$id_mid-1);
		$this->find_recursive($ip_arr,$results,$ip_mid,$ip_r,$id_mid,$id_r);
	}
	private function read_index($id) {
		fseek($this->file,$this->index_offset+7*$id);
		$index_bytes=fread($this->file,7);
		$a=unpack('V1ip/V1pos',$index_bytes."\0");
		return array($a['ip'],$a['pos']);
	}

	public function read_record($pos) {
		$p=$pos+4;
		$val_c=$this->read_string($p);
		$val_a=$this->read_string($p);
		return array(iconv('gbk','utf-8',$val_c),iconv('gbk','utf-8',$val_a));
	}
	private function read_string(&$pos) {
		if ($pos==0) return '';
		fseek($this->file,$pos);
		$bytes=fread($this->file,64);
		$mode=ord($bytes[0]);
		if ($mode==0x01) {
			$a=unpack('V1',substr($bytes,1,3)."\0");
			$pos=$a[1];
			return $this->read_string($pos);
		} elseif ($mode==0x02) {
			$a=unpack('V1',substr($bytes,1,3)."\0");
			$subpos=$a[1];
			$pos+=4;
			return $this->read_string($subpos);
		} else {
			list($s,$len)=$this->extract_string($bytes);
			$pos+=$len;
			return $s;
		}
	}
	private function extract_string($bytes) {
		$blen=strlen($bytes);
		for ($i=0;$i<$blen;++$i) {
			if ($bytes[$i]=="\0") break;
		}
		$len=$i;
		$s=substr($bytes,0,$len);
		return array($s,$len);
	}
}

?>