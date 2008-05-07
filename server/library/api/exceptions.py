# -*- coding: utf-8 -*- 
from django.db import models

class Error(Exception):
    u"图书管理信息系统应用服务器API异常的基类"
    pass

class NotFoundError(Error):
    def __str__(self):
        return u'对象找不到'

class NotLoginError(Error):
    def __unicode__(self):
        return u'未登录'

class NoGrantError(Error):
    def __init__(self,grant_type,grant_action):
        self.grant_type=grant_type
        self.grant_action=grant_action
    def __unicode__(self):
        return u'用户无权限(%s,%s)'%(self.grant_type,self.grant_action)

class NotEmptyError(Error):
    def __init__(self,container_typename,children_typename):
        self.container_typename=container_typename
        self.children_typename=children_typename
    def __unicode__(self):
        return u'无法操作%s，因为存在与之关联的%s'%(self.container_typename,self.children_typename)

class NoPermissionError(Error):
    def __unicode__(self):
        return u'读者没有权限'

class ReaderStatusError(Error):
    def __init__(self,reader):
        self.reader=reader;
    def __unicode__(self):
        return u'读者证处于%s状态，不能操作'%(self.reader.get_reader_status_display())

class CopyStatusError(Error):
    def __init__(self,copy):
        self.copy=copy
    def __unicode__(self):
        return u'复本处于%s状态，不能操作'%(self.copy.get_copy_status_display())

class HasFineError(Error):
    def __unicode__(self):
        return u'读者有罚款未缴'

class OverQuotaError(Error):
    def __unicode__(self):
        return u'读者的操作超出许可数量'

class LoginFailedError(Error):
    def __unicode__(self):
        return u'登录失败，用户名密码不正确'

class IllegalRequestError(Error):
    def __unicode__(self):
        return u'请求不是JSON-RPC格式、utf8编码'

class MethodNotFoundError(Error):
    def __init__(self,method_name):
        self.method_name=method_name
    def __unicode__(self):
        return u'对象不支持%s方法'%(self.method_name)

class InvalidQueryError(Error):
    def __unicode__(self):
        return u'查询条件格式错误'
