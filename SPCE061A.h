// ========================================================================= //
// File Name   : SPCE061A.h													 //	
// Description : SPCE061A register definitions								 //
// Processor   : SPCE061A													 //	
// Revision	   : v1.00, 2005-10-19											 //
// ========================================================================= //

//***************************************************************************//
//	Register definitions													 //
//***************************************************************************//

//	IO port control registers
	#define		P_IOA_Data				(volatile unsigned int *)0x7000
	#define		P_IOA_Buffer			(volatile unsigned int *)0x7001
	#define		P_IOA_Dir				(volatile unsigned int *)0x7002
	#define		P_IOA_Attrib			(volatile unsigned int *)0x7003
	#define		P_IOA_Latch				(volatile unsigned int *)0x7004

	#define		P_IOB_Data				(volatile unsigned int *)0x7005
	#define		P_IOB_Buffer			(volatile unsigned int *)0x7006
	#define		P_IOB_Dir				(volatile unsigned int *)0x7007
	#define		P_IOB_Attrib			(volatile unsigned int *)0x7008

//	Timer control registers
	#define		P_TimerA_Data			(volatile unsigned int *)0x700A
	#define		P_TimerA_Ctrl			(volatile unsigned int *)0x700B
	#define		P_TimerB_Data			(volatile unsigned int *)0x700C
	#define		P_TimerB_Ctrl			(volatile unsigned int *)0x700D

//	Timebase control registers
	#define		P_TimeBase_Setup		(volatile unsigned int *)0x700E
	#define		P_Timebase_Setup		(volatile unsigned int *)0x700E		// Same as P_TimeBase_Setup
	#define		P_TimeBase_Clear		(volatile unsigned int *)0x700F
	#define		P_Timebase_Clear		(volatile unsigned int *)0x700F		// Same as P_TimeBase_Clear

//	Interrupt control registers
	#define		P_INT_Ctrl				(volatile unsigned int *)0x7010
	#define		P_INT_Clear				(volatile unsigned int *)0x7011
	#define		P_INT_Mask				(volatile unsigned int *)0x702D
	#define		P_INT_Ctrl_New			(volatile unsigned int *)0x702D		// Same as P_INT_Mask

//	Analog functions control registers
	#define		P_ADC					(volatile unsigned int *)0x7014
	#define		P_ADC_Ctrl				(volatile unsigned int *)0x7015
	#define		P_ADC_MUX_Ctrl			(volatile unsigned int *)0x702B
	#define		P_ADC_MUX_Data			(volatile unsigned int *)0x702C
	#define		P_ADC_LINEIN_Data		(volatile unsigned int *)0x702C		// Same as P_ADC_MUX_Data
	#define		P_ADC_LineIn_Data		(volatile unsigned int *)0x702C		// Same as P_ADC_MUX_Data

	#define		P_DAC_Ctrl				(volatile unsigned int *)0x702A
	#define		P_DAC1					(volatile unsigned int *)0x7017
	#define		P_DAC2					(volatile unsigned int *)0x7016

//	Serial	functions control registers
	#define		P_SIO_Data				(volatile unsigned int *)0x701A
	#define		P_SIO_Addr_Low			(volatile unsigned int *)0x701B
	#define		P_SIO_Addr_Mid			(volatile unsigned int *)0x701C
	#define		P_SIO_Addr_High			(volatile unsigned int *)0x701D
	#define		P_SIO_Ctrl				(volatile unsigned int *)0x701E
	#define		P_SIO_Start				(volatile unsigned int *)0x701F
	#define		P_SIO_Stop				(volatile unsigned int *)0x7020

	#define		P_UART_Command1			(volatile unsigned int *)0x7021
	#define		P_UART_Command2			(volatile unsigned int *)0x7022
	#define		P_UART_Data				(volatile unsigned int *)0x7023
	#define		P_UART_BaudScalarLow	(volatile unsigned int *)0x7024
	#define		P_UART_BaudScalarHigh	(volatile unsigned int *)0x7025

//	Other control registers
	#define		P_Feedback				(volatile unsigned int *)0x7009
	#define		P_SystemClock			(volatile unsigned int *)0x7013
	#define		P_Watchdog_Clear		(volatile unsigned int *)0x7012
	#define		P_LVD_Ctrl				(volatile unsigned int *)0x7019
	#define		P_Flash_Ctrl			(volatile unsigned int *)0x7555


//***************************************************************************//
//	Constant definitions													 //
//***************************************************************************//
//	Constants for interrupt
	#define		C_FIQ_PWM				0x8000		// P_INT_Ctrl
	#define		C_FIQ_TMA				0x2000		// P_INT_Ctrl
	#define		C_FIQ_TMB				0x0800		// P_INT_Ctrl
	#define		C_IRQ0_PWM				0x4000		// P_INT_Ctrl
	#define		C_IRQ1_TMA				0x1000		// P_INT_Ctrl
	#define		C_IRQ2_TMB				0x0400		// P_INT_Ctrl
	#define		C_IRQ3_KEY				0x0080		// P_INT_Ctrl
	#define		C_IRQ3_EXT1				0x0100		// P_INT_Ctrl
	#define		C_IRQ3_EXT2				0x0200		// P_INT_Ctrl
	#define		C_IRQ4_1KHz				0x0010		// P_INT_Ctrl
	#define		C_IRQ4_2KHz				0x0020		// P_INT_Ctrl
	#define		C_IRQ4_4KHz				0x0040		// P_INT_Ctrl
	#define		C_IRQ5_2Hz				0x0004		// P_INT_Ctrl
	#define		C_IRQ5_4Hz				0x0008		// P_INT_Ctrl
	#define		C_IRQ6_TMB1				0x0002		// P_INT_Ctrl
	#define		C_IRQ6_TMB2				0x0001		// P_INT_Ctrl

//	Constants for TimerA & TimerB
	#define		C_TMA1_FOSC_2			0x0000		// P_TimerA_Ctrl
	#define		C_TMA1_FOSC_256			0x0001		// P_TimerA_Ctrl
	#define		C_TMA1_32KHz			0x0002		// P_TimerA_Ctrl
	#define		C_TMA1_8KHz				0x0003		// P_TimerA_Ctrl
	#define		C_TMA1_4KHz				0x0004		// P_TimerA_Ctrl
	#define		C_TMA1_1				0x0005		// P_TimerA_Ctrl
	#define		C_TMA1_0				0x0006		// P_TimerA_Ctrl
	#define		C_TMA1_EXT1				0x0007		// P_TimerA_Ctrl
	#define		C_TMA2_2KHz				0x0000		// P_TimerA_Ctrl
	#define		C_TMA2_1KHz				0x0008		// P_TimerA_Ctrl
	#define		C_TMA2_256Hz			0x0010		// P_TimerA_Ctrl
	#define		C_TMA2_TMB1				0x0018		// P_TimerA_Ctrl
	#define		C_TMA2_4Hz				0x0020		// P_TimerA_Ctrl
	#define		C_TMA2_2Hz				0x0028		// P_TimerA_Ctrl
	#define		C_TMA2_1				0x0030		// P_TimerA_Ctrl
	#define		C_TMA2_EXT2				0x0038		// P_TimerA_Ctrl
	#define		C_TMA_PWM_OFF			0x0000		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D1			0x0040		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D2			0x0080		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D3			0x00C0		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D4			0x0100		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D5			0x0140		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D6			0x0180		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D7			0x01C0		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D8			0x0200		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D9			0x0240		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D10			0x0280		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D11			0x02C0		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D12			0x0300		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D13			0x0340		// P_TimerA_Ctrl
	#define		C_TMA_PWM_D14			0x0380		// P_TimerA_Ctrl
	#define		C_TMA_PWM_TA			0x03C0		// P_TimerA_Ctrl
									    
	#define		C_TMB_FOSC_2			0x0000		// P_TimerB_Ctrl
	#define		C_TMB_FOSC_256			0x0001		// P_TimerB_Ctrl
	#define		C_TMB_32KHz				0x0002		// P_TimerB_Ctrl
	#define		C_TMB_8KHz				0x0003		// P_TimerB_Ctrl
	#define		C_TMB_4KHz				0x0004		// P_TimerB_Ctrl
	#define		C_TMB_1					0x0005		// P_TimerB_Ctrl
	#define		C_TMB_0					0x0006		// P_TimerB_Ctrl
	#define		C_TMB_EXT1				0x0007		// P_TimerB_Ctrl
	#define		C_TMB_PWM_OFF			0x0000		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D1			0x0040		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D2			0x0080		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D3			0x00C0		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D4			0x0100		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D5			0x0140		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D6			0x0180		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D7			0x01C0		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D8			0x0200		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D9			0x0240		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D10			0x0280		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D11			0x02C0		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D12			0x0300		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D13			0x0340		// P_TimerB_Ctrl
	#define		C_TMB_PWM_D14			0x0380		// P_TimerB_Ctrl
	#define		C_TMB_PWM_TB			0x03C0		// P_TimerB_Ctrl

//	Constants for TimeBase
	#define		C_TMB1_8Hz				0x0000		// P_Timebase_Setup
	#define		C_TMB1_16Hz				0x0001		// P_Timebase_Setup
	#define		C_TMB1_32Hz				0x0002		// P_Timebase_Setup
	#define		C_TMB1_64Hz				0x0003		// P_Timebase_Setup
	#define		C_TMB2_128Hz			0x0000		// P_Timebase_Setup
	#define		C_TMB2_256Hz			0x0004		// P_Timebase_Setup
	#define		C_TMB2_512Hz			0x0008		// P_Timebase_Setup
	#define		C_TMB2_1024Hz			0x000c		// P_Timebase_Setup

//	Constants for system clock
	#define		C_Fosc_49M				0x0080		// P_SystemClock
	#define		C_Fosc_40M				0x0060		// P_SystemClock
	#define		C_Fosc_32M				0x0040		// P_SystemClock
	#define		C_Fosc_24M				0x0000		// P_SystemClock
	#define		C_Fosc_20M				0x0020		// P_SystemClock
									    
	#define		C_Fosc					0x0000		// P_SystemClock
	#define		C_Fosc_Div_2			0x0001		// P_SystemClock
	#define		C_Fosc_Div_4			0x0002		// P_SystemClock
	#define		C_Fosc_Div_8			0x0003		// P_SystemClock
	#define		C_Fosc_Div_16			0x0004		// P_SystemClock
	#define		C_Fosc_Div_32			0x0005		// P_SystemClock
	#define		C_Fosc_Div_64			0x0006		// P_SystemClock
	#define		C_Sleep					0x0007		// P_SystemClock

	#define		C_StrongMode			0x0008		// P_SystemClock
	#define		C_AutoMode				0x0000		// P_SystemClock
	#define		C_32K_Work				0x0010		// P_SystemClock
	#define		C_32K_Off				0x0000		// P_SystemClock

//	Constants for ADC & DAC
	#define		C_ADC_EN				0x0001		// P_ADC_Ctrl
	#define		C_ADC_DIS				0x0000		// P_ADC_Ctrl
	#define		C_MIC_RDY				0x8000		// P_ADC_Ctrl
	#define		C_MIC_EN				0x0000		// P_ADC_Ctrl
	#define		C_MIC_DIS				0x0002		// P_ADC_Ctrl
	#define		C_MIC_AGC_EN			0x0004		// P_ADC_Ctrl
	#define		C_MIC_AGC_DIS			0x0000		// P_ADC_Ctrl
	#define		C_VEXTREF_EN			0x0080		// P_ADC_Ctrl
	#define		C_VEXTREF_DIS			0x0000		// P_ADC_Ctrl
	#define		C_2V_EN					0x0100		// P_ADC_Ctrl
	#define		C_2V_DIS				0x0000		// P_ADC_Ctrl
	#define		C_DAC_3mA				0x0040		// P_ADC_Ctrl
	#define		C_DAC_2mA				0x0000		// P_ADC_Ctrl
										
	#define		C_ADC_MUX_MIC			0x0000		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA0			0x0001		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA1			0x0002		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA2			0x0003		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA3			0x0004		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA4			0x0005		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA5			0x0006		// P_ADC_MUX_Ctrl
	#define		C_ADC_MUX_IOA6			0x0007		// P_ADC_MUX_Ctrl
	#define		C_LINEIN_FAIL			0x4000		// P_ADC_MUX_Ctrl
	#define		C_LINEIN_RDY			0x8000		// P_ADC_MUX_Ctrl

	#define		C_DAC1_DIRECT			0x0000		// P_DAC_Ctrl
	#define		C_DAC1_LATCH_A			0x0080		// P_DAC_Ctrl
	#define		C_DAC1_LATCH_B			0x0100		// P_DAC_Ctrl
	#define		C_DAC1_LATCH_AB			0x0180		// P_DAC_Ctrl
	#define		C_DAC2_DIRECT			0x0000		// P_DAC_Ctrl
	#define		C_DAC2_LATCH_A			0x0020		// P_DAC_Ctrl
	#define		C_DAC2_LATCH_B			0x0040		// P_DAC_Ctrl
	#define		C_DAC2_LATCH_AB			0x0060		// P_DAC_Ctrl
	#define		C_MIC_DIRECT			0x0000		// P_DAC_Ctrl
	#define		C_MIC_LATCH_A			0x0008		// P_DAC_Ctrl
	#define		C_MIC_LATCH_B			0x0010		// P_DAC_Ctrl
	#define		C_MIC_LATCH_AB			0x0018		// P_DAC_Ctrl
	#define		C_DAC_DIS				0x0002		// P_DAC_Ctrl

//	Constants for SIO
	#define		C_SIO_CONFIG			0x0080		// P_SIO_Ctrl
	#define		C_SIO_READ				0x0000		// P_SIO_Ctrl
	#define		C_SIO_WRITE				0x0040		// P_SIO_Ctrl
	#define		C_SIO_CLOCK_32			0x0018		// P_SIO_Ctrl
	#define		C_SIO_CLOCK_16			0x0000		// P_SIO_Ctrl
	#define		C_SIO_CLOCK_8			0x0010		// P_SIO_Ctrl
	#define		C_SIO_ADDR_24			0x0003		// P_SIO_Ctrl
	#define		C_SIO_ADDR_16			0x0000		// P_SIO_Ctrl
	#define		C_SIO_ADDR_8			0x0002		// P_SIO_Ctrl
	#define		C_SIO_ADDR_NO			0x0001		// P_SIO_Ctrl

	#define		C_SIO_BUSY				0x0080		// P_SIO_Start

//	Constants for UART
	#define		C_UART_RX_INT			0x0080		// P_UART_Command1
	#define		C_UART_TX_INT			0x0040		// P_UART_Command1	
	#define		C_UART_RESET			0x0020		// P_UART_Command1	
	#define		C_UART_PARITY_EVEN		0x0008		// P_UART_Command1	
	#define		C_UART_PARITY_ODD		0x0000		// P_UART_Command1	
	#define		C_UART_PARITY_EN		0x0004		// P_UART_Command1	
	#define		C_UART_PARITY_DIS		0x0000		// P_UART_Command1	

	#define		C_UART_RX_RDY			0x0080		// P_UART_Command2
	#define		C_UART_TX_RDY			0x0040		// P_UART_Command2
	#define		C_UART_RX_EN			0x0080		// P_UART_Command2
	#define		C_UART_TX_EN			0x0040		// P_UART_Command2
	#define		C_UART_PE				0x0008		// P_UART_Command2
	#define		C_UART_OE				0x0010		// P_UART_Command2
	#define		C_UART_FE				0x0020		// P_UART_Command2
//	Constants for Feedback
	#define		C_FEEDBACK1_EN			0x0004		// P_Feedback
	#define		C_FEEDBACK2_EN			0x0008		// P_Feedback
	#define		C_IRTX_EN				0x0001		// P_Feedback

//	Constants for LVD
	#define		C_LVD33V				0x0002		// P_LVD_Ctrl
	#define		C_LVD29V				0x0001		// P_LVD_Ctrl

//	Other Constants
	#define		C_WDTCLR				0x0001		// P_Watchdog_Clear
	
///////////////////////////////////////////////////////////////////
//	Old definitions for LVD @'SPCE061V004.h'
	#define		C_LVD24V				0x0000		// P_LVD_Ctrl
	#define		C_LVD28V				0x0001		// P_LVD_Ctrl
	#define		C_LVD32V				0x0002		// P_LVD_Ctrl
	#define		C_LVD36V				0x0003		// P_LVD_Ctrl

//	Old definitions for TimerA & TimerB @'SPCE061V004.h'
	#define		C_TimerADefault			0x0036		// P_TimerA_Ctrl
	#define		C_SourceA_Fosc2			0x0000		// P_TimerA_Ctrl
	#define		C_SourceA_Fosc256	   	0x0001		// P_TimerA_Ctrl
	#define		C_SourceA_32768Hz		0x0002		// P_TimerA_Ctrl
	#define		C_SourceA_8192Hz		0x0003		// P_TimerA_Ctrl
	#define		C_SourceA_4096Hz		0x0004		// P_TimerA_Ctrl
	#define		C_SourceA_1				0x0005		// P_TimerA_Ctrl
	#define 	C_SourceA_0				0x0006		// P_TimerA_Ctrl
	#define 	C_SourceA_Ext1			0x0007		// P_TimerA_Ctrl
	#define		C_SourceB_2048Hz		0x0000 		// P_TimerA_Ctrl
	#define		C_SourceB_1024Hz		0x0008 		// P_TimerA_Ctrl
	#define		C_SourceB_256Hz			0x0010 		// P_TimerA_Ctrl
	#define		C_SourceB_TMB1			0x0018 		// P_TimerA_Ctrl
	#define		C_SourceB_4Hz			0x0020 		// P_TimerA_Ctrl
	#define		C_SourceB_2Hz			0x0028 		// P_TimerA_Ctrl
	#define		C_SourceB_1				0x0030 		// P_TimerA_Ctrl
	#define		C_SourceB_Ext2			0x0038 		// P_TimerA_Ctrl
													   
	#define		C_TimerBDefault			0x0006		// P_TimerB_Ctrl
	#define		C_SourceC_Fosc2			0x0000 		// P_TimerB_Ctrl
	#define		C_SourceC_Fosc256		0x0001 		// P_TimerB_Ctrl
	#define		C_SourceC_32768Hz		0x0002 		// P_TimerB_Ctrl
	#define		C_SourceC_8192Hz		0x0003 		// P_TimerB_Ctrl
	#define		C_SourceC_4096Hz		0x0004 		// P_TimerB_Ctrl
	#define		C_SourceC_1				0x0005 		// P_TimerB_Ctrl
	#define 	C_SourceC_0				0x0006 		// P_TimerB_Ctrl
	#define 	C_SourceC_Ext1			0x0007 		// P_TimerB_Ctrl
													   
	#define		C_DutyOff				0x0000 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty1					0x0040 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty2					0x0080 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty3					0x00C0 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty4					0x0100 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty5					0x0140 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty6					0x0180 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty7					0x01C0 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty8					0x0200 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty9					0x0240 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty10				0x0280 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty11				0x02C0 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty12				0x0300 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty13				0x0340 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty14				0x0380 		// P_TimerA_Ctrl, P_TimerB_Ctrl
	#define 	C_Duty_Div_2			0x03C0 		// P_TimerA_Ctrl, P_TimerB_Ctrl

//	Old definitions for ADC & DAC @'SPCE061V004.h'
	#define		C_ADCE					0x0001 		// P_ADC_Ctrl
	#define		C_ADCN					0x0000		// P_ADC_Ctrl
	#define 	C_MIC_DIS				0x0002 		// P_ADC_Ctrl
	#define 	C_MIC_ENB				0x0000 		// P_ADC_Ctrl
	#define 	C_AGCE					0x0004 		// P_ADC_Ctrl
	#define 	C_AGCN					0x0000 		// P_ADC_Ctrl
	#define 	C_DAC_OUT2mA			0x0040 		// P_ADC_Ctrl
	#define 	C_DAC_OUT3mA			0x0000 		// P_ADC_Ctrl
	#define 	C_VEXTREF_ENB			0x0080 		// P_ADC_Ctrl
	#define 	C_VEXTREF_DIS			0x0000 		// P_ADC_Ctrl
	#define 	C_V2VREFB_DIS			0x0100 		// P_ADC_Ctrl
	#define 	C_V2VREFB_ENB			0x0000 		// P_ADC_Ctrl
													 
	#define		C_DA1_Direct			0x0000 		// P_DAC_Ctrl
	#define		C_DA1_LatchA			0x0080 		// P_DAC_Ctrl
	#define		C_DA1_LatchB			0x0100 		// P_DAC_Ctrl
	#define		C_DA1_LatchAB			0x0180 		// P_DAC_Ctrl
	#define		C_DA2_Direct			0x0000 		// P_DAC_Ctrl
	#define		C_DA2_LatchA			0x0020 		// P_DAC_Ctrl
	#define		C_DA2_LatchB			0x0040 		// P_DAC_Ctrl
	#define		C_DA2_LatchAB			0x0060 		// P_DAC_Ctrl
	#define		C_AD_Direct				0x0000 		// P_DAC_Ctrl
	#define		C_AD_LatchA				0x0008 		// P_DAC_Ctrl
	#define		C_AD_LatchB				0x0010 		// P_DAC_Ctrl
	#define		C_AD_LatchAB			0x0018 		// P_DAC_Ctrl

	#define		C_ADC_CH_MICin			0x0000 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH1				0x0001 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH2				0x0002 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH3				0x0003 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH4				0x0004 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH5				0x0005 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH6				0x0006 		// P_ADC_MUX_Ctrl
	#define		C_ADC_CH7				0x0007 		// P_ADC_MUX_Ctrl
													  
//	Old definitions for SIO @'SPCE061V004.h'		  
	#define 	C_SIO_Addr8				0x0002 		// P_SIO_Ctrl
	#define 	C_SIO_Addr16			0x0000 		// P_SIO_Ctrl
	#define 	C_SIO_Addr24			0x0003 		// P_SIO_Ctrl
	#define 	C_SIO_Clk_Div_16		0x0000 		// P_SIO_Ctrl
	#define 	C_SIO_Clk_Div_4			0x0008 		// P_SIO_Ctrl
	#define 	C_SIO_Clk_Div_8			0x0010 		// P_SIO_Ctrl
	#define 	C_SIO_Clk_Div_32		0x0018		// P_SIO_Ctrl
	#define		C_SIO_RW_Dis			0x0020		// P_SIO_Ctrl
	#define		C_SIO_RW_ENB			0x0000		// P_SIO_Ctrl
	#define		C_SIO_RD				0x0000		// P_SIO_Ctrl
	#define		C_SIO_WR				0x0040		// P_SIO_Ctrl
	#define		C_SIO_ENB				0x0080		// P_SIO_Ctrl
	#define		C_SIO_Dis				0x0000		// P_SIO_Ctrl
	#define		C_SIOSTARTCMD			0x5555		// P_SIO_Start
	#define		C_SIOSTOPCMD			0x5555		// P_SIO_Stop

//	Old definitions for UART @'SPCE061V004.h'
	#define		C_UART_Parity_ENB		0x0004		// P_UART_Command1 
	#define		C_UART_Parity_Odd		0x0000		// P_UART_Command1
	#define		C_UART_Parity_Even		0x0008		// P_UART_Command1
	#define		C_UART_Reset			0x0020		// P_UART_Command1
	#define		C_UART_Tx_IRQ_ENB		0x0040		// P_UART_Command1
	#define		C_UART_Rx_IRQ_ENB		0x0080		// P_UART_Command1
	#define		C_UART_Tx_Pin_ENB		0x0040		// P_UART_Command2
	#define		C_UART_Rx_Pin_ENB		0x0080		// P_UART_Command2
	#define		C_UART_Parity_Error		0x0008		// P_UART_Command2
	#define		C_UART_OverRun_Error	0x0010		// P_UART_Command2
	#define		C_UART_Frame_Error		0x0020		// P_UART_Command2
	#define		C_UART_Tx_RDY			0x0040		// P_UART_Command2
	#define		C_UART_Rx_RDY			0x0080		// P_UART_Command2


//========================================================================================
// End of SPCE061A.h
//========================================================================================
