//========================================================================================
// Progarm: The file be included by modules
// Arranged by: Andy Hsu
// Date: 	2000/06/23: first version
//		2000/07/24: modified
//		2000/10/20: modified for version 52A chip sacmv25.lib
//		2001/10/07: modified for sacmv25f.lib
// 		2001/11/06: Independent Queue for A2000/S480/MS01 Manual Mode
//		2001/11/06: Fix volume parameter problem - sacmv25i.lib
//
// For: sacmV25n.lib
//
//========================================================================================

//////////////////////////////////////////////////////////////////
// Definitions for I/O Port
//////////////////////////////////////////////////////////////////
.DEFINE	P_IOA_Data   		0x7000         // Write Data into data register and read from IOA pad
.DEFINE P_IOA_Buffer        0x7001         // Write Data into buffer register and read from buffer register
.DEFINE P_IOA_Dir           0x7002         // Direction vector for IOA
.DEFINE P_IOA_Attrib        0x7003         // Attribute vector for IOA
.DEFINE P_IOA_Latch         0x7004         // Latch PortA data for key change wake-up

.DEFINE P_IOB_Data         	0x7005         // Write Data into the data register and read from IOB pad
.DEFINE P_IOB_Buffer        0x7006         // Write Data into buffer register and read from buffer register
.DEFINE P_IOB_Dir           0x7007         // Direction vector for IOB
.DEFINE P_IOB_Attrib        0x7008         // Attribute vector for IOB

.DEFINE P_FeedBack          0x7009         // Clock form external R,C
.DEFINE P_TimerA_Data       0x700A         // Data port for TimerA 
.DEFINE P_TimerA_Ctrl       0x700B         // Control Port for TimerA
.DEFINE P_TimerB_Data       0x700C         // Data port for TimerB
.DEFINE P_TimerB_Ctrl       0x700D         // Control Port for TimerB
.DEFINE P_TimeBase_Setup    0x700E         // TimerBase Freq. Set
.DEFINE P_TimeBase_Clear	0x700F 		   // Reset Timerbase counter
.DEFINE P_INT_Ctrl          0x7010         // Control port for interrupt source
.DEFINE P_INT_Clear         0x7011         // Clear interrupt source
.DEFINE P_Watchdog_Clear    0x7012         // Watchdog Reset
.DEFINE P_SystemClock       0x7013         // Change system clock frequency(include go to standby mode)

//... PA6442 New version MC52A (For EC-03)....
.DEFINE P_ADC 	        	0x7014         	// Data Port for AD
.DEFINE P_ADC_Ctrl          0x7015         	// Control Port for AD control
.DEFINE P_ADC_Status        0x7015         	// AD Port Status
.DEFINE P_DAC2              0x7016         	// Data Port for DAC2
.DEFINE P_PWM               0x7016         	// Data Port for PWM
.DEFINE P_DAC1	        	0x7017         	// Data Port for DAC1
.DEFINE P_DAC_Ctrl			0x702A 			// Control Port for two DAC and audio output mode
//............................................

.DEFINE P_IR_Ctrl			0x7018 			// Control Port for IR
.DEFINE P_LVD_Ctrl          0x7019         	// Control Port for LVD
.DEFINE P_SIO_Data			0x701A 			// Data port for serial IO
.DEFINE P_SIO_Addr_Low		0x701B 			// Address Port low
.DEFINE P_SIO_Addr_Mid		0x701C 			// Address Port middle
.DEFINE P_SIO_Addr_High	 	0x701D 			// Address Port high
.DEFINE P_SIO_Ctrl			0x701E 			// Control Port
.DEFINE P_SIO_Start			0x701F 			// Start port for serial interface
.DEFINE P_SIO_Stop			0x7020 			// Stop port for serial interface

.DEFINE P_UART_Command1		 0x7021 		// Command1 Port for UART
.DEFINE P_UART_Command2		 0x7022 		// Command2 Port for UART
.DEFINE P_UART_Data			 0x7023  		// Data Port for UART
.DEFINE	P_UART_BaudScalarLow 0x7024 		// Set Baud Rate scalar low
.DEFINE	P_UART_BaudScalarHigh 0x7025 		// Set Baud Rate scalar high


//... Definitions for P_INT_Ctrl ..............
.DEFINE C_IRQ6_TMB2             0x0001         	// Timer B IRQ6
.DEFINE C_IRQ6_TMB1             0x0002         	// Timer A IRQ6
.DEFINE C_IRQ5_2Hz              0x0004         	// 2Hz IRQ5
.DEFINE C_IRQ5_4Hz              0x0008         	// 4Hz IRQ5
.DEFINE C_IRQ4_1KHz             0x0010         	// 1024Hz IRQ4
.DEFINE C_IRQ4_2KHz             0x0020         	// 2048Hz IRQ4
.DEFINE C_IRQ4_4KHz             0x0040         	// 4096Hz IRQ4
.DEFINE C_IRQ3_KEY              0x0080         	// Key Change IRQ3
.DEFINE C_IRQ3_EXT1             0x0100         	// Ext1 IRQ3
.DEFINE C_IRQ3_EXT2             0x0200         	// Ext2 IRQ3
.DEFINE C_IRQ2_TMB              0x0400         	// Timer B IRQ2
.DEFINE C_FIQ_TMB               0x0800         	// Timer B FIQ
.DEFINE C_IRQ1_TMA              0x1000         	// Timer A IRQ1
.DEFINE C_FIQ_TMA               0x2000         	// Timer A FIQ
.DEFINE C_IRQ0_PWM              0x4000         	// PWM IRQ0
.DEFINE C_FIQ_PWM               0x8000         	// PWM FIQ

// Definitions for P_TimerA/B_Ctrl ............                               
.DEFINE	C_Fosc_2				0x0000 			// 
.DEFINE	C_Fosc_256		    	0x0001 			//
.DEFINE	C_32768Hz				0x0002 			//
.DEFINE	C_8192Hz				0x0003 			//
.DEFINE	C_4096Hz				0x0004 			//
.DEFINE	C_A1					0x0005 			//
.DEFINE C_A0					0x0006 			//
.DEFINE C_Ext1					0x0007 			//

.DEFINE	C_2048Hz				0x0000 			//
.DEFINE	C_1024Hz				0x0008 			//
.DEFINE	C_256Hz					0x0010 			//
.DEFINE	C_TMB1Hz				0x0018 			//
.DEFINE	C_4Hz					0x0020 			//
.DEFINE	C_2Hz					0x0028 			//
.DEFINE	C_B1					0x0030 			//
.DEFINE	C_Ext2					0x0038 			//

.DEFINE	C_Off					0x0000 			//
.DEFINE C_D1					0x0040 			//
.DEFINE C_D2					0x0080 			//
.DEFINE C_D3					0x00C0 			//
.DEFINE C_D4					0x0100 			//
.DEFINE C_D5					0x0140 			//
.DEFINE C_D6					0x0180 			//
.DEFINE C_D7					0x01C0 			//
.DEFINE C_D8					0x0200 			//
.DEFINE C_D9					0x0240 			//
.DEFINE C_D10					0x0280 			//
.DEFINE C_D11					0x02C0 			//
.DEFINE C_D12					0x0300 			//
.DEFINE C_D13					0x0340 			//
.DEFINE C_D14					0x0380 			//
.DEFINE C_TA_Div_2				0x03C0 			// Timer A
.DEFINE C_TB_Div_2				0x03C0 			// Timer B

//... Definition for P_SystemClock ............
.DEFINE C_Fosc					0x0000 			// b3..b0
.DEFINE C_Fosc_Div_2			0x0001 			//
.DEFINE C_Fosc_Div_4			0x0002 			//
.DEFINE C_Fosc_Div_8			0x0003 			// (default)
.DEFINE C_Fosc_Div_16			0x0004 			//
.DEFINE C_Fosc_Div_32			0x0005 			//
.DEFINE C_Fosc_Div_64			0x0006 			//
.DEFINE C_Sleep					0x0007 		 	//

.DEFINE	C_32K_Work				0x0000 			// b4
.DEFINE C_32K_Off				0x0000 			// 
.DEFINE C_StrongMode			0x0000 			// b5
.DEFINE C_AutoMode				0x0000 			//

//... Define for P_AD_Ctrl ....................
.DEFINE	C_AD					0x0001 			//
.DEFINE C_DA					0x0000 			//
.DEFINE C_MIC					0x0000 			//
.DEFINE C_LINE					0x0002 			//

//... Define for P_DA_Ctrl ....................
.DEFINE C_PushPull				0x0000 			// b0, (default) 
.DEFINE C_DoubleEnd				0x0001 			// b0
.DEFINE	C_DAC_Mode				0x0000 			// b1, (default)
.DEFINE C_PWM_Mode				0x0002 			// b1

.DEFINE	C_D1_Direct				0x0000 			// DAC1 latch
.DEFINE C_D1_LatchA				0x0008 			// 
.DEFINE C_D1_LatchB				0x0010 			//
.DEFINE C_D1_LatchAB			0x0018 			//

.DEFINE	C_D2_Direct				0x0000 			// DAC2 latch
.DEFINE C_D2_LatchA				0x0020 			// 
.DEFINE C_D2_LatchB				0x0040 			//
.DEFINE C_D2_LatchAB			0x00C0 			//

//... Define for P_LVD_Ctrl ...................
.DEFINE C_LVD24V				0x0000 			// LVD = 2.4V 
.DEFINE C_LVD28V				0x0001 			// LVD = 2.8V
.DEFINE C_LVD32V				0x0002 			// LVD = 3.2V
.DEFINE C_LVD36V				0x0003 			// LVD = 3.6V

//////////////////////////////////////////////////
// Note: This register will map to the P_INT_Ctrl
//	(0x7010), The SACMvxx.lib use this register to
//	combine with user's interrupt setting
//////////////////////////////////////////////////
.EXTERNAL	R_InterruptStatus 
//////////////////////////////////////////////////


.EXTERNAL 	F_SP_RampUpDAC1
.EXTERNAL 	F_SP_RampDnDAC1
.EXTERNAL 	F_SP_RampUpDAC2
.EXTERNAL 	F_SP_RampDnDAC2

.EXTERNAL 	F_SP_InitQueue
.EXTERNAL 	F_SP_InitQueue_A2000
.EXTERNAL 	F_SP_InitQueue_S480
.EXTERNAL 	F_SP_InitQueue_S240
.EXTERNAL 	F_SP_InitQueue_MS01
.EXTERNAL 	F_SP_InitQueue_DVR

.EXTERNAL 	F_SP_ReadQueue
.EXTERNAL 	F_SP_ReadQueue_A2000
.EXTERNAL 	F_SP_ReadQueue_S480
.EXTERNAL 	F_SP_ReadQueue_S240
.EXTERNAL 	F_SP_ReadQueue_MS01
.EXTERNAL 	F_SP_ReadQueue_DVR

.EXTERNAL 	F_SP_WriteQueue
.EXTERNAL 	F_SP_WriteQueue_A2000
.EXTERNAL 	F_SP_WriteQueue_S480
.EXTERNAL 	F_SP_WriteQueue_S240
.EXTERNAL 	F_SP_WriteQueue_MS01
.EXTERNAL 	F_SP_WriteQueue_DVR

.EXTERNAL 	F_SP_TestQueue
.EXTERNAL 	F_SP_TestQueue_A2000
.EXTERNAL 	F_SP_TestQueue_S480
.EXTERNAL 	F_SP_TestQueue_S240
.EXTERNAL 	F_SP_TestQueue_MS01
.EXTERNAL 	F_SP_TestQueue_DVR

.EXTERNAL	F_SP_ReadQueue_NIC		// Read queue with no index change
.EXTERNAL	F_SP_ReadQueue_NIC_A2000
.EXTERNAL	F_SP_ReadQueue_NIC_S480
.EXTERNAL	F_SP_ReadQueue_NIC_S240
.EXTERNAL	F_SP_ReadQueue_NIC_MS01
.EXTERNAL	F_SP_ReadQueue_NIC_DVR


.EXTERNAL	F_SP_SACM_A2000_Init_
.EXTERNAL	F_SP_SACM_S480_Init_
.EXTERNAL	F_SP_SACM_S240_Init_

.EXTERNAL	F_SP_SACM_MS01_Init_
.EXTERNAL	F_SP_PlayMode0_
.EXTERNAL	F_SP_PlayMode1_
.EXTERNAL	F_SP_PlayMode2_
.EXTERNAL	F_SP_PlayMode3_

.EXTERNAL	F_SP_SACM_DVR_Init_
.EXTERNAL 	F_SP_SACM_DVR_Rec_Init_
.EXTERNAL 	F_SP_SACM_DVR_Play_Init_

.EXTERNAL	F_SP_GetResource

//////////////////////////////////////////////////////////////////
// Reserve old defintion
// Note: Some user who use old library may use the old name
//////////////////////////////////////////////////////////////////
.EXTERNAL	F_SP_Send_PWM					// Get RAW data 
.EXTERNAL	F_SP_Send_DAC1 					// 
.EXTERNAL	F_SP_Send_DAC2 					//

.EXTERNAL	F_STD_Send_DAC1 				// reserved old
.EXTERNAL	F_STD_Send_DAC2 				// reserved old

.EXTERNAL 	F_RampUpDAC1					// reserved old
.EXTERNAL 	F_RampDnDAC1					// reserved old
.EXTERNAL 	F_RampUpDAC2					// reserved old
.EXTERNAL  	F_RampDnDAC2					// reserved old
///////////////////////////////////////////////////////////////////


	
//========================================================================================        
// End of hardware.inc
//========================================================================================
