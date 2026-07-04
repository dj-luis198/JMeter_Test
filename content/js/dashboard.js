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

    var data = {"OkPercent": 97.16475095785441, "KoPercent": 2.835249042145594};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7372549019607844, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/88985d2e-a793-43e7-8b5d-6379d77e99a3"], "isController": false}, {"data": [0.018518518518518517, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0446fb08-fa8c-49d1-9746-63cd58bacffe"], "isController": false}, {"data": [0.59375, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.59375, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/bbbac544-8d5f-4bf1-bcc6-e4d4a91f1d60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=70a9090f-0214-417d-9fb9-e51a1fd45da4"], "isController": false}, {"data": [0.78125, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/292c22f5-4151-439f-b6d8-d46b4e49735d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee3dc3c6-e7ff-4476-97db-8b487f171c12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6e1b4110-3671-4499-9744-4e2cc1c57a7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.4375, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9117647058823529, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5882352941176471, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6764705882352942, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.625, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d9f39a57-d451-4abf-97f4-f7780a8b294f"], "isController": false}, {"data": [0.8529411764705882, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.7083333333333334, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.020833333333333332, 500, 1500, "login"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fa610484-8d02-42a5-bb53-7e021bd925a0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/8116558f-dd5d-4104-8b7e-6e8da1e52a3e"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/29eb84c5-e58e-42ef-a9e1-fe3e38ebf016"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.14285714285714285, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.24, 500, 1500, "register"], "isController": true}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/780f3bd8-4fca-4790-93ae-5936d827a676"], "isController": false}, {"data": [0.7333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.28703703703703703, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2b1c37a6-43d4-480c-9e94-e69a1a85fd77"], "isController": false}, {"data": [0.24, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=bbbac544-8d5f-4bf1-bcc6-e4d4a91f1d60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6e1b4110-3671-4499-9744-4e2cc1c57a7b"], "isController": false}, {"data": [0.2708333333333333, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/70a9090f-0214-417d-9fb9-e51a1fd45da4"], "isController": false}, {"data": [0.22413793103448276, 500, 1500, "addBook"], "isController": true}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=292c22f5-4151-439f-b6d8-d46b4e49735d"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e3a6b52f-64db-48b3-b73e-0591f3d832ab"], "isController": false}, {"data": [0.9907407407407407, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.42592592592592593, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d9f39a57-d451-4abf-97f4-f7780a8b294f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e3a6b52f-64db-48b3-b73e-0591f3d832ab"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02eb5722-a93e-4d05-9eca-c074102cfcdd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ee3dc3c6-e7ff-4476-97db-8b487f171c12"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b9c86d6d-a2f0-44d5-9c54-624fce5d8caa"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fa610484-8d02-42a5-bb53-7e021bd925a0"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/2b1c37a6-43d4-480c-9e94-e69a1a85fd77"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8116558f-dd5d-4104-8b7e-6e8da1e52a3e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=29eb84c5-e58e-42ef-a9e1-fe3e38ebf016"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=780f3bd8-4fca-4790-93ae-5936d827a676"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=88985d2e-a793-43e7-8b5d-6379d77e99a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1305, 37, 2.835249042145594, 440.01839080459763, 117, 3235, 141.0, 1213.8000000000006, 1506.4, 2120.6200000000013, 5.287339556592765, 749.866859003772, 3.8579473170296903], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/88985d2e-a793-43e7-8b5d-6379d77e99a3", 3, 0, 0.0, 323.3333333333333, 232, 442, 296.0, 442.0, 442.0, 442.0, 0.05313684508838429, 0.034784568838782816, 0.034075385684933936], "isController": false}, {"data": ["see books", 54, 0, 0.0, 2053.6111111111104, 1460, 2660, 2030.0, 2523.0, 2591.0, 2660.0, 0.23759762402375975, 285.9105889409856, 1.168265661093389], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0446fb08-fa8c-49d1-9746-63cd58bacffe", 1, 0, 0.0, 239.0, 239, 239, 239.0, 239.0, 239.0, 239.0, 4.184100418410042, 1.3361336297071131, 2.496567730125523], "isController": false}, {"data": ["deleteBook", 16, 3, 18.75, 554.5, 123, 1061, 496.0, 1057.5, 1061.0, 1061.0, 0.08299056501014042, 0.016771347701939384, 0.05566304436623736], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, 18.75, 554.5, 123, 1061, 496.0, 1057.5, 1061.0, 1061.0, 0.08109477952356817, 0.01638823333755702, 0.054391511974151034], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 122.84615384615384, 119, 129, 122.0, 128.2, 129.0, 129.0, 0.14529685264663805, 0.05566511031384121, 0.08192594470895924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 127.15384615384613, 121, 149, 126.0, 141.0, 149.0, 149.0, 0.1452513966480447, 0.10794561801675978, 0.07290939245810056], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 215.76923076923077, 121, 590, 127.0, 505.5999999999999, 590.0, 590.0, 0.1452952287282197, 3.3224277505504456, 0.08459910741229197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 206.0, 120, 954, 126.0, 715.5999999999998, 954.0, 954.0, 0.14529685264663805, 10.092946763372899, 0.08445816149186339], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/bbbac544-8d5f-4bf1-bcc6-e4d4a91f1d60", 3, 0, 0.0, 342.0, 231, 537, 258.0, 537.0, 537.0, 537.0, 0.04414621225498852, 0.027462048053152038, 0.028309908249455527], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=70a9090f-0214-417d-9fb9-e51a1fd45da4", 1, 0, 0.0, 493.0, 493, 493, 493.0, 493.0, 493.0, 493.0, 2.028397565922921, 0.3664585446247465, 1.3984850405679514], "isController": false}, {"data": ["goToProfile", 16, 3, 18.75, 267.99999999999994, 118, 542, 231.0, 493.70000000000005, 542.0, 542.0, 0.08291959908373843, 0.13629301778107153, 0.05359104215684242], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/292c22f5-4151-439f-b6d8-d46b4e49735d", 3, 0, 0.0, 640.3333333333334, 224, 865, 832.0, 865.0, 865.0, 865.0, 0.030461800901669306, 0.03055104445899842, 0.019534423104260592], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee3dc3c6-e7ff-4476-97db-8b487f171c12", 1, 0, 0.0, 223.0, 223, 223, 223.0, 223.0, 223.0, 223.0, 4.484304932735426, 0.8101527466367713, 3.0917180493273544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6e1b4110-3671-4499-9744-4e2cc1c57a7b", 3, 0, 0.0, 381.0, 328, 429, 386.0, 429.0, 429.0, 429.0, 0.02311960542540074, 0.027326590917848337, 0.014826049052096179], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 144.5, 120, 380, 126.5, 228.10000000000014, 380.0, 380.0, 0.07833882521139242, 0.058218599595575814, 0.03932241812368721], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 169.125, 119, 379, 122.0, 376.9, 379.0, 379.0, 0.07824879203427297, 0.02828304116375516, 0.04421553446370234], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 905.0, 749, 967, 952.5, 967.0, 967.0, 967.0, 0.08605574260727386, 25.303245646117276, 0.04907866570571088], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 1330.25, 1073, 1507, 1397.0, 1507.0, 1507.0, 1507.0, 0.08584796325707172, 77.24614824333605, 0.048876330643430485], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 247.625, 120, 378, 247.0, 378.0, 378.0, 378.0, 0.08660164326618097, 0.1532443140608593, 0.04795227708195763], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 154.17647058823528, 121, 367, 127.0, 363.0, 367.0, 367.0, 0.09132272915290111, 0.06786777039585717, 0.045839729281827314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 165.23529411764707, 118, 377, 123.0, 361.8, 377.0, 377.0, 0.09132518211315728, 0.04057381424995165, 0.05118155311902357], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 301.7058823529412, 118, 1508, 126.0, 1335.1999999999998, 1508.0, 1508.0, 0.09065167892241816, 9.617857764182988, 0.052376757042835585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 233.47058823529412, 120, 906, 126.0, 761.9999999999999, 906.0, 906.0, 0.0909431337933986, 3.167546006526507, 0.05263396558872305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 155.375, 120, 361, 128.0, 361.0, 361.0, 361.0, 0.0866091437603525, 0.06436480312659008, 0.048633064123244814], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 256.93749999999994, 121, 1493, 127.5, 713.2000000000007, 1493.0, 1493.0, 0.07824879203427297, 4.420297377503961, 0.045581449656683426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 887.0588235294118, 121, 1549, 1206.0, 1547.4, 1549.0, 1549.0, 0.08828142039612392, 46.736725573959056, 0.047437063785922745], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 220.125, 119, 752, 127.5, 572.8000000000002, 752.0, 752.0, 0.07834572991288934, 1.4595622034491706, 0.045714427366163456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 677.2352941176472, 119, 1138, 970.0, 1126.0, 1138.0, 1138.0, 0.08828325422461338, 15.279332111216126, 0.04752426328922633], "isController": false}, {"data": ["deleteBooks", 16, 3, 18.75, 583.0625, 121, 2899, 461.5, 1477.3000000000015, 2899.0, 2899.0, 0.08127768521152517, 0.01642519627291015, 0.05495073969043362], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/d9f39a57-d451-4abf-97f4-f7780a8b294f", 3, 0, 0.0, 298.6666666666667, 213, 433, 250.0, 433.0, 433.0, 433.0, 0.052429220552254456, 0.03370693704124432, 0.033621603023418385], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 486.11764705882354, 241, 1636, 257.0, 1459.9999999999998, 1636.0, 1636.0, 0.09058888101416916, 12.873971591393524, 0.20100969134503174], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 24, 0, 0.0, 650.9166666666666, 137, 1349, 599.0, 1210.5, 1322.25, 1349.0, 0.11631231795910653, 0.07144574999636524, 0.0525904328272132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 144.88235294117646, 121, 460, 124.0, 198.39999999999975, 460.0, 460.0, 0.08845919689456185, 0.06573969612964996, 0.04440237031621561], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 180.76470588235293, 119, 387, 124.0, 367.79999999999995, 387.0, 387.0, 0.08846103811630024, 0.10182572850266683, 0.046080232860673864], "isController": false}, {"data": ["login", 24, 0, 0.0, 3118.3333333333335, 1422, 6027, 2843.5, 4611.0, 5753.25, 6027.0, 0.1142508949653439, 45.714899685334, 0.2355308977264072], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/fa610484-8d02-42a5-bb53-7e021bd925a0", 3, 0, 0.0, 446.3333333333333, 260, 665, 414.0, 665.0, 665.0, 665.0, 0.024212879637775322, 0.028618804024987694, 0.015527139611463991], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 146.37499999999997, 124, 367, 130.0, 212.30000000000015, 367.0, 367.0, 0.07608649131900688, 0.06159736455415694, 0.027046369961053227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8116558f-dd5d-4104-8b7e-6e8da1e52a3e", 3, 0, 0.0, 396.3333333333333, 242, 474, 473.0, 474.0, 474.0, 474.0, 0.03599409696809723, 0.02314073616926824, 0.02308215202706756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1034.0000000000002, 248, 1681, 1331.0, 1673.8, 1681.0, 1681.0, 0.08822369377036929, 62.14230583165103, 0.18513900259221971], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/29eb84c5-e58e-42ef-a9e1-fe3e38ebf016", 3, 0, 0.0, 304.6666666666667, 231, 451, 232.0, 451.0, 451.0, 451.0, 0.021918128484069176, 0.025906485848195045, 0.014055570675005298], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 373.1538461538462, 245, 1083, 256.0, 855.7999999999997, 1083.0, 1083.0, 0.1450520513707419, 13.556177683184004, 0.32337062263593047], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, 42.857142857142854, 901.6428571428573, 118, 1637, 1295.0, 1631.5, 1637.0, 1637.0, 0.12120267684769152, 82.87134958098503, 0.19058816574898926], "isController": false}, {"data": ["register", 25, 9, 36.0, 1079.6399999999999, 245, 2296, 991.0, 2017.600000000001, 2293.3, 2296.0, 0.09677694076477009, 0.03015206560702368, 0.04366303382160525], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 474.06250000000006, 245, 1874, 389.0, 996.200000000001, 1874.0, 1874.0, 0.07819372495357248, 5.960290912728472, 0.17460910773629165], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 146.66666666666669, 121, 369, 129.0, 235.80000000000007, 369.0, 369.0, 0.0771204261160611, 0.0598737683225279, 0.027413901470943594], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/780f3bd8-4fca-4790-93ae-5936d827a676", 3, 0, 0.0, 984.6666666666666, 207, 2482, 265.0, 2482.0, 2482.0, 2482.0, 0.15130882130428205, 0.07023645155595903, 0.09703072199525899], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 531.4, 249, 1442, 501.0, 1034.6000000000004, 1442.0, 1442.0, 0.15108935424409997, 12.268908045759929, 0.33722632366865096], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 10, 0, 0.0, 125.3, 119, 130, 125.5, 129.9, 130.0, 130.0, 0.048907408494238705, 0.03634622838292545, 0.024549226529334663], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 10, 0, 0.0, 123.7, 117, 130, 123.0, 129.8, 130.0, 130.0, 0.04891027898423132, 0.013087320743827523, 0.02789414348319443], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 10, 0, 0.0, 124.6, 120, 129, 124.5, 129.0, 129.0, 129.0, 0.048907886885839205, 0.013182203887198849, 0.028752488188745318], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 10, 0, 0.0, 172.9, 120, 378, 127.5, 375.7, 378.0, 378.0, 0.0488479217651685, 0.013166041413268072, 0.02876493830507481], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 126.0, 121, 136, 121.0, 136.0, 136.0, 136.0, 0.054313388250203674, 0.016018206300353038, 0.03357458472888567], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1423.425925925926, 949, 2122, 1315.5, 2002.5, 2062.0, 2122.0, 0.24908668216539354, 297.99426841165723, 0.4918488977914314], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2b1c37a6-43d4-480c-9e94-e69a1a85fd77", 1, 0, 0.0, 372.0, 372, 372, 372.0, 372.0, 372.0, 372.0, 2.688172043010753, 0.4856560819892473, 1.8533686155913978], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, 36.0, 1079.6399999999999, 245, 2296, 991.0, 2017.600000000001, 2293.3, 2296.0, 0.10168553950279839, 0.031681400901340626, 0.045877655517864116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 123.22222222222223, 120, 127, 123.0, 127.0, 127.0, 127.0, 0.05828222845338393, 0.01570888188782614, 0.034320491950576675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 124.22222222222223, 119, 128, 124.0, 128.0, 128.0, 128.0, 0.05828147361468175, 0.01570867843520719, 0.034263131949256266], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 173.2, 120, 376, 125.0, 376.0, 376.0, 376.0, 0.0781058803313772, 0.021051975558066514, 0.04591771480418856], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 186.2, 119, 360, 125.0, 359.4, 360.0, 360.0, 0.07810628703539776, 0.021052085177509557, 0.0459942295726024], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=bbbac544-8d5f-4bf1-bcc6-e4d4a91f1d60", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 142.9333333333333, 119, 378, 128.0, 232.80000000000007, 378.0, 378.0, 0.07810750717287274, 0.058046692342339994, 0.03920630731138339], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 122.88888888888889, 119, 131, 121.0, 131.0, 131.0, 131.0, 0.0582810962026628, 0.015594746444853131, 0.03323843767808113], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 156.20000000000002, 119, 365, 127.0, 361.4, 365.0, 365.0, 0.0781058803313772, 0.020899425010544294, 0.044544759876488565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 124.55555555555556, 121, 135, 122.0, 135.0, 135.0, 135.0, 0.0582761902911867, 0.04330877032382136, 0.02925191582975582], "isController": false}, {"data": ["deleteAccount", 16, 3, 18.75, 809.0625, 119, 2754, 462.5, 2563.6000000000004, 2754.0, 2754.0, 0.0815980987642988, 0.01607159818801222, 0.0555259523390605], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 159.44444444444446, 127, 369, 134.0, 369.0, 369.0, 369.0, 0.06025871073140684, 0.047430196142103434, 0.021420088580304777], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6e1b4110-3671-4499-9744-4e2cc1c57a7b", 1, 0, 0.0, 672.0, 672, 672, 672.0, 672.0, 672.0, 672.0, 1.488095238095238, 0.26884533110119047, 1.025971912202381], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 24, 0, 0.0, 1593.1250000000002, 956, 3235, 1427.0, 2353.5, 3033.25, 3235.0, 0.11449179952485904, 0.05925845092595242, 0.05266175544551621], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 251.55555555555554, 245, 264, 249.0, 264.0, 264.0, 264.0, 0.05822981366459627, 0.09024483816964285, 0.13096021569293478], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/70a9090f-0214-417d-9fb9-e51a1fd45da4", 3, 0, 0.0, 1561.0, 542, 2754, 1387.0, 2754.0, 2754.0, 2754.0, 0.023273675146042314, 0.02750869611174467, 0.014924850272689893], "isController": false}, {"data": ["addBook", 58, 16, 27.586206896551722, 1240.034482758621, 620, 3158, 999.0, 2219.6, 2396.75, 3158.0, 0.28577059519117065, 89.58882657758917, 1.0368133653182894], "isController": true}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 236.6296296296297, 121, 524, 129.0, 490.0, 509.75, 524.0, 0.2503384204572848, 0.18604251754686893, 0.12101320129526953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=292c22f5-4151-439f-b6d8-d46b4e49735d", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 807.4074074074073, 591, 1141, 740.0, 1013.0, 1067.0, 1141.0, 0.2501262211023155, 73.5454139762658, 0.12579590221454345], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e3a6b52f-64db-48b3-b73e-0591f3d832ab", 3, 0, 0.0, 624.3333333333334, 222, 1231, 420.0, 1231.0, 1231.0, 1231.0, 0.025323935339551767, 0.02539812655636686, 0.01623963301397037], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 193.33333333333331, 120, 522, 128.0, 375.5, 380.5, 522.0, 0.25080699472840856, 0.44381081489050417, 0.1219744954831518], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 1182.9259259259256, 827, 1631, 1155.5, 1562.0, 1621.0, 1631.0, 0.24969712663343535, 224.67791346549555, 0.1253362530171736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 149.0, 121, 381, 134.0, 243.00000000000009, 381.0, 381.0, 0.14839584095923072, 0.1108621272791128, 0.05275008409097654], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 16, 9.411764705882353, 191.17058823529402, 120, 2644, 131.5, 324.6, 395.45, 1117.499999999983, 0.722832141368959, 1.6007858540686946, 0.3463432267439388], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 10, 0, 0.0, 131.39999999999998, 124, 146, 130.0, 144.8, 146.0, 146.0, 0.04929994084007099, 0.038178567466969036, 0.017524588345493985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d9f39a57-d451-4abf-97f4-f7780a8b294f", 1, 0, 0.0, 446.0, 446, 446, 446.0, 446.0, 446.0, 446.0, 2.242152466367713, 0.40507637331838564, 1.5458590246636772], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 132.38461538461536, 122, 146, 133.0, 143.2, 146.0, 146.0, 0.14602803738317757, 0.11850517486857476, 0.0519084039135514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 10, 0, 0.0, 301.8, 249, 498, 256.5, 496.2, 498.0, 498.0, 0.048816921897806655, 0.07565669438654214, 0.10979040149477415], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e3a6b52f-64db-48b3-b73e-0591f3d832ab", 1, 0, 0.0, 868.0, 868, 868, 868.0, 868.0, 868.0, 868.0, 1.152073732718894, 0.20813832085253456, 0.7943008352534562], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 366.3333333333333, 247, 754, 257.0, 602.8000000000001, 754.0, 754.0, 0.07805548183648937, 0.12097075163526234, 0.17554860807562017], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02eb5722-a93e-4d05-9eca-c074102cfcdd", 1, 0, 0.0, 249.0, 249, 249, 249.0, 249.0, 249.0, 249.0, 4.016064257028112, 1.2824736445783134, 2.3963039658634537], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee3dc3c6-e7ff-4476-97db-8b487f171c12", 3, 0, 0.0, 346.3333333333333, 241, 517, 281.0, 517.0, 517.0, 517.0, 0.07499625018749062, 0.03393385018249087, 0.04809329846007699], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b9c86d6d-a2f0-44d5-9c54-624fce5d8caa", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fa610484-8d02-42a5-bb53-7e021bd925a0", 1, 0, 0.0, 455.0, 455, 455, 455.0, 455.0, 455.0, 455.0, 2.197802197802198, 0.39706387362637363, 1.5152815934065933], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2b1c37a6-43d4-480c-9e94-e69a1a85fd77", 3, 0, 0.0, 1644.3333333333333, 473, 2319, 2141.0, 2319.0, 2319.0, 2319.0, 0.09867447291385718, 0.044647629345788246, 0.06327757540374306], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8116558f-dd5d-4104-8b7e-6e8da1e52a3e", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 158.41176470588235, 123, 378, 129.0, 363.59999999999997, 378.0, 378.0, 0.09227095093356492, 0.0765019895923795, 0.03279943958966565], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=29eb84c5-e58e-42ef-a9e1-fe3e38ebf016", 1, 0, 0.0, 704.0, 704, 704, 704.0, 704.0, 704.0, 704.0, 1.4204545454545454, 0.2566250887784091, 0.9793368252840909], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 146.2941176470588, 122, 365, 130.0, 197.79999999999984, 365.0, 365.0, 0.08427063763130109, 0.06542495792664489, 0.02995557822050156], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=780f3bd8-4fca-4790-93ae-5936d827a676", 1, 0, 0.0, 361.0, 361, 361, 361.0, 361.0, 361.0, 361.0, 2.770083102493075, 0.5004544667590027, 1.9098424515235457], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=88985d2e-a793-43e7-8b5d-6379d77e99a3", 1, 0, 0.0, 2899.0, 2899, 2899, 2899.0, 2899.0, 2899.0, 2899.0, 0.34494653328734043, 0.062319442048982404, 0.2378244653328734], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 175.60000000000002, 122, 378, 128.0, 371.4, 378.0, 378.0, 0.15166988543867987, 0.11271560822151892, 0.07613117296433736], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 208.46666666666664, 120, 391, 128.0, 382.6, 391.0, 391.0, 0.15203884085587732, 0.055905948773046554, 0.08585839229061717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 336.9333333333333, 121, 1314, 361.0, 763.2000000000003, 1314.0, 1314.0, 0.15164688517297856, 9.134957592580424, 0.08828297182400874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 245.80000000000004, 118, 753, 126.0, 528.0000000000001, 753.0, 753.0, 0.15164841830699705, 3.010793734140103, 0.0884319585140477], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 24.324324324324323, 0.6896551724137931], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.22988505747126436], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.22988505747126436], "isController": false}, {"data": ["401/Unauthorized", 22, 59.45945945945946, 1.685823754789272], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1305, 37, "401/Unauthorized", 22, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 16, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 14, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
