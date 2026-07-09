/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 97.82282282282283, "KoPercent": 2.1771771771771773};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8042498390212492, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.38181818181818183, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38b3495c-4a8a-43fe-bd2b-69e31c9dde5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8827a291-0b7e-4970-90e6-c89e22e2a2fc"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d73c83ce-7f70-4c0a-ae97-d15309f300af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1a4874cc-fa37-4fe8-93fe-7f6fbd2f31b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9f045074-ddbf-4aae-a488-ae565cf26fff"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bc2f4fb4-335f-4c30-b529-93883f28286e"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2a22e97f-1e95-4b2a-89e5-f75782b5f4a1"], "isController": false}, {"data": [0.7666666666666667, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7941176470588235, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9473684210526315, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88c01f4e-0d7b-4312-8cb6-c86c41e40ff4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1609c64c-b3c4-4bc4-8d81-0e2c2bc151fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d73c83ce-7f70-4c0a-ae97-d15309f300af"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e4fb9cba-b5cd-4445-a915-5c220aae1bf9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8827a291-0b7e-4970-90e6-c89e22e2a2fc"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2f61dfe-478d-480b-a3bb-bba87da314c6"], "isController": false}, {"data": [0.7352941176470589, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44307ddc-96fe-457d-ad9f-7984dcdb546c"], "isController": false}, {"data": [0.2692307692307692, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dbb11586-0e4c-432b-acc3-2c04a3c1bfd7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16863e9b-48f1-42cd-8c9e-95fb14d1abd2"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/bd936dbe-c3e0-47f6-acc7-1f1e573e68d4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2a22e97f-1e95-4b2a-89e5-f75782b5f4a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.30434782608695654, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.20454545454545456, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bc2f4fb4-335f-4c30-b529-93883f28286e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3467741935483871, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1a4874cc-fa37-4fe8-93fe-7f6fbd2f31b0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9134078212290503, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/38b3495c-4a8a-43fe-bd2b-69e31c9dde5c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/1609c64c-b3c4-4bc4-8d81-0e2c2bc151fd"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44307ddc-96fe-457d-ad9f-7984dcdb546c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9f045074-ddbf-4aae-a488-ae565cf26fff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2f61dfe-478d-480b-a3bb-bba87da314c6"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dbb11586-0e4c-432b-acc3-2c04a3c1bfd7"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e4fb9cba-b5cd-4445-a915-5c220aae1bf9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1332, 29, 2.1771771771771773, 313.8888888888886, 79, 3381, 95.0, 871.4000000000001, 1036.35, 1845.850000000004, 5.149995553682517, 706.4047670383369, 3.769126263575767], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1333.690909090909, 989, 1877, 1308.0, 1605.8, 1653.8, 1877.0, 0.24130109550697362, 290.36706832330833, 1.1864756014429805], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38b3495c-4a8a-43fe-bd2b-69e31c9dde5c", 1, 0, 0.0, 624.0, 624, 624, 624.0, 624.0, 624.0, 624.0, 1.6025641025641024, 0.2895257411858974, 1.104892828525641], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8827a291-0b7e-4970-90e6-c89e22e2a2fc", 1, 0, 0.0, 405.0, 405, 405, 405.0, 405.0, 405.0, 405.0, 2.4691358024691357, 0.44608410493827155, 1.7023533950617282], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 513.8000000000002, 85, 2221, 459.0, 1249.0000000000005, 2221.0, 2221.0, 0.09301921777039136, 0.018930864241552305, 0.062333776595744676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 513.8000000000002, 85, 2221, 459.0, 1249.0000000000005, 2221.0, 2221.0, 0.09261546060755742, 0.018848693350209927, 0.062063211981353415], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d73c83ce-7f70-4c0a-ae97-d15309f300af", 3, 0, 0.0, 617.0, 181, 1457, 213.0, 1457.0, 1457.0, 1457.0, 0.025160819571762853, 0.025234532910352, 0.016135030780069275], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1a4874cc-fa37-4fe8-93fe-7f6fbd2f31b0", 1, 0, 0.0, 282.0, 282, 282, 282.0, 282.0, 282.0, 282.0, 3.5460992907801416, 0.6406527039007093, 2.444869237588653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 93.0, 81, 244, 81.0, 150.40000000000006, 244.0, 244.0, 0.10385510136257893, 0.038188386230198296, 0.05864838211061261], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 95.06666666666668, 82, 245, 84.0, 152.60000000000005, 245.0, 245.0, 0.10385294423096894, 0.07717977593727282, 0.05212930989718558], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9f045074-ddbf-4aae-a488-ae565cf26fff", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 185.99999999999997, 79, 658, 84.0, 464.2000000000001, 658.0, 658.0, 0.10385438230875216, 2.061901647303594, 0.06056143895439408], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bc2f4fb4-335f-4c30-b529-93883f28286e", 1, 0, 0.0, 3061.0, 3061, 3061, 3061.0, 3061.0, 3061.0, 3061.0, 0.32669062397909177, 0.05902125530872264, 0.22523787161058478], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 148.99999999999997, 80, 919, 83.0, 513.4000000000003, 919.0, 919.0, 0.10385438230875216, 6.256016251912651, 0.060460018659170695], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2a22e97f-1e95-4b2a-89e5-f75782b5f4a1", 1, 0, 0.0, 412.0, 412, 412, 412.0, 412.0, 412.0, 412.0, 2.4271844660194173, 0.43850500606796117, 1.6734299150485439], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 254.99999999999994, 81, 934, 218.0, 571.6000000000003, 934.0, 934.0, 0.09332246645057332, 0.1795728397404391, 0.06031328935252873], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 20, 0, 0.0, 92.39999999999999, 81, 252, 83.0, 99.60000000000002, 244.4499999999999, 252.0, 0.11471244457955021, 0.08525016633304465, 0.057580270033094544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 540.2857142857143, 478, 734, 485.0, 734.0, 734.0, 734.0, 0.03187396125036996, 9.372002922728411, 0.01817811852560162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 20, 0, 0.0, 81.95000000000002, 80, 86, 82.0, 83.0, 85.85, 86.0, 0.11471705039520023, 0.03931075486687086, 0.06494284581454841], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 865.0, 789, 968, 870.0, 968.0, 968.0, 968.0, 0.031817169453699196, 28.62914500305672, 0.018114657999518197], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 223.14285714285717, 87, 251, 244.0, 251.0, 251.0, 251.0, 0.03190737744148415, 0.05646110148825125, 0.01766746387629054], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 19, 0, 0.0, 100.05263157894736, 81, 246, 83.0, 243.0, 246.0, 246.0, 0.09395289498538785, 0.06982241512097671, 0.047159949240712255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 19, 0, 0.0, 133.1052631578947, 81, 245, 82.0, 245.0, 245.0, 245.0, 0.09387861988546808, 0.03996210577155873, 0.05271022017006853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 19, 0, 0.0, 195.1578947368421, 80, 952, 82.0, 883.0, 952.0, 952.0, 0.09387815603537725, 8.914400646647563, 0.05434086108503385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 19, 0, 0.0, 140.94736842105263, 81, 481, 83.0, 477.0, 481.0, 481.0, 0.09395475336877242, 2.93063883051057, 0.054476951724564224], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 83.42857142857143, 81, 85, 83.0, 85.0, 85.0, 85.0, 0.03193022789059791, 0.023729397875727552, 0.017929571325286914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 528.2352941176471, 81, 963, 802.0, 962.2, 963.0, 963.0, 0.08800811745459816, 41.93520568176524, 0.04773510139052826], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 20, 0, 0.0, 157.39999999999998, 81, 943, 83.0, 245.5, 908.1499999999995, 943.0, 0.11471507642891968, 5.190414703963406, 0.06694700163468983], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 383.47058823529414, 81, 728, 475.0, 667.1999999999999, 728.0, 728.0, 0.08800902869094336, 13.711056409257514, 0.047821541957010175], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 20, 0, 0.0, 133.5, 79, 640, 82.0, 241.8, 620.0999999999997, 640.0, 0.11471507642891968, 1.7158754015027675, 0.06705902807651495], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 629.8666666666666, 85, 3061, 412.0, 1888.6000000000008, 3061.0, 3061.0, 0.0926526452330214, 0.01885626100250162, 0.06255863175206151], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 19, 0, 0.0, 313.63157894736844, 164, 1034, 167.0, 967.0, 1034.0, 1034.0, 0.09383828206799819, 11.947302357748573, 0.20851719000029634], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 657.0909090909091, 124, 2011, 607.5, 1504.3999999999996, 1953.0999999999992, 2011.0, 0.09192520630941188, 0.05646577614123055, 0.04156383839966573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 93.76470588235296, 82, 244, 84.0, 120.7999999999999, 244.0, 244.0, 0.08800447269790652, 0.06540176144834656, 0.04417412008469136], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 139.88235294117646, 80, 251, 83.0, 247.8, 251.0, 251.0, 0.08800857307041203, 0.09352933144546316, 0.04627932432712269], "isController": false}, {"data": ["login", 22, 0, 0.0, 2800.727272727273, 1629, 4107, 2753.5, 3921.5, 4084.3499999999995, 4107.0, 0.09556035287832126, 36.50459351422112, 0.19459902115793085], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 20, 0, 0.0, 87.90000000000002, 81, 101, 86.0, 99.4, 100.95, 101.0, 0.11155547374820814, 0.09031199974342241, 0.03965448480893337], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/88c01f4e-0d7b-4312-8cb6-c86c41e40ff4", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.7496148767605634, 1.40065654342723], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1609c64c-b3c4-4bc4-8d81-0e2c2bc151fd", 1, 0, 0.0, 588.0, 588, 588, 588.0, 588.0, 588.0, 588.0, 1.7006802721088434, 0.30725180697278914, 1.1725393282312926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d73c83ce-7f70-4c0a-ae97-d15309f300af", 1, 0, 0.0, 667.0, 667, 667, 667.0, 667.0, 667.0, 667.0, 1.4992503748125936, 0.27086066341829085, 1.033662856071964], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e4fb9cba-b5cd-4445-a915-5c220aae1bf9", 3, 0, 0.0, 559.6666666666666, 320, 955, 404.0, 955.0, 955.0, 955.0, 0.02419042704167204, 0.028592265816507548, 0.01551274129950974], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8827a291-0b7e-4970-90e6-c89e22e2a2fc", 3, 0, 0.0, 490.0, 330, 589, 551.0, 589.0, 589.0, 589.0, 0.025107754111394737, 0.025344773925597357, 0.016101001171695193], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2f61dfe-478d-480b-a3bb-bba87da314c6", 3, 0, 0.0, 340.66666666666663, 182, 657, 183.0, 657.0, 657.0, 657.0, 0.04637358560563903, 0.029813747256229522, 0.02973826941507451], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 632.7647058823528, 164, 1054, 888.0, 1046.8, 1054.0, 1054.0, 0.087966676153269, 55.77877593723319, 0.18592359350340223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44307ddc-96fe-457d-ad9f-7984dcdb546c", 3, 0, 0.0, 318.6666666666667, 215, 453, 288.0, 453.0, 453.0, 453.0, 0.02245861999266352, 0.02654532851346394, 0.014402174930191122], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 549.6923076923077, 81, 1059, 872.0, 1055.0, 1059.0, 1059.0, 0.05623299492605361, 36.231520161691485, 0.08547313847158719], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 310.8666666666666, 166, 1002, 173.0, 694.8000000000002, 1002.0, 1002.0, 0.1037932991046098, 8.428326726601531, 0.23166312976584233], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dbb11586-0e4c-432b-acc3-2c04a3c1bfd7", 3, 0, 0.0, 320.6666666666667, 170, 431, 361.0, 431.0, 431.0, 431.0, 0.07574036203893054, 0.03427054141735464, 0.048570479562725644], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/16863e9b-48f1-42cd-8c9e-95fb14d1abd2", 1, 0, 0.0, 335.0, 335, 335, 335.0, 335.0, 335.0, 335.0, 2.985074626865672, 0.9532416044776119, 1.781133395522388], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1084.6521739130433, 253, 2156, 1099.0, 1667.4, 2069.799999999999, 2156.0, 0.0937363725654015, 0.02938813582807934, 0.042291214966030756], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 12, 0, 0.0, 88.33333333333333, 83, 104, 87.5, 100.10000000000001, 104.0, 104.0, 0.054487499659453126, 0.04230230686451683, 0.019368603394571228], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 20, 0, 0.0, 259.4, 165, 1026, 168.0, 483.50000000000034, 999.6499999999996, 1026.0, 0.11465786094294625, 7.027345586317304, 0.25640140212231705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bd936dbe-c3e0-47f6-acc7-1f1e573e68d4", 1, 0, 0.0, 352.0, 352, 352, 352.0, 352.0, 352.0, 352.0, 2.840909090909091, 0.9072043678977273, 1.6951127485795456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2a22e97f-1e95-4b2a-89e5-f75782b5f4a1", 3, 0, 0.0, 313.0, 241, 410, 288.0, 410.0, 410.0, 410.0, 0.0289779477817381, 0.02906284411312991, 0.018582863649096372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 19, 0, 0.0, 289.5789473684211, 164, 487, 326.0, 486.0, 487.0, 487.0, 0.10373443983402489, 0.1607681211099585, 0.2333011864626556], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 84.77777777777779, 81, 97, 84.0, 97.0, 97.0, 97.0, 0.051226009152380306, 0.03806932906734513, 0.02571305537531589], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 81.88888888888889, 81, 83, 82.0, 83.0, 83.0, 83.0, 0.051226592293243785, 0.013707115515965622, 0.029215165917240594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 82.22222222222223, 79, 85, 82.0, 85.0, 85.0, 85.0, 0.051226009152380306, 0.013807010279352503, 0.030115290536848575], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 100.22222222222221, 81, 242, 82.0, 242.0, 242.0, 242.0, 0.051226883868654274, 0.013807246042723221, 0.03016583102812356], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 85.66666666666667, 85, 87, 85.0, 87.0, 87.0, 87.0, 0.02061430632859204, 0.0060796098742527315, 0.012743023345701918], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 915.4545454545456, 643, 1520, 821.0, 1249.8, 1296.2, 1520.0, 0.2408372378158252, 288.12506499868636, 0.47555946764023294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1084.6521739130433, 253, 2156, 1099.0, 1667.4, 2069.799999999999, 2156.0, 0.09288650884037251, 0.02912168738439668, 0.04190778035571494], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 6, 0, 0.0, 110.5, 81, 245, 83.5, 245.0, 245.0, 245.0, 0.03462304163420757, 0.009331991690470009, 0.020388373149831215], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 6, 0, 0.0, 83.5, 82, 86, 83.0, 86.0, 86.0, 86.0, 0.034623241427862474, 0.009332045541103557, 0.020354679042551962], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 12, 0, 0.0, 195.66666666666666, 81, 965, 82.5, 749.0000000000008, 965.0, 965.0, 0.05318229561379017, 4.0009333562127996, 0.030884510213216684], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 12, 0, 0.0, 155.16666666666666, 81, 478, 82.0, 408.40000000000026, 478.0, 478.0, 0.053182767010729624, 1.31626482746624, 0.030936720263077422], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 12, 0, 0.0, 96.91666666666667, 81, 244, 84.0, 196.30000000000018, 244.0, 244.0, 0.05318135284498079, 0.03952247022952186, 0.026694546252265746], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 6, 0, 0.0, 82.16666666666666, 80, 84, 82.5, 84.0, 84.0, 84.0, 0.03462444023821615, 0.00926474279811643, 0.019746751073357646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 12, 0, 0.0, 122.16666666666667, 80, 247, 82.0, 245.8, 247.0, 247.0, 0.053182767010729624, 0.020887047004702244, 0.029958586690126177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 6, 0, 0.0, 87.66666666666667, 81, 97, 85.5, 97.0, 97.0, 97.0, 0.03462104382447131, 0.025729115576584635, 0.017378141138455323], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 6, 0, 0.0, 87.33333333333334, 84, 95, 84.5, 95.0, 95.0, 95.0, 0.03487682667379704, 0.027451877245195717, 0.012397621981701292], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 470.6428571428571, 82, 1457, 439.5, 1057.0, 1457.0, 1457.0, 0.08795572057724083, 0.017528564012916928, 0.0598498921757104], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1577.5454545454545, 925, 2523, 1524.0, 2356.1, 2513.85, 2523.0, 0.09274638921443809, 0.048003502230129086, 0.04265971613281283], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bc2f4fb4-335f-4c30-b529-93883f28286e", 3, 0, 0.0, 372.0, 260, 591, 265.0, 591.0, 591.0, 591.0, 0.017016159679642436, 0.0234581498187779, 0.010912055523729034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 6, 0, 0.0, 199.33333333333334, 165, 330, 175.0, 330.0, 330.0, 330.0, 0.03460347303524364, 0.05362862471380044, 0.0778240218751622], "isController": false}, {"data": ["addBook", 62, 10, 16.129032258064516, 1006.0161290322579, 422, 3972, 723.0, 1701.5000000000005, 2462.499999999997, 3972.0, 0.2774272648356467, 76.02596000460888, 1.0108039321958815], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1a4874cc-fa37-4fe8-93fe-7f6fbd2f31b0", 3, 0, 0.0, 282.0, 180, 448, 218.0, 448.0, 448.0, 448.0, 0.08007687379884688, 0.037640301355968395, 0.05135138065876575], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 149.25454545454554, 81, 365, 84.0, 333.4, 335.2, 365.0, 0.24167644357733864, 0.17960524761948704, 0.11682601520584242], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 526.6545454545454, 395, 799, 483.0, 685.0, 724.2, 799.0, 0.24155119787434945, 71.02407242967567, 0.12148326846219724], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 134.5272727272727, 80, 351, 86.0, 245.0, 257.3999999999998, 351.0, 0.24196883441412745, 0.428171414021874, 0.11767624954905809], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 764.5636363636362, 560, 1153, 733.0, 959.0, 968.2, 1153.0, 0.24122489616364695, 217.05458559618734, 0.12108359045714312], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 19, 0, 0.0, 97.42105263157895, 83, 261, 86.0, 121.0, 261.0, 261.0, 0.10547117861266542, 0.07879438636590727, 0.03749170802247091], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 10, 5.58659217877095, 199.25698324022358, 81, 3381, 89.0, 311.0, 497.0, 3148.999999999997, 0.7500743788839396, 1.5669980891959956, 0.3628180352032115], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38b3495c-4a8a-43fe-bd2b-69e31c9dde5c", 3, 0, 0.0, 266.6666666666667, 178, 400, 222.0, 400.0, 400.0, 400.0, 0.022690315017206822, 0.022756790549483794, 0.014550755398404114], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 87.33333333333333, 83, 103, 85.0, 103.0, 103.0, 103.0, 0.05330458834050971, 0.04127982280666426, 0.01894811538666556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 87.00000000000001, 82, 99, 85.0, 96.6, 99.0, 99.0, 0.10406476991279373, 0.08445099980227694, 0.036991773679938396], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 186.55555555555554, 166, 324, 167.0, 324.0, 324.0, 324.0, 0.05120123793215267, 0.07935191855305303, 0.1151527841384254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 12, 0, 0.0, 320.91666666666674, 164, 1209, 248.0, 945.6000000000009, 1209.0, 1209.0, 0.05316179793200606, 5.375523899827667, 0.11842863416265738], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1609c64c-b3c4-4bc4-8d81-0e2c2bc151fd", 3, 0, 0.0, 814.3333333333334, 499, 1010, 934.0, 1010.0, 1010.0, 1010.0, 0.016807005159750584, 0.023169813428236888, 0.010777929741116096], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44307ddc-96fe-457d-ad9f-7984dcdb546c", 1, 0, 0.0, 1037.0, 1037, 1037, 1037.0, 1037.0, 1037.0, 1037.0, 0.9643201542912248, 0.17421799662487947, 0.664853543876567], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9f045074-ddbf-4aae-a488-ae565cf26fff", 2, 0, 0.0, 262.5, 225, 300, 262.5, 300.0, 300.0, 300.0, 0.0413317076195003, 0.036488148132840105, 0.025691046777160095], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 19, 0, 0.0, 105.05263157894737, 82, 245, 86.0, 245.0, 245.0, 245.0, 0.0960075997594757, 0.07960005097245593, 0.03412770147700112], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 96.11764705882354, 83, 244, 85.0, 131.9999999999999, 244.0, 244.0, 0.08637991920936967, 0.06706253493305556, 0.030705361906455626], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2f61dfe-478d-480b-a3bb-bba87da314c6", 1, 0, 0.0, 393.0, 393, 393, 393.0, 393.0, 393.0, 393.0, 2.544529262086514, 0.45970499363867684, 1.754333651399491], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dbb11586-0e4c-432b-acc3-2c04a3c1bfd7", 1, 0, 0.0, 185.0, 185, 185, 185.0, 185.0, 185.0, 185.0, 5.405405405405405, 0.9765625, 3.7267736486486487], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e4fb9cba-b5cd-4445-a915-5c220aae1bf9", 1, 0, 0.0, 1107.0, 1107, 1107, 1107.0, 1107.0, 1107.0, 1107.0, 0.9033423667570009, 0.16320150180668475, 0.6228122177055104], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 19, 0, 0.0, 99.42105263157893, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.10378146899938277, 0.07712665811379911, 0.052093432681330806], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 19, 0, 0.0, 123.78947368421052, 79, 245, 82.0, 244.0, 245.0, 245.0, 0.10378373654225363, 0.02777025762947021, 0.059189162246754023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 19, 0, 0.0, 154.73684210526315, 80, 330, 84.0, 249.0, 330.0, 330.0, 0.10378316964724646, 0.027972807443984397, 0.06101315246840075], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 19, 0, 0.0, 150.05263157894737, 79, 247, 83.0, 245.0, 247.0, 247.0, 0.10378316964724646, 0.027972807443984397, 0.06111450322000939], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 24.137931034482758, 0.5255255255255256], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 10.344827586206897, 0.22522522522522523], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 10.344827586206897, 0.22522522522522523], "isController": false}, {"data": ["401/Unauthorized", 16, 55.172413793103445, 1.2012012012012012], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1332, 29, "401/Unauthorized", 16, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 10, "401/Unauthorized", 10, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
