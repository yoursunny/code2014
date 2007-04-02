//////////////////////////////////////////////////////////////////////////////////////////
// Progarm: SACM-DVR API external definition form sacmV26e.lib
// Writen by: Andy
// 	Date: 2000/06/20
// 	Date: 2001/10/11 	Add Manual mode definition
//////////////////////////////////////////////////////////////////////////////////////////

.EXTERNAL F_SACM_DVR_Initial
.EXTERNAL F_SACM_DVR_ServiceLoop
.EXTERNAL F_SACM_DVR_Record
.EXTERNAL F_SACM_DVR_Play
.EXTERNAL F_SACM_DVR_Stop
.EXTERNAL F_SACM_DVR_Status

.EXTERNAL F_SACM_DVR_InitEncoder						// For Manual Mode
.EXTERNAL F_SACM_DVR_InitDecoder						// For Manual Mode
.EXTERNAL F_SACM_DVR_Encoder							// For Manual Mode
.EXTERNAL F_SACM_DVR_Decoder							// For Manual Mode

.EXTERNAL F_SACM_DVR_InitQueue							// For Manual Mode
.EXTERNAL F_SACM_DVR_FetchQueue							// For Manual Mode
.EXTERNAL F_SACM_DVR_FillQueue							// For Manual Mode
.EXTERNAL F_SACM_DVR_TestQueue							// For Manual Mode

.EXTERNAL F_FIQ_Service_SACM_DVR						// Interrupt service Routine(Rec/Play)


//========================================================================================        
// End of dvr.inc
//========================================================================================