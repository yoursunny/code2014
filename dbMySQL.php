<?php
class dbMySQL {//数据源访问类
//参数查询说明
//数组$p "a"->"ppp"
//SELECT * FROM j WHERE m=?a 解析为 SELECT * FROM j WHERE m='ppp'ִ
//参数名称第一位是小写字母，作为字符型参数，编码并加单引号
//参数名称第一位是数字，作为数字型参数，如果不是数字就出错
//参数名称第一位是其他情况，直接带入SQL表达式
	private $conn;//连接
	private $sql=NULL;//上一条SQL语句
	private $result=NULL;//结果
	private $rows=0;//行数
	private $rows_got=0;//已提取行数
	function __construct($host,$username,$password,$dbname) {//连接
		$this->conn=@mysql_pconnect($host,$username,$password) or die('不能连接到MySQL数据源服务');
		mysql_query("SET NAMES 'utf8'",$this->conn);
		@mysql_select_db($dbname,$this->conn) or die('MySQL数据源中数据库不存在');
	}
	private function close() {//如果上一个结果存在，清除它
		if ($this->result!=NULL) mysql_free_result($this->result);
	}
	public function execute_sql($SQL) {//执行
		//echo $SQL;
		$this->close();
		$this->sql=$SQL;
		mysql_query($SQL,$this->conn);
		$err=mysql_error($this->conn); if ($err!='') die($err);
		$this->result=NULL;
		$this->rows=mysql_affected_rows($this->conn);
		$this->rows_got=0;
	}
	public function execute($SQL,$p=NULL) {//带参数执行ִ
		if ($p==NULL) { $this->execute_sql($SQL); return; }
		$s=$SQL;
		foreach ($p as $i => $v) {
			if (ctype_digit($i{0}) && !is_numeric($v)) die('SQL数值型参数错误 '.$i.'=>'.$v);
			$vv=ctype_lower($i{0})?"'".mysql_escape_string($v)."'":$v;
			$s=str_replace('?'.$i,$vv,$s);
		}
		$this->execute_sql($s);
	}
	public function query_sql($SQL) {//查询
		//echo $SQL;
		$this->close();
		$this->sql=$SQL;
		$this->result=mysql_query($SQL,$this->conn);
		$err=mysql_error($this->conn); if ($err!='') die($err);
		$this->rows=mysql_num_rows($this->result);
		$this->rows_got=0;
	}
	public function query($SQL,$p=NULL) {//带参数查询
		if ($p==NULL) { $this->query_sql($SQL); return; }
		$s=$SQL;
		foreach ($p as $i => $v) {
			if (ctype_digit($i{0}) && !is_numeric($v)) die('SQL数值型参数错误 '.$i.'=>'.$v);
			$vv=ctype_lower($i{0})?"'".mysql_escape_string($v)."'":$v;
			$s=str_replace('?'.$i,$vv,$s);
		}
		$this->query_sql($s);
	}
	public function read() {//提取一行为关联数组，如果已提取完则返回NULL
		if ($this->result==NULL) return NULL;
		if ($this->rows_got==$this->rows) return NULL;
		++$this->rows_got;
		return mysql_fetch_assoc($this->result);
	}
	public function num_rows() {//总行数
		return $this->rows;
	}
	public function eof() {//是否提取完了？
		return ($this->rows_got==$this->rows);
	}
}
?>