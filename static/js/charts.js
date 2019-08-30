var map;
function initMap() {
    var location = {lat: lat, lng: lng}
    map = new google.maps.Map(document.getElementById('snm-school-map'), {
        center: location,
        zoom: 16
    });
    var marker = new google.maps.Marker({position: location, map: map});
}

var name, indigenous_pct, lbote_pct, icsea, lat, lng;
function initChartData(lat, lng, name, indigenous_pct, lbote_pct, icsea) {
    this.lat = lat;
    this.lng = lng;
    this.name = name;
    this.indigenous_pct = indigenous_pct;
    this.lbote_pct = lbote_pct;
    this.icsea = icsea;
}

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawCharts);
function drawCharts() {
    var dataIndigenous;
    var dataLBOTE;
    var dataICSEA;
    if (indigenous_pct != -1) {
        dataIndigenous = google.visualization.arrayToDataTable([
            ['Student',                'Percentage'],
            ['Indigenous',           indigenous_pct],
            ['Non-indigenous', 100 - indigenous_pct]
        ]);
    } else {
        dataIndigenous = google.visualization.arrayToDataTable([
            ['Student', 'Percentage'],
            ['No Data',          100]
        ]);
    }
    if (lbote_pct != -1) {
        dataLBOTE = google.visualization.arrayToDataTable([
            ['Student',    'Percentage'],
            ['LBOTE',         lbote_pct],
            ['English', 100 - lbote_pct]
        ]);
    } else {
        dataLBOTE = google.visualization.arrayToDataTable([
            ['Student', 'Percentage'],
            ['No Data',          100]
        ]);
    }
    if (icsea != -1) {
        dataICSEA = google.visualization.arrayToDataTable([
            ['School', 'ICSEA Value'],
            ['Average',         1000],
            [name,             icsea]
        ]);
    } else {
        dataICSEA = google.visualization.arrayToDataTable([
            ['School', 'ICSEA Value'],
            ['Average',         1000],
            ['No Data',            0]
        ]);
    }
    var optionsIndigenous = {
        height: 275,
        pieHole: 0.4,
        backgroundColor: 'transparent',
        chartArea: {
            left: 60,
            width: '100%',
            height: '85%'
        },
        tooltip: {
            text: 'percentage'
        }
    };
    if (indigenous_pct == -1) {
        optionsIndigenous["colors"] = ["#444"]
    }

    var optionsLBOTE = {
        height: 275,
        pieHole: 0.4,
        backgroundColor: 'transparent',
        chartArea: {
            left: 60,
            width: '100%',
            height: '85%'
        },
        tooltip: {
            text: 'percentage'
        }
    };
    if (lbote_pct == -1) {
        optionsLBOTE["colors"] = ["#444"]
    }

    var optionsICSEA = {
        height: 275,
        backgroundColor: 'transparent',
        legend: {
            position: 'none'
        },
        chartArea: {
            width: '80%',
            height: '80%'
        },
        vAxis: {
            viewWindowMode: 'explicit',
            viewWindow: {
                min: 500,
                max: 1300
            },
            gridlines: {
                count: 8
            }
        }
    }

    function resizeCharts() {
        var chartIndigenous = new google.visualization.PieChart(document.getElementById('indigenous-chart'));
        chartIndigenous.draw(dataIndigenous, optionsIndigenous);
        var chartLBOTE = new google.visualization.PieChart(document.getElementById('lbote-chart'));
        chartLBOTE.draw(dataLBOTE, optionsLBOTE);
        var chartICSEA = new google.visualization.ColumnChart(document.getElementById('icsea-chart'));
        chartICSEA.draw(dataICSEA, optionsICSEA);
    }
    resizeCharts();
    window.onresize = resizeCharts;
}
