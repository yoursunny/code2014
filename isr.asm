//======================================================
// 文件名称：	ISR.asm
// 功能描述：	语音录放的中断服务程序
//	功能描述：	将解码队列的语音资源送到DAC进行播放
//======================================================

.INCLUDE spce061a.inc
.include DVR.inc
.INCLUDE s480.inc

.TEXT
.PUBLIC _FIQ

_FIQ:
	push r1,r5 to [sp]
	//语音录放
	r1 = C_FIQ_TMA
	call F_FIQ_Service_SACM_DVR

	//S480解码
	r1 = C_FIQ_TMA
	test r1,[P_INT_Ctrl]
	jnz L_FIQ_TimerA
	r1 = C_FIQ_TMB
	test r1,[P_INT_Ctrl]
	jnz L_FIQ_TimerB
L_FIQ_PWM:
	r1 = C_FIQ_PWM
	[P_INT_Clear] = r1
	pop r1,r5 from [sp]
	reti
L_FIQ_TimerA:
	[P_INT_Clear] = r1
	call F_FIQ_Service_SACM_S480
	pop r1,r5 from [sp]
	reti
L_FIQ_TimerB:
	[P_INT_Clear] = r1
	pop r1,r5 from [sp]
	reti