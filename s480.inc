//////////////////////////////////////////////////////////////////////////////////////////
// Progarm: SACM-S480 API external definition for sacmV26e.lib
// Writen by: Andy
// Date: 	2000/06/20
//		 	2001/02/10
//			2001/10/11: Add manual mode definition
//////////////////////////////////////////////////////////////////////////////////////////

.EXTERNAL F_SACM_S480_Initial
.EXTERNAL F_SACM_S480_ServiceLoop				// For Auto Mode only
.EXTERNAL F_SACM_S480_Play						// For Auto Mode only
.EXTERNAL F_SACM_S480_Stop
.EXTERNAL F_SACM_S480_Stop_EX					// Keep Int. enable
.EXTERNAL F_SACM_S480_Pause
.EXTERNAL F_SACM_S480_Resume
.EXTERNAL F_SACM_S480_Volume
.EXTERNAL F_SACM_S480_Status

.EXTERNAL F_SACM_S480_InitDecoder				// For Manual Mode only
.EXTERNAL F_SACM_S480_Decoder					// For Manual Mode only
.EXTERNAL F_SACM_S480_InitQueue					// For Manual Mode only
.EXTERNAL F_SACM_S480_FillQueue					// For Manual Mode only
.EXTERNAL F_SACM_S480_TestQueue					// For Manual Mode only

.EXTERNAL F_FIQ_Service_SACM_S480				// Interrupt service Routine(Play)

//========================================================================================        
// End of S480.inc
//========================================================================================
