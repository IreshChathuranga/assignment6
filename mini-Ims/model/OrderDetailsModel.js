export default class OrderDetailsModel {
    constructor(oid, cid, cnumber,iname, isellingprice, qty, total,discount,subamount,paid,balance) {
        this.oid = oid;
        this.cid = cid;
        this.cnumber = cnumber;
        this.iname = iname;
        this.isellingprice = isellingprice;
        this.qty = qty;
        this.total = total;
        this.discount = discount;
        this.subamount = subamount;
        this.paid = paid;
        this.balance = balance;
    }
}