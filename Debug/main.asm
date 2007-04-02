// GCC for SUNPLUS u'nSP version 1.0.21-3
// Command: D:\study\Sunplus\UNSPID~1.0\cc1.exe C:\DOCUME~1\ADMINI~1\LOCALS~1\Temp\ccoTaaaa.i -fkeep-inline-functions -quiet -dumpbase main.c -mglobal-var-iram -gstabs -Wall -o .\Debug/main.asm
	.external __sn_func_ptr_sec

// gcc2_compiled.:

.debug
	.dw '.stabs "D:/study/Sunplus/MMS/mms/",0x64,0,3,',0,0,offset Ltext0,seg Ltext0,0x0d,0x0a
.code
.debug
	.dw '.stabs "D:/study/Sunplus/MMS/mms/main.c",0x64,0,3,',0,0,offset Ltext0,seg Ltext0,0x0d,0x0a
.code
.code
Ltext0:
.debug
	.dw '.stabs "int:t1=r1;-32768;32767;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "char:t2=r2;0;127;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "long int:t3=r3;-2147483648;2147483647;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "unsigned int:t4=r4;0;65535;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "long unsigned int:t5=r5;0;4294967295;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "long long int:t6=r6;-2147483648;2147483647;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "long long unsigned int:t7=r7;0;4294967295;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "short int:t8=r8;-32768;32767;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "short unsigned int:t9=r9;0;65535;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "signed char:t10=r10;-32768;32767;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "unsigned char:t11=r11;0;65535;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "float:t12=r1;2;0;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "double:t13=r1;2;0;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "long double:t14=r1;2;0;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "complex int:t15=s2real:1,0,16;imag:1,16,16;;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "complex float:t16=r16;2;0;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "complex double:t17=r17;2;0;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "complex long double:t18=r18;2;0;",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "void:t19=19",128,0,0,0',0x0d,0x0a
.CODE
.code
.debug
	.dw '.stabs "Delay:F19",36,0,0,',0,0,offset _Delay,seg _Delay,0x0d,0x0a
.CODE
.public _Delay
_Delay:	.proc
.debug
	.dw '.stabn 0x44,0,10,',0,0
	.dd LM1-_Delay
	.dw 0x0d,0x0a
.code
LM1:
	// total=1, vars=1
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=1
	bp=sp+1

	R1=BP+4
.debug
	.dw '.stabn 0x44,0,11,',0,0
	.dd LM2-_Delay
	.dw 0x0d,0x0a
.code
LM2:
LBB2:
.debug
	.dw '.stabn 0x44,0,12,',0,0
	.dd LM3-_Delay
	.dw 0x0d,0x0a
.code
LM3:
	R2=0	// QImode move
	[BP]=R2	// QImode move
L3:
	R2=[BP]	// QImode move
	CMP R2,1000	// QImode compare
	NSJNA L6	//QImode LEU
	pc=L4	// Indirect jump
L6:
.debug
	.dw '.stabn 0x44,0,14,',0,0
	.dd LM4-_Delay
	.dw 0x0d,0x0a
.code
LM4:
	R2=1	// QImode move
	[28690]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,12,',0,0
	.dd LM5-_Delay
	.dw 0x0d,0x0a
.code
LM5:
L5:
	R2=[BP]	// QImode move
	R3=R2+1
	[BP]=R3	// QImode move
	pc=L3	// Indirect jump
L4:
.debug
	.dw '.stabn 0x44,0,16,',0,0
	.dd LM6-_Delay
	.dw 0x0d,0x0a
.code
LM6:
LBE2:
.debug
	.dw '.stabn 0x44,0,16,',0,0
	.dd LM7-_Delay
	.dw 0x0d,0x0a
.code
LM7:
L2:

	sp+=1
	pop bp from [sp]
	retf
	.endp	// end of Delay

.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB2-_Delay
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "uiCount:4",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE2-_Delay
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME1-_Delay
	.dw 0x0d,0x0a
.code
LME1:
.code
.debug
	.dw '.stabs "PlaySnd_Auto:F19",36,0,0,',0,0,offset _PlaySnd_Auto,seg _PlaySnd_Auto,0x0d,0x0a
.CODE
.public _PlaySnd_Auto
_PlaySnd_Auto:	.proc
.debug
	.dw '.stabn 0x44,0,19,',0,0
	.dd LM8-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM8:
	// total=1, vars=1
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=1
	bp=sp+1

	R1=BP+4
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,20,',0,0
	.dd LM9-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM9:
	R1=1	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_S480_Initial	// call with return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,21,',0,0
	.dd LM10-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM10:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=[BP]	// QImode move
	R3=[BP]	// QImode move
	R2=R3+1
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	R2=[BP]	// QImode move
	R1=[R2]	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_S480_Play	// call without return value
	SP = SP + 3	//SP
.debug
	.dw '.stabn 0x44,0,22,',0,0
	.dd LM11-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM11:
L9:
	call _SACM_S480_Status	// call with return value
	R2=R1&1
	CMP R2,0	// QImode test
	NSJNZ L11	//QImode NE
	pc=L10	// Indirect jump
L11:
.debug
	.dw '.stabn 0x44,0,24,',0,0
	.dd LM12-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM12:
	call _SACM_S480_ServiceLoop	// call without return value
.debug
	.dw '.stabn 0x44,0,25,',0,0
	.dd LM13-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM13:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,26,',0,0
	.dd LM14-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM14:
	pc=L9	// Indirect jump
L10:
.debug
	.dw '.stabn 0x44,0,27,',0,0
	.dd LM15-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM15:
	call _SACM_S480_Stop	// call without return value
.debug
	.dw '.stabn 0x44,0,28,',0,0
	.dd LM16-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM16:
.debug
	.dw '.stabn 0x44,0,28,',0,0
	.dd LM17-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LM17:
L8:

	sp+=1
	pop bp from [sp]
	retf
	.endp	// end of PlaySnd_Auto

.debug
	.dw '.stabs "uiSndIndex:p4",160,0,0,4',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "uiDAC_Channel:p4",160,0,0,5',0x0d,0x0a
.CODE
.debug
	.dw '.stabf ',0,0
	.dd LME2-_PlaySnd_Auto
	.dw 0x0d,0x0a
.code
LME2:
.code
.debug
	.dw '.stabs "PlayRecord:F19",36,0,0,',0,0,offset _PlayRecord,seg _PlayRecord,0x0d,0x0a
.CODE
.public _PlayRecord
_PlayRecord:	.proc
.debug
	.dw '.stabn 0x44,0,31,',0,0
	.dd LM18-_PlayRecord
	.dw 0x0d,0x0a
.code
LM18:
	// total=10, vars=10
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=10
	bp=sp+1

	R1=BP+13
	[bp+5]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,32,',0,0
	.dd LM19-_PlayRecord
	.dw 0x0d,0x0a
.code
LM19:
LBB3:
.debug
	.dw '.stabn 0x44,0,35,',0,0
	.dd LM20-_PlayRecord
	.dw 0x0d,0x0a
.code
LM20:
	R1=0	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_DVR_Initial	// call with return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,36,',0,0
	.dd LM21-_PlayRecord
	.dw 0x0d,0x0a
.code
LM21:
	call _SACM_DVR_InitQueue	// call without return value
.debug
	.dw '.stabn 0x44,0,37,',0,0
	.dd LM22-_PlayRecord
	.dw 0x0d,0x0a
.code
LM22:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_DVR_InitDecoder	// call without return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,39,',0,0
	.dd LM23-_PlayRecord
	.dw 0x0d,0x0a
.code
LM23:
	//split R1, 47105
	R1=47105	// QImode move
	R2=0	// QImode move
	//split [BP], R1
	[BP]=R1	// QImode move
	[bp+1]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,40,',0,0
	.dd LM24-_PlayRecord
	.dw 0x0d,0x0a
.code
LM24:
	R1=BP	// QImode move
	R2=BP+2
	[bp+6]=R2	// QImode move
	R1=(-18432)	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_ReadWord	// call with return value
	SP = SP + 1	//SP
	R3=R1
	R4=0
	R1=[bp+6]	// QImode move
	//split [R1], R3
	[R1++]=R3	// QImode move
	[R1--]=R4	// QImode move
.debug
	.dw '.stabn 0x44,0,42,',0,0
	.dd LM25-_PlayRecord
	.dw 0x0d,0x0a
.code
LM25:
L14:
	pc=L16	// Indirect jump
	pc=L15	// Indirect jump
L16:
.debug
	.dw '.stabn 0x44,0,44,',0,0
	.dd LM26-_PlayRecord
	.dw 0x0d,0x0a
.code
LM26:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,45,',0,0
	.dd LM27-_PlayRecord
	.dw 0x0d,0x0a
.code
LM27:
L17:
	call _SACM_DVR_TestQueue	// call with return value
	CMP R1,1	// QImode compare
	NSJNZ L19	//QImode NE
	pc=L18	// Indirect jump
L19:
.debug
	.dw '.stabn 0x44,0,47,',0,0
	.dd LM28-_PlayRecord
	.dw 0x0d,0x0a
.code
LM28:
	R1=[BP]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_ReadWord	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+4
	R2=R3	// QImode move
	[R2]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,48,',0,0
	.dd LM29-_PlayRecord
	.dw 0x0d,0x0a
.code
LM29:
	R1=BP	// QImode move
	R2=BP+4
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_DVR_FillQueue	// call without return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,49,',0,0
	.dd LM30-_PlayRecord
	.dw 0x0d,0x0a
.code
LM30:
	//split R1, [BP]
	R1=[BP]	// QImode move
	R2=[bp+1]	// QImode move
	R3=R1+1	// HImode RD=RS+#IMM16
	R4=R2+0, Carry
	//split [BP], R3
	[BP]=R3	// QImode move
	[bp+1]=R4	// QImode move
.debug
	.dw '.stabn 0x44,0,50,',0,0
	.dd LM31-_PlayRecord
	.dw 0x0d,0x0a
.code
LM31:
	R1=BP	// QImode move
	R4=BP+2
	[bp+9]=R4	// QImode move
	//split R1, [BP]
	R1=[BP]	// QImode move
	R2=[bp+1]	// QImode move
	//split [bp+7], R1
	[bp+7]=R1	// QImode move
	[bp+8]=R2	// QImode move
	R3=[bp+9]	// QImode move
	//split R1, [R3]
	R1=[R3++]	// QImode move
	R2=[R3--]	// QImode move
	//split R3, [bp+7]
	R3=[bp+7]	// QImode move
	R4=[bp+8]	// QImode move
	CMP R4,R2	// HImode 1st compare
	JA  L26	// HImode LEU
	NSJNZ L20
	CMP R3,R1
	NSJNA  L20
L26:
	pc=L18	// Indirect jump
L20:
.debug
	.dw '.stabn 0x44,0,51,',0,0
	.dd LM32-_PlayRecord
	.dw 0x0d,0x0a
.code
LM32:
	pc=L17	// Indirect jump
L18:
.debug
	.dw '.stabn 0x44,0,52,',0,0
	.dd LM33-_PlayRecord
	.dw 0x0d,0x0a
.code
LM33:
	call _SACM_DVR_Status	// call with return value
	R2=R1&1
	CMP R2,0	// QImode test
	NSJZ L22	//QImode EQ
	R2=[28672]	// QImode move
	R1=R2&2
	CMP R1,0	// QImode test
	NSJNZ L22	//QImode NE
	pc=L21	// Indirect jump
L22:
.debug
	.dw '.stabn 0x44,0,54,',0,0
	.dd LM34-_PlayRecord
	.dw 0x0d,0x0a
.code
LM34:
	call _SACM_DVR_Stop	// call without return value
.debug
	.dw '.stabn 0x44,0,55,',0,0
	.dd LM35-_PlayRecord
	.dw 0x0d,0x0a
.code
LM35:
	pc=L15	// Indirect jump
.debug
	.dw '.stabn 0x44,0,56,',0,0
	.dd LM36-_PlayRecord
	.dw 0x0d,0x0a
.code
LM36:
	pc=L23	// Indirect jump
L21:
.debug
	.dw '.stabn 0x44,0,58,',0,0
	.dd LM37-_PlayRecord
	.dw 0x0d,0x0a
.code
LM37:
	call _SACM_DVR_Decoder	// call without return value
L23:
.debug
	.dw '.stabn 0x44,0,59,',0,0
	.dd LM38-_PlayRecord
	.dw 0x0d,0x0a
.code
LM38:
	pc=L14	// Indirect jump
L15:
.debug
	.dw '.stabn 0x44,0,60,',0,0
	.dd LM39-_PlayRecord
	.dw 0x0d,0x0a
.code
LM39:
LBE3:
.debug
	.dw '.stabn 0x44,0,60,',0,0
	.dd LM40-_PlayRecord
	.dw 0x0d,0x0a
.code
LM40:
L13:

	sp+=10
	pop bp from [sp]
	retf
	.endp	// end of PlayRecord

.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB3-_PlayRecord
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "Addr:5",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "EndAddr:5",128,0,0,2',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "Ret:4",128,0,0,4',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE3-_PlayRecord
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME3-_PlayRecord
	.dw 0x0d,0x0a
.code
LME3:
.code
.debug
	.dw '.stabs "Record:F19",36,0,0,',0,0,offset _Record,seg _Record,0x0d,0x0a
.CODE
.public _Record
_Record:	.proc
.debug
	.dw '.stabn 0x44,0,63,',0,0
	.dd LM41-_Record
	.dw 0x0d,0x0a
.code
LM41:
	// total=4, vars=4
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=4
	bp=sp+1

	R1=BP+7
	[bp+2]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,64,',0,0
	.dd LM42-_Record
	.dw 0x0d,0x0a
.code
LM42:
LBB4:
.debug
	.dw '.stabn 0x44,0,67,',0,0
	.dd LM43-_Record
	.dw 0x0d,0x0a
.code
LM43:
	R1=(-18432)	// QImode move
	[BP]=R1	// QImode move
L30:
	R1=[BP]	// QImode move
	CMP R1,(-1025)	// QImode compare
	NSJNA L33	//QImode LEU
	pc=L31	// Indirect jump
L33:
.debug
	.dw '.stabn 0x44,0,69,',0,0
	.dd LM44-_Record
	.dw 0x0d,0x0a
.code
LM44:
	R1=[BP]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_Erase	// call without return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,70,',0,0
	.dd LM45-_Record
	.dw 0x0d,0x0a
.code
LM45:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,67,',0,0
	.dd LM46-_Record
	.dw 0x0d,0x0a
.code
LM46:
L32:
	R1=[BP]	// QImode move
	R2=R1+256
	[BP]=R2	// QImode move
	pc=L30	// Indirect jump
L31:
.debug
	.dw '.stabn 0x44,0,73,',0,0
	.dd LM47-_Record
	.dw 0x0d,0x0a
.code
LM47:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	call _PlaySnd_Auto	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,75,',0,0
	.dd LM48-_Record
	.dw 0x0d,0x0a
.code
LM48:
	R1=0	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_DVR_Initial	// call with return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,76,',0,0
	.dd LM49-_Record
	.dw 0x0d,0x0a
.code
LM49:
	call _SACM_DVR_InitQueue	// call without return value
.debug
	.dw '.stabn 0x44,0,77,',0,0
	.dd LM50-_Record
	.dw 0x0d,0x0a
.code
LM50:
	R1=0	// QImode move
	[SP--]=R1	// QImode move
	R1=0	// QImode move
	[SP--]=R1	// QImode move
	call _SACM_DVR_InitEncoder	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,79,',0,0
	.dd LM51-_Record
	.dw 0x0d,0x0a
.code
LM51:
	R1=(-18431)	// QImode move
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,80,',0,0
	.dd LM52-_Record
	.dw 0x0d,0x0a
.code
LM52:
L34:
	pc=L36	// Indirect jump
	pc=L35	// Indirect jump
L36:
.debug
	.dw '.stabn 0x44,0,82,',0,0
	.dd LM53-_Record
	.dw 0x0d,0x0a
.code
LM53:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,83,',0,0
	.dd LM54-_Record
	.dw 0x0d,0x0a
.code
LM54:
	call _SACM_DVR_Encoder	// call without return value
.debug
	.dw '.stabn 0x44,0,84,',0,0
	.dd LM55-_Record
	.dw 0x0d,0x0a
.code
LM55:
	call _SACM_DVR_TestQueue	// call with return value
	CMP R1,2	// QImode compare
	NSJZ L37	//QImode EQ
.debug
	.dw '.stabn 0x44,0,86,',0,0
	.dd LM56-_Record
	.dw 0x0d,0x0a
.code
LM56:
	R1=BP	// QImode move
	R2=BP+1
	[bp+3]=R2	// QImode move
	call _SACM_DVR_FetchQueue	// call with return value
	R3=[bp+3]	// QImode move
	[R3]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,87,',0,0
	.dd LM57-_Record
	.dw 0x0d,0x0a
.code
LM57:
	R1=BP	// QImode move
	R2=BP+1
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	R1=[BP]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_WriteWord	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,88,',0,0
	.dd LM58-_Record
	.dw 0x0d,0x0a
.code
LM58:
	R1=[BP]	// QImode move
	R2=R1+1
	[BP]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,89,',0,0
	.dd LM59-_Record
	.dw 0x0d,0x0a
.code
LM59:
	R1=[BP]	// QImode move
	CMP R1,(-1025)	// QImode compare
	NSJA L39	//QImode GTU
	R2=[28672]	// QImode move
	R1=R2&2
	CMP R1,0	// QImode test
	NSJNZ L39	//QImode NE
	pc=L37	// Indirect jump
L39:
.debug
	.dw '.stabn 0x44,0,91,',0,0
	.dd LM60-_Record
	.dw 0x0d,0x0a
.code
LM60:
	R2=[BP]	// QImode move
	R1=R2+(-1)
	[SP--]=R1	// QImode move
	R1=(-18432)	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_WriteWord	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,92,',0,0
	.dd LM61-_Record
	.dw 0x0d,0x0a
.code
LM61:
	call _SACM_DVR_Stop	// call without return value
.debug
	.dw '.stabn 0x44,0,93,',0,0
	.dd LM62-_Record
	.dw 0x0d,0x0a
.code
LM62:
	pc=L35	// Indirect jump
L38:
L37:
.debug
	.dw '.stabn 0x44,0,96,',0,0
	.dd LM63-_Record
	.dw 0x0d,0x0a
.code
LM63:
	pc=L34	// Indirect jump
L35:
.debug
	.dw '.stabn 0x44,0,97,',0,0
	.dd LM64-_Record
	.dw 0x0d,0x0a
.code
LM64:
LBE4:
.debug
	.dw '.stabn 0x44,0,97,',0,0
	.dd LM65-_Record
	.dw 0x0d,0x0a
.code
LM65:
L29:

	sp+=4
	pop bp from [sp]
	retf
	.endp	// end of Record

.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB4-_Record
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "Addr:4",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "Ret:4",128,0,0,1',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE4-_Record
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME4-_Record
	.dw 0x0d,0x0a
.code
LME4:
.code
.debug
	.dw '.stabs "Ebit:F1",36,0,0,',0,0,offset _Ebit,seg _Ebit,0x0d,0x0a
.CODE
.public _Ebit
_Ebit:	.proc
.debug
	.dw '.stabn 0x44,0,101,',0,0
	.dd LM66-_Ebit
	.dw 0x0d,0x0a
.code
LM66:
	// total=1, vars=1
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=1
	bp=sp+1

	R2=BP+4
.debug
	.dw '.stabn 0x44,0,102,',0,0
	.dd LM67-_Ebit
	.dw 0x0d,0x0a
.code
LM67:
LBB5:
	R1=0	// QImode move
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,103,',0,0
	.dd LM68-_Ebit
	.dw 0x0d,0x0a
.code
LM68:
	R3=R2	// QImode move
	R3=[R3]	// QImode move
	R1=R3&1
	CMP R1,0	// QImode test
	NSJZ L45	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L45:
.debug
	.dw '.stabn 0x44,0,104,',0,0
	.dd LM69-_Ebit
	.dw 0x0d,0x0a
.code
LM69:
	R4=R2	// QImode move
	R4=[R4]	// QImode move
	R1=R4&2
	CMP R1,0	// QImode test
	NSJZ L46	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L46:
.debug
	.dw '.stabn 0x44,0,105,',0,0
	.dd LM70-_Ebit
	.dw 0x0d,0x0a
.code
LM70:
	R3=R2	// QImode move
	R3=[R3]	// QImode move
	R1=R3&4
	CMP R1,0	// QImode test
	NSJZ L47	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L47:
.debug
	.dw '.stabn 0x44,0,106,',0,0
	.dd LM71-_Ebit
	.dw 0x0d,0x0a
.code
LM71:
	R4=R2	// QImode move
	R4=[R4]	// QImode move
	R1=R4&8
	CMP R1,0	// QImode test
	NSJZ L48	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L48:
.debug
	.dw '.stabn 0x44,0,107,',0,0
	.dd LM72-_Ebit
	.dw 0x0d,0x0a
.code
LM72:
	R3=R2	// QImode move
	R3=[R3]	// QImode move
	R1=R3&16
	CMP R1,0	// QImode test
	NSJZ L49	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L49:
.debug
	.dw '.stabn 0x44,0,108,',0,0
	.dd LM73-_Ebit
	.dw 0x0d,0x0a
.code
LM73:
	R4=R2	// QImode move
	R4=[R4]	// QImode move
	R1=R4&32
	CMP R1,0	// QImode test
	NSJZ L50	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L50:
.debug
	.dw '.stabn 0x44,0,109,',0,0
	.dd LM74-_Ebit
	.dw 0x0d,0x0a
.code
LM74:
	R3=R2	// QImode move
	R3=[R3]	// QImode move
	R1=R3&64
	CMP R1,0	// QImode test
	NSJZ L51	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L51:
.debug
	.dw '.stabn 0x44,0,110,',0,0
	.dd LM75-_Ebit
	.dw 0x0d,0x0a
.code
LM75:
	R4=R2	// QImode move
	R4=[R4]	// QImode move
	R1=R4&128
	CMP R1,0	// QImode test
	NSJZ L52	//QImode EQ
	R1=[BP]	// QImode move
	R3=R1+1
	[BP]=R3	// QImode move
L52:
.debug
	.dw '.stabn 0x44,0,111,',0,0
	.dd LM76-_Ebit
	.dw 0x0d,0x0a
.code
LM76:
	R1=[BP]	// QImode move
	R3=R1 lsl 4
	R3=R3 lsl 4
	R1=R2	// QImode move
	R3|=[R1]	// iorqi3_r0R
	R3=R3&511
	R1=R3	// QImode move
	pc=L44	// Indirect jump
.debug
	.dw '.stabn 0x44,0,112,',0,0
	.dd LM77-_Ebit
	.dw 0x0d,0x0a
.code
LM77:
LBE5:
.debug
	.dw '.stabn 0x44,0,112,',0,0
	.dd LM78-_Ebit
	.dw 0x0d,0x0a
.code
LM78:
L44:

	sp+=1
	pop bp from [sp]
	retf
	.endp	// end of Ebit

.debug
	.dw '.stabs "n:p4",160,0,0,4',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB5-_Ebit
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "count:4",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE5-_Ebit
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME5-_Ebit
	.dw 0x0d,0x0a
.code
LME5:
.code
.debug
	.dw '.stabs "Send:F1",36,0,0,',0,0,offset _Send,seg _Send,0x0d,0x0a
.CODE
.public _Send
_Send:	.proc
.debug
	.dw '.stabn 0x44,0,121,',0,0
	.dd LM79-_Send
	.dw 0x0d,0x0a
.code
LM79:
	// total=12, vars=12
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=12
	bp=sp+1

	R1=BP+15
	[bp+9]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,122,',0,0
	.dd LM80-_Send
	.dw 0x0d,0x0a
.code
LM80:
LBB6:
.debug
	.dw '.stabn 0x44,0,131,',0,0
	.dd LM81-_Send
	.dw 0x0d,0x0a
.code
LM81:
	R1=(-18432)	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_ReadWord	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+1
	R2=R3	// QImode move
	[R2]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,132,',0,0
	.dd LM82-_Send
	.dw 0x0d,0x0a
.code
LM82:
	R1=BP	// QImode move
	R2=BP+1
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,(-1)	// QImode compare
	NSJNZ L62	//QImode NE
	R1=4	// QImode move
	pc=L61	// Indirect jump
L62:
.debug
	.dw '.stabn 0x44,0,134,',0,0
	.dd LM83-_Send
	.dw 0x0d,0x0a
.code
LM83:
	R1=(-1)	// QImode move
	[28679]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,135,',0,0
	.dd LM84-_Send
	.dw 0x0d,0x0a
.code
LM84:
	R1=(-1)	// QImode move
	[28680]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,137,',0,0
	.dd LM85-_Send
	.dw 0x0d,0x0a
.code
LM85:
	R1=(-12394)	// QImode move
	[28677]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,138,',0,0
	.dd LM86-_Send
	.dw 0x0d,0x0a
.code
LM86:
	R1=BP	// QImode move
	R2=BP+7
	R1=0	// QImode move
	R4=R2	// QImode move
	[R4]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,139,',0,0
	.dd LM87-_Send
	.dw 0x0d,0x0a
.code
LM87:
L63:
	pc=L65	// Indirect jump
	pc=L64	// Indirect jump
L65:
.debug
	.dw '.stabn 0x44,0,141,',0,0
	.dd LM88-_Send
	.dw 0x0d,0x0a
.code
LM88:
	R1=BP	// QImode move
	R2=BP+7
	R3=BP	// QImode move
	R1=BP+7
	R2=BP	// QImode move
	R3=BP+7
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+1
	R2=R1	// QImode move
	[R2]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,142,',0,0
	.dd LM89-_Send
	.dw 0x0d,0x0a
.code
LM89:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,143,',0,0
	.dd LM90-_Send
	.dw 0x0d,0x0a
.code
LM90:
	R1=BP	// QImode move
	R2=BP+7
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,3000	// QImode compare
	NSJNA L66	//QImode LEU
.debug
	.dw '.stabn 0x44,0,145,',0,0
	.dd LM91-_Send
	.dw 0x0d,0x0a
.code
LM91:
	R1=1	// QImode move
	pc=L61	// Indirect jump
L66:
.debug
	.dw '.stabn 0x44,0,147,',0,0
	.dd LM92-_Send
	.dw 0x0d,0x0a
.code
LM92:
	R2=[28672]	// QImode move
	R1=R2&(-256)
	CMP R1,(-1024)	// QImode compare
	NSJNZ L67	//QImode NE
	pc=L64	// Indirect jump
L67:
.debug
	.dw '.stabn 0x44,0,148,',0,0
	.dd LM93-_Send
	.dw 0x0d,0x0a
.code
LM93:
	pc=L63	// Indirect jump
L64:
.debug
	.dw '.stabn 0x44,0,150,',0,0
	.dd LM94-_Send
	.dw 0x0d,0x0a
.code
LM94:
	R1=(-18432)	// QImode move
	[BP]=R1	// QImode move
L68:
	R1=BP	// QImode move
	R2=BP+1
	R1=[BP]	// QImode move
	R4=R2	// QImode move
	CMP R1,[R4]	// QImode compare
	NSJNA L71	//QImode LEU
	pc=L69	// Indirect jump
L71:
.debug
	.dw '.stabn 0x44,0,152,',0,0
	.dd LM95-_Send
	.dw 0x0d,0x0a
.code
LM95:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,154,',0,0
	.dd LM96-_Send
	.dw 0x0d,0x0a
.code
LM96:
	R1=[BP]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_ReadWord	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+2
	R2=R3	// QImode move
	[R2]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,164,',0,0
	.dd LM97-_Send
	.dw 0x0d,0x0a
.code
LM97:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,165,',0,0
	.dd LM98-_Send
	.dw 0x0d,0x0a
.code
LM98:
	R2=BP	// QImode move
	R1=BP+3
	R3=[BP]	// QImode move
	R2=R3 lsr 4
	R2=R2 lsr 4
	R4=R2&255
	R3=R1	// QImode move
	[R3]=R4	// QImode move
.debug
	.dw '.stabn 0x44,0,166,',0,0
	.dd LM99-_Send
	.dw 0x0d,0x0a
.code
LM99:
	R1=BP	// QImode move
	R2=BP+3
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+3
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R2|=R1
	R1=R2	// QImode move
	[28677]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,167,',0,0
	.dd LM100-_Send
	.dw 0x0d,0x0a
.code
LM100:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,168,',0,0
	.dd LM101-_Send
	.dw 0x0d,0x0a
.code
LM101:
	R1=BP	// QImode move
	R2=BP+4
	R3=[BP]	// QImode move
	R4=R3&255
	R3=R2	// QImode move
	[R3]=R4	// QImode move
.debug
	.dw '.stabn 0x44,0,169,',0,0
	.dd LM102-_Send
	.dw 0x0d,0x0a
.code
LM102:
	R1=BP	// QImode move
	R2=BP+4
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+4
	R1=R1|4096
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R2|=R1
	[28677]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,170,',0,0
	.dd LM103-_Send
	.dw 0x0d,0x0a
.code
LM103:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,171,',0,0
	.dd LM104-_Send
	.dw 0x0d,0x0a
.code
LM104:
	R2=BP	// QImode move
	R1=BP+5
	R2=BP	// QImode move
	R3=BP+2
	R2=R3	// QImode move
	R4=[R2]	// QImode move
	R2=R4 lsr 4
	R2=R2 lsr 4
	R4=R2&255
	R3=R1	// QImode move
	[R3]=R4	// QImode move
.debug
	.dw '.stabn 0x44,0,172,',0,0
	.dd LM105-_Send
	.dw 0x0d,0x0a
.code
LM105:
	R1=BP	// QImode move
	R2=BP+5
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+5
	R1=R1|8192
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R2|=R1
	[28677]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,173,',0,0
	.dd LM106-_Send
	.dw 0x0d,0x0a
.code
LM106:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,174,',0,0
	.dd LM107-_Send
	.dw 0x0d,0x0a
.code
LM107:
	R2=BP	// QImode move
	R1=BP+6
	R2=BP	// QImode move
	R3=BP+2
	R2=R3	// QImode move
	R2=[R2]	// QImode move
	R4=R2&255
	R2=R1	// QImode move
	[R2]=R4	// QImode move
.debug
	.dw '.stabn 0x44,0,175,',0,0
	.dd LM108-_Send
	.dw 0x0d,0x0a
.code
LM108:
	R1=BP	// QImode move
	R2=BP+6
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R2=BP	// QImode move
	R3=BP+6
	R1=R1|12288
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R2|=R1
	[28677]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,176,',0,0
	.dd LM109-_Send
	.dw 0x0d,0x0a
.code
LM109:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,177,',0,0
	.dd LM110-_Send
	.dw 0x0d,0x0a
.code
LM110:
	R2=BP	// QImode move
	R1=BP+8
	R2=BP	// QImode move
	R3=BP+3
	R2=R3	// QImode move
	R2=[R2]	// QImode move
	R2=R2&34
	[bp+10]=R2	// QImode move
	R3=[bp+10]	// QImode move
	R2=R3 lsl 3
	R3=BP	// QImode move
	R4=BP+4
	[bp+10]=R4	// QImode move
	R3=[bp+10]	// QImode move
	R3=[R3]	// QImode move
	R3=R3&34
	[bp+11]=R3	// QImode move
	R3=[bp+11]	// QImode move
	R4=R3 lsl 2
	R2|=R4
	R3=BP	// QImode move
	R4=BP+5
	[bp+10]=R4	// QImode move
	R3=[bp+10]	// QImode move
	R3=[R3]	// QImode move
	R3=R3&34
	[bp+11]=R3	// QImode move
	R3=[bp+11]	// QImode move
	R4=R3 lsl 1
	R2|=R4
	R3=BP	// QImode move
	R4=BP+6
	[bp+10]=R4	// QImode move
	R3=[bp+10]	// QImode move
	R3=[R3]	// QImode move
	R3=R3&34
	[bp+11]=R3	// QImode move
	R3=R2	// QImode move
	R4=[bp+11]	// QImode move
	R3|=R4
	R4=R1	// QImode move
	[R4]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,178,',0,0
	.dd LM111-_Send
	.dw 0x0d,0x0a
.code
LM111:
	R1=BP	// QImode move
	R2=BP+8
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R2=R1|(-8704)
	[28677]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,180,',0,0
	.dd LM112-_Send
	.dw 0x0d,0x0a
.code
LM112:
	R1=BP	// QImode move
	R2=BP+7
	R1=0	// QImode move
	R3=R2	// QImode move
	[R3]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,181,',0,0
	.dd LM113-_Send
	.dw 0x0d,0x0a
.code
LM113:
L72:
	pc=L74	// Indirect jump
	pc=L70	// Indirect jump
L74:
.debug
	.dw '.stabn 0x44,0,183,',0,0
	.dd LM114-_Send
	.dw 0x0d,0x0a
.code
LM114:
	R1=BP	// QImode move
	R2=BP+7
	R3=BP	// QImode move
	R1=BP+7
	R2=BP	// QImode move
	R3=BP+7
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+1
	R2=R1	// QImode move
	[R2]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,184,',0,0
	.dd LM115-_Send
	.dw 0x0d,0x0a
.code
LM115:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,185,',0,0
	.dd LM116-_Send
	.dw 0x0d,0x0a
.code
LM116:
	R1=BP	// QImode move
	R2=BP+7
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,1000	// QImode compare
	NSJNA L75	//QImode LEU
.debug
	.dw '.stabn 0x44,0,187,',0,0
	.dd LM117-_Send
	.dw 0x0d,0x0a
.code
LM117:
	R1=2	// QImode move
	pc=L61	// Indirect jump
.debug
	.dw '.stabn 0x44,0,188,',0,0
	.dd LM118-_Send
	.dw 0x0d,0x0a
.code
LM118:
	pc=L70	// Indirect jump
L75:
.debug
	.dw '.stabn 0x44,0,190,',0,0
	.dd LM119-_Send
	.dw 0x0d,0x0a
.code
LM119:
	R1=BP	// QImode move
	R2=BP+2
	R1=[28672]	// QImode move
	R3=R1&(-256)
	R4=R2	// QImode move
	[R4]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,191,',0,0
	.dd LM120-_Send
	.dw 0x0d,0x0a
.code
LM120:
	R1=BP	// QImode move
	R2=BP+2
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	CMP R1,(-27136)	// QImode compare
	NSJNZ L76	//QImode NE
	pc=L70	// Indirect jump
L76:
.debug
	.dw '.stabn 0x44,0,192,',0,0
	.dd LM121-_Send
	.dw 0x0d,0x0a
.code
LM121:
	R1=BP	// QImode move
	R2=BP+2
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,(-24832)	// QImode compare
	NSJNZ L77	//QImode NE
.debug
	.dw '.stabn 0x44,0,194,',0,0
	.dd LM122-_Send
	.dw 0x0d,0x0a
.code
LM122:
	R1=[BP]	// QImode move
	R2=R1+(-1)
	[BP]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,195,',0,0
	.dd LM123-_Send
	.dw 0x0d,0x0a
.code
LM123:
	pc=L70	// Indirect jump
L77:
.debug
	.dw '.stabn 0x44,0,197,',0,0
	.dd LM124-_Send
	.dw 0x0d,0x0a
.code
LM124:
	pc=L72	// Indirect jump
L73:
.debug
	.dw '.stabn 0x44,0,150,',0,0
	.dd LM125-_Send
	.dw 0x0d,0x0a
.code
LM125:
L70:
	R1=[BP]	// QImode move
	R2=R1+1
	[BP]=R2	// QImode move
	pc=L68	// Indirect jump
L69:
.debug
	.dw '.stabn 0x44,0,201,',0,0
	.dd LM126-_Send
	.dw 0x0d,0x0a
.code
LM126:
	R1=(-20586)	// QImode move
	[28677]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,202,',0,0
	.dd LM127-_Send
	.dw 0x0d,0x0a
.code
LM127:
L78:
	pc=L80	// Indirect jump
	pc=L79	// Indirect jump
L80:
.debug
	.dw '.stabn 0x44,0,204,',0,0
	.dd LM128-_Send
	.dw 0x0d,0x0a
.code
LM128:
	R1=BP	// QImode move
	R2=BP+7
	R3=BP	// QImode move
	R1=BP+7
	R2=BP	// QImode move
	R3=BP+7
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+1
	R2=R1	// QImode move
	[R2]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,205,',0,0
	.dd LM129-_Send
	.dw 0x0d,0x0a
.code
LM129:
	call _Delay	// call without return value
.debug
	.dw '.stabn 0x44,0,206,',0,0
	.dd LM130-_Send
	.dw 0x0d,0x0a
.code
LM130:
	R1=BP	// QImode move
	R2=BP+7
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,1000	// QImode compare
	NSJNA L81	//QImode LEU
.debug
	.dw '.stabn 0x44,0,208,',0,0
	.dd LM131-_Send
	.dw 0x0d,0x0a
.code
LM131:
	R1=3	// QImode move
	pc=L61	// Indirect jump
L81:
.debug
	.dw '.stabn 0x44,0,210,',0,0
	.dd LM132-_Send
	.dw 0x0d,0x0a
.code
LM132:
	R2=[28672]	// QImode move
	R1=R2&(-256)
	CMP R1,(-1536)	// QImode compare
	NSJNZ L82	//QImode NE
	pc=L79	// Indirect jump
L82:
.debug
	.dw '.stabn 0x44,0,211,',0,0
	.dd LM133-_Send
	.dw 0x0d,0x0a
.code
LM133:
	pc=L78	// Indirect jump
L79:
.debug
	.dw '.stabn 0x44,0,212,',0,0
	.dd LM134-_Send
	.dw 0x0d,0x0a
.code
LM134:
	R1=0	// QImode move
	pc=L61	// Indirect jump
.debug
	.dw '.stabn 0x44,0,213,',0,0
	.dd LM135-_Send
	.dw 0x0d,0x0a
.code
LM135:
LBE6:
.debug
	.dw '.stabn 0x44,0,213,',0,0
	.dd LM136-_Send
	.dw 0x0d,0x0a
.code
LM136:
L61:

	sp+=12
	pop bp from [sp]
	retf
	.endp	// end of Send

.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB6-_Send
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "Addr:4",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "EndAddr:4",128,0,0,1',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "Ret:4",128,0,0,2',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "addrH:4",128,0,0,3',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "addrL:4",128,0,0,4',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "dataH:4",128,0,0,5',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "dataL:4",128,0,0,6',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "i:4",128,0,0,7',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "k:4",128,0,0,8',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE6-_Send
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME6-_Send
	.dw 0x0d,0x0a
.code
LME6:
.code
.debug
	.dw '.stabs "Accept:F1",36,0,0,',0,0,offset _Accept,seg _Accept,0x0d,0x0a
.CODE
.public _Accept
_Accept:	.proc
.debug
	.dw '.stabn 0x44,0,221,',0,0
	.dd LM137-_Accept
	.dw 0x0d,0x0a
.code
LM137:
	// total=13, vars=13
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=13
	bp=sp+1

	R1=BP+16
	[bp+10]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,222,',0,0
	.dd LM138-_Accept
	.dw 0x0d,0x0a
.code
LM138:
LBB7:
.debug
	.dw '.stabn 0x44,0,223,',0,0
	.dd LM139-_Accept
	.dw 0x0d,0x0a
.code
LM139:
	R1=BP	// QImode move
	R2=BP+1
	R1=0	// QImode move
	R3=R2	// QImode move
	[R3]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,232,',0,0
	.dd LM140-_Accept
	.dw 0x0d,0x0a
.code
LM140:
	R1=BP	// QImode move
	R2=BP+9
	R1=0	// QImode move
	R4=R2	// QImode move
	[R4]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,234,',0,0
	.dd LM141-_Accept
	.dw 0x0d,0x0a
.code
LM141:
	R1=[28677]	// QImode move
	CMP R1,(-12394)	// QImode compare
	NSJZ L93	//QImode EQ
	R1=1	// QImode move
	pc=L92	// Indirect jump
L93:
.debug
	.dw '.stabn 0x44,0,236,',0,0
	.dd LM142-_Accept
	.dw 0x0d,0x0a
.code
LM142:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=2	// QImode move
	[SP--]=R1	// QImode move
	call _PlaySnd_Auto	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,238,',0,0
	.dd LM143-_Accept
	.dw 0x0d,0x0a
.code
LM143:
	R1=BP	// QImode move
	R2=BP+6
	R1=(-18432)	// QImode move
	R3=R2	// QImode move
	[R3]=R1	// QImode move
L94:
	R1=BP	// QImode move
	R2=BP+6
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	CMP R1,(-1025)	// QImode compare
	NSJNA L97	//QImode LEU
	pc=L95	// Indirect jump
L97:
.debug
	.dw '.stabn 0x44,0,240,',0,0
	.dd LM144-_Accept
	.dw 0x0d,0x0a
.code
LM144:
	R1=BP	// QImode move
	R2=BP+6
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_Erase	// call without return value
	SP = SP + 1	//SP
.debug
	.dw '.stabn 0x44,0,241,',0,0
	.dd LM145-_Accept
	.dw 0x0d,0x0a
.code
LM145:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,238,',0,0
	.dd LM146-_Accept
	.dw 0x0d,0x0a
.code
LM146:
L96:
	R2=BP	// QImode move
	R1=BP+6
	R2=BP	// QImode move
	R3=BP+6
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+256
	R2=R1	// QImode move
	[R2]=R3	// QImode move
	pc=L94	// Indirect jump
L95:
.debug
	.dw '.stabn 0x44,0,245,',0,0
	.dd LM147-_Accept
	.dw 0x0d,0x0a
.code
LM147:
	R1=(-1)	// QImode move
	[28674]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,246,',0,0
	.dd LM148-_Accept
	.dw 0x0d,0x0a
.code
LM148:
	R1=(-1)	// QImode move
	[28675]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,248,',0,0
	.dd LM149-_Accept
	.dw 0x0d,0x0a
.code
LM149:
	R1=(-1024)	// QImode move
	[28672]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,251,',0,0
	.dd LM150-_Accept
	.dw 0x0d,0x0a
.code
LM150:
L98:
	pc=L100	// Indirect jump
	pc=L99	// Indirect jump
L100:
.debug
	.dw '.stabn 0x44,0,253,',0,0
	.dd LM151-_Accept
	.dw 0x0d,0x0a
.code
LM151:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,259,',0,0
	.dd LM152-_Accept
	.dw 0x0d,0x0a
.code
LM152:
	R1=[28677]	// QImode move
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,264,',0,0
	.dd LM153-_Accept
	.dw 0x0d,0x0a
.code
LM153:
	R1=BP	// QImode move
	R2=BP+1
	R1=[BP]	// QImode move
	R3=R2	// QImode move
	CMP R1,[R3]	// QImode compare
	NSJNZ L101	//QImode NE
	pc=L98	// Indirect jump
	pc=L102	// Indirect jump
L101:
.debug
	.dw '.stabn 0x44,0,265,',0,0
	.dd LM154-_Accept
	.dw 0x0d,0x0a
.code
LM154:
	R1=BP	// QImode move
	R2=BP+1
	R1=[BP]	// QImode move
	R4=R2	// QImode move
	[R4]=R1	// QImode move
L102:
.debug
	.dw '.stabn 0x44,0,268,',0,0
	.dd LM155-_Accept
	.dw 0x0d,0x0a
.code
LM155:
	R1=[BP]	// QImode move
	CMP R1,(-12394)	// QImode compare
	NSJNZ L103	//QImode NE
.debug
	.dw '.stabn 0x44,0,270,',0,0
	.dd LM156-_Accept
	.dw 0x0d,0x0a
.code
LM156:
	R1=(-1024)	// QImode move
	[28672]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,271,',0,0
	.dd LM157-_Accept
	.dw 0x0d,0x0a
.code
LM157:
	pc=L98	// Indirect jump
L103:
.debug
	.dw '.stabn 0x44,0,275,',0,0
	.dd LM158-_Accept
	.dw 0x0d,0x0a
.code
LM158:
	R1=[BP]	// QImode move
	CMP R1,(-20586)	// QImode compare
	NSJNZ L104	//QImode NE
.debug
	.dw '.stabn 0x44,0,277,',0,0
	.dd LM159-_Accept
	.dw 0x0d,0x0a
.code
LM159:
	R1=(-1536)	// QImode move
	[28672]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,278,',0,0
	.dd LM160-_Accept
	.dw 0x0d,0x0a
.code
LM160:
	R1=BP	// QImode move
	R2=BP+6
	R3=BP	// QImode move
	R1=BP+6
	R2=BP	// QImode move
	R3=BP+6
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+1
	R2=R1	// QImode move
	[R2]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,279,',0,0
	.dd LM161-_Accept
	.dw 0x0d,0x0a
.code
LM161:
	R1=(-1)	// QImode move
	[SP--]=R1	// QImode move
	R1=BP	// QImode move
	R2=BP+6
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_WriteWord	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,280,',0,0
	.dd LM162-_Accept
	.dw 0x0d,0x0a
.code
LM162:
	pc=L99	// Indirect jump
L104:
.debug
	.dw '.stabn 0x44,0,284,',0,0
	.dd LM163-_Accept
	.dw 0x0d,0x0a
.code
LM163:
	R4=[BP]	// QImode move
	R1=R4&(-512)
	CMP R1,(-8704)	// QImode compare
	NSJNZ L105	//QImode NE
.debug
	.dw '.stabn 0x44,0,286,',0,0
	.dd LM164-_Accept
	.dw 0x0d,0x0a
.code
LM164:
	R2=BP	// QImode move
	R1=BP+8
	R2=BP	// QImode move
	R3=BP+2
	R2=R3	// QImode move
	R2=[R2]	// QImode move
	R2=R2&34
	[bp+11]=R2	// QImode move
	R3=[bp+11]	// QImode move
	R2=R3 lsl 3
	R3=BP	// QImode move
	R4=BP+3
	[bp+11]=R4	// QImode move
	R3=[bp+11]	// QImode move
	R3=[R3]	// QImode move
	R3=R3&34
	[bp+12]=R3	// QImode move
	R3=[bp+12]	// QImode move
	R4=R3 lsl 2
	R2|=R4
	R3=BP	// QImode move
	R4=BP+4
	[bp+11]=R4	// QImode move
	R3=[bp+11]	// QImode move
	R3=[R3]	// QImode move
	R3=R3&34
	[bp+12]=R3	// QImode move
	R3=[bp+12]	// QImode move
	R4=R3 lsl 1
	R2|=R4
	R3=BP	// QImode move
	R4=BP+5
	[bp+11]=R4	// QImode move
	R3=[bp+11]	// QImode move
	R3=[R3]	// QImode move
	R3=R3&34
	[bp+12]=R3	// QImode move
	R3=R2	// QImode move
	R4=[bp+12]	// QImode move
	R3|=R4
	R4=R1	// QImode move
	[R4]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,287,',0,0
	.dd LM165-_Accept
	.dw 0x0d,0x0a
.code
LM165:
	R1=BP	// QImode move
	R2=BP+8
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R2=R1|(-8704)
	R1=[BP]	// QImode move
	CMP R1,R2	// QImode compare
	NSJNZ L106	//QImode NE
	R1=BP	// QImode move
	R2=BP+9
	R3=R2	// QImode move
	R3=[R3]	// QImode move
	R1=R3&15
	CMP R1,15	// QImode compare
	NSJNZ L106	//QImode NE
.debug
	.dw '.stabn 0x44,0,289,',0,0
	.dd LM166-_Accept
	.dw 0x0d,0x0a
.code
LM166:
	R2=BP	// QImode move
	R1=BP+6
	R2=BP	// QImode move
	R3=BP+2
	R2=R3	// QImode move
	R4=[R2]	// QImode move
	R2=R4 lsl 4
	R2=R2 lsl 4
	R3=BP	// QImode move
	R4=BP+3
	R3=R4	// QImode move
	R2 = R2 + [R3]	//addqi3
	R4=R1	// QImode move
	[R4]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,290,',0,0
	.dd LM167-_Accept
	.dw 0x0d,0x0a
.code
LM167:
	R2=BP	// QImode move
	R1=BP+7
	R2=BP	// QImode move
	R3=BP+4
	R2=R3	// QImode move
	R4=[R2]	// QImode move
	R2=R4 lsl 4
	R2=R2 lsl 4
	R3=BP	// QImode move
	R4=BP+5
	R3=R4	// QImode move
	R2 = R2 + [R3]	//addqi3
	R4=R1	// QImode move
	[R4]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,291,',0,0
	.dd LM168-_Accept
	.dw 0x0d,0x0a
.code
LM168:
	R1=BP	// QImode move
	R2=BP+6
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,(-18433)	// QImode compare
	NSJNA L107	//QImode LEU
	R1=BP	// QImode move
	R2=BP+6
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	CMP R1,(-1025)	// QImode compare
	NSJA L107	//QImode GTU
.debug
	.dw '.stabn 0x44,0,292,',0,0
	.dd LM169-_Accept
	.dw 0x0d,0x0a
.code
LM169:
	R1=BP	// QImode move
	R2=BP+7
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	R1=BP	// QImode move
	R2=BP+6
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	[SP--]=R1	// QImode move
	call _Flash_WriteWord	// call without return value
	SP = SP + 2	//SP
L107:
.debug
	.dw '.stabn 0x44,0,293,',0,0
	.dd LM170-_Accept
	.dw 0x0d,0x0a
.code
LM170:
	R1=(-27136)	// QImode move
	[28672]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,294,',0,0
	.dd LM171-_Accept
	.dw 0x0d,0x0a
.code
LM171:
	pc=L108	// Indirect jump
L106:
.debug
	.dw '.stabn 0x44,0,297,',0,0
	.dd LM172-_Accept
	.dw 0x0d,0x0a
.code
LM172:
	R1=(-24832)	// QImode move
	[28672]=R1	// QImode move
L108:
.debug
	.dw '.stabn 0x44,0,299,',0,0
	.dd LM173-_Accept
	.dw 0x0d,0x0a
.code
LM173:
	R1=BP	// QImode move
	R2=BP+9
	R1=0	// QImode move
	R3=R2	// QImode move
	[R3]=R1	// QImode move
L105:
.debug
	.dw '.stabn 0x44,0,302,',0,0
	.dd LM174-_Accept
	.dw 0x0d,0x0a
.code
LM174:
	R4=[BP]	// QImode move
	R1=R4&12288
	CMP R1,4096	// QImode compare
	NSJZ L112	//QImode EQ
	CMP R1,4096	// QImode compare
	NSJA L120	//QImode GTU
	CMP R1,0	// QImode test
	NSJZ L110	//QImode EQ
	pc=L109	// Indirect jump
L120:
	CMP R1,8192	// QImode compare
	NSJZ L114	//QImode EQ
	CMP R1,12288	// QImode compare
	NSJZ L116	//QImode EQ
	pc=L109	// Indirect jump
L110:
.debug
	.dw '.stabn 0x44,0,306,',0,0
	.dd LM175-_Accept
	.dw 0x0d,0x0a
.code
LM175:
	R1=BP	// QImode move
	R2=BP+8
	R1=[BP]	// QImode move
	R3=R1&255
	R1=R2	// QImode move
	[R1]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,307,',0,0
	.dd LM176-_Accept
	.dw 0x0d,0x0a
.code
LM176:
	R1=BP	// QImode move
	R2=BP+8
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R4=[BP]	// QImode move
	R2=R4&511
	CMP R1,R2	// QImode compare
	NSJNZ L111	//QImode NE
.debug
	.dw '.stabn 0x44,0,308,',0,0
	.dd LM177-_Accept
	.dw 0x0d,0x0a
.code
LM177:
	R2=BP	// QImode move
	R1=BP+2
	R2=BP	// QImode move
	R3=BP+8
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R1	// QImode move
	[R3]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,309,',0,0
	.dd LM178-_Accept
	.dw 0x0d,0x0a
.code
LM178:
	R2=BP	// QImode move
	R1=BP+9
	R2=BP	// QImode move
	R3=BP+9
	R4=R3	// QImode move
	R4=[R4]	// QImode move
	R2=R4|1
	R4=R1	// QImode move
	[R4]=R2	// QImode move
L111:
.debug
	.dw '.stabn 0x44,0,311,',0,0
	.dd LM179-_Accept
	.dw 0x0d,0x0a
.code
LM179:
	pc=L109	// Indirect jump
L112:
.debug
	.dw '.stabn 0x44,0,314,',0,0
	.dd LM180-_Accept
	.dw 0x0d,0x0a
.code
LM180:
	R1=BP	// QImode move
	R2=BP+8
	R1=[BP]	// QImode move
	R3=R1&255
	R1=R2	// QImode move
	[R1]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,315,',0,0
	.dd LM181-_Accept
	.dw 0x0d,0x0a
.code
LM181:
	R1=BP	// QImode move
	R2=BP+8
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R4=[BP]	// QImode move
	R2=R4&511
	CMP R1,R2	// QImode compare
	NSJNZ L113	//QImode NE
.debug
	.dw '.stabn 0x44,0,316,',0,0
	.dd LM182-_Accept
	.dw 0x0d,0x0a
.code
LM182:
	R2=BP	// QImode move
	R1=BP+3
	R2=BP	// QImode move
	R3=BP+8
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R1	// QImode move
	[R3]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,317,',0,0
	.dd LM183-_Accept
	.dw 0x0d,0x0a
.code
LM183:
	R2=BP	// QImode move
	R1=BP+9
	R2=BP	// QImode move
	R3=BP+9
	R4=R3	// QImode move
	R4=[R4]	// QImode move
	R2=R4|2
	R4=R1	// QImode move
	[R4]=R2	// QImode move
L113:
.debug
	.dw '.stabn 0x44,0,319,',0,0
	.dd LM184-_Accept
	.dw 0x0d,0x0a
.code
LM184:
	pc=L109	// Indirect jump
L114:
.debug
	.dw '.stabn 0x44,0,322,',0,0
	.dd LM185-_Accept
	.dw 0x0d,0x0a
.code
LM185:
	R1=BP	// QImode move
	R2=BP+8
	R1=[BP]	// QImode move
	R3=R1&255
	R1=R2	// QImode move
	[R1]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,323,',0,0
	.dd LM186-_Accept
	.dw 0x0d,0x0a
.code
LM186:
	R1=BP	// QImode move
	R2=BP+8
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R4=[BP]	// QImode move
	R2=R4&511
	CMP R1,R2	// QImode compare
	NSJNZ L115	//QImode NE
.debug
	.dw '.stabn 0x44,0,324,',0,0
	.dd LM187-_Accept
	.dw 0x0d,0x0a
.code
LM187:
	R2=BP	// QImode move
	R1=BP+4
	R2=BP	// QImode move
	R3=BP+8
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R1	// QImode move
	[R3]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,325,',0,0
	.dd LM188-_Accept
	.dw 0x0d,0x0a
.code
LM188:
	R2=BP	// QImode move
	R1=BP+9
	R2=BP	// QImode move
	R3=BP+9
	R4=R3	// QImode move
	R4=[R4]	// QImode move
	R2=R4|4
	R4=R1	// QImode move
	[R4]=R2	// QImode move
L115:
.debug
	.dw '.stabn 0x44,0,327,',0,0
	.dd LM189-_Accept
	.dw 0x0d,0x0a
.code
LM189:
	pc=L109	// Indirect jump
L116:
.debug
	.dw '.stabn 0x44,0,330,',0,0
	.dd LM190-_Accept
	.dw 0x0d,0x0a
.code
LM190:
	R1=BP	// QImode move
	R2=BP+8
	R1=[BP]	// QImode move
	R3=R1&255
	R1=R2	// QImode move
	[R1]=R3	// QImode move
.debug
	.dw '.stabn 0x44,0,331,',0,0
	.dd LM191-_Accept
	.dw 0x0d,0x0a
.code
LM191:
	R1=BP	// QImode move
	R2=BP+8
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	[SP--]=R1	// QImode move
	call _Ebit	// call with return value
	SP = SP + 1	//SP
	R4=[BP]	// QImode move
	R2=R4&511
	CMP R1,R2	// QImode compare
	NSJNZ L117	//QImode NE
.debug
	.dw '.stabn 0x44,0,332,',0,0
	.dd LM192-_Accept
	.dw 0x0d,0x0a
.code
LM192:
	R2=BP	// QImode move
	R1=BP+5
	R2=BP	// QImode move
	R3=BP+8
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R1	// QImode move
	[R3]=R2	// QImode move
.debug
	.dw '.stabn 0x44,0,333,',0,0
	.dd LM193-_Accept
	.dw 0x0d,0x0a
.code
LM193:
	R2=BP	// QImode move
	R1=BP+9
	R2=BP	// QImode move
	R3=BP+9
	R4=R3	// QImode move
	R4=[R4]	// QImode move
	R2=R4|8
	R4=R1	// QImode move
	[R4]=R2	// QImode move
L117:
.debug
	.dw '.stabn 0x44,0,335,',0,0
	.dd LM194-_Accept
	.dw 0x0d,0x0a
.code
LM194:
	pc=L109	// Indirect jump
L119:
L109:
.debug
	.dw '.stabn 0x44,0,337,',0,0
	.dd LM195-_Accept
	.dw 0x0d,0x0a
.code
LM195:
	pc=L98	// Indirect jump
L99:
.debug
	.dw '.stabn 0x44,0,338,',0,0
	.dd LM196-_Accept
	.dw 0x0d,0x0a
.code
LM196:
	R1=0	// QImode move
	pc=L92	// Indirect jump
.debug
	.dw '.stabn 0x44,0,339,',0,0
	.dd LM197-_Accept
	.dw 0x0d,0x0a
.code
LM197:
LBE7:
.debug
	.dw '.stabn 0x44,0,339,',0,0
	.dd LM198-_Accept
	.dw 0x0d,0x0a
.code
LM198:
L92:

	sp+=13
	pop bp from [sp]
	retf
	.endp	// end of Accept

.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB7-_Accept
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "Ret:4",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "last:4",128,0,0,1',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "addrH:4",128,0,0,2',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "addrL:4",128,0,0,3',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "dataH:4",128,0,0,4',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "dataL:4",128,0,0,5',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "Addr:4",128,0,0,6',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "Data:4",128,0,0,7',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "k:4",128,0,0,8',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "rounds:4",128,0,0,9',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE7-_Accept
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME7-_Accept
	.dw 0x0d,0x0a
.code
LME7:
.code
.debug
	.dw '.stabs "main:F1",36,0,0,',0,0,offset _main,seg _main,0x0d,0x0a
.CODE
.public _main
_main:	.proc
.debug
	.dw '.stabn 0x44,0,342,',0,0
	.dd LM199-_main
	.dw 0x0d,0x0a
.code
LM199:
	// total=3, vars=3
	// frame_pointer_needed: 1
	push bp to [sp]
	sp-=3
	bp=sp+1

	R1=BP+6
	[bp+2]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,343,',0,0
	.dd LM200-_main
	.dw 0x0d,0x0a
.code
LM200:
LBB8:
.debug
	.dw '.stabn 0x44,0,347,',0,0
	.dd LM201-_main
	.dw 0x0d,0x0a
.code
LM201:
L141:
	pc=L143	// Indirect jump
	pc=L142	// Indirect jump
L143:
.debug
	.dw '.stabn 0x44,0,349,',0,0
	.dd LM202-_main
	.dw 0x0d,0x0a
.code
LM202:
	R1=0	// QImode move
	[28674]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,350,',0,0
	.dd LM203-_main
	.dw 0x0d,0x0a
.code
LM203:
	R1=0	// QImode move
	[28675]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,352,',0,0
	.dd LM204-_main
	.dw 0x0d,0x0a
.code
LM204:
	R1=0	// QImode move
	[28679]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,353,',0,0
	.dd LM205-_main
	.dw 0x0d,0x0a
.code
LM205:
	R1=0	// QImode move
	[28680]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,355,',0,0
	.dd LM206-_main
	.dw 0x0d,0x0a
.code
LM206:
	call _Accept	// call with return value
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,356,',0,0
	.dd LM207-_main
	.dw 0x0d,0x0a
.code
LM207:
	R1=[BP]	// QImode move
	CMP R1,0	// QImode test
	NSJZ L145	//QImode EQ
	CMP R1,3	// QImode compare
	NSJA L144	//QImode GTU
	CMP R1,2	// QImode compare
	NSJB L144	//QImode LTU
	pc=L147	// Indirect jump
L145:
.debug
	.dw '.stabn 0x44,0,359,',0,0
	.dd LM208-_main
	.dw 0x0d,0x0a
.code
LM208:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=2	// QImode move
	[SP--]=R1	// QImode move
	call _PlaySnd_Auto	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,360,',0,0
	.dd LM209-_main
	.dw 0x0d,0x0a
.code
LM209:
	pc=L144	// Indirect jump
L146:
L147:
.debug
	.dw '.stabn 0x44,0,363,',0,0
	.dd LM210-_main
	.dw 0x0d,0x0a
.code
LM210:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=1	// QImode move
	[SP--]=R1	// QImode move
	call _PlaySnd_Auto	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,364,',0,0
	.dd LM211-_main
	.dw 0x0d,0x0a
.code
LM211:
	pc=L144	// Indirect jump
L149:
L144:
.debug
	.dw '.stabn 0x44,0,367,',0,0
	.dd LM212-_main
	.dw 0x0d,0x0a
.code
LM212:
	R1=[28672]	// QImode move
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,368,',0,0
	.dd LM213-_main
	.dw 0x0d,0x0a
.code
LM213:
	R2=[BP]	// QImode move
	R1=R2&1
	CMP R1,0	// QImode test
	NSJZ L150	//QImode EQ
.debug
	.dw '.stabn 0x44,0,370,',0,0
	.dd LM214-_main
	.dw 0x0d,0x0a
.code
LM214:
	call _Record	// call without return value
.debug
	.dw '.stabn 0x44,0,371,',0,0
	.dd LM215-_main
	.dw 0x0d,0x0a
.code
LM215:
	R1=BP	// QImode move
	R2=BP+1
	R1=0	// QImode move
	R3=R2	// QImode move
	[R3]=R1	// QImode move
L151:
	R1=BP	// QImode move
	R2=BP+1
	R4=R2	// QImode move
	R1=[R4]	// QImode move
	CMP R1,99	// QImode compare
	NSJNA L154	//QImode LEU
	pc=L150	// Indirect jump
L154:
	call _Delay	// call without return value
L153:
	R1=BP	// QImode move
	R2=BP+1
	R3=BP	// QImode move
	R1=BP+1
	R2=BP	// QImode move
	R3=BP+1
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+1
	R2=R1	// QImode move
	[R2]=R3	// QImode move
	pc=L151	// Indirect jump
L152:
L150:
.debug
	.dw '.stabn 0x44,0,373,',0,0
	.dd LM216-_main
	.dw 0x0d,0x0a
.code
LM216:
	R3=[BP]	// QImode move
	R1=R3&2
	CMP R1,0	// QImode test
	NSJZ L155	//QImode EQ
.debug
	.dw '.stabn 0x44,0,375,',0,0
	.dd LM217-_main
	.dw 0x0d,0x0a
.code
LM217:
L156:
	pc=L158	// Indirect jump
	pc=L157	// Indirect jump
L158:
.debug
	.dw '.stabn 0x44,0,377,',0,0
	.dd LM218-_main
	.dw 0x0d,0x0a
.code
LM218:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,378,',0,0
	.dd LM219-_main
	.dw 0x0d,0x0a
.code
LM219:
	R2=[28672]	// QImode move
	R1=R2&2
	CMP R1,0	// QImode test
	NSJNZ L159	//QImode NE
.debug
	.dw '.stabn 0x44,0,380,',0,0
	.dd LM220-_main
	.dw 0x0d,0x0a
.code
LM220:
	pc=L157	// Indirect jump
L159:
.debug
	.dw '.stabn 0x44,0,382,',0,0
	.dd LM221-_main
	.dw 0x0d,0x0a
.code
LM221:
	pc=L156	// Indirect jump
L157:
.debug
	.dw '.stabn 0x44,0,383,',0,0
	.dd LM222-_main
	.dw 0x0d,0x0a
.code
LM222:
	call _PlayRecord	// call without return value
.debug
	.dw '.stabn 0x44,0,384,',0,0
	.dd LM223-_main
	.dw 0x0d,0x0a
.code
LM223:
	R1=BP	// QImode move
	R2=BP+1
	R1=0	// QImode move
	R4=R2	// QImode move
	[R4]=R1	// QImode move
L160:
	R1=BP	// QImode move
	R2=BP+1
	R3=R2	// QImode move
	R1=[R3]	// QImode move
	CMP R1,99	// QImode compare
	NSJNA L163	//QImode LEU
	pc=L155	// Indirect jump
L163:
	call _Delay	// call without return value
L162:
	R1=BP	// QImode move
	R2=BP+1
	R3=BP	// QImode move
	R1=BP+1
	R2=BP	// QImode move
	R3=BP+1
	R4=R3	// QImode move
	R2=[R4]	// QImode move
	R3=R2+1
	R2=R1	// QImode move
	[R2]=R3	// QImode move
	pc=L160	// Indirect jump
L161:
L155:
.debug
	.dw '.stabn 0x44,0,386,',0,0
	.dd LM224-_main
	.dw 0x0d,0x0a
.code
LM224:
	R3=[BP]	// QImode move
	R1=R3&4
	CMP R1,0	// QImode test
	NSJZ L164	//QImode EQ
.debug
	.dw '.stabn 0x44,0,388,',0,0
	.dd LM225-_main
	.dw 0x0d,0x0a
.code
LM225:
	call _Send	// call with return value
	[BP]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,389,',0,0
	.dd LM226-_main
	.dw 0x0d,0x0a
.code
LM226:
	R1=[BP]	// QImode move
	CMP R1,0	// QImode test
	NSJZ L166	//QImode EQ
	CMP R1,3	// QImode compare
	NSJA L164	//QImode GTU
	pc=L169	// Indirect jump
L166:
.debug
	.dw '.stabn 0x44,0,392,',0,0
	.dd LM227-_main
	.dw 0x0d,0x0a
.code
LM227:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=0	// QImode move
	[SP--]=R1	// QImode move
	call _PlaySnd_Auto	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,393,',0,0
	.dd LM228-_main
	.dw 0x0d,0x0a
.code
LM228:
	pc=L164	// Indirect jump
L167:
L168:
L169:
.debug
	.dw '.stabn 0x44,0,397,',0,0
	.dd LM229-_main
	.dw 0x0d,0x0a
.code
LM229:
	R1=3	// QImode move
	[SP--]=R1	// QImode move
	R1=1	// QImode move
	[SP--]=R1	// QImode move
	call _PlaySnd_Auto	// call without return value
	SP = SP + 2	//SP
.debug
	.dw '.stabn 0x44,0,398,',0,0
	.dd LM230-_main
	.dw 0x0d,0x0a
.code
LM230:
	pc=L164	// Indirect jump
L171:
L165:
L164:
.debug
	.dw '.stabn 0x44,0,401,',0,0
	.dd LM231-_main
	.dw 0x0d,0x0a
.code
LM231:
	R1=1	// QImode move
	[28690]=R1	// QImode move
.debug
	.dw '.stabn 0x44,0,402,',0,0
	.dd LM232-_main
	.dw 0x0d,0x0a
.code
LM232:
	pc=L141	// Indirect jump
L142:
.debug
	.dw '.stabn 0x44,0,403,',0,0
	.dd LM233-_main
	.dw 0x0d,0x0a
.code
LM233:
LBE8:
.debug
	.dw '.stabn 0x44,0,403,',0,0
	.dd LM234-_main
	.dw 0x0d,0x0a
.code
LM234:
L140:

	sp+=3
	pop bp from [sp]
	retf
	.endp	// end of main

.debug
	.dw '.stabn 0xc0,0,0,',0,0
	.dd LBB8-_main
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabs "Ret:4",128,0,0,0',0x0d,0x0a
.CODE
.debug
	.dw '.stabs "i:4",128,0,0,1',0x0d,0x0a
.CODE
.debug
	.dw '.stabn 0xe0,0,0,',0,0
	.dd LBE8-_main
	.dw 0x0d,0x0a
.code
.debug
	.dw '.stabf ',0,0
	.dd LME8-_main
	.dw 0x0d,0x0a
.code
LME8:
.external _Flash_WriteWord
.external _SACM_DVR_FetchQueue
.external _SACM_DVR_Encoder
.external _SACM_DVR_InitEncoder
.external _Flash_Erase
.external _SACM_DVR_Decoder
.external _SACM_DVR_Stop
.external _SACM_DVR_Status
.external _SACM_DVR_FillQueue
.external _SACM_DVR_TestQueue
.external _Flash_ReadWord
.external _SACM_DVR_InitDecoder
.external _SACM_DVR_InitQueue
.external _SACM_DVR_Initial
.external _SACM_S480_Stop
.external _SACM_S480_ServiceLoop
.external _SACM_S480_Status
.external _SACM_S480_Play
.external _SACM_S480_Initial
	.end
