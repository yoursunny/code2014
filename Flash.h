#ifndef	__FLASH_h__
#define	__FLASH_h__
//	write your header here
void Flash_WriteWord(unsigned int FlashAddr, unsigned int Data);
void Flash_Write(unsigned int FlashAddr, unsigned int *DataBuf, unsigned int Count);
void Flash_Erase(unsigned int FlashAddr);
unsigned int Flash_ReadWord(unsigned int FlashAddr);
unsigned int *Flash_Read(unsigned int FlashAddr, unsigned int *DataBuf, unsigned int Count);
#endif
