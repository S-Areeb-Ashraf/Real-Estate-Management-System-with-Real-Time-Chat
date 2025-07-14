$(document).ready(function () {
    const userId = new URLSearchParams(window.location.search).get('userId');
    $('#userId').val(userId);

    function fetchAdvertisedProperties() {
        $.ajax({
            url: `/api/properties/advertised/${userId}`,
            method: 'GET',
            success: function (properties) {
                const list = $('#property-list');
                list.empty();
                properties.forEach(function (prop) {
                    const li = $('<li>').text(`Property #${prop.advertising_id} - ${prop.address} - Rent: ${prop.demanded_rent} - Status: ${prop.status}`);
                    const btn = $('<button>').text('Request Agreement');
                    btn.click(function () {
                        requestAgreement(prop.Property_property_id);
                    });
                    li.append(btn);
                    list.append(li);
                });
            },
            error: function (err) {
                alert('Failed to load properties.');
                console.log(err);
            }
        });
    }

    function requestAgreement(propertyId) {
        $.ajax({
            url: `/api/agreement/request/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ property_id: propertyId, user_id: userId }),
            success: function (data) {
                showAgreementStatus(data);
            },
            error: function (err) {
                alert('Failed to request agreement.');
            }
        });
    }

    function showAgreementStatus(data) {
        $('#property-list-section').hide();
        $('#agreement-status-section').show();
        $('#agreement-status').text(`Agreement request sent for Property #${data.property_id}. Waiting for landlord confirmation...`);
    }

    $('#current-exit-btn').off('click').on('click', function () {
        $.ajax({
            url: `/api/agreement/exit/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ user_id: userId }),
            success: function () {
                $('#current-agreement-section').remove();
                $('#property-list-section').show();
                fetchAdvertisedProperties();
            }
        });
    });
    $('#exit-agreement-btn').click(function () {
        $.ajax({
            url: `/api/agreement/exit/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ user_id: userId }),
            success: function () {
                $('#agreement-status-section').hide();
                $('#property-list-section').show();
                fetchAdvertisedProperties();
            }
        });
    });
    

    setInterval(function () {
        $.ajax({
            url: `/api/agreement/status/${userId}`,
            method: 'GET',
            data: { user_id: userId },
            success: function (status) {
                if (status && status.stage === 'active') {
                    $('#property-list-section').hide();
                    $('#agreement-status-section').hide();
                    $('#final-confirm-section').hide();
                    if ($('#current-agreement-section').length === 0) {
                        $('.agreement-container').append('<div id="current-agreement-section"><h3>Current Agreement</h3><div id="current-agreement-details"></div><button id="current-exit-btn">Exit Agreement</button></div>');
                    }
                    $('#current-agreement-details').html(
                        `<strong>Property ID:</strong> ${status.property_id}<br>` +
                        `<strong>Duration:</strong> ${status.duration}<br>` +
                        `<strong>Deposit:</strong> ${status.deposit}<br>` +
                        `<strong>Rent Amount:</strong> ${status.rent_amount}<br>` +
                        `<strong>Rent Increase (months):</strong> ${status.rent_increase_x_months}<br>`
                    );
                    $('#current-exit-btn').off('click').on('click', function () {
                        $.ajax({
                            url: `/api/agreement/exit/${userId}`,
                            method: 'POST',
                            contentType: 'application/json',
                            data: JSON.stringify({ user_id: userId }),
                            success: function () {
                                location.reload();
                            }
                        });
                    });
                } else if (status && status.stage === 'landlord_filled') {
                    $('#agreement-status-section').hide();
                    $('#final-confirm-section').show();
                    $('#agreement-details').html(
                        `<strong>Duration:</strong> ${status.duration}<br>` +
                        `<strong>Deposit:</strong> ${status.deposit}<br>` +
                        `<strong>Rent Amount:</strong> ${status.rent_amount}<br>` +
                        `<strong>Rent Increase (months):</strong> ${status.rent_increase_x_months}<br>`
                    );
                } else if (status && status.stage === 'pending') {
                    $('#property-list-section').hide();
                    $('#agreement-status-section').show();
                    $('#agreement-status').text(`Agreement request sent for Property #${status.property_id}. Waiting for landlord confirmation...`);
                } else {
                    $('#property-list-section').show();
                    $('#agreement-status-section').hide();
                    $('#final-confirm-section').hide();
                    $('#current-agreement-section').remove();
                }
            }
        });
    }, 3000);

    $('#final-confirm-btn').click(function () {
        $.ajax({
            url: `/api/agreement/final_confirm/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ user_id: userId }),
            success: function () {
                alert('Agreement finalized!');
                location.reload();
            }
        });
    });
    $('#final-exit-btn').click(function () {
        $.ajax({
            url: `/api/agreement/exit/${userId}`,
            method: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ user_id: userId }),
            success: function () {
                $('#final-confirm-section').hide();
                $('#property-list-section').show();
                fetchAdvertisedProperties();
            }
        });
    });

    fetchAdvertisedProperties();
}); 