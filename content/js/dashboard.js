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

    var data = {"OkPercent": 98.30899308224443, "KoPercent": 1.6910069177555727};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7691292875989446, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.22727272727272727, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/19b14cde-fd3b-430c-8d5c-59b4145c0b8d"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5333333333333333, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.8, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5833333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ee31e649-46aa-4a6c-9c7b-24fabb171a00"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.95, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/e23b64f9-db3e-4a14-984f-e04d3b7d233e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b40d0b7-87af-4637-8fa7-fe460533b500"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=eaaa3c06-6736-4b3c-9487-1b759baf7329"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.022727272727272728, 500, 1500, "login"], "isController": true}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/23d8a7d2-9ed8-4722-b62e-c85e7365dbfd"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=3e489f4e-c59c-4410-a0dc-59ac138cd52d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ea27a915-3878-4d1a-a19f-44fbbc3b91af"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=507f4738-cc09-437f-a607-28acb51924d8"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=03a8d699-e7a4-4880-92cd-1e95fbfa96dc"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.3, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "register"], "isController": true}, {"data": [0.9333333333333333, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9523809523809523, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/aec749cf-ddca-4b9a-bd12-7a85bd9ebb60"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/8b40d0b7-87af-4637-8fa7-fe460533b500"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4909090909090909, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.29545454545454547, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b2c8b454-6ef5-45de-a933-33994fdda93d"], "isController": false}, {"data": [0.22727272727272727, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.2542372881355932, 500, 1500, "addBook"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e23b64f9-db3e-4a14-984f-e04d3b7d233e"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.6727272727272727, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/f42bdb63-3110-481a-97ba-575983827d30"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=ee31e649-46aa-4a6c-9c7b-24fabb171a00"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8526011560693642, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/eaaa3c06-6736-4b3c-9487-1b759baf7329"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e69e309c-2671-4062-bded-ae51d5f0396e"], "isController": false}, {"data": [0.9736842105263158, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/ea27a915-3878-4d1a-a19f-44fbbc3b91af"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=23d8a7d2-9ed8-4722-b62e-c85e7365dbfd"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/507f4738-cc09-437f-a607-28acb51924d8"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b2c8b454-6ef5-45de-a933-33994fdda93d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/e14b9b50-1828-4fab-a4a4-2c8bf9489651"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4ac4ff7e-ef76-4474-bc19-a41e7864ddf4"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/03a8d699-e7a4-4880-92cd-1e95fbfa96dc"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=aec749cf-ddca-4b9a-bd12-7a85bd9ebb60"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/3e489f4e-c59c-4410-a0dc-59ac138cd52d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=19b14cde-fd3b-430c-8d5c-59b4145c0b8d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9761904761904762, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1301, 22, 1.6910069177555727, 367.0338201383555, 81, 4104, 107.0, 985.9999999999998, 1225.199999999999, 2019.7800000000002, 5.071017633577075, 702.7551976956298, 3.708513565264504], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1685.8000000000004, 1063, 4191, 1569.0, 2482.7999999999997, 3381.5999999999995, 4191.0, 0.25677177191196926, 308.98217201491144, 1.262544796461685], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/19b14cde-fd3b-430c-8d5c-59b4145c0b8d", 3, 0, 0.0, 352.6666666666667, 225, 562, 271.0, 562.0, 562.0, 562.0, 0.022022551092318536, 0.026029909836005404, 0.014122534391883957], "isController": false}, {"data": ["deleteBook", 15, 2, 13.333333333333334, 779.4666666666667, 90, 2183, 545.0, 1885.4, 2183.0, 2183.0, 0.08081417588397238, 0.015831370783520374, 0.054412773892711104], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, 13.333333333333334, 779.4666666666667, 90, 2183, 545.0, 1885.4, 2183.0, 2183.0, 0.08050751940231217, 0.015771297257913888, 0.05420629984757243], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 19, 0, 0.0, 150.52631578947367, 83, 264, 89.0, 264.0, 264.0, 264.0, 0.08791534215263029, 0.023524222411934276, 0.050139218571421965], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 19, 0, 0.0, 124.8421052631579, 85, 283, 89.0, 255.0, 283.0, 283.0, 0.08791290144963748, 0.06533370898747473, 0.044128155610462565], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 19, 0, 0.0, 131.6842105263158, 84, 261, 88.0, 261.0, 261.0, 261.0, 0.08791290144963748, 0.023695274218847602, 0.051769023021612695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 19, 0, 0.0, 149.8947368421053, 86, 264, 89.0, 262.0, 264.0, 264.0, 0.08791452856990825, 0.02369571277860808, 0.05168412714754372], "isController": false}, {"data": ["goToProfile", 15, 2, 13.333333333333334, 310.1333333333334, 81, 1200, 225.0, 856.8000000000002, 1200.0, 1200.0, 0.08032257546305964, 0.16638696003148642, 0.05191683132794636], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 99.59999999999998, 83, 273, 86.0, 169.20000000000005, 273.0, 273.0, 0.08782407082133072, 0.06526769325686785, 0.04408356679898827], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 97.13333333333333, 81, 259, 85.0, 157.60000000000008, 259.0, 259.0, 0.08782612768747951, 0.03229439903508361, 0.04959660361726544], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 6, 0, 0.0, 665.6666666666666, 499, 826, 668.5, 826.0, 826.0, 826.0, 0.1041919911089501, 30.635904885736117, 0.0594219949293231], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 6, 0, 0.0, 872.5, 696, 1118, 851.5, 1118.0, 1118.0, 1118.0, 0.10370933729733467, 93.31784400171121, 0.05904545277768175], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 6, 0, 0.0, 85.66666666666666, 81, 92, 85.5, 92.0, 92.0, 92.0, 0.10530380146723298, 0.18633836744006457, 0.05830786663273544], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 10, 0, 0.0, 105.09999999999998, 85, 260, 88.0, 243.40000000000006, 260.0, 260.0, 0.07785857767950295, 0.05786169688877124, 0.039081356374281756], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ee31e649-46aa-4a6c-9c7b-24fabb171a00", 3, 0, 0.0, 1344.6666666666667, 284, 3275, 475.0, 3275.0, 3275.0, 3275.0, 0.06295114990767164, 0.029180480946785294, 0.040369064231156625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 10, 0, 0.0, 137.60000000000002, 85, 263, 88.0, 262.0, 263.0, 263.0, 0.07785857767950295, 0.03252724563602672, 0.04374982968436133], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 10, 0, 0.0, 188.0, 84, 760, 86.5, 710.4000000000002, 760.0, 760.0, 0.07786039630941721, 7.024779375267645, 0.04510428426830693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 10, 0, 0.0, 161.9, 85, 666, 88.0, 624.7000000000002, 666.0, 666.0, 0.07785857767950295, 2.308187486374749, 0.04517926450894595], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e23b64f9-db3e-4a14-984f-e04d3b7d233e", 3, 0, 0.0, 400.0, 269, 640, 291.0, 640.0, 640.0, 640.0, 0.026261883502284786, 0.026338822614107884, 0.016841116699056323], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 6, 0, 0.0, 86.16666666666667, 81, 92, 85.5, 92.0, 92.0, 92.0, 0.10528901835538552, 0.07824701461762539, 0.05912225151791668], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 14, 0, 0.0, 698.5714285714286, 84, 1195, 875.5, 1103.0, 1195.0, 1195.0, 0.20145913976947316, 129.49643421819465, 0.10606958614536717], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 157.60000000000002, 82, 987, 87.0, 549.0000000000002, 987.0, 987.0, 0.08782561346191003, 5.290469722485699, 0.051128687212005176], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b40d0b7-87af-4637-8fa7-fe460533b500", 1, 0, 0.0, 490.0, 490, 490, 490.0, 490.0, 490.0, 490.0, 2.0408163265306123, 0.3687021683673469, 1.407047193877551], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 14, 0, 0.0, 490.7857142857143, 84, 777, 595.5, 758.5, 777.0, 777.0, 0.20145913976947316, 42.32671141337977, 0.10626632358654829], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 150.99999999999997, 84, 710, 87.0, 442.40000000000015, 710.0, 710.0, 0.08782509924236213, 1.7436598511950068, 0.05121415455168214], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 713.2857142857143, 94, 3125, 445.0, 2772.0, 3125.0, 3125.0, 0.0758902193769413, 0.014949356830390781, 0.051549871393181804], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=eaaa3c06-6736-4b3c-9487-1b759baf7329", 1, 0, 0.0, 3125.0, 3125, 3125, 3125.0, 3125.0, 3125.0, 3125.0, 0.32, 0.0578125, 0.220625], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 10, 0, 0.0, 312.29999999999995, 173, 848, 180.0, 815.6000000000001, 848.0, 848.0, 0.07780587434351294, 9.416813059229721, 0.17299649873565454], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 22, 0, 0.0, 893.1363636363637, 93, 2009, 872.5, 1875.1, 1990.8499999999997, 2009.0, 0.09432223046350802, 0.057938166954635294, 0.04264764912559005], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 14, 0, 0.0, 88.85714285714286, 85, 94, 89.0, 93.5, 94.0, 94.0, 0.20143305228626515, 0.14969780545883574, 0.1011099500733792], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 14, 0, 0.0, 175.28571428571428, 85, 268, 173.5, 265.5, 268.0, 268.0, 0.20145624082654617, 0.27003230494718966, 0.10280788629234179], "isController": false}, {"data": ["login", 22, 0, 0.0, 3208.2272727272725, 1465, 6773, 2904.5, 5090.299999999999, 6588.049999999997, 6773.0, 0.0942999939990913, 30.896517343161964, 0.1849247662860376], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/23d8a7d2-9ed8-4722-b62e-c85e7365dbfd", 3, 0, 0.0, 743.3333333333334, 447, 1200, 583.0, 1200.0, 1200.0, 1200.0, 0.06365102265976406, 0.028800430174828143, 0.04081787585928881], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 176.20000000000002, 88, 909, 93.0, 575.4000000000002, 909.0, 909.0, 0.08882993213393185, 0.071914075917021, 0.03157626493823359], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=3e489f4e-c59c-4410-a0dc-59ac138cd52d", 1, 0, 0.0, 2419.0, 2419, 2419, 2419.0, 2419.0, 2419.0, 2419.0, 0.41339396444811904, 0.07468543303017776, 0.2850157606448946], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ea27a915-3878-4d1a-a19f-44fbbc3b91af", 1, 0, 0.0, 431.0, 431, 431, 431.0, 431.0, 431.0, 431.0, 2.320185614849188, 0.41917415893271465, 1.599659222737819], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=507f4738-cc09-437f-a607-28acb51924d8", 1, 0, 0.0, 601.0, 601, 601, 601.0, 601.0, 601.0, 601.0, 1.663893510815308, 0.3006057612312812, 1.1471765806988352], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 14, 0, 0.0, 790.3571428571429, 176, 1287, 964.5, 1195.5, 1287.0, 1287.0, 0.2011812211700125, 172.00528504864275, 0.41569406623173205], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=03a8d699-e7a4-4880-92cd-1e95fbfa96dc", 1, 0, 0.0, 466.0, 466, 466, 466.0, 466.0, 466.0, 466.0, 2.1459227467811157, 0.3876911212446352, 1.4795131437768239], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 19, 0, 0.0, 322.0526315789474, 174, 548, 350.0, 511.0, 548.0, 548.0, 0.08787630716006901, 0.13619111275686477, 0.19763587440394426], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, 40.0, 622.8000000000001, 81, 1208, 876.5, 1191.1000000000001, 1208.0, 1208.0, 0.1603103608586223, 115.08931290979336, 0.259377154170474], "isController": false}, {"data": ["register", 22, 6, 27.272727272727273, 1057.590909090909, 159, 1751, 1101.5, 1686.3, 1747.55, 1751.0, 0.09804140020945208, 0.03084683259430914, 0.044233522360123886], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 282.8666666666667, 171, 1088, 176.0, 758.0000000000002, 1088.0, 1088.0, 0.08777935780621829, 7.127946734754188, 0.19592055492647015], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 18, 0, 0.0, 278.2777777777777, 87, 1585, 92.5, 1359.1000000000004, 1585.0, 1585.0, 0.1038943048605219, 0.08066012926183097, 0.036931178680888646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 21, 0, 0.0, 304.85714285714283, 174, 1043, 194.0, 500.80000000000007, 990.1999999999992, 1043.0, 0.12219461529061953, 7.141657017171253, 0.2733297614441076], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aec749cf-ddca-4b9a-bd12-7a85bd9ebb60", 3, 0, 0.0, 440.0, 287, 558, 475.0, 558.0, 558.0, 558.0, 0.025925989940715904, 0.030643642407141746, 0.016625716205472114], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 8, 0, 0.0, 110.875, 86, 254, 90.5, 254.0, 254.0, 254.0, 0.04135563780732408, 0.03073402380016956, 0.020758591633754472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 8, 0, 0.0, 113.25, 84, 263, 89.5, 263.0, 263.0, 263.0, 0.04135542402233193, 0.011065806818475537, 0.023585515262736178], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 8, 0, 0.0, 147.75, 83, 251, 90.0, 251.0, 251.0, 251.0, 0.04135670676544027, 0.011146924870372573, 0.02431322018827641], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b40d0b7-87af-4637-8fa7-fe460533b500", 3, 0, 0.0, 826.6666666666666, 187, 1280, 1013.0, 1280.0, 1280.0, 1280.0, 0.020932910023375082, 0.028857706363604647, 0.013423773680354464], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 8, 0, 0.0, 129.125, 84, 251, 91.0, 251.0, 251.0, 251.0, 0.04135563780732408, 0.01114663675275532, 0.024352978122867602], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 100.5, 94, 107, 100.5, 107.0, 107.0, 107.0, 0.07881152224455215, 0.02324324191196753, 0.04871845076250148], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1003.1272727272727, 652, 1621, 930.0, 1366.0, 1460.8, 1621.0, 0.25076368941777233, 300.0005521075548, 0.49516033203392146], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, 27.272727272727273, 1057.590909090909, 159, 1751, 1101.5, 1686.3, 1747.55, 1751.0, 0.09465174610959812, 0.029780343413744293, 0.042704205764291334], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 9, 0, 0.0, 105.77777777777777, 84, 262, 87.0, 262.0, 262.0, 262.0, 0.04151674508718517, 0.011190060199280377, 0.02444784891364517], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 9, 0, 0.0, 104.77777777777777, 84, 245, 88.0, 245.0, 245.0, 245.0, 0.041550095565219804, 0.01119904919531315, 0.024426911650646796], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 18, 0, 0.0, 159.11111111111114, 84, 1036, 87.5, 334.9000000000011, 1036.0, 1036.0, 0.1012493039110356, 5.087123839500166, 0.05904012144291508], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 18, 0, 0.0, 148.77777777777777, 83, 504, 88.0, 288.9000000000003, 504.0, 504.0, 0.10125158205596962, 1.6797369392490507, 0.059140328364505695], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 9, 0, 0.0, 104.11111111111111, 83, 254, 85.0, 254.0, 254.0, 254.0, 0.041550862872918995, 0.011118101979667777, 0.023696976482211612], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 18, 0, 0.0, 88.66666666666666, 84, 97, 88.0, 95.2, 97.0, 97.0, 0.10125272116688136, 0.07524738360155929, 0.05082411980446975], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 9, 0, 0.0, 88.77777777777777, 85, 91, 90.0, 91.0, 91.0, 91.0, 0.041550095565219804, 0.030878537817511983, 0.02085620031301072], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 18, 0, 0.0, 96.38888888888889, 84, 261, 86.0, 108.90000000000023, 261.0, 261.0, 0.10125272116688136, 0.03554172666827921, 0.05727326773469537], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 9, 0, 0.0, 364.3333333333333, 89, 2146, 91.0, 2146.0, 2146.0, 2146.0, 0.04371903235208394, 0.03441166023025357, 0.015540749781404838], "isController": false}, {"data": ["deleteAccount", 13, 2, 15.384615384615385, 629.5384615384614, 82, 1550, 562.0, 1442.0, 1550.0, 1550.0, 0.0783954265314245, 0.015211492392628418, 0.05334917134526552], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b2c8b454-6ef5-45de-a933-33994fdda93d", 1, 0, 0.0, 424.0, 424, 424, 424.0, 424.0, 424.0, 424.0, 2.3584905660377355, 0.4260944870283019, 1.626068691037736], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 22, 0, 0.0, 1646.5, 1048, 4104, 1518.5, 2063.4, 3800.6999999999957, 4104.0, 0.09447736837584815, 0.04889941917890578, 0.043455898930687964], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 9, 0, 0.0, 232.88888888888889, 172, 353, 180.0, 353.0, 353.0, 353.0, 0.04149970719651033, 0.0643164407430292, 0.09333381413433917], "isController": false}, {"data": ["addBook", 59, 8, 13.559322033898304, 1362.1694915254234, 443, 4677, 997.0, 2308.0, 3856.0, 4677.0, 0.27644242032367194, 79.54670910526366, 1.0066611202477673], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e23b64f9-db3e-4a14-984f-e04d3b7d233e", 1, 0, 0.0, 565.0, 565, 565, 565.0, 565.0, 565.0, 565.0, 1.7699115044247788, 0.3197594026548673, 1.2202710176991152], "isController": false}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 152.6727272727273, 84, 456, 89.0, 350.4, 355.4, 456.0, 0.2516978161782204, 0.1870527715933845, 0.12167033106271395], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 558.109090909091, 415, 847, 519.0, 705.4, 810.1999999999998, 847.0, 0.25156887498399105, 73.96960211809558, 0.1265214556804252], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/f42bdb63-3110-481a-97ba-575983827d30", 1, 0, 0.0, 183.0, 183, 183, 183.0, 183.0, 183.0, 183.0, 5.46448087431694, 1.7450051229508197, 3.2605447404371586], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 132.60000000000005, 83, 353, 90.0, 265.4, 296.2, 353.0, 0.25203691653453825, 0.4459871999615071, 0.12257264104902346], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=ee31e649-46aa-4a6c-9c7b-24fabb171a00", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 844.3272727272727, 562, 1377, 835.0, 1021.6, 1130.9999999999995, 1377.0, 0.25120578778135044, 226.03540941833302, 0.1260935301949357], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 21, 0, 0.0, 110.0952380952381, 87, 270, 92.0, 225.4000000000001, 268.5, 270.0, 0.11798481928658512, 0.08814295581468518, 0.04193991623077831], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, 4.624277456647399, 325.02890173410407, 86, 3284, 97.0, 828.3999999999999, 1410.3999999999978, 3140.4399999999982, 0.7240462887396153, 1.5404416669282441, 0.34883392057463325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 8, 0, 0.0, 90.625, 87, 96, 90.0, 96.0, 96.0, 96.0, 0.04430782863947273, 0.034312605577247926, 0.015750048461687573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/eaaa3c06-6736-4b3c-9487-1b759baf7329", 3, 0, 0.0, 562.3333333333334, 218, 841, 628.0, 841.0, 841.0, 841.0, 0.02539252613314148, 0.025466918299547166, 0.016283618646578357], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e69e309c-2671-4062-bded-ae51d5f0396e", 1, 0, 0.0, 233.0, 233, 233, 233.0, 233.0, 233.0, 233.0, 4.291845493562231, 1.3705405042918455, 2.5608570278969958], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 19, 0, 0.0, 162.21052631578948, 85, 1256, 90.0, 262.0, 1256.0, 1256.0, 0.08805591086888011, 0.0714594354805072, 0.03130112456667223], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/ea27a915-3878-4d1a-a19f-44fbbc3b91af", 3, 0, 0.0, 466.3333333333333, 226, 670, 503.0, 670.0, 670.0, 670.0, 0.0451773209848656, 0.02810347018296815, 0.028971133574279044], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=23d8a7d2-9ed8-4722-b62e-c85e7365dbfd", 1, 0, 0.0, 197.0, 197, 197, 197.0, 197.0, 197.0, 197.0, 5.076142131979695, 0.9170764593908629, 3.4997620558375635], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/507f4738-cc09-437f-a607-28acb51924d8", 3, 0, 0.0, 350.33333333333337, 196, 657, 198.0, 657.0, 657.0, 657.0, 0.030017109752558956, 0.025024029321713378, 0.019249253324394904], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 8, 0, 0.0, 267.125, 180, 505, 194.5, 505.0, 505.0, 505.0, 0.041336192419975715, 0.06406302477588033, 0.09296606556953523], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b2c8b454-6ef5-45de-a933-33994fdda93d", 2, 0, 0.0, 215.5, 185, 246, 215.5, 246.0, 246.0, 246.0, 0.010925081255291836, 0.02160477494332614, 0.0067908341982356], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e14b9b50-1828-4fab-a4a4-2c8bf9489651", 1, 0, 0.0, 208.0, 208, 208, 208.0, 208.0, 208.0, 208.0, 4.807692307692308, 1.5352689302884617, 2.86865234375], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 18, 0, 0.0, 269.5555555555555, 171, 1132, 181.0, 430.00000000000114, 1132.0, 1132.0, 0.10119977960936885, 6.874244295916588, 0.22616218108013897], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4ac4ff7e-ef76-4474-bc19-a41e7864ddf4", 2, 0, 0.0, 219.5, 190, 249, 219.5, 249.0, 249.0, 249.0, 0.022367111399398322, 0.0318796866088104, 0.01390299453683304], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/03a8d699-e7a4-4880-92cd-1e95fbfa96dc", 3, 0, 0.0, 363.0, 185, 580, 324.0, 580.0, 580.0, 580.0, 0.02404713237946375, 0.02411758296260671, 0.015420849865736845], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=aec749cf-ddca-4b9a-bd12-7a85bd9ebb60", 1, 0, 0.0, 459.0, 459, 459, 459.0, 459.0, 459.0, 459.0, 2.1786492374727673, 0.3936036220043573, 1.502076525054466], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 10, 0, 0.0, 238.5, 90, 956, 92.0, 928.6000000000001, 956.0, 956.0, 0.0790026702902558, 0.06550123737932342, 0.028082980454739368], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 14, 0, 0.0, 158.07142857142858, 85, 1021, 92.0, 561.5, 1021.0, 1021.0, 0.18826313807756442, 0.14616132301920284, 0.06692166236350922], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/3e489f4e-c59c-4410-a0dc-59ac138cd52d", 3, 0, 0.0, 758.3333333333333, 305, 1550, 420.0, 1550.0, 1550.0, 1550.0, 0.03594622444822545, 0.02996688828512545, 0.02305145252701958], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 21, 0, 0.0, 97.76190476190477, 85, 255, 89.0, 103.80000000000001, 239.99999999999977, 255.0, 0.12225721754216418, 0.090857170458581, 0.06136739239909413], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=19b14cde-fd3b-430c-8d5c-59b4145c0b8d", 1, 0, 0.0, 411.0, 411, 411, 411.0, 411.0, 411.0, 411.0, 2.4330900243309004, 0.43957192822384433, 1.6775015206812653], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 21, 0, 0.0, 135.2380952380952, 85, 263, 88.0, 260.4, 262.9, 263.0, 0.12226006462317703, 0.041458351526795334, 0.06923749381422292], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 21, 0, 0.0, 188.99999999999997, 84, 954, 88.0, 327.6, 892.9999999999991, 954.0, 0.1222593528404923, 5.269915948514258, 0.07137481006136255], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 21, 0, 0.0, 150.8095238095238, 83, 507, 88.0, 326.4000000000001, 490.5999999999998, 507.0, 0.12226077641414965, 1.7432280811171141, 0.0714950364308004], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 6, 27.272727272727273, 0.4611837048424289], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 9.090909090909092, 0.15372790161414296], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 9.090909090909092, 0.15372790161414296], "isController": false}, {"data": ["401/Unauthorized", 12, 54.54545454545455, 0.9223674096848578], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1301, 22, "401/Unauthorized", 12, "406/Not Acceptable", 6, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 15, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 10, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 22, 6, "406/Not Acceptable", 6, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 173, 8, "401/Unauthorized", 8, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
