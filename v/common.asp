<%
classcount = 8
function classname(classid)
	classname = ""
	select case classid
		case 1
			classname = "课本U6"
		case 2
			classname = "课本U7"
		case 3
			classname = "课本U8"
		case 4
			classname = "VOA Special 1-5"
		case 5
			classname = "VOA Special 6-10"
		case 6
			classname = "VOA Standard 1-5"
		case 7
			classname = "VOA Standard 6-10"
		case 8
			classname = "其他"
	end select
end function

sub showphonetic(str)
	strlen=len(str)
	for i=1 to strlen
		ch=mid(str,i,1)
		if ch="1" then ch="<IMG src=1.gif>"
		if ch="2" then ch="<IMG src=2.gif>"
		if ch="3" then ch="<IMG src=3.gif>"
		if ch="4" then ch="<IMG src=4.gif>"
		if ch="5" then ch="<IMG src=5.gif>"
		if ch="6" then ch="<IMG src=6.gif>"
		if ch="7" then ch="<IMG src=7.gif>"
		if ch="8" then ch="<IMG src=8.gif>"
		if ch="9" then ch="<IMG src=9.gif>"
		if ch="0" then ch="<IMG src=0.gif>"
		if ch="=" then ch="<IMG src=a.gif>"
		if ch="$" then ch="<IMG src=b.gif>"
		if ch=";" then ch="<IMG src=c.gif>"
		response.write ch
	next
end sub

%>