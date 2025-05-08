import {customers_db, item_db ,orderdetails_db} from "../db/db.js";
import OrderDetailsModel from "../model/orderDetailsModel.js";

function loadItem() {
    $('#orderdetails-tbody').empty();

    orderdetails_db.forEach(item => {
        const row = `
            <tr>
                <td>${item.oid}</td>
                <td>${item.cid}</td>
                <td>${item.cnumber}</td>
                <td>${item.iname}</td>
                <td>${item.isellingprice}</td>
                <td>${item.qty}</td>
                <td>${item.total}</td>
                <td>${item.discount}</td>
                <td>${item.paid}</td>
                <td>${item.balance}</td>
            </tr>
        `;
        $('#orderdetails-tbody').append(row);
    });
}