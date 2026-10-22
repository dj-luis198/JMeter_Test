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

    var data = {"OkPercent": 97.4076983503535, "KoPercent": 2.592301649646504};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7829614604462475, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.1388888888888889, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ef01eb3-1982-42d4-89ea-5013fbc6dd88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=55bc17ec-6bb3-409a-a13d-5c3ee257c866"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/089de4b8-2eea-4754-8dba-74d16a6e1749"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4722222222222222, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=089de4b8-2eea-4754-8dba-74d16a6e1749"], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2d86b6b6-6fce-4c59-9f02-9a31fd13be7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0b5626a1-7a4c-444b-acfd-e0e170630dad"], "isController": false}, {"data": [0.40476190476190477, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/55bc17ec-6bb3-409a-a13d-5c3ee257c866"], "isController": false}, {"data": [0.85, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.2631578947368421, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.9090909090909091, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f879ab73-8d88-4d66-88a8-4c347cbcb620"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.49074074074074076, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/98fe9b9f-ca04-46d5-b508-3451ba0df996"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8928571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=98fe9b9f-ca04-46d5-b508-3451ba0df996"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f879ab73-8d88-4d66-88a8-4c347cbcb620"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/531c94b9-0785-404f-bc45-7664e9eb0dba"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8809523809523809, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7b846ada-fbee-4e7c-89bd-304d8460dd6a"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7d024889-5798-4df5-b552-aa091b73b510"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "login"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0b5626a1-7a4c-444b-acfd-e0e170630dad"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=92464d81-994a-4815-94cd-08691bdac97a"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f3aa9236-8494-406a-8f2f-61e858c8e352"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2d86b6b6-6fce-4c59-9f02-9a31fd13be7c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7d024889-5798-4df5-b552-aa091b73b510"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/92464d81-994a-4815-94cd-08691bdac97a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a9bb956d-e3a0-4e1f-8870-17032a0cafe1"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/6ef01eb3-1982-42d4-89ea-5013fbc6dd88"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a9bb956d-e3a0-4e1f-8870-17032a0cafe1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f3aa9236-8494-406a-8f2f-61e858c8e352"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.25, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1273, 33, 2.592301649646504, 342.9481539670068, 104, 3256, 119.0, 870.2000000000003, 1019.0, 1465.04, 5.024133997955616, 711.4787821112413, 3.6844761893838034], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 54, 0, 0.0, 1680.1296296296296, 1304, 3160, 1724.5, 1918.0, 2039.0, 3160.0, 0.23463774539197538, 282.34774702276206, 1.153711960984957], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 20, 0, 0.0, 116.75, 113, 141, 115.0, 120.7, 140.0, 141.0, 0.09576480164715458, 0.07434864971629677, 0.03404139433551198], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 329.33333333333337, 224, 645, 232.0, 529.2, 645.0, 645.0, 0.08031655431273126, 0.12447497235771923, 0.1806338130685743], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ef01eb3-1982-42d4-89ea-5013fbc6dd88", 1, 0, 0.0, 532.0, 532, 532, 532.0, 532.0, 532.0, 532.0, 1.8796992481203008, 0.339594102443609, 1.2959645206766917], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=55bc17ec-6bb3-409a-a13d-5c3ee257c866", 1, 0, 0.0, 236.0, 236, 236, 236.0, 236.0, 236.0, 236.0, 4.237288135593221, 0.7655256885593221, 2.9214115466101696], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 427.0666666666666, 226, 672, 449.0, 670.8, 672.0, 672.0, 0.07841333235752297, 0.12152535005018453, 0.17635342228454629], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 136.5, 109, 313, 112.0, 313.0, 313.0, 313.0, 0.04358960387947475, 0.03239422710183621, 0.02187993788481447], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/089de4b8-2eea-4754-8dba-74d16a6e1749", 3, 0, 0.0, 350.6666666666667, 209, 500, 343.0, 500.0, 500.0, 500.0, 0.072283931282076, 0.03270659651109558, 0.046353953328675035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 138.875, 104, 335, 112.0, 335.0, 335.0, 335.0, 0.043588653873396756, 0.011663370274717491, 0.024859154162171587], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 139.0, 108, 336, 111.5, 336.0, 336.0, 336.0, 0.04359031641120925, 0.011748952470208743, 0.025626338358933565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 137.25, 107, 336, 109.0, 336.0, 336.0, 336.0, 0.04359031641120925, 0.011748952470208743, 0.025668907027303886], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 118.0, 114, 122, 118.0, 122.0, 122.0, 122.0, 3.10077519379845, 0.9144864341085271, 1.9167877906976745], "isController": false}, {"data": ["https://demoqa.com/books", 54, 0, 0.0, 1081.3518518518513, 834, 2485, 906.5, 1453.0, 1571.25, 2485.0, 0.2379535990481856, 284.6752305175491, 0.46986540749553835], "isController": false}, {"data": ["deleteBook", 13, 2, 15.384615384615385, 502.4615384615385, 109, 1175, 497.0, 986.9999999999998, 1175.0, 1175.0, 0.07353440278751952, 0.014577620865103965, 0.04943907038373645], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, 15.384615384615385, 502.4615384615385, 109, 1175, 497.0, 986.9999999999998, 1175.0, 1175.0, 0.07324562639096262, 0.014520373200552158, 0.049244918584669124], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=089de4b8-2eea-4754-8dba-74d16a6e1749", 1, 0, 0.0, 256.0, 256, 256, 256.0, 256.0, 256.0, 256.0, 3.90625, 0.705718994140625, 2.69317626953125], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, 40.90909090909091, 865.7727272727273, 125, 3256, 792.5, 2648.8999999999987, 3251.2, 3256.0, 0.08992989555868948, 0.0278635773703681, 0.040573839597768106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 18, 0, 0.0, 122.61111111111111, 105, 338, 111.0, 136.40000000000032, 338.0, 338.0, 0.09572278680939998, 0.0336006093021277, 0.05414527860648894], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 10, 0, 0.0, 186.0, 106, 443, 110.5, 431.70000000000005, 443.0, 443.0, 0.05606512524948981, 0.015111303289901548, 0.0330149126225023], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 18, 0, 0.0, 123.88888888888889, 108, 322, 112.0, 135.7000000000003, 322.0, 322.0, 0.09583796993882343, 0.0712233350814889, 0.048106168504448474], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 10, 0, 0.0, 154.1, 108, 337, 109.5, 336.3, 337.0, 337.0, 0.05617062388711952, 0.015139738469575182, 0.03302218318363862], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 18, 0, 0.0, 209.38888888888889, 105, 766, 113.0, 382.6000000000006, 766.0, 766.0, 0.09573042312847023, 1.5881423744070033, 0.05591545873486928], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 18, 0, 0.0, 161.05555555555554, 107, 1011, 112.0, 203.70000000000127, 1011.0, 1011.0, 0.09583745966840239, 4.815213606057459, 0.05588438674674418], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 20, 0, 0.0, 166.69999999999996, 106, 341, 113.5, 338.3, 340.9, 341.0, 0.09547678720611051, 0.025733977801646976, 0.056129908103592314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 20, 0, 0.0, 154.15, 107, 331, 112.0, 327.20000000000005, 330.85, 331.0, 0.09547086229282822, 0.02573238085236386, 0.05621965816657756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 20, 0, 0.0, 125.05000000000001, 108, 342, 114.0, 117.9, 330.79999999999984, 342.0, 0.09557077254633989, 0.07102476358180142, 0.04797204793829951], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 10, 0, 0.0, 156.7, 104, 338, 112.5, 338.0, 338.0, 338.0, 0.056168730867526044, 0.015029523689162244, 0.03203372932288595], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 20, 0, 0.0, 143.5, 107, 331, 112.0, 321.7, 330.55, 331.0, 0.09557214263186567, 0.02557301472766718, 0.05450598759473589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2d86b6b6-6fce-4c59-9f02-9a31fd13be7c", 3, 0, 0.0, 387.0, 210, 486, 465.0, 486.0, 486.0, 486.0, 0.015880914317173624, 0.021893122439202564, 0.010184049871364594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 10, 0, 0.0, 154.1, 105, 332, 110.5, 331.9, 332.0, 332.0, 0.05616904636193087, 0.04174281668108339, 0.02819422834964108], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 428.2307692307692, 109, 578, 466.0, 560.8, 578.0, 578.0, 0.07535358219336888, 0.01462126673718989, 0.051279154228495244], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 10, 0, 0.0, 161.70000000000002, 111, 327, 116.5, 326.7, 327.0, 327.0, 0.0589254357535974, 0.0463807629076167, 0.020946150990536577], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0b5626a1-7a4c-444b-acfd-e0e170630dad", 1, 0, 0.0, 453.0, 453, 453, 453.0, 453.0, 453.0, 453.0, 2.207505518763797, 0.3988169150110375, 1.5219715783664458], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1233.2380952380952, 808, 3246, 1069.0, 1728.8, 3094.999999999998, 3246.0, 0.08931343486711436, 0.046226680155830674, 0.04108069123282311], "isController": false}, {"data": ["goToProfile", 13, 2, 15.384615384615385, 203.9230769230769, 107, 285, 211.0, 262.59999999999997, 285.0, 285.0, 0.0730185298561535, 0.13409585331981555, 0.04719436830546459], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/55bc17ec-6bb3-409a-a13d-5c3ee257c866", 3, 0, 0.0, 288.0, 204, 445, 215.0, 445.0, 445.0, 445.0, 0.06395906619763352, 0.03006409231425221, 0.04101541679991472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 10, 0, 0.0, 368.1, 218, 670, 224.5, 669.9, 670.0, 670.0, 0.056029628467533635, 0.08683498083786706, 0.12601194761790036], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 127.19999999999997, 107, 331, 114.0, 202.00000000000006, 331.0, 331.0, 0.08045915356970444, 0.05979435143217293, 0.04038672356916805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 157.39999999999998, 111, 336, 114.0, 334.2, 336.0, 336.0, 0.08046131151937777, 0.021529686871396003, 0.04588809172589513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 624.0, 531, 765, 571.0, 765.0, 765.0, 765.0, 0.049842373493825774, 14.65531272974219, 0.028425728633197513], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 910.8749999999999, 753, 1010, 957.0, 1010.0, 1010.0, 1010.0, 0.04971970516214839, 44.73787810282035, 0.028307214950715344], "isController": false}, {"data": ["addBook", 57, 16, 28.07017543859649, 1026.561403508772, 565, 2984, 886.0, 1605.6000000000004, 1760.0999999999997, 2984.0, 0.25267301452204904, 69.93838653734906, 0.9192643225703495], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 247.74999999999997, 108, 340, 321.5, 340.0, 340.0, 340.0, 0.04998281840617288, 0.0884461591327981, 0.02767603323857424], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 11, 0, 0.0, 111.90909090909089, 108, 115, 111.0, 114.8, 115.0, 115.0, 0.052628305416409504, 0.03911146525574964, 0.026416942367221176], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 11, 0, 0.0, 211.63636363636363, 107, 340, 118.0, 340.0, 340.0, 340.0, 0.05262603936427744, 0.0284528213537331, 0.029209694434078712], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 11, 0, 0.0, 272.5454545454545, 111, 1014, 113.0, 960.0000000000002, 1014.0, 1014.0, 0.05262755004401577, 8.621489727461055, 0.030116937818157462], "isController": false}, {"data": ["https://demoqa.com/books-0", 54, 0, 0.0, 202.5925925925926, 105, 463, 115.0, 448.5, 458.25, 463.0, 0.23872995663072455, 0.17741552441013805, 0.11540168801973501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 11, 0, 0.0, 278.3636363636363, 105, 770, 114.0, 764.2, 770.0, 770.0, 0.05257045635935252, 2.8220403430461234, 0.03013560340130853], "isController": false}, {"data": ["https://demoqa.com/books-3", 54, 0, 0.0, 618.4444444444446, 522, 873, 563.5, 779.5, 813.75, 873.0, 0.23866137486630543, 70.17436851415616, 0.12002989067983134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 112.875, 108, 115, 114.0, 115.0, 115.0, 115.0, 0.049982193843443275, 0.0371449702293558, 0.028066173300761606], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f879ab73-8d88-4d66-88a8-4c347cbcb620", 3, 0, 0.0, 344.3333333333333, 219, 488, 326.0, 488.0, 488.0, 488.0, 0.036930803983602725, 0.02374294852461438, 0.02368283979417232], "isController": false}, {"data": ["https://demoqa.com/books-1", 54, 0, 0.0, 155.3148148148148, 107, 448, 113.0, 333.0, 336.25, 448.0, 0.23890211207163525, 0.4227447530017608, 0.11618481622233824], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 717.3571428571428, 107, 1131, 920.5, 1096.5, 1131.0, 1131.0, 0.07834753848822829, 50.36121406855969, 0.04125050366274742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 154.1333333333333, 106, 331, 112.0, 329.8, 331.0, 331.0, 0.08036733228677206, 0.021661507530419035, 0.04724720120765311], "isController": false}, {"data": ["https://demoqa.com/books-2", 54, 0, 0.0, 875.0185185185186, 720, 2371, 785.0, 1016.0, 1092.25, 2371.0, 0.23847798053313077, 214.58290608328622, 0.11970476757229416], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 115.99999999999999, 114, 121, 116.0, 119.2, 121.0, 121.0, 0.07662913541900811, 0.05724735214408321, 0.02723926298097554], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 583.7142857142858, 109, 883, 752.5, 871.0, 883.0, 883.0, 0.07834578471697586, 16.460506204706345, 0.04132608984582669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 169.0, 108, 339, 114.0, 334.2, 339.0, 339.0, 0.08037293039704228, 0.021663016396077803, 0.04732898147403954], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/98fe9b9f-ca04-46d5-b508-3451ba0df996", 3, 0, 0.0, 325.6666666666667, 208, 535, 234.0, 535.0, 535.0, 535.0, 0.021917167717473096, 0.025905350254604432, 0.0140549545584056], "isController": false}, {"data": ["deleteBooks", 13, 2, 15.384615384615385, 334.84615384615387, 114, 532, 413.0, 501.59999999999997, 532.0, 532.0, 0.07329600875041581, 0.014530361109701573, 0.04973028478318477], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 16, 9.523809523809524, 177.44047619047615, 105, 1783, 116.0, 335.29999999999995, 389.19999999999993, 1190.290000000002, 0.6846802787626849, 1.477858215399193, 0.3280401472775808], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 114.75, 114, 116, 115.0, 116.0, 116.0, 116.0, 0.044729970757781616, 0.03463951837003987, 0.015900106792805183], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=98fe9b9f-ca04-46d5-b508-3451ba0df996", 1, 0, 0.0, 413.0, 413, 413, 413.0, 413.0, 413.0, 413.0, 2.4213075060532687, 0.4374432506053269, 1.6693780266343827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 11, 0, 0.0, 475.54545454545456, 223, 1126, 449.0, 1071.6000000000001, 1126.0, 1126.0, 0.052543085329970575, 11.495679786615366, 0.11572633202692116], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f879ab73-8d88-4d66-88a8-4c347cbcb620", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/531c94b9-0785-404f-bc45-7664e9eb0dba", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 18, 0, 0.0, 116.66666666666666, 114, 122, 116.0, 122.0, 122.0, 122.0, 0.09607019528935809, 0.07796321512251618, 0.03414995223176401], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 361.6666666666667, 129, 841, 342.0, 677.8000000000001, 826.5999999999998, 841.0, 0.08720097332895944, 0.05356387912491747, 0.03942778383916819], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 118.0, 108, 190, 113.0, 152.5, 190.0, 190.0, 0.07834622315242817, 0.05822409747949008, 0.039326131543308676], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 175.85714285714283, 108, 342, 113.0, 340.0, 342.0, 342.0, 0.07834490786079229, 0.10501365439822717, 0.03998126017784294], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7b846ada-fbee-4e7c-89bd-304d8460dd6a", 1, 0, 0.0, 275.0, 275, 275, 275.0, 275.0, 275.0, 275.0, 3.6363636363636362, 1.1612215909090908, 2.169744318181818], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7d024889-5798-4df5-b552-aa091b73b510", 3, 0, 0.0, 382.0, 283, 578, 285.0, 578.0, 578.0, 578.0, 0.018703475105674633, 0.025784250349131534, 0.01199409048117807], "isController": false}, {"data": ["login", 21, 0, 0.0, 2255.4285714285716, 1199, 5147, 2166.0, 3167.4, 4956.299999999997, 5147.0, 0.08814122742954997, 40.28768109612011, 0.18866501847817876], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 305.62500000000006, 222, 650, 224.0, 650.0, 650.0, 650.0, 0.043562307713251106, 0.06751306869231397, 0.09797265103868877], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0b5626a1-7a4c-444b-acfd-e0e170630dad", 3, 0, 0.0, 312.3333333333333, 225, 466, 246.0, 466.0, 466.0, 466.0, 0.020483268583445423, 0.028237839339482863, 0.01313542939758707], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 128.73333333333332, 108, 335, 114.0, 204.20000000000007, 335.0, 335.0, 0.08063519027217064, 0.06527985618713815, 0.02866329029206066], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=92464d81-994a-4815-94cd-08691bdac97a", 1, 0, 0.0, 205.0, 205, 205, 205.0, 205.0, 205.0, 205.0, 4.878048780487805, 0.8812881097560976, 3.363185975609756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 20, 0, 0.0, 304.8, 220, 684, 229.0, 450.5, 672.3499999999998, 684.0, 0.09541939208305304, 0.147881421128716, 0.21460044918678822], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f3aa9236-8494-406a-8f2f-61e858c8e352", 3, 0, 0.0, 303.3333333333333, 206, 472, 232.0, 472.0, 472.0, 472.0, 0.07700995995482082, 0.034845001411849263, 0.04938464228873601], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 11, 0, 0.0, 136.9090909090909, 110, 342, 116.0, 300.8000000000002, 342.0, 342.0, 0.05361878022149431, 0.04445541446098503, 0.019059800781859305], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 837.7857142857143, 219, 1253, 1034.5, 1247.5, 1253.0, 1253.0, 0.07829671097887667, 66.9418746539565, 0.16178188983093506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2d86b6b6-6fce-4c59-9f02-9a31fd13be7c", 1, 0, 0.0, 435.0, 435, 435, 435.0, 435.0, 435.0, 435.0, 2.2988505747126435, 0.41531968390804597, 1.5849497126436782], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7d024889-5798-4df5-b552-aa091b73b510", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.4115354498861048, 1.570508257403189], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/92464d81-994a-4815-94cd-08691bdac97a", 3, 0, 0.0, 628.3333333333334, 214, 1205, 466.0, 1205.0, 1205.0, 1205.0, 0.06787637449658356, 0.030712291845784875, 0.04352749275985339], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 147.6428571428571, 109, 357, 115.5, 346.5, 357.0, 357.0, 0.07644091117566121, 0.05934621521938541, 0.027172355144473324], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a9bb956d-e3a0-4e1f-8870-17032a0cafe1", 3, 0, 0.0, 286.6666666666667, 211, 422, 227.0, 422.0, 422.0, 422.0, 0.02079679452073787, 0.024581107065364326, 0.013336486069613804], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ef01eb3-1982-42d4-89ea-5013fbc6dd88", 3, 0, 0.0, 711.0, 229, 1396, 508.0, 1396.0, 1396.0, 1396.0, 0.04720618086261427, 0.030349025782442446, 0.030272192805778034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a9bb956d-e3a0-4e1f-8870-17032a0cafe1", 1, 0, 0.0, 456.0, 456, 456, 456.0, 456.0, 456.0, 456.0, 2.1929824561403506, 0.3961931195175438, 1.5119586074561402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 18, 0, 0.0, 349.7777777777778, 222, 1334, 227.5, 541.1000000000013, 1334.0, 1334.0, 0.09566529900720679, 6.498301068993282, 0.2137936738663662], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, 33.333333333333336, 719.8333333333334, 107, 1125, 918.5, 1124.1, 1125.0, 1125.0, 0.07452629225485508, 59.44621724724718, 0.1284923525155729], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 169.73333333333335, 108, 332, 114.0, 330.2, 332.0, 332.0, 0.07846008996756983, 0.05830871920441469, 0.039383287347002825], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 198.20000000000002, 106, 339, 112.0, 335.4, 339.0, 339.0, 0.07846214201647705, 0.020994752844252645, 0.04474794036877206], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f3aa9236-8494-406a-8f2f-61e858c8e352", 1, 0, 0.0, 257.0, 257, 257, 257.0, 257.0, 257.0, 257.0, 3.8910505836575875, 0.7029730058365758, 2.6826969844357977], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 194.66666666666666, 107, 460, 113.0, 388.6, 460.0, 460.0, 0.07846008996756983, 0.021147446124071555, 0.046125951328590854], "isController": false}, {"data": ["register", 22, 9, 40.90909090909091, 865.7727272727273, 125, 3256, 792.5, 2648.8999999999987, 3251.2, 3256.0, 0.09073511944041178, 0.028113065238550877, 0.04093713396627953], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 224.13333333333333, 107, 459, 118.0, 387.6, 459.0, 459.0, 0.07846008996756983, 0.021147446124071555, 0.04620257251019981], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 27.272727272727273, 0.7069913589945012], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.0606060606060606, 0.15710919088766692], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.15710919088766692], "isController": false}, {"data": ["401/Unauthorized", 20, 60.60606060606061, 1.5710919088766693], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1273, 33, "401/Unauthorized", 20, "406/Not Acceptable", 9, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 168, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 12, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
