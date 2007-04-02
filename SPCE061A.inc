// ========================================================================= //
// File Name   : SPCE061A.inc												 //	
// Description : SPCE061A register definitions								 //
// Processor   : SPCE061A													 //	
// Revision	   : v1.00, 2005-10-19											 //
// ========================================================================= //

//***************************************************************************//
//	Register definitions													 //
//***************************************************************************//

//	IO port control registers
	.DEFINE		P_IOA_Data				0x7000
	.DEFINE		P_IOA_Buffer			0x7001
	.DEFINE		P_IOA_Dir				0x7002
	.DEFINE		P_IOA_Attrib			0x7003
	.DEFINE		P_IOA_Latch				0x7004

	.DEFINE		P_IOB_Data				0x7005
	.DEFINE		P_IOB_Buffer			0x7006
	.DEFINE		P_IOB_Dir				0x7007
	.DEFINE		P_IOB_Attrib			0x7008

//	Timer control registers
	.DEFINE		P_TimerA_Data			0x700A
	.DEFINE		P_TimerA_Ctrl			0x700B
	.DEFINE		P_TimerB_Data			0x700C
	.DEFINE		P_TimerB_Ctrl			0x700D

//	Timebase control registers
	.DEFINE		P_TimeBase_Setup		0x700E
	.DEFINE		P_Timebase_Setup		0x700E		// Same as P_TimeBase_Setup
	.DEFINE		P_TimeBase_Clear		0x700F
	.DEFINE		P_Timebase_Clear		0x700F		// Same as P_TimeBase_Clear

//	Interrupt control registers
	.DEFINE		P_INT_Ctrl				0x7010
	.DEFINE		P_INT_Clear				0x7011
	.DEFINE		P_INT_Mask				0x702D
	.DEFINE		P_INT_Ctrl_New			0x702D		// Same as P_INT_Mask

//	Analog functions control registers
	.DEFINE		P_ADC					0x7014
	.DEFINE		P_ADC_Ctrl				0x7015
	.DEFINE		P_ADC_MUX_Ctrl			0x702B
	.DEFINE		P_ADC_MUX_Data			0x702C
	.DEFINE		P_ADC_LINEIN_Data		0x702C		// Same as P_ADC_MUX_Data
	.DEFINE		P_ADC_LineIn_Data		0x702C		// Same as P_ADC_MUX_Data

	.DEFINE		P_DAC_Ctrl				0x702A
	.DEFINE		P_DAC1					0x7017
	.DEFINE		P_DAC2					0x7016

//	Serial	functions control registers
	.DEFINE		P_SIO_Data				0x701A
	.DEFINE		P_SIO_Addr_Low			0x701B
	.DEFINE		P_SIO_Addr_Mid			0x701C
	.DEFINE		P_SIO_Addr_High			0x701D
	.DEFINE		P_SIO_Ctrl				0x701E
	.DEFINE		P_SIO_Start				0x701F
	.DEFINE		P_SIO_Stop				0x7020

	.DEFINE		P_UART_Command1			0x7021
	.DEFINE		P_UART_Command2			0x7022
	.DEFINE		P_UART_Data				0x7023
	.DEFINE		P_UART_BaudScalarLow	0x7024
	.DEFINE		P_UART_BaudScalarHigh	0x7025

//	Other control registers
	.DEFINE		P_Feedback				0x7009
	.DEFINE		P_SystemClock			0x7013
	.DEFINE		P_Watchdog_Clear		0x7012
	.DEFINE		P_LVD_Ctrl				0x7019
	.DEFINE		P_Flash_Ctrl			0x7555


//***************************************************************************//
//	Constant definitions													 //
//***************************************************************************//
//	Constants for interrupt
	.DEFINE		C_FIQ_PWM				0x8000		// P_INT_Ctrl
	.DEFINE		C_FIQ_TMA				0x2000		// P_INT_Ctrl
	.DEFINE		C_FIQ_TMB				0x0800		// P_INT_Ctrl
	.DEFINE		C_IRQ0_PWM				0x4000		// P_INT_Ctrl
	.DEFINE		C_IRQ1_TMA				0x1000		// P_INT_Ctrl
	.DEFINE		C_IRQ2_TMB				0x0400		// P_INT_Ctrl
	.DEFINE		C_IRQ3_KEY				0x0080		// P_INT_Ctrl
	.DEFINE		C_IRQ3_EXT1				0x0100		// P_INT_Ctrl
	.DEFINE		C_IRQ3_EXT2				0x0200		// P_INT_Ctrl
	.DEFINE		C_IRQ4_1KHz				0x0010		// P_INT_Ctrl
	.DEFINE		C_IRQ4_2KHz				0x0020		// P_INT_Ctrl
	.DEFINE		C_IRQ4_4KHz				0x0040		// P_INT_Ctrl
	.DEFINE		C_IRQ5_2Hz				0x0004		// P_INT_Ctrl
	.DEFINE		C_IRQ5_4Hz				0x0008		// P_INT_Ctrl
	.DEFINE		C_IRQ6_TMB1				0x0002		// P_INT_Ctrl
	.DEFINE		C_IRQ6_TMB2				0x0001		// P_INT_Ctrl

//	Constants for TimerA & TimerB
	.DEFINE		C_TMA1_FOSC_2			0x0000		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_FOSC_256			0x0001		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_32KHz			0x0002		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_8KHz				0x0003		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_4KHz				0x0004		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_1				0x0005		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_0				0x0006		// P_TimerA_Ctrl
	.DEFINE		C_TMA1_EXT1				0x0007		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_2KHz				0x0000		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_1KHz				0x0008		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_256Hz			0x0010		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_TMB1				0x0018		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_4Hz				0x0020		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_2Hz				0x0028		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_1				0x0030		// P_TimerA_Ctrl
	.DEFINE		C_TMA2_EXT2				0x0038		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_OFF			0x0000		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D1			0x0040		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D2			0x0080		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D3			0x00C0		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D4			0x0100		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D5			0x0140		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D6			0x0180		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D7			0x01C0		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D8			0x0200		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D9			0x0240		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D10			0x0280		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D11			0x02C0		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D12			0x0300		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D13			0x0340		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_D14			0x0380		// P_TimerA_Ctrl
	.DEFINE		C_TMA_PWM_TA			0x03C0		// P_TimerA_Ctrl
									    
	.DEFINE		C_TMB_FOSC_2			0x0000		// P_TimerB_Ctrl
	.DEFINE		C_TMB_FOSC_256			0x0001		// P_TimerB_Ctrl
	.DEFINE		C_TMB_32KHz				0x0002		// P_TimerB_Ctrl
	.DEFINE		C_TMB_8KHz				0x0003		// P_TimerB_Ctrl
	.DEFINE		C_TMB_4KHz				0x0004		// P_TimerB_Ctrl
	.DEFINE		C_TMB_1					0x0005		// P_TimerB_Ctrl
	.DEFINE		C_TMB_0					0x0006		// P_TimerB_Ctrl
	.DEFINE		C_TMB_EXT1				0x0007		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_OFF			0x0000		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D1			0x0040		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D2			0x0080		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D3			0x00C0		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D4			0x0100		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D5			0x0140		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D6			0x0180		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D7			0x01C0		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D8			0x0200		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D9			0x0240		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D10			0x0280		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D11			0x02C0		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D12			0x0300		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D13			0x0340		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_D14			0x0380		// P_TimerB_Ctrl
	.DEFINE		C_TMB_PWM_TB			0x03C0		// P_TimerB_Ctrl

//	Constants for TimeBase
	.DEFINE		C_TMB1_8Hz				0x0000		// P_Timebase_Setup
	.DEFINE		C_TMB1_16Hz				0x0001		// P_Timebase_Setup
	.DEFINE		C_TMB1_32Hz				0x0002		// P_Timebase_Setup
	.DEFINE		C_TMB1_64Hz				0x0003		// P_Timebase_Setup
	.DEFINE		C_TMB2_128Hz			0x0000		// P_Timebase_Setup
	.DEFINE		C_TMB2_256Hz			0x0004		// P_Timebase_Setup
	.DEFINE		C_TMB2_512Hz			0x0008		// P_Timebase_Setup
	.DEFINE		C_TMB2_1024Hz			0x000c		// P_Timebase_Setup

//	Constants for system clock
	.DEFINE		C_Fosc_49M				0x0080		// P_SystemClock
	.DEFINE		C_Fosc_40M				0x0060		// P_SystemClock
	.DEFINE		C_Fosc_32M				0x0040		// P_SystemClock
	.DEFINE		C_Fosc_24M				0x0000		// P_SystemClock
	.DEFINE		C_Fosc_20M				0x0020		// P_SystemClock
									    
	.DEFINE		C_Fosc					0x0000		// P_SystemClock
	.DEFINE		C_Fosc_Div_2			0x0001		// P_SystemClock
	.DEFINE		C_Fosc_Div_4			0x0002		// P_SystemClock
	.DEFINE		C_Fosc_Div_8			0x0003		// P_SystemClock
	.DEFINE		C_Fosc_Div_16			0x0004		// P_SystemClock
	.DEFINE		C_Fosc_Div_32			0x0005		// P_SystemClock
	.DEFINE		C_Fosc_Div_64			0x0006		// P_SystemClock
	.DEFINE		C_Sleep					0x0007		// P_SystemClock

	.DEFINE		C_StrongMode			0x0008		// P_SystemClock
	.DEFINE		C_AutoMode				0x0000		// P_SystemClock
	.DEFINE		C_32K_Work				0x0010		// P_SystemClock
	.DEFINE		C_32K_Off				0x0000		// P_SystemClock

//	Constants for ADC & DAC
	.DEFINE		C_ADC_EN				0x0001		// P_ADC_Ctrl
	.DEFINE		C_ADC_DIS				0x0000		// P_ADC_Ctrl
	.DEFINE		C_MIC_RDY				0x8000		// P_ADC_Ctrl
	.DEFINE		C_MIC_EN				0x0000		// P_ADC_Ctrl
	.DEFINE		C_MIC_DIS				0x0002		// P_ADC_Ctrl
	.DEFINE		C_MIC_AGC_EN			0x0004		// P_ADC_Ctrl
	.DEFINE		C_MIC_AGC_DIS			0x0000		// P_ADC_Ctrl
	.DEFINE		C_VEXTREF_EN			0x0080		// P_ADC_Ctrl
	.DEFINE		C_VEXTREF_DIS			0x0000		// P_ADC_Ctrl
	.DEFINE		C_2V_EN					0x0100		// P_ADC_Ctrl
	.DEFINE		C_2V_DIS				0x0000		// P_ADC_Ctrl
	.DEFINE		C_DAC_3mA				0x0040		// P_ADC_Ctrl
	.DEFINE		C_DAC_2mA				0x0000		// P_ADC_Ctrl
										
	.DEFINE		C_ADC_MUX_MIC			0x0000		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA0			0x0001		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA1			0x0002		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA2			0x0003		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA3			0x0004		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA4			0x0005		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA5			0x0006		// P_ADC_MUX_Ctrl
	.DEFINE		C_ADC_MUX_IOA6			0x0007		// P_ADC_MUX_Ctrl
	.DEFINE		C_LINEIN_FAIL			0x4000		// P_ADC_MUX_Ctrl
	.DEFINE		C_LINEIN_RDY			0x8000		// P_ADC_MUX_Ctrl

	.DEFINE		C_DAC1_DIRECT			0x0000		// P_DAC_Ctrl
	.DEFINE		C_DAC1_LATCH_A			0x0080		// P_DAC_Ctrl
	.DEFINE		C_DAC1_LATCH_B			0x0100		// P_DAC_Ctrl
	.DEFINE		C_DAC1_LATCH_AB			0x0180		// P_DAC_Ctrl
	.DEFINE		C_DAC2_DIRECT			0x0000		// P_DAC_Ctrl
	.DEFINE		C_DAC2_LATCH_A			0x0020		// P_DAC_Ctrl
	.DEFINE		C_DAC2_LATCH_B			0x0040		// P_DAC_Ctrl
	.DEFINE		C_DAC2_LATCH_AB			0x0060		// P_DAC_Ctrl
	.DEFINE		C_MIC_DIRECT			0x0000		// P_DAC_Ctrl
	.DEFINE		C_MIC_LATCH_A			0x0008		// P_DAC_Ctrl
	.DEFINE		C_MIC_LATCH_B			0x0010		// P_DAC_Ctrl
	.DEFINE		C_MIC_LATCH_AB			0x0018		// P_DAC_Ctrl
	.DEFINE		C_DAC_DIS				0x0002		// P_DAC_Ctrl

//	Constants for SIO
	.DEFINE		C_SIO_CONFIG			0x0080		// P_SIO_Ctrl
	.DEFINE		C_SIO_READ				0x0000		// P_SIO_Ctrl
	.DEFINE		C_SIO_WRITE				0x0040		// P_SIO_Ctrl
	.DEFINE		C_SIO_CLOCK_32			0x0018		// P_SIO_Ctrl
	.DEFINE		C_SIO_CLOCK_16			0x0000		// P_SIO_Ctrl
	.DEFINE		C_SIO_CLOCK_8			0x0010		// P_SIO_Ctrl
	.DEFINE		C_SIO_ADDR_24			0x0003		// P_SIO_Ctrl
	.DEFINE		C_SIO_ADDR_16			0x0000		// P_SIO_Ctrl
	.DEFINE		C_SIO_ADDR_8			0x0002		// P_SIO_Ctrl
	.DEFINE		C_SIO_ADDR_NO			0x0001		// P_SIO_Ctrl

	.DEFINE		C_SIO_BUSY				0x0080		// P_SIO_Start

//	Constants for UART
	.DEFINE		C_UART_RX_INT			0x0080		// P_UART_Command1
	.DEFINE		C_UART_TX_INT			0x0040		// P_UART_Command1	
	.DEFINE		C_UART_RESET			0x0020		// P_UART_Command1	
	.DEFINE		C_UART_PARITY_EVEN		0x0008		// P_UART_Command1	
	.DEFINE		C_UART_PARITY_ODD		0x0000		// P_UART_Command1	
	.DEFINE		C_UART_PARITY_EN		0x0004		// P_UART_Command1	
	.DEFINE		C_UART_PARITY_DIS		0x0000		// P_UART_Command1	

	.DEFINE		C_UART_RX_RDY			0x0080		// P_UART_Command2
	.DEFINE		C_UART_TX_RDY			0x0040		// P_UART_Command2
	.DEFINE		C_UART_RX_EN			0x0080		// P_UART_Command2
	.DEFINE		C_UART_TX_EN			0x0040		// P_UART_Command2
	.DEFINE		C_UART_PE				0x0008		// P_UART_Command2
	.DEFINE		C_UART_OE				0x0010		// P_UART_Command2
	.DEFINE		C_UART_FE				0x0020		// P_UART_Command2

//	Constants for Feedback
	.DEFINE		C_FEEDBACK1_EN			0x0004		// P_Feedback
	.DEFINE		C_FEEDBACK2_EN			0x0008		// P_Feedback
	.DEFINE		C_IRTX_EN				0x0001		// P_Feedback

//	Constants for LVD
	.DEFINE		C_LVD33V				0x0002		// P_LVD_Ctrl
	.DEFINE		C_LVD29V				0x0001		// P_LVD_Ctrl

//	Other Constants
	.DEFINE		C_WDTCLR				0x0001		// P_Watchdog_Clear
	
///////////////////////////////////////////////////////////////////
//	Old definitions for LVD @'hardware.inc'
	.DEFINE		C_LVD24V				0x0000		// P_LVD_Ctrl
	.DEFINE		C_LVD28V				0x0001		// P_LVD_Ctrl
	.DEFINE		C_LVD32V				0x0002		// P_LVD_Ctrl
	.DEFINE		C_LVD36V				0x0003		// P_LVD_Ctrl

//	Old definitions for TimerA & TimerB @'hardware.inc'
	.DEFINE		C_Fosc_2				0x0000		// P_TimerA_Ctrl
	.DEFINE		C_Fosc_256		    	0x0001		// P_TimerA_Ctrl
	.DEFINE		C_32768Hz				0x0002		// P_TimerA_Ctrl
	.DEFINE		C_8192Hz				0x0003		// P_TimerA_Ctrl
	.DEFINE		C_4096Hz				0x0004		// P_TimerA_Ctrl
	.DEFINE		C_A1					0x0005		// P_TimerA_Ctrl
	.DEFINE		C_A0					0x0006		// P_TimerA_Ctrl
	.DEFINE		C_Ext1					0x0007		// P_TimerA_Ctrl

	.DEFINE		C_2048Hz				0x0000		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_1024Hz				0x0008		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_256Hz					0x0010		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_TMB1Hz				0x0018		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_4Hz					0x0020		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_2Hz					0x0028		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_B1					0x0030		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_Ext2					0x0038		// P_TimerA_Ctrl, P_TimerB_Ctrl

	.DEFINE		C_Off					0x0000		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D1					0x0040		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D2					0x0080		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D3					0x00C0		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D4					0x0100		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D5					0x0140		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D6					0x0180		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D7					0x01C0		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D8					0x0200		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D9					0x0240		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D10					0x0280		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D11					0x02C0		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D12					0x0300		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D13					0x0340		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_D14					0x0380		// P_TimerA_Ctrl, P_TimerB_Ctrl
	.DEFINE		C_TA_Div_2				0x03C0		// P_TimerA_Ctrl
	.DEFINE		C_TB_Div_2				0x03C0		// P_TimerB_Ctrl

//========================================================================================
// End of SPCE061A.inc
//========================================================================================
