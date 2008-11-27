do
	local p_ScoreBoard = Proto("ScoreBoard","yoursunny.P2008.IS409 ScoreBoard")
	local f_identifier = ProtoField.bytes("ScoreBoard.identifier","Identifier")
	local f_operator = ProtoField.uint8("ScoreBoard.operator","Operator",base.HEX,{ [0] = "get-value", [1] = "set-value", [128] = "resp-value", [16] = "get-color", [17] = "set-color", [144] = "resp-color"})
	local f_left = ProtoField.uint32("ScoreBoard.left","Value Left",base.DEC)
	local f_right = ProtoField.uint32("ScoreBoard.right","Value Right",base.DEC)
	local f_red = ProtoField.uint8("ScoreBoard.red","Color Red",base.DEC)
	local f_green = ProtoField.uint8("ScoreBoard.green","Color Green",base.DEC)
	local f_blue = ProtoField.uint8("ScoreBoard.blue","Color Blue",base.DEC)
	p_ScoreBoard.fields = { f_identifier, f_operator, f_left, f_right, f_red, f_green, f_blue }
	
	local data_dis = Dissector.get("data")
	
	local function ScoreBoard_dissector(buf,pkt,root)
		local buf_len = buf:len();
		if buf_len < 17 then return false end
		local v_identifier = buf(0,16)
		if ((buf(0,1):uint()~=226) or (buf(1,1):uint()~=203) or (buf(2,1):uint()~=181) or (buf(3,1):uint()~=128)
			or (buf(4,1):uint()~=203) or (buf(5,1):uint()~=9) or (buf(6,1):uint()~=78) or (buf(7,1):uint()~=186)
			or (buf(8,1):uint()~=163) or (buf(9,1):uint()~=107) or (buf(10,1):uint()~=246) or (buf(11,1):uint()~=7)
			or (buf(12,1):uint()~=206) or (buf(13,1):uint()~=149) or (buf(14,1):uint()~=63) or (buf(15,1):uint()~=43))
			then return false end
		local v_operator = buf(16,1)
		local i_operator = v_operator:uint()
		
		local t = root:add(p_ScoreBoard,buf)
		pkt.cols.protocol = "ScoreBoard"
		t:add(f_identifier,v_identifier)
		t:add(f_operator,v_operator)
		
		if ((i_operator == 1) or (i_operator == 128)) and (buf_len >= 25) then
			t:add(f_left,buf(17,4))
			t:add(f_right,buf(21,4))
		elseif ((i_operator == 17) or (i_operator == 144)) and (buf_len >= 20) then
			t:add(f_red,buf(17,1))
			t:add(f_green,buf(18,1))
			t:add(f_blue,buf(19,1))
		end
		return true
	end
	
	function p_ScoreBoard.dissector(buf,pkt,root) 
		if ScoreBoard_dissector(buf,pkt,root) then
			--valid ScoreBoard diagram
		else
			data_dis:call(buf,pkt,root)
		end
	end
	
	local udp_encap_table = DissectorTable.get("udp.port")
	udp_encap_table:add(1127,p_ScoreBoard)
end
