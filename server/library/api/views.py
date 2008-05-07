# -*- coding: utf-8 -*- 
from library.api.models import *
from library.api.exceptions import *
from django.http import HttpResponse

class LoginService:
    u"登录认证服务"
    def __init__(self,request):
        self.request=request
        try:
            self.user=User.objects.get(ticket=self.request.COOKIES['library_api_ticket'])
        except (KeyError,User.DoesNotExist):
            self.user=None
    def login(self,employee_number,password):
        u"登录用户"
        try:
            self.user=User.objects.get(employee_number=employee_number,password=password)
        except User.DoesNotExist:
            raise LoginFailedError
        else:
            import random
            ticket='%08x' % (random.randint(0,0xFFFFFFFF))
            self.user.ticket=ticket
            self.user.save()
            return ticket
    def logout(self):
        u"注销用户"
        self.user.ticket=''
        self.user.save()
        self.user=None
    def check(self,grant_type,grant_action):
        u"检查当前是否已经登录、是否拥有权限"
        if self.user is None:
            return False
        try:
            LibrarianGrant.objects.get(
                employee=self.user,grant_type=grant_type,grant_action=grant_action)
            return True
        except LibrarianGrant.DoesNotExist:
            return False
    def must(self,grant_type=None,grant_action=None):
        u"检查当前必须已经登录，可以强制拥有权限"
        if self.user is None:
            raise NotLoginError()
        if grant_type is None:
            return
        if not self.check(grant_type,grant_action):
            raise NoGrantError(grant_type,grant_action)
    always=0xfe12d474 #总是允许调用此功能，包括未登录

def JSONRPC(request,o,cls,methods):
    u"JSON-RPC服务，作为JSONRPCm的wrapper，负责编解码和处理异常"
    from library.utils import simplejson
    response=HttpResponse('','application/json')
    response['X-Powered-By']='yoursunny.com 2008 library-api'
    try:
        id=None
        if request.method!='POST':raise IllegalRequestError
        if request.META['CONTENT_TYPE']!='application/json':raise IllegalRequestError
        try:req=simplejson.loads(request.raw_post_data)
        except:raise IllegalRequestError
        method=req['method']
        params=req['params']
        id=req['id']
        result=JSONRPCm(request,method,params,o,cls,methods)
        response.write(simplejson.dumps({'result':result,'error':None,'id':id}))
        return response
    except Exception,ex:
        typename=str(ex.__class__)
        if typename[1]=='t':typename=typename[7:-2]#<type 'typename'>
        else:typename=typename[8:-2]#<class 'typename'>
        try:msg=unicode(ex)
        except:msg=str(ex)
        #import traceback
        #response.write(simplejson.dumps({'result':None,
        #    'error':{'type':typename,'msg':msg,'tb':traceback.format_exc()},'id':id}))
        response.write(simplejson.dumps({'result':None,'error':{'type':typename,'msg':msg},'id':id}))
        return response
        
def JSONRPCm(request,method_name,params,o,cls,methods):
    u"JSON-RPC服务。o为被操作对象，methods为支持的方法和权限描述，dict{RPC方法:tuple(Python方法[-开头表示允许自动创建o],权限项或权限[True/False/LoginServer.always])}"
    import types
    # 准备对象
    if o is None and cls is None:raise NotFoundError
    login=LoginService(request)
    # 查找方法信息
    try:method_info=methods[method_name]
    except KeyError:raise MethodNotFoundError(method_name)
    method_realname=method_info[0]
    method_grant=method_info[1]
    allow_autocreate=False
    if method_realname[0]=='-':
        allow_autocreate=True
        method_realname=method_realname[1:]
    # 检查权限
    if method_grant is False:raise NoGrantError('(unknown)','(unknown)')
    elif method_grant is True:login.must()
    elif method_grant==LoginService.always:pass
    else:
        method_grant_s=method_grant.split(',')
        login.must(method_grant_s[0],method_grant_s[1])
    # 调用方法函数
    if o is None:
        if allow_autocreate:o=cls()
        else:raise NotFoundError
    func=getattr(o,method_realname)
    return func(*params)

def hLoginService(request):
    login=LoginService(request)
    methods={
        'login':('login',LoginService.always),
        'logout':('logout',True),
    }
    return JSONRPC(request,login,None,methods)

def hUserManager(request):
    methods={
        'all':('all_',LoginService.always),
        'grant_query':('grant_query','user,grant'),
    }
    return JSONRPC(request,User.objects,None,methods)

def hUser(request,employee_number):
    login=LoginService(request)
    me=LoginService(request).user
    is_me=False
    o=None
    if employee_number=='me':
        is_me=True
        o=me
    else:
        try:o=User.objects.get(pk=employee_number)
        except:pass
        if not me is None:is_me=(employee_number==me.employee_number)
    methods={
        'get':('get',LoginService.always),
        'put':('-put','user,write'),
        'del':('del_','user,write'),
        'kick':('kick','user,kick'),
        'set_password':('set_password',is_me or login.check('user','password')),
        'grant':('grant','user,grant'),
        'revoke':('grant','user,grant'),
        'grant_all':('grant','user,grant'),
    }
    return JSONRPC(request,o,User,methods)

def hLocationManager(request):
    methods={
        'all':('all_',LoginService.always),
    }
    return JSONRPC(request,Location.objects,None,methods)

def hLocation(request,location_id):
    try:o=Location.objects.get(pk=int(location_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','loc,write'),
        'del':('del_','loc,write'),
        'stack_all':('stack_all',LoginService.always),
        'clc_query':('clc_query',LoginService.always),
        'user_all':('user_all',LoginService.always),
    }
    return JSONRPC(request,o,Location,methods)

def hStackManager(request):
    methods={
        'all':('all_',LoginService.always),
    }
    return JSONRPC(request,Stack.objects,None,methods)

def hStack(request,stack_id):
    try:o=Stack.objects.get(pk=int(stack_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','loc,write'),
        'del':('del_','loc,write'),
        'shelf_all':('shelf_all',LoginService.always),
        'clc_query':('clc_query',LoginService.always),
    }
    return JSONRPC(request,o,Stack,methods)

def hStackTypeManager(request):
    methods={
        'all':('all_',LoginService.always),
    }
    return JSONRPC(request,StackType.objects,None,methods)

def hStackType(request,stacktype_id):
    try:o=StackType.objects.get(pk=int(stacktype_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','loc,write'),
        'del':('del_','loc,write'),
    }
    return JSONRPC(request,o,StackType,methods)

def hShelfManager(request):
    methods={
        'all':('all_',LoginService.always),
    }
    return JSONRPC(request,Shelf.objects,None,methods)

def hShelf(request,shelf_id):
    try:o=Location.objects.get(pk=int(shelf_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','loc,write'),
        'del':('del_','loc,write'),
        'copy_all':('copy_all',LoginService.always),
    }
    return JSONRPC(request,o,Shelf,methods)

def hBookManager(request):
    methods={
        'all':('all_',LoginService.always),
        'query':('query',LoginService.always),
    }
    return JSONRPC(request,Book.objects,None,methods)

def hBook(request,call_number):
    try:o=Book.objects.get(pk=call_number)
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','loc,write'),
        'reserve':('reserve','book,borrow'),
    }
    return JSONRPC(request,o,Book,methods)

def hTopicManager(request):
    methods={
        'all':('all_',LoginService.always),
        'query':('query',LoginService.always),
    }
    return JSONRPC(request,Topic.objects,None,methods)

def hTopic(request,topic_id):
    try:o=Topic.objects.get(pk=int(topic_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','book,write'),
        'del':('del_','book,write'),
    }
    return JSONRPC(request,o,Topic,methods)

def hPublisherManager(request):
    methods={
        'all':('all_',LoginService.always),
        'query':('query',LoginService.always),
    }
    return JSONRPC(request,Publisher.objects,None,methods)

def hPublisher(request,publisher_id):
    try:o=Publisher.objects.get(pk=int(publisher_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','book,write'),
        'del':('del_','book,write'),
    }
    return JSONRPC(request,o,Publisher,methods)

def hSeriesManager(request):
    methods={
        'all':('all_',LoginService.always),
        'query':('query',LoginService.always),
    }
    return JSONRPC(request,Series.objects,None,methods)

def hSeries(request,series_id):
    try:o=Series.objects.get(pk=int(series_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','book,write'),
        'del':('del_','book,write'),
    }
    return JSONRPC(request,o,Series,methods)

def hAuthorManager(request):
    methods={
        'all':('all_',LoginService.always),
        'query':('query',LoginService.always),
    }
    return JSONRPC(request,Author.objects,None,methods)

def hAuthor(request,author_id):
    try:o=Author.objects.get(pk=int(author_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','book,write'),
        'del':('del_','book,write'),
        'clc_next':('clc_next',True)
    }
    return JSONRPC(request,o,Author,methods)

def hClcClassificationManager(request):
    methods={
        'get':('get',LoginService.always),
        'query':('query',LoginService.always),
    }
    return JSONRPC(request,clcClassification.objects,None,methods)

def hCopyManager(request):
    methods={
        'all':('all_',LoginService.always),
    }
    return JSONRPC(request,Copy.objects,None,methods)

def hCopy(request,copy_barcode):
    try:o=Copy.objects.get(pk=copy_barcode)
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('-put','book,write'),
        'reserve':('reserve','book,borrow'),
        'borrow':('borrow','book,borrow'),
        'onshelf':('onshelf','book,onshelf'),
        'set_status':('set_status','book,write'),
    }
    return JSONRPC(request,o,Copy,methods)

def hBorrowManager(request):
    methods={
        'all':('all_','book,borrow'),
        'active':('active','book,borrow'),
        'expire':('expire','book,borrow'),
    }
    return JSONRPC(request,Borrow.objects,None,methods)

def hBorrow(request,borrow_id):
    try:o=Borrow.objects.get(pk=int(borrow_id))
    except:o=None
    methods={
        'get':('get','book,borrow'),
        'return_copy':('return_copy','book,borrow'),
        'renew':('renew','book,borrow'),
        'damaged':('damaged','book,borrow'),
    }
    return JSONRPC(request,o,Borrow,methods)

def hReaderManager(request):
    methods={
        'all':('all_','reader,read'),
        'active':('active','reader,read'),
        'query':('query','reader,read'),
        'query_barcode':('query_barcode',LoginService.always),
    }
    return JSONRPC(request,Reader.objects,None,methods)

def hReader(request,reader_id):
    try:o=Reader.objects.get(pk=int(reader_id))
    except:o=None
    methods={
        'get':('get','reader,read'),
        'put':('-put','reader,write'),
        'enter_stack':('enter_stack',LoginService.always),
        'borrow_all':('borrow_all','reader,read'),
        'borrow_active':('borrow_active','reader,read'),
        'borrow_expired':('borrow_expired','reader,read'),
        'fine_all':('fine_all','reader,fine'),
        'fine_active':('fine_active','reader,fine'),
        'set_status':('set_status','reader,write'),
    }
    return JSONRPC(request,o,Reader,methods)

def hReaderTypeManager(request):
    methods={
        'all':('all_',LoginService.always),
    }
    return JSONRPC(request,ReaderType.objects,None,methods)

def hReaderType(request,readertype_id):
    try:o=ReaderType.objects.get(pk=int(readertype_id))
    except:o=None
    methods={
        'get':('get',LoginService.always),
        'put':('put','reader,type'),
        'del':('del_','reader,type'),
        'grant':('grant','reader,type'),
    }
    return JSONRPC(request,o,ReaderType,methods)

def hFineManager(request):
    methods={
        'all':('all_','reader,fine'),
        'active':('active','reader,fine'),
        'query':('query','reader,fine'),
    }
    return JSONRPC(request,Fine.objects,None,methods)

def hFine(request,fine_id):
    try:o=Fine.objects.get(pk=int(fine_id))
    except:o=None
    methods={
        'get':('get','reader,fine'),
        'put':('put','reader,fine'),
        'pay':('pay','reader,fine'),
        'cancel':('cancel','reader,fine'),
        'compensate':('compensate','reader,fine'),
    }
    return JSONRPC(request,o,Shelf,methods)

