//========================================================================================
// Progarm: Standard function definition
// Writen by: Andy
// Modifiyed: by Arthur Shieh
//
// Lastest modified date: 
// 		2000/06/23: first version
//		2000/07/15: modified
//		2000/07/24: modified					for sacmv25.lib
//		2001/10/03: Add more public about queue for sacmv25f.lib
// 		2001/11/05: Independent Queue for A2000/S480/MS01 Manual Mode - sacmv25h.lib
//		2001/11/06: Fix volume parameter problem - sacmv25i.lib
//      2002/05/26: Modified the length of C_QueueSize to 144 for DVR usage
//
// For: sacmV25n.lib
//
// Note: 
//  1. Don't change this file if possible.
//  2. Update hardware.inc with hardware.asm synchorously
//	3. Provide Open code for sacmVxx.lib
//
//========================================================================================

.PUBLIC	F_SP_RampUpDAC1
.PUBLIC	F_SP_RampDnDAC1
.PUBLIC	F_SP_RampUpDAC2
.PUBLIC	F_SP_RampDnDAC2
.PUBLIC	_SP_RampUpDAC1 
.PUBLIC	_SP_RampDnDAC1 
.PUBLIC	_SP_RampUpDAC2 
.PUBLIC	_SP_RampDnDAC2 

.PUBLIC	_SP_InitQueue
.PUBLIC	_SP_InitQueue_A2000
.PUBLIC	_SP_InitQueue_S480
.PUBLIC	_SP_InitQueue_S240
.PUBLIC	_SP_InitQueue_MS01
.PUBLIC	_SP_InitQueue_DVR

.PUBLIC	F_SP_InitQueue
.PUBLIC	F_SP_InitQueue_A2000
.PUBLIC	F_SP_InitQueue_S480
.PUBLIC	F_SP_InitQueue_S240
.PUBLIC	F_SP_InitQueue_MS01
.PUBLIC	F_SP_InitQueue_DVR

.PUBLIC	F_SP_ReadQueue
.PUBLIC F_SP_ReadQueue_A2000
.PUBLIC F_SP_ReadQueue_S480
.PUBLIC F_SP_ReadQueue_S240
.PUBLIC F_SP_ReadQueue_MS01
.PUBLIC F_SP_ReadQueue_DVR

.PUBLIC	F_SP_ReadQueue_NIC			// Read Queue with no index change
.PUBLIC	F_SP_ReadQueue_NIC_A2000
.PUBLIC	F_SP_ReadQueue_NIC_S480
.PUBLIC	F_SP_ReadQueue_NIC_S240
.PUBLIC	F_SP_ReadQueue_NIC_MS01
.PUBLIC	F_SP_ReadQueue_NIC_DVR

.PUBLIC	F_SP_WriteQueue
.PUBLIC F_SP_WriteQueue_A2000
.PUBLIC F_SP_WriteQueue_S480
.PUBLIC F_SP_WriteQueue_S240
.PUBLIC F_SP_WriteQueue_MS01
.PUBLIC F_SP_WriteQueue_DVR

.PUBLIC F_SP_TestQueue
.PUBLIC F_SP_TestQueue_A2000
.PUBLIC F_SP_TestQueue_S480
.PUBLIC F_SP_TestQueue_S240
.PUBLIC F_SP_TestQueue_MS01
.PUBLIC F_SP_TestQueue_DVR

.PUBLIC _SP_Export  
.PUBLIC	_SP_Import 
.PUBLIC _SP_Init_IOB 
.PUBLIC _SP_Init_IOA 

.PUBLIC	_SP_GetResource	
.PUBLIC F_SP_GetResource

.PUBLIC F_SP_SACM_A2000_Init_
.PUBLIC F_SP_SACM_S480_Init_
.PUBLIC F_SP_SACM_S240_Init_

.PUBLIC F_SP_SACM_MS01_Init_
.PUBLIC F_SP_PlayMode0_
.PUBLIC F_SP_PlayMode1_    
.PUBLIC F_SP_PlayMode2_  
.PUBLIC F_SP_PlayMode3_   

.PUBLIC F_SP_SACM_DVR_Init_
.PUBLIC F_SP_SACM_DVR_Rec_Init_
.PUBLIC F_SP_SACM_DVR_Play_Init_


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



/////////////////////////////////////////////////////////////////
// Note: This register map to the P_INT_Ctrl(0x7010)
// 	User's interrupt setting have to combine with this register 
//	while co-work with SACM library.
//
//  See. following function for example:
//	F_SP_SACM_A2000_Init_:
//	F_SP_SACM_S480_Init_:
//	F_SP_SACM_S240_Init_:
//	F_SP_SACM_MS01_Init_:
//	F_SP_SACM_DVR_Init_: 
//////////////////////////////////////////////////
.IRAM
.PUBLIC	R_InterruptStatus 
.VAR	R_InterruptStatus = 0 					// 

//////////////////////////////////////////////////

.DEFINE C_RampDelayTime 32
.DEFINE C_QueueSize 144
		
.VAR 	R_Queue 
.DW		C_QueueSize-1	DUP(0) 
.VAR	R_ReadIndex 
.VAR	R_WriteIndex 

.CODE

				

///////////////////////////////////////////
// Function: Initial Queue
// Destory: R1,r2
///////////////////////////////////////////	
_SP_InitQueue:	.PROC
_SP_InitQueue_A2000:
_SP_InitQueue_S480:
_SP_InitQueue_S240:
_SP_InitQueue_MS01:
_SP_InitQueue_DVR:

F_SP_InitQueue_A2000:
F_SP_InitQueue_S480:
F_SP_InitQueue_S240:
F_SP_InitQueue_MS01:
F_SP_InitQueue_DVR:
F_SP_InitQueue:
		r1 = R_Queue
		r2 = 0 
L_ClearQueueLoop?:		
		[r1++] = r2
		cmp	r1, R_Queue+C_QueueSize
		jne	L_ClearQueueLoop?
			
		r1 = 0
		[R_ReadIndex] = r1
		[R_WriteIndex] = r1
				
		RETF
		.ENDP
		
///////////////////////////////////////////
// Function: Get a data form Queue
// Output:  R1: Data
//			R2: return value
// Destory: R1,R2
///////////////////////////////////////////	
F_SP_ReadQueue_A2000:
F_SP_ReadQueue_S480:
F_SP_ReadQueue_S240:
F_SP_ReadQueue_MS01:
F_SP_ReadQueue_DVR:
F_SP_ReadQueue:
		r2 = [R_ReadIndex]
		cmp r2,[R_WriteIndex]
		je	L_RQ_QueueEmpty

		r2 += R_Queue				// get queue data address
		r1 = [r2]
		
		r2 = [R_ReadIndex]
		r2 += 1
		cmp	r2, C_QueueSize
		jne	L_RQ_NotQueueBottom
		r2 = 0
L_RQ_NotQueueBottom:	
		[R_ReadIndex] = r2		
		//r2 = 0x0000 						// get queue data
		retf 
L_RQ_QueueEmpty:
		//r2 = 0x8000 						// queue empty
		retf 

///////////////////////////////////////////
// Function: Get a data from Queue but do 
//			not change queue index
// R1: output
// Destory: R1,R2
///////////////////////////////////////////
F_SP_ReadQueue_NIC:
F_SP_ReadQueue_NIC_A2000:
F_SP_ReadQueue_NIC_S480:
F_SP_ReadQueue_NIC_S240:
F_SP_ReadQueue_NIC_MS01:
F_SP_ReadQueue_NIC_DVR:
		r2 = [R_ReadIndex]
		cmp r2,[R_WriteIndex]
		je	L_RQ_QueueEmpty?

		r2 += R_Queue				// get queue data index
		r1 = [r2]
L_RQ_QueueEmpty?:
		RETF
		
///////////////////////////////////////////
// Function: Put a data to Queue
// R1: Input
// Destory: R1,R2
///////////////////////////////////////////	
F_SP_WriteQueue_A2000:
F_SP_WriteQueue_S480:
F_SP_WriteQueue_S240:
F_SP_WriteQueue_MS01:
F_SP_WriteQueue_DVR:
F_SP_WriteQueue:
		r2 = [R_WriteIndex] 			// put data to queue
		r2 += R_Queue
		[r2] = r1

		r2 = [R_WriteIndex]
		r2 += 1
		cmp	r2, C_QueueSize
		jne	L_WQ_NotQueueBottom
		r2 = 0
L_WQ_NotQueueBottom:
		[R_WriteIndex] = r2
		RETF

		
///////////////////////////////////////////
// Function: Test Queue Status
// o/p: R1
// Destory: R1
///////////////////////////////////////////	
F_SP_TestQueue_A2000:
F_SP_TestQueue_S480:
F_SP_TestQueue_S240:
F_SP_TestQueue_MS01:
F_SP_TestQueue_DVR:
F_SP_TestQueue:
		//... Test Queue Empty ...
		r1 = [R_ReadIndex] 
		cmp r1,[R_WriteIndex] 
		je	L_TQ_QueueEmpty 

		//... Test Queue Full ...
		r1 = [R_ReadIndex] 				// For N Queue Full: 1.R=0 and W=N-1 2. R<>0 and W=R-1 
		jnz	L_TQ_JudgeCond2 
		r1 = [R_WriteIndex] 
		cmp	r1, C_QueueSize-1 			// Cond1
		je	L_TQ_QueueFull 			
L_TQ_JudgeCond2:		
		r1 = [R_ReadIndex] 
		r1 -=1 
		cmp r1,[R_WriteIndex] 
		je	L_TQ_QueueFull 	

		r1 = 0 							// not Full, not empty
		retf 
L_TQ_QueueFull:
		r1 = 1 							// full
		retf 
L_TQ_QueueEmpty:
		r1 = 2 							// empty
		retf 





///////////////////////////////////////////////////////////////////////////////
// Function: The partial code of hardware setting of SACM_A2000_Initial() 
//			or F_SACM_A2000_Initial:
// Note: The following functions are the partial code of original
//			initial subroutine. (H/W setting part) 
//
//	Ex: F_SACM_A2000_Initial:
//			...
//			call F_SP_SACM_A2000_Init_	: S480/S240/MS01 is same
//			...
//			retf
////////////////////////////////////////////////////////////////////////////////
F_SP_SACM_A2000_Init_:	
		r1=0x0000;                      // 24MHz, Fcpu=Fosc
        [P_SystemClock]=r1           	//  Frequency 20MHz
        r1 = 0x0030                     // TimerA CKA=Fosc/2 CKB=1 Tout:off
        [P_TimerA_Ctrl] = r1			// Initial Timer A
        r1 = 0xfd00                  	// 16K
        [P_TimerA_Data] = r1 
        r1 = 0x00A8                     // Set the DAC Ctrl
        [P_DAC_Ctrl] = r1
        r1 = 0xffff
        
        [P_INT_Clear] = r1          	// Clear interrupt occuiped events
        r1 =0x0000						// 
        
        
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA					// Enable Timer A FIQ
        //R1 |= C_IRQ4_1KHz
        [R_InterruptStatus] = r1		//
        [P_INT_Ctrl] = r1				//

		RETF


//////////////////////////////////////////////////////////////////
// Function: The partial code of hardware setting of SACM_S480_Initial() 
//			or F_SACM_S480_Initial:
//////////////////////////////////////////////////////////////////
F_SP_SACM_S480_Init_:
        r1 = 0x0000						// 24MHz Fosc
        [P_SystemClock]=r1          	// Initial System Clock
        r1=0x0030                       // TimerA CKA=Fosc/2 CKB=1 Tout:off
        [P_TimerA_Ctrl]=r1				// Initial Timer A
        //R1 = 0xfd00                  	// 16K
        r1 = 0xfced						// 15.625K
        [P_TimerA_Data]=r1
        r1 = 0x00A8						// 
        [P_DAC_Ctrl] = r1				//
        
        r1 = 0xffff
        [P_INT_Clear] = r1          	// Clear interrupt occuiped events
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA					// Enable Timer A FIQ
        //R1 |= C_IRQ4_1KHz				// Enable 1KHz IRQ4 for S480 decoder
        [R_InterruptStatus] = r1		//
        [P_INT_Ctrl] = r1				//
        
        RETF

//////////////////////////////////////////////////////////////////
// Function: The partial code of hardware setting of SACM_S240_Initial() 
//			or F_SACM_S240_Initial:
//////////////////////////////////////////////////////////////////
F_SP_SACM_S240_Init_:	
		r1=0x0020;	
		[P_SystemClock]=r1
		r1 = 0x00A8;					// 
		[P_DAC_Ctrl]= r1
		r1 = 0x0030;               	// TimerA CKA=Fosc/2 CKB=1 Tout:off
        [P_TimerA_Ctrl] = r1;
		r1 = 0xfe00;                    // 24K
    	[P_TimerA_Data] = r1;		
        r1 = 0xffff
        [P_INT_Clear] = r1          	// Clear interrupt occuiped events
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA					// Enable Timer A FIQ
        [R_InterruptStatus] = r1		//
        [P_INT_Ctrl] = r1				//
        RETF

//////////////////////////////////////////////////////////////////
// Function: The partial code of hardware setting of SACM_MS01_Initial() 
//			or F_SACM_MS01_Initial:
//
//	Ex: F_SACM_MS01_Initial:
//			...
//			call F_SP_SACM_MS01_Init_
//			call F_SP_Play_Mode0/1/2/3	->0,1,2,3 depending on the para1
//			...
//			retf
//////////////////////////////////////////////////////////////////
F_SP_SACM_MS01_Init_:	
		r1 = 0x0000;                    // 24MHz, Fcpu=Fosc
        [P_SystemClock] = r1;        	// Initial System Clock
        r1 = 0x0030;                    // TimerA CKA=Fosc/2 CKB=1 Tout:off
        [P_TimerA_Ctrl] = r1			// Initial Timer A
        
        //R1 = 0x0003						// 8K
        r1 = 0x0000						// Fosc/2
        [P_TimerB_Ctrl] = r1;			// Initial Timer B -> 8192	
        
        //R1 = 0xFFFF        
        r1 = 0xFA00					// Any time for ADPCM channel 0,1
        [P_TimerB_Data] = r1			// 8K sample rate
        
		r1 = 0xffff
        [P_INT_Clear] = r1          	// Clear interrupt occuiped events
        RETF

//........................................
F_SP_PlayMode0_:						// with F_SP_SACM_MS01_Initial
		r1 = 0x0006
        [P_DAC_Ctrl] = r1
        r1 = 0xFE00
        [P_TimerA_Data] = r1 			//
        r1 = [0x702D]		//
        r1 |= C_FIQ_PWM+C_IRQ2_TMB+C_IRQ4_1KHz
        [R_InterruptStatus] = r1 		//
        [P_INT_Ctrl] = r1				//
        RETF

F_SP_PlayMode1_:						// with F_SP_SACM_MS01_Initial
		r1 = 0x00A8
        [P_DAC_Ctrl] = r1
        r1 = 0xFE00
        [P_TimerA_Data] = r1 			//
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA+C_IRQ2_TMB+C_IRQ4_1KHz
        [R_InterruptStatus] = r1 		//
        [P_INT_Ctrl] = r1				//
        RETF


F_SP_PlayMode2_:	 						// with F_SP_SACM_MS01_Initial
		r1 = 0x00A8
        [P_DAC_Ctrl] = r1
        r1 = 0xFD9A
        [P_TimerA_Data] = r1 				//
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA+C_IRQ2_TMB+C_IRQ4_1KHz
        [R_InterruptStatus] = r1 			//
        [P_INT_Ctrl] = r1					//
        RETF

      
F_SP_PlayMode3_:								// with F_SP_SACM_MS01_Initial
		r1 = 0x00A8
        [P_DAC_Ctrl] = r1
        r1 = 0xFD00
        [P_TimerA_Data] = r1 					//
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA+C_IRQ2_TMB+C_IRQ4_1KHz
	    [R_InterruptStatus] = r1 				//
        [P_INT_Ctrl] = r1						//
        RETF
        
///////////////////////////////////////////////////////////////////////////////
// Function: The partial code of hardware setting of SACM_MS01_Initial() 
//			or F_SACM_MS01_Initial:
//
//	Ex: F_SACM_DVR_Initial:
//			...
//			call F_SP_SACM_DVR_Init_
//			call F_SP_Play_Mode0/1/2/3	->0,1,2,3 depending on the para1
//			...
//			retf
//	Ex1:
//		F_SACM_DVR_Record: (or F_SACM_DVR_InitEncoder)
//			...
//			call F_SP_SACM_DVR_Rec_Init
//			...
//			retf
//	Ex2:
//		F_SACM_DVR_Play: (or F_SACM_DVR_InitDecoder)
//			...
//			call F_SP_SACM_DVR_Play_Init_
//			...
//			retf
///////////////////////////////////////////////////////////////////////////////
F_SP_SACM_DVR_Init_:
        r1 = 0x0000;                    // 24MHz, Fcpu=Fosc
//	r1 = 0x0088						//49MHz
        [P_SystemClock] = r1;           //  Frequency 20MHz
        r1 = 0x0030;                    // TimerA CKA=Fosc/2 CKB=1 Tout:off
        [P_TimerA_Ctrl] = r1;
	    r1 = 0xfa00;                    // 8K @ 24.576MHz
        //r1 = 0xfb1d;                  // 8K @ 20MHz
//        r1 = 0xf401					// 8K@49MHz
        [P_TimerA_Data] = r1;
        r1 = 0x0035;                    // ADINI should be open (107)
        [P_ADC_Ctrl] = r1;
        r1 = 0x0000;                    // Set the DA Ctrl
        [P_DAC_Ctrl] = r1;
        
        r1 = 0xffff;
        [P_INT_Clear] = r1;          	// Clear interrupt occuiped events
        
        r1 = [0x702D]		//
        r1 |= C_FIQ_TMA					// Enable Timer A FIQ
        [R_InterruptStatus] = r1		//
        [P_INT_Ctrl] = r1				//
        
        RETF



F_SP_SACM_DVR_Rec_Init_:					// call by SACM_DVR_Record / SACM_DVR_InitEncoder
		r1 = 0x0035;  					//mic input
        //r1 = 0x0037					//line_in input
        [P_ADC_Ctrl] = r1;       		//enable ADC
        
        r1=0xfe00;                     	//24K @ 24.576MHz
        [P_TimerA_Data] = r1 
		RETF

F_SP_SACM_DVR_Play_Init_:
	    r1 = 0x0000						// call by SACM_DVR_Stop / SACM_DVR_Play
        [P_ADC_Ctrl] = r1;       		// Disable ADC
        
        r1 = 0xfd00;                	// 16K @ 24.576MHz
        [P_TimerA_Data] = r1;
        RETF




/////////////////////////////////////////////////////////////////////////////// 
// Function: Extra Functions provided by Sunplus
//	Type:	
//		1. DAC Ramp up/down
//		2. IO config/import/export
//		3. Get resource data
//
//
///////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////
// Function: Ramp Up/Down to avoid speaker "pow" noise
// Destory: R1,R2
////////////////////////////////////////////////////////
_SP_RampUpDAC1:	.PROC
F_SP_RampUpDAC1:
		push r1,r2 to [sp] 
        r1=[P_DAC1] 
        r1 &= ~0x003f 
        cmp     r1,0x8000
        jb     	L_RU_NormalUp
        je      L_RU_End
                
L_RU_DownLoop:
        call    F_Delay         
        r2 = 0x0001 
        [P_Watchdog_Clear] = r2 
        r1 -= 0x40 
        [P_DAC1] = r1 
        cmp     r1,0x8000 
        jne     L_RU_DownLoop   
L_RD_DownEnd:
        jmp     L_RU_End 

L_RU_NormalUp:
L_RU_Loop:
        call    F_Delay 
        r2 = 0x0001 
        [P_Watchdog_Clear] = r2 
        r1 += 0x40 
        [P_DAC1] = r1 
        cmp     r1, 0x8000 
        jne     L_RU_Loop 
L_RU_End:
		pop     r1,r2 from [sp] 
  		retf 
    	.ENDP
    
//............................................................
_SP_RampDnDAC1:	.PROC
F_SP_RampDnDAC1:
		push r1,r2 to [sp] 
  		//int off 
    	r1 = [P_DAC1] 
     	r1 &= ~0x003F 
      	jz      L_RD_End 
L_RD_Loop:                
        call    F_Delay         
        r2 = 0x0001 
        [P_Watchdog_Clear] = r2 
        r1 -= 0x40 
        [P_DAC1] = r1   
        jnz     L_RD_Loop 
L_RD_End:       
		//int	fiq,irq
        pop     r1,r2 from [sp] 
        retf 
		.ENDP

//..............................................................
_SP_RampUpDAC2:	.PROC
F_SP_RampUpDAC2:
		push r1,r2 to [sp] 
  		r1=[P_DAC2] 
    	r1 &= ~0x003f 
     	cmp     r1,0x8000
      	jb     	L_RU_NormalUp_   
       	je      L_RU_End 
                
L_RU_DownLoop_:
        call    F_Delay         
        r2 = 0x0001 
        [P_Watchdog_Clear] = r2 
        r1 -= 0x40 
        [P_DAC2] = r1 
        cmp     r1,0x8000 
        jne     L_RU_DownLoop_   
L_RD_DownEnd_:
        jmp     L_RU_End_ 

L_RU_NormalUp_:
L_RU_Loop_:
		call    F_Delay 
  		r2 = 0x0001 
    	[P_Watchdog_Clear] = r2 
        r1 += 0x40 
        [P_DAC2] = r1 
        cmp     r1, 0x8000 
        jne     L_RU_Loop_ 
L_RU_End_:
   		pop     r1,r2 from [sp] 
     	retf 
      	.ENDP
//.............................................................
_SP_RampDnDAC2:	.PROC
F_SP_RampDnDAC2:
		//int off 
		push r1,r2 to [sp] 
                
        r1 = [P_DAC2] 
        r1 &= ~0x003F 
        jz      L_RD_End_ 
L_RD_Loop_:                
        call    F_Delay         
        r2 = 0x0001 
        [P_Watchdog_Clear] = r2 
        r1 -= 0x40 
        [P_DAC2] = r1   
        jnz     L_RD_Loop_ 
L_RD_End_:       
        pop     r1,r2 from [sp] 
        retf 
		.ENDP

//..................................................................				
F_Delay:
        push r1 to [sp] 
        r1 = C_RampDelayTime			// Ramp Up/Dn delay per step
L_D_Loop:
        r1 -= 1 
        jnz     L_D_Loop  
        pop     r1 from [sp] 
        RETF	 



////////////////////////////////////////////////////////////////
// Function: I/O Port A configuration
// 	void SP_Inti_IOA(int Dir, int Data, int Attrib)
////////////////////////////////////////////////////////////////
_SP_Init_IOA: .PROC
		PUSH bp TO [sp] 
        bp = sp + 1 
		PUSH r1 TO [sp] 
		r1 = [bp+3] 						// Port direction
		[P_IOA_Dir] = r1 
		r1 = [bp+4] 
		[P_IOA_Data] = r1 
		r1 = [bp+5] 
		[P_IOA_Attrib] = r1 
		
		POP r1 FROM [sp] 
        POP bp FROM [sp] 
        RETF 
		.ENDP

////////////////////////////////////////////////////////////////// 
// Function: I/O Port B configuration
//  void SP_Inti_IOB(int Dir, int Data, int Attrib)
//////////////////////////////////////////////////////////////////    
_SP_Init_IOB: .PROC
		PUSH bp TO [sp] 
        bp = sp + 1 
		PUSH r1 TO [sp] 
		r1 = [bp+3] 						// Port direction
		[P_IOB_Dir] = r1 
		r1 = [bp+4] 
		[P_IOB_Data] = r1 
		r1 = [bp+5] 
		[P_IOB_Attrib] = r1 
		
		POP r1 FROM [sp] 
        POP bp FROM [sp] 
        RETF 
		.ENDP

////////////////////////////////////////////////////////////////// 
// Function: Get data from port
// 	int SP_Import(unsigned int Port)
//////////////////////////////////////////////////////////////////  
_SP_Import: .PROC
        PUSH bp TO [sp] 
        bp = sp + 1 
        
		r1 = [bp+3]  						// Port Number
		r1 = [r1]  
				
        POP bp FROM [sp] 
        RETF 
		.ENDP

_SP_Export: .PROC
        PUSH bp,bp TO [sp] 
        sp = sp + 1 
		PUSH r1,r2 TO [sp] 
		r1 = [bp+3]  						// Port Number
		r2 = [bp+4]  						// Value
		[r1] = r2  
		POP r1,r2 FROM [sp] 
        POP bp,bp FROM [sp] 
        RETF         
 		.ENDP


////////////////////////////////////////////////////////////////// 
// Function: Get data from resource(ROM area)
// 	int SP_GetResource(int Addr, int Page)
//////////////////////////////////////////////////////////////////  
_SP_GetResource:	.PROC
		push bp to [sp] 
		bp = sp + 1 
		
		r1 = [bp+3] 					// Address
		r2 = [bp+4] 					// Page
		
		r2 = r2 lsl 4 					// Prepare Page for SR
		r2 = r2 lsl 4 
		r2 = r2 lsl 2 
		
		sr &= 0x03f 					// Change Page
        r2 |=sr 						//
        sr = r2 						//
  
  		r1 = D:[r1] 					// Get data
       
		pop	 bp from [sp] 
		retf 
		.ENDP 
//........................................
F_SP_GetResource:
		r2 = r2 lsl 4 					// Prepare Page for SR
		r2 = r2 lsl 4 
		r2 = r2 lsl 2 
		
		sr &= 0x03f 					// Change Page
        r2 |=sr 						//
        sr = r2 						//
  
  		r1 = D:[r1] 					// Get data
	  	retf

//////////////////////////////////////////////////////////////////
// Functions: Reserve old defintion
// Note: 	1. Some user who use old library may use the old name
//			2. Have to be put at the end of this file
//////////////////////////////////////////////////////////////////
.PUBLIC	F_RampUpDAC1 
.PUBLIC	F_RampDnDAC1 
.PUBLIC	F_RampUpDAC2 
.PUBLIC	F_RampDnDAC2 
.PUBLIC	_STD_RampUpDAC1 
.PUBLIC	_STD_RampDnDAC1 
.PUBLIC	_STD_RampUpDAC2 
.PUBLIC	_STD_RampDnDAC2 

.DEFINE F_RampUpDAC1 F_SP_RampUpDAC1
.DEFINE F_RampDnDAC1 F_SP_RampDnDAC1
.DEFINE F_RampUpDAC2 F_SP_RampUpDAC2
.DEFINE F_RampDnDAC2 F_SP_RampDnDAC2
.DEFINE _STD_RampUpDAC1 _SP_RampUpDAC1
.DEFINE _STD_RampDnDAC1 _SP_RampDnDAC1
.DEFINE _STD_RampUpDAC2 _SP_RampUpDAC2
.DEFINE _STD_RampDnDAC2 _SP_RampDnDAC2


///////////////////////////////////////////////////////////////////
                
//========================================================================================        
// End of hardware.asm
//========================================================================================



        
        
        