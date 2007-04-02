#####################################################################
#																	 
#	Created by u'nSP IDE		12:37:28	04/02/07
#
#####################################################################




APPDIR	= D:\study\Sunplus\UNSPID~1.0

OUTDIR	= .\Debug

CC	= $(APPDIR)\gcc

AS	= $(APPDIR)\xasm16

LD	= $(APPDIR)\xlink16

AR	= $(APPDIR)\xLib16

RESC	= $(APPDIR)\resc

RM	= $(APPDIR)\rm -f

INCLUDES	= -I"D:/study/Sunplus/MMS/mms"

BODY	= -body SPCE060A_061A -bfile "D:\study\Sunplus\unSP IDE Common\Body\SPCE060A_061A.cpt"

BINFILE	= "$(OUTDIR)\mms.S37"

ARYFILE	= "$(OUTDIR)\mms.ary"

SBMFILE	= "$(OUTDIR)\mms.sbm"

OPT	= -S -gstabs -Wall -mglobal-var-iram

ASFLAGS	= -t2 -d

CASFLAGS	= -t2 

CFLAGS	= $(OPT) -B$(APPDIR)\ $(INCLUDES) 

BINTYPE	= -as

LDFLAGS	= 

EXTRAFLAGS	= 


OBJFILES	= \
	"$(OUTDIR)\succeed_72k.res" \
	"$(OUTDIR)\accept_72k.res" \
	"$(OUTDIR)\fail_72k.res" \
	"$(OUTDIR)\rec_72k.res" \
	"$(OUTDIR)\Resource.obj" \
	"$(OUTDIR)\sram.obj" \
	"$(OUTDIR)\Flash.obj" \
	"$(OUTDIR)\hardware.obj" \
	"$(OUTDIR)\isr.obj" \
	"$(OUTDIR)\main.obj" 

"$(OUTDIR)\succeed_72k.res": "D:\study\Sunplus\MMS\mms\succeed.72k"
	$(RESC) "D:\study\Sunplus\MMS\mms\succeed.72k" "$(OUTDIR)\succeed_72k.res" RES_SUCCEED_72K 

"$(OUTDIR)\accept_72k.res": "D:\study\Sunplus\MMS\mms\accept.72k"
	$(RESC) "D:\study\Sunplus\MMS\mms\accept.72k" "$(OUTDIR)\accept_72k.res" RES_ACCEPT_72K 

"$(OUTDIR)\fail_72k.res": "D:\study\Sunplus\MMS\mms\fail.72k"
	$(RESC) "D:\study\Sunplus\MMS\mms\fail.72k" "$(OUTDIR)\fail_72k.res" RES_FAIL_72K 

"$(OUTDIR)\rec_72k.res": "D:\study\Sunplus\MMS\mms\rec.72k"
	$(RESC) "D:\study\Sunplus\MMS\mms\rec.72k" "$(OUTDIR)\rec_72k.res" RES_REC_72K 

"$(OUTDIR)\Resource.obj": "D:\study\Sunplus\MMS\mms\Resource.asm" 
	$(AS) $(ASFLAGS) $(INCLUDES) -l "$(OUTDIR)\Resource.lst" -o "$(OUTDIR)\Resource.obj" "D:\study\Sunplus\MMS\mms\Resource.asm" 

"$(OUTDIR)\sram.obj": "D:\study\Sunplus\MMS\mms\sram.asm" 
	$(AS) $(ASFLAGS) $(INCLUDES) -l "$(OUTDIR)\sram.lst" -o "$(OUTDIR)\sram.obj" "D:\study\Sunplus\MMS\mms\sram.asm" 

"$(OUTDIR)\Flash.obj": "D:\study\Sunplus\MMS\mms\Flash.asm" 
	$(AS) $(ASFLAGS) $(INCLUDES) -l "$(OUTDIR)\Flash.lst" -o "$(OUTDIR)\Flash.obj" "D:\study\Sunplus\MMS\mms\Flash.asm" 

"$(OUTDIR)\hardware.obj": "D:\study\Sunplus\MMS\mms\hardware.asm" 
	$(AS) $(ASFLAGS) $(INCLUDES) -l "$(OUTDIR)\hardware.lst" -o "$(OUTDIR)\hardware.obj" "D:\study\Sunplus\MMS\mms\hardware.asm" 

"$(OUTDIR)\isr.obj": "D:\study\Sunplus\MMS\mms\isr.asm" ".\DVR.inc" 
	$(AS) $(ASFLAGS) $(INCLUDES) -l "$(OUTDIR)\isr.lst" -o "$(OUTDIR)\isr.obj" "D:\study\Sunplus\MMS\mms\isr.asm" 

"$(OUTDIR)\main.asm": "D:\study\Sunplus\MMS\mms\main.c" ".\spce061a.h" ".\Flash.h" ".\DVR.h" ".\s480.h" 
	$(CC) $(CFLAGS) -o "$(OUTDIR)/main.asm" "D:/study/Sunplus/MMS/mms/main.c" 

"$(OUTDIR)\main.obj": "$(OUTDIR)\main.asm"
	$(AS) $(CASFLAGS) $(INCLUDES) -l "$(OUTDIR)\main.lst" -o "$(OUTDIR)\main.obj" "$(OUTDIR)\main.asm" 


.SUFFIXES : .c .asm .obj .s37 .tsk .res

all :	 "$(OUTDIR)" $(BINFILE)

"$(OUTDIR)" :
	if not exist "$(OUTDIR)/$(NULL)" mkdir "$(OUTDIR)"

$(BINFILE) : $(OBJFILES) 
	$(LD) $(BINTYPE) $(ARYFILE) $(BINFILE) $(LDFLAGS) $(BODY) $(EXTRAFLAGS)

compile :	 $(OBJFILES)

clean :
	$(RM) "$(OUTDIR)\succeed_72k.res" 
	$(RM) "$(OUTDIR)\accept_72k.res" 
	$(RM) "$(OUTDIR)\fail_72k.res" 
	$(RM) "$(OUTDIR)\rec_72k.res" 
	$(RM) "$(OUTDIR)\Resource.obj" 
	$(RM) "$(OUTDIR)\Resource.lst" 
	$(RM) "$(OUTDIR)\sram.obj" 
	$(RM) "$(OUTDIR)\sram.lst" 
	$(RM) "$(OUTDIR)\Flash.obj" 
	$(RM) "$(OUTDIR)\Flash.lst" 
	$(RM) "$(OUTDIR)\hardware.obj" 
	$(RM) "$(OUTDIR)\hardware.lst" 
	$(RM) "$(OUTDIR)\isr.obj" 
	$(RM) "$(OUTDIR)\isr.lst" 
	$(RM) "$(OUTDIR)\main.obj" 
	$(RM) "$(OUTDIR)\main.lst" 
	$(RM) "$(OUTDIR)\main.asm" 
	$(RM) $(BINFILE) $(SBMFILE) 

.c.asm:
	$(CC) $(CFLAGS) $(INCLUDES) -o "$(OUTDIR)/$@" $<

.asm.obj:
	$(AS) $(ASFLAGS) $(INCLUDES) -o "$(OUTDIR)/$@" $<

