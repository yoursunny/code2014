VERSION 5.00
Begin VB.Form create 
   Caption         =   "coolman password"
   ClientHeight    =   3585
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   4680
   LinkTopic       =   "Form1"
   ScaleHeight     =   3585
   ScaleWidth      =   4680
   StartUpPosition =   3  'Windows Default
   Begin VB.TextBox txeml 
      Height          =   285
      Left            =   1200
      TabIndex        =   9
      Top             =   3120
      Width           =   3375
   End
   Begin VB.CommandButton cmdcalc 
      Caption         =   "/\ calculate /\"
      Height          =   375
      Left            =   1200
      TabIndex        =   7
      Top             =   1920
      Width           =   1695
   End
   Begin VB.TextBox txnum 
      Height          =   285
      Left            =   1200
      TabIndex        =   6
      Top             =   2760
      Width           =   3375
   End
   Begin VB.TextBox txname 
      Height          =   285
      Left            =   1200
      TabIndex        =   5
      Top             =   2400
      Width           =   3375
   End
   Begin VB.TextBox txpw 
      Height          =   765
      Left            =   1200
      MultiLine       =   -1  'True
      TabIndex        =   4
      Top             =   960
      Width           =   3375
   End
   Begin VB.Label lbnote 
      Caption         =   "email"
      Height          =   255
      Index           =   4
      Left            =   120
      TabIndex        =   8
      Top             =   3120
      Width           =   975
   End
   Begin VB.Label lbnote 
      Caption         =   "number"
      Height          =   255
      Index           =   3
      Left            =   120
      TabIndex        =   3
      Top             =   2760
      Width           =   975
   End
   Begin VB.Label lbnote 
      Caption         =   "name"
      Height          =   255
      Index           =   2
      Left            =   120
      TabIndex        =   2
      Top             =   2400
      Width           =   975
   End
   Begin VB.Label lbnote 
      Caption         =   "password"
      Height          =   255
      Index           =   1
      Left            =   120
      TabIndex        =   1
      Top             =   960
      Width           =   975
   End
   Begin VB.Label lbnote 
      Caption         =   "ICMO"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   18
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   615
      Index           =   0
      Left            =   1800
      TabIndex        =   0
      Top             =   120
      Width           =   1095
   End
End
Attribute VB_Name = "create"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Const keyName = 2
Private Const keyNum = 45
Private Const keyEmail = 230

Private Sub cmdcalc_Click()
On Error GoTo er
Dim al As String, pr As String, rf As Long, nm As String, nu As String, em As String
nm = txname.text
nu = txnum.text
em = txeml.text
nm = Encode(nm, keyName)
nu = Encode(nu, keyNum)
em = Encode(em, keyEmail)
al = nm & "#" & nu & "*" & em & "&"
txpw.text = al
er:
End Sub
