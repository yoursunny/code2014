//devided payment  分期付款
//设总费用S元，分摊到每月费用A元，第i月的费用在购买或安装时相当于Pi元，月利率R，分摊到n个月。

function dpA(S,n,R) {
A=S*R*Math.pow(1+R,n)/(Math.pow(1+R,n)-1);
return A;
}
