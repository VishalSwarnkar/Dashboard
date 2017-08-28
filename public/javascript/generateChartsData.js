var fs = require('fs'),
  config = require('../../configs/projectConfigs'),
  cannedData = require('../../public/json/cannedData');

  var chartsData = {};
  var ticketDescrip = {};

  function getPriorities() {
    var jiraProd = {};
    config.Project.forEach(product=>{
      var priorityCount = {};

      ticketDescrip.forEach(tickets=>{
        Object.keys(tickets).forEach(ticket=>{
          if(ticket.indexOf(product)!=-1){
            priorityCount[tickets[ticket].Priority] = priorityCount[tickets[ticket].Priority] + 1 || 1
          }
        })
      })// all tickets
      jiraProd[product] = priorityCount;
    }) // two products
    // console.log(jiraProd);
    return jiraProd;

  }

  function mergePriorities() {
    var priorties={};
    var prodMappedPriorties=getPriorities();
    Object.keys(prodMappedPriorties).forEach(product=>{
      Object.keys(prodMappedPriorties[product]).forEach(prio=>{
        priorties[prio]='';
      });
    })
    // console.log(priorties);
    return priorties;
  }


  function getChartColumns(chartType) {
    var chartCols = [{"label":`${chartType}`,"type":"string"}];
    var allTicketPriorties=mergePriorities();

    var chartProduct={};

    Object.keys(allTicketPriorties).forEach(priority=>{
      var colTemp={};
      colTemp["label"]=priority
      colTemp['type']='number'
      chartCols.push(colTemp);
      chartCols.push({ "role": "annotation", "type": "string"});
    })
    chartsData["cols"] = chartCols;
    // console.log(chartsData);
    return chartsData;
  }

  function getAllDatesFromTickets() {
    var ticketDates = {};
    ticketDescrip.forEach(tickets=>{
      Object.keys(tickets).forEach(tick=>{
        ticketDates[tickets[tick].Created]='';
      })
    })
    return ticketDates;
  }

  function getPrioritiesByDate() {
    var jiraCreateDate = {};
    var priorArr = [];
    Object.keys(getAllDatesFromTickets()).forEach(date=>{
      var priorityCount = {};
      ticketDescrip.forEach(tickets=>{
        Object.keys(tickets).forEach(ticket=>{
          if(date == tickets[ticket].Created)
            priorityCount[tickets[ticket].Priority] = priorityCount[tickets[ticket].Priority] + 1 || 1
        })
      })
      jiraCreateDate[date] = priorityCount;
    })
    // console.log(jiraCreateDate);
    return jiraCreateDate;
  }

  function priorityProduct() {
    var another = [],
    chartCols = getChartColumns('Product').cols,
    jiraProd = getPriorities(),
    anotationValue = '';
    config.Project.forEach(proj=>{
      var chartRows = {};
      var rowArr = [];
      chartCols.forEach(col=>{
        var rowData={};
        if(col.label == 'Product'){
          rowData['v'] = proj
        }else if(col.role == 'annotation'){
          rowData['v'] = anotationValue
        }else{
          anotationValue=jiraProd[proj][col.label] || 0
          rowData['v']=anotationValue;
        }
        rowArr.push(rowData);
      })
      chartRows['c']= rowArr;
      another.push(chartRows);
    })
    chartsData["rows"] = another;
    // console.log(chartsData);
    return chartsData;
  }

  function priorityDate() {
    var another = [];

    var chartCols = getChartColumns('Date').cols;
    var dates = getPrioritiesByDate();
    Object.keys(dates).forEach(date=>{
      var chartRows = {};
      var rowArr = [];

      chartCols.forEach(col=>{
        var sityData ='';
        var rowData={};
        if(col.label == 'Date'){
          rowData['v'] = date
        }else if(col.role == 'annotation'){
          rowData['v'] = silyData
        }else{
          silyData =dates[date][col.label] || 0
          rowData['v'] = silyData;
        }
        rowArr.push(rowData);
      })
      chartRows['c']= rowArr;
      another.push(chartRows);
    })
    chartsData["rows"] = another;
    // console.log(JSON.stringify(chartsData.rows));
    return chartsData;
  }

  function chooseCharts(type) {
      if(type == 'Product') return priorityProduct();
      if(type == 'Date') return priorityDate();
  }


  function writeToSourceFile(chartType, jira_response) {
    ticketDescrip = (jira_response === 'canned') ? cannedData : jira_response;

    chartType.forEach(type=>{
    var chartsData = chooseCharts(type);
    fs.writeFileSync(__dirname+"/../json/"+`${type}`+"-chartData.json", JSON.stringify(chartsData, null, 2), 'utf8', function (err) {
            if (err) return console.log(err);
            console.log("Unable to write");
      });
    chartData = '';
    });
  }

module.exports = {
  writeToSourceFile: writeToSourceFile,
  getChartColumns: getChartColumns,
  getPriorities: getPriorities
}
