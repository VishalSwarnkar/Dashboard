var request = require('request-promise'),
    fs = require('fs'),
    common = require('../lib/common'),
    dummyData = require('../json/cannedData.json'),
    config = require('../../configs/projectConfigs.json'),
    cache = require('memory-cache');

//**************************** jira api request and json in response
function jiradata(req_url) {
    try {
      var cert = fs.readFileSync(config.cert_path);
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }


    return request({
        url: req_url,
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        },
        setTimeout: 600000,
//        resolveWithFullResponse: false,
        cert: cert || "",
        key: cert,
        passphrase: config.cert_pass,
        securityOptions: 'SSL_OP_NO_SSLv3'
//        strictSSL : true
    }).then(function (body) {
            if (body)
                try {
                    return JSON.parse(body);
                } catch (ex) {
                    console.error('error:', ex);
                }
        }).catch(function (reason) {
            console.error("%s; %s", reason.error.message, reason.options.url);
            console.log("%j", reason.response.statusCode);
        });


}

//  ************************** Fetching the relevant data from the source json
function getFormattedData(source_data) {

    var outerarray = source_data.issues.map(function (issue) {

    return jiradata(issue.self).then(function (issue_url) {
        var issue_lists = {},
            issue_details = {};

        issue_details["DeviceTitle"] = issue_url.fields.summary;
        issue_details["Labels"] = issue_url.fields.labels;
        issue_details["Description"] = issue_url.fields.description;
        issue_details["Subtask"] = issue_url.fields.subtasks.map(subtask => subtask.fields.summary);
        issue_details["ConsolidatedURL"] = issue_url.fields.subtasks.map(selfs => selfs.key);
        issue_details["Priority"] = issue_url.fields.priority.name;
        issue_details["Created"] = issue_url.fields.created;
        issue_lists[issue_url.key] = issue_details;

        return issue_lists;
        }).then(function (data) {
            return data;
        }).catch(function (err) {
            console.error("Error " + err.stack);
        });
    });
    return outerarray;
}

// *********************** Setting the fetched data and adding them in an array, which then use to display in the table
function getTableData(results){
    var json_data = eval(results) || dummyData,
        outerArr = [];

    json_data.forEach(function(nodes){

       var subtasks = [],
           ticketDetails = {};

        for (var tickets in nodes) {
            if (nodes.hasOwnProperty(tickets)) {
              console.log(tickets);
                ticketDetails["project_name"] = config.Project;
                ticketDetails["ticket_id"] = tickets;
                ticketDetails["Device_Title"] = nodes[tickets].DeviceTitle;
                ticketDetails["Labels"] = nodes[tickets].Labels;
                ticketDetails["Description"] = nodes[tickets].Description;
                ticketDetails["Priority"] = nodes[tickets].Priority;
                ticketDetails["Created"] = nodes[tickets].Created;
            }
            outerArr.push(ticketDetails);
        }

    });

    return outerArr;
}

function getDataSourceFromJiraApi(canned) {

    if(canned != '') return new Promise((resolve, reject)=>{resolve(canned)}).catch(err=>{console.error(err.stack)});

    var url = config.JiraHostUrl+config.JQLQuery,
    cacheTime = parseInt(config.cacheTime) || 43200000,
    dataSource = jiradata(url);


//    ****************** jira api request to get the ticket json
    if (cache.size() == 0 || cache.get(url) == null) {
        cache.put(url, dataSource, cacheTime);
    }
    var pro = new Promise(function (resolve, reject) {
        resolve(cache.get(url));
    }).catch(function (err) {
            console.error("Error " + err.stack);
    });

    return pro.then(function (tickets) {
          var ticketsPromise = [];
            if (cache.get(url+"-Formatted") == null) {
                getFormattedData(tickets).forEach(function (promise) {
                    ticketsPromise.push(promise);
                });
                cache.put(url+"-Formatted", ticketsPromise, cacheTime);
            }
          return cache.get(url +"-Formatted");
          }).then(function (promises) {
                return Promise.all(promises).then(function (ticket) {
                    return JSON.stringify(ticket, null, '  ');
                });
           }).catch(function (err) {
               console.error("Error " + err.stack);
           });
}

module.exports = {'jira': jiradata,
    'getFormattedData': getFormattedData,
    'getTableData': getTableData,
    'getDataSourceFromJiraApi': getDataSourceFromJiraApi
  };
