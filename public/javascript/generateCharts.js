function drawChart(cData, elementID, titleName) {
  var data = new google.visualization.DataTable(cData);

  var options = {
    width: 800,
    height: 500,
    bar: {groupWidth: "80%"},
    title:titleName,
    subtitle: '',
    bars: 'horizontal', // Required for Material Bar Charts.
    legend: { position: "bottom" },
    titleTextStyle: {fontSize: 18, titlePosition: "top"},
  };

var chart = new google.visualization.BarChart(document.getElementById(`${elementID}`));
chart.draw(data, options);
}

function getChartData(callback, type) {

    httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = function () {
        if (httpRequest.readyState === 4) { // request is done
            if (httpRequest.status === 200) { // successfully
                callback(httpRequest.responseText); // we're calling our method
            }
        }
    };
    httpRequest.open('GET', "/"+`${type}`+"-chartData.json", false);
    httpRequest.send();
}

google.charts.load('current', {'packages':['corechart']});
