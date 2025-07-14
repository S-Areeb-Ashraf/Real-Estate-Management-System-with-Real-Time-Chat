$(document).ready(function () {
    const userId = new URLSearchParams(window.location.search).get('userId');
    $('#userId').val(userId);
    let currentRequest = null;

    function fetchPendingRequests() {
        $.ajax({
            url: `/api/agreement/requests/${userId}`,
            method: 'GET',
            data: { user_id: userId },
            success: function (requests) {
                const list = $('#pending-requests-list');
                list.empty();
                requests.forEach(function (req) {
                    const li = $('<li>').text(`Property #${req.property_id} - Tenant #${req.tenant_id}`);
                    const btn = $('<button>').text('Confirm');
                    btn.click(function () {
                        showAgreementForm(req);
                    });
                    li.append(btn);
                    list.append(li);
                });
            },
            error: function () {
                alert('Failed to load agreement requests.');
            }
        });
    }

    function showAgreementForm(req) {
        currentRequest = req;
        $('#pending-requests-section').hide();
        $('#agreement-form-section').show();
    }

    $('#agreement-form').submit(function (e) {
        e.preventDefault();
        const formData = $(this).serializeArray();
        const data = {
            property_id: currentRequest.Property_property_id,
            tenant_id: currentRequest.Tenant_tenant_id,
            user_id: userId
        };
        formData.forEach(function (item) {
            data[item.name] = item.value;
        });
        $.ajax({
            url: `/api/agreement/confirm/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function () {
                alert('Agreement details submitted to tenant.');
                location.reload();
            },
            error: function () {
                alert('Failed to submit agreement details.');
            }
        });
    });

    $('#exit-agreement-btn').click(function () {
        $.ajax({
            url: `/api/agreement/exit/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ property_id: currentRequest.property_id, tenant_id: currentRequest.tenant_id, user_id: userId }),
            success: function () {
                location.reload();
            }
        });
    });

    function fetchAllAgreements() {
        $.ajax({
            url: `/api/agreements/all/${userId}`,
            method: 'GET',
            success: function (grouped) {
                const pendingList = $('#pending-requests-list');
                pendingList.empty();
                grouped.pending.forEach(function (req) {
                    const li = $('<li>').text(`Property #${req.Property_property_id} - Tenant #${req.Tenant_tenant_id}`);
                    const btn = $('<button>').text('Confirm');
                    btn.click(function () {
                        showAgreementForm(req);
                    });
                    li.append(btn);
                    pendingList.append(li);
                });

                
                if ($('#active-agreements-section').length === 0) {
                    $('.agreement-container').append('<div id="active-agreements-section"><h3>Active Agreements</h3><ul id="active-agreements-list"></ul></div>');
                }
                const activeList = $('#active-agreements-list');
                activeList.empty();
                grouped.active.forEach(function (ag) {
                    const li = $('<li>').html(
                        `<strong>Property:</strong> ${ag.Property_property_id} (${ag.address})<br>` +
                        `<strong>Tenant:</strong> ${ag.tenant_first_name} ${ag.tenant_last_name} (ID: ${ag.Tenant_tenant_id})<br>` +
                        `<strong>Duration:</strong> ${ag.duration}<br>` +
                        `<strong>Deposit:</strong> ${ag.deposit}<br>` +
                        `<strong>Rent:</strong> ${ag.rent_amount}<br>` +
                        `<strong>Rent Increase (months):</strong> ${ag.rent_increase_x_months}<br>`
                    );
                    activeList.append(li);
                });


                if ($('#landlord-filled-section').length === 0) {
                    $('.agreement-container').append('<div id="landlord-filled-section"><h3>Waiting for Tenant Final Confirmation</h3><ul id="landlord-filled-list"></ul></div>');
                }
                const filledList = $('#landlord-filled-list');
                filledList.empty();
                grouped.landlord_filled.forEach(function (ag) {
                    const li = $('<li>').html(
                        `<strong>Property:</strong> ${ag.Property_property_id} (${ag.address})<br>` +
                        `<strong>Tenant:</strong> ${ag.tenant_first_name} ${ag.tenant_last_name} (ID: ${ag.Tenant_tenant_id})<br>` +
                        `<strong>Duration:</strong> ${ag.duration}<br>` +
                        `<strong>Deposit:</strong> ${ag.deposit}<br>` +
                        `<strong>Rent:</strong> ${ag.rent_amount}<br>` +
                        `<strong>Rent Increase (months):</strong> ${ag.rent_increase_x_months}<br>`
                    );
                    filledList.append(li);
                });
                if ($('#cancelled-agreements-section').length === 0) {
                    $('.agreement-container').append('<div id="cancelled-agreements-section"><h3>Cancelled Agreements</h3><ul id="cancelled-agreements-list"></ul></div>');
                }
                const cancelledList = $('#cancelled-agreements-list');
                cancelledList.empty();
                grouped.cancelled.forEach(function (ag) {
                    const li = $('<li>').html(
                        `<strong>Property:</strong> ${ag.Property_property_id} (${ag.address})<br>` +
                        `<strong>Tenant:</strong> ${ag.tenant_first_name} ${ag.tenant_last_name} (ID: ${ag.Tenant_tenant_id})<br>` +
                        `<strong>Status:</strong> Cancelled<br>`
                    );
                    cancelledList.append(li);
                });
            }
        });
    }



    fetchPendingRequests();
    fetchAllAgreements();
}); 