var express = require('express'),
    router = express.Router(),
    fetchdata = require('../public/javascript/datafetcher.js'),
    config = require('../configs/projectConfigs.json'),
    cache = require('memory-cache'),
    generateChartsData=require('../public/javascript/generateChartsData'),
    cannedData = require('../public/json/cannedData');

router.get('/json/', function (req, res, next) {
  var dataSource = (req.query.data === 'canned')? cannedData : '',
      jiraData = fetchdata.getDataSourceFromJiraApi(dataSource);

      if (req.query.data === 'canned' && cache.get('canned') == null) {
          cache.put('canned', jiraData, 30000);
      }
      jiraData.then(function (result) {
          var outerArray = fetchdata.getTableData(result);
          res.write(JSON.stringify(outerArray));
          res.end();

      }).catch(function (err) {
          console.error("Error " + err.stack);
      });
});

router.get('/jira/', function (req, res, next) {
    var queryString = (req.query.data === 'canned') ? 'canned' : ''
    res.render('index', {
        title: 'Jira Board',
        // fetchYears: moment,
        params: queryString,
        colHeaders: config.ColHeader,
        banner: config.bannerData
    });
});

router.get('/clearCache/', function(req, res, next){
    if(cache.size() > 0){
        res.send("<h3> Clearing all the cache </h3><br> " +
            "Caches at present : "+cache.keys()+
            "<br> Cache size at present "+ cache.size());
        cache.clear();
    }else{
        res.send("<h3>No Cache is available to clear</h3>");
    }
});

router.get('/charts/', function(req, res, next){
  var jqlUrl = config.JiraHostUrl+config.JQLQuery,
      ticketInfo = "";

  if(req.query.data === 'canned'){
    ticketInfo = 'canned'
    generateChartsData.writeToSourceFile(config.chartType, 'canned');
  }else{
    var cData = cache.get(jqlUrl+"-Formatted");
    Promise.all(cData).then(function(tickets){
      return generateChartsData.writeToSourceFile(config.chartType, tickets);
    }).catch(function(err){console.error(err.stack)});
  }

  res.render('charts', {
      title: 'Charts',
      chartType: config.chartType
  });
})

module.exports = router;
