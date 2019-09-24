let map;
let name;
let indigenous_pct;
let lbote_pct;
let icsea;
let lat;
let lng;

function initMap() {
    const location = {lat: lat, lng: lng}
    map = new google.maps.Map(document.getElementById('snm-school-map'), {
        center: location,
        zoom: 16
    });
    const marker = new google.maps.Marker({position: location, map: map});
}

const initChartData = (_lat, _lng, _name, _indigenous_pct, _lbote_pct, _icsea) => {
    lat = _lat;
    lng = _lng;
    name = _name;
    indigenous_pct = _indigenous_pct;
    lbote_pct = _lbote_pct;
    icsea = _icsea;
}


const drawCharts = () => {
    let dataIndigenous;
    let dataLBOTE;
    let dataICSEA;
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
    const optionsIndigenous = {
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

    const optionsLBOTE = {
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

    const optionsICSEA = {
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

    const resizeCharts = () => {
        const chartIndigenous = new google.visualization.PieChart(document.getElementById('indigenous-chart'));
        chartIndigenous.draw(dataIndigenous, optionsIndigenous);
        const chartLBOTE = new google.visualization.PieChart(document.getElementById('lbote-chart'));
        chartLBOTE.draw(dataLBOTE, optionsLBOTE);
        const chartICSEA = new google.visualization.ColumnChart(document.getElementById('icsea-chart'));
        chartICSEA.draw(dataICSEA, optionsICSEA);
    }
    resizeCharts();
    window.onresize = resizeCharts;
}

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawCharts);
