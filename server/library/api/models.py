# -*- coding: utf-8 -*- 
from library.api.exceptions import *
from django.db import models,transaction
import django.dispatch.dispatcher

def paramGet(o,param):
    u"从dict或对象o中提取属性param，对于对象可以支持多级属性；+开头的属性必须存在否则抛出异常，-开头或无前缀的属性若不存在就返回None"
    import types
    must=(param[0]=='+')
    if must or param[0]=='-':param=param[1:]
    try:
        if isinstance(o,types.DictType):return o[param]
        else:
            params=param.split('.')
            for p in params[:-1]:
                o=getattr(o,p)
            return getattr(o,params[-1])
    except Exception,ex:
        if must:raise ex
def paramSet(o,param,value):
    u"向dict或对象o中设置属性param，对于对象可以支持多级属性，忽略属性名开头的+、-"
    import types
    if param[0]=='+' or param[0]=='-':param=param[1:]
    if isinstance(o,types.DictType):o[param]=value
    else:
        params=param.split('.')
        for p in params[:-1]:
            o=getattr(o,p)
        setattr(o,params[-1],value)
def paramCopy(o_from,o_to,params):
    u"通用的get或set方法。从dict或对象v中提取tuple p列出的属性，设置在dict或对象o上。p的每个对象也可以是tuple，第一项为源属性(+开头强制存在否则异常、-开头不存在时设置None、无前缀不存在时不设置)，第二项为目标属性"
    import types
    for param in params:
        if not isinstance(param,types.TupleType):param=(param,param)
        value=paramGet(o_from,param[0])
        if not (value is None and param[0][0]=='-'):paramSet(o_to,param[1],value)
def paramCopyD(o_from,params):
    u"在dict或对象上调用paramCopy，创建一个新的dict"
    r={}
    paramCopy(o_from,r,params)
    return r
def paramCopyL(l_from,params):
    u"在list上调用paramCopy，创建一个新的list<dict>"
    r=[]
    for o in l_from:
        d={}
        paramCopy(o,d,params)
        r.append(d)
    return r
def paramRev(params):
    u"使params参数中的tuple变成反向，例如('a',('b','c'))变成('a',('c','b'))"
    import types
    r=[]
    for p in params:
        if isinstance(p,types.TupleType):r.append((p[1],p[0]))
        else:r.append(p)
    return r

class instDefaultMethods:
    u"为对象提供默认的get、put、del实现"
    def get(self):
        return paramCopyD(self,self.get_params)
    def put(self,o):
        paramCopy(o,self,self.put_params)
        self.save()
    def del_(self):
        self.delete()

class UserManager(models.Manager):
    u"用户集合"
    def all_(self):
        return paramCopyL(self.all(),User.get_params)
    def grant_query(self,grant_type,grant_action):
        users=LibrarianGrant.objects.filter(
            grant_type=grant_type,grant_action=grant_action
            ).values('employee_number').distinct()
        employee_numbers=[]
        for user in users:employee_numbers.append(user['employee_number'])
        return paramCopyL(User.objects.in_bulk(employee_numbers),User.get_params)

class User(models.Model,instDefaultMethods):
    u"用户"
    objects=UserManager()
    employee_number=models.CharField(maxlength=16,primary_key=True)
    location=models.ForeignKey('Location')
    person_name=models.CharField(maxlength=32)
    password=models.CharField(maxlength=40)
    ticket=models.CharField(maxlength=32)
    def __str__(self):
        return self.employee_number+' '+self.person_name
    get_params=('employee_number',('location.location_id','location_id'),'person_name')
    put_params=('employee_number','person_name')
    def put(self,o):
        paramCopy(o,self,User.put_params)
        self.location=Location.objects.get(pk=o['location_id'])
        self.save()
    def del_(self):
        if Fine.objects.filter(librarian=this).count()>0:
            raise NotEmptyError('馆员','罚款记录')
        self.delete()
    def kick(self):
        self.ticket=''
        self.save()
    def set_password(self,password):
        self.password=password
        self.save()
    def grant(self,grant_type,grant_action):
        LibrarianGrant.objects.get_or_create(employee=self,grant_type=grant_type,grant_action=grant_action)
    def revoke(self,grant_type,grant_action):
        if grant_type=='user' and (grant_action=='grant' or grant_action=='root'):
            if LibrarianGrant.objects.filter(employee=self,grant_type='user',grant_action='root').count()>0:
                return#user,root表示该用户为最高管理员，他不能剥夺自己的user,grant权限，避免系统无法管理
        try:LibrarianGrant.objects.get(employee=self,grant_type=grant_type,grant_action=grant_action).delete()
        except DoesNotExist:pass
    def grant_all(self):
        return paramCopyL(LibrarianGrant.objects.filter(employee=self),LibrarianGrant.get_params)

class LibrarianGrant(models.Model):
    u"馆员的权限"
    employee=models.ForeignKey('User')
    grant_type=models.CharField(maxlength=32)
    grant_action=models.CharField(maxlength=32)
    get_params=(('employee.id','employee_id'),'grant_type','grant_action')

class LocationManager(models.Manager):
    u"分馆集合"
    def all_(self):
        return paramCopyL(Location.objects.all(),Location.get_params)

class Location(models.Model,instDefaultMethods):
    u"分馆"
    objects=LocationManager()
    location_id=models.AutoField(primary_key=True)
    location_name=models.CharField(maxlength=256)
    address=models.CharField(maxlength=256)
    phone=models.CharField(maxlength=32)
    def __str__(self):
        return self.location_name
    get_params=('location_id','location_name','address','phone')
    put_params=('location_name','address','phone')
    def del_(self):
        if Stack.objects.filter(location=self).count()>0:
            raise NotEmptyError('分馆','书库')
        if User.objects.filter(location=self).count()>0:
            raise NotEmptyError('分馆','馆员')
        self.delete()
    def stack_all(self):
        return paramCopyL(Stack.objects.filter(location=self),Stack.get_params)
    def clc_query(self,call_number):
        stacks=Stack.objects.filter(location=self)
        r=[]
        for stack in stacks:
            r.extend(stack.clc_query(call_number))
        return r
    def user_all(self):
        return paramCopyL(User.objects.filter(location=self),User.get_params)

class StackManager(models.Manager):
    u"书库集合"
    def all_(self):
        return paramCopyL(Stack.objects.all(),Stack.get_params)

class Stack(models.Model,instDefaultMethods):
    u"书库"
    objects=StackManager()
    stack_id=models.AutoField(primary_key=True)
    stacktype=models.ForeignKey('StackType')
    location=models.ForeignKey('Location')
    stack_name=models.CharField(maxlength=256)
    def __str__(self):
        return self.stack_name
    get_params=('stack_id',('stacktype.stacktype_id','stacktype_id'),('location.location_id','location_id'),'stack_name')
    put_params=(('stacktype.stacktype_id','stacktype_id'),('location.location_id','location_id'),'stack_name')
    def del_(self):
        if Shelf.objects.filter(stack=self).count()>0:
            raise NotEmptyError('书库','书架')
        self.delete()
    def shelf_all(self):
        return paramCopyL(Shelf.objects.filter(stack=self),Shelf.get_params)
    def clc_query(self,call_number):
        shelfs=Shelf.objects.filter(stack=self)
        r=[]
        for shelf in shelfs:
            if shelf.start_number<=call_number and shelf.end_number>=call_number:
                r.append(shelf)
        return r

class StackTypeManager(models.Manager):
    u"书库类型集合"
    def all_(self):
        return paramCopyL(StackType.objects.all(),StackType.get_params)

class StackType(models.Model,instDefaultMethods):
    u"书库类型"
    objects=StackTypeManager()
    stacktype_id=models.AutoField(primary_key=True)
    stacktype_name=models.CharField(maxlength=64)
    def __str__(self):
        return self.stacktype_name
    get_params=('stacktype_id','stacktype_name')
    put_params=('stacktype_name')
    def del_(self):
        if Stack.objects.filter(stacktype=self).count()>0:
            raise NotEmptyError('书库类型','书库')
        self.delete()

class ShelfManager(models.Manager):
    u"书架集合"
    def all_(self):
        return paramCopyL(Shelf.objects.all(),Shelf.get_params)

class Shelf(models.Model,instDefaultMethods):
    u"书架"
    objects=ShelfManager()
    shelf_id=models.AutoField(primary_key=True)
    stack=models.ForeignKey('Stack')
    shelf_memo=models.TextField()
    start_number=models.CharField(maxlength=32)
    end_number=models.CharField(maxlength=32)
    def __str__(self):
        return self.stack.stack_name+' #'+self.shelf_id
    get_params=('shelf_id',('stack.stack.id','stack_id'),'shelf_memo','start_number','end_number')
    put_params=(('stack.stack.id','stack_id'),'shelf_memo','start_number','end_number')
    def del_(self):
        if Copy.objects.filter(shelf=self).count()>0:
            raise NotEmptyError('书架','复本')
        self.delete()
    def copy_all(self):
        return paramCopyL(Copy.objects.filter(shelf=self),Copy.get_params)

class BookManager(models.Manager):
    u"文献集合"
    def all_(self):
        return paramCopyL(Shelf.objects.all(),Shelf.get_params)
    def query(self,filter,sort):
        import types
        pf_str={'call_number':'call_number','series':'series__series_name','publisher':'publisher__publisher_name','topic':'topic__topic_name','title':'book_title'}
        pf_num={'type':'book_type','isbn':'isbn','publish_date':'publish_date','price':'book_price'}
        pf_num_op={'=':'exact','>':'gt','<':'lt','>=':'gte','<=':'lte'}
        r=Book.objects.all()
        for f in filter:
            if isinstance(f,types.TupleType):
                if pf_str.has_key(f[0]):
                    if f[1]=='=':r=r.filter(**{pf_str[f[0]]:f[2]})
                    elif f[1]=='!=':r=r.exclude(**{pf_str[f[0]]:f[2]})
                    elif f[1]=='like':r=r.filter(**{pf_str[f[0]+'__icontains']:f[2]})
                    else:raise InvalidQueryError
                elif pf_num.haskey(f[0]):
                    if f[1]=='!=':r=r.exclude(**{pf_str[f[0]]:f[2]})
                    elif pf_num_op.has_key(f[1]):r=r.filter(**{pf_num[f[0]]+'__'+pf_num_op[f[1]]:f[2]})
                    else:raise InvalidQueryError
                elif f[0]=='author':
                    def author_book_get_call_number(author_book):return author_book.book.call_number
                    if f[1]=='=':
                        author_books=Author_Book.objects.filter(author__person_name=f[2]).distinct().select_related(depth=1)
                        author_ids=map(author_book_get_call_number,author_books)
                        r=r.filter(pk__in=author_ids)
                    elif f[1]=='!=':
                        author_books=Author_Book.objects.filter(author__person_name=f[2]).distinct().select_related(depth=1)
                        author_ids=map(author_book_get_call_number,author_books)
                        r=r.exclude(pk__in=author_ids)
                    elif f[1]=='like':
                        author_books=Author_Book.objects.filter(author__person_name__icontains=f[2]).distinct().select_related(depth=1)
                        author_ids=map(author_book_get_call_number,author_books)
                        r=r.filter(pk__in=author_ids)
                    else:raise InvalidQueryError
                else:raise InvalidQueryError
            else:
                r=r.filter(Q(call_number__icontains=f)|Q(series__series_name__icontains=f)|Q(publisher__publisher_name__icontains=f)|Q(topic__topic_name__icontains=f)|Q(book_title__icontains=f)|Q(series__series_name__icontains=f)|Q(isbn__icontains=f))
        order_by=[]
        for s in sort:
            if pf_str.has_key(s[0]) or pf_num.haskey(s[0]):
                if s[1] is True:order_by.append('-'+s[0])
                else:order_by.append(s[0])
            elif s[0]=='author':pass
            else:raise InvalidQueryError
        r=r.order_by(order_by)
        return paramCopyL(r,Book.get_params)

class Book(models.Model,instDefaultMethods):
    u"文献"
    objects=BookManager()
    call_number=models.CharField(primary_key=True,maxlength=32)
    series=models.ForeignKey('Series')
    publisher=models.ForeignKey('Publisher')
    topic=models.ForeignKey('Topic')
    book_title=models.CharField(maxlength=256)
    book_type_choices=(
        (0,u'其他'),
        (10,u'普通图书'),
        (11,u'外文图书'),
        (12,u'少数民族文字图书'),
        (13,u'盲文图书'),
        (30,u'地图'),
        (50,u'报纸'),
        (51,u'杂志期刊'),
        (110,u'录音磁带'),
        (111,u'音频CD'),
        (130,u'视频磁带'),
        (131,u'视频VCD'),
        (132,u'视频DVD'),
        (133,u'视频蓝光'),
        (150,u'数据CD'),
        (151,u'数据DVD'),
    )
    book_type=models.PositiveSmallIntegerField(choices=book_type_choices)
    isbn=models.CharField(maxlength=10)
    publish_date=models.DateField()
    media=models.CharField(maxlength=256)
    book_price=models.FloatField(max_digits=7,decimal_places=2)
    authors_id=None
    authors=None
    authors_m=None
    def __str__(self):
        return self.book_title
    get_params=('call_number',('series.series_id','series_id'),'series',('publisher.publisher_id','publisher_id'),'publisher',('topic.topic_id','topic_id'),'topic','book_title','book_type','isbn','publish_date','media','book_price','authors_id','authors')
    put_params=('call_number',('series_id','series.series_id'),('publisher_id','publisher.publisher_id'),('topic_id','topic.topic_id'),'book_title','book_type','isbn','publish_date','media','book_price','authors_id')
    def del_(self):pass
    def reserve(self,reader_id,location_id):
        #只要读者在任意书库有权预约，预约复本就可以成功；但是如果读者对归还复本所在书库无权预约，以后无法转成预约复本，直到过期
        import datetime
        reader=Reader.objects.get(pk=reader_id)
        location=Location.objects.get(pk=location_id)
        ReserveBook.objects.filter(reserve_until__lt=datetime.date.today()).delete()
        reader.check_status()
        p=Permission.objects.filter(readertype=reader.readertype,reserve_limit__gt=0,reserve_period__gt=0).order('-reserve_period')
        if len(p)==0:raise NoPermissionError
        now=datetime.datetime.now()
        until=now+datetime.timedelta(p[0].reserve_period)
        until=datetime.date(until.year,until.month,until.day)
        r=ReserveBook(reader=reader,book=self,location=location,reserve_date=now,reserve_until=until)
        r.save()
        self.reserve_book()
    def reserve_copy(self):
        u"本文献的预约馆藏转为预约复本"
        ReserveBook.objects.filter(reserve_until__lt=datetime.date.today()).delete()
        ReserveCopy.objects.filter(reserve_until__lt=datetime.date.today()).delete()
        reserves=ReserveBook.objects.filter(book=self).select_related(depth=1)
        for reserve in reserves:
            reserve.reserve_copy()

def Book_loadAuthors(sender,instance):
    instance.authors_m=Author_Book.objects.filter(book=instance)
    instance.authors_id=[]
    instance.authors=[]
    for a in instance.authors_m:
        instance.authors_id.append((a.author_order,a.author.author_id))
        instance.authors.append((a.author_order,a.author))
django.dispatch.dispatcher.connect(Book_loadAuthors,sender=Book,signal=models.signals.post_init)
def Book_saveAuthors(sender,instance):
    Author_Book.objects.filter(book=instance).delete()
    for a in instance.authors_id:
        Author_Book.objects.create(book=instance,author=author.objects.get(pk=a[1]),author_order=a[0])
django.dispatch.dispatcher.connect(Book_saveAuthors,sender=Book,signal=models.signals.pre_save)
def Book_delAuthors(sender,instance):
    Author_Book.objects.filter(book=instance).delete()
django.dispatch.dispatcher.connect(Book_delAuthors,sender=Book,signal=models.signals.pre_delete)

class Author_Book(models.Model):
    u"文献-著者多对多关系"
    # 需要增加author_order，因此不能使用内置ManyToManyField
    book=models.ForeignKey('Book')
    author=models.ForeignKey('Author')
    author_order=models.PositiveSmallIntegerField()

class TopicManager(models.Manager):
    u"主题标目集合"
    def all_(self):
        return paramCopyL(Topic.objects.all(),Topic.get_params)
    def query(self,topic_name_query):
        return paramCopyL(Topic.objects.filter(topic_name__icontains=topic_name_query),Topic.get_params)

class Topic(models.Model,instDefaultMethods):
    u"主题标目"
    objects=TopicManager()
    topic_id=models.AutoField(primary_key=True)
    topic_name=models.CharField(maxlength=256)
    def __str__(self):
        return self.topic_name
    get_params=('topic_id','topic_name')
    put_params=('topic_name')
    def del_(self):
        if Book.objects.filter(topic=self).count()>0:
            raise NotEmptyError('主题标目','文献')
        self.delete()

class PublisherManager(models.Manager):
    u"出版社集合"
    def all_(self):
        return paramCopyL(Publisher.objects.all(),Publisher.get_params)
    def query(self,publisher_query):
        q=models.Q(publisher_name__icontains=publisher_query)|models.Q(address__icontains=publisher_query)|models.Q(phone__icontains=publisher_query)
        return paramCopyL(Publisher.objects.filter(q),Publisher.get_params)

class Publisher(models.Model,instDefaultMethods):
    u"出版社"
    objects=PublisherManager()
    publisher_id=models.AutoField(primary_key=True)
    publisher_name=models.CharField(maxlength=256)
    address=models.CharField(maxlength=256)
    phone=models.CharField(maxlength=256)
    def __str__(self):
        return self.publisher_name
    get_params=('publisher_id','publisher_name','address','phone')
    put_params=('publisher_name','address','phone')

class SeriesManager(models.Manager):
    u"丛书集合"
    def all_(self):
        return paramCopyL(Series.objects.all(),Series.get_params)
    def query(self,series_name_query):
        return paramCopyL(Series.objects.filter(series_name__icontains=series_name_query),Series.get_params)

class Series(models.Model,instDefaultMethods):
    u"丛书"
    objects=SeriesManager()
    series_id=models.AutoField(primary_key=True)
    series_name=models.CharField(maxlength=256)
    def __str__(self):
        return self.series_name
    get_params=('series_id','series_name')
    put_params=('series_name')
    def del_(self):
        if Book.objects.filter(series=self).count()>0:
            raise NotEmptyError('丛书','文献')
        self.delete()

class AuthorManager(models.Manager):
    u"著者集合"
    def all_(self):
        return paramCopyL(Author.objects.all(),Author.get_params)
    def query(self,filter,sort):
        raise NotImplementedError

class Author(models.Model,instDefaultMethods):
    u"著者"
    objects=AuthorManager()
    author_id=models.AutoField(primary_key=True)
    person_name=models.CharField(maxlength=32)
    birth=models.DateField(null=True)
    death=models.DateField(null=True)
    nationality=models.CharField(maxlength=16)
    def __str__(self):
        return self.person_name
    get_params=('author_id','person_name','birth','death','nationality')
    put_params=('person_name','birth','death','nationality')
    def del_(self):
        if Author_Book.objects.filter(author=self).count()>0:
            raise NotEmptyError('著者','文献')
        self.delete()
    def clc_next(self):
        raise NotImplementedError

class clcClassificationManager(models.Manager):
    u"中国图书分类法查询服务"
    def get(self,call_number):
        raise NotImplementedError
    def query(self,query,like):
        raise NotImplementedError

class clcClassification(models.Model):
    u"中国图书分类法"
    objects=clcClassificationManager()
    clc_number=models.CharField(maxlength=32,primary_key=True)
    clc_name=models.CharField(maxlength=64)
    def __str__(self):
        return clc_number

class CopyManager(models.Manager):
    u"复本集合"
    def all_(self):
        return paramCopyL(Copy.objects.all(),Copy.get_params)
    def clearOldReserves(self):
        u"去除过期的预约标记"
        import datetime
        for copy in Copy.objects.filter(copy_status=8,return_pdate__lt=datetime.date.today()):
            copy.copy_status=2
            copy.save()

class Copy(models.Model,instDefaultMethods):
    u"复本"
    objects=CopyManager()
    copy_barcode=models.CharField(maxlength=10,primary_key=True)
    shelf=models.ForeignKey('Shelf')
    book=models.ForeignKey('Book')
    copy_status_choices=(
        (0,u'未知'),
        (1,u'归还,待上架'),
        (2,u'上架,可借出'),
        (3,u'已借出'),
        (4,u'阅览室,不可借出'),
        (5,u'新书,待上架'),
        (6,u'损坏或遗失报废'),
        (7,u'其他原因报废'),
        (8,u'被预约'),
    )
    copy_status=models.PositiveSmallIntegerField(choices=copy_status_choices)
    entry_date=models.DateField()
    entry_source_choices=(
        (0,u'其他'),
        (1,u'采购'),
        (2,u'捐赠'),
        (3,u'赔偿'),
    )
    entry_source=models.PositiveSmallIntegerField(choices=entry_source_choices)
    return_pdate=models.DateField()
    discard_date=models.DateField()
    copy_memo=models.TextField()
    def __str__(self):
        return copy_barcode
    get_params=('copy_barcode',('shelf.shelf_id','shelf_id'),('book.call_number','call_number'),'copy_status','entry_date','entry_source','return_pdate','discard_date','copy_memo')
    put_params=paramRev(get_params)
    def del_(self):pass
    @transaction.commit_on_success
    def reserve(self,reader_id):
        import datetime
        reader=Reader.objects.get(pk=reader_id)
        stacktype=self.shelf.stack.stacktype
        # 清理过期数据
        ReserveCopy.objects.filter(reserve_until__lt=datetime.date.today()).delete()
        # 检查预约权限
        reader.check_status()
        try:permission=Permission.objects.get(readertype=reader.readertype,stacktype=stacktype,reserve_limit__gt=0,reserve_period__gt=0)
        except:raise NotPermissionError
        # 检查数量限制
        if ReserveCopy.objects.filter(reader=self,copy__shelf__stack__stacktype=stacktype).count()>=permission.reserve_limit:
            raise OverQuotaError
        # 计算截止时间
        now=datetime.datetime.now()
        until=now+datetime.timedelta(permission.reserve_period)
        until=datetime.date(until.year,until.month,until.day)
        ReserveCopy.objects.get_or_create(reader=reader,copy=self,reserve_date=now,reserve_until=until)
        self.copy_status=8
        self.return_pdate=until
        self.save()
    @transaction.commit_on_success
    def borrow(self,reader_id):
        #检查读者状态、罚款
        reader=Reader.objects.get(pk=reader_id)
        reader.check_status()
        #检查复本状态
        if self.copy_status!=2:
            if self.copy_status==8:#被预约，判断是否是这位读者预约
                try:
                    reserve=ReserveCopy.objects.get(reader=reader,copy=self)
                    reserve.delete()
                except:raise CopyStatusError(self)
            else:raise CopyStatusError(self)
        #查询读者权限
        stacktype=self.shelf.stack.stacktype
        try:permission=Permission.objects.get(readertype=reader.readertype,stacktype=stacktype,borrow_limit__gt=0,borrow_days__gt=0)
        except:raise NoPermissionError
        #判断是否超出限额
        if Borrow.objects.filter(reader=reader,copy__shelf__stack__stacktype=stacktype,borrow_status=0).count()>=permission.borrow_limit:
            raise OverQuotaError
        #创建借阅记录、更新复本状态
        import datetime
        today=datetime.date.today()
        until=today+datetime.timedelta(permission.borrow_days)
        Borrow.objects.create(reader=reader,copy=self,borrow_status=0,borrow_date=today,return_date=until,renewal_remain=permission.borrow_renews)
        self.copy_status=3
        self.return_pdate=until
        self.save()
    def onshelf(self):
        self.copy_status=2
        self.save()
    def set_status(self,copy_status):
        self.copy_status=copy_status;
        self.save()

class BorrowManager(models.Manager):
    u"借阅记录集合"
    def all_(self):
        return paramCopyL(Borrow.objects.all(),Borrow.get_params)
    def active(self):
        return paramCopyL(Borrow.objects.filter(Q(borrow_status=0)|Q(borrow_status=3)),Borrow.get_params)
    def expire(self):
        import datetime
        return paramCopyL(Borrow.objects.filter(borrow_status=0,return_date__lt=datetime.date.today()),Borrow.get_params)

class Borrow(models.Model,instDefaultMethods):
    u"借阅记录"
    objects=BorrowManager()
    borrow_id=models.AutoField(primary_key=True)
    reader=models.ForeignKey('Reader')
    copy=models.ForeignKey('Copy')
    borrow_status_choices=(
        (0,u'借出'),
        (1,u'归还'),
        (2,u'罚款'),
        (3,u'预约,未借出'),#此代码未使用
    )
    borrow_status=models.PositiveSmallIntegerField(choices=borrow_status_choices)
    borrow_date=models.DateField()
    return_date=models.DateField()
    renewal_remain=models.PositiveSmallIntegerField()
    def __str__(self):
        return self.reader.person_name+' '+self.copy.copy_barcode
    get_params=('borrow_id',('reader.reader_id','reader_id'),('copy.copy_barcode','copy_barcode'),'borrow_status','borrow_date','return_date','renewal_remain')
    put_params=(('reader_id','reader.reader_id'),('copy_barcode','copy.copy_barcode'),'borrow_status','borrow_date','return_date','renewal_remain')
    def put(self):pass
    def del_(self):pass
    def return_copy(self):
        raise NotImplementedError
    def renew(self):
        raise NotImplementedError
    def damaged(self,reason,amount,memo):
        raise NotImplementedError

class ReaderManager(models.Manager):
    u"读者集合"
    def all_(self):
        return paramCopyL(Reader.objects.all(),Reader.get_params)
    def active(self):
        import datetime
        return paramCopyL(Reader.objects.filter(reader_enddate__gte=datetime.date.today()),Reader.get_params)
    def query(self,filter,sort):
        raise NotImplementedError
    def query_barcode(self,barcode):
        return paramCopyD(Reader.objects.get(reader_barcode=barcode),Reader.get_params)

class Reader(models.Model,instDefaultMethods):
    u"读者"
    objects=ReaderManager()
    reader_id=models.AutoField(primary_key=True)
    readertype=models.ForeignKey('ReaderType')
    reader_barcode=models.CharField(maxlength=10)
    person_name=models.CharField(maxlength=32)
    address=models.CharField(maxlength=256)
    phone=models.CharField(maxlength=32)
    citizen_id=models.CharField(maxlength=18)
    password=models.CharField(maxlength=40)
    reader_status_choices=(
        (0,u'正常'),
        (1,u'挂失'),
        (2,u'过期'),
        (3,u'黑名单'),
        (4,u'注销'),
    )
    reader_status=models.PositiveSmallIntegerField(choices=reader_status_choices)
    reader_enddate=models.DateField()
    def __str__(self):
        return self.person_name
    get_params=('reader_id',('readertype.readertype_id','readertype_id'),'reader_barcode','person_name','address','phone','citizen_id','password','reader_status','reader_enddate')
    set_params=(('readertype_id','readertype.readertype_id'),'reader_barcode','person_name','address','phone','citizen_id','password','reader_status','reader_enddate')
    def del_(self):pass
    def enter_stack(self,stack):
        raise NotImplementedError
    def borrow_all(self):
        return paramCopyL(Borrow.objects.filter(reader=self),Borrow.get_params)
    def borrow_active(self):
        return paramCopyL(Borrow.objects.filter(reader=self).filter(Q(borrow_status=0)|Q(borrow_status=3)),Borrow.get_params)
    def borrow_expired(self):
        import datetime
        return paramCopyL(Borrow.objects.filter(reader=self,borrow_status=0,return_date__lt=datetime.date.today()),Borrow.get_params)
    def fine_all(self):
        return paramCopyL(Fine.objects.filter(reader=self),Fine.get_params)
    def fine_active(self):
        return paramCopyL(Fine.objects.filter(reader=self,fine_status=0),Borrow.get_params)
    def set_status(self,reader_status):
        self.reader_status=reader_status
        self.save()
    def check_status(self):
        u"检查读者证是否处于正常状态、且没有罚款"
        if self.reader_status!=0:raise ReaderStatusError(self)
        if Fine.objects.filter(reader=self,fine_status=0).count()>0:raise HasFineError;
        
class ReaderTypeManager(models.Manager):
    u"读者类型集合"
    def all_(self):
        return paramCopyL(ReaderType.objects.all(),ReaderType.get_params)

class ReaderType(models.Model,instDefaultMethods):
    u"读者类型"
    objects=ReaderTypeManager()
    readertype_id=models.AutoField(primary_key=True)
    readertype_name=models.CharField(maxlength=64)
    def __str__(self):
        return self.readertype_name
    get_params=('readertype_id','readertype_name')
    put_params=('readertype_name')
    def del_(self):
        if Reader.objects.filter(readertype=self).count()>0:
            raise NotEmptyError('读者类型','读者')
        Permission.filter(readertype=self).delete()
        self.delete()

class FineManager(models.Manager):
    u"罚款记录集合"
    def all_(self):
        return paramCopyL(Fine.objects.all(),Fine.get_params)
    def active(self):
        return paramCopyL(Fine.objects.filter(fine_status=0),Fine.get_params)
    def query(self):
        raise NotImplementedError

class Fine(models.Model,instDefaultMethods):
    u"罚款记录"
    objects=FineManager()
    fine_id=models.AutoField(primary_key=True)
    librarian=models.ForeignKey('User')
    reader=models.ForeignKey('Reader')
    borrow=models.ForeignKey('Borrow')#应该是一对一关系
    fine_reason_choices=(
        (0,u'其他'),
        (1,u'逾期'),
        (2,u'损坏'),
        (3,u'遗失'),
    )
    fine_reason=models.PositiveSmallIntegerField(choices=fine_reason_choices)
    fine_status_choices=(
        (0,u'未缴'),
        (1,u'已缴'),
        (2,u'撤销'),
    )
    fine_status=models.PositiveSmallIntegerField(choices=fine_status_choices)
    fine_amount=models.FloatField(max_digits=7,decimal_places=2)
    fine_memo=models.TextField()
    def __str__(self):
        return self.reader.person_name+' '+str(self.amount)
    get_params=('fine_id',('librarian.employee_number','employee_number'),('reader.reader_id','reader_id'),('borrow.borrow_id','borrow_id'),'fine_reason','fine_status','fine_amount','fine_memo')
    put_params=(('employee_number','librarian.employee_number'),('reader_id','reader.reader_id'),('borrow_id','borrow.borrow_id'),'fine_reason','fine_status','fine_amount','fine_memo')
    def del_(self):pass
    def pay(self):
        raise NotImplementedError
    def cancel(self):
        raise NotImplementedError
    def compensate(self):
        raise NotImplementedError

class Permission(models.Model):
    u"读者权限"
    stacktype=models.ForeignKey('StackType')
    readertype=models.ForeignKey('ReaderType')
    can_enter=models.BooleanField()
    borrow_limit=models.SmallIntegerField()
    borrow_days=models.SmallIntegerField()
    borrow_renews=models.SmallIntegerField()
    reserve_limit=models.SmallIntegerField()
    reserve_period=models.SmallIntegerField()

class ReserveBook(models.Model):
    u"预约馆藏"
    reader=models.ForeignKey('Reader')
    book=models.ForeignKey('Book')
    location=models.ForeignKey('Location')
    reserve_date=models.DateTimeField()
    reserve_until=models.DateField()
    def __str__(self):
        return self.reader.person_name+' '+self.book.book_title+' '+str(self.reserve_until)
    def reserve_copy(self):
        u"试图将预约馆藏转为预约复本"
        #本函数只被Book.reserve_copy调用，假定已经清楚了过期预约馆藏、预约复本数据
        import datetime
        past_days=(datetime.date.today()-self.reserve_date).days
        #查询已归还的复本
        copies=Copy.objects.filter(book=self.book,shelf__stack__location=self.location,copy_status=2).select_related(depth=3)
        for copy in copies:
            try:self.reserve_copy_m(copy,past_days)
            except:pass
    @transaction.commit_on_success
    def reserve_copy_m(self,copy,past_days):
        stacktype=copy.shelf.stack.stacktype
        #查询读者权限；如无权限，抛出异常
        permission=Permission.objects.get(readertype=self.reader.readertype,stacktype=stacktype,reserve_limit__gt=0,reserve_period__gte=past_days)
        #查询读者已预约该类书库复本数；如满额，抛出异常
        if ReserveCopy.objects.filter(reader=self.reader,copy__shelf__stack__stacktype=stacktype).count()>=permission.reserve_limit:raise OverQuotaError
        #计算新的截止日期
        until=self.reserve_date+datetime.timedelta(permission.reserve_period)
        until=datetime.date(until.year,until.month,until.day)   
        #插入预约复本记录、更新复本状态、删除预约馆藏记录，必须同时，因此设置了transaction
        ReserveCopy.get_or_create(reader=self.reader,copy=copy,reserve_date=self.reserve_date,reserve_until=until)
        copy.copy_status=8
        copy.return_pdate=until
        copy.save()
        self.delete()

class ReserveCopy(models.Model):
    u"预约复本"
    reader=models.ForeignKey('Reader')
    copy=models.ForeignKey('Copy')
    reserve_date=models.DateTimeField()
    reserve_until=models.DateField()
    def __str__(self):
        return self.reader.person_name+' '+self.copy.copy_barcode+' '+str(self.reserve_until)

