#ifndef	__SACM480_H__
#define	__SACM480_H__
//	write your header here
//////////////////////////////////////////////////////////////////////////////////////////
// Progarm: SACM-S480 C API external definition for sacmV26e.lib
// Writen by: Andy
// 	Date: 2000/06/20
// 	Date: 2001/10/11 	Add Manual mode definition
//////////////////////////////////////////////////////////////////////////////////////////

extern int SACM_S480_Initial(int);					// 
extern void SACM_S480_ServiceLoop(void);			// For Auto Mode only
extern void SACM_S480_Play(int,int,int);			// For Auto Mode only
extern void SACM_S480_Stop(void);					// 
extern void SACM_S480_Pause(void);					// 
extern void SACM_S480_Resume(void);					// 
extern void SACM_S480_Volume(int);					// 
extern unsigned int SACM_S480_Status(void);			// 

extern void SACM_S480_InitDecoder(int);			// For Manual Mode only
extern void SACM_S480_Decoder(void);					// For Manual Mode only
extern void SACM_S480_InitQueue(void);				// For Manual Mode only
extern void SACM_S480_FillQueue(int);				// For Manual Mode only
extern unsigned int SACM_S480_TestQueue(void);		// For Manual Mode only

//========================================================================================        
// End of S480.h
//========================================================================================

#endif
