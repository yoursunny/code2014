#商品分类表 
CREATE table category
    ( 
        ID int primary key, 
        title nvarchar(20) not null, 
        parentID int null references category(ID) 
    ) 
    ; 

#商品表 
CREATE table product
    ( 
        ID char(13) primary key, 
        pName nvarchar(20) not null, 
        cat int not null references category(ID), 
        brandName nvarchar(20) null, 
        model nvarchar(20) null 
    ) 
    ; 

#相关商品表 
CREATE table pSuggest
    ( 
        pID char(13) references product(ID), 
        suggestID char(13) references product(ID), 
        primary key(pID, suggestID) 
    ) 
    ; 

#门店表 
CREATE table shop
    ( 
        ID int primary key, 
        sName nvarchar(20) not null, 
        address nvarchar(50) not null, 
        phone nvarchar(30) not null 
    ) 
    ; 

#仓库表 
CREATE table warehouse
    ( 
        ID int primary key, 
        wName nvarchar(20) not null, 
        address nvarchar(50) not null, 
        shopID int null references shop(ID) 
    ) 
    ; 

#报价表 
CREATE table pPrice
    ( 
        ID int primary key auto_increment, 
        pID char(13) not null references product(ID), 
        shopID int not null references shop(ID), 
        creditReq decimal(8, 2) default 0 check(creditReq>=0), 
        price decimal(8, 2) not null check(price>0), 
        creditGet decimal(8, 2) default 0 check(creditGet>=0), 
        startDate datetime default '1000-01-01 00:00:00', 
        endDate datetime default '9999-12-31 23:59:59', 
        check(startDate<endDate) 
    ) 
    ; 

#存货表 
CREATE table stor
    ( 
        pID char(13) references product(ID), 
        wID int references warehouse(ID), 
        quantity int not null check(quantity>=0), 
        primary key(pID, wID) 
    ) 
    ; 

#购物单表 
CREATE table bill
    ( 
        ID int primary key auto_increment, 
        shopID int not null references shop(ID), 
        t datetime not null, 
        pID char(13) not null references product(ID), 
        salesID int null references sales(ID), 
        receiptPrinted tinyint default 0 check(receiptPrinted=0 OR receiptPrinted=1) 
    ) 
    ; 

#会员卡表 
CREATE table member
    ( 
        ID int primary key auto_increment, 
        shopID int not null references shop(ID), 
        credit decimal(12, 2) default 0, 
        pname nvarchar(20) not null, 
        birthday date null, 
        phone nvarchar(30) null, 
        email nvarchar(100) null, 
        address nvarchar(50) null, 
        postal char(6) null 
    ) 
    ; 

#销售表 
CREATE table sales
    ( 
        receiptID int primary key auto_increment, 
        pID char(13) not null references product(ID), 
        shopID int not null references shop(ID), 
        t datetime not null, 
        memberID int null references member(ID), 
        price decimal(8, 2) not null, 
        credit decimal(8, 2) default 0 
    ) 
    ; 

#调拨表 
CREATE table flitting
    ( 
        ID int primary key auto_increment, 
        pID char(13) not null references product(ID), 
        wFrom int not null references warehouse(ID), 
        wInto int not null references warehouse(ID), 
        t datetime not null, 
        quantity int not null check(quantity>0), 
        isReceived tinyint default 0 check(isReceived=0 OR isReceived=1) 
    ) 
    ; 

#供应商表 
CREATE table supplier
    ( 
        ID int primary key auto_increment, 
        sName nvarchar(30) not null unique, 
        sManager nvarchar(20) not null, 
        phone nvarchar(20) not null 
    ) 
    ; 

#进货表 
CREATE table stock
    ( 
        ID int primary key auto_increment, 
        supID int not null references supplier(ID), 
        pID char(13) not null references product(ID), 
        wInto int not null references warehouse(ID), 
        t datetime not null, 
        price decimal(8, 2) not null check(price>=0), 
        quantity int not null check(quantity>0), 
        isReceived tinyint default 0 check(isReceived=0 OR isReceived=1) 
    ) 
    ; 

#会员关注表，只能查到商品所属的最底层类别 
CREATE view interest as 
SELECT member.*, category.ID as catID, category.title as catTitle, count(sales.receiptID) as n 
FROM member 
INNER JOIN sales 
ON  member.ID=sales.memberID 
INNER JOIN product 
ON  sales.pID=product.ID 
INNER JOIN category 
ON  product.cat=category.ID 
GROUP BY member.ID, category.ID 
ORDER BY count(sales.receiptID) desc; 

#可提货商品表 
CREATE view pAvailable as 
SELECT product.ID as pID, product.pName as pName, category.ID as catID, category.title as catTitle, 
    product.brandName as brandName, product.model as model, shop.ID as shopID, shop.sName as sName, 
    warehouse.ID as wID, warehouse.wName as wName, stor.quantity- 
    (SELECT count(ID) 
    FROM bill 
    WHERE bill.shopID=shop.ID AND bill.pID=product.ID 
    ) as n, 
    (SELECT price 
    FROM pPrice 
    WHERE pPrice.pID=product.ID AND pPrice.shopID=shop.ID AND pPrice.startDate<=NOW() AND pPrice.endDate>=NOW() 
    AND pPrice.creditReq=0 LIMIT 0, 1 
    ) as price 
FROM category 
RIGHT JOIN product 
ON  category.ID=product.cat 
INNER JOIN stor 
ON  product.ID=stor.pID 
INNER JOIN warehouse 
ON  stor.wID=warehouse.ID 
LEFT JOIN shop 
ON  warehouse.shopID=shop.ID 
WHERE stor.quantity-
    (SELECT count(ID) 
    FROM bill 
    WHERE bill.shopID=shop.ID AND bill.pID=product.ID
    )
    >0 
ORDER BY pID;  

#销量统计表 
CREATE view salesCount as 
SELECT product.ID as pID, product.pName as pName, product.brandName as brandName, product.model as model, 
    shop.ID as shopID, shop.sName as sName, cast(sales.t as date) as t, count(sales.receiptID) as n 
FROM product 
LEFT JOIN sales 
ON  product.ID=sales.pID 
INNER JOIN shop 
ON  sales.shopID=shop.ID 
GROUP BY product.ID, shop.ID, cast(sales.t as date) 
ORDER BY shopID, pID; 

#需补充商品表，最近5天销量大于库存的商品 
CREATE view pNeed as 
SELECT product.ID as pID, product.pName as pName, product.brandName as brandName, product.model as model, 
    salesCount.shopID as shopID, salesCount.sName as sName, sum(salesCount.n) as sold, 
    warehouse.ID as wID, warehouse.wName as wName, stor.quantity as remain, 
    sum(salesCount.n)-stor.quantity as need 
FROM product 
INNER JOIN salesCount 
ON  product.ID=salesCount.pID 
INNER JOIN warehouse 
ON  salesCount.shopID=warehouse.shopID 
INNER JOIN stor 
ON  product.ID=stor.pID AND warehouse.ID=stor.wID 
WHERE curdate()>=salesCount.t AND curdate()-interval 5 day<salesCount.t 
GROUP BY product.ID, warehouse.shopID 
HAVING sum(salesCount.n)>2*stor.quantity 
ORDER BY wID, pID; 

#可调出商品表，门店附属仓库中最近15天销量小于库存的商品，非门店附属仓库中的全部商品 
CREATE view pExtra as 
    (SELECT product.ID as pID, product.pName as pName, product.brandName as brandName, product.model as model, 
        warehouse.ID as wID, warehouse.wName as wName, 
        stor.quantity as remain, stor.quantity-sum(salesCount.n) as extra 
    FROM product 
    INNER JOIN salesCount 
    ON  product.ID=salesCount.pID 
    INNER JOIN warehouse 
    ON  salesCount.shopID=warehouse.shopID 
    INNER JOIN stor 
    ON  product.ID=stor.pID AND warehouse.ID=stor.wID 
    WHERE curdate()>=salesCount.t AND curdate()-interval 15 day<salesCount.t 
    GROUP BY product.ID, warehouse.shopID 
    HAVING sum(salesCount.n)<stor.quantity 
    ) 
UNION 
    (SELECT product.ID as pID, product.pName as pName, product.brandName as brandName, product.model as model, 
        warehouse.ID as wID, warehouse.wName as wName, stor.quantity as remain, stor.quantity as extra 
    FROM product 
    INNER JOIN stor 
    ON  product.ID=stor.pID 
    INNER JOIN warehouse 
    ON  stor.wID=warehouse.ID 
    WHERE warehouse.shopID is null 
    GROUP BY product.ID, warehouse.shopID 
    ) 
ORDER BY wID, pID;  