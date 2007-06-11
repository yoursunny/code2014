          NAME      ATM       ;written by sunny boy 5050369043
                              ;Automatic Teller Machine demo
;VERSION HISTORY
;2007-06-09 version 0.1.0
; initial release
;2007-06-11 version 0.1.1
; in 0.1.0, last byte of PIN is not checked for correctness, corrected in 0.1.1
; in 0.1.0, program return value is not guarenteed to be 0 when normal exit, corrected in 0.1.1
; tiny alter of function screen letter-spacing to make it look more comfortable

;program return value
;  0=normal exit
;  1=data file not found
;===============================================================================
DATA      SEGMENT
;setup area begin, alter nothing above!
          DATAFILE  DB        'ATM.CSV$';data file name
       DATACOUNTMAX EQU       50;max entries count
;setup area  end , alter nothing below!
;===============================================================================
;key storage
          CARDENTRY STRUC;card entry struct
            NUMBER  DB        16 DUP (?);card number
            PIN     DB        6 DUP (?) ;pin code
            CNY     DB        8 DUP (?) ;CNY balance, unit:fen,  ASCII or BCD
            USD     DB        8 DUP (?) ;USD balance, unit:cent, ASCII or BCD
          CARDENTRY ENDS
       CARDENTRYLEN EQU       38;a card entry has 38 bytes
          DATABASE  CARDENTRY DATACOUNTMAX DUP (<>);card data storage
          DATACOUNT DB        ?;how many cards loaded?
          PINCODE   DB        6 DUP (?);current PIN code
          CARDID    DB        ?;current card id
          CARDOFF   DW        ?;current card offset =CARDID*CARDENTRYLEN
          ACCOUNT   DW        ?;current currency account
          AMOUNT    DB        4 DUP (?);current inputed amount
;===============================================================================
;buffers
        FREELOOPKEY DB        ?;buffer for FREELOOP
       D_FREETIMBUF DB        'yyyy-MM-dd HH:mm:ss$';buffer for D_FREETIM
          AMOUNTBUF DB        5,?,5 DUP (?);buffer for withdraw/deposit amount
          CHGPINBUF DB        6 DUP (?);buffer for CHGPIN
          ENTRYBUF  DB        43 DUP (?);buffer for LOADENTRY/STORENTRY
;===============================================================================
;constants
        DATAOPENMSG DB        'Data file not found$';data open error msg
          DATAEND   DB        '-';data end signal for STORDATA
          ;generic screen
          S_BORDER  DB        '-------------------------------------------------------------------------------$'
          S_EMPTY   DB        '|                                                                             |$'
          ;welcome screen page 1
          S_WELC_04 DB        '|   xx  xx   xxxx   xx  xx  xx  xx   xxxxx  xx  xx  xxxxx   xxxxx   xx  xx    |$'
          S_WELC_05 DB        '|   xx  xx  xx  xx  xx  xx  xx xxx  xx      xx  xx  xx  xx  xx  xx  xx  xx    |$'
          S_WELC_06 DB        '|   xx  xx  xx  xx  xx  xx  xxx     xx      xx  xx  xx  xx  xx  xx  xx  xx    |$'
          S_WELC_07 DB        '|   xx  xx  xx  xx  xx  xx  xx       xxxx   xx  xx  xx  xx  xx  xx  xx  xx    |$'
          S_WELC_08 DB        '|   xx  xx  xx  xx  xx  xx  xx          xx  xx  xx  xx  xx  xx  xx  xx  xx    |$'
          S_WELC_09 DB        '|   xx  xx  xx  xx  xx  xx  xx          xx  xx  xx  xx  xx  xx  xx  xx  xx    |$'
          S_WELC_10 DB        '|    xxxx    xxxx    xxxxx  xx      xxxxx    xxxxx  xx  xx  xx  xx   xxxx     |$'
          S_WELC_11 DB        '|      xx                                                              xx     |$'
          S_WELC_12 DB        '|     xx                                                              xx      |$'
          S_WELC_13 DB        '|  xxxx                                                            xxxx       |$'
          S_WELC_17 DB        '|               Copyright 2007, yoursunny.com                                 |$'
          S_WELC_18 DB        '|                   sunny boy                                                 |$'
          S_WELC_19 DB        '|                                                                             |$'
          S_WELC_20 DB        '|               5050369043                                                    |$'
          S_WELC_21 DB        '|                                         Press any key to continue..         |$'
          S_WELC_22 DB        '|   CreativeCommons BY-NC 2.5                                                 |$'
          ;welcome screen page 2
          S_WELC_28 DB        '|         ATMATM            ATMATMATMATMATMATM      ATMATM         ATMATM     |$'
          S_WELC_29 DB        '|      ATMATMATMATM               ATMATM            ATMATM         ATMATM     |$'
          S_WELC_30 DB        '|   ATMATM      ATMATM            ATMATM            ATMATMATM   ATMATMATM     |$'
          S_WELC_31 DB        '|   ATMATM      ATMATM            ATMATM            ATMATM   ATM   ATMATM     |$'
          S_WELC_32 DB        '|   ATMATM      ATMATM            ATMATM            ATMATM   ATM   ATMATM     |$'
          S_WELC_33 DB        '|   ATMATMATMATMATMATM            ATMATM            ATMATM   ATM   ATMATM     |$'
          S_WELC_34 DB        '|   ATMATM      ATMATM            ATMATM            ATMATM         ATMATM     |$'
          S_WELC_35 DB        '|   ATMATM      ATMATM            ATMATM            ATMATM         ATMATM     |$'
          S_WELC_36 DB        '|   ATMATM      ATMATM            ATMATM            ATMATM         ATMATM     |$'
          S_WELC_40 DB        '|     This program is for fun only                                            |$'
          S_WELC_41 DB        '|     I',27H,'m just displaying everything                                          |$'
          S_WELC_42 DB        '|     Cards data is just in a simple CSV file. Cash is unlimited.             |$'
          S_WELC_43 DB        '|     Enjoy~                                                                  |$'
          S_WELC_46 DB        '|                                     Press any key to start...               |$'
          ;free screen
          S_FREE_01 DB        '|   xxxxxxxxxx          xxxx        xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_02 DB        '|   xxxxxxxxxx          xxxx        xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_03 DB        '|   xxxx    xxxx      xxxxxxxx      xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_04 DB        '|   xxxx    xxxx      xxxxxxxx      xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_05 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxx    xxxx   xxxx  xxxx               |$'
          S_FREE_06 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxx    xxxx   xxxx  xxxx               |$'
          S_FREE_07 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxxxx  xxxx   xxxx  xxxx               |$'
          S_FREE_08 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxxxx  xxxx   xxxx  xxxx               |$'
          S_FREE_09 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx  xxxxxxxx   xxxxxxxx                 |$'
          S_FREE_10 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx  xxxxxxxx   xxxxxxxx                 |$'
          S_FREE_11 DB        '|   xxxx    xxxx    xxxxxxxxxxxx    xxxx    xxxxxx   xxxx  xxxx               |$'
          S_FREE_12 DB        '|   xxxx    xxxx    xxxxxxxxxxxx    xxxx    xxxxxx   xxxx  xxxx               |$'
          S_FREE_13 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx  xxxx               |$'
          S_FREE_14 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx  xxxx               |$'
          S_FREE_15 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_16 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_17 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_18 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx      xxxx   xxxx    xxxx             |$'
          S_FREE_20 DB        '|           PLEASE INSERT CARD                                                |$'
          S_FREE_22 DB        '|    yoursunny.com                Current time:   yyyy-MM-dd HH:mm:ss         |$'
;                              01234567890123456789012345678901234567890123456789012345678901234567890123456789
          S_FREE_24 DB        '-----type 00~49 to simulate inserting card, press q to quit--------------------$'
          ;PIN code input screen
        S_CHKPIN_07 DB        '|          Enter your PIN code                                                |$'
;                              01234567890123456789012345678901234567890123456789012345678901234567890123456789
;                   12                             ******
       S_CHKPIN_14W DB        '|             WRONG PIN, PLEASE TRY AGAIN                                     |$'
       S_CHKPIN_14R DB        '|         Too many failed attempts, ejecting card...                          |$'
        S_CHKPIN_16 DB        '|         BACKSPACE to delete, ESCAPE to re-enter, ENTER to confirm           |$'
        S_CHKPIN_22 DB        '|    yoursunny.com                                                            |$'
;                              01234567890123456789012345678901234567890123456789012345678901234567890123456789
        S_CHKPIN_24 DB        '-----CARD#---------------------------------------------------------------------$'
          PIN_LEFT  EQU       20;left column limit of PIN code
          ;proceeding screen
          S_PROC_10 DB        '|                 PROCEEDING... PLEASE WAIT                                   |$'
          ;function screen
          S_FUNC_01 DB        '|   xxxxxxxxxx          xxxx        xxxx      xxxx   xxxx    xxxx             |$'
          S_FUNC_02 DB        '|   xxxxxxxxxx          xxxx        xxxx      xxxx   xxxx    xxxx             |$'
          S_FUNC_03 DB        '|   xxxx    xxxx      xxxxxxxx      xxxx      xxxx   xxxx    xxxx  WITHDRAW=>F1$'
          S_FUNC_04 DB        '|   xxxx    xxxx      xxxxxxxx      xxxx      xxxx   xxxx    xxxx             |$'
          S_FUNC_05 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxx    xxxx   xxxx  xxxx               |$'
          S_FUNC_06 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxx    xxxx   xxxx  xxxx               |$'
          S_FUNC_07 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxxxx  xxxx   xxxx  xxxx    DEPOSIT==>F2$'
          S_FUNC_08 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxxxxxx  xxxx   xxxx  xxxx               |$'
          S_FUNC_09 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx  xxxxxxxx   xxxxxxxx                 |$'
          S_FUNC_10 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx  xxxxxxxx   xxxxxxxx                 |$'
          S_FUNC_11 DB        '|   xxxx    xxxx    xxxxxxxxxxxx    xxxx    xxxxxx   xxxx  xxxx    BALANCE==>F3$'
          S_FUNC_12 DB        '|   xxxx    xxxx    xxxxxxxxxxxx    xxxx    xxxxxx   xxxx  xxxx    QUERY      |$'
          S_FUNC_13 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx  xxxx               |$'
          S_FUNC_14 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx  xxxx               |$'
          S_FUNC_15 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx    xxxx  CHANGE===>F4$'
          S_FUNC_16 DB        '|   xxxx    xxxx    xxxx    xxxx    xxxx      xxxx   xxxx    xxxx  PIN CODE   |$'
          S_FUNC_17 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx      xxxx   xxxx    xxxx             |$'
          S_FUNC_18 DB        '|   xxxxxxxxxx      xxxx    xxxx    xxxx      xxxx   xxxx    xxxx             |$'
          S_FUNC_19 DB        '|                                                                  EJECT====>F5$'
          S_FUNC_20 DB        '|                                                                  CARD       |$'
          S_FUNC_22 DB        '|    yoursunny.com                                                            |$'
          ;eject screen
         S_EJECT_13 DB        '|                 PLEASE TAKE YOUR CARD!!!                                    |$'
          ;choose currency screen
      S_CURRENCY_07 DB        '|                Choose the account you wish to deal with                     |$'
      S_CURRENCY_11 DB        '|                                                            CNY ACCOUNT====>F3$'
      S_CURRENCY_15 DB        '|                                                            USD ACCOUNT====>F4$'
          ;withdraw screen
      S_WITHDRAW_10 DB        '|                How much do you want to withdraw?                            |$'
      S_WITHDRAW_13 DB        '|                 PLEASE TAKE YOUR CASH!!!                                    |$'
     S_WITHDRAW_20B DB        '|                You don',27H,'t have enough money on your account                  |$'
          ;deposit screen
       S_DEPOSIT_10 DB        '|                How much do you want to deposit?                             |$'
       S_DEPOSIT_13 DB        '|            PLEASE PUT CASH INTO ENVELOPE AND INSERT INTO THE SLOT!!         |$'
      S_DEPOSIT_20B DB        '|      You have too much money on your account, you can no longer deposit     |$'
          ;withdraw & deposit screen
          S_WD_11   DB        '|                (Must be a multiply of 50, 1500 at most)                     |$'
          S_WD_20C  DB        '|                Invalid digit detected, try again                            |$'
          S_WD_20E  DB        '|                Amount cannot exceed 1500                                    |$'
          S_WD_20M  DB        '|                Amount must be a multiply of 50                              |$'
          ;balance screen
       S_BALANCE_10 DB        '|               Your account balances are:                                    |$'
       S_BALANCE_13 DB        '|                   CNY   dddddd.dd yuan                                      |$'
;                              01234567890123456789012345678901234567890123456789012345678901234567890123456789
       S_BALANCE_14 DB        '|                   USD   dddddd.dd dollars                                   |$'
       S_BALANCE_19 DB        '|                                                                    DONE===>F5$'
          ;PIN change screen
        S_CHGPIN_07 DB        '|          Enter new PIN code                                                 |$'
       S_CHGPIN_07B DB        '|          Enter new PIN code again                                           |$'
;                              01234567890123456789012345678901234567890123456789012345678901234567890123456789
;                   12                             ******
       S_CHGPIN_14W DB        '|             Two PIN codes not identical                                     |$'
       S_CHGPIN_14S DB        '|             PIN code changed, please remember your new PIN!!!               |$'
       S_CHGPIN_14L DB        '|             PIN code must be 6 digits                                       |$'
        S_CHGPIN_16 DB        '|         BACKSPACE to delete, ESCAPE to re-enter, ENTER to confirm           |$'
        S_CHGPIN_19 DB        '|                                                                  CANCEL===>F5$'
       S_CHGPIN_19S DB        '|                                                                    DONE===>F5$'
        S_CHGPIN_22 DB        '|    yoursunny.com                                                            |$'
DATA      ENDS
;===============================================================================
CODE      SEGMENT
          ASSUME    CS:CODE,DS:DATA
;===============================================================================
;print a CHAR for debug purpose
DEBUG     MACRO     CHAR
          PUSH      AX
          PUSH      DX
          MOV       AH,2
          MOV       DL,CHAR
          INT       21H
          ANYKEY
          POP       DX
          POP       AX
          ENDM
;===============================================================================
;clear the screen, set it to (0,0)-(24,79) mode
CLEARSCR  PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      CX
          PUSH      DX
          MOV       AH,6
          MOV       AL,0
          MOV       CX,0
          MOV       DH,24
          MOV       DL,79
          MOV       BH,7
          INT       10H
          POP       DX
          POP       CX
          POP       BX
          POP       AX
          RET
CLEARSCR  ENDP
;===============================================================================
;display a string at x,y
;input param
;  DS:CX=string, ends with '$'
;  DH=line number
;  DL=column number
DISPSTR   PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      DX
          MOV       AH,2
          MOV       BH,0
          INT       10H
          MOV       AH,9
          MOV       DX,CX
          INT       21H
          POP       DX
          POP       BX
          POP       AX
          RET
DISPSTR   ENDP
;===============================================================================
;display error message and quit program
;input param
;  DS:CX=string, ends with '$'
;  AL=program return value
DISPERR   PROC      FAR
          PUSH      DX
          CALL      CLEARSCR
          MOV       DH,12
          MOV       DL,2
          CALL      DISPSTR
          MOV       AH,4CH
          INT       21H
          POP       DX
          RET
DISPERR   ENDP
;===============================================================================
;display a screen line by line
;start from the first line by MOV DH,0
;input param
;  MSG=pointer to string, ends with $
;destory: CX,DX
LINE      MACRO     MSG
          MOV       DL,0
          LEA       CX,MSG
          CALL      DISPSTR
          INC       DH
          ENDM
;===============================================================================
;display a line at given position
;destory: CX,DX
LINEAT    MACRO     MSG,LN
          MOV       DH,LN
          LINE      MSG
          ENDM
;===============================================================================
;display empty screen
D_EMPTY   PROC      FAR
          PUSH      CX
          PUSH      DX
          MOV       DH,0
          LINE      S_BORDER;00
          LINE      S_EMPTY;01
          LINE      S_EMPTY;02
          LINE      S_EMPTY;03
          LINE      S_EMPTY;04
          LINE      S_EMPTY;05
          LINE      S_EMPTY;06
          LINE      S_EMPTY;07
          LINE      S_EMPTY;08
          LINE      S_EMPTY;09
          LINE      S_EMPTY;09
          LINE      S_EMPTY;09
          LINE      S_EMPTY;12
          LINE      S_EMPTY;13
          LINE      S_EMPTY;14
          LINE      S_EMPTY;15
          LINE      S_EMPTY;16
          LINE      S_EMPTY;17
          LINE      S_EMPTY;18
          LINE      S_EMPTY;19
          LINE      S_EMPTY;20
          LINE      S_EMPTY;21
          LINE      S_EMPTY;22
          LINE      S_EMPTY;23
          LINE      S_BORDER;24
          POP       DX
          POP       CX
          RET
D_EMPTY   ENDP
;===============================================================================
;wait for any key
ANYKEY    MACRO
          PUSH      AX
          MOV       AH,8
          INT       21H
          POP       AX
          ENDM
;===============================================================================
;delay several seconds
DELAY     MACRO     TIME
          PUSH      AX
          MOV       AX,0FFFH
          CALL      DELAYP
          POP       AX
          ENDM
;===============================================================================
;delay
;input param
;  AX=time to delay, actual time depend on CPU speed
;destory: AX
DELAYP    PROC      FAR
          PUSH      CX
DELAYP1:  MOV       CX,0FFFFH
DELAYP2:  LOOP      DELAYP2
          DEC       AX
          JNZ       DELAYP1
          POP       CX
          RET
DELAYP    ENDP
;===============================================================================
;load an entry from the opened data file
;input param
;  DI=destination
;  BX=file number
;output param
;  AL= 0=no more, 1=maybe more, 2=database full
;  DI=next destination
;destory: AH
LOADENTRY PROC      FAR
          PUSH      CX
          PUSH      SI
          MOV       AH,3FH
          MOV       CX,43
          LEA       DX,ENTRYBUF
          INT       21H
          JC        LOADENTRYNOMORE;load error, treat as no more
          LEA       SI,ENTRYBUF
          CMP       BYTE PTR[SI],'-';no more entries
          JE        LOADENTRYNOMORE
          CLD
          MOV       CX,16;card number
          REP       MOVSB
          INC       SI;skip ','
          MOV       CX,6;pin code
          REP       MOVSB
          INC       SI;skip ','
          MOV       CX,8;CNY
          REP       MOVSB
          INC       SI;skip ','
          MOV       CX,8;USD
          REP       MOVSB
          MOV       AL,1
          INC       DATACOUNT
          CMP       DATACOUNT,DATACOUNTMAX
          JAE       LOADENTRYFULL
          JMP       LOADENTRYDONE
LOADENTRYNOMORE:
          MOV       AL,0
          JMP       LOADENTRYDONE
LOADENTRYFULL:
          MOV       AL,2
          JMP       LOADENTRYDONE
LOADENTRYDONE:
          POP       SI
          POP       CX
          RET
LOADENTRY ENDP
;===============================================================================
;load DATABASE from file
;data file format
;an entry per line (43 bytes)
;card number(16 digits),pin code(6 digits),
;CNY balance(8 digits,unit:fen),USD balance(8 digits,unit:cent)<crlf>
;at most DATACOUNTMAX entries, last line should begin with a single '-'
LOADDATA  PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      DX
          PUSH      DI
          MOV       AH,3DH;open file
          MOV       AL,0
          LEA       DX,DATAFILE
          INT       21H
          JC        LOADDATAOPEN;open file failure
LOADDATAOPENOK:
          MOV       BX,AX
          MOV       DATACOUNT,0
          LEA       DI,DATABASE
LOADDATANEXT:;load entries
          CALL      LOADENTRY
          CMP       AL,1
          JE        LOADDATANEXT
          MOV       AH,3EH;close file
          INT       21H
          JMP       LOADDATADONE
LOADDATAOPEN:
          LEA       CX,DATAOPENMSG
          MOV       AL,1
          CALL      DISPERR
LOADDATADONE:
          POP       DI
          POP       DX
          POP       BX
          POP       AX
          RET
LOADDATA  ENDP
;===============================================================================
;store entry to file
;input param
;  SI=source
;  BX=file number
;output param
;  SI=next source
STORENTRY PROC      FAR
          PUSH      AX
          PUSH      CX
          PUSH      DI
          CLD
          LEA       DI,ENTRYBUF
          MOV       AL,','
          MOV       CX,16;card number
          REP       MOVSB
          STOSB;add ','
          MOV       CX,6;pin code
          REP       MOVSB
          STOSB;add ','
          MOV       CX,8;CNY
          REP       MOVSB
          STOSB;add ','
          MOV       CX,8;USD
          REP       MOVSB
          MOV       AL,0DH
          STOSB
          MOV       AL,0AH
          STOSB
          MOV       AH,40H;write to file
          MOV       CX,43
          LEA       DX,ENTRYBUF
          INT       21H
          POP       DI
          POP       CX
          POP       AX
          RET
STORENTRY ENDP
;===============================================================================
;store DATABASE to file
STORDATA  PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      CX
          PUSH      DX
          PUSH      SI
          MOV       AH,3CH;create file
          MOV       CX,0
          LEA       DX,DATAFILE
          INT       21H
          JC        STORDATAOPEN;open file failure
          MOV       BX,AX
          MOV       CH,0
          MOV       CL,[DATACOUNT]
          LEA       SI,DATABASE
STORDATANEXT:;load entries
          CALL      STORENTRY
          DEC       CX
          JNZ       STORDATANEXT
          MOV       AH,40H;write '-'
          MOV       CX,1
          LEA       DX,DATAEND
          INT       21H
          MOV       AH,3EH;close file
          INT       21H
          JMP       STORDATADONE
STORDATAOPEN:
          LEA       CX,DATAOPENMSG
          MOV       AL,1
          CALL      DISPERR
STORDATADONE:
          POP       SI
          POP       DX
          POP       BX
          POP       CX
          POP       AX
          RET
STORDATA  ENDP
;===============================================================================
;display welcome screen and wait for key
D_WELC    PROC      FAR
          PUSH      CX
          PUSH      DX
          MOV       DH,0
          LINE      S_BORDER;00
          LINE      S_EMPTY;01
          LINE      S_EMPTY;02
          LINE      S_EMPTY;03
          LINE      S_WELC_04
          LINE      S_WELC_05
          LINE      S_WELC_06
          LINE      S_WELC_07
          LINE      S_WELC_08
          LINE      S_WELC_09
          LINE      S_WELC_10
          LINE      S_WELC_11
          LINE      S_WELC_12
          LINE      S_WELC_13
          LINE      S_EMPTY;14
          LINE      S_EMPTY;15
          LINE      S_EMPTY;16
          LINE      S_WELC_17
          LINE      S_WELC_18
          LINE      S_WELC_19
          LINE      S_WELC_20
          LINE      S_WELC_21
          LINE      S_WELC_22
          LINE      S_EMPTY;23
          LINE      S_BORDER;24
          ANYKEY
          MOV       DH,0
          LINE      S_BORDER;25
          LINE      S_EMPTY;26
          LINE      S_EMPTY;27
          LINE      S_WELC_28
          LINE      S_WELC_29
          LINE      S_WELC_30
          LINE      S_WELC_31
          LINE      S_WELC_32
          LINE      S_WELC_33
          LINE      S_WELC_34
          LINE      S_WELC_35
          LINE      S_WELC_36
          LINE      S_EMPTY;37
          LINE      S_EMPTY;38
          LINE      S_EMPTY;39
          LINE      S_WELC_40
          LINE      S_WELC_41
          LINE      S_WELC_42
          LINE      S_WELC_43
          LINE      S_EMPTY;44
          LINE      S_EMPTY;45
          LINE      S_EMPTY;46
          LINE      S_EMPTY;47
          LINE      S_EMPTY;48
          LINE      S_BORDER;49
          ANYKEY
          POP       DX
          POP       CX
          RET
D_WELC    ENDP
;===============================================================================
;update free screen date
D_FREETIM PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      CX
          PUSH      DX
          MOV       AH,2AH;get date
          INT       21H
          MOV       AX,CX;year digit 1
          MOV       CX,DX
          MOV       DX,0
          MOV       BX,1000
          DIV       BX
          OR        AL,30H
          MOV       D_FREETIMBUF[0],AL
          MOV       AX,DX;year digit 2
          MOV       BL,100
          DIV       BL
          OR        AL,30H
          MOV       D_FREETIMBUF[1],AL
          MOV       AL,AH;year digit 3,4
          MOV       AH,0
          MOV       BL,10
          DIV       BL
          OR        AX,3030H
          MOV       D_FREETIMBUF[2],AL
          MOV       D_FREETIMBUF[3],AH
          MOV       AL,CH;month
          MOV       AH,0
          MOV       BL,10
          DIV       BL
          OR        AX,3030H
          MOV       D_FREETIMBUF[5],AL
          MOV       D_FREETIMBUF[6],AH
          MOV       AL,CL;date of month
          MOV       AH,0
          MOV       BL,10
          DIV       BL
          OR        AX,3030H
          MOV       D_FREETIMBUF[8],AL
          MOV       D_FREETIMBUF[9],AH
          MOV       AH,2CH;get time
          INT       21H
          MOV       AL,CH;hour
          MOV       AH,0
          MOV       BL,10
          DIV       BL
          OR        AX,3030H
          MOV       D_FREETIMBUF[11],AL
          MOV       D_FREETIMBUF[12],AH
          MOV       AL,CL;minute
          MOV       AH,0
          MOV       BL,10
          DIV       BL
          OR        AX,3030H
          MOV       D_FREETIMBUF[14],AL
          MOV       D_FREETIMBUF[15],AH
          MOV       AL,DH;second
          MOV       AH,0
          MOV       BL,10
          DIV       BL
          OR        AX,3030H
          MOV       D_FREETIMBUF[17],AL
          MOV       D_FREETIMBUF[18],AH
          LEA       CX,D_FREETIMBUF
          MOV       DH,22
          MOV       DL,50
          CALL      DISPSTR
          POP       DX
          POP       CX
          POP       BX
          POP       AX
          RET
D_FREETIM ENDP
;===============================================================================
;display free screen
D_FREE    PROC      FAR
          PUSH      AX
          PUSH      CX
          PUSH      DX
          MOV       AH,0;display upper bound
          MOV       AL,DATACOUNT
          DEC       AL
          MOV       CL,10
          DIV       CL
          OR        AX,3030H
          MOV       S_FREE_24[13],AL
          MOV       S_FREE_24[14],AH
          MOV       DH,0
          LINE      S_BORDER;00
          LINE      S_FREE_01
          LINE      S_FREE_02
          LINE      S_FREE_03
          LINE      S_FREE_04
          LINE      S_FREE_05
          LINE      S_FREE_06
          LINE      S_FREE_07
          LINE      S_FREE_08
          LINE      S_FREE_09
          LINE      S_FREE_10
          LINE      S_FREE_11
          LINE      S_FREE_12
          LINE      S_FREE_13
          LINE      S_FREE_14
          LINE      S_FREE_15
          LINE      S_FREE_16
          LINE      S_FREE_17
          LINE      S_FREE_18
          LINE      S_EMPTY;_19
          LINE      S_FREE_20
          LINE      S_EMPTY;21
          LINE      S_FREE_22
          LINE      S_EMPTY;23
          LINE      S_FREE_24
          CALL      D_FREETIM
          POP       DX
          POP       CX
          POP       AX
          RET
D_FREE    ENDP
;===============================================================================
;loop while free, waiting for card insert or quit
;output param
;  AL=card number (00~49 binary), or FFH to quit
;destory: AH
FREELOOP  PROC      FAR
          PUSH      BX
          CALL      D_FREE
          MOV       BL,0FFH;will contain previous pressed key later,FFH for none
FREELOOPNEXT:
          CALL      D_FREETIM
          MOV       AH,1;get key from buffer
          INT       16H;this INT doesn't remove key from buffer!
          JZ        FREELOOPNEXT;no key pressed
          MOV       AH,0;remove key from buffer
          INT       16H
          CMP       AL,'q'
          JE        FREELOOPQUIT
          CMP       AL,'Q'
          JE        FREELOOPQUIT
          CMP       BL,0FFH
          JNZ       FREELOOPHASPREV
          CMP       AL,'0';first digit must between 0~4
          JB        FREELOOPNEXT
          CMP       AL,'4'
          JA        FREELOOPNEXT
          MOV       BL,AL
          JMP       FREELOOPNEXT
FREELOOPHASPREV:
          CMP       AL,'0';second digit must between 0~9
          JB        FREELOOPNEXT
          CMP       AL,'9'
          JA        FREELOOPNEXT
          ;now checked that digits are valid, and they are in (BL,AL)
          MOV       BH,AL
          AND       BX,0F0FH
          MOV       AL,BL
          MOV       BL,10
          MUL       BL
          ADD       AL,BH
          JMP       FREELOOPDONE
FREELOOPQUIT:
          MOV       AL,0FFH
          JMP       FREELOOPDONE
FREELOOPDONE:
          POP       BX
          RET
FREELOOP  ENDP
;===============================================================================
;display proceeding screen
D_PROC    PROC      FAR
          PUSH      CX
          PUSH      DX
          CALL      D_EMPTY
          LINEAT    S_PROC_10,10
          POP       DX
          POP       CX
          RET
D_PROC    ENDP
;===============================================================================
;display PIN input screen
D_CHKPIN  PROC      FAR
          PUSH      BX
          PUSH      CX
          PUSH      DX
          PUSH      SI
          PUSH      DI
          MOV       BX,CARDOFF
          LEA       SI,DATABASE.NUMBER[BX]
          LEA       DI,S_CHKPIN_24[10]
          MOV       CX,16
          CLD
          REP       MOVSB
          CALL      D_EMPTY
          LINEAT    S_CHKPIN_07,7
          LINEAT    S_CHKPIN_16,16
          LINEAT    S_CHKPIN_22,22
          LINEAT    S_CHKPIN_24,24
          POP       DI
          POP       SI
          POP       DX
          POP       CX
          POP       BX
          RET
D_CHKPIN  ENDP
;===============================================================================
;input 6 byte PIN code, fill 0 in extra buffer bytes
;input param
;  BL&01H= 0=normal 1=allow cancel by F5
;output param
;  AL= 0=ok 1=cancel by F5 2=clear by ESC
;  AH=length
;  [PINCODE]=PIN code
GETPIN    PROC      FAR
          PUSH      BX
          PUSH      CX
          PUSH      DX
          PUSH      DI
          LEA       DI,PINCODE
          MOV       AL,0
          MOV       CX,6
          CLD
          REP       STOSB
          LEA       DI,PINCODE
          MOV       AH,2;move cursor to ******
          MOV       BH,0
          MOV       DH,12
          MOV       DL,PIN_LEFT
          INT       10H
GETPINL:  MOV       AH,0;input digit
          INT       16H
          TEST      BL,01H
          JZ        GETPINNOCANCEL
          CMP       AH,3FH;is cancel F5?
          JNE       GETPINNOCANCEL
          JMP       GETPINCANCEL
GETPINNOCANCEL:
          CMP       AH,01H;is escape?
          JE        GETPINESC
          CMP       AH,0EH;is backspace?
          JE        GETPINDEL
          CMP       AH,1CH;is enter?
          JE        GETPINOK
          CMP       AL,'0';is digit?
          JB        GETPINL
          CMP       AL,'9'
          JA        GETPINL
          CMP       DL,PIN_LEFT+6;is full?
          JAE       GETPINL
          STOSB
          PUSH      DX
          MOV       AH,2;display '*'
          MOV       DL,'*'
          INT       21H
          POP       DX
          INC       DL
          JMP       GETPINL
GETPINDEL:
          CMP       DL,PIN_LEFT;is at left limit?
          JBE       GETPINL
          DEC       DI;move buffer pointer back
          DEC       DL;move cursor back
          MOV       AH,2
          MOV       BH,0
          INT       10H
          PUSH      DX
          MOV       AH,6;remove '*'
          MOV       DL,' '
          INT       21H
          POP       DX
          MOV       AH,2;move cursor back
          MOV       BH,0
          INT       10H
          JMP       GETPINL
GETPINOK:
          MOV       AL,0
          MOV       AH,DL
          JMP       GETPINDONE
GETPINCANCEL:
          MOV       AL,1
          JMP       GETPINDONE
GETPINESC:
          MOV       AL,2
          JMP       GETPINDONE
GETPINDONE:
          POP       DI
          POP       DX
          POP       CX
          POP       BX
          RET
GETPIN    ENDP
;===============================================================================
;input and check PIN code
;output param
;  AL= 0=OK, 1=fail
;destory: AH
CHKPIN    PROC      FAR
          PUSH      BX
          PUSH      CX
          PUSH      DX
          PUSH      SI
          PUSH      DI
          MOV       BH,3;max attempts
CHKPINST: CALL      D_CHKPIN
          CMP       BH,3
          JE        CHKPINFIRST
          PUSH      DX
          MOV       DH,14
          LINE      S_CHKPIN_14W
          POP       DX
          MOV       BL,00H;don't allow cancel
CHKPINFIRST:
          CALL      GETPIN
          MOV       DL,AH
          CMP       AL,2;clear by ESC
          JE        CHKPINST
          CALL      D_PROC
          DELAY
          CMP       DL,PIN_LEFT+6;is 6 digits long?
          JNE       CHKPINFAIL
          PUSH      BX
          MOV       BX,CARDOFF;compare
          LEA       SI,DATABASE.PIN[BX]
          POP       BX
          LEA       DI,PINCODE
          CLD
          MOV       CX,6
          REPE      CMPSB
          JNE       CHKPINFAIL
          CMP       CX,0
          JZ        CHKPINOK
          JMP       CHKPINFAIL
CHKPINFAIL:
          DEC       BH
          JZ        CHKPINOVER
          JMP       CHKPINST
CHKPINOVER:
          LINEAT    S_CHKPIN_14R,14
          DELAY
          LINEAT    S_EMPTY,14
          DELAY
          LINEAT    S_CHKPIN_14R,14
          DELAY
          MOV       AL,1
          JMP       CHKPINDONE
CHKPINOK: MOV       AL,0
          JMP       CHKPINDONE
CHKPINDONE:
          POP       DI
          POP       SI
          POP       DX
          POP       CX
          POP       BX
          RET
CHKPIN    ENDP
;===============================================================================
;display function screen
D_FUNC    PROC      FAR
          PUSH      CX
          PUSH      DX
          MOV       DH,0
          LINE      S_BORDER;00
          LINE      S_FUNC_01
          LINE      S_FUNC_02
          LINE      S_FUNC_03
          LINE      S_FUNC_04
          LINE      S_FUNC_05
          LINE      S_FUNC_06
          LINE      S_FUNC_07
          LINE      S_FUNC_08
          LINE      S_FUNC_09
          LINE      S_FUNC_10
          LINE      S_FUNC_11
          LINE      S_FUNC_12
          LINE      S_FUNC_13
          LINE      S_FUNC_14
          LINE      S_FUNC_15
          LINE      S_FUNC_16
          LINE      S_FUNC_17
          LINE      S_FUNC_18
          LINE      S_FUNC_19
          LINE      S_FUNC_20
          LINE      S_EMPTY;21
          LINE      S_FUNC_22
          LINE      S_EMPTY;23
          LINE      S_BORDER;24
          POP       DX
          POP       CX
          RET
D_FUNC    ENDP
;===============================================================================
;choose currency step
;output param
;  [ACCOUNT]= 22=CNY,30=USD
;  22 and 30 are offsets of balance item in CARDENTRY struct
CURRENCY  PROC      FAR
          PUSH      AX
          PUSH      CX
          PUSH      DX
          CALL      D_EMPTY
          LINEAT    S_CURRENCY_07,7
          LINEAT    S_CURRENCY_11,11
          LINEAT    S_CURRENCY_15,15
CURRENCYKEY:
          MOV       AH,0;get key
          INT       16H
          CMP       AH,3DH;is F3 CNY?
          JE        CURRENCYCNY
          CMP       AH,3EH;is F4 USD?
          JE        CURRENCYUSD
          JMP       CURRENCYKEY
CURRENCYCNY:
          MOV       [ACCOUNT],22
          JMP       CURRENCYDONE
CURRENCYUSD:
          MOV       [ACCOUNT],30
          JMP       CURRENCYDONE
CURRENCYDONE:
          POP       DX
          POP       CX
          POP       AX
          RET
CURRENCY  ENDP
;===============================================================================
;display withdraw & deposit screens
D_WD      MACRO     L10,L20
          PUSH      CX
          PUSH      DX
          CALL      D_EMPTY
          LINEAT    L10,10
          LINEAT    S_WD_11,11
          LINEAT    L20,20
          POP       DX
          POP       CX
          ENDM
;===============================================================================
;request amount input, check numeric, <=1500 and multiply of 50
;output param
;  AL= 0=ok, 1=no input, 2=not numeric, 3=exceed 1500, 4=not multiply of 50
;  [AMOUNT]=amount (ASCII or BCD)
;destory: AH
GETAMOUNT PROC      FAR
          PUSH      CX
          PUSH      SI
          PUSH      DI
GETAMOUNTINPUT:
          MOV       AH,2;move cursor
          MOV       BH,0
          MOV       DH,15
          MOV       DL,40
          INT       10H
          MOV       AH,0AH
          LEA       DX,AMOUNTBUF
          INT       21H
          MOV       CL,AMOUNTBUF[1]
          JNZ       GETAMOUNTINPUTED
          JMP       GETAMOUNTNOINPUT
GETAMOUNTINPUTED:
          CLD
          LEA       SI,AMOUNTBUF
          ADD       SI,2
GETAMOUNTDIGIT:
          LODSB
          CMP       AL,'0'
          JB        GETAMOUNTINVALID
          CMP       AL,'9'
          JA        GETAMOUNTINVALID
          DEC       CL
          JNZ       GETAMOUNTDIGIT
          ;ensured numeric
          MOV       CL,4;shift to rightmost bytes
          SUB       CL,AMOUNTBUF[1]
          JZ        GETAMOUNTSHIFTDONE
GETAMOUNTSHIFT:
          MOV       AL,AMOUNTBUF[4]
          MOV       AMOUNTBUF[5],AL
          MOV       AL,AMOUNTBUF[3]
          MOV       AMOUNTBUF[4],AL
          MOV       AL,AMOUNTBUF[2]
          MOV       AMOUNTBUF[3],AL
          MOV       AMOUNTBUF[2],'0'
          DEC       CL
          JNZ       GETAMOUNTSHIFT
GETAMOUNTSHIFTDONE:
          CMP       AMOUNTBUF[5],'0'
          JNE       GETAMOUNTNO50
          CMP       AMOUNTBUF[4],'5'
          JE        GETAMOUNTOK50
          CMP       AMOUNTBUF[4],'0'
          JNE       GETAMOUNTNO50
GETAMOUNTOK50:
          ;ensured multiply of 50
          CMP       AMOUNTBUF[2],'1'
          JA        GETAMOUNTE1500
          JB        GETAMOUNTOK
          CMP       AMOUNTBUF[3],'5'
          JA        GETAMOUNTE1500
          JB        GETAMOUNTOK
          CMP       AMOUNTBUF[4],'0'
          JA        GETAMOUNTE1500
GETAMOUNTOK:
          LEA       SI,AMOUNTBUF;copy to [AMOUNT]
          ADD       SI,2
          LEA       DI,AMOUNT
          MOV       CX,4
          REP       MOVSB
          MOV       AL,0
          JMP       GETAMOUNTDONE
GETAMOUNTNOINPUT:
          MOV       AL,1
          JMP       GETAMOUNTDONE
GETAMOUNTINVALID:
          MOV       AL,2
          JMP       GETAMOUNTDONE
GETAMOUNTE1500:
          MOV       AL,3
          JMP       GETAMOUNTDONE
GETAMOUNTNO50:
          MOV       AL,4
          JMP       GETAMOUNTDONE
GETAMOUNTDONE:
          POP       DI
          POP       SI
          POP       CX
          RET
GETAMOUNT ENDP
;===============================================================================
;withdraw function
WITHDRAW  PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      CX
          PUSH      DX
          CALL      CURRENCY
          D_WD      S_WITHDRAW_10,S_EMPTY
WITHDRAWINPUT:
          CALL      GETAMOUNT
          CMP       AL,0
          JNE       WITHDRAWINPUTNOTOK
          JMP       WITHDRAWINPUTOK
WITHDRAWINPUTNOTOK:
          CMP       AL,1
          JNE       WITHDRAWINPUTERR
          JMP       WITHDRAWDONE;no input,cancel
WITHDRAWINPUTERR:
          CMP       AL,3
          JB        WITHDRAWINPUTERR2
          JE        WITHDRAWINPUTERR3
          JMP       WITHDRAWINPUTERR4
WITHDRAWINPUTERR2:
          D_WD      S_WITHDRAW_10,S_WD_20C
          JMP       WITHDRAWINPUT
WITHDRAWINPUTERR3:
          D_WD      S_WITHDRAW_10,S_WD_20E
          JMP       WITHDRAWINPUT
WITHDRAWINPUTERR4:
          D_WD      S_WITHDRAW_10,S_WD_20M
          JMP       WITHDRAWINPUT
WITHDRAWINPUTOK:
          ;input ok, but is there enough money?
          ;put balance-AMOUNT (unit:yuan or dollar) into (BH,BL,CH,CL,DH,DL)
          LEA       SI,DATABASE
          ADD       SI,CARDOFF
          ADD       SI,ACCOUNT
          ADD       SI,5
          STD
          LODSB
          MOV       AH,AMOUNT[3]
          AND       AH,0FH
          SUB       AL,AH
          AAS
          PUSHF
          MOV       DL,AL
          LODSB
          MOV       AH,AMOUNT[2]
          AND       AH,0FH
          POPF
          SBB       AL,AH
          AAS
          PUSHF
          MOV       DH,AL
          LODSB
          MOV       AH,AMOUNT[1]
          AND       AH,0FH
          POPF
          SBB       AL,AH
          AAS
          PUSHF
          MOV       CL,AL
          LODSB
          MOV       AH,AMOUNT[0]
          AND       AH,0FH
          POPF
          SBB       AL,AH
          AAS
          PUSHF
          MOV       CH,AL
          LODSB
          POPF
          SBB       AL,0
          AAS
          PUSHF
          MOV       BL,AL
          LODSB
          POPF
          SBB       AL,0
          AAS
          PUSHF
          MOV       BH,AL
          POPF
          JNC       WITHDRAWOK;needn't borrow at MSB, enough
          JMP       WITHDRAWNOTENOUGH
WITHDRAWOK:
          ;save balance-AMOUNT into DATABASE
          LEA       DI,DATABASE
          ADD       DI,CARDOFF
          ADD       DI,ACCOUNT
          CLD
          MOV       AL,BH
          OR        AL,30H
          STOSB
          MOV       AL,BL
          OR        AL,30H
          STOSB
          MOV       AL,CH
          OR        AL,30H
          STOSB
          MOV       AL,CL
          OR        AL,30H
          STOSB
          MOV       AL,DH
          OR        AL,30H
          STOSB
          MOV       AL,DL
          OR        AL,30H
          STOSB
          ;let's output cash
          CALL      D_PROC
          MOV       AX,3;flashing
WITHDRAWW:
          LINEAT    S_WITHDRAW_13,13
          DELAY
          LINEAT    S_EMPTY,13
          DELAY
          DEC       AX
          JNZ       WITHDRAWW
          JMP       WITHDRAWDONE
WITHDRAWNOTENOUGH:
          D_WD      S_WITHDRAW_10,S_WITHDRAW_20B
          JMP       WITHDRAWINPUT
WITHDRAWDONE:
          POP       DX
          POP       CX
          POP       BX
          POP       AX
          RET
WITHDRAW  ENDP
;===============================================================================
;deposit function
DEPOSIT   PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      CX
          PUSH      DX
          CALL      CURRENCY
          D_WD      S_DEPOSIT_10,S_EMPTY
DEPOSITINPUT:
          CALL      GETAMOUNT
          CMP       AL,0
          JNE       DEPOSITINPUTNOTOK
          JMP       DEPOSITINPUTOK
DEPOSITINPUTNOTOK:
          CMP       AL,1
          JNE       DEPOSITINPUTERR
          JMP       DEPOSITDONE;no input,cancel
DEPOSITINPUTERR:
          CMP       AL,3
          JB        DEPOSITINPUTERR2
          JE        DEPOSITINPUTERR3
          JMP       DEPOSITINPUTERR4
DEPOSITINPUTERR2:
          D_WD      S_DEPOSIT_10,S_WD_20C
          JMP       DEPOSITINPUT
DEPOSITINPUTERR3:
          D_WD      S_DEPOSIT_10,S_WD_20E
          JMP       DEPOSITINPUT
DEPOSITINPUTERR4:
          D_WD      S_DEPOSIT_10,S_WD_20M
          JMP       DEPOSITINPUT
DEPOSITINPUTOK:
          ;input ok, but may account exceed?
          ;put balance+AMOUNT (unit:yuan or dollar) into (BH,BL,CH,CL,DH,DL)
          LEA       SI,DATABASE
          ADD       SI,CARDOFF
          ADD       SI,ACCOUNT
          ADD       SI,5
          STD
          LODSB
          MOV       AH,AMOUNT[3]
          AND       AH,0FH
          ADD       AL,AH
          AAA
          PUSHF
          MOV       DL,AL
          LODSB
          MOV       AH,AMOUNT[2]
          AND       AH,0FH
          POPF
          ADC       AL,AH
          AAA
          PUSHF
          MOV       DH,AL
          LODSB
          MOV       AH,AMOUNT[1]
          AND       AH,0FH
          POPF
          ADC       AL,AH
          AAA
          PUSHF
          MOV       CL,AL
          LODSB
          MOV       AH,AMOUNT[0]
          AND       AH,0FH
          POPF
          ADC       AL,AH
          AAA
          PUSHF
          MOV       CH,AL
          LODSB
          POPF
          ADC       AL,0
          AAA
          PUSHF
          MOV       BL,AL
          LODSB
          POPF
          ADC       AL,0
          AAA
          PUSHF
          MOV       BH,AL
          POPF
          JNC       DEPOSITOK;no carry at MSB, ok
          JMP       DEPOSITEXCEED
DEPOSITOK:
          ;save balance+AMOUNT into DATABASE
          LEA       DI,DATABASE
          ADD       DI,CARDOFF
          ADD       DI,ACCOUNT
          CLD
          MOV       AL,BH
          OR        AL,30H
          STOSB
          MOV       AL,BL
          OR        AL,30H
          STOSB
          MOV       AL,CH
          OR        AL,30H
          STOSB
          MOV       AL,CL
          OR        AL,30H
          STOSB
          MOV       AL,DH
          OR        AL,30H
          STOSB
          MOV       AL,DL
          OR        AL,30H
          STOSB
          ;let's output cash
          CALL      D_PROC
          MOV       AX,3;flashing
DEPOSITW:
          LINEAT    S_DEPOSIT_13,13
          DELAY
          LINEAT    S_EMPTY,13
          DELAY
          DEC       AX
          JNZ       DEPOSITW
          JMP       DEPOSITDONE
DEPOSITEXCEED:
          D_WD      S_DEPOSIT_10,S_DEPOSIT_20B
          JMP       DEPOSITINPUT
DEPOSITDONE:
          POP       DX
          POP       CX
          POP       BX
          POP       AX
          RET
DEPOSIT   ENDP
;===============================================================================
;balance function
BALANCE   PROC      FAR
          PUSH      CX
          PUSH      DX
          PUSH      SI
          PUSH      DI
          CALL      D_PROC
          DELAY
          LEA       SI,DATABASE
          ADD       SI,CARDOFF
          ADD       SI,22;CNY
          LEA       DI,S_BALANCE_13
          ADD       DI,26
          MOV       CX,6
          REP       MOVSB
          INC       DI;skip '.'
          MOV       CX,2
          REP       MOVSB
          LEA       DI,S_BALANCE_14;USD
          ADD       DI,26
          MOV       CX,6
          REP       MOVSB
          INC       DI;skip '.'
          MOV       CX,2
          REP       MOVSB
          CALL      D_EMPTY
          LINEAT    S_BALANCE_10,10
          LINEAT    S_BALANCE_13,13
          LINEAT    S_BALANCE_14,14
          LINEAT    S_BALANCE_19,19
BALANCEK: MOV       AH,0
          INT       16H
          CMP       AH,3FH;wait for F5
          JE        BALANCEDONE
          JMP       BALANCEK
BALANCEDONE:
          POP       DI
          POP       SI
          POP       DX
          POP       CX
          RET
BALANCE   ENDP
;===============================================================================
;display chgpin screen
D_CHGPIN  MACRO     L07,L14,L19
          PUSH      CX
          PUSH      DX
          CALL      D_EMPTY
          LINEAT    L07,7
          LINEAT    L14,14
          LINEAT    S_CHGPIN_16,16
          LINEAT    L19,19
          LINEAT    S_CHGPIN_22,22
          POP       DX
          POP       CX
          ENDM
;===============================================================================
;chgpin function
CHGPIN    PROC      FAR
          PUSH      AX
          PUSH      BX
          PUSH      CX
          PUSH      SI
          PUSH      DI
CHGPIN1ST:
          D_CHGPIN  S_CHGPIN_07,S_EMPTY,S_CHGPIN_19
CHGPIN1IN:
          MOV       BL,01H;allow cancel
          CALL      GETPIN
          CMP       AL,1
          JA        CHGPIN1ST;ESC
          JB        CHGPIN1INPUT
          JMP       CHGPINDONE;cancel
CHGPIN1INPUT:
          CMP       AH,PIN_LEFT+6;ensure length=6
          JNE       CHGPIN1LEN
          LEA       SI,PINCODE;copy to buffer, need compare later
          LEA       DI,CHGPINBUF
          MOV       CX,6
          REP       MOVSB
          JMP       CHGPIN2ST
CHGPIN1LEN:
          D_CHGPIN  S_CHGPIN_07,S_CHGPIN_14L,S_CHGPIN_19
          JMP       CHGPIN1IN
CHGPIN2ST:
          D_CHGPIN  S_CHGPIN_07B,S_EMPTY,S_CHGPIN_19
CHGPIN2IN:
          MOV       BL,01H;allow cancel
          CALL      GETPIN
          CMP       AL,1
          JA        CHGPIN2ST;ESC
          JB        CHGPIN2INPUT
          JMP       CHGPINDONE;cancel
CHGPIN2INPUT:
          CMP       AH,PIN_LEFT+6;ensure length=6
          JNE       CHGPINW
          LEA       SI,PINCODE;compare
          LEA       DI,CHGPINBUF
          CLD
          MOV       CX,6
          REPE      CMPSB
          CMP       CX,0
          JNZ       CHGPINW
          JMP       CHGPINOK
CHGPINW:  D_CHGPIN  S_CHGPIN_07,S_CHGPIN_14W,S_CHGPIN_19
          JMP       CHGPIN1IN
CHGPINOK: LEA       SI,PINCODE;save to DATABASE
          LEA       DI,DATABASE
          ADD       DI,CARDOFF
          ADD       DI,16;points to PIN
          CLD
          MOV       CX,6
          REP       MOVSB
          D_CHGPIN  S_CHGPIN_07,S_CHGPIN_14S,S_CHGPIN_19S
CHGPINK:  MOV       AH,0
          INT       16H
          CMP       AH,3FH;wait for F5
          JE        CHGPINDONE
          JMP       CHGPINK
CHGPINDONE:
          POP       DI
          POP       SI
          POP       CX
          POP       BX
          POP       AX
          RET
CHGPIN    ENDP
;===============================================================================
;eject function
EJECT     PROC      FAR
          PUSH      AX
          PUSH      CX
          PUSH      DX
          CALL      D_PROC
          MOV       AX,3;flashing
EJECTW:   LINEAT    S_EJECT_13,13
          DELAY
          LINEAT    S_EMPTY,13
          DELAY
          DEC       AX
          JNZ       EJECTW
          POP       DX
          POP       CX
          POP       AX
          RET
EJECT     ENDP
;===============================================================================
;card function loop
CARDLOOP  PROC      FAR
          PUSH      AX
CARDLOOPNEXT:
          CALL      D_FUNC
          MOV       AH,0;get key
          INT       16H
          CMP       AH,3BH;is F1 withdraw?
          JE        CARDLOOPWITHDRAW
          CMP       AH,3CH;is F2 deposit?
          JE        CARDLOOPDEPOSIT
          CMP       AH,3DH;is F3 balance?
          JE        CARDLOOPBALANCE
          CMP       AH,3EH;is F4 chgpin?
          JE        CARDLOOPCHGPIN
          CMP       AH,3FH;is F5 eject?
          JE        CARDLOOPEJECT
          JMP       CARDLOOPNEXT
CARDLOOPWITHDRAW:
          CALL      WITHDRAW
          JMP       CARDLOOPNEXT
CARDLOOPDEPOSIT:
          CALL      DEPOSIT
          JMP       CARDLOOPNEXT
CARDLOOPBALANCE:
          CALL      BALANCE
          JMP       CARDLOOPNEXT
CARDLOOPCHGPIN:
          CALL      CHGPIN
          JMP       CARDLOOPNEXT
CARDLOOPEJECT:
          CALL      EJECT
          JMP       CARDLOOPQUIT
CARDLOOPQUIT:
          POP       AX
          RET
CARDLOOP  ENDP
;===============================================================================
MAIN      PROC      FAR
START:    PUSH      DS
          SUB       AX,AX
          PUSH      AX
          MOV       AX,DATA
          MOV       DS,AX
          MOV       ES,AX
          CALL      D_WELC
          CALL      LOADDATA
MAINFREE: CALL      FREELOOP
          CMP       AL,0FFH
          JE        MAINQUIT
          CMP       AL,DATACOUNT
          JAE       MAINFREE;no such card
          MOV       CARDID,AL
          MOV       BL,CARDENTRYLEN
          MUL       BL
          MOV       CARDOFF,AX
          CALL      CHKPIN
          CMP       AL,0
          JNE       MAINFREE
          CALL      CARDLOOP
          JMP       MAINFREE
MAINQUIT: CALL      CLEARSCR
          CALL      STORDATA
          MOV       AX,4C00H
          INT       21H
          RET
MAIN      ENDP
;===============================================================================
CODE      ENDS
          END       START