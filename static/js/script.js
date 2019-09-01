var map;
var marker;
var autocomplete;
var searchCircle;
var resultsCircle;
var markers = [];
var schools = [];

initSlider('filter-distance', 'filter-distance-value');
initSlider('filter-enrolments', 'filter-enrolments-value');
initSlider('filter-train-station', 'filter-train-station-value');

document.getElementById('support-classes-checkbox').addEventListener('click', function() {
    var selector = document.getElementById('filter-support-classes');
    if (selector.disabled == false) {
        selector.disabled = true;
    } else {
        selector.disabled = false;
    }
});

document.getElementById('train-station-checkbox').addEventListener('click', function() {
    var slider = document.getElementById('filter-train-station');
    if (slider.disabled == false) {
        slider.disabled = true;
    } else {
        slider.disabled = false;
    }
});

document.getElementById('primary-radio').addEventListener('click', function() {
    document.getElementById('boys-checkbox').disabled = true;
    document.getElementById('girls-checkbox').disabled = true;
    document.getElementById('coed-checkbox').disabled = true;
    document.getElementById('opportunity-classes-checkbox').disabled = false;
    document.getElementById('fully-selective-checkbox').disabled = true;
    document.getElementById('partially-selective-checkbox').disabled = true;
    document.getElementById('not-selective-checkbox').disabled = true;
    document.getElementById('preschool-checkbox').disabled = false;
    document.getElementById('healthy-canteen-checkbox').disabled = false;
    document.getElementById('intensive-english-centre-checkbox').disabled = true;
});
document.getElementById('secondary-radio').addEventListener('click', function() {
    document.getElementById('boys-checkbox').disabled = false;
    document.getElementById('girls-checkbox').disabled = false;
    document.getElementById('coed-checkbox').disabled = false;
    document.getElementById('opportunity-classes-checkbox').disabled = true;
    document.getElementById('fully-selective-checkbox').disabled = false;
    document.getElementById('partially-selective-checkbox').disabled = false;
    document.getElementById('not-selective-checkbox').disabled = false;
    document.getElementById('preschool-checkbox').disabled = true;
    document.getElementById('healthy-canteen-checkbox').disabled = true;
    document.getElementById('intensive-english-centre-checkbox').disabled = false;
});
document.getElementById('central-radio').addEventListener('click', function() {
    document.getElementById('boys-checkbox').disabled = true;
    document.getElementById('girls-checkbox').disabled = true;
    document.getElementById('coed-checkbox').disabled = true;
    document.getElementById('opportunity-classes-checkbox').disabled = true;
    document.getElementById('fully-selective-checkbox').disabled = true;
    document.getElementById('partially-selective-checkbox').disabled = true;
    document.getElementById('not-selective-checkbox').disabled = true;
    document.getElementById('preschool-checkbox').disabled = false;
    document.getElementById('healthy-canteen-checkbox').disabled = false;
    document.getElementById('intensive-english-centre-checkbox').disabled = true;
});
document.getElementById('specific-radio').addEventListener('click', function() {
    document.getElementById('boys-checkbox').disabled = true;
    document.getElementById('girls-checkbox').disabled = true;
    document.getElementById('coed-checkbox').disabled = true;
    document.getElementById('opportunity-classes-checkbox').disabled = true;
    document.getElementById('fully-selective-checkbox').disabled = true;
    document.getElementById('partially-selective-checkbox').disabled = true;
    document.getElementById('not-selective-checkbox').disabled = true;
    document.getElementById('preschool-checkbox').disabled = true;
    document.getElementById('healthy-canteen-checkbox').disabled = false;
    document.getElementById('intensive-english-centre-checkbox').disabled = true;
});

function initSlider(slider, value) {
    var slider = document.getElementById(slider);
    var value = document.getElementById(value);
    value.innerText = slider.value;
    slider.oninput = function() {
        value.innerText = this.value;
    }
}

function search() {
    var found = false;
    var place = autocomplete.getPlace();
    if (place == null) {
        alert("Please enter your address first!");
        return;
    }
    var button = document.getElementById('snm-search-button');
    button.innerHTML = "<span class=\"spinner-border spinner-border-sm\" role=\"status\"></span>";
    button.setAttribute("disabled", true);
    fetch('./api/schools?longitude=' + place.geometry.location.lng() + '&latitude=' + place.geometry.location.lat()
        + getFiltersQuery())
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        clearMap();
        if (data.length == 0) {
            alert("We couldn't find any schools that matched your criteria!");
        } else {
            found = true;
            resultsCircle.setRadius((document.getElementById('filter-distance').value * 1000));
            data.forEach(function(school, index) {
                var content = '<center><img src="' + school.logo + '" height="75px"></center>' +
                    '<center><h6 style="padding-top: 10px;">' + school.name + '</h6></center>' +
                    '<p>' + school.street + ', ' + school.suburb + ', ' + school.postcode + '</p>' +
                    '<a class="btn btn-primary" href="./schools/' + school.code + '" target="_blank" style="width: 100%;">View Profile</a>';
                var infowindow = new google.maps.InfoWindow({
                        content: content
                });
                var temp_marker = new google.maps.Marker({
                    map: map,
                    position: {lat: school['latitude'], lng: school['longitude']},
                    infowindow: infowindow,
                    icon: "./static/img/marker.png"
                });
                temp_marker.addListener('click', function() {
                    for (var i = 0; i < markers.length; i++) {
                        markers[i].infowindow.close();
                    }
                    infowindow.open(map, temp_marker);
                });
                markers.push(temp_marker);
                schools.push({
                    name: school.name,
                    distance: school.distance,
                    marker: temp_marker
                });
            });
        }
    })
    .then(function() {
        map.panTo(place.geometry.location);
        map.fitBounds(searchCircle.getBounds());
        if (found && document.getElementById('snm-filter-list-collapse').className.split(" ").indexOf("show") > -1) {
            $('#snm-filter-backdrop-collapse').collapse('hide');
            $('#snm-filter-list-collapse').collapse('hide');
        }
        button.removeAttribute("disabled");
        button.innerText = "Search";
    });
}

function getFiltersQuery() {
    var query = [];
    query.push('&distance=' + (document.getElementById('filter-distance').value * 1000))
    query.push('level=' + document.querySelector('input[name="level-radio"]:checked').value)
    query.push('enrolments=' + document.getElementById('filter-enrolments').value);
    if (document.getElementById('secondary-radio').checked) {
        if (document.getElementById('boys-checkbox').checked) {
            query.push('gender=' + document.getElementById('boys-checkbox').value);
        }
        if (document.getElementById('girls-checkbox').checked) {
            query.push('gender=' + document.getElementById('girls-checkbox').value);
        }
        if (document.getElementById('coed-checkbox').checked) {
            query.push('gender=' + document.getElementById('coed-checkbox').value);
        }
        if (document.getElementById('fully-selective-checkbox').checked) {
            query.push('selective=' + document.getElementById('fully-selective-checkbox').value);
        }
        if (document.getElementById('partially-selective-checkbox').checked) {
            query.push('selective=' + document.getElementById('partially-selective-checkbox').value);
        }
        if (document.getElementById('not-selective-checkbox').checked) {
            query.push('selective=' + document.getElementById('not-selective-checkbox').value);
        }
    }
    if (document.getElementById('support-classes-checkbox').checked) {
        query.push('support_classes=' + document.getElementById('filter-support-classes').value);
    }
    if (document.getElementById('train-station-checkbox').checked) {
        query.push('train_duration=' + (document.getElementById('filter-train-station').value * 60));
    }
    if (!document.getElementById('opportunity-classes-checkbox').disabled && document.getElementById('opportunity-classes-checkbox').checked) {
        query.push('opportunity_classes=true');
    }
    if (!document.getElementById('preschool-checkbox').disabled && document.getElementById('preschool-checkbox').checked) {
        query.push('preschool=true');
    }
    if (!document.getElementById('late-opening-checkbox').disabled && document.getElementById('late-opening-checkbox').checked) {
        query.push('late_opening=true');
    }
    if (!document.getElementById('intensive-english-centre-checkbox').disabled && document.getElementById('intensive-english-centre-checkbox').checked) {
        query.push('intensive_english_centre=true');
    }
    if (!document.getElementById('healthy-canteen-checkbox').disabled && document.getElementById('healthy-canteen-checkbox').checked) {
        query.push('healthy_canteen=true');
    }
    return query.join('&');
}

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -33.8682894, lng: 151.2086763},
        zoom: 11,
        disableDefaultUI: true,
        gestureHandling: 'greedy',
        styles: [
            {
                "featureType": "administrative",
                "elementType": "geometry",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            }
        ]
    });
    map.addListener('click', function() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].infowindow.close();
        }
    });

    marker = new google.maps.Marker({
        map: map,
        position: map.center,
        label: 'H',
        visible: false
    });

    resultsCircle = new google.maps.Circle({
        map: map,
        radius: 0,
        fillColor: '#427CD1',
        fillOpacity: 0.15,
        strokeColor: '#444444',
        strokeWeight: 0.2,
        clickable: false
    });
    resultsCircle.bindTo('center', marker, 'position');

    searchCircle = new google.maps.Circle({
        map: map,
        radius: (document.getElementById('filter-distance').value * 1000),
        fillColor: '#427CD1',
        fillOpacity: 0.15,
        strokeColor: '#444444',
        strokeWeight: 0.2,
        clickable: false
    });

    $(document).on("input", "#filter-distance", function() {
        searchCircle.setRadius((document.getElementById('filter-distance').value * 1000));
    });

    autocomplete = new google.maps.places.Autocomplete(document.getElementById('snm-search-bar'));
    autocomplete.setFields(['geometry']);
    autocomplete.bindTo('bounds', map);
    autocomplete.addListener('place_changed', function() {
        clearMap();
        var place = autocomplete.getPlace();
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        searchCircle.bindTo('center', marker, 'position');
        map.panTo(place.geometry.location);
        map.fitBounds(searchCircle.getBounds());
        $('#snm-filter-list-collapse').collapse('show');
        $('#snm-filter-backdrop-collapse').collapse('show');
    });
}

function clearMap() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    resultsCircle.setRadius(0);
}
