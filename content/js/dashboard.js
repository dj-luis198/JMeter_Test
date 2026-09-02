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

    var data = {"OkPercent": 97.51131221719457, "KoPercent": 2.48868778280543};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7691309987029832, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/36ae5013-59bb-4c97-83a6-d9fd8827a768"], "isController": false}, {"data": [0.14912280701754385, 500, 1500, "see books"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/1f943cb8-c77d-47da-aa9b-6da7ed6f2f99"], "isController": false}, {"data": [0.6071428571428571, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.6071428571428571, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=66b885ae-e1b9-431a-989e-c524c24208ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [0.9705882352941176, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/aae39d56-7314-42bc-9302-b4384d0e4fcf"], "isController": false}, {"data": [0.8571428571428571, 500, 1500, "goToProfile"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=25a7a7d1-b130-43aa-a0e1-155e4f47145c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=da240a1b-3e6c-49a1-9a10-e46513fbd701"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/094160fa-250a-4015-999f-ebb8be160757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=d1343b8e-c4a6-486e-a2f8-9adb87624d14"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [0.6428571428571429, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/8551eebc-7334-4021-87de-29e7d6963d72"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b55c1187-f25a-4e25-9fcb-2f52f3c30ada"], "isController": false}, {"data": [0.6904761904761905, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0f3081e8-2fa2-42d3-a884-47867cda971d"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/761fb0e1-398d-47bb-ad1e-63f2db1ee8c9"], "isController": false}, {"data": [0.7857142857142857, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/09569714-beb4-4d1f-93a3-3f5ceba33c45"], "isController": false}, {"data": [0.3181818181818182, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.9411764705882353, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "register"], "isController": true}, {"data": [0.8666666666666667, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/66b885ae-e1b9-431a-989e-c524c24208ce"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=44e5e171-20b8-47e1-82b4-d441532804da"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=761fb0e1-398d-47bb-ad1e-63f2db1ee8c9"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId="], "isController": false}, {"data": [0.4298245614035088, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/25a7a7d1-b130-43aa-a0e1-155e4f47145c"], "isController": false}, {"data": [0.1956521739130435, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=094160fa-250a-4015-999f-ebb8be160757"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.7142857142857143, 500, 1500, "deleteAccount"], "isController": true}, {"data": [0.16666666666666666, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9285714285714286, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b55c1187-f25a-4e25-9fcb-2f52f3c30ada"], "isController": false}, {"data": [0.22033898305084745, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=8551eebc-7334-4021-87de-29e7d6963d72"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=36ae5013-59bb-4c97-83a6-d9fd8827a768"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.5526315789473685, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.49122807017543857, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.8828571428571429, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/da240a1b-3e6c-49a1-9a10-e46513fbd701"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/d1343b8e-c4a6-486e-a2f8-9adb87624d14"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0f3081e8-2fa2-42d3-a884-47867cda971d"], "isController": false}, {"data": [0.9615384615384616, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=1f943cb8-c77d-47da-aa9b-6da7ed6f2f99"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/44e5e171-20b8-47e1-82b4-d441532804da"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9722222222222222, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1326, 33, 2.48868778280543, 364.05128205128267, 95, 2750, 114.0, 1019.5999999999999, 1242.5999999999995, 1730.1400000000003, 5.134519771386088, 725.9793463905894, 3.7619429738201444], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["https://demoqa.com/Account/v1/User/36ae5013-59bb-4c97-83a6-d9fd8827a768", 3, 0, 0.0, 317.3333333333333, 199, 432, 321.0, 432.0, 432.0, 432.0, 0.026499425845773344, 0.02657706088243088, 0.01699344691281689], "isController": false}, {"data": ["see books", 57, 0, 0.0, 1679.438596491228, 1261, 2352, 1642.0, 2040.8, 2091.5, 2352.0, 0.24757958380568912, 297.92180930454026, 1.2173468793570748], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/1f943cb8-c77d-47da-aa9b-6da7ed6f2f99", 3, 0, 0.0, 333.6666666666667, 218, 495, 288.0, 495.0, 495.0, 495.0, 0.04287122911813882, 0.03573997974334424, 0.0274922921102648], "isController": false}, {"data": ["deleteBook", 14, 2, 14.285714285714286, 498.35714285714295, 100, 862, 500.5, 790.5, 862.0, 862.0, 0.07808796050980282, 0.015382282399531473, 0.05254160624145913], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, 14.285714285714286, 498.35714285714295, 100, 862, 500.5, 790.5, 862.0, 862.0, 0.0772379701861435, 0.015214845689569562, 0.05196968892407507], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=66b885ae-e1b9-431a-989e-c524c24208ce", 1, 0, 0.0, 198.0, 198, 198, 198.0, 198.0, 198.0, 198.0, 5.050505050505051, 0.91244476010101, 3.4820864898989896], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 17, 0, 0.0, 138.23529411764707, 97, 307, 104.0, 306.2, 307.0, 307.0, 0.11155148429092626, 0.0397043311504239, 0.06306811284416915], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 17, 0, 0.0, 117.0, 101, 309, 104.0, 157.79999999999987, 309.0, 309.0, 0.11153904194524089, 0.08289180753938312, 0.05598737066391974], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 17, 0, 0.0, 210.35294117647058, 100, 816, 105.0, 492.7999999999997, 816.0, 816.0, 0.11132648784576697, 1.9537517231048303, 0.06499374402438704], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 17, 0, 0.0, 200.88235294117646, 99, 1174, 103.0, 480.3999999999994, 1174.0, 1174.0, 0.11140308914213068, 5.924771838691604, 0.06492967270427723], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/aae39d56-7314-42bc-9302-b4384d0e4fcf", 1, 0, 0.0, 1301.0, 1301, 1301, 1301.0, 1301.0, 1301.0, 1301.0, 0.7686395080707148, 0.24545421790930055, 0.45863158147578786], "isController": false}, {"data": ["goToProfile", 14, 2, 14.285714285714286, 236.92857142857144, 103, 331, 223.5, 326.0, 331.0, 331.0, 0.07804965072781299, 0.1228073361793581, 0.05044699104659007], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=25a7a7d1-b130-43aa-a0e1-155e4f47145c", 1, 0, 0.0, 454.0, 454, 454, 454.0, 454.0, 454.0, 454.0, 2.2026431718061676, 0.39793846365638763, 1.518619218061674], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=da240a1b-3e6c-49a1-9a10-e46513fbd701", 1, 0, 0.0, 240.0, 240, 240, 240.0, 240.0, 240.0, 240.0, 4.166666666666667, 0.7527669270833334, 2.872721354166667], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/094160fa-250a-4015-999f-ebb8be160757", 3, 0, 0.0, 593.3333333333334, 308, 1027, 445.0, 1027.0, 1027.0, 1027.0, 0.03780432481475881, 0.03151591010761631, 0.024243007775089472], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 15, 0, 0.0, 130.93333333333334, 99, 305, 105.0, 299.6, 305.0, 305.0, 0.07351067374982848, 0.05463049094103464, 0.036898912409581874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 15, 0, 0.0, 142.86666666666667, 99, 311, 104.0, 305.6, 311.0, 311.0, 0.07351175452954926, 0.04175237933045494, 0.04068990475327005], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 7, 0, 0.0, 763.8571428571428, 608, 822, 802.0, 822.0, 822.0, 822.0, 0.031897926634768745, 9.379049541467305, 0.018191786283891547], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 7, 0, 0.0, 1090.7142857142858, 888, 1222, 1128.0, 1222.0, 1222.0, 1222.0, 0.03183989083466, 28.64958974158517, 0.018127594098248805], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 7, 0, 0.0, 163.85714285714286, 100, 315, 105.0, 315.0, 315.0, 315.0, 0.03200160922377811, 0.05662784757176361, 0.017719641044806823], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 16, 0, 0.0, 116.75, 98, 303, 104.0, 166.50000000000014, 303.0, 303.0, 0.07185940707006741, 0.05340332888703252, 0.03607005393946743], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 16, 0, 0.0, 114.875, 96, 311, 102.0, 166.80000000000015, 311.0, 311.0, 0.07186166629238716, 0.019228609925892655, 0.040983606557377046], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 16, 0, 0.0, 115.625, 100, 310, 103.0, 166.50000000000014, 310.0, 310.0, 0.07186102078580027, 0.01936879075867273, 0.04224642042290211], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 16, 0, 0.0, 128.1875, 101, 307, 103.0, 300.0, 307.0, 307.0, 0.07186134353764412, 0.01936887775038064, 0.04231678725898379], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 7, 0, 0.0, 104.28571428571428, 99, 117, 103.0, 117.0, 117.0, 117.0, 0.03200117032851487, 0.023782119746093573, 0.017969407166890675], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 15, 0, 0.0, 329.73333333333335, 96, 1155, 104.0, 1122.6, 1155.0, 1155.0, 0.07351211479651847, 13.24511707263732, 0.04195359363973183], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 21, 0, 0.0, 547.0952380952382, 98, 1317, 301.0, 1238.0, 1309.6999999999998, 1317.0, 0.10703909475508436, 41.293899767126256, 0.05898499222692288], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=d1343b8e-c4a6-486e-a2f8-9adb87624d14", 1, 0, 0.0, 498.0, 498, 498, 498.0, 498.0, 498.0, 498.0, 2.008032128514056, 0.3627792419678715, 1.3844440261044177], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 15, 0, 0.0, 286.46666666666664, 100, 814, 300.0, 693.4000000000001, 814.0, 814.0, 0.07343653614546308, 4.334390742957436, 0.04198217603472079], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 21, 0, 0.0, 410.71428571428567, 100, 911, 283.0, 822.2, 902.1999999999998, 911.0, 0.10703854916892212, 13.504866192256525, 0.05908922140923895], "isController": false}, {"data": ["deleteBooks", 14, 2, 14.285714285714286, 427.35714285714295, 99, 892, 476.0, 788.5, 892.0, 892.0, 0.07756447547023462, 0.015279162857696888, 0.05268714161057093], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/8551eebc-7334-4021-87de-29e7d6963d72", 3, 0, 0.0, 468.0, 331, 612, 461.0, 612.0, 612.0, 612.0, 0.07143367383384529, 0.03232187715789223, 0.04580870359787604], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296", 16, 0, 0.0, 247.125, 202, 615, 210.0, 476.40000000000015, 615.0, 615.0, 0.07182585820677767, 0.11131605173257438, 0.1615380385255947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b55c1187-f25a-4e25-9fcb-2f52f3c30ada", 3, 0, 0.0, 271.3333333333333, 202, 410, 202.0, 410.0, 410.0, 410.0, 0.03711401425178147, 0.030577985049237928, 0.02380032814974268], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 623.0952380952382, 127, 1614, 667.0, 1289.2000000000003, 1585.6999999999996, 1614.0, 0.09101152812689607, 0.0559045421795094, 0.04115072023706336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 21, 0, 0.0, 103.47619047619048, 100, 111, 103.0, 106.0, 110.5, 111.0, 0.10703527576874265, 0.07954477037110659, 0.05372669115735715], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 21, 0, 0.0, 180.52380952380952, 99, 310, 104.0, 308.8, 309.9, 310.0, 0.10703964034680843, 0.09754226154371551, 0.05719333461610998], "isController": false}, {"data": ["login", 21, 0, 0.0, 3127.476190476191, 1751, 4973, 3296.0, 4144.6, 4897.899999999999, 4973.0, 0.09051177946158422, 36.21623200135552, 0.186592154729887], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0f3081e8-2fa2-42d3-a884-47867cda971d", 3, 0, 0.0, 340.3333333333333, 266, 423, 332.0, 423.0, 423.0, 423.0, 0.021306969509726634, 0.0255586532042131, 0.01366364906710985], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 15, 0, 0.0, 108.13333333333334, 103, 118, 107.0, 116.8, 118.0, 118.0, 0.07563609959761596, 0.06123274078752307, 0.026886269778840042], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/761fb0e1-398d-47bb-ad1e-63f2db1ee8c9", 3, 0, 0.0, 1010.3333333333334, 222, 2165, 644.0, 2165.0, 2165.0, 2165.0, 0.027982986344302664, 0.02806496774960824, 0.0179448187168868], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 21, 0, 0.0, 662.3333333333333, 203, 1421, 407.0, 1342.6, 1413.8, 1421.0, 0.10697747869365215, 54.94427778740009, 0.22886434650769474], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/09569714-beb4-4d1f-93a3-3f5ceba33c45", 1, 0, 0.0, 253.0, 253, 253, 253.0, 253.0, 253.0, 253.0, 3.952569169960474, 1.2621973814229248, 2.3584177371541504], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, 36.36363636363637, 798.3636363636363, 99, 1325, 1052.0, 1322.0, 1325.0, 1325.0, 0.050010684100694244, 38.07860727632721, 0.08381140658458852], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 17, 0, 0.0, 385.4117647058824, 203, 1275, 400.0, 831.7999999999996, 1275.0, 1275.0, 0.11123834451169638, 7.990476239162441, 0.24850344552592837], "isController": false}, {"data": ["register", 23, 7, 30.434782608695652, 1135.3913043478258, 123, 1880, 1173.0, 1790.2, 1868.6, 1880.0, 0.09271987712600631, 0.029069445172317875, 0.04183260081270988], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 15, 0, 0.0, 530.4666666666667, 207, 1398, 410.0, 1317.6000000000001, 1398.0, 1398.0, 0.07339808675653856, 17.65292797201086, 0.1613180996623688], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/66b885ae-e1b9-431a-989e-c524c24208ce", 3, 0, 0.0, 710.0, 225, 1427, 478.0, 1427.0, 1427.0, 1427.0, 0.07715255632136611, 0.034909522554263966, 0.049476085922230226], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 13, 0, 0.0, 107.07692307692308, 102, 112, 107.0, 111.2, 112.0, 112.0, 0.06786491749192147, 0.05268809512312263, 0.02412385738970646], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 18, 0, 0.0, 329.7222222222222, 204, 1190, 212.0, 667.1000000000008, 1190.0, 1190.0, 0.10145589205093085, 6.891641364342199, 0.22673454347666797], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=44e5e171-20b8-47e1-82b4-d441532804da", 1, 0, 0.0, 550.0, 550, 550, 550.0, 550.0, 550.0, 550.0, 1.8181818181818181, 0.3284801136363636, 1.2535511363636362], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=761fb0e1-398d-47bb-ad1e-63f2db1ee8c9", 1, 0, 0.0, 892.0, 892, 892, 892.0, 892.0, 892.0, 892.0, 1.1210762331838564, 0.20253818665919282, 0.7729295123318386], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 9, 0, 0.0, 106.33333333333333, 102, 120, 105.0, 120.0, 120.0, 120.0, 0.04083762506522676, 0.03034905534632575, 0.0204985735190689], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 9, 0, 0.0, 146.0, 101, 304, 104.0, 304.0, 304.0, 304.0, 0.04083873690324395, 0.010927552647938325, 0.02329084214013132], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 9, 0, 0.0, 124.8888888888889, 101, 303, 103.0, 303.0, 303.0, 303.0, 0.04083929284495589, 0.011007465649617017, 0.024009037395179147], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 9, 0, 0.0, 135.88888888888889, 96, 400, 103.0, 400.0, 400.0, 400.0, 0.04083892221546615, 0.011007365753387363, 0.024048701265552825], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, 100.0, 109.5, 99, 120, 109.5, 120.0, 120.0, 120.0, 0.023937475314478582, 0.007059685102512238, 0.014797286986391545], "isController": false}, {"data": ["https://demoqa.com/books", 57, 0, 0.0, 1142.2807017543862, 763, 1915, 1089.0, 1597.4, 1647.6, 1915.0, 0.23889354568315171, 285.7997334712909, 0.47172143493294216], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/25a7a7d1-b130-43aa-a0e1-155e4f47145c", 3, 0, 0.0, 800.0, 220, 1616, 564.0, 1616.0, 1616.0, 1616.0, 0.03152717642607928, 0.019981579590356888, 0.020217622903442766], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, 30.434782608695652, 1135.3913043478258, 123, 1880, 1173.0, 1790.2, 1868.6, 1880.0, 0.09054690329590728, 0.028388176542840496, 0.04085221613545817], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 7, 0, 0.0, 101.99999999999999, 98, 107, 102.0, 107.0, 107.0, 107.0, 0.03836015804385114, 0.010339261347756753, 0.022589038379338122], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 7, 0, 0.0, 131.85714285714286, 101, 302, 103.0, 302.0, 302.0, 302.0, 0.038359737619394686, 0.010339148030227473, 0.022551330123901953], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=094160fa-250a-4015-999f-ebb8be160757", 1, 0, 0.0, 518.0, 518, 518, 518.0, 518.0, 518.0, 518.0, 1.9305019305019306, 0.3487723214285714, 1.3309905888030888], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 13, 0, 0.0, 118.23076923076923, 95, 306, 103.0, 226.79999999999993, 306.0, 306.0, 0.06984253195295836, 0.01882474494044581, 0.04105976976140716], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 13, 0, 0.0, 211.15384615384616, 97, 312, 297.0, 310.4, 312.0, 312.0, 0.06976494579800366, 0.01880383304711817, 0.04108228741816035], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 7, 0, 0.0, 133.42857142857142, 102, 308, 104.0, 308.0, 308.0, 308.0, 0.0383595274106223, 0.01026417042042042, 0.02187691797637053], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 13, 0, 0.0, 117.15384615384615, 95, 297, 103.0, 220.99999999999994, 297.0, 297.0, 0.0698421567257997, 0.051904180926107005, 0.035057488825254925], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 7, 0, 0.0, 137.85714285714286, 102, 302, 106.0, 302.0, 302.0, 302.0, 0.03835910699998904, 0.028507109791984044, 0.019254473630853874], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 13, 0, 0.0, 148.46153846153848, 96, 311, 103.0, 308.2, 311.0, 311.0, 0.0698421567257997, 0.018688233342645622, 0.03983185500768264], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 7, 0, 0.0, 136.2857142857143, 103, 308, 106.0, 308.0, 308.0, 308.0, 0.04123905692168114, 0.032459648319213864, 0.014659196015128844], "isController": false}, {"data": ["deleteAccount", 14, 2, 14.285714285714286, 510.85714285714283, 99, 1616, 453.0, 1130.0, 1616.0, 1616.0, 0.07686943726081251, 0.014841978399688129, 0.05231153947520137], "isController": true}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1659.7619047619048, 1022, 2750, 1537.0, 2327.6000000000004, 2713.8999999999996, 2750.0, 0.09085363479434631, 0.04702385394629253, 0.04178912303529015], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 7, 0, 0.0, 272.0, 205, 611, 211.0, 611.0, 611.0, 611.0, 0.038337048375878334, 0.059414937277850494, 0.08622092032192166], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b55c1187-f25a-4e25-9fcb-2f52f3c30ada", 1, 0, 0.0, 515.0, 515, 515, 515.0, 515.0, 515.0, 515.0, 1.941747572815534, 0.3508040048543689, 1.338743932038835], "isController": false}, {"data": ["addBook", 59, 18, 30.508474576271187, 1022.3220338983056, 518, 2924, 818.0, 1776.0, 1897.0, 2924.0, 0.28604118993135014, 82.331622603496, 1.0396595428067912], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=8551eebc-7334-4021-87de-29e7d6963d72", 1, 0, 0.0, 201.0, 201, 201, 201.0, 201.0, 201.0, 201.0, 4.975124378109452, 0.8988261815920398, 3.4301150497512434], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=36ae5013-59bb-4c97-83a6-d9fd8827a768", 1, 0, 0.0, 685.0, 685, 685, 685.0, 685.0, 685.0, 685.0, 1.4598540145985401, 0.26374315693430656, 1.006500912408759], "isController": false}, {"data": ["https://demoqa.com/books-0", 57, 0, 0.0, 176.22807017543863, 101, 419, 105.0, 414.2, 416.29999999999995, 419.0, 0.23970730476470833, 0.17814185441986627, 0.11587413658059632], "isController": false}, {"data": ["https://demoqa.com/books-3", 57, 0, 0.0, 673.4912280701753, 479, 952, 611.0, 817.4, 921.4, 952.0, 0.23935098091910775, 70.37713559075601, 0.12037671403646533], "isController": false}, {"data": ["https://demoqa.com/books-1", 57, 0, 0.0, 142.40350877192978, 96, 425, 105.0, 305.4, 310.29999999999995, 425.0, 0.24005862484311957, 0.42479123849192646, 0.11674726091003276], "isController": false}, {"data": ["https://demoqa.com/books-2", 57, 0, 0.0, 963.421052631579, 658, 1508, 984.0, 1181.8000000000002, 1231.1999999999998, 1508.0, 0.23940828352661003, 215.4199943521171, 0.12017173606706792], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 18, 0, 0.0, 129.66666666666666, 101, 310, 106.0, 309.1, 310.0, 310.0, 0.10069085111738875, 0.0752231456101586, 0.035792450983134286], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 18, 10.285714285714286, 170.07428571428574, 96, 1327, 109.0, 312.8, 384.59999999999997, 1113.4400000000026, 0.7040270346381301, 1.5367825838797924, 0.3364086323771976], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 9, 0, 0.0, 134.77777777777777, 101, 344, 110.0, 344.0, 344.0, 344.0, 0.039752825763364676, 0.030785147295261904, 0.014130887283071039], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/da240a1b-3e6c-49a1-9a10-e46513fbd701", 3, 0, 0.0, 425.3333333333333, 314, 542, 420.0, 542.0, 542.0, 542.0, 0.0950058586946195, 0.04298767694841182, 0.06092498099882826], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/d1343b8e-c4a6-486e-a2f8-9adb87624d14", 3, 0, 0.0, 385.0, 195, 637, 323.0, 637.0, 637.0, 637.0, 0.03103052369180484, 0.025868870825101625, 0.019899131403924325], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 17, 0, 0.0, 131.52941176470588, 101, 316, 107.0, 304.8, 316.0, 316.0, 0.10692563636477996, 0.08677265997962123, 0.038008722301542876], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 9, 0, 0.0, 286.8888888888889, 206, 506, 217.0, 506.0, 506.0, 506.0, 0.040818177695133566, 0.06326020312712595, 0.09180103831239511], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0f3081e8-2fa2-42d3-a884-47867cda971d", 1, 0, 0.0, 581.0, 581, 581, 581.0, 581.0, 581.0, 581.0, 1.721170395869191, 0.3109536359724613, 1.186666308089501], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 13, 0, 0.0, 330.6153846153846, 201, 604, 403.0, 528.4, 604.0, 604.0, 0.06972640431660078, 0.10806230825238812, 0.15681631752063632], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 16, 0, 0.0, 125.5625, 104, 315, 109.0, 196.7000000000001, 315.0, 315.0, 0.0728116680698082, 0.06036826776490933, 0.02588227263418963], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 21, 0, 0.0, 110.52380952380949, 102, 144, 107.0, 118.8, 141.49999999999997, 144.0, 0.1073998496402105, 0.08338171920309312, 0.03817729030179358], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=1f943cb8-c77d-47da-aa9b-6da7ed6f2f99", 1, 0, 0.0, 432.0, 432, 432, 432.0, 432.0, 432.0, 432.0, 2.314814814814815, 0.41820384837962965, 1.5959563078703705], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/44e5e171-20b8-47e1-82b4-d441532804da", 3, 0, 0.0, 302.0, 203, 489, 214.0, 489.0, 489.0, 489.0, 0.04489337822671156, 0.028862116535727646, 0.028789047886270108], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 18, 0, 0.0, 115.77777777777776, 99, 303, 104.0, 133.80000000000027, 303.0, 303.0, 0.10151539932210273, 0.0754425965665236, 0.050955971925352346], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 18, 0, 0.0, 113.22222222222221, 98, 303, 102.0, 126.60000000000028, 303.0, 303.0, 0.10151711691387964, 0.03563453485421014, 0.0574228223168462], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 18, 0, 0.0, 179.38888888888889, 98, 1089, 103.0, 383.4000000000011, 1089.0, 1089.0, 0.10151768945738794, 5.100608480463484, 0.059196621434896145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 18, 0, 0.0, 196.5, 98, 810, 103.5, 354.6000000000007, 810.0, 810.0, 0.10151826200735443, 1.6841610890371557, 0.059296094225866854], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 7, 21.21212121212121, 0.5279034690799397], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 2, 6.0606060606060606, 0.15082956259426847], "isController": false}, {"data": ["Test failed: code expected to contain /204/", 2, 6.0606060606060606, 0.15082956259426847], "isController": false}, {"data": ["401/Unauthorized", 22, 66.66666666666667, 1.6591251885369533], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1326, 33, "401/Unauthorized", 22, "406/Not Acceptable", 7, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book", 14, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 11, 4, "Test failed: code expected to contain /200/", 2, "Test failed: code expected to contain /204/", 2, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=", 2, 2, "401/Unauthorized", 2, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 23, 7, "406/Not Acceptable", 7, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 18, "401/Unauthorized", 18, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
