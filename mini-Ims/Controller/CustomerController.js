import { customers_db } from "../db/db.js";
import CustomerModel from "../model/CustomerModel.js";

function loadCustomer() {
    $('#customer-tbody').empty();
    const displayedCustomerIds = new Set();

    customers_db.forEach(item => {
        if (!displayedCustomerIds.has(item.cid)) {
            displayedCustomerIds.add(item.cid);

            const row = `
                <tr>
                    <td>${item.cid}</td>
                    <td>${item.cname}</td>
                    <td>${item.caddress}</td>
                    <td>${item.cemail}</td>
                    <td>${item.cnumber}</td>
                </tr>
            `;
            $('#customer-tbody').append(row);
        }
    });
}

function updateCustomerCount() {
    $('.cust-number').text(customers_db.length);
}

$(document).ready(function () {
    const storedCustomers = localStorage.getItem("customers_db");
    if (storedCustomers) {
        const parsedCustomers = JSON.parse(storedCustomers);
        customers_db.length = 0;
        parsedCustomers.forEach(c => customers_db.push(c));
    }

    loadCustomer();
    updateCustomerCount();
});

let selectedCustomerIndex = null;

$('#customer_add').on('click', function () {
    let cid = $('#cid').val().trim();
    let cname = $('#cname').val().trim();
    let caddress = $('#caddress').val().trim();
    let cemail = $('#cemail').val().trim();
    let cnumber = $('#cnumber').val().trim();

    if (!cid || !cname || !caddress || !cemail || !cnumber) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let customer_data = new CustomerModel(cid, cname, caddress, cemail, cnumber);

    customers_db.push(customer_data);
    localStorage.setItem("customers_db", JSON.stringify(customers_db));

    loadCustomer();
    updateCustomerCount();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });

    $('#cid').val('');
    $('#cname').val('');
    $('#caddress').val('');
    $('#cemail').val('');
    $('#cnumber').val('');
    $('#customer_close').click();
});

$("#customer-tbody").on('click', 'tr', function () {
    selectedCustomerIndex = $(this).index();
    const customer = customers_db[selectedCustomerIndex];

    $('#cid').val(customer.cid);
    $('#cname').val(customer.cname);
    $('#caddress').val(customer.caddress);
    $('#cemail').val(customer.cemail);
    $('#cnumber').val(customer.cnumber);
});

$('.btn-warning[data-bs-target="#exampleModal1"]').on('click', function () {
    if (selectedCustomerIndex === null) {
        Swal.fire({
            title: 'No customer selected!',
            text: 'Please click on a customer row before updating.',
            icon: 'warning'
        });
        return;
    }

    const customer = customers_db[selectedCustomerIndex];

    $('#cid1').val(customer.cid);
    $('#cname1').val(customer.cname);
    $('#caddress1').val(customer.caddress);
    $('#cemail1').val(customer.cemail);
    $('#cnumber1').val(customer.cnumber);
});

$('.modal-footer .btn.btn-primary').on('click', function () {
    if (selectedCustomerIndex === null) return;

    let cid = $('#cid1').val().trim();
    let cname = $('#cname1').val().trim();
    let caddress = $('#caddress1').val().trim();
    let cemail = $('#cemail1').val().trim();
    let cnumber = $('#cnumber1').val().trim();

    if (!cid || !cname || !caddress || !cemail || !cnumber) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let updatedCustomer = new CustomerModel(cid, cname, caddress, cemail, cnumber);
    customers_db[selectedCustomerIndex] = updatedCustomer;

    localStorage.setItem("customers_db", JSON.stringify(customers_db));
    loadCustomer();
    updateCustomerCount();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success"
    });

    $('#exampleModal1').modal('hide');
    selectedCustomerIndex = null;
});

$('.customer-delete-btn').on('click', function () {
    if (selectedCustomerIndex === null) {
        Swal.fire({
            title: 'No customer selected!',
            text: 'Please select a customer to delete.',
            icon: 'warning'
        });
        return;
    }

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            customers_db.splice(selectedCustomerIndex, 1);
            localStorage.setItem("customers_db", JSON.stringify(customers_db));
            loadCustomer();
            updateCustomerCount();
            selectedCustomerIndex = null;

            Swal.fire(
                'Deleted!',
                'Customer has been deleted.',
                'success'
            );
        }
    });
});

$('form[role="search"]').on('submit', function (e) {
    e.preventDefault();
    const query = $(this).find('input[type="search"]').val().toLowerCase();

    $('#customer-tbody').empty();

    customers_db.forEach(item => {
        if (
            item.cid.toLowerCase().includes(query) ||
            item.cname.toLowerCase().includes(query) ||
            item.caddress.toLowerCase().includes(query) ||
            item.cemail.toLowerCase().includes(query) ||
            item.cnumber.toLowerCase().includes(query)
        ) {
            const row = `
                <tr>
                    <td>${item.cid}</td>
                    <td>${item.cname}</td>
                    <td>${item.caddress}</td>
                    <td>${item.cemail}</td>
                    <td>${item.cnumber}</td>
                </tr>
            `;
            $('#customer-tbody').append(row);
        }
    });
});

$('#clear').on('click', function () {
    $('#cid').val('');
    $('#cname').val('');
    $('#caddress').val('');
    $('#cemail').val('');
    $('#cnumber').val('');
    $('#exampleModal input').val('');
});
