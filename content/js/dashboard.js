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

    var data = {"OkPercent": 97.81132075471699, "KoPercent": 2.188679245283019};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8134816753926701, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.35714285714285715, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/935f41c5-c3b3-475e-9cd2-3281db9ea078"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6f23909c-57e0-4683-9e6f-4545df7ca3b8"], "isController": false}, {"data": [0.49107142857142855, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.8636363636363636, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.8636363636363636, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6de0fcde-1a7f-46ef-8ca7-ffe96302b168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/808d126c-629f-4fe4-a64e-bae610fb4666"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/28bd5cfd-6a19-4f77-a541-aa1c05a79290"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=808d126c-629f-4fe4-a64e-bae610fb4666"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=935f41c5-c3b3-475e-9cd2-3281db9ea078"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7272727272727273, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.325, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b6a5458c-af98-44bf-9b7b-2a4d9aa4af99"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1431f67a-d62a-4aa4-b9b2-f9bb579c7371"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [0.3064516129032258, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8303571428571429, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.6818181818181818, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.875, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/b422f992-dd30-4892-91de-4d485b7ae699"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b422f992-dd30-4892-91de-4d485b7ae699"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1431f67a-d62a-4aa4-b9b2-f9bb579c7371"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f2189437-9f64-4581-833a-8a6bd6dd4320"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/993aaa5f-b52e-4248-bb83-d18b71b7ff53"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/45d68031-feb0-4c09-b8d3-82313e3cde37"], "isController": false}, {"data": [0.725, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.025, 500, 1500, "login"], "isController": true}, {"data": [0.9545454545454546, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b6a5458c-af98-44bf-9b7b-2a4d9aa4af99"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=993aaa5f-b52e-4248-bb83-d18b71b7ff53"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=28bd5cfd-6a19-4f77-a541-aa1c05a79290"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/6de0fcde-1a7f-46ef-8ca7-ffe96302b168"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=45d68031-feb0-4c09-b8d3-82313e3cde37"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e8fce08b-5b42-42e5-8b10-4895a816abb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6f23909c-57e0-4683-9e6f-4545df7ca3b8"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e8fce08b-5b42-42e5-8b10-4895a816abb4"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1325, 29, 2.188679245283019, 298.9320754716979, 1, 2585, 92.0, 833.0000000000005, 1014.7, 1500.48, 5.191965580207051, 715.9551398255107, 3.8158306642875055], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 1, 1.7857142857142858, 1372.1607142857138, 968, 1829, 1364.0, 1633.3, 1776.9, 1829.0, 0.24423219503685287, 293.9012098148088, 1.1983195748288193], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 22, 0, 0.0, 202.63636363636365, 161, 492, 167.0, 324.2, 467.0999999999997, 492.0, 0.12042125544632495, 0.18662942616534933, 0.2708302258719594], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 14, 0, 0.0, 84.78571428571428, 82, 91, 83.5, 90.0, 91.0, 91.0, 0.139263297158034, 0.1081194543365596, 0.0495037501616449], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 17, 0, 0.0, 289.3529411764706, 161, 972, 168.0, 581.5999999999997, 972.0, 972.0, 0.11403120430367181, 8.191093031016488, 0.2547426185756832], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/935f41c5-c3b3-475e-9cd2-3281db9ea078", 3, 0, 0.0, 661.0, 182, 1417, 384.0, 1417.0, 1417.0, 1417.0, 0.035978988270849825, 0.0299942021359526, 0.023072463181502002], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 11, 0, 0.0, 104.36363636363635, 80, 311, 82.0, 268.60000000000014, 311.0, 311.0, 0.0530268701612981, 0.03940766425073032, 0.026617003186432835], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 11, 0, 0.0, 96.72727272727273, 79, 243, 83.0, 211.2000000000001, 243.0, 243.0, 0.05302763704028654, 0.014189035692420422, 0.03024232424953842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 11, 0, 0.0, 138.63636363636363, 80, 243, 83.0, 242.4, 243.0, 243.0, 0.052988554472233995, 0.014282071322594318, 0.031151474406528188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 11, 0, 0.0, 120.0, 80, 344, 82.0, 323.6000000000001, 344.0, 344.0, 0.05296023649152877, 0.014274438741857364, 0.031186545512101413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6f23909c-57e0-4683-9e6f-4545df7ca3b8", 1, 0, 0.0, 951.0, 951, 951, 951.0, 951.0, 951.0, 951.0, 1.0515247108307044, 0.18997272607781285, 0.7249769978969506], "isController": false}, {"data": ["https://demoqa.com/books", 56, 1, 1.7857142857142858, 926.0178571428571, 632, 1480, 876.5, 1283.6000000000001, 1430.8, 1480.0, 0.24571857325265575, 292.68292818792423, 0.4829914275481236], "isController": false}, {"data": ["deleteBook", 11, 0, 0.0, 486.45454545454544, 409, 632, 462.0, 623.2, 632.0, 632.0, 0.0770383651058227, 0.01391806400837617, 0.05236201378286386], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 11, 0, 0.0, 486.45454545454544, 409, 632, 462.0, 623.2, 632.0, 632.0, 0.07584689958560012, 0.013702809007164085, 0.05155218956208758], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 9, 42.857142857142854, 942.6666666666667, 178, 2088, 792.0, 1583.6000000000001, 2038.9999999999993, 2088.0, 0.08728106998279316, 0.026983098644234045, 0.039378763996143006], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 14, 0, 0.0, 138.14285714285714, 77, 244, 83.5, 243.0, 244.0, 244.0, 0.07668711656441718, 0.02874697017418931, 0.043275584054557406], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 4, 0, 0.0, 121.0, 81, 239, 82.0, 239.0, 239.0, 239.0, 0.021529452290733726, 0.005802860187736824, 0.0126779880188598], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 14, 0, 0.0, 106.0, 79, 243, 83.0, 241.5, 243.0, 243.0, 0.07669047723388404, 0.05699360661619703, 0.038495024705289455], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 4, 0, 0.0, 80.5, 79, 82, 80.5, 82.0, 82.0, 82.0, 0.02154800896397173, 0.005807861791070505, 0.012667872457334943], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6de0fcde-1a7f-46ef-8ca7-ffe96302b168", 1, 0, 0.0, 477.0, 477, 477, 477.0, 477.0, 477.0, 477.0, 2.0964360587002098, 0.3787506551362684, 1.445394392033543], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 14, 0, 0.0, 165.42857142857142, 78, 463, 87.0, 354.5, 463.0, 463.0, 0.0766883767809506, 1.6298312821474938, 0.044688525364680626], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 14, 0, 0.0, 136.42857142857142, 79, 846, 81.0, 469.0, 846.0, 846.0, 0.07668795670417072, 4.948047546875514, 0.04461338999112611], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/808d126c-629f-4fe4-a64e-bae610fb4666", 3, 0, 0.0, 548.6666666666666, 218, 996, 432.0, 996.0, 996.0, 996.0, 0.029164155308848402, 0.02431295629751327, 0.018702274075010208], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 14, 0, 0.0, 104.35714285714286, 79, 243, 82.0, 242.0, 243.0, 243.0, 0.13753401510909394, 0.037069715009872974, 0.08085495810124468], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/28bd5cfd-6a19-4f77-a541-aa1c05a79290", 3, 0, 0.0, 256.0, 174, 392, 202.0, 392.0, 392.0, 392.0, 0.08107450747236711, 0.03763419520038916, 0.05199113923195416], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 14, 0, 0.0, 150.07142857142858, 80, 404, 82.0, 324.5, 404.0, 404.0, 0.13753536623703239, 2.9229910933570418, 0.08014581818806979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 4, 0, 0.0, 120.25, 79, 242, 80.0, 242.0, 242.0, 242.0, 0.021529104658360023, 0.00576071745741274, 0.01227831750047095], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 14, 0, 0.0, 105.78571428571426, 80, 248, 83.0, 246.0, 248.0, 248.0, 0.13753536623703239, 0.10221134151013832, 0.0690363068806979], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 4, 0, 0.0, 143.5, 81, 327, 83.0, 327.0, 327.0, 327.0, 0.02154719644040315, 0.016013102042135543, 0.010815682588249236], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=808d126c-629f-4fe4-a64e-bae610fb4666", 1, 0, 0.0, 657.0, 657, 657, 657.0, 657.0, 657.0, 657.0, 1.5220700152207, 0.2749833523592085, 1.0493959284627092], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=935f41c5-c3b3-475e-9cd2-3281db9ea078", 1, 0, 0.0, 732.0, 732, 732, 732.0, 732.0, 732.0, 732.0, 1.366120218579235, 0.24680882855191258, 0.9418758538251366], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 14, 0, 0.0, 133.14285714285714, 81, 319, 83.0, 282.0, 319.0, 319.0, 0.13753401510909394, 0.036801093886613026, 0.07843736799190514], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 4, 0, 0.0, 94.0, 83, 122, 85.5, 122.0, 122.0, 122.0, 0.022359234643398156, 0.017599163205643472, 0.007948009189645439], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 789.1818181818181, 384, 2076, 470.0, 1929.4000000000005, 2076.0, 2076.0, 0.0789566241018684, 0.014264624471528958, 0.053742936522463154], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 20, 0, 0.0, 1437.45, 767, 2419, 1303.0, 2197.0000000000005, 2408.75, 2419.0, 0.09725308656983501, 0.050336070197277885, 0.04473262087342997], "isController": false}, {"data": ["goToProfile", 11, 0, 0.0, 204.8181818181818, 172, 274, 194.0, 264.6, 274.0, 274.0, 0.07646269663077554, 0.17825230387318317, 0.049431938642161534], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593277574", 4, 0, 0.0, 266.5, 164, 569, 166.5, 569.0, 569.0, 569.0, 0.021519143968452933, 0.03335047019329571, 0.04839705913998741], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 22, 0, 0.0, 89.09090909090911, 79, 242, 82.0, 85.4, 218.59999999999968, 242.0, 0.12047730919406156, 0.0895344065397274, 0.06047396184155043], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 22, 0, 0.0, 103.95454545454544, 78, 249, 81.5, 237.8, 247.49999999999997, 249.0, 0.12047598968287433, 0.03223673942686286, 0.06870896286601427], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b6a5458c-af98-44bf-9b7b-2a4d9aa4af99", 3, 0, 0.0, 289.0, 213, 429, 225.0, 429.0, 429.0, 429.0, 0.016462621617617197, 0.02269505291360965, 0.010557084826401655], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 8, 0, 0.0, 559.0, 385, 645, 633.5, 645.0, 645.0, 645.0, 0.08570449091532396, 25.19996598603017, 0.0488783424751457], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1431f67a-d62a-4aa4-b9b2-f9bb579c7371", 3, 0, 0.0, 397.33333333333337, 213, 705, 274.0, 705.0, 705.0, 705.0, 0.0787918581746553, 0.03565126395272488, 0.05052733092580433], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 8, 0, 0.0, 893.0, 754, 1100, 879.0, 1100.0, 1100.0, 1100.0, 0.08525149190110827, 76.70944226875532, 0.048536738064791134], "isController": false}, {"data": ["addBook", 62, 18, 29.032258064516128, 889.8709677419357, 416, 3084, 660.0, 1498.0, 2351.7499999999986, 3084.0, 0.28141396902630766, 66.27259964097024, 1.0263755384311626], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/-1", 8, 0, 0.0, 163.125, 81, 245, 163.5, 245.0, 245.0, 245.0, 0.08598452278589853, 0.15215230008598452, 0.047610570722269985], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 17, 0, 0.0, 82.88235294117646, 80, 90, 82.0, 86.8, 90.0, 90.0, 0.09502143571799873, 0.07061651619277054, 0.04769630660063608], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 17, 0, 0.0, 82.17647058823529, 79, 87, 82.0, 84.6, 87.0, 87.0, 0.09502143571799873, 0.02542565760423013, 0.05419191255792115], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 17, 0, 0.0, 110.29411764705881, 79, 245, 82.0, 243.4, 245.0, 245.0, 0.0950219668429231, 0.025611389500631614, 0.055862523476015336], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 142.7678571428572, 80, 417, 84.0, 326.0, 336.05, 417.0, 0.2464994871930311, 0.1831895603065397, 0.11915746695366249], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 17, 0, 0.0, 100.88235294117646, 78, 242, 82.0, 242.0, 242.0, 242.0, 0.09502302911058444, 0.025611675814962216, 0.05595594390008049], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 1, 1.7857142857142858, 508.82142857142884, 1, 740, 481.0, 703.5000000000001, 725.9, 740.0, 0.24639753602463974, 71.16360359833901, 0.12170776729732702], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 8, 0, 0.0, 121.0, 80, 244, 83.0, 244.0, 244.0, 244.0, 0.08598175037348323, 0.06389854690841869, 0.04828076803198521], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 19, 0, 0.0, 535.8421052631579, 81, 1035, 775.0, 964.0, 1035.0, 1035.0, 0.08986128255697914, 42.56796757130965, 0.048764156107965966], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 100.48214285714286, 78, 247, 82.5, 235.9, 243.3, 247.0, 0.24680911078203227, 0.4367364343135181, 0.12003021207954306], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 22, 0, 0.0, 88.31818181818183, 78, 243, 81.0, 84.0, 219.14999999999966, 243.0, 0.12047467020059033, 0.03247168845250286, 0.07082592916089393], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 19, 0, 0.0, 407.15789473684214, 79, 730, 479.0, 725.0, 730.0, 730.0, 0.08986213257029348, 13.918025929954831, 0.04885237336533686], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 781.7857142857143, 551, 1108, 787.5, 980.9, 1101.45, 1108.0, 0.24612030888098763, 221.45948656446814, 0.123540858168777], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 22, 0, 0.0, 111.54545454545453, 77, 249, 82.0, 241.5, 248.1, 249.0, 0.12047730919406156, 0.032472399743711904, 0.07094513422267493], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 17, 0, 0.0, 114.64705882352942, 81, 377, 87.0, 278.5999999999999, 377.0, 377.0, 0.11543266880330273, 0.08623631995559237, 0.04103270648867402], "isController": false}, {"data": ["deleteBooks", 11, 0, 0.0, 627.0909090909091, 183, 1383, 572.0, 1296.6000000000004, 1383.0, 1383.0, 0.07580038313648203, 0.013694405156493337, 0.05226081102964484], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 18, 10.0, 174.24444444444435, 80, 2585, 87.0, 250.70000000000002, 392.9, 2029.3399999999983, 0.7479338327869262, 1.5737206306121008, 0.36000808184058203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 11, 0, 0.0, 113.63636363636364, 83, 245, 86.0, 244.2, 245.0, 245.0, 0.05484916479680878, 0.04247596453502867, 0.019497164048865617], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b422f992-dd30-4892-91de-4d485b7ae699", 3, 0, 0.0, 368.66666666666663, 187, 663, 256.0, 663.0, 663.0, 663.0, 0.018756564797679186, 0.02585743877544641, 0.012028135628720052], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b422f992-dd30-4892-91de-4d485b7ae699", 1, 0, 0.0, 572.0, 572, 572, 572.0, 572.0, 572.0, 572.0, 1.7482517482517483, 0.3158462631118881, 1.2053376311188813], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 17, 0, 0.0, 204.8235294117647, 163, 329, 169.0, 329.0, 329.0, 329.0, 0.09497790367005794, 0.14719720031677924, 0.21360753139857755], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 14, 0, 0.0, 88.35714285714286, 81, 129, 84.0, 111.0, 129.0, 129.0, 0.07689476950792841, 0.06240190767684423, 0.027333687598521422], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1431f67a-d62a-4aa4-b9b2-f9bb579c7371", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 0.9872353142076503, 3.7675034153005464], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f2189437-9f64-4581-833a-8a6bd6dd4320", 1, 0, 0.0, 225.0, 225, 225, 225.0, 225.0, 225.0, 225.0, 4.444444444444445, 1.4192708333333333, 2.6519097222222223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/993aaa5f-b52e-4248-bb83-d18b71b7ff53", 3, 0, 0.0, 1169.0, 194, 2076, 1237.0, 2076.0, 2076.0, 2076.0, 0.02532243905733, 0.025396625890505776, 0.01623867348402998], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45d68031-feb0-4c09-b8d3-82313e3cde37", 3, 0, 0.0, 385.3333333333333, 180, 506, 470.0, 506.0, 506.0, 506.0, 0.01947786340823654, 0.026851807139935464, 0.012490687146557938], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 20, 0, 0.0, 514.9, 150, 1008, 518.5, 882.0000000000001, 1001.8999999999999, 1008.0, 0.09584143992179339, 0.05887135323321098, 0.043334557308389005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 19, 0, 0.0, 91.10526315789474, 77, 237, 82.0, 94.0, 237.0, 237.0, 0.08986128255697914, 0.066781675806505, 0.04510615159598367], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 19, 0, 0.0, 155.42105263157896, 79, 330, 87.0, 258.0, 330.0, 330.0, 0.08986213257029348, 0.09508130453803769, 0.04727738430250431], "isController": false}, {"data": ["login", 20, 0, 0.0, 2652.6499999999996, 1157, 3701, 2640.0, 3657.8, 3699.5, 3701.0, 0.09519774952520123, 45.68183008153687, 0.20677620556050055], "isController": true}, {"data": ["https://demoqa.com/books?book=9781593275846", 11, 0, 0.0, 255.18181818181822, 162, 555, 171.0, 528.8000000000001, 555.0, 555.0, 0.05293908155506146, 0.08204523674597904, 0.11906123517705716], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 22, 0, 0.0, 95.81818181818181, 83, 293, 85.0, 97.0, 263.59999999999957, 293.0, 0.11478660127308776, 0.09292782466346655, 0.04080304967129292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 14, 0, 0.0, 274.2142857142857, 164, 488, 167.5, 487.0, 488.0, 488.0, 0.13742466183717142, 3.0965794756267546, 0.30822771879969374], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b6a5458c-af98-44bf-9b7b-2a4d9aa4af99", 1, 0, 0.0, 539.0, 539, 539, 539.0, 539.0, 539.0, 539.0, 1.8552875695732838, 0.3351837894248608, 1.2791338126159555], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=993aaa5f-b52e-4248-bb83-d18b71b7ff53", 1, 0, 0.0, 1383.0, 1383, 1383, 1383.0, 1383.0, 1383.0, 1383.0, 0.7230657989877078, 0.1306320046999277, 0.49851997469269704], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=28bd5cfd-6a19-4f77-a541-aa1c05a79290", 1, 0, 0.0, 215.0, 215, 215, 215.0, 215.0, 215.0, 215.0, 4.651162790697675, 0.8402979651162791, 3.2067587209302326], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 17, 0, 0.0, 106.76470588235294, 81, 245, 85.0, 243.4, 245.0, 245.0, 0.09145242591008612, 0.07582334921646788, 0.032508479522725925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 19, 0, 0.0, 637.2105263157895, 164, 1121, 857.0, 1049.0, 1121.0, 1121.0, 0.08982644585120013, 56.62576319237279, 0.1899254987140635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6de0fcde-1a7f-46ef-8ca7-ffe96302b168", 3, 0, 0.0, 265.6666666666667, 171, 454, 172.0, 454.0, 454.0, 454.0, 0.021563807305817917, 0.025487690210750275, 0.013828352992337659], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=45d68031-feb0-4c09-b8d3-82313e3cde37", 1, 0, 0.0, 403.0, 403, 403, 403.0, 403.0, 403.0, 403.0, 2.4813895781637716, 0.44829792183622824, 1.710801799007444], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e8fce08b-5b42-42e5-8b10-4895a816abb4", 1, 0, 0.0, 786.0, 786, 786, 786.0, 786.0, 786.0, 786.0, 1.272264631043257, 0.22985249681933842, 0.8771668256997455], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 19, 0, 0.0, 87.42105263157896, 80, 104, 85.0, 101.0, 104.0, 104.0, 0.08982559651287579, 0.06973764573021118, 0.03193019251043632], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6f23909c-57e0-4683-9e6f-4545df7ca3b8", 3, 0, 0.0, 589.3333333333333, 208, 1333, 227.0, 1333.0, 1333.0, 1333.0, 0.05085176709890669, 0.03269278646495466, 0.032610019916942116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 14, 0, 0.0, 323.64285714285717, 163, 925, 322.5, 704.0, 925.0, 925.0, 0.07665100796075469, 6.660398350839877, 0.1709890649124536], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 8, 0, 0.0, 1014.75, 836, 1184, 1011.5, 1184.0, 1184.0, 1184.0, 0.08517524807291002, 101.89920840253822, 0.1920602029300285], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e8fce08b-5b42-42e5-8b10-4895a816abb4", 3, 0, 0.0, 602.3333333333333, 192, 1343, 272.0, 1343.0, 1343.0, 1343.0, 0.034949148988222135, 0.029135667499621383, 0.02241205192278568], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 17, 0, 0.0, 102.52941176470588, 79, 244, 82.0, 244.0, 244.0, 244.0, 0.11409395973154363, 0.08479053062080537, 0.057269819630872486], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 17, 0, 0.0, 118.70588235294115, 79, 246, 82.0, 242.8, 246.0, 246.0, 0.11409855430420017, 0.0406109054727036, 0.06450815552975288], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 17, 0, 0.0, 165.11764705882354, 79, 890, 82.0, 369.99999999999955, 890.0, 890.0, 0.11409625697161688, 6.068003099475157, 0.06649934646335161], "isController": false}, {"data": ["register", 21, 9, 42.857142857142854, 942.6666666666667, 178, 2088, 792.0, 1583.6000000000001, 2038.9999999999993, 2088.0, 0.08607580409146989, 0.026610488541670935, 0.03883498192408114], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 17, 0, 0.0, 151.58823529411762, 78, 473, 82.0, 298.59999999999985, 473.0, 473.0, 0.11409778851639317, 2.002387349407698, 0.06661166272358132], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 9, 31.03448275862069, 0.6792452830188679], "isController": false}, {"data": ["Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, 3.4482758620689653, 0.07547169811320754], "isController": false}, {"data": ["401/Unauthorized", 18, 62.06896551724138, 1.3584905660377358], "isController": false}, {"data": ["Assertion failed", 1, 3.4482758620689653, 0.07547169811320754], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1325, 29, "401/Unauthorized", 18, "406/Not Acceptable", 9, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "Assertion failed", 1, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books", 56, 1, "Assertion failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 9, "406/Not Acceptable", 9, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 1, "Non HTTP response code: java.lang.NullPointerException/Non HTTP response message: null", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 180, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
