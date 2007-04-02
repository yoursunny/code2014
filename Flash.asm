//======================================================
//  The information contained herein is the exclusive property of
//  Sunnnorth Technology Co. And shall not be distributed, reproduced,
//  or disclosed in whole in part without prior written permission.
//             (C) COPYRIGHT 2003  SUNNORTH TECHNOLOGY CO.
//                          ALL RIGHTS RESERVED
//  The entire notice above must be reproduced on all authorized copies.
//========================================================

//======================================================
// 文件名称：	flash.asm
// 功能描述：	擦除、读、写子程序 
// 维护记录：	2006-08-30	v1.0
//======================================================

.PUBLIC F_Flash_Erase
.PUBLIC _Flash_Erase
.PUBLIC F_Flash_WriteWord
.PUBLIC _Flash_WriteWord
.PUBLIC F_Flash_Write
.PUBLIC _Flash_Write
.PUBLIC F_Flash_ReadWord
.PUBLIC _Flash_ReadWord
.PUBLIC F_Flash_Read
.PUBLIC _Flash_Read

.DEFINE C_FLASH_SIZE			0x8000
.DEFINE C_FLASH_BLOCK_SIZE		0x100 
.DEFINE C_FLASH_MATCH			0xAAAA
.DEFINE C_FLASH_PAGE_ERASE		0x5511		//erase 1 page
.DEFINE C_FLASH_MASS_ERASE		0x5522		//only can execution on STOP=1
.DEFINE C_FLASH_1WORD_PGM		0x5533		//write 1 word 
.DEFINE C_FLASH_SEQUENT_PGM		0x5544		//write sequential word 
.DEFINE P_Flash_Ctrl  			0x7555

.CODE
//======================================================
// 汇编格式：	F_Flash_WriteWord
// C格式：		void Flash_WriteWord(unsigned int FlashAddr, unsigned int Data);
// 实现功能：	写一个字到FLASH的指定地址中
// 入口参数：	FlashAddr(r1) - 待写入Flash的地址
//				Data(r2) - 待写入数据
// 出口参数：	无
// 破坏寄存器：	无
//======================================================
_Flash_WriteWord:
	push r1, r2 to [sp]
	r1 = sp + 5						// 获得参数1
	r1 = [r1]
	r2 = sp + 6						// 获得参数2
	r2 = [r2]
	call F_Flash_WriteWord
	pop r1, r2 from [sp]
retf

F_Flash_WriteWord:
	push r3 to [sp]

	r3 = C_FLASH_MATCH				// 0xAAAA
	[P_Flash_Ctrl] = r3
	r3 = C_FLASH_1WORD_PGM			// 0x5533
	[P_Flash_Ctrl] = r3	
	[r1] = r2

	pop r3 from [sp]
	retf

//======================================================
// 汇编格式：	F_Flash_Write
// C格式：		void Flash_Write(unsigned int FlashAddr, unsigned int *DataBuf, unsigned int Count);
// 实现功能：	写多个字到FLASH的中
// 入口参数：	FlashAddr(r1) - 待写入Flash的地址
//				DataBuf(r2) - 待写入数据的起始地址
//				Count(r3) - 待写入数据的字数
// 出口参数：	无
// 破坏寄存器：	无
//======================================================
_Flash_Write:
	push r1, r3 to [sp]
	r1 = sp + 6						// 获得参数1
	r1 = [r1]
	r2 = sp + 7						// 获得参数2
	r2 = [r2]
	r3 = sp + 8						// 获得参数3
	r3 = [r3]
	call F_Flash_Write
	pop r1, r3 from [sp]
retf	

F_Flash_Write:
	push r3, r4 to [sp]
	r4 = C_FLASH_MATCH				// 0x5511
	[P_Flash_Ctrl] = r4
?Loop:	
	r4 = C_FLASH_SEQUENT_PGM		// 0x5544
	[P_Flash_Ctrl] = r4
	r4 = [r2++]
	[r1++] = r4
	r3 -= 1
	jnz ?Loop
	pop r3, r4 from [sp]
retf



//======================================================
// 汇编格式：	F_Flash_Erase
// C格式：		void Flash_Erase(unsigned int FlashAddr);
// 实现功能：	擦除指定地址所在的页
// 入口参数：	FlashAddr(r1) - 待擦除页所在的Flash地址
// 出口参数：	无
// 破坏寄存器：	无
//======================================================
_Flash_Erase:
	push r1 to [sp]
	r1 = sp + 4
	r1 = [r1]
	call F_Flash_Erase
	pop r1 from [sp]
retf

F_Flash_Erase:
	push r2 to [sp]
	r2 = C_FLASH_MATCH				//AAAA
	[P_Flash_Ctrl] = r2
	r2 = C_FLASH_PAGE_ERASE			//5511
	[P_Flash_Ctrl] = r2
	
	[r1] = r1
	pop r2 from [sp]
retf

//======================================================
// 汇编格式：	F_Flash_ReadWord
// C格式：		unsigned int Flash_ReadWord(unsigned int FlashAddr);
// 实现功能：	读取Flash指定地址中的数据
// 入口参数：	FlashAddr(r1) - Flash地址
// 出口参数：	该地址中的数据
// 破坏寄存器：	无
//======================================================
_Flash_ReadWord:
	r1 = sp + 3
	r1 = [r1]
	call F_Flash_ReadWord
retf

F_Flash_ReadWord:
	r1 = [r1]
	retf

//======================================================
// 汇编格式：	F_Flash_Read
// C格式：		unsigned int *Flash_Read(unsigned int FlashAddr, unsigned int *DataBuf, unsigned int Count);
// 实现功能：	读取Flash指定起始地址的多个数据
// 入口参数：	FlashAddr(r1) - 待读取Flash的起始地址
//				DataBuf(r2) - 用于存储读到数据的Ram起始地址
//				Count(r3) - 待读取数据的字数
// 出口参数：	用于存储读到数据的Ram起始地址
// 破坏寄存器：	无
//======================================================
_Flash_Read:
	push r1, r3 to [sp]
	r1 = sp + 6						// 获得参数1
	r1 = [r1]
	r2 = sp + 7						// 获得参数2
	r2 = [r2]
	r3 = sp + 8						// 获得参数3
	r3 = [r3]
	call F_Flash_Read
	pop r1, r3 from [sp]
retf

F_Flash_Read:
	push r3, r4 to [sp]
?Loop:
	r4 = [r1++]	
	[r2++] = r4
	r3 -= 1
	jnz ?Loop
	pop r3, r4 from [sp]
retf