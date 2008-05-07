import re

def is_citizen_id(s):
    u"验证一个字符串是否是有效的身份证号"
    import datetime
    if len(s)==15:
        if re.match('^\d{15}$',s) is None:return False
        try:datetime.date(int('19'+s[6:7]),int(s[8:9]),int(s[10:11]))
        except:return False
        return True
    elif len(s)==18:
        if re.match('^\d{17}[X\d]$',s) is None:return False
        try:datetime.date(int('19'+s[6:9]),int(s[10:11]),int(s[12:13]))
        except:return False
        weight=[7,9,10,5,8,4,2,1,6,3,7,9,10,5,8,4,2,1]
        checksum='10X98765432'
        count=0
        for i in range(17):
            count+=int(s[i])*weight[i]
        return s[17]==checksum[count%11]
    return False

def is_isbn(s):
    u"验证一个字符串是否是有效的ISBN号"
    if re.match('^\d{9}[X\d]$',s) is None:return False
    weight=[10,9,8,7,6,5,4,3,2,1]
    count=0
    for i in range(10):
        if s[i]=='X':digit=10
        else:digit=int(s[i])
        count+=digit*weight[i]
    return count%11==0
