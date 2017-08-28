var fs = require('fs'),
config = require('../../configs/projectConfigs.json');

function getDemiName(description) {
    var reg = new RegExp(/.*Brand:\s(\w+)(?:\r\n|\r\n\r\n)Model:\s(\w+)/);
    var brand_mode = reg.exec(description);
    return brand_mode != null ? brand_mode[1] + "-" + brand_mode[2] : "NA"
}

function getModelsFromDescription(description) {
    if (description !== null) {
        var models = description.replace(/\r\n/g, "  ").match(/{noformat}(.*){noformat}/);
        return models !== null ? models[1] : "NA";
    } else {
        return "NA";
    }
}

function getSubtasks(tasks) {
    var project_list = config.SubTasks,
        content = [];
    tasks.forEach(function (data) {
        if (data.search(/CLONE - Test/) === 0 || data.search(/Test \w+/) === 0) {
            for (var i = 0; i < project_list.length; i++) {
                if (data.match(project_list[i])) {
                    content[i] = ((data.match(/-(.*)/) != null) ? data.match(/-(.*)/)[1] : evaluateSubtask(data));
                }
            }
        }
    });
    return fill_empty_space(project_list, content);
}

function evaluateSubtask(task) {
    return ((task.match(/Cycle.*/) !== null)) ? task : "NA";
}

function fill_empty_space(project_list, subtask) {
    for (var i = 0; i < project_list.length; i++) {
        if (subtask[i] === undefined) subtask[i] = "NA";
    }
    return subtask;
}

function consolidatedReport(subtasks, consolidateID) {
    for (var i = 0; i < subtasks.length; i++) {
        if (subtasks[i].search(/Consolidated Report/) != 0) {
            var index = subtasks.indexOf("Consolidated Report ");
            return (consolidateID[index] === undefined) ? "NA" : consolidateID[index];
        }
    }
    return "NA";
}

function getRelevantLabel(labels) {
    if (labels.indexOf("certified") != -1) {
        return labels[labels.indexOf("certified")];
    } else if (labels.indexOf("conditional_certified") != -1) {
        return labels[labels.indexOf("conditional_certified")]
    } else {
        return "NA";
    }
}

function liveDeployedDate(subtasks) {
    for (var i = 0; i < subtasks.length; i++) {
        if (subtasks[i].search(/Push device configurations live -/) === 0) {
            var liveDepDate = subtasks[i].match(/(\d+\s\w+\s\d+)/);
            return (liveDepDate != null) ? liveDepDate[1] : "NA";
        }
    }
    return "NA";

}

function userAgent(subtasks, agentTicketId) {

    for (var i = 0; i < subtasks.length; i++) {
        if (subtasks[i].search(/Add user agent.*/i) == 0) {
            var index = i;
            return (agentTicketId[index] === undefined) ? "NA" : agentTicketId[index];
        }
    }
    return "NA";
}

function nthIndex(str, pat, n) {
    var L = str.length, i = -1;
    while (n-- && i++ < L) {
        i = str.indexOf(pat, i);
        if (i < 0) break;
    }
    return i;
}

// function readConfig(){
//     var configuration = fs.readFileSync("configs/projectConfigs.json");
//     return JSON.parse(configuration);
// }

function search_device(brand_model){
    var tb = $('#dataTables-example').DataTable();
    tb.search(brand_model).draw();
}

module.exports = {
  'evaluateSubtask': evaluateSubtask,
  'liveDeployedDate': liveDeployedDate,
  'consolidatedReport': consolidatedReport,
  'userAgent': userAgent,
  'nthIndex': nthIndex,
  // 'readConfig': readConfig,
  'search_device': search_device
};
