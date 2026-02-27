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

    var data = {"OkPercent": 98.7082066869301, "KoPercent": 1.2917933130699089};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8130718954248366, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.2636363636363636, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/846a387a-81a3-4cb1-b5e5-b006cd08ffd8"], "isController": false}, {"data": [0.7692307692307693, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.7692307692307693, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/110668a9-12a4-4f36-bd88-9abfe916577d"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/193e2c37-f0de-41b5-b563-c6ae5417fddb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=5272a639-49c7-46c3-b776-30f1ca7753a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2085d384-94ac-4278-8ad3-7b2ab81886db"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/d077d83c-5d39-4c90-9ec1-f61d0dc325c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6923076923076923, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.8076923076923077, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/5272a639-49c7-46c3-b776-30f1ca7753a3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/eb5889fc-5fad-4bc9-b4de-f815b9b2d8b3"], "isController": false}, {"data": [0.9130434782608695, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=193e2c37-f0de-41b5-b563-c6ae5417fddb"], "isController": false}, {"data": [0.021739130434782608, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/7fd363b6-8167-4693-ab07-4fc9c5dcb0cc"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=abb1f279-fdb5-42dc-bc47-127a04b97d9a"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/3433ab79-bb7e-42ca-8b41-e6d774d04544"], "isController": false}, {"data": [0.5769230769230769, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=de2fdbdf-7c74-453c-915d-cb3bb03575fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=846a387a-81a3-4cb1-b5e5-b006cd08ffd8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=4026851e-d8ae-4329-a3dd-6ed2fab2f302"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2e2fa99a-6b79-4171-b8ec-ba9e07816b41"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/a773a2ae-6ade-4c0c-a2db-680a92704817"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9047619047619048, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=110668a9-12a4-4f36-bd88-9abfe916577d"], "isController": false}, {"data": [0.34782608695652173, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.6153846153846154, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.3695652173913043, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/9741b67a-6601-4e7b-9c2c-4497af8a95c6"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/2085d384-94ac-4278-8ad3-7b2ab81886db"], "isController": false}, {"data": [0.3524590163934426, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/16c59ee2-68f9-44e7-924f-41cc246a7eca"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.7545454545454545, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9378531073446328, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a773a2ae-6ade-4c0c-a2db-680a92704817"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d077d83c-5d39-4c90-9ec1-f61d0dc325c0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/26a900be-054d-4462-9534-45f1f179d8d3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=9741b67a-6601-4e7b-9c2c-4497af8a95c6"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/abb1f279-fdb5-42dc-bc47-127a04b97d9a"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7fd363b6-8167-4693-ab07-4fc9c5dcb0cc"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/4026851e-d8ae-4329-a3dd-6ed2fab2f302"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e2fa99a-6b79-4171-b8ec-ba9e07816b41"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/de2fdbdf-7c74-453c-915d-cb3bb03575fb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1316, 17, 1.2917933130699089, 320.8723404255321, 97, 2264, 114.0, 803.0, 989.0, 1494.819999999996, 5.168283391587795, 736.3158561258002, 3.7717449399619056], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1468.1090909090913, 1195, 1868, 1437.0, 1707.8, 1765.5999999999997, 1868.0, 0.24040037589876959, 289.2832739389602, 1.1820467701663133], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/846a387a-81a3-4cb1-b5e5-b006cd08ffd8", 3, 0, 0.0, 398.3333333333333, 185, 600, 410.0, 600.0, 600.0, 600.0, 0.0263100197325148, 0.031097552620039465, 0.016871985310238983], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 544.2307692307692, 373, 1051, 481.0, 894.1999999999998, 1051.0, 1051.0, 0.1219958521410272, 0.022040266255947297, 0.08291905575210443], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 544.2307692307692, 373, 1051, 481.0, 894.1999999999998, 1051.0, 1051.0, 0.12238058479091748, 0.022109773619452863, 0.08318055372507673], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 141.57142857142856, 98, 304, 99.0, 300.5, 304.0, 304.0, 0.072811999417504, 0.019482898281636813, 0.04152559341779525], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 115.21428571428572, 99, 298, 101.0, 200.5, 298.0, 298.0, 0.07288743576794723, 0.05416732287051547, 0.036586076156957886], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 179.21428571428572, 99, 401, 103.0, 352.5, 401.0, 401.0, 0.07281502902199014, 0.01962592579108328, 0.04287838134791021], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 141.7857142857143, 98, 300, 100.0, 297.0, 300.0, 300.0, 0.07288933316672914, 0.019645953080094963, 0.04285095563122163], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 221.6153846153846, 178, 370, 209.0, 341.2, 370.0, 370.0, 0.12330105374977474, 0.2531506235002324, 0.07971220467026452], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/110668a9-12a4-4f36-bd88-9abfe916577d", 3, 0, 0.0, 284.6666666666667, 209, 396, 249.0, 396.0, 396.0, 396.0, 0.1128583251824543, 0.05106545312617561, 0.07237334004213378], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/193e2c37-f0de-41b5-b563-c6ae5417fddb", 3, 0, 0.0, 422.0, 195, 870, 201.0, 870.0, 870.0, 870.0, 0.020959673588016658, 0.021021078881731547, 0.013440936513148701], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 21, 0, 0.0, 120.1904761904762, 97, 304, 101.0, 257.60000000000014, 303.09999999999997, 304.0, 0.11771564384851678, 0.08748203610226687, 0.05908773529115003], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 21, 0, 0.0, 138.0952380952381, 98, 302, 100.0, 295.0, 301.3, 302.0, 0.11758842929855702, 0.04828431132376574, 0.06612161863272654], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 563.1666666666666, 485, 709, 501.0, 709.0, 709.0, 709.0, 0.12021157236736656, 35.34619367586953, 0.06855816236576374], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 760.5, 680, 904, 698.0, 904.0, 904.0, 904.0, 0.12024048096192386, 108.19259612975952, 0.06845722695390782], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 269.0, 104, 321, 295.5, 321.0, 321.0, 321.0, 0.12121456999131296, 0.2144929695549405, 0.06711783318854926], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=5272a639-49c7-46c3-b776-30f1ca7753a3", 1, 0, 0.0, 404.0, 404, 404, 404.0, 404.0, 404.0, 404.0, 2.4752475247524752, 0.44718827351485146, 1.7065671410891088], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2085d384-94ac-4278-8ad3-7b2ab81886db", 1, 0, 0.0, 294.0, 294, 294, 294.0, 294.0, 294.0, 294.0, 3.401360544217687, 0.6145036139455783, 2.345078656462585], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 14, 0, 0.0, 145.14285714285714, 99, 320, 102.5, 310.0, 320.0, 320.0, 0.06963857579164137, 0.05175288689203036, 0.03495530073916374], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 14, 0, 0.0, 169.78571428571425, 99, 298, 100.0, 296.5, 298.0, 298.0, 0.06963822939827595, 0.02610462086958252, 0.03929780104855277], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 14, 0, 0.0, 198.92857142857142, 99, 683, 102.0, 493.5, 683.0, 683.0, 0.06963822939827595, 4.493186217910456, 0.04051219539492337], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 14, 0, 0.0, 171.7857142857143, 97, 702, 101.5, 499.5, 702.0, 702.0, 0.06963788300835655, 1.4799896009500597, 0.040579999626939915], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d077d83c-5d39-4c90-9ec1-f61d0dc325c0", 3, 0, 0.0, 260.6666666666667, 194, 379, 209.0, 379.0, 379.0, 379.0, 0.05787260310968787, 0.026185845808094448, 0.03711231384312666], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 167.83333333333334, 100, 303, 103.0, 303.0, 303.0, 303.0, 0.12119743061447097, 0.09006957490001212, 0.06805519785480547], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 13, 0, 0.0, 702.6153846153845, 102, 1003, 872.0, 994.6, 1003.0, 1003.0, 0.09123831447741501, 63.15674863054799, 0.04760677076022571], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 21, 0, 0.0, 194.71428571428572, 98, 908, 101.0, 604.2000000000003, 885.2999999999997, 908.0, 0.1175890877326584, 10.105520020242121, 0.06816711159204426], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 13, 0, 0.0, 526.8461538461539, 98, 707, 681.0, 705.8, 707.0, 707.0, 0.09123511288590698, 20.64117668732323, 0.0476941970081901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 21, 0, 0.0, 184.38095238095238, 97, 699, 100.0, 446.0000000000001, 677.3999999999996, 699.0, 0.11771894322022972, 3.3252097919738106, 0.06835734951595092], "isController": false}, {"data": ["deleteBooks", 13, 0, 0.0, 441.92307692307696, 207, 741, 404.0, 710.1999999999999, 741.0, 741.0, 0.12248666779731283, 0.022128939006350462, 0.0844488158836942], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 14, 0, 0.0, 374.9285714285714, 202, 802, 302.5, 711.0, 802.0, 802.0, 0.06960291536782656, 6.047971906212558, 0.1552665480931287], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/5272a639-49c7-46c3-b776-30f1ca7753a3", 3, 0, 0.0, 549.0, 191, 979, 477.0, 979.0, 979.0, 979.0, 0.028294145941204767, 0.028377038946891888, 0.018144357911514773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eb5889fc-5fad-4bc9-b4de-f815b9b2d8b3", 1, 0, 0.0, 279.0, 279, 279, 279.0, 279.0, 279.0, 279.0, 3.5842293906810037, 1.144573252688172, 2.1386368727598564], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 23, 0, 0.0, 383.8260869565217, 132, 1377, 336.0, 761.6000000000004, 1275.1999999999985, 1377.0, 0.11180734136725794, 0.06867853292969263, 0.050553514700234795], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 13, 0, 0.0, 117.46153846153847, 98, 306, 102.0, 226.79999999999993, 306.0, 306.0, 0.09135949963104818, 0.06789509689377701, 0.04585818633824098], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 13, 0, 0.0, 185.53846153846152, 99, 399, 102.0, 363.0, 399.0, 399.0, 0.09136142580046665, 0.1300006105402974, 0.04620230757878166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=193e2c37-f0de-41b5-b563-c6ae5417fddb", 1, 0, 0.0, 391.0, 391, 391, 391.0, 391.0, 391.0, 391.0, 2.557544757033248, 0.46205642583120204, 1.7633072250639386], "isController": false}, {"data": ["login", 23, 0, 0.0, 2199.869565217391, 1320, 3298, 2046.0, 3174.4, 3284.0, 3298.0, 0.11010527021269466, 34.513439425346235, 0.21375438476286676], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 21, 0, 0.0, 135.04761904761904, 100, 335, 105.0, 306.2, 332.29999999999995, 335.0, 0.1169082771060191, 0.09464547043055649, 0.04155723912753023], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7fd363b6-8167-4693-ab07-4fc9c5dcb0cc", 3, 0, 0.0, 527.3333333333334, 214, 967, 401.0, 967.0, 967.0, 967.0, 0.032222723464587225, 0.03231712597473738, 0.020663660555090117], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=abb1f279-fdb5-42dc-bc47-127a04b97d9a", 1, 0, 0.0, 598.0, 598, 598, 598.0, 598.0, 598.0, 598.0, 1.6722408026755853, 0.3021138168896321, 1.1529316471571907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3433ab79-bb7e-42ca-8b41-e6d774d04544", 1, 0, 0.0, 177.0, 177, 177, 177.0, 177.0, 177.0, 177.0, 5.649717514124294, 1.804157838983051, 3.3710716807909606], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 13, 0, 0.0, 822.8461538461539, 204, 1102, 973.0, 1095.6, 1102.0, 1102.0, 0.09116921005385996, 83.93266085448342, 0.18709823087901142], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=de2fdbdf-7c74-453c-915d-cb3bb03575fb", 1, 0, 0.0, 529.0, 529, 529, 529.0, 529.0, 529.0, 529.0, 1.890359168241966, 0.34151996691871456, 1.303314035916824], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=846a387a-81a3-4cb1-b5e5-b006cd08ffd8", 1, 0, 0.0, 384.0, 384, 384, 384.0, 384.0, 384.0, 384.0, 2.6041666666666665, 0.4704793294270833, 1.7954508463541665], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=4026851e-d8ae-4329-a3dd-6ed2fab2f302", 1, 0, 0.0, 463.0, 463, 463, 463.0, 463.0, 463.0, 463.0, 2.1598272138228944, 0.3902031587473002, 1.4890996220302375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 337.8571428571429, 200, 602, 396.0, 552.5, 602.0, 602.0, 0.07277225921478732, 0.11278278845104246, 0.16366651657388204], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 6, 0, 0.0, 932.8333333333334, 795, 1207, 901.0, 1207.0, 1207.0, 1207.0, 0.11948620930000996, 142.94704645026385, 0.2694273996813701], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e2fa99a-6b79-4171-b8ec-ba9e07816b41", 3, 0, 0.0, 265.3333333333333, 196, 349, 251.0, 349.0, 349.0, 349.0, 0.04224340650830083, 0.027653479976625317, 0.02708968451215906], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a773a2ae-6ade-4c0c-a2db-680a92704817", 3, 0, 0.0, 843.0, 180, 2065, 284.0, 2065.0, 2065.0, 2065.0, 0.018445760242008374, 0.025428969604461414, 0.011828824113527505], "isController": false}, {"data": ["register", 23, 6, 26.08695652173913, 1006.0434782608693, 119, 2264, 1020.0, 1896.6000000000008, 2229.3999999999996, 2264.0, 0.1149419543130719, 0.03621218159829286, 0.051858577043592986], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 121.78571428571429, 101, 303, 107.5, 214.5, 303.0, 303.0, 0.06038907820385627, 0.046884098800845445, 0.021466430142777035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 21, 0, 0.0, 354.76190476190476, 200, 1006, 206.0, 760.2000000000002, 985.3999999999996, 1006.0, 0.11752065005708145, 13.554840740282161, 0.26144300493306916], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 404.8666666666666, 199, 984, 398.0, 978.0, 984.0, 984.0, 0.1083932507135889, 17.435724778245476, 0.24008117073743543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 101.91666666666667, 99, 107, 101.5, 106.10000000000001, 107.0, 107.0, 0.05618450993061213, 0.041754308649605304, 0.028201990336264294], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 100.41666666666667, 99, 103, 100.0, 103.0, 103.0, 103.0, 0.05618687755474709, 0.01503437934570381, 0.0320440786054417], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 99.99999999999999, 99, 102, 100.0, 101.7, 102.0, 102.0, 0.05618687755474709, 0.015144119340927926, 0.03303173856245874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 100.25, 98, 104, 100.5, 103.4, 104.0, 104.0, 0.056187140636413016, 0.015144190249658195, 0.03308676348023149], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 940.3818181818181, 784, 1450, 805.0, 1285.2, 1335.9999999999995, 1450.0, 0.23755431355441722, 284.1975462529046, 0.46907697461624176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=110668a9-12a4-4f36-bd88-9abfe916577d", 1, 0, 0.0, 207.0, 207, 207, 207.0, 207.0, 207.0, 207.0, 4.830917874396135, 0.8727732487922706, 3.330691425120773], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, 26.08695652173913, 1006.0434782608693, 119, 2264, 1020.0, 1896.6000000000008, 2229.3999999999996, 2264.0, 0.11052378664103797, 0.03482024867851995, 0.04986522405093705], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 13, 0, 0.0, 155.3846153846154, 99, 411, 102.0, 367.4, 411.0, 411.0, 0.07171147714610386, 0.019328484074535805, 0.0422285358584967], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 13, 0, 0.0, 116.46153846153847, 98, 303, 101.0, 224.59999999999994, 303.0, 303.0, 0.07163165898922219, 0.019306970586938792, 0.0421115807729607], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 225.35714285714283, 98, 877, 102.0, 776.0, 877.0, 877.0, 0.06157743802670701, 7.929581320154296, 0.035444825515930964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 170.42857142857142, 99, 498, 100.0, 493.0, 498.0, 498.0, 0.06157635467980295, 2.60072475919247, 0.03550433508532723], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 101.57142857142856, 98, 105, 102.0, 105.0, 105.0, 105.0, 0.061575542194640294, 0.045760730088009044, 0.03090803582816905], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 13, 0, 0.0, 130.92307692307693, 98, 303, 100.0, 299.8, 303.0, 303.0, 0.07171147714610386, 0.01918842259573482, 0.04089795180988735], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 128.42857142857142, 99, 302, 101.0, 297.5, 302.0, 302.0, 0.06157716718640728, 0.029688991322017796, 0.034379439603794915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 13, 0, 0.0, 133.46153846153848, 100, 304, 102.0, 303.6, 304.0, 304.0, 0.07171108156859717, 0.053293098704787545, 0.03599560149048725], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 13, 0, 0.0, 122.53846153846155, 102, 300, 105.0, 227.19999999999993, 300.0, 300.0, 0.0715154115711936, 0.056290450904669956, 0.025421493956947722], "isController": false}, {"data": ["deleteAccount", 13, 0, 0.0, 947.0, 349, 2084, 600.0, 2076.4, 2084.0, 2084.0, 0.1195006710422297, 0.021589476701965326, 0.08133981222308018], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 23, 0, 0.0, 1287.7391304347827, 865, 2014, 1226.0, 1897.8000000000002, 2000.6, 2014.0, 0.10968572654871477, 0.05677093268634651, 0.05045114961371548], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9741b67a-6601-4e7b-9c2c-4497af8a95c6", 3, 0, 0.0, 904.0, 370, 1881, 461.0, 1881.0, 1881.0, 1881.0, 0.07531632858003616, 0.03407867731974292, 0.04829855706467162], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 13, 0, 0.0, 305.8461538461538, 203, 715, 206.0, 672.1999999999999, 715.0, 715.0, 0.0715914222462084, 0.11095272178196557, 0.1610107865556816], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2085d384-94ac-4278-8ad3-7b2ab81886db", 3, 0, 0.0, 862.6666666666666, 178, 2084, 326.0, 2084.0, 2084.0, 2084.0, 0.11729746637472631, 0.05437226305911792, 0.07522005493431341], "isController": false}, {"data": ["addBook", 61, 11, 18.0327868852459, 909.4590163934427, 514, 1628, 809.0, 1516.8, 1549.3, 1628.0, 0.2827346465816918, 95.41300333140208, 1.025329519119351], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/16c59ee2-68f9-44e7-924f-41cc246a7eca", 1, 0, 0.0, 212.0, 212, 212, 212.0, 212.0, 212.0, 212.0, 4.716981132075471, 1.5063015919811322, 2.8145268278301887], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 179.00000000000006, 99, 425, 103.0, 403.4, 414.0, 425.0, 0.2382643955015682, 0.17706953611005216, 0.1151766364973401], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 563.4727272727272, 486, 830, 500.0, 711.0, 792.9999999999999, 830.0, 0.23823756183347627, 70.04975341058729, 0.11981674252367215], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 149.27272727272728, 98, 304, 104.0, 299.4, 300.0, 304.0, 0.23863656085666185, 0.4222748518283899, 0.11605567119786876], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 758.9636363636364, 681, 1006, 695.0, 898.8, 986.4, 1006.0, 0.23802929058615796, 214.17917408028728, 0.11947954625125506], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 103.73333333333333, 100, 113, 102.0, 110.0, 113.0, 113.0, 0.11187684596795847, 0.08357987027879711, 0.039768722590172736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, 6.214689265536723, 143.27118644067795, 99, 465, 106.0, 231.80000000000024, 300.4, 444.71999999999997, 0.7334385838419751, 1.6032233874710458, 0.35335336433872433], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 124.33333333333331, 100, 331, 105.5, 265.60000000000025, 331.0, 331.0, 0.053507649364373716, 0.04143707611909019, 0.01902029723499222], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 120.71428571428571, 100, 307, 104.5, 217.0, 307.0, 307.0, 0.07039031429275332, 0.05712338982156056, 0.025021557033752157], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a773a2ae-6ade-4c0c-a2db-680a92704817", 1, 0, 0.0, 741.0, 741, 741, 741.0, 741.0, 741.0, 741.0, 1.3495276653171389, 0.24381115047233468, 0.9304360661268556], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d077d83c-5d39-4c90-9ec1-f61d0dc325c0", 1, 0, 0.0, 210.0, 210, 210, 210.0, 210.0, 210.0, 210.0, 4.761904761904763, 0.8603050595238095, 3.283110119047619], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/26a900be-054d-4462-9534-45f1f179d8d3", 1, 0, 0.0, 196.0, 196, 196, 196.0, 196.0, 196.0, 196.0, 5.1020408163265305, 1.6292649872448979, 3.044284119897959], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 203.74999999999997, 199, 212, 203.5, 210.20000000000002, 212.0, 212.0, 0.0561584792283825, 0.08703467435101857, 0.12630173599898914], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 342.85714285714283, 202, 979, 207.5, 877.5, 979.0, 979.0, 0.06154738929163352, 10.600627645988208, 0.13617188152567186], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=9741b67a-6601-4e7b-9c2c-4497af8a95c6", 1, 0, 0.0, 310.0, 310, 310, 310.0, 310.0, 310.0, 310.0, 3.225806451612903, 0.5827872983870968, 2.2240423387096775], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/abb1f279-fdb5-42dc-bc47-127a04b97d9a", 3, 0, 0.0, 637.0, 212, 1409, 290.0, 1409.0, 1409.0, 1409.0, 0.02199445739673602, 0.025996704038915526, 0.014104518577985016], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7fd363b6-8167-4693-ab07-4fc9c5dcb0cc", 1, 0, 0.0, 664.0, 664, 664, 664.0, 664.0, 664.0, 664.0, 1.5060240963855422, 0.2720844314759036, 1.0383330195783131], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4026851e-d8ae-4329-a3dd-6ed2fab2f302", 3, 0, 0.0, 707.3333333333334, 189, 1504, 429.0, 1504.0, 1504.0, 1504.0, 0.026102163869384774, 0.026178635052595857, 0.01673869232509375], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 14, 0, 0.0, 105.14285714285712, 101, 115, 104.0, 113.5, 115.0, 115.0, 0.07076604240907827, 0.05867223633330806, 0.025155116637602042], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e2fa99a-6b79-4171-b8ec-ba9e07816b41", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 13, 0, 0.0, 106.07692307692308, 102, 113, 105.0, 112.6, 113.0, 113.0, 0.0862160441426146, 0.06693530770837755, 0.030647109441320035], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/de2fdbdf-7c74-453c-915d-cb3bb03575fb", 3, 0, 0.0, 299.3333333333333, 195, 405, 298.0, 405.0, 405.0, 405.0, 0.031870478375880425, 0.02656910648458, 0.020437774218907693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 100.93333333333332, 98, 105, 101.0, 103.8, 105.0, 105.0, 0.10862716982771731, 0.08072780882704382, 0.05452574735492842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 152.86666666666665, 98, 303, 100.0, 300.0, 303.0, 303.0, 0.10847320350296133, 0.05074794533673699, 0.0606489499793901], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 249.53333333333333, 99, 884, 101.0, 876.8, 884.0, 884.0, 0.1086295298513948, 13.058047433989456, 0.06261756883491208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 255.79999999999998, 97, 683, 294.0, 563.6, 683.0, 683.0, 0.10847320350296133, 4.2779684596081955, 0.06263338814243255], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 35.294117647058826, 0.45592705167173253], "isController": false}, {"data": ["401/Unauthorized", 11, 64.70588235294117, 0.8358662613981763], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1316, 17, "401/Unauthorized", 11, "406/Not Acceptable", 6, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 177, 11, "401/Unauthorized", 11, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
