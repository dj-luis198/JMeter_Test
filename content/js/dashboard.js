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

    var data = {"OkPercent": 97.20332577475435, "KoPercent": 2.796674225245654};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7236245954692556, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1aa783f0-8431-4074-819d-5745693aa69d"], "isController": false}, {"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/5293523d-3d26-4cb5-9de0-e35cae643979"], "isController": false}, {"data": [0.5, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.8461538461538461, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/c7137eda-7780-46a7-960c-dda2dbfc3da8"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c62032cb-e2ac-4fb4-8218-36fc1640010b"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=64f7c5ce-e8cc-49b7-9ec7-df9ff46153c5"], "isController": false}, {"data": [0.8, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=22f581e1-ccd6-4763-92a1-96538800eae2"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/3d0367df-22bc-403e-967e-d6f96bae5d02"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/75a7741d-1df6-4dea-82ba-fd2c1bb19a7b"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3ee9cc9d-3ea0-463e-8d51-c31c6660c8f4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c62032cb-e2ac-4fb4-8218-36fc1640010b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=fc784162-2eb7-4c9c-b90b-42542b5c12b1"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f4fe3cfa-8d76-4846-a838-f4c42a27179f"], "isController": false}, {"data": [0.7307692307692307, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.15384615384615385, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.28, 500, 1500, "register"], "isController": true}, {"data": [0.7894736842105263, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.7777777777777778, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=dfbf8446-6f02-4d07-ba59-ed1a9a15a911"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.25, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.28, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=f4fe3cfa-8d76-4846-a838-f4c42a27179f"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c7137eda-7780-46a7-960c-dda2dbfc3da8"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5666666666666667, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/74eea2c9-1a05-4b82-b79d-575358b676a1"], "isController": false}, {"data": [0.3409090909090909, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.211864406779661, 500, 1500, "addBook"], "isController": true}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.33035714285714285, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3d0367df-22bc-403e-967e-d6f96bae5d02"], "isController": false}, {"data": [0.8850574712643678, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/64f7c5ce-e8cc-49b7-9ec7-df9ff46153c5"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/157e34dd-54e7-4930-94f8-907da94c65f7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4f2496d3-1c9b-4b78-af3e-e75940eb64ea"], "isController": false}, {"data": [0.8846153846153846, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.6333333333333333, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3ee9cc9d-3ea0-463e-8d51-c31c6660c8f4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=74eea2c9-1a05-4b82-b79d-575358b676a1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/dfbf8446-6f02-4d07-ba59-ed1a9a15a911"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/22f581e1-ccd6-4763-92a1-96538800eae2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/1aa783f0-8431-4074-819d-5745693aa69d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=75a7741d-1df6-4dea-82ba-fd2c1bb19a7b"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/fc784162-2eb7-4c9c-b90b-42542b5c12b1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1323, 37, 2.796674225245654, 483.34996220710497, 137, 3036, 160.0, 1313.0, 1627.8, 2194.679999999999, 5.234877021936628, 741.8553857494519, 3.8254365241484916], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1aa783f0-8431-4074-819d-5745693aa69d", 1, 0, 0.0, 485.0, 485, 485, 485.0, 485.0, 485.0, 485.0, 2.061855670103093, 0.3725032216494846, 1.4215528350515465], "isController": false}, {"data": ["see books", 56, 0, 0.0, 2395.7857142857147, 1795, 3402, 2327.5, 3009.2000000000003, 3112.25, 3402.0, 0.23783030807518835, 286.18995166284793, 1.1694097667564194], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/5293523d-3d26-4cb5-9de0-e35cae643979", 1, 0, 0.0, 284.0, 284, 284, 284.0, 284.0, 284.0, 284.0, 3.5211267605633805, 1.1244223151408452, 2.1009848151408455], "isController": false}, {"data": ["deleteBook", 15, 3, 20.0, 583.4, 150, 1109, 512.0, 1059.2, 1109.0, 1109.0, 0.09007386056566384, 0.01833143802918393, 0.06036004210952981], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, 20.0, 583.4, 150, 1109, 512.0, 1059.2, 1109.0, 1109.0, 0.09180994118043102, 0.018684757560548656, 0.06152341956837086], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 13, 0, 0.0, 236.84615384615387, 144, 448, 148.0, 446.4, 448.0, 448.0, 0.08082164528001592, 0.0403015385643589, 0.04504932451755694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 13, 0, 0.0, 148.9230769230769, 142, 156, 149.0, 154.8, 156.0, 156.0, 0.08081812812781697, 0.06006112842311399, 0.04056691197040813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 13, 0, 0.0, 327.2307692307693, 144, 878, 152.0, 876.0, 878.0, 878.0, 0.08082013789158911, 3.6744020864029445, 0.046523791816650194], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 13, 0, 0.0, 403.2307692307692, 141, 1702, 148.0, 1673.2, 1702.0, 1702.0, 0.08082415771901792, 11.207005336725876, 0.046447175972843084], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c7137eda-7780-46a7-960c-dda2dbfc3da8", 3, 0, 0.0, 837.3333333333334, 234, 1397, 881.0, 1397.0, 1397.0, 1397.0, 0.02077806944030807, 0.02864424611969553, 0.01332447812415589], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c62032cb-e2ac-4fb4-8218-36fc1640010b", 1, 0, 0.0, 558.0, 558, 558, 558.0, 558.0, 558.0, 558.0, 1.7921146953405018, 0.32377072132616486, 1.2355790770609318], "isController": false}, {"data": ["goToProfile", 15, 3, 20.0, 237.19999999999996, 147, 341, 241.0, 328.40000000000003, 341.0, 341.0, 0.09049227799227799, 0.14415726238236004, 0.05848416950711873], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 19, 0, 0.0, 161.42105263157893, 141, 429, 148.0, 154.0, 429.0, 429.0, 0.1042518285222029, 0.07747621240761367, 0.05232953111368387], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 19, 0, 0.0, 191.68421052631578, 140, 450, 148.0, 439.0, 450.0, 450.0, 0.10425011248038452, 0.03613603816651487, 0.05899433277184589], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 959.1428571428572, 706, 1314, 895.0, 1314.0, 1314.0, 1314.0, 0.07172792573085632, 21.090391756155796, 0.040907332643379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1423.142857142857, 1267, 1621, 1325.0, 1621.0, 1621.0, 1621.0, 0.07145773785218457, 64.29779812870049, 0.04068345817170274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 276.2857142857143, 147, 452, 151.0, 452.0, 452.0, 452.0, 0.0720683619890868, 0.12752721867600125, 0.03990504028106661], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 15, 0, 0.0, 169.53333333333333, 144, 459, 150.0, 275.4000000000001, 459.0, 459.0, 0.11443567951906498, 0.08504448448633638, 0.057441346946093166], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 15, 0, 0.0, 235.26666666666668, 143, 599, 152.0, 506.6, 599.0, 599.0, 0.11444266422522316, 0.030622353513389794, 0.06526808194094759], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 15, 0, 0.0, 227.20000000000002, 144, 458, 151.0, 453.2, 458.0, 458.0, 0.1144417910903251, 0.030845639004814185, 0.06727925609021065], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 15, 0, 0.0, 204.19999999999996, 140, 444, 149.0, 435.6, 444.0, 444.0, 0.11443655256070859, 0.03084422705737849, 0.0673879308536204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 187.71428571428572, 142, 429, 149.0, 429.0, 429.0, 429.0, 0.07207355621222573, 0.05356247683349979, 0.04047099103713847], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 15, 0, 0.0, 1107.4, 146, 1848, 1322.0, 1811.4, 1848.0, 1848.0, 0.09561570137304147, 57.365374586462096, 0.05073359154884688], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 19, 0, 0.0, 240.47368421052633, 139, 1034, 150.0, 448.0, 1034.0, 1034.0, 0.10425411666584361, 4.963885936736956, 0.06081847369229671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 15, 0, 0.0, 790.0666666666666, 143, 1321, 885.0, 1253.2, 1321.0, 1321.0, 0.09579767530974581, 18.787071704559967, 0.050923699147400685], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 19, 0, 0.0, 231.94736842105263, 140, 860, 149.0, 471.0, 860.0, 860.0, 0.10425125650198626, 1.63995328240568, 0.06091861303305313], "isController": false}, {"data": ["deleteBooks", 15, 3, 20.0, 438.73333333333323, 150, 1051, 457.0, 917.2, 1051.0, 1051.0, 0.09235258987446204, 0.018795195048669815, 0.06235603578047174], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=64f7c5ce-e8cc-49b7-9ec7-df9ff46153c5", 1, 0, 0.0, 562.0, 562, 562, 562.0, 562.0, 562.0, 562.0, 1.779359430604982, 0.3214663033807829, 1.2267849199288254], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 15, 0, 0.0, 449.0, 294, 907, 309.0, 812.8000000000001, 907.0, 907.0, 0.11430400292618247, 0.1771488795350113, 0.25707238158105294], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=22f581e1-ccd6-4763-92a1-96538800eae2", 1, 0, 0.0, 457.0, 457, 457, 457.0, 457.0, 457.0, 457.0, 2.1881838074398248, 0.3953261761487965, 1.5086501641137855], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 621.681818181818, 200, 1432, 533.0, 1164.5, 1397.9499999999996, 1432.0, 0.10772274124997551, 0.06616953539671347, 0.04870666913939323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 15, 0, 0.0, 148.06666666666666, 137, 154, 149.0, 154.0, 154.0, 154.0, 0.09579583990599234, 0.07119202555513689, 0.048085021202812564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3d0367df-22bc-403e-967e-d6f96bae5d02", 3, 0, 0.0, 430.0, 264, 685, 341.0, 685.0, 685.0, 685.0, 0.0657030223390276, 0.04224071260402979, 0.042133774091108196], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 15, 0, 0.0, 321.0, 143, 605, 428.0, 592.4, 605.0, 605.0, 0.09579706350068015, 0.12155499789246461, 0.0492706251077717], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/75a7741d-1df6-4dea-82ba-fd2c1bb19a7b", 3, 0, 0.0, 566.3333333333334, 232, 996, 471.0, 996.0, 996.0, 996.0, 0.023799324099195582, 0.023869048681517444, 0.015261936352674251], "isController": false}, {"data": ["login", 22, 0, 0.0, 2957.0909090909095, 1784, 4185, 2953.5, 4077.7999999999997, 4175.849999999999, 4185.0, 0.1052777658143953, 40.21670003702667, 0.214387552579066], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 19, 0, 0.0, 183.10526315789474, 143, 436, 154.0, 435.0, 436.0, 436.0, 0.10349373045874957, 0.08378545170928066, 0.03678878699900864], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3ee9cc9d-3ea0-463e-8d51-c31c6660c8f4", 3, 0, 0.0, 629.6666666666666, 218, 960, 711.0, 960.0, 960.0, 960.0, 0.059043495374926196, 0.026715644066128714, 0.03786317900019681], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c62032cb-e2ac-4fb4-8218-36fc1640010b", 3, 0, 0.0, 571.0, 254, 994, 465.0, 994.0, 994.0, 994.0, 0.04789272030651341, 0.03079040449393359, 0.030712454102809705], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=fc784162-2eb7-4c9c-b90b-42542b5c12b1", 1, 0, 0.0, 261.0, 261, 261, 261.0, 261.0, 261.0, 261.0, 3.8314176245210727, 0.6921994731800766, 2.6415828544061304], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 15, 0, 0.0, 1258.0, 292, 1992, 1477.0, 1957.8, 1992.0, 1992.0, 0.09552497341221573, 76.23673372055444, 0.19854393074121013], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f4fe3cfa-8d76-4846-a838-f4c42a27179f", 3, 0, 0.0, 341.0, 252, 415, 356.0, 415.0, 415.0, 415.0, 0.06242327139557627, 0.04013214876505962, 0.04003054838843921], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 13, 0, 0.0, 602.1538461538462, 291, 1850, 304.0, 1821.6, 1850.0, 1850.0, 0.08074283407347599, 14.966884035045496, 0.17841424761653366], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, 46.15384615384615, 937.2307692307693, 147, 2042, 1420.0, 1934.0, 2042.0, 2042.0, 0.10813148788927336, 69.67027434206149, 0.16435791210573594], "isController": false}, {"data": ["register", 25, 8, 32.0, 1101.0000000000002, 222, 2308, 1066.0, 1777.8000000000004, 2178.9999999999995, 2308.0, 0.0980684439283865, 0.030692358310712212, 0.0442457237255025], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 19, 0, 0.0, 467.1052631578947, 286, 1183, 305.0, 875.0, 1183.0, 1183.0, 0.10416895107348845, 6.712011999303713, 0.23287564386006274], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 15, 0, 0.0, 154.46666666666664, 144, 175, 153.0, 169.0, 175.0, 175.0, 0.10848340203948796, 0.08422295373182902, 0.038562459318724235], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 453.61111111111114, 291, 897, 309.0, 745.8000000000002, 897.0, 897.0, 0.10732492621411323, 0.1663326737322243, 0.2413762744834988], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 13, 0, 0.0, 145.53846153846152, 139, 152, 145.0, 152.0, 152.0, 152.0, 0.05870214082192028, 0.04362532145066537, 0.029465723029752956], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=dfbf8446-6f02-4d07-ba59-ed1a9a15a911", 1, 0, 0.0, 525.0, 525, 525, 525.0, 525.0, 525.0, 525.0, 1.9047619047619047, 0.3441220238095238, 1.3132440476190477], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 13, 0, 0.0, 192.15384615384613, 139, 450, 150.0, 440.8, 450.0, 450.0, 0.058701610681886944, 0.022489349044292624, 0.033099030181658905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 13, 0, 0.0, 260.38461538461536, 142, 1615, 148.0, 1030.5999999999995, 1615.0, 1615.0, 0.058701610681886944, 4.077667346156625, 0.03412207507936006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 13, 0, 0.0, 229.84615384615384, 137, 963, 145.0, 748.5999999999998, 963.0, 963.0, 0.058705056763274116, 1.3423930805930113, 0.034181407374709864], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, 100.0, 155.66666666666666, 150, 162, 155.0, 162.0, 162.0, 162.0, 0.10362336361438293, 0.03056079669096059, 0.06405623942178162], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1634.1785714285713, 1112, 2765, 1492.5, 2362.2000000000003, 2502.6, 2765.0, 0.23815599217487454, 284.9173630603045, 0.47026505486093395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, 32.0, 1101.0000000000002, 222, 2308, 1066.0, 1777.8000000000004, 2178.9999999999995, 2308.0, 0.10112859512155657, 0.031650090004449655, 0.04562637787710853], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 147.57142857142858, 143, 152, 148.0, 152.0, 152.0, 152.0, 0.03915098296932241, 0.010552413378450181, 0.023054729229005286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=f4fe3cfa-8d76-4846-a838-f4c42a27179f", 1, 0, 0.0, 828.0, 828, 828, 828.0, 828.0, 828.0, 828.0, 1.2077294685990339, 0.21819331219806765, 0.8326728562801933], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 147.14285714285714, 144, 149, 147.0, 149.0, 149.0, 149.0, 0.039150763999194614, 0.010552354359157924, 0.02301636711671402], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c7137eda-7780-46a7-960c-dda2dbfc3da8", 1, 0, 0.0, 475.0, 475, 475, 475.0, 475.0, 475.0, 475.0, 2.1052631578947367, 0.38034539473684215, 1.451480263157895], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 15, 0, 0.0, 359.4, 142, 1621, 154.0, 916.0000000000005, 1621.0, 1621.0, 0.10481887298747763, 6.314115575473082, 0.061021507959246414], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 15, 0, 0.0, 364.6, 143, 1304, 440.0, 792.8000000000003, 1304.0, 1304.0, 0.10460105158923864, 2.0767258519755654, 0.06099685020083402], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 147.71428571428572, 138, 153, 149.0, 153.0, 153.0, 153.0, 0.039153172805324835, 0.010476532567049808, 0.02232954386553682], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 15, 0, 0.0, 186.06666666666666, 142, 452, 147.0, 440.0, 452.0, 452.0, 0.10459375784453183, 0.07773032199188352, 0.05250116360555602], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 149.14285714285714, 139, 155, 150.0, 155.0, 155.0, 155.0, 0.03915032606628709, 0.029095115367621563, 0.019651628513741765], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 15, 0, 0.0, 204.73333333333335, 140, 451, 145.0, 445.0, 451.0, 451.0, 0.10460251046025104, 0.038463214783821476, 0.05907045414923291], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 197.42857142857142, 152, 455, 154.0, 455.0, 455.0, 455.0, 0.040083143892760416, 0.031549818337465715, 0.014248305055629677], "isController": false}, {"data": ["deleteAccount", 15, 3, 20.0, 633.3333333333334, 148, 1684, 475.0, 1502.8000000000002, 1684.0, 1684.0, 0.09404270792842723, 0.018624864421762734, 0.06399312391067197], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/74eea2c9-1a05-4b82-b79d-575358b676a1", 3, 0, 0.0, 492.3333333333333, 241, 713, 523.0, 713.0, 713.0, 713.0, 0.06794093667904702, 0.030741504552042758, 0.04356889494066492], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1446.409090909091, 823, 3036, 1325.5, 2080.1, 2896.349999999998, 3036.0, 0.10764315316152834, 0.05571374138243166, 0.04951164564363267], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 300.42857142857144, 288, 308, 301.0, 308.0, 308.0, 308.0, 0.03911772759532152, 0.06062483759157739, 0.08797668618361862], "isController": false}, {"data": ["addBook", 59, 17, 28.8135593220339, 1425.271186440678, 740, 2820, 1170.0, 2515.0, 2660.0, 2820.0, 0.28451834419968364, 87.69796667337776, 1.0325610373225378], "isController": true}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 255.48214285714292, 138, 863, 152.5, 600.0, 609.15, 863.0, 0.23990369580211374, 0.17828780518106305, 0.11596907170121709], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 940.3749999999999, 687, 1362, 884.0, 1269.8, 1288.2, 1362.0, 0.23959781794844368, 70.44971387314152, 0.12050085570649267], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 207.58928571428567, 138, 457, 152.0, 443.3, 445.0, 457.0, 0.2406821620134782, 0.4258946070004126, 0.11705050457296108], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1370.5178571428578, 967, 1929, 1320.0, 1775.4, 1874.1, 1929.0, 0.2390700176314138, 215.11562210501148, 0.12000194244389324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 155.94444444444446, 147, 167, 155.0, 165.2, 167.0, 167.0, 0.10627745500921071, 0.07939673152543573, 0.037778314085305374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3d0367df-22bc-403e-967e-d6f96bae5d02", 1, 0, 0.0, 1051.0, 1051, 1051, 1051.0, 1051.0, 1051.0, 1051.0, 0.9514747859181732, 0.17189730019029498, 0.6559972645099905], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, 9.770114942528735, 231.12643678160936, 140, 2224, 154.0, 424.5, 458.5, 1969.75, 0.7200526383308021, 1.598445246255933, 0.34436245856593656], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 13, 0, 0.0, 155.76923076923075, 146, 186, 154.0, 178.4, 186.0, 186.0, 0.05813381509869333, 0.04501964391920294, 0.020664754585863643], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/64f7c5ce-e8cc-49b7-9ec7-df9ff46153c5", 3, 0, 0.0, 334.6666666666667, 258, 475, 271.0, 475.0, 475.0, 475.0, 0.017642803794379002, 0.02432202931939944, 0.011313907381161014], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/157e34dd-54e7-4930-94f8-907da94c65f7", 1, 0, 0.0, 344.0, 344, 344, 344.0, 344.0, 344.0, 344.0, 2.9069767441860463, 0.9283021438953489, 1.7345339752906979], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 13, 0, 0.0, 155.84615384615387, 149, 179, 154.0, 172.6, 179.0, 179.0, 0.07749950817619812, 0.06289266727970765, 0.027548653297007925], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4f2496d3-1c9b-4b78-af3e-e75940eb64ea", 1, 0, 0.0, 397.0, 397, 397, 397.0, 397.0, 397.0, 397.0, 2.5188916876574305, 0.8043726385390427, 1.5029715050377832], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 13, 0, 0.0, 430.69230769230774, 285, 1755, 297.0, 1281.7999999999997, 1755.0, 1755.0, 0.05866214216093282, 5.482407279971842, 0.13077797422701345], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 15, 0, 0.0, 611.5333333333333, 288, 1770, 590.0, 1249.8000000000002, 1770.0, 1770.0, 0.10427166243787146, 8.467171261860901, 0.23273082053109034], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3ee9cc9d-3ea0-463e-8d51-c31c6660c8f4", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 15, 0, 0.0, 174.86666666666667, 147, 436, 155.0, 277.0000000000001, 436.0, 436.0, 0.11512249032971081, 0.09544823661125439, 0.04092244773438939], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=74eea2c9-1a05-4b82-b79d-575358b676a1", 1, 0, 0.0, 241.0, 241, 241, 241.0, 241.0, 241.0, 241.0, 4.149377593360996, 0.7496434128630706, 2.8608013485477177], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/dfbf8446-6f02-4d07-ba59-ed1a9a15a911", 3, 0, 0.0, 357.6666666666667, 257, 499, 317.0, 499.0, 499.0, 499.0, 0.025647821217587564, 0.02572296131881097, 0.016447333267788904], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 15, 0, 0.0, 167.86666666666665, 140, 414, 152.0, 262.2000000000001, 414.0, 414.0, 0.08909532605919493, 0.06917068771197263, 0.03167060418510445], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/22f581e1-ccd6-4763-92a1-96538800eae2", 3, 0, 0.0, 303.6666666666667, 237, 411, 263.0, 411.0, 411.0, 411.0, 0.027549221275345284, 0.027629931884550398, 0.017666655570452543], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1aa783f0-8431-4074-819d-5745693aa69d", 3, 0, 0.0, 985.3333333333333, 320, 1684, 952.0, 1684.0, 1684.0, 1684.0, 0.040311744154797095, 0.025549142535608707, 0.02585095572426767], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=75a7741d-1df6-4dea-82ba-fd2c1bb19a7b", 1, 0, 0.0, 426.0, 426, 426, 426.0, 426.0, 426.0, 426.0, 2.347417840375587, 0.42409404342723006, 1.6184345657276995], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 166.61111111111111, 139, 452, 151.0, 185.60000000000042, 452.0, 452.0, 0.10742228296222912, 0.07983238020923474, 0.05392095062752517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 242.2222222222222, 142, 450, 149.5, 440.1, 450.0, 450.0, 0.10742548848756849, 0.028744710786712663, 0.061266098903066404], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 226.94444444444446, 138, 445, 148.0, 444.1, 445.0, 445.0, 0.10743190011220664, 0.028956254327118198, 0.06315820690190274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 204.05555555555557, 140, 579, 150.0, 456.6000000000002, 579.0, 579.0, 0.10742356514940828, 0.028954007794176447, 0.06325821268075507], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fc784162-2eb7-4c9c-b90b-42542b5c12b1", 3, 0, 0.0, 620.0, 229, 1382, 249.0, 1382.0, 1382.0, 1382.0, 0.07465100654440492, 0.03465245290765671, 0.04787190198322841], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 8, 21.62162162162162, 0.6046863189720333], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 3, 8.108108108108109, 0.22675736961451248], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 3, 8.108108108108109, 0.22675736961451248], "isController": false}, {"data": ["401/Unauthorized", 23, 62.16216216216216, 1.7384731670445956], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1323, 37, "401/Unauthorized", 23, "406/Not Acceptable", 8, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 13, 6, "Test failed: code expected to contain /200/", 3, "Test failed: code expected to contain /204/", 3, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 3, 3, "401/Unauthorized", 3, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 25, 8, "406/Not Acceptable", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 174, 17, "401/Unauthorized", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
