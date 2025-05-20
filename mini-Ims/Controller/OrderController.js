import {customers_db, item_db ,orderdetails_db} from "../db/db.js";
import CustomerModel from "../model/customerModel.js";
import ItemModel from "../model/itemModel.js";
import OrderDetailsModel from "../model/orderDetailsModel.js";

let savedCustomers = JSON.parse(localStorage.getItem("customers_db")) || [];
savedCustomers.forEach(customer => customers_db.push(customer));
let savedItems = JSON.parse(localStorage.getItem("item_db")) || [];
savedItems.forEach(item => {
    let reconstructedItem = new ItemModel(
        item.iid,
        item.iname,
        item.iquantity,
        item.icostprice,
        item.isellingprice
    );
    item_db.push(reconstructedItem);
});

let savedOrders = JSON.parse(localStorage.getItem("orderdetails_db")) || [];
savedOrders.forEach(order => {
    let reconstructedOrder = new OrderDetailsModel(
        order.oid,
        order.cid,
        order.cnumber,
        order.iname,
        order.isellingprice,
        order.qty,
        order.total,
        order.discount,
        order.subamount,
        order.paid,
        order.balance
    );
    orderdetails_db.push(reconstructedOrder);
});

$('#btnSearchCustomer').on('click', function(event) {
    event.preventDefault();
    let customerId = $('#customerId').val().trim();
    let isNewCustomer = true;

    customers_db.forEach(function (customer) {
        if (customer.cid === customerId) {
            isNewCustomer = false;
            $('#order-tbody').empty();
            $('#custname').val(customer.cname);
            $('#custaddress').val(customer.caddress);
            $('#custemail').val(customer.cemail);
            $('#custnumber').val(customer.cnumber);
        }
    });

    if (isNewCustomer) {
        Swal.fire({
            title: "Customer not found",
            icon: "warning",
            timer: 1000,
            showConfirmButton: false,
        });
    }
});

$('#btnSearchItem').on('click', function(event) {
    event.preventDefault();
    let itemId = $('#itemId').val().trim();
    let isNewItem = true;

    item_db.forEach(function (item) {
        if (item.iid === itemId) {
            isNewItem = false;
            $('#order-tbody').empty();
            $('#itemname').val(item.iname);
            $('#itemsellprice').val(item.isellingprice);
            $('#qty').val(item.iquantity);
        }
    });

    if (isNewItem) {
        Swal.fire({
            title: "Item not found",
            icon: "warning",
            timer: 1000,
            showConfirmButton: false,
        });
    }
});

$('#orderqty').on('input', function () {
    const qty = parseFloat($('#orderqty').val());
    const price = parseFloat($('#itemsellprice').val());

    if (!isNaN(qty) && !isNaN(price)) {
        const subtotal = qty * price;
        $('#subtotal').val(subtotal.toFixed(2));
        $('#total').val(subtotal.toFixed(2));
    } else {
        $('#subtotal').val('');
    }
});

$('#add_to_card').on('click', function () {
    const itemId = $('#itemId').val().trim();
    const itemName = $('#itemname').val().trim();
    const itemPrice = parseFloat($('#itemsellprice').val()).toFixed(2);
    const qty = $('#qty').val().trim();
    const orderQty = $('#orderqty').val().trim();
    const subtotal = parseFloat($('#subtotal').val()).toFixed(2);

    if (!itemId || !itemName || isNaN(itemPrice) || isNaN(orderQty) || isNaN(subtotal)) {
        Swal.fire({
            title: "Please fill all required fields correctly",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
        });
        return;
    }

    const newRow = `
        <tr>
            <td>${itemId}</td>
            <td>${itemName}</td>
            <td>${itemPrice}</td>
            <td>${qty}</td>
            <td>${orderQty}</td>
            <td>${subtotal}</td>
        </tr>
    `;
    $('#order-tbody').append(newRow);

    $('#itemId').val('');
    $('#itemname').val('');
    $('#itemsellprice').val('');
    $('#qty').val('');
    $('#orderqty').val('');
    $('#subtotal').val('');
});

$('#btn-clear').on('click', function () {
    $('#customerId').val('');
    $('#custname').val('');
    $('#custaddress').val('');
    $('#custemail').val('');
    $('#custnumber').val('');
});

$('#btn-clear').on('click', function () {
    $('#exampleModal input').val('');
});

$('#clear1').on('click', function () {
    $('#itemId').val('');
    $('#itemname').val('');
    $('#itemsellprice').val('');
    $('#qty').val('');
    $('#orderqty').val('');
});

$('#clear1').on('click', function () {
    $('#exampleModal input').val('');
});

$('#discount').on('click', function () {
    const total = parseFloat($('#total').val());
    const discountPercent = parseFloat($('#bouns').val());

    if (isNaN(total) || isNaN(discountPercent)) {
        Swal.fire({
            title: "Please enter valid Total and Discount",
            icon: "error",
            timer: 1500,
            showConfirmButton: false,
        });
        return;
    }

    const discountAmount = (total * discountPercent) / 100;

    const discountedTotal = total - discountAmount;

    $('#subamount').val(discountedTotal.toFixed(2));
});

$('#btn-orderclear').on('click', function () {
    $('#total').val('');
    $('#bouns').val('');
    $('#subamount').val('');
    $('#cash').val('');
    $('#blance').val('');
    $('#orderid').val('');
});

$(document).on('click', '#order-tbody tr', function () {
    $('#order-tbody tr').removeClass('selected-row');
    $(this).addClass('selected-row');
});

$('#btn-delete').on('click', function () {
    const selectedRow = $('#order-tbody tr.selected-row');
    if (selectedRow.length === 0) {
        Swal.fire({
            title: "Please select a row to delete",
            icon: "warning",
            timer: 1500,
            showConfirmButton: false,
        });
    } else {
        selectedRow.remove();
    }
});

$('#cash').on('input', function () {
    const cash = parseFloat($('#cash').val());
    const subamount = parseFloat($('#subamount').val());

    if (!isNaN(cash) && !isNaN(subamount)) {
        const balance = cash - subamount;
        $('#blance').val(balance.toFixed(2));
    } else {
        $('#blance').val('');
    }
});

function loadItem() {
    $('#orderdetails-tbody').empty();

    const displayedOrderIds = new Set();

    orderdetails_db.forEach(item => {
        if (!displayedOrderIds.has(item.oid)) {
            displayedOrderIds.add(item.oid);

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
                    <td>${item.subamount}</td>
                    <td>${item.paid}</td>
                    <td>${item.balance}</td>
                </tr>
            `;
            $('#orderdetails-tbody').append(row);
        }
    });
}
$(document).ready(function () {
    loadItem();
});
$('#comformorder').on('click', function () {
    let oid = $('#orderid').val().trim();
    let cid = $('#customerId').val().trim();
    let cphone = $('#custnumber').val().trim();
    let discount = $('#bouns').val().trim();
    let subamount = $('#subamount').val().trim();
    let cash = $('#cash').val().trim();
    let balance = $('#blance').val().trim();

    if (!oid || !cid || !cphone || !discount || !subamount || !cash || !balance) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all order fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let orderRows = $('#order-tbody tr');

    if (orderRows.length === 0) {
        Swal.fire({
            title: 'Error!',
            text: 'Please add at least one item to the order.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    orderRows.each(function () {
        let cols = $(this).find('td');
        let iname = $(cols[1]).text().trim();
        let isellingprice = $(cols[2]).text().trim();
        let orderQty = $(cols[4]).text().trim();
        let total = $(cols[5]).text().trim();

        let order_data = new OrderDetailsModel(
            oid,
            cid,
            cphone,
            iname,
            isellingprice,
            orderQty,
            total,
            discount,
            subamount,
            cash,
            balance
        );

        orderdetails_db.push({ ...order_data });
    });

    localStorage.setItem("orderdetails_db", JSON.stringify(orderdetails_db));
    loadItem();
    Swal.fire({
        title: "Order Placed Successfully!",
        icon: "success"
    });

    $('#btn-orderclear').click();
    $('#order-tbody').empty();
});

$(document).on('click', '#orderdetails-tbody tr', function () {
    $('#orderdetails-tbody tr').removeClass('selected-row');
    $(this).addClass('selected-row');
});

$(document).on('click', '.delete-btn', function () {
    const selectedRow = $('#orderdetails-tbody tr.selected-row');

    if (selectedRow.length === 0) {
        Swal.fire({
            title: "Please select a row to delete",
            icon: "warning",
            timer: 1500,
            showConfirmButton: false,
        });
        return;
    }

    const orderId = selectedRow.find('td:eq(0)').text().trim();
    const itemName = selectedRow.find('td:eq(3)').text().trim();

    const newOrders = orderdetails_db.filter(order =>
        !(order.oid === orderId && order.iname === itemName)
    );

    orderdetails_db.length = 0;
    newOrders.forEach(order => orderdetails_db.push(order));
    localStorage.setItem("orderdetails_db", JSON.stringify(orderdetails_db));

    selectedRow.remove();

    Swal.fire({
        title: "Order entry deleted successfully!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false,
    });
});


$('#update').on('click', function () {
    const selectedRow = $('#orderdetails-tbody tr.selected-row');

    if (selectedRow.length === 0) {
        Swal.fire({
            title: "Please select an order to update",
            icon: "warning",
            timer: 1500,
            showConfirmButton: false,
        });
        return;
    }

    const columns = selectedRow.find('td');
    $('#oid').val(columns.eq(0).text());
    $('#customercode').val(columns.eq(1).text());
    $('#customernumber').val(columns.eq(2).text());
    $('#item').val(columns.eq(3).text());
    $('#itemprice').val(columns.eq(4).text());
    $('#qtycount').val(columns.eq(5).text());
    $('#totalnum').val(columns.eq(6).text());
    $('#orderdiscount').val(columns.eq(7).text());
    $('#subtotalnumber').val(columns.eq(8).text());
    $('#Paid').val(columns.eq(9).text());
    $('#balancecount').val(columns.eq(10).text());
});

$('.update-order').on('click', function () {
    let oid = $('#oid').val().trim();

    let index = orderdetails_db.findIndex(order => order.oid === oid);
    if (index === -1) {
        Swal.fire({
            title: 'Error!',
            text: 'Order not found!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    orderdetails_db[index].cid = $('#customercode').val().trim();
    orderdetails_db[index].cnumber = $('#customernumber').val().trim();
    orderdetails_db[index].iname = $('#item').val().trim();
    orderdetails_db[index].isellingprice = $('#itemprice').val().trim();
    orderdetails_db[index].qty = $('#qtycount').val().trim();
    orderdetails_db[index].total = $('#totalnum').val().trim();
    orderdetails_db[index].discount = $('#orderdiscount').val().trim();
    orderdetails_db[index].subamount = $('#subtotalnumber').val().trim();
    orderdetails_db[index].paid = $('#Paid').val().trim();
    orderdetails_db[index].balance = $('#balancecount').val().trim();

    localStorage.setItem("orderdetails_db", JSON.stringify(orderdetails_db));

    Swal.fire({
        title: "Updated!",
        text: "Order updated successfully!",
        icon: "success",
        timer: 1200,
        showConfirmButton: false
    });

    $('#exampleModalOrderDetails').modal('hide');
    loadItem();
});

$(document).on('click', '#orderdetails-tbody tr', function () {
    $('#orderdetails-tbody tr').removeClass('selected-row');
    $(this).addClass('selected-row');
});
