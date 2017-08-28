var addDataToTable = (function() {


    function uploadData(params){
      var srcUrl = (params.selector === "canned") ? "?data=canned" : "";
        $.ajax({
            url: "/json/"+srcUrl,
            success: function(data){
                loadData = (typeof(data)!='object')?JSON.parse(data):data;
                return loadData;
            },
            cache: false,
            beforeSend: function () { $("#imgSpinner1").show(); },
            complete: function () { $("#imgSpinner1").hide(); }
        }).then(function() {
            appendTableTags();
            modalDialogsTags();
        }).fail(function(jqXHR, textStatus, error) {
           console.log(jqXHR.responseText);
        }).done(function() {
           console.log("Ajax request is completed");
        });
    }

    function appendTableTags(){

     var table = $dTable.DataTable({order: [[ 0, "desc" ]],responsive: true,dom: 'Blfrtip',buttons: ['excelHtml5','csvHtml5',
         {
             extend: 'pdfHtml5',
             text: 'PDF',
             orientation: 'landscape',
             customize: function(doc) {
                 doc.defaultStyle.fontSize = 6; //<-- set fontsize to 16 instead of 10
             }
         }
     ]});

        loadData.forEach(function(tickets){
            var html = "";
            html += "<tr class='odd gradeX' role='row'>";
            html += "<td>"+tickets.Created+"</td>";
            html += "<td data-toggle='modal' data-target='#"+tickets.ticket_id+"' class='btn btn-info'>"+tickets.ticket_id+"</td>";
            html += "<td>"+tickets.Device_Title+"</td>";
            html += "<td>"+tickets.Priority+"</td>";
            html += "<td>"+tickets.Labels+"</td>";
            html += "</tr>";
            table.row.add($(html)).draw(false);
        });

    }

    function modalDialogsTags(){
        var modalDialog="";
        loadData.forEach(function(tickets){
            modalDialog += "<div class='modal fade' id='"+tickets.ticket_id+"' tabindex='-1' role='dialog' " +
                "aria-labelledby='Label"+tickets.ticket_id+"'>";
            modalDialog += "<div class='modal-dialog' role='document'> <div class='modal-content'> <div class='modal-header'>";
            modalDialog += "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>" +
                "<span aria-hidden='true'>&times;</span></button>";
            modalDialog += "<h4 class='modal-title' id='Label"+tickets.ticket_id+"'>"+tickets.ticket_id+"</h4></div>";
            modalDialog += "<div class='modal-body'>";

            if(tickets.Description != null && tickets.Description.indexOf("\r\n")!=-1){
                tickets.Description.split("\r\n").forEach(function(data){
                    modalDialog += "<p>"+data+"</p>";
                });
            }else{
                modalDialog += "<p>"+tickets.Description+"</p>";
            }

            modalDialog += "</div></div></div></div>";

        });
        $modal.html(modalDialog);
    }

    function init(opts){
       $dTable = $(opts.dataTables);
       $modal = $(opts.modal_dialog);
       $params = $(opts.params);

        uploadData($params);
    }

    var loadData = [],
        $modal,
        $dTable,

         addingData = {
        uploadData: uploadData,
        init: init
    };

    return addingData;

})();
