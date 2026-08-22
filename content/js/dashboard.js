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

    var data = {"OkPercent": 99.22420480993019, "KoPercent": 0.7757951900698216};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7816053511705685, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.07272727272727272, 500, 1500, "see books"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/659cb92e-4040-4841-94e8-aa6a2018e136"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2e9d6973-506b-4b51-946c-8942e6031cc4"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=e08ab18d-72c5-4360-9ec5-c6a97232f2f8"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/6578e5e4-b25e-4478-b99c-05c75581ddc0"], "isController": false}, {"data": [0.5416666666666666, 500, 1500, "deleteBook"], "isController": true}, {"data": [0.5416666666666666, 500, 1500, "https://demoqa.com/BookStore/v1/Book"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=04bb1445-0237-49f4-81f4-267527bcb5b7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449337711-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/c1ea3a17-48de-47b2-a044-4d9ad531ce54"], "isController": false}, {"data": [0.9230769230769231, 500, 1500, "goToProfile"], "isController": true}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/0bba69c2-576c-4c1d-951b-98ba7c7d1b06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/9e1315c3-74b8-478b-923e-1cc983f839d0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491950296-1"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-2"], "isController": false}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/-0"], "isController": false}, {"data": [0.65625, 500, 1500, "https://demoqa.com/books?book=9781449325862-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-2"], "isController": false}, {"data": [0.6875, 500, 1500, "https://demoqa.com/books?book=9781449325862-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449331818-3"], "isController": false}, {"data": [0.7916666666666666, 500, 1500, "deleteBooks"], "isController": true}, {"data": [0.9166666666666666, 500, 1500, "https://demoqa.com/books?book=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/7406a055-9fef-4f20-87a0-688727f9e5e9"], "isController": false}, {"data": [0.7380952380952381, 500, 1500, "https://demoqa.com/Account/v1/Login"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449325862-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/2748ffb1-be1e-4f9c-a387-a62ac45356a7"], "isController": false}, {"data": [0.0, 500, 1500, "login"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=0bba69c2-576c-4c1d-951b-98ba7c7d1b06"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=b4734415-2584-4eb8-8d2b-1322c148f7cb"], "isController": false}, {"data": [0.59375, 500, 1500, "https://demoqa.com/books?book=9781449325862"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/04bb1445-0237-49f4-81f4-267527bcb5b7"], "isController": false}, {"data": [0.975, 500, 1500, "https://demoqa.com/books?book=9781449337711"], "isController": false}, {"data": [0.4, 500, 1500, "https://demoqa.com/Account/v1/User/"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "register"], "isController": true}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781449331818"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/af0ebf58-0c3d-48fe-b1f6-df1c2d1f6974"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/books?book=9781449365035"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=057a278a-731a-4b2b-b13c-a04b4431287c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593275846-3"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=a0fbe459-c816-4156-adcf-2719a226f975"], "isController": false}, {"data": [0.4090909090909091, 500, 1500, "https://demoqa.com/books"], "isController": false}, {"data": [0.21428571428571427, 500, 1500, "https://demoqa.com/Account/v1/User"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-2"], "isController": false}, {"data": [0.96875, 500, 1500, "https://demoqa.com/books?book=9781491904244-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781593277574-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781491904244-1"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574"], "isController": false}, {"data": [0.625, 500, 1500, "deleteAccount"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/197b02d5-92e2-4e0e-979c-054c753a06a0"], "isController": false}, {"data": [0.8333333333333334, 500, 1500, "https://demoqa.com/Account/v1/User/2e9d6973-506b-4b51-946c-8942e6031cc4"], "isController": false}, {"data": [0.30952380952380953, 500, 1500, "https://demoqa.com/Account/v1/GenerateToken"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781593277574"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/Account/v1/User/e08ab18d-72c5-4360-9ec5-c6a97232f2f8"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=659cb92e-4040-4841-94e8-aa6a2018e136"], "isController": false}, {"data": [0.3333333333333333, 500, 1500, "addBook"], "isController": true}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-0"], "isController": false}, {"data": [0.509090909090909, 500, 1500, "https://demoqa.com/books-3"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books-1"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/books-2"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035"], "isController": false}, {"data": [0.9571428571428572, 500, 1500, "https://demoqa.com/BookStore/v1/Books"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/0e0157da-52cc-4ce2-a9f0-7760a04ddcd6"], "isController": false}, {"data": [0.9583333333333334, 500, 1500, "https://demoqa.com/books?book=9781593275846"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=7406a055-9fef-4f20-87a0-688727f9e5e9"], "isController": false}, {"data": [0.9375, 500, 1500, "https://demoqa.com/books?book=9781491904244"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/4164bad8-56ba-439e-9a18-5d8de7e3cbbe"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/b4734415-2584-4eb8-8d2b-1322c148f7cb"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/Account/v1/User/a0fbe459-c816-4156-adcf-2719a226f975"], "isController": false}, {"data": [0.6666666666666666, 500, 1500, "https://demoqa.com/Account/v1/User/057a278a-731a-4b2b-b13c-a04b4431287c"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=af0ebf58-0c3d-48fe-b1f6-df1c2d1f6974"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=6578e5e4-b25e-4478-b99c-05c75581ddc0"], "isController": false}, {"data": [0.5, 500, 1500, "https://demoqa.com/BookStore/v1/Books?UserId=2748ffb1-be1e-4f9c-a387-a62ac45356a7"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-0"], "isController": false}, {"data": [1.0, 500, 1500, "https://demoqa.com/books?book=9781449365035-1"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-2"], "isController": false}, {"data": [0.9, 500, 1500, "https://demoqa.com/books?book=9781449365035-3"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 1289, 10, 0.7757951900698216, 385.3941039565558, 97, 2842, 128.0, 1090.0, 1314.5, 1725.5999999999995, 5.111063529449083, 714.8945959313218, 3.7332088775485928], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["see books", 55, 0, 0.0, 1761.4000000000005, 1301, 2335, 1761.0, 2092.0, 2164.4, 2335.0, 0.2509387390100239, 301.9637720740543, 1.2338638192533888], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/659cb92e-4040-4841-94e8-aa6a2018e136", 3, 0, 0.0, 657.3333333333334, 237, 1318, 417.0, 1318.0, 1318.0, 1318.0, 0.03611890343009186, 0.030110843647286868, 0.0231621874209899], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2e9d6973-506b-4b51-946c-8942e6031cc4", 1, 0, 0.0, 311.0, 311, 311, 311.0, 311.0, 311.0, 311.0, 3.215434083601286, 0.580913384244373, 2.216891077170418], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=e08ab18d-72c5-4360-9ec5-c6a97232f2f8", 1, 0, 0.0, 524.0, 524, 524, 524.0, 524.0, 524.0, 524.0, 1.9083969465648853, 0.34477874522900764, 1.3157502385496183], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/6578e5e4-b25e-4478-b99c-05c75581ddc0", 3, 0, 0.0, 397.0, 215, 750, 226.0, 750.0, 750.0, 750.0, 0.02050384788878713, 0.02423485406386265, 0.013148626413056851], "isController": false}, {"data": ["deleteBook", 12, 0, 0.0, 578.0000000000001, 451, 793, 561.0, 753.4000000000001, 793.0, 793.0, 0.08965393580778197, 0.01619724426214811, 0.06093665949435179], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Book", 12, 0, 0.0, 578.0000000000001, 451, 793, 561.0, 753.4000000000001, 793.0, 793.0, 0.08621804543690995, 0.01557650234944174, 0.05860132775789973], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-1", 20, 0, 0.0, 144.9, 101, 347, 110.5, 329.1, 346.15, 347.0, 0.10781322437010124, 0.028848460427155994, 0.06148722952357336], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-0", 20, 0, 0.0, 119.55000000000001, 98, 308, 111.0, 121.4, 298.6999999999999, 308.0, 0.10781206201349808, 0.08012204999245315, 0.054116601440369144], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-3", 20, 0, 0.0, 160.70000000000002, 99, 333, 108.0, 328.90000000000003, 332.85, 333.0, 0.10781031852558609, 0.029058249915099376, 0.06348595905364103], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=04bb1445-0237-49f4-81f4-267527bcb5b7", 1, 0, 0.0, 468.0, 468, 468, 468.0, 468.0, 468.0, 468.0, 2.136752136752137, 0.38603432158119655, 1.473190438034188], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711-2", 20, 0, 0.0, 109.24999999999999, 97, 155, 107.5, 116.7, 153.09999999999997, 155.0, 0.10781264318866673, 0.02905887648444533, 0.06338204218708728], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/c1ea3a17-48de-47b2-a044-4d9ad531ce54", 1, 0, 0.0, 218.0, 218, 218, 218.0, 218.0, 218.0, 218.0, 4.587155963302752, 1.46484375, 2.7370627866972477], "isController": false}, {"data": ["goToProfile", 13, 1, 7.6923076923076925, 251.53846153846158, 116, 451, 224.0, 435.4, 451.0, 451.0, 0.08883543577197994, 0.20426411159439106, 0.057424047837882165], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/0bba69c2-576c-4c1d-951b-98ba7c7d1b06", 3, 0, 0.0, 333.6666666666667, 224, 517, 260.0, 517.0, 517.0, 517.0, 0.04430529300567108, 0.02756100746544187, 0.0284119229235586], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/9e1315c3-74b8-478b-923e-1cc983f839d0", 1, 0, 0.0, 363.0, 363, 363, 363.0, 363.0, 363.0, 363.0, 2.7548209366391188, 0.879713326446281, 1.6437456955922864], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-0", 16, 0, 0.0, 119.1875, 99, 308, 107.5, 172.90000000000015, 308.0, 308.0, 0.09021250683641653, 0.06704269306886033, 0.04528244972062314], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-1", 16, 0, 0.0, 122.0625, 98, 321, 111.0, 176.80000000000015, 321.0, 321.0, 0.09020996369048963, 0.02413821294061929, 0.05144786991723236], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-3", 4, 0, 0.0, 817.75, 729, 924, 809.0, 924.0, 924.0, 924.0, 0.11383687176276396, 33.471820038135355, 0.06492259092720132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-2", 4, 0, 0.0, 1064.25, 953, 1143, 1080.5, 1143.0, 1143.0, 1143.0, 0.1127459270533852, 101.4489833488359, 0.06419030807824568], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-1", 4, 0, 0.0, 264.75, 105, 320, 317.0, 320.0, 320.0, 320.0, 0.11542679055808854, 0.20425131297974258, 0.06391307641253534], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-0", 12, 0, 0.0, 112.58333333333334, 101, 130, 110.0, 127.60000000000001, 130.0, 130.0, 0.0582286834494672, 0.043273464946332565, 0.029228069622095842], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-1", 12, 0, 0.0, 141.0, 100, 328, 105.0, 321.70000000000005, 328.0, 328.0, 0.0581767409389726, 0.03012994623499525, 0.03236459969554172], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-2", 12, 0, 0.0, 310.25, 99, 1146, 116.0, 1073.1000000000004, 1146.0, 1146.0, 0.058008846349068235, 8.712439649650738, 0.03327200106349552], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491950296-3", 12, 0, 0.0, 254.33333333333331, 102, 872, 110.5, 814.4000000000002, 872.0, 872.0, 0.05801782114072706, 2.856225644602167, 0.03333380674263778], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/-0", 4, 0, 0.0, 273.25, 104, 347, 321.0, 347.0, 347.0, 347.0, 0.11615076369127127, 0.08631907340728265, 0.06522137609617283], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-2", 16, 0, 0.0, 825.1875, 98, 1504, 1095.5, 1421.4, 1504.0, 1504.0, 0.08903133903133903, 50.07809587353655, 0.04755873286146724], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-2", 16, 0, 0.0, 106.31250000000001, 99, 118, 106.5, 113.80000000000001, 118.0, 118.0, 0.09021301548280879, 0.024315226829350806, 0.05303538605532313], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-3", 16, 0, 0.0, 562.1874999999999, 104, 958, 643.5, 935.6, 958.0, 958.0, 0.08902539449377936, 16.369261861242794, 0.04764249627206161], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449331818-3", 16, 0, 0.0, 177.5625, 101, 428, 109.5, 358.70000000000005, 428.0, 428.0, 0.09021250683641653, 0.024315089733252894, 0.053123185178085126], "isController": false}, {"data": ["deleteBooks", 12, 0, 0.0, 476.5, 311, 554, 485.0, 552.5, 554.0, 554.0, 0.08628934254711756, 0.015589383175016357, 0.05949245687330567], "isController": true}, {"data": ["https://demoqa.com/books?book=9781491950296", 12, 0, 0.0, 444.08333333333337, 217, 1262, 326.0, 1185.8000000000002, 1262.0, 1262.0, 0.05797437532610586, 11.634458806186831, 0.1279135143100083], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/7406a055-9fef-4f20-87a0-688727f9e5e9", 3, 0, 0.0, 882.6666666666666, 208, 1897, 543.0, 1897.0, 1897.0, 1897.0, 0.03319355159937596, 0.02767209819205789, 0.021286229378506067], "isController": false}, {"data": ["https://demoqa.com/Account/v1/Login", 21, 0, 0.0, 617.904761904762, 130, 1531, 419.0, 1321.2, 1510.5999999999997, 1531.0, 0.09470892789493623, 0.05817569887296376, 0.04282249376499558], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-0", 16, 0, 0.0, 121.3125, 100, 326, 108.5, 178.30000000000015, 326.0, 326.0, 0.0890268805537472, 0.06616157822402502, 0.04468732090295514], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862-1", 16, 0, 0.0, 216.31249999999997, 101, 343, 210.5, 343.0, 343.0, 343.0, 0.08902588984158956, 0.10739182658869481, 0.046099587977053574], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2748ffb1-be1e-4f9c-a387-a62ac45356a7", 3, 0, 0.0, 316.6666666666667, 197, 475, 278.0, 475.0, 475.0, 475.0, 0.027099047016846574, 0.027178438756153743, 0.01737796960390226], "isController": false}, {"data": ["login", 21, 0, 0.0, 2935.380952380952, 1568, 4434, 2853.0, 4082.8, 4399.299999999999, 4434.0, 0.09246213455442057, 21.198432065097744, 0.16870985739917224], "isController": true}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=0bba69c2-576c-4c1d-951b-98ba7c7d1b06", 1, 0, 0.0, 483.0, 483, 483, 483.0, 483.0, 483.0, 483.0, 2.070393374741201, 0.37404567805383027, 1.427439182194617], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449331818", 16, 0, 0.0, 123.25000000000001, 101, 300, 113.0, 173.30000000000013, 300.0, 300.0, 0.08889530910565764, 0.07196700317245135, 0.03159950440865174], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=b4734415-2584-4eb8-8d2b-1322c148f7cb", 1, 0, 0.0, 484.0, 484, 484, 484.0, 484.0, 484.0, 484.0, 2.066115702479339, 0.37327285640495866, 1.4244899276859504], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449325862", 16, 0, 0.0, 976.5, 215, 1613, 1207.5, 1534.6000000000001, 1613.0, 1613.0, 0.08897093986676602, 66.57681745734955, 0.18587019834958907], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/04bb1445-0237-49f4-81f4-267527bcb5b7", 3, 0, 0.0, 1002.6666666666667, 211, 1724, 1073.0, 1724.0, 1724.0, 1724.0, 0.018599460615642147, 0.021983932778449428, 0.011927388480734059], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449337711", 20, 0, 0.0, 307.65, 207, 630, 225.0, 458.0, 621.4499999999998, 630.0, 0.10774584909116376, 0.1669850219801532, 0.24232293989936535], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, 20.0, 1093.6, 116, 1491, 1275.0, 1491.0, 1491.0, 1491.0, 0.08324592511196577, 79.67730887776167, 0.16091502360021975], "isController": false}, {"data": ["register", 21, 4, 19.047619047619047, 1428.6190476190475, 713, 2842, 1316.0, 2235.6, 2781.599999999999, 2842.0, 0.09270827355121249, 0.02943694623361602, 0.04182736560611345], "isController": true}, {"data": ["https://demoqa.com/books?book=9781449331818", 16, 0, 0.0, 300.25000000000006, 206, 629, 222.5, 564.6, 629.0, 629.0, 0.09015811479381966, 0.1397274689236248, 0.2027677132521159], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491904244", 16, 0, 0.0, 116.625, 108, 135, 116.0, 131.5, 135.0, 135.0, 0.0947379016739003, 0.07355139827221752, 0.03367636348564425], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/af0ebf58-0c3d-48fe-b1f6-df1c2d1f6974", 3, 0, 0.0, 709.3333333333334, 199, 1027, 902.0, 1027.0, 1027.0, 1027.0, 0.017919969416585527, 0.024704124504960845, 0.011491647054255694], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035", 15, 0, 0.0, 566.9333333333334, 211, 1528, 422.0, 1466.2, 1528.0, 1528.0, 0.1327104788194076, 31.918114316806452, 0.2916779332333581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-0", 12, 0, 0.0, 126.33333333333336, 104, 297, 110.5, 244.80000000000018, 297.0, 297.0, 0.056607244783878255, 0.0420684700005189, 0.028414183416907643], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=057a278a-731a-4b2b-b13c-a04b4431287c", 1, 0, 0.0, 486.0, 486, 486, 486.0, 486.0, 486.0, 486.0, 2.05761316872428, 0.37173675411522633, 1.418627829218107], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-1", 12, 0, 0.0, 146.66666666666666, 102, 342, 108.0, 341.4, 342.0, 342.0, 0.05661178468651224, 0.01514807519932066, 0.03228640845402651], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-2", 12, 0, 0.0, 126.5, 99, 334, 107.0, 268.60000000000025, 334.0, 334.0, 0.056609915226651944, 0.015258141213433532, 0.03328043844379343], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846-3", 12, 0, 0.0, 125.0, 99, 330, 107.0, 265.5000000000002, 330.0, 330.0, 0.056612853004727175, 0.01525893303643037, 0.033337451525244616], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=a0fbe459-c816-4156-adcf-2719a226f975", 1, 0, 0.0, 554.0, 554, 554, 554.0, 554.0, 554.0, 554.0, 1.8050541516245489, 0.3261084160649819, 1.2445002256317688], "isController": false}, {"data": ["https://demoqa.com/books", 55, 0, 0.0, 1209.0181818181816, 795, 1828, 1185.0, 1632.6, 1697.8, 1828.0, 0.2523155687881054, 301.85713935503554, 0.4982246875874503], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, 19.047619047619047, 1428.6190476190475, 713, 2842, 1316.0, 2235.6, 2781.599999999999, 2842.0, 0.09276847638821398, 0.02945606197817732, 0.04185452743296373], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-3", 8, 0, 0.0, 134.625, 103, 315, 111.0, 315.0, 315.0, 315.0, 0.07926835310087889, 0.021365298296721263, 0.04667853214827145], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-2", 8, 0, 0.0, 132.625, 102, 309, 108.0, 309.0, 309.0, 309.0, 0.07926678226405746, 0.02136487490710924, 0.04660019816695566], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-2", 16, 0, 0.0, 198.375, 99, 928, 109.0, 517.8000000000004, 928.0, 928.0, 0.0945978703654434, 5.343861642115563, 0.055105107102526356], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-3", 16, 0, 0.0, 188.9375, 102, 982, 108.0, 521.4000000000004, 982.0, 982.0, 0.0945978703654434, 1.7623356916286796, 0.055197487835305106], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-1", 8, 0, 0.0, 105.875, 100, 112, 106.0, 112.0, 112.0, 112.0, 0.07926678226405746, 0.02121005697299975, 0.045206836759970274], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-0", 16, 0, 0.0, 126.6875, 104, 349, 111.5, 192.90000000000015, 349.0, 349.0, 0.09459898897330535, 0.0703025689537943, 0.04748425813699116], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574-0", 8, 0, 0.0, 135.625, 104, 320, 109.0, 320.0, 320.0, 320.0, 0.07926049953929835, 0.058903554833404335, 0.03978505543281186], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244-1", 16, 0, 0.0, 160.8125, 103, 343, 108.5, 330.40000000000003, 343.0, 343.0, 0.09459898897330535, 0.034192823040766256, 0.05345443358855353], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593277574", 8, 0, 0.0, 162.75, 110, 310, 116.5, 310.0, 310.0, 310.0, 0.08385216862671112, 0.06600082804016519, 0.029806825566526213], "isController": false}, {"data": ["deleteAccount", 12, 0, 0.0, 677.4166666666667, 408, 1724, 542.5, 1477.400000000001, 1724.0, 1724.0, 0.08725813136711677, 0.015764408498941996, 0.059393474182500385], "isController": true}, {"data": ["https://demoqa.com/Account/v1/User/197b02d5-92e2-4e0e-979c-054c753a06a0", 1, 0, 0.0, 440.0, 440, 440, 440.0, 440.0, 440.0, 440.0, 2.2727272727272725, 0.7257634943181818, 1.3560901988636365], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/2e9d6973-506b-4b51-946c-8942e6031cc4", 3, 0, 0.0, 441.6666666666667, 293, 562, 470.0, 562.0, 562.0, 562.0, 0.06884365605709435, 0.030477660233609476, 0.0441477872501549], "isController": false}, {"data": ["https://demoqa.com/Account/v1/GenerateToken", 21, 0, 0.0, 1484.3809523809523, 985, 2502, 1423.0, 1861.8, 2438.999999999999, 2502.0, 0.09407042739330845, 0.04868879542817723, 0.04326872197485184], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593277574", 8, 0, 0.0, 272.625, 215, 635, 220.0, 635.0, 635.0, 635.0, 0.07917734736092004, 0.12270942408376963, 0.17807170993378793], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/e08ab18d-72c5-4360-9ec5-c6a97232f2f8", 3, 0, 0.0, 1027.6666666666667, 275, 2006, 802.0, 2006.0, 2006.0, 2006.0, 0.01852080503765897, 0.02553242491356958, 0.011876948543030005], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=659cb92e-4040-4841-94e8-aa6a2018e136", 1, 0, 0.0, 429.0, 429, 429, 429.0, 429.0, 429.0, 429.0, 2.331002331002331, 0.4211283508158508, 1.6071168414918415], "isController": false}, {"data": ["addBook", 60, 5, 8.333333333333334, 1134.75, 540, 2172, 948.5, 2089.2, 2155.75, 2172.0, 0.2872503913786582, 92.75467084845387, 1.044218756732431], "isController": true}, {"data": ["https://demoqa.com/books-0", 55, 0, 0.0, 189.8363636363636, 103, 468, 114.0, 439.4, 458.59999999999997, 468.0, 0.25336164841695036, 0.18828927191923753, 0.12247462496717816], "isController": false}, {"data": ["https://demoqa.com/books-3", 55, 0, 0.0, 688.6909090909094, 500, 1028, 646.0, 880.8, 928.7999999999996, 1028.0, 0.2530434222512583, 74.40316797424937, 0.12726304927675589], "isController": false}, {"data": ["https://demoqa.com/books-1", 55, 0, 0.0, 168.0545454545454, 98, 439, 111.0, 333.0, 360.19999999999965, 439.0, 0.2537813419957365, 0.44907401532839303, 0.12342100421277027], "isController": false}, {"data": ["https://demoqa.com/books-2", 55, 0, 0.0, 1017.6363636363637, 683, 1355, 1052.0, 1254.0, 1270.8, 1355.0, 0.252854962393571, 227.5193396333488, 0.12692133854521048], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449365035", 15, 0, 0.0, 147.1333333333333, 107, 346, 114.0, 337.0, 346.0, 346.0, 0.1312737933750492, 0.09807075383975845, 0.04666373123878703], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, 2.857142857142857, 181.81142857142865, 101, 680, 119.0, 338.20000000000005, 432.1999999999999, 653.4000000000003, 0.7260506990831017, 1.5472942618657428, 0.3506679018172012], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781593275846", 12, 0, 0.0, 132.66666666666666, 110, 301, 118.5, 248.2000000000002, 301.0, 301.0, 0.05713904787299894, 0.044249282190711094, 0.02031114592360509], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449337711", 20, 0, 0.0, 128.24999999999997, 102, 319, 115.5, 186.60000000000016, 312.7499999999999, 319.0, 0.10781554915849964, 0.08749484506905586, 0.038325058489935414], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/0e0157da-52cc-4ce2-a9f0-7760a04ddcd6", 1, 0, 0.0, 445.0, 445, 445, 445.0, 445.0, 445.0, 445.0, 2.247191011235955, 0.7176088483146067, 1.3408532303370786], "isController": false}, {"data": ["https://demoqa.com/books?book=9781593275846", 12, 0, 0.0, 277.3333333333333, 216, 637, 227.0, 579.7000000000003, 637.0, 637.0, 0.05657655279063847, 0.0876826067175227, 0.12724199323910193], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=7406a055-9fef-4f20-87a0-688727f9e5e9", 1, 0, 0.0, 517.0, 517, 517, 517.0, 517.0, 517.0, 517.0, 1.9342359767891684, 0.34944692940038685, 1.3335650386847195], "isController": false}, {"data": ["https://demoqa.com/books?book=9781491904244", 16, 0, 0.0, 373.18749999999994, 212, 1089, 240.0, 799.2000000000003, 1089.0, 1089.0, 0.09453918058165231, 7.206217880682692, 0.21110903691164132], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/4164bad8-56ba-439e-9a18-5d8de7e3cbbe", 1, 0, 0.0, 303.0, 303, 303, 303.0, 303.0, 303.0, 303.0, 3.3003300330033003, 1.0539139851485149, 1.969239892739274], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/b4734415-2584-4eb8-8d2b-1322c148f7cb", 3, 0, 0.0, 479.0, 451, 499, 487.0, 499.0, 499.0, 499.0, 0.02150059843332306, 0.025412979463345062, 0.013787818656785947], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/a0fbe459-c816-4156-adcf-2719a226f975", 3, 0, 0.0, 300.0, 221, 408, 271.0, 408.0, 408.0, 408.0, 0.033487001462265735, 0.027916735268509938, 0.021474411745007645], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/057a278a-731a-4b2b-b13c-a04b4431287c", 3, 0, 0.0, 671.3333333333334, 412, 1060, 542.0, 1060.0, 1060.0, 1060.0, 0.027747974397868955, 0.02782926729161271, 0.017794111186133412], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781491950296", 12, 0, 0.0, 117.25, 105, 136, 115.5, 135.1, 136.0, 136.0, 0.05710505903235477, 0.04734589367038008, 0.02029906395290736], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=af0ebf58-0c3d-48fe-b1f6-df1c2d1f6974", 1, 0, 0.0, 506.0, 506, 506, 506.0, 506.0, 506.0, 506.0, 1.976284584980237, 0.35704360177865613, 1.3625555830039526], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Book?ISBN=9781449325862", 16, 0, 0.0, 115.25, 101, 143, 114.5, 129.0, 143.0, 143.0, 0.08898726925879166, 0.0690867959577533, 0.0316321933693361], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=6578e5e4-b25e-4478-b99c-05c75581ddc0", 1, 0, 0.0, 407.0, 407, 407, 407.0, 407.0, 407.0, 407.0, 2.457002457002457, 0.44389204545454547, 1.6939880221130221], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books?UserId=2748ffb1-be1e-4f9c-a387-a62ac45356a7", 1, 0, 0.0, 549.0, 549, 549, 549.0, 549.0, 549.0, 549.0, 1.8214936247723132, 0.3290784380692167, 1.2558344717668488], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-0", 15, 0, 0.0, 124.0, 100, 319, 110.0, 205.00000000000006, 319.0, 319.0, 0.13426663563615532, 0.09978213839757245, 0.06739555734080452], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-1", 15, 0, 0.0, 191.93333333333334, 101, 344, 115.0, 333.2, 344.0, 344.0, 0.13426062672860556, 0.0762558403372627, 0.07431535471657581], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-2", 15, 0, 0.0, 400.6666666666667, 100, 1310, 303.0, 1248.8, 1310.0, 1310.0, 0.13283975982571422, 23.934533452926015, 0.07581206605678456], "isController": false}, {"data": ["https://demoqa.com/books?book=9781449365035-3", 15, 0, 0.0, 298.9333333333334, 97, 921, 110.0, 907.2, 921.0, 921.0, 0.1333961777548534, 7.8733446368066735, 0.07625988521258904], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["406/Not Acceptable", 4, 40.0, 0.3103180760279286], "isController": false}, {"data": ["Test failed: code expected to contain /200/", 1, 10.0, 0.07757951900698215], "isController": false}, {"data": ["401/Unauthorized", 5, 50.0, 0.3878975950349108], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 1289, 10, "401/Unauthorized", 5, "406/Not Acceptable", 4, "Test failed: code expected to contain /200/", 1, "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User/", 5, 1, "Test failed: code expected to contain /200/", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/Account/v1/User", 21, 4, "406/Not Acceptable", 4, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["https://demoqa.com/BookStore/v1/Books", 175, 5, "401/Unauthorized", 5, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
