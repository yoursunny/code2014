VERSION 5.00
Begin VB.Form Form1 
   BorderStyle     =   1  'Fixed Single
   Caption         =   "typing"
   ClientHeight    =   3195
   ClientLeft      =   4125
   ClientTop       =   3030
   ClientWidth     =   2760
   Icon            =   "Form1.frx":0000
   LinkTopic       =   "Form1"
   MaxButton       =   0   'False
   MouseIcon       =   "Form1.frx":030A
   MousePointer    =   99  'Custom
   ScaleHeight     =   3195
   ScaleWidth      =   2760
   Begin VB.CommandButton Command4 
      Caption         =   "Se&tup"
      Height          =   495
      Left            =   1680
      MousePointer    =   1  'Arrow
      TabIndex        =   4
      Top             =   2400
      Width           =   855
   End
   Begin VB.CommandButton Command1 
      Caption         =   "&Start"
      Height          =   495
      Left            =   1680
      MousePointer    =   1  'Arrow
      TabIndex        =   0
      Top             =   240
      Width           =   855
   End
   Begin VB.CommandButton Command3 
      Caption         =   "&Help"
      Height          =   495
      Left            =   1680
      MousePointer    =   1  'Arrow
      TabIndex        =   3
      Top             =   1680
      Width           =   855
   End
   Begin VB.CommandButton Command2 
      Caption         =   "E&xit"
      Height          =   495
      Left            =   1680
      MousePointer    =   1  'Arrow
      TabIndex        =   2
      Top             =   960
      Width           =   855
   End
   Begin VB.Timer Timer1 
      Enabled         =   0   'False
      Interval        =   3000
      Left            =   0
      Top             =   0
   End
   Begin VB.TextBox Text1 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   29.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000000FF&
      Height          =   810
      Left            =   360
      MaxLength       =   1
      MousePointer    =   3  'I-Beam
      TabIndex        =   1
      Top             =   1200
      Width           =   735
   End
   Begin VB.Label Label3 
      Caption         =   "miss=0"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   13.5
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H000080FF&
      Height          =   375
      Left            =   120
      MouseIcon       =   "Form1.frx":0614
      MousePointer    =   99  'Custom
      TabIndex        =   7
      Top             =   2760
      Width           =   1455
   End
   Begin VB.Label Label2 
      Caption         =   "right=0"
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   13.5
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      ForeColor       =   &H00FF0000&
      Height          =   375
      Left            =   120
      MouseIcon       =   "Form1.frx":091E
      MousePointer    =   99  'Custom
      TabIndex        =   6
      Top             =   2160
      Width           =   1455
   End
   Begin VB.Label Label1 
      BeginProperty Font 
         Name            =   "MS Sans Serif"
         Size            =   29.25
         Charset         =   0
         Weight          =   400
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   810
      Left            =   480
      MouseIcon       =   "Form1.frx":0C28
      MousePointer    =   99  'Custom
      TabIndex        =   5
      Tag             =   "0"
      Top             =   240
      Width           =   615
   End
End
Attribute VB_Name = "Form1"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False

Private Sub Command1_Click()
If Command1.Caption = "&Start" Then
Command3.Enabled = False
Command4.Enabled = False
Timer1.Enabled = True
Text1.SetFocus
Command1.Caption = "&End"
Else
Timer1.Enabled = False
Command1.Caption = "&Start"
Command3.Enabled = True
Command4.Enabled = True
End If
End Sub

Private Sub Command2_Click()
End
End Sub

Private Sub Command3_Click()
MsgBox "Look at the letter then type it in " & Str(Timer1.Interval / 1000) & " seconds."
End Sub

Private Sub Command4_Click()
Timer1.Interval = Int(1000 * Val(InputBox("How many seconds do you type a letter?", "Setup", "3")))
End Sub

Private Sub Form_Load()
Randomize
Label1.Caption = Chr(Asc("a") + Int(Rnd() * 26))
If Rnd() > 0.7 Then
Label1.Caption = UCase(Label1.Caption)
End If
Label1.Tag = 0
End Sub

Private Sub Text1_Change()
If Text1.Text = Label1.Caption Then
Label1.Tag = 1
End If
End Sub

Private Sub Timer1_Timer()
Text1.Text = ""
If Label1.Tag = 0 Then
Label3.Caption = "miss=" & Str(Int(Val(Right(Label3.Caption, Len(Label3.Caption) - 5)) + 1))
Else
Label2.Caption = "right=" & Str(Int(Val(Right(Label2.Caption, Len(Label2.Caption) - 6)) + 1))
End If
Label1.Caption = Chr(Asc("a") + Int(Rnd() * 26))
If Rnd() > 0.7 Then
Label1.Caption = UCase(Label1.Caption)
End If
Label1.Tag = 0
End Sub
