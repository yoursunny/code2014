#ifndef	__dvr_H__
#define	__dvr_H__
//	write your header here
//////////////////////////////////////////////////////////////////////////////////////////
// Progarm: SACM-DVR API external definition for sacmV26e.lib
// Writen by: Andy
// 	Date: 2000/06/20
//////////////////////////////////////////////////////////////////////////////////////////
extern 	int SACM_DVR_Initial(int);
extern 	void SACM_DVR_ServiceLoop(void);
extern 	void SACM_DVR_Record(int);
extern  void SACM_DVR_Play(void);
extern  void SACM_DVR_Stop(void);
extern  unsigned int SACM_DVR_Status(void);

extern  void SACM_DVR_InitEncoder(int, int);		// For Manual Mode
extern  void SACM_DVR_InitDecoder(int);				// For Manual Mode
extern  void SACM_DVR_Encoder(void);				// For Manual Mode
extern  void SACM_DVR_Decoder(void);				// For Manual Mode

extern  void SACM_DVR_InitQueue(void);				// For Manual Mode
extern  int SACM_DVR_FetchQueue(void);				// For Manual Mode
extern  void SACM_DVR_FillQueue(int);				// For Manual Mode
extern  unsigned int SACM_DVR_TestQueue(void);		// For Manual Mode

//========================================================================================        
// End of dvr.h
//=======================================================================================
#endif