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
-- Created: Sun Apr 08 10:05:30 2007

FUNCTION dot (1red1[7..0], 1red2[7..0], 1red3[7..0], 1red4[7..0], 1red5[7..0], 1red6[7..0], 1red7[7..0], 1red8[7..0], 2red1[7..0], 2red2[7..0], 2red3[7..0], 2red4[7..0], 2red5[7..0], 2red6[7..0], 2red7[7..0], 2red8[7..0], 1green1[7..0], 1green2[7..0], 1green3[7..0], 1green4[7..0], 1green5[7..0], 1green6[7..0], 1green7[7..0], 1green8[7..0], 2green1[7..0], 2green2[7..0], 2green3[7..0], 2green4[7..0], 2green5[7..0], 2green6[7..0], 2green7[7..0], 2green8[7..0], clk)
    RETURNS (row1, row2, row3, row4, row5, row6, row7, row8, 1r1, 1r2, 1r3, 1r4, 1r5, 1r6, 1r7, 1r8, 1g1, 1g2, 1g3, 1g4, 1g5, 1g6, 1g7, 1g8, 2r1, 2r2, 2r3, 2r4, 2r5, 2r6, 2r7, 2r8, 2g1, 2g2, 2g3, 2g4, 2g5, 2g6, 2g7, 2g8);
