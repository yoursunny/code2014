Attribute VB_Name = "asciicoder"
Private Const setLen_left = 1
Private Const setLen_right = 2

Function repeatChar(ByVal char As String, ByVal number As Long) As String
Dim C As Long
Dim out As String
out = ""
For C = 1 To number Step 1
out = out & char
Next
repeatChar = out
End Function

Function setLen(ByVal oldText As String, ByVal newLen As Long, ByVal fillWith As String, ByVal fillPlace As Byte) As String
Dim oldLen As Long
oldLen = Len(oldText)
If oldLen >= newLen Then
If fillPlace = setLen_left Then
setLen = Right(oldText, newLen)
ElseIf fillPlace = setLen_right Then
setLen = Left(oldText, newLen)
End If
Else
If fillPlace = setLen_left Then
setLen = repeatChar(fillWith, newLen - oldLen) & oldText
ElseIf fillPlace = setLen_right Then
setLen = oldText & repeatChar(fillWith, newLen - oldLen)
End If
End If
End Function

Function Encode(ByVal text As String, ByVal ascii As Byte) As String
On Error Resume Next
Dim n As String
Dim this As String
Dim now As Long
Dim count As Long
For count = 1 To Len(text)
now = Asc(Mid(text, count))
now = now + ascii
this = setLen(Hex(now), 8, "0", setLen_left)
n = n & this
Next
Encode = n
End Function

Function Decode(ByVal text As String, ByVal ascii As Byte) As String
On Error Resume Next
Dim n As String
Dim this As String
Dim now As Long
Dim count As Integer
For count = 1 To Len(text) \ 8
now = CLng(Val("&h" & Mid(text, count * 8 - 7, 8)))
now = now - ascii
this = Chr(now)
n = n & this
Next
Decode = n
End Function


