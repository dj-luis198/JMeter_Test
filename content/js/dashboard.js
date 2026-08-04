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

    var data = {"OkPercent": 99.68479117415288, "KoPercent": 0.31520882584712373};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7355736591989138, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.0, 500, 1500, "see books"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1db92951-54d7-4eae-98d1-0d8ec5ae8b91"], "isController": false}, {"data": [0.5384615384615384, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5384615384615384, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1c8ac6e4-fc4a-4d9e-bc88-e0d007c3c544"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/45fa5183-b422-4ea9-9254-a79e86954aee"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/655df116-9178-441a-9aed-5d53a4a97160"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/441253a3-a5e4-40bc-8fae-d02b127ae3c4"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73f7a99c-653f-419a-810c-158d09aeaec5"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=c9348a32-ef56-4bbb-b4ab-ba7fd158ee54"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.75, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/580ae817-3393-4b5a-8b51-3ba4d1895a38"], "isController": false}, {"data": [0.875, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/73975b3a-3e12-4fc1-a910-3410d372c8e4"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/84c50784-c78b-4c86-85d9-b4c80be74542"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.8888888888888888, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.5294117647058824, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8b908459-82b6-4c95-934c-50ef92cb8bc2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7058823529411765, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9597564f-8606-4d58-afcf-c30c76da1804"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=38da1fa4-ea2b-4a4f-9882-0a0ea9e8edf9"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/63904bac-50cd-4bea-9e9a-5f089cea4995"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/79be859a-52f0-4d3b-97d3-f9cd1ccf90d0"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.47058823529411764, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.8125, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/188b4937-3298-444b-88cd-84111d03d71c"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/25eb1b1d-93e8-46e9-a4dc-e8308e408891"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1db92951-54d7-4eae-98d1-0d8ec5ae8b91"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "register"], "isController": true}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=84c50784-c78b-4c86-85d9-b4c80be74542"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=188b4937-3298-444b-88cd-84111d03d71c"], "isController": false}, {"data": [0.71875, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.25892857142857145, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.23809523809523808, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/1957ac01-dad7-4a17-9e2a-8d99a01873f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [0.5454545454545454, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1c8ac6e4-fc4a-4d9e-bc88-e0d007c3c544"], "isController": false}, {"data": [0.09523809523809523, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=655df116-9178-441a-9aed-5d53a4a97160"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=441253a3-a5e4-40bc-8fae-d02b127ae3c4"], "isController": false}, {"data": [0.30701754385964913, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=63904bac-50cd-4bea-9e9a-5f089cea4995"], "isController": false}, {"data": [0.9107142857142857, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.35714285714285715, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.961764705882353, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8b908459-82b6-4c95-934c-50ef92cb8bc2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/c9348a32-ef56-4bbb-b4ab-ba7fd158ee54"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/38da1fa4-ea2b-4a4f-9882-0a0ea9e8edf9"], "isController": false}, {"data": [0.6176470588235294, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1957ac01-dad7-4a17-9e2a-8d99a01873f1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25eb1b1d-93e8-46e9-a4dc-e8308e408891"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/fb19342d-bc38-46e9-9386-85a5c05bac65"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1269, 4, 0.31520882584712373, 494.25610717100125, 136, 2711, 179.0, 1379.0, 1653.0, 2204.0, 4.922745099560483, 717.9079680450708, 3.582372031417898], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 56, 0, 0.0, 2312.803571428571, 1666, 3101, 2227.5, 2835.4, 3077.0, 3101.0, 0.24971572540188625, 300.49228974827764, 1.22785027089697], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1db92951-54d7-4eae-98d1-0d8ec5ae8b91", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["deleteBook", 13, 0, 0.0, 747.1538461538461, 480, 1710, 647.0, 1573.1999999999998, 1710.0, 1710.0, 0.06081672179156706, 0.010987396026796784, 0.04133636559270573], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 13, 0, 0.0, 747.1538461538461, 480, 1710, 647.0, 1573.1999999999998, 1710.0, 1710.0, 0.06263581130239125, 0.011316040127873418, 0.042572777994594045], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1c8ac6e4-fc4a-4d9e-bc88-e0d007c3c544", 2, 0, 0.0, 337.5, 268, 407, 337.5, 407.0, 407.0, 407.0, 0.03291476721030891, 0.02905756792785083, 0.020459227860704705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/45fa5183-b422-4ea9-9254-a79e86954aee", 1, 0, 0.0, 254.0, 254, 254, 254.0, 254.0, 254.0, 254.0, 3.937007874015748, 1.2572281003937007, 2.349132627952756], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 16, 0, 0.0, 173.6875, 137, 416, 140.0, 413.2, 416.0, 416.0, 0.07710880534364022, 0.027870992751772298, 0.04357136962105842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 16, 0, 0.0, 158.18749999999997, 139, 414, 140.0, 227.80000000000018, 414.0, 414.0, 0.07710806212982106, 0.05730394070390022, 0.038704632748757836], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/655df116-9178-441a-9aed-5d53a4a97160", 3, 0, 0.0, 343.0, 239, 530, 260.0, 530.0, 530.0, 530.0, 0.06424670735624799, 0.029069961987364813, 0.04119987418353143], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 16, 0, 0.0, 253.1875, 137, 1091, 141.0, 618.5000000000005, 1091.0, 1091.0, 0.07709431525792866, 1.4362486478379861, 0.0449842318033324], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 16, 0, 0.0, 262.6875, 137, 1523, 140.0, 748.8000000000009, 1523.0, 1523.0, 0.0770954296865589, 4.3551435977666415, 0.04490959356253162], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/441253a3-a5e4-40bc-8fae-d02b127ae3c4", 3, 0, 0.0, 1061.6666666666667, 348, 2311, 526.0, 2311.0, 2311.0, 2311.0, 0.019571003601064663, 0.023132263696440687, 0.012550415720734825], "isController": false}, {"data": ["goToProfile", 13, 0, 0.0, 378.84615384615375, 230, 1013, 280.0, 824.5999999999999, 1013.0, 1013.0, 0.061179637534178245, 0.12805809947809063, 0.03955167973400976], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/73f7a99c-653f-419a-810c-158d09aeaec5", 1, 0, 0.0, 357.0, 357, 357, 357.0, 357.0, 357.0, 357.0, 2.8011204481792715, 0.8944984243697479, 1.671371673669468], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=c9348a32-ef56-4bbb-b4ab-ba7fd158ee54", 1, 0, 0.0, 502.0, 502, 502, 502.0, 502.0, 502.0, 502.0, 1.9920318725099602, 0.3598885707171315, 1.3734125996015936], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 18, 0, 0.0, 187.11111111111111, 139, 421, 141.0, 417.4, 421.0, 421.0, 0.08390082921986212, 0.062352081090151446, 0.04211428341700111], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 18, 0, 0.0, 185.2222222222222, 137, 418, 140.0, 415.3, 418.0, 418.0, 0.0839016113770585, 0.043452950423470076, 0.04667573367297948], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 2, 0, 0.0, 822.5, 820, 825, 822.5, 825.0, 825.0, 825.0, 0.04668425106790224, 13.726719876986998, 0.026624611937162996], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 2, 0, 0.0, 1234.0, 1228, 1240, 1234.0, 1240.0, 1240.0, 1240.0, 0.046249190639163815, 41.61510303452502, 0.026331326311164555], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 2, 0, 0.0, 417.0, 412, 422, 417.0, 422.0, 422.0, 422.0, 0.04712757434374853, 0.08339371553796125, 0.02609505337197794], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 209.66666666666663, 139, 418, 141.0, 416.8, 418.0, 418.0, 0.07462361713109504, 0.055457590465589186, 0.03745755781775669], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 254.5, 138, 426, 141.0, 422.7, 426.0, 426.0, 0.07462732977195131, 0.047990328764482365, 0.04099401659836193], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 532.8333333333334, 138, 1517, 142.5, 1516.1, 1517.0, 1517.0, 0.074753779737988, 16.831006962613767, 0.04234100805471977], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/580ae817-3393-4b5a-8b51-3ba4d1895a38", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.7392035590277778, 1.3812029803240742], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 403.66666666666663, 137, 1116, 141.0, 1113.6, 1116.0, 1116.0, 0.07475471110418938, 5.5102033367076775, 0.04241453823391995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/73975b3a-3e12-4fc1-a910-3410d372c8e4", 1, 0, 0.0, 270.0, 270, 270, 270.0, 270.0, 270.0, 270.0, 3.7037037037037037, 1.1827256944444444, 2.209924768518518], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/84c50784-c78b-4c86-85d9-b4c80be74542", 3, 0, 0.0, 850.3333333333334, 330, 1208, 1013.0, 1208.0, 1208.0, 1208.0, 0.07526153383005946, 0.03405388412232508, 0.048263418504302456], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 2, 0, 0.0, 139.5, 139, 140, 139.5, 140.0, 140.0, 140.0, 0.04744395682599929, 0.03525864369588424, 0.02664089372553671], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 18, 0, 0.0, 371.22222222222223, 136, 1514, 141.0, 1430.3000000000002, 1514.0, 1514.0, 0.08390122029663742, 12.601255918240591, 0.04812303065191248], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 17, 0, 0.0, 953.4117647058823, 137, 1771, 1233.0, 1668.6, 1771.0, 1771.0, 0.1169799895406127, 61.929924147938394, 0.06285792866284991], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/8b908459-82b6-4c95-934c-50ef92cb8bc2", 3, 0, 0.0, 472.3333333333333, 355, 597, 465.0, 597.0, 597.0, 597.0, 0.03423758602193488, 0.022011468878034304, 0.021955743640368397], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 18, 0, 0.0, 360.1666666666667, 137, 1099, 143.5, 1099.0, 1099.0, 1099.0, 0.08390082921986212, 4.130449839539664, 0.04820474074643771], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 17, 0, 0.0, 696.4705882352941, 139, 1249, 821.0, 1248.2, 1249.0, 1249.0, 0.11697918458627216, 20.245785308790644, 0.06297173361431276], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 578.8333333333333, 244, 1116, 532.0, 1024.5000000000002, 1116.0, 1116.0, 0.05787734825282755, 0.010456356862083101, 0.039903718619625245], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/9597564f-8606-4d58-afcf-c30c76da1804", 1, 0, 0.0, 439.0, 439, 439, 439.0, 439.0, 439.0, 439.0, 2.277904328018223, 0.7274167141230068, 1.359179242596811], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 811.8333333333333, 280, 1932, 558.5, 1899.9, 1932.0, 1932.0, 0.07443291423467457, 22.348427982666436, 0.1626402789063324], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=38da1fa4-ea2b-4a4f-9882-0a0ea9e8edf9", 1, 0, 0.0, 811.0, 811, 811, 811.0, 811.0, 811.0, 811.0, 1.2330456226880395, 0.22276703144266335, 0.8501271578298396], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/63904bac-50cd-4bea-9e9a-5f089cea4995", 3, 0, 0.0, 533.0, 488, 569, 542.0, 569.0, 569.0, 569.0, 0.022571834864456134, 0.026679144659127674, 0.01447477691503209], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 670.2857142857142, 179, 2117, 513.0, 1609.4, 2070.399999999999, 2117.0, 0.088485880181691, 0.05435314319754262, 0.040008752464963805], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 17, 0, 0.0, 158.47058823529414, 139, 420, 142.0, 204.7999999999998, 420.0, 420.0, 0.11719773325795911, 0.08709714356377625, 0.058827768451749], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 17, 0, 0.0, 237.94117647058826, 138, 419, 142.0, 418.2, 419.0, 419.0, 0.11719934919890798, 0.1349058225670794, 0.06105030437360395], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/79be859a-52f0-4d3b-97d3-f9cd1ccf90d0", 2, 0, 0.0, 282.5, 236, 329, 282.5, 329.0, 329.0, 329.0, 0.019299989385005836, 0.02729139123973482, 0.011996526605035368], "isController": false}, {"data": ["login", 21, 0, 0.0, 3024.904761904762, 2023, 4906, 2736.0, 4024.6, 4818.799999999999, 4906.0, 0.0886569735042302, 10.227347087829509, 0.14776574532017833], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 18, 0, 0.0, 143.22222222222223, 140, 151, 143.0, 146.5, 151.0, 151.0, 0.08126190712666925, 0.06578722754688361, 0.028886068548933212], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 17, 0, 0.0, 1113.2941176470586, 281, 1923, 1377.0, 1813.3999999999999, 1923.0, 1923.0, 0.11686499343493713, 82.31643737282339, 0.24524328327043246], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 16, 0, 0.0, 457.0, 279, 1664, 287.0, 1078.1000000000006, 1664.0, 1664.0, 0.0770412315040856, 5.87244247939147, 0.17203555272268525], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 2, 0, 0.0, 1373.5, 1368, 1379, 1373.5, 1379.0, 1379.0, 1379.0, 0.04610100730700966, 55.152832042505125, 0.10395236901551298], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/188b4937-3298-444b-88cd-84111d03d71c", 3, 0, 0.0, 370.3333333333333, 242, 531, 338.0, 531.0, 531.0, 531.0, 0.09050046758574919, 0.04094910479954146, 0.05803578162237171], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25eb1b1d-93e8-46e9-a4dc-e8308e408891", 3, 0, 0.0, 738.3333333333333, 230, 1604, 381.0, 1604.0, 1604.0, 1604.0, 0.034071937216777023, 0.028404372139376934, 0.02184951703028995], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1db92951-54d7-4eae-98d1-0d8ec5ae8b91", 3, 0, 0.0, 448.6666666666667, 360, 510, 476.0, 510.0, 510.0, 510.0, 0.023555276381909546, 0.023624285980684674, 0.015105434398555277], "isController": false}, {"data": ["register", 21, 2, 9.523809523809524, 1457.952380952381, 164, 2204, 1488.0, 2147.6, 2200.0, 2204.0, 0.09067318362183237, 0.02909435300365715, 0.040909190266881404], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=84c50784-c78b-4c86-85d9-b4c80be74542", 1, 0, 0.0, 1116.0, 1116, 1116, 1116.0, 1116.0, 1116.0, 1116.0, 0.8960573476702509, 0.16188536066308243, 0.6177895385304659], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818", 18, 0, 0.0, 635.7777777777776, 281, 1836, 420.5, 1792.8000000000002, 1836.0, 1836.0, 0.08384455220022079, 16.82615781902852, 0.1849929605511382], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 17, 0, 0.0, 161.17647058823533, 139, 430, 144.0, 210.7999999999998, 430.0, 430.0, 0.10064829341937775, 0.07814003248867707, 0.03577732305141944], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=188b4937-3298-444b-88cd-84111d03d71c", 1, 0, 0.0, 245.0, 245, 245, 245.0, 245.0, 245.0, 245.0, 4.081632653061225, 0.7374043367346939, 2.814094387755102], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 16, 0, 0.0, 529.1250000000001, 279, 1638, 417.0, 1170.4000000000005, 1638.0, 1638.0, 0.08961577237593817, 6.830932712907472, 0.2001149077237594], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 188.66666666666666, 138, 572, 140.0, 572.0, 572.0, 572.0, 0.04955455957008666, 0.03682716780550386, 0.024874066034203657], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 140.55555555555554, 137, 152, 139.0, 152.0, 152.0, 152.0, 0.04955483242207502, 0.013259789144188044, 0.028261740365714664], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 171.00000000000003, 137, 412, 140.0, 412.0, 412.0, 412.0, 0.04955483242207502, 0.01335657592626241, 0.029132821404383953], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 171.0, 137, 413, 140.0, 413.0, 413.0, 413.0, 0.04955483242207502, 0.01335657592626241, 0.029181214795421136], "isController": false}, {"data": ["https://demoqa.com/books", 56, 0, 0.0, 1573.125, 1100, 2525, 1451.5, 2210.9, 2371.5499999999997, 2525.0, 0.2428331692764005, 290.51289292358126, 0.47950065261414243], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, 9.523809523809524, 1457.952380952381, 164, 2204, 1488.0, 2147.6, 2200.0, 2204.0, 0.0890551251224508, 0.028575165706143532, 0.04017916777985573], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/1957ac01-dad7-4a17-9e2a-8d99a01873f1", 3, 0, 0.0, 401.6666666666667, 280, 642, 283.0, 642.0, 642.0, 642.0, 0.02220659535882157, 0.022271653743661867, 0.014240557570598469], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 140.375, 138, 147, 140.0, 147.0, 147.0, 147.0, 0.04522150056244242, 0.012188607573470806, 0.02662945785073513], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 174.0, 139, 412, 140.5, 412.0, 412.0, 412.0, 0.04515386178402908, 0.012170376808976587, 0.026545532025376472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 17, 0, 0.0, 316.52941176470586, 137, 1365, 140.0, 722.5999999999995, 1365.0, 1365.0, 0.09761195229646472, 5.191315164949845, 0.05689170886948134], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 17, 0, 0.0, 309.11764705882354, 138, 1099, 142.0, 553.3999999999995, 1099.0, 1099.0, 0.09776407802723593, 1.7157348587884156, 0.05707584587493099], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 173.0, 137, 410, 139.5, 410.0, 410.0, 410.0, 0.04515437150759158, 0.012082322063554779, 0.025752102500423323], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 17, 0, 0.0, 158.2941176470588, 139, 419, 140.0, 208.5999999999998, 419.0, 419.0, 0.09775339693054333, 0.07264681158607761, 0.04906762306865163], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 175.625, 139, 421, 140.5, 421.0, 421.0, 421.0, 0.04522328999434709, 0.033608323911814585, 0.022699971735443754], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 17, 0, 0.0, 220.3529411764706, 138, 420, 140.0, 415.2, 420.0, 420.0, 0.09776295359135086, 0.0347966027373627, 0.05527246031974237], "isController": false}, {"data": ["deleteAccount", 11, 0, 0.0, 703.0909090909091, 465, 1604, 531.0, 1524.8000000000002, 1604.0, 1604.0, 0.06246982991169038, 0.011286053255529999, 0.04252096821137519], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 247.375, 141, 427, 145.5, 427.0, 427.0, 427.0, 0.04492842340546217, 0.035363583266408705, 0.01597065050741038], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1c8ac6e4-fc4a-4d9e-bc88-e0d007c3c544", 1, 0, 0.0, 492.0, 492, 492, 492.0, 492.0, 492.0, 492.0, 2.032520325203252, 0.36720337906504064, 1.4013274898373984], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1793.4285714285713, 1286, 2711, 1766.0, 2306.4, 2671.8999999999996, 2711.0, 0.09060980398079073, 0.0468976524509952, 0.04167697038569573], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 350.375, 279, 833, 282.0, 833.0, 833.0, 833.0, 0.04511820970943873, 0.06992441289929616, 0.10147191109456775], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=655df116-9178-441a-9aed-5d53a4a97160", 1, 0, 0.0, 244.0, 244, 244, 244.0, 244.0, 244.0, 244.0, 4.0983606557377055, 0.7404264856557378, 2.82562756147541], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=441253a3-a5e4-40bc-8fae-d02b127ae3c4", 1, 0, 0.0, 723.0, 723, 723, 723.0, 723.0, 723.0, 723.0, 1.3831258644536653, 0.2498811376210235, 0.953600449515906], "isController": false}, {"data": ["addBook", 57, 2, 3.508771929824561, 1574.7017543859647, 719, 4290, 1152.0, 2505.4, 2603.3999999999983, 4290.0, 0.2568921458606563, 103.43350208077004, 0.9296803875803914], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=63904bac-50cd-4bea-9e9a-5f089cea4995", 1, 0, 0.0, 480.0, 480, 480, 480.0, 480.0, 480.0, 480.0, 2.0833333333333335, 0.3763834635416667, 1.4363606770833335], "isController": false}, {"data": ["https://demoqa.com/books-0", 56, 0, 0.0, 244.4464285714285, 138, 630, 142.0, 561.0, 565.45, 630.0, 0.2438493359460048, 0.18122006313956018, 0.1178763879817113], "isController": false}, {"data": ["https://demoqa.com/books-3", 56, 0, 0.0, 893.0535714285714, 683, 1247, 826.5, 1226.7, 1242.45, 1247.0, 0.24376760241504047, 71.67576895619582, 0.12259796410522054], "isController": false}, {"data": ["https://demoqa.com/books-1", 56, 0, 0.0, 219.3928571428571, 137, 470, 144.0, 418.90000000000003, 428.49999999999994, 470.0, 0.24434195656821725, 0.4323707278336031, 0.11883036559665251], "isController": false}, {"data": ["https://demoqa.com/books-2", 56, 0, 0.0, 1327.0357142857142, 956, 1961, 1249.5, 1651.0, 1807.85, 1961.0, 0.24347296797895698, 219.077404567292, 0.1222120171300624], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 16, 0, 0.0, 150.12500000000003, 142, 173, 147.0, 168.8, 173.0, 173.0, 0.09284997185485228, 0.0693654574892207, 0.03300526343277952], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 2, 1.1764705882352942, 244.74705882352936, 139, 2586, 150.0, 417.9, 477.29999999999984, 2371.5799999999977, 0.6968441159712572, 1.5418957029312543, 0.3345155985481048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 143.88888888888889, 140, 150, 143.0, 150.0, 150.0, 150.0, 0.05033303692767142, 0.03897861160512055, 0.017891821720383203], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8b908459-82b6-4c95-934c-50ef92cb8bc2", 1, 0, 0.0, 547.0, 547, 547, 547.0, 547.0, 547.0, 547.0, 1.8281535648994516, 0.3302816499085923, 1.2604261882998171], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 16, 0, 0.0, 145.62500000000003, 139, 162, 144.0, 155.0, 162.0, 162.0, 0.07704160246533129, 0.06252106606317412, 0.027385882126348227], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c9348a32-ef56-4bbb-b4ab-ba7fd158ee54", 3, 0, 0.0, 427.0, 239, 555, 487.0, 555.0, 555.0, 555.0, 0.016114823488966715, 0.022215585115811867, 0.0103340502191616], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 361.55555555555554, 278, 985, 282.0, 985.0, 985.0, 985.0, 0.0495163899250652, 0.07674073321394381, 0.11136352148186049], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/38da1fa4-ea2b-4a4f-9882-0a0ea9e8edf9", 3, 0, 0.0, 452.0, 258, 662, 436.0, 662.0, 662.0, 662.0, 0.027518139039983854, 0.027598758587952556, 0.017646723277593812], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 17, 0, 0.0, 557.1764705882352, 280, 1505, 554.0, 1086.5999999999997, 1505.0, 1505.0, 0.09752403680671883, 7.005349659526377, 0.21786605396234424], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1957ac01-dad7-4a17-9e2a-8d99a01873f1", 1, 0, 0.0, 559.0, 559, 559, 559.0, 559.0, 559.0, 559.0, 1.7889087656529516, 0.3231915250447227, 1.2333687388193202], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 167.5, 140, 421, 144.0, 340.9000000000003, 421.0, 421.0, 0.07484703137961791, 0.06205579066532774, 0.026605780685723553], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 17, 0, 0.0, 165.88235294117646, 141, 419, 148.0, 219.79999999999984, 419.0, 419.0, 0.11151709163425018, 0.08657821079026258, 0.03964084116686237], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25eb1b1d-93e8-46e9-a4dc-e8308e408891", 1, 0, 0.0, 710.0, 710, 710, 710.0, 710.0, 710.0, 710.0, 1.4084507042253522, 0.25445642605633806, 0.9710607394366197], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 16, 0, 0.0, 174.6875, 138, 416, 140.5, 414.6, 416.0, 416.0, 0.08968710411551699, 0.06665223264834808, 0.04501872218298412], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 16, 0, 0.0, 207.6875, 137, 416, 140.0, 414.6, 416.0, 416.0, 0.08968710411551699, 0.03241742129956614, 0.05067890685433693], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 16, 0, 0.0, 292.75000000000006, 137, 1497, 140.5, 741.7000000000007, 1497.0, 1497.0, 0.08968660138229474, 5.066422606418758, 0.05224419699661994], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 16, 0, 0.0, 294.125, 138, 1098, 140.0, 717.9000000000003, 1098.0, 1098.0, 0.08968710411551699, 1.6708492913317414, 0.052332074911153714], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/fb19342d-bc38-46e9-9386-85a5c05bac65", 1, 0, 0.0, 410.0, 410, 410, 410.0, 410.0, 410.0, 410.0, 2.4390243902439024, 0.7788681402439025, 1.4553163109756098], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 2, 50.0, 0.15760441292356187], "isController": false}, {"data": ["401/Unauthorized", 2, 50.0, 0.15760441292356187], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1269, 4, "406/Not Acceptable", 2, "401/Unauthorized", 2, "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 2, "406/Not Acceptable", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 170, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
