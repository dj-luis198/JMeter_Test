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

    var data = {"OkPercent": 98.42814371257485, "KoPercent": 1.5718562874251496};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8075192802056556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.3333333333333333, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c5a4d69d-ee62-4a30-adf3-f8be05666710"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7787387d-68b0-4458-acef-dde8ae8d3461"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5357142857142857, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3a6cbe11-307c-4127-a09b-92801bed4c47"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.625, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a745c215-8dd6-4066-ba24-db5402589287"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1319fc32-57cb-49c8-9093-03e2cd0647b4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2296344-d3af-432e-be8d-a6f0cff0a3cb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/ae01b87b-d1e4-4b59-922a-51fcb3538c4f"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6ec32a24-32ce-43b9-b5a3-44a488f47102"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e456e12c-cb68-41cb-a9af-001cae30a2f0"], "isController": false}, {"data": [0.6739130434782609, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.043478260869565216, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=02b492d7-2fe7-48d9-80e3-1246a3503bef"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fec52851-688f-4b22-ab3d-d229387ae9ff"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/865431d7-8160-4c18-b10d-e82ecdba0c11"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/35d70d00-9d17-4327-9836-df602ea8e12a"], "isController": false}, {"data": [0.2, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f25f42b7-5d4f-4c33-8aef-a9b6580dbe13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/ac1178f3-9544-42b8-a2f5-cbe42dc4725a"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3de6153a-3467-4c1b-8393-58ec227e4d66"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/7cc5c550-4156-4f44-8cd1-f3e4ed83f6b5"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.391304347826087, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5357142857142857, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63377c9a-a893-415c-bfb7-6359f855ac0c"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/a745c215-8dd6-4066-ba24-db5402589287"], "isController": false}, {"data": [0.39344262295081966, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6ec32a24-32ce-43b9-b5a3-44a488f47102"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7787387d-68b0-4458-acef-dde8ae8d3461"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9608938547486033, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=35d70d00-9d17-4327-9836-df602ea8e12a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e0a09bf3-01de-4edb-a3ed-7bd335e34539"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ae01b87b-d1e4-4b59-922a-51fcb3538c4f"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b2296344-d3af-432e-be8d-a6f0cff0a3cb"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/f25f42b7-5d4f-4c33-8aef-a9b6580dbe13"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/02b492d7-2fe7-48d9-80e3-1246a3503bef"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/63377c9a-a893-415c-bfb7-6359f855ac0c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e456e12c-cb68-41cb-a9af-001cae30a2f0"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c5a4d69d-ee62-4a30-adf3-f8be05666710"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1336, 21, 1.5718562874251496, 313.68263473053923, 81, 2241, 97.0, 893.3, 1074.1499999999999, 1480.129999999994, 5.162287480680061, 724.4963382679675, 3.7615995097565684], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 57, 0, 0.0, 1394.3508771929826, 1006, 1794, 1352.0, 1688.0, 1750.8, 1794.0, 0.25277834443488517, 304.17794168026643, 1.2429091447555145], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/c5a4d69d-ee62-4a30-adf3-f8be05666710", 3, 0, 0.0, 561.3333333333334, 226, 1018, 440.0, 1018.0, 1018.0, 1018.0, 0.02174858634188778, 0.029982182017543862, 0.013946847361171523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7787387d-68b0-4458-acef-dde8ae8d3461", 3, 0, 0.0, 467.0, 353, 601, 447.0, 601.0, 601.0, 601.0, 0.03829656862745098, 0.02462100359349469, 0.024558671938827614], "isController": false}, {"data": ["deleteBook", 14, 3, 21.428571428571427, 480.7142857142857, 87, 954, 494.5, 840.0, 954.0, 954.0, 0.07363808982794987, 0.015106697976004502, 0.049295811110409794], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, 21.428571428571427, 480.7142857142857, 87, 954, 494.5, 840.0, 954.0, 954.0, 0.07333759389831218, 0.015045051873251685, 0.0490946490403252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3a6cbe11-307c-4127-a09b-92801bed4c47", 1, 0, 0.0, 179.0, 179, 179, 179.0, 179.0, 179.0, 179.0, 5.58659217877095, 1.783999650837989, 3.3334060754189947], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 15, 0, 0.0, 130.06666666666666, 82, 288, 84.0, 264.0, 288.0, 288.0, 0.08940438796736144, 0.050778898478337324, 0.04948672568349655], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 15, 0, 0.0, 118.06666666666668, 82, 258, 84.0, 257.4, 258.0, 258.0, 0.08940225651295439, 0.06644054414683426, 0.04487574203872906], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 15, 0, 0.0, 226.26666666666668, 81, 673, 85.0, 658.6, 673.0, 673.0, 0.08940119082386178, 5.276660831997282, 0.05110884483231317], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 15, 0, 0.0, 303.3333333333333, 82, 972, 84.0, 971.4, 972.0, 972.0, 0.08929368693633359, 16.088577244620055, 0.05096018617733726], "isController": false}, {"data": ["goToProfile", 14, 3, 21.428571428571427, 215.28571428571428, 82, 447, 220.5, 379.0, 447.0, 447.0, 0.07381941661569612, 0.14806621964176492, 0.04770765171208319], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 102.10526315789473, 82, 246, 85.0, 244.0, 246.0, 246.0, 0.09677731539727089, 0.07192142286847963, 0.04857767589277073], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 100.73684210526318, 82, 248, 83.0, 246.0, 248.0, 248.0, 0.09678076609616951, 0.02589641592807661, 0.055195280664221684], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 577.75, 410, 740, 580.5, 740.0, 740.0, 740.0, 0.01925103835288116, 5.660444470379871, 0.010979107810627536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 679.25, 592, 822, 651.5, 822.0, 822.0, 822.0, 0.019237520860686683, 17.309955086400517, 0.010952611974394861], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 131.75, 81, 272, 87.0, 272.0, 272.0, 272.0, 0.019290402542475053, 0.03413497012398906, 0.010681306876546247], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a745c215-8dd6-4066-ba24-db5402589287", 1, 0, 0.0, 189.0, 189, 189, 189.0, 189.0, 189.0, 189.0, 5.291005291005291, 0.9558945105820106, 3.647900132275132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 13, 0, 0.0, 98.92307692307692, 83, 260, 85.0, 192.39999999999992, 260.0, 260.0, 0.06504650825340119, 0.0483402273250374, 0.032650298088133016], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 13, 0, 0.0, 123.15384615384615, 82, 257, 84.0, 255.8, 257.0, 257.0, 0.06504878658994245, 0.0324364367025269, 0.036257661996497374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 13, 0, 0.0, 225.92307692307693, 82, 908, 86.0, 852.4, 908.0, 908.0, 0.06504943757255514, 9.019696766417477, 0.037381925888675394], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 13, 0, 0.0, 186.53846153846155, 82, 688, 83.0, 675.2, 688.0, 688.0, 0.06504943757255514, 2.957403876946479, 0.03744545073005484], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 85.25, 84, 87, 85.0, 87.0, 87.0, 87.0, 0.019290309513016135, 0.014335864784575469, 0.010831960908187771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 127.42105263157895, 83, 249, 85.0, 248.0, 249.0, 249.0, 0.0967783012861327, 0.026084776518527954, 0.056895056029542854], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 18, 0, 0.0, 504.1666666666667, 83, 1131, 410.0, 1057.2, 1131.0, 1131.0, 0.08005942188201909, 36.02959352747372, 0.04362613028336588], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 101.52631578947368, 82, 246, 84.0, 241.0, 246.0, 246.0, 0.09677780833919093, 0.02608464365392256, 0.056989275809113414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 18, 0, 0.0, 358.7222222222222, 82, 740, 365.0, 731.0, 740.0, 740.0, 0.08000177781728483, 11.772370983244071, 0.04367284550767795], "isController": false}, {"data": ["deleteBooks", 14, 3, 21.428571428571427, 553.0714285714286, 86, 2059, 451.5, 1462.5, 2059.0, 2059.0, 0.07333413651673328, 0.01504434259875227, 0.04944018062459731], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1319fc32-57cb-49c8-9093-03e2cd0647b4", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.83160400390625, 1.5538533528645833], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2296344-d3af-432e-be8d-a6f0cff0a3cb", 1, 0, 0.0, 740.0, 740, 740, 740.0, 740.0, 740.0, 740.0, 1.3513513513513513, 0.244140625, 0.9316934121621622], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ae01b87b-d1e4-4b59-922a-51fcb3538c4f", 3, 0, 0.0, 595.3333333333333, 260, 1215, 311.0, 1215.0, 1215.0, 1215.0, 0.02208366765552423, 0.026102147544664216, 0.014161726979616774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 13, 0, 0.0, 338.99999999999994, 168, 993, 177.0, 936.5999999999999, 993.0, 993.0, 0.06501820509742727, 12.052090405626076, 0.143668156771396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6ec32a24-32ce-43b9-b5a3-44a488f47102", 3, 0, 0.0, 303.6666666666667, 185, 502, 224.0, 502.0, 502.0, 502.0, 0.046424536915244265, 0.029846504038934712, 0.02977094326921589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e456e12c-cb68-41cb-a9af-001cae30a2f0", 3, 0, 0.0, 491.66666666666663, 215, 936, 324.0, 936.0, 936.0, 936.0, 0.018842800793910007, 0.025976322058010703, 0.012083436707032134], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 703.6521739130435, 93, 1938, 740.0, 1218.4, 1801.199999999998, 1938.0, 0.09537038956730869, 0.05858200687288786, 0.04312157262662493], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 18, 0, 0.0, 86.77777777777776, 82, 105, 84.5, 96.9, 105.0, 105.0, 0.08005906579965663, 0.059497020579627635, 0.04018589826271827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 18, 0, 0.0, 157.33333333333337, 81, 335, 84.5, 335.0, 335.0, 335.0, 0.08005977796754911, 0.08154526212905637, 0.042297206914496156], "isController": false}, {"data": ["login", 23, 0, 0.0, 2536.0434782608695, 1265, 3523, 2714.0, 3354.8, 3501.9999999999995, 3523.0, 0.0957069204425821, 20.046398025836705, 0.17200181817141524], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 101.3157894736842, 85, 318, 87.0, 120.0, 318.0, 318.0, 0.10088834845773574, 0.08167621178853803, 0.03586265511583575], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=02b492d7-2fe7-48d9-80e3-1246a3503bef", 1, 0, 0.0, 430.0, 430, 430, 430.0, 430.0, 430.0, 430.0, 2.3255813953488373, 0.42014898255813954, 1.6033793604651163], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fec52851-688f-4b22-ab3d-d229387ae9ff", 1, 0, 0.0, 283.0, 283, 283, 283.0, 283.0, 283.0, 283.0, 3.5335689045936394, 1.1283955388692581, 2.1084087897526502], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/865431d7-8160-4c18-b10d-e82ecdba0c11", 1, 0, 0.0, 341.0, 341, 341, 341.0, 341.0, 341.0, 341.0, 2.932551319648094, 0.9364690249266862, 1.7497938049853372], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 18, 0, 0.0, 601.2777777777778, 167, 1217, 575.0, 1142.3000000000002, 1217.0, 1217.0, 0.07997121036426887, 47.89865492172818, 0.16962643448358591], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/35d70d00-9d17-4327-9836-df602ea8e12a", 3, 0, 0.0, 643.3333333333334, 173, 1307, 450.0, 1307.0, 1307.0, 1307.0, 0.015634934698089412, 0.02155401967656532, 0.010026309034907598], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, 60.0, 363.29999999999995, 82, 908, 88.5, 891.2, 908.0, 908.0, 0.04511210357738981, 21.595146360581044, 0.05862370725628186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 15, 0, 0.0, 461.59999999999997, 166, 1166, 333.0, 1100.0, 1166.0, 1166.0, 0.08924799638248121, 21.464979829952817, 0.1961538482992307], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f25f42b7-5d4f-4c33-8aef-a9b6580dbe13", 1, 0, 0.0, 238.0, 238, 238, 238.0, 238.0, 238.0, 238.0, 4.201680672268908, 0.7590926995798319, 2.8968618697478994], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ac1178f3-9544-42b8-a2f5-cbe42dc4725a", 1, 0, 0.0, 187.0, 187, 187, 187.0, 187.0, 187.0, 187.0, 5.347593582887701, 1.7076788101604279, 3.1908004679144386], "isController": false}, {"data": ["register", 23, 4, 17.391304347826086, 1076.5652173913045, 414, 1614, 1102.0, 1469.6000000000001, 1592.3999999999996, 1614.0, 0.0991729835545322, 0.031547384204762025, 0.044744060939642456], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 248.10526315789474, 167, 494, 174.0, 491.0, 494.0, 494.0, 0.09673395616424407, 0.149918738703765, 0.21755693461548253], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 91.3529411764706, 86, 115, 89.0, 103.79999999999998, 115.0, 115.0, 0.13661421752197883, 0.10606279583005192, 0.048562085134765905], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3de6153a-3467-4c1b-8393-58ec227e4d66", 1, 0, 0.0, 206.0, 206, 206, 206.0, 206.0, 206.0, 206.0, 4.854368932038835, 1.5501744538834952, 2.896503337378641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7cc5c550-4156-4f44-8cd1-f3e4ed83f6b5", 1, 0, 0.0, 200.0, 200, 200, 200.0, 200.0, 200.0, 200.0, 5.0, 1.5966796875, 2.9833984375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 340.6666666666667, 166, 981, 332.0, 692.4000000000002, 981.0, 981.0, 0.10370145043762012, 8.420868339774346, 0.23145812665058144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 7, 0, 0.0, 107.71428571428571, 83, 245, 84.0, 245.0, 245.0, 245.0, 0.04371502797761791, 0.032487437784147685, 0.02194289490282774], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 7, 0, 0.0, 154.57142857142858, 83, 248, 87.0, 248.0, 248.0, 248.0, 0.0436700292589196, 0.030425240809018483, 0.02385767781500128], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 7, 0, 0.0, 396.85714285714283, 82, 1024, 246.0, 1024.0, 1024.0, 1024.0, 0.04345963531157454, 11.181240163377186, 0.024482422905711218], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 100.0, 86, 115, 99.0, 115.0, 115.0, 115.0, 0.01550203335004108, 0.004571888741906647, 0.009582799912671879], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 7, 0, 0.0, 201.57142857142856, 82, 498, 88.0, 498.0, 498.0, 498.0, 0.04360528496053721, 3.671652593580056, 0.024607056035905836], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 963.3859649122807, 653, 1424, 908.0, 1318.2, 1398.5, 1424.0, 0.25092998173053643, 300.19949552618255, 0.4954886943936959], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, 17.391304347826086, 1076.5652173913045, 414, 1614, 1102.0, 1469.6000000000001, 1592.3999999999996, 1614.0, 0.09594526948106123, 0.03052063344735525, 0.043287807129150674], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 14, 0, 0.0, 96.71428571428572, 82, 256, 84.0, 175.0, 256.0, 256.0, 0.06506543723973825, 0.0175371686310232, 0.038314901030822426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 14, 0, 0.0, 95.64285714285714, 81, 248, 84.0, 167.5, 248.0, 248.0, 0.06506543723973825, 0.0175371686310232, 0.038251360564767994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 113.41176470588235, 82, 249, 85.0, 248.2, 249.0, 249.0, 0.1283571045657377, 0.03459625083998399, 0.0754599384263419], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 99.0, 83, 329, 84.0, 135.39999999999984, 329.0, 329.0, 0.1283600120809423, 0.03459703450619148, 0.07558699930157052], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 14, 0, 0.0, 98.14285714285712, 82, 254, 85.0, 174.5, 254.0, 254.0, 0.06506543723973825, 0.017410087698914337, 0.03710763217578822], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 95.6470588235294, 83, 251, 85.0, 130.1999999999999, 251.0, 251.0, 0.1281973938223938, 0.09527169599496259, 0.06434908244600628], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 14, 0, 0.0, 98.78571428571428, 83, 249, 86.0, 173.5, 249.0, 249.0, 0.06506483245805643, 0.04835384521541107, 0.032659495979922855], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 93.82352941176471, 82, 248, 84.0, 121.59999999999988, 248.0, 248.0, 0.12836098128194867, 0.03434659069458392, 0.07320587213736135], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 14, 0, 0.0, 101.57142857142858, 85, 250, 88.0, 178.5, 250.0, 250.0, 0.06531373921156985, 0.051409056449731746, 0.023216993235362724], "isController": false}, {"data": ["deleteAccount", 14, 3, 21.428571428571427, 504.5, 82, 1215, 481.0, 1075.5, 1215.0, 1215.0, 0.07235291685616241, 0.014419104593893414, 0.04923288950417579], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1398.6521739130433, 733, 2241, 1330.0, 2027.0000000000005, 2220.2, 2241.0, 0.096722779896801, 0.05006159506377395, 0.04448870051893874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 14, 0, 0.0, 210.35714285714286, 166, 503, 173.5, 429.0, 503.0, 503.0, 0.06503913962509582, 0.10079796346194049, 0.14627454937167544], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63377c9a-a893-415c-bfb7-6359f855ac0c", 1, 0, 0.0, 784.0, 784, 784, 784.0, 784.0, 784.0, 784.0, 1.2755102040816326, 0.23043885522959182, 0.8794044961734694], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a745c215-8dd6-4066-ba24-db5402589287", 3, 0, 0.0, 364.6666666666667, 183, 533, 378.0, 533.0, 533.0, 533.0, 0.0796241738991958, 0.036960960931072005, 0.0510610750590546], "isController": false}, {"data": ["addBook", 61, 5, 8.19672131147541, 938.8196721311476, 449, 3463, 735.0, 1576.2, 1774.7999999999997, 3463.0, 0.2716495809471218, 91.63177777533467, 0.9865301748131853], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6ec32a24-32ce-43b9-b5a3-44a488f47102", 1, 0, 0.0, 473.0, 473, 473, 473.0, 473.0, 473.0, 473.0, 2.1141649048625792, 0.3819536205073996, 1.457617600422833], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 157.45614035087712, 83, 354, 87.0, 338.2, 344.29999999999995, 354.0, 0.25174454553484676, 0.18708749917189296, 0.12169291996069252], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 533.421052631579, 405, 767, 491.0, 693.6000000000001, 742.4999999999999, 767.0, 0.2516123051659979, 73.98237203362335, 0.12654329800828998], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7787387d-68b0-4458-acef-dde8ae8d3461", 1, 0, 0.0, 425.0, 425, 425, 425.0, 425.0, 425.0, 425.0, 2.352941176470588, 0.4250919117647059, 1.6222426470588236], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 135.89473684210526, 81, 363, 88.0, 259.6, 337.0, 363.0, 0.2520774275719637, 0.44605888550820133, 0.12259234270589639], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 803.9122807017543, 568, 1077, 764.0, 1017.8, 1066.0, 1077.0, 0.2513559994708295, 226.17057016057018, 0.12616892942188118], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 99.59999999999998, 85, 261, 87.0, 165.60000000000005, 261.0, 261.0, 0.10463899546564354, 0.0781726870422044, 0.03719589291942797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, 2.793296089385475, 156.9162011173184, 84, 2044, 92.0, 242.0, 314.0, 1565.599999999993, 0.7149361749716422, 1.5463942778146118, 0.34454590943675806], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 7, 0, 0.0, 90.28571428571429, 86, 102, 90.0, 102.0, 102.0, 102.0, 0.042803507441695504, 0.0331476380871724, 0.0152153092859152], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=35d70d00-9d17-4327-9836-df602ea8e12a", 1, 0, 0.0, 557.0, 557, 557, 557.0, 557.0, 557.0, 557.0, 1.7953321364452424, 0.32435199730700176, 1.2377973518850987], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 15, 0, 0.0, 87.66666666666667, 85, 95, 87.0, 93.2, 95.0, 95.0, 0.08772699359592948, 0.07119251140450916, 0.03118420475480305], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e0a09bf3-01de-4edb-a3ed-7bd335e34539", 1, 0, 0.0, 267.0, 267, 267, 267.0, 267.0, 267.0, 267.0, 3.745318352059925, 1.1960147471910112, 2.234755383895131], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ae01b87b-d1e4-4b59-922a-51fcb3538c4f", 1, 0, 0.0, 682.0, 682, 682, 682.0, 682.0, 682.0, 682.0, 1.466275659824047, 0.26490331744868034, 1.010928335777126], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2296344-d3af-432e-be8d-a6f0cff0a3cb", 3, 0, 0.0, 384.3333333333333, 261, 621, 271.0, 621.0, 621.0, 621.0, 0.02199155524278677, 0.025993273791197515, 0.014102657496188132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f25f42b7-5d4f-4c33-8aef-a9b6580dbe13", 3, 0, 0.0, 367.0, 195, 634, 272.0, 634.0, 634.0, 634.0, 0.07145749470023581, 0.03317004799561728, 0.04582397934878404], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/02b492d7-2fe7-48d9-80e3-1246a3503bef", 3, 0, 0.0, 329.3333333333333, 244, 460, 284.0, 460.0, 460.0, 460.0, 0.017972573852301388, 0.024776643966307417, 0.01152538101856567], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 7, 0, 0.0, 506.2857142857143, 168, 1109, 343.0, 1109.0, 1109.0, 1109.0, 0.04343698224668483, 14.895436857753191, 0.09451543137577334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 225.05882352941177, 168, 501, 175.0, 432.19999999999993, 501.0, 501.0, 0.12811334262783075, 0.19855065893590565, 0.2881299102264592], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63377c9a-a893-415c-bfb7-6359f855ac0c", 3, 0, 0.0, 283.3333333333333, 193, 412, 245.0, 412.0, 412.0, 412.0, 0.03315063649222065, 0.027636321633000355, 0.02125870894846181], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 13, 0, 0.0, 102.30769230769229, 85, 247, 90.0, 188.99999999999994, 247.0, 247.0, 0.06559527714004593, 0.0543851467694326, 0.023317071170875697], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 18, 0, 0.0, 98.94444444444444, 84, 246, 88.5, 128.1000000000002, 246.0, 246.0, 0.07696517753300951, 0.05975323841674078, 0.027358715451186972], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e456e12c-cb68-41cb-a9af-001cae30a2f0", 1, 0, 0.0, 866.0, 866, 866, 866.0, 866.0, 866.0, 866.0, 1.1547344110854503, 0.2086190098152425, 0.7961352482678984], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c5a4d69d-ee62-4a30-adf3-f8be05666710", 1, 0, 0.0, 2059.0, 2059, 2059, 2059.0, 2059.0, 2059.0, 2059.0, 0.48567265662943176, 0.08774359519184069, 0.33484853084021365], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 95.8, 82, 250, 85.0, 152.20000000000005, 250.0, 250.0, 0.10388099393334996, 0.07720062146804621, 0.05214338953295106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 171.46666666666667, 82, 258, 244.0, 253.2, 258.0, 258.0, 0.10376314333148866, 0.03815457249584947, 0.058596452165190924], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 192.66666666666669, 82, 893, 84.0, 511.4000000000002, 893.0, 893.0, 0.10388315223037127, 6.257749304415727, 0.06047676739869661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 173.20000000000002, 82, 505, 85.0, 410.20000000000005, 505.0, 505.0, 0.10376314333148866, 2.060090209082734, 0.06050823403776978], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 19.047619047619047, 0.2994011976047904], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 14.285714285714286, 0.2245508982035928], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 14.285714285714286, 0.2245508982035928], "isController": false}, {"data": ["401/Unauthorized", 11, 52.38095238095238, 0.8233532934131736], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1336, 21, "401/Unauthorized", 11, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 179, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
