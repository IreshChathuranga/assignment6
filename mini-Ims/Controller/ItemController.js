import {customers_db, item_db} from "../db/db.js";
import ItemModel from "../model/ItemModel.js";

// function loadItem() {
//     $('#item-tbody').empty();
//
//     item_db.forEach(item => {
//         const row = `
//             <tr>
//                 <td>${item.iid}</td>
//                 <td>${item.iname}</td>
//                 <td>${item.iquantity}</td>
//                 <td>${item.icostprice}</td>
//                 <td>${item.isellingprice}</td>
//             </tr>
//         `;
//         $('#item-tbody').append(row);
//     });
// }

$('#item_add').on('click', function () {
    let iid = $('#iid').val().trim();
    let iname = $('#iname').val().trim();
    let iquantity = $('#iquantity').val().trim();
    let icostprice = $('#icostprice').val().trim();
    let isellingprice = $('#isellingprice').val().trim();

    if (!iid || !iname || !iquantity || !icostprice || !isellingprice) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let item_data = new ItemModel(iid, iname, iquantity, icostprice, isellingprice);
    item_db.push(item_data);

    localStorage.setItem("item_db", JSON.stringify(item_db));

    loadItem();

    Swal.fire({
        title: "Added Successfully!",
        icon: "success"
    });

    $('#iid').val('');
    $('#iname').val('');
    $('#iquantity').val('');
    $('#icostprice').val('');
    $('#isellingprice').val('');
    $('#item_close').click();
});

$("#item-tbody").on('click', 'tr', function () {
    let index = $(this).index();
    let item = item_db[index];

    $('#cid').val(item.iid);
    $('#iname').val(item.iname);
    $('#iquantity').val(item.iquantity);
    $('#icostprice').val(item.icostprice);
    $('#isellingprice').val(item.isellingprice);
});

let selectedItemIndex = null;

$("#item-tbody").on('click', 'tr', function () {
    selectedItemIndex = $(this).index();
});

$('.btn-warning[data-bs-target="#exampleModalitem1"]').on('click', function () {
    if (selectedItemIndex === null) {
        Swal.fire({
            title: 'No item selected!',
            text: 'Please click on a item row before updating.',
            icon: 'warning'
        });
        return;
    }

    const item = item_db[selectedItemIndex];

    $('#iid1').val(item.iid);
    $('#iname1').val(item.iname);
    $('#iquantity1').val(item.iquantity);
    $('#icostprice1').val(item.icostprice);
    $('#isellingprice1').val(item.isellingprice);
});

$('.modal-footer .btn.btn-primary').on('click', function () {
    if (selectedItemIndex === null) return;

    let iid = $('#iid1').val().trim();
    let iname = $('#iname1').val().trim();
    let iquantity = $('#iquantity1').val().trim();
    let icostprice = $('#icostprice1').val().trim();
    let isellingprice = $('#isellingprice1').val().trim();

    if (!iid || !iname || !iquantity || !icostprice || !isellingprice) {
        Swal.fire({
            title: 'Error!',
            text: 'Please fill in all fields.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
        return;
    }

    let updatedItem = new ItemModel(iid, iname, iquantity, icostprice, isellingprice);
    item_db[selectedItemIndex] = updatedItem;

    loadItem();

    Swal.fire({
        title: "Updated Successfully!",
        icon: "success"
    });

    $('#exampleModalitem1').modal('hide');
    selectedItemIndex = null;
});

$('.item-delete-btn').on('click', function () {
    if (selectedItemIndex === null) {
        Swal.fire({
            title: 'No item selected!',
            text: 'Please select a item to delete.',
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
            item_db.splice(selectedItemIndex, 1);
            loadItem();
            selectedItemIndex = null;

            Swal.fire(
                'Deleted!',
                'Item has been deleted.',
                'success'
            );
        }
    });
});

$('form[role="search"]').on('submit', function (e) {
    e.preventDefault();
    const query = $(this).find('input[type="search"]').val().toLowerCase();

    $('#item-tbody').empty();

    item_db.forEach(item => {
        if (
            item.iid.toLowerCase().includes(query) ||
            item.iname.toLowerCase().includes(query) ||
            item.iquantity.toLowerCase().includes(query) ||
            item.icostprice.toLowerCase().includes(query) ||
            item.isellingprice.toLowerCase().includes(query)
        ) {
            const row = `
                <tr>
                    <td>${item.iid}</td>
                    <td>${item.iname}</td>
                    <td>${item.iquantity}</td>
                    <td>${item.icostprice}</td>
                    <td>${item.isellingprice}</td>
                </tr>
            `;
            $('#item-tbody').append(row);
        }
    });
});

$('#clearitem').on('click', function () {
    $('#iid').val('');
    $('#iname').val('');
    $('#iquantity').val('');
    $('#icostprice').val('');
    $('#isellingprice').val('');
});

$('#clearitem').on('click', function () {
    $('#exampleModalitem input').val('');
});

function loadItem() {
    $('#item-tbody').empty();

    const displayedOrderIds = new Set();

    item_db.forEach(item => {
        if (!displayedOrderIds.has(item.iid)) {
            displayedOrderIds.add(item.iid);

            const row = `
                <tr>
                    <td>${item.iid}</td>
                <td>${item.iname}</td>
                <td>${item.iquantity}</td>
                <td>${item.icostprice}</td>
                <td>${item.isellingprice}</td>
                </tr>
            `;
            $('#item-tbody').append(row);
        }
    });
}
$(document).ready(function () {
    loadItem();
});