-- Copyright (C) 1988-2002 Altera Corporation
-- Any megafunction design, and related net list (encrypted or decrypted),
-- support information, device programming or simulation file, and any other
-- associated documentation or information provided by Altera or a partner
-- under Altera's Megafunction Partnership Program may be used only to
-- program PLD devices (but not masked PLD devices) from Altera.  Any other
-- use of such megafunction design, net list, support information, device
-- programming or simulation file, or any other related documentation or
-- information is prohibited for any other purpose, including, but not
-- limited to modification, reverse engineering, de-compiling, or use with
-- any other silicon devices, unless such use is explicitly licensed under
-- a separate agreement with Altera or a megafunction partner.  Title to
-- the intellectual property, including patents, copyrights, trademarks,
-- trade secrets, or maskworks, embodied in any such megafunction design,
-- net list, support information, device programming or simulation file, or
-- any other related documentation or information provided by Altera or a
-- megafunction partner, remains with Altera, the megafunction partner, or
-- their respective licensors.  No other licenses, including any licenses
-- needed under any third party's intellectual property, are provided herein.

-- MAX+plus II Include File
-- Version 10.2 06/28/2002
-- Created: Sun Apr 08 09:57:21 2007

FUNCTION 7seg8digit (d7[3..0], d6[3..0], d5[3..0], d4[3..0], d3[3..0], d2[3..0], d1[3..0], d0[3..0], clk)
    RETURNS (a, b, c, d, e, f, g, t1, t2, t3, t4, t5, t6, t7, t8);
