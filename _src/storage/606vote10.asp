<%@LANGUAGE="VBSCRIPT" CODEPAGE="65001"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<title>无标题文档</title>
<script>
function d(){
if (Math.random()>0.3) document.form1.rg1[Math.floor(Math.random()*(4-0))].checked = true;
if (Math.random()>0.3) document.form1.rg2[Math.floor(Math.random()*7)].checked = true;
if (Math.random()>0.3) document.form1.rg3[Math.floor(Math.random()*2)].checked = true;
if (Math.random()>0.3) document.form1.rg4[Math.floor(Math.random()*2)].checked = true;
if (Math.random()>0.3) document.form1.rg5[Math.floor(Math.random()*2)].checked = true;
if (Math.random()>0.3) document.form1.rg6[Math.floor(Math.random()*4)].checked = true;
if (Math.random()>0.3) document.form1.rg7[Math.floor(Math.random()*4)].checked = true;
if (Math.random()>0.3) document.form1.rg8[Math.floor(Math.random()*(7-0))].checked = true;
if (Math.random()>0.3) document.form1.rg9[Math.floor(Math.random()*(3-0))].checked = true;
if (Math.random()>0.3) document.form1.rg10[Math.floor(Math.random()*(3-0))].checked = true;
document.form1.submit.click();
}
</script>
</head>

<body onload="d()">
<form name="form1" id="form1" method="post" action="http://www.sjtu.info/v10/vote.asp?ck=1">
<input type="radio" name="rg1" value="1">
<input type="radio" name="rg1" value="2">
<input name="rg1" type="radio" value="3" unchecked>
<input type="radio" name="rg1" value="4">
<input type="radio" name="rg2" value="5">
<input type="radio" name="rg2" value="6">
<input type="radio" name="rg2" value="7">
<input type="radio" name="rg2" value="8">
<input type="radio" name="rg2" value="9">
<input type="radio" name="rg2" value="10">
<input type="radio" name="rg2" value="11">
<input type="radio" name="rg3" value="12">
<input type="radio" name="rg3" value="13">
<input type="radio" name="rg4" value="14">
<input type="radio" name="rg4" value="15">
<input type="radio" name="rg5" value="16">
<input type="radio" name="rg5" value="17">
<input type="radio" name="rg6" value="18">
<input type="radio" name="rg6" value="19">
<input type="radio" name="rg6" value="20">
<input type="radio" name="rg6" value="21">
<input type="radio" name="rg7" value="22">
<input type="radio" name="rg7" value="23">
<input type="radio" name="rg7" value="24">
<input type="radio" name="rg7" value="25">
<input type="radio" name="rg8" value="26">
<input type="radio" name="rg8" value="27">
<input type="radio" name="rg8" value="28">
<input name="rg8" type="radio" value="29" unchecked>
<input type="radio" name="rg8" value="30">
<input type="radio" name="rg8" value="31">
<input type="radio" name="rg8" value="32">
<input name="rg9" type="radio" value="33" unchecked>
<input type="radio" name="rg9" value="34">
<input type="radio" name="rg9" value="35">
<input type="radio" name="rg10" value="36">
<input type="radio" name="rg10" value="37">
<input name="rg10" type="radio" value="38" unchecked>
<input name="submit" type="submit"  value="提交" >
</form>
</body>
</html>